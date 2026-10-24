#!/usr/bin/env node
'use strict';

/**
 * alysiscode-bulk-apikey CLI — mint Alysis Code accounts, one gateway key per
 * account, and keep only the keys that survived a live chat call.
 *
 * Alysis Code is an Apache-2.0 CLI coding agent whose hosted tier runs behind a
 * Supabase project. There is no panel and no `/api/status`: the account surface
 * is Supabase auth plus three edge functions, and the key the CLI finally holds
 * (`slk_…`) is only handed out by the device-code flow.
 *
 * Flow, per account, every provider request through one pinned exit from your pool:
 *   1. mailbox    Emailnator `POST /api/generate-email` → fresh @gmail.com
 *                 (registered in the dot-free plain form — dots are rejected input)
 *   2. captcha    Turnstile token for **action=signup** (see --captcha-cmd)
 *   3. signup     `POST /auth/v1/signup` {email, password, data, gotrue_meta_security.captcha_token}
 *                 → 200 without a session: `mailer_autoconfirm=false`, the account
 *                 stays inert until the confirmation link is opened
 *   4. read       poll Emailnator; the mail comes from `noreply@<panel-mail>`,
 *                 subject `Confirm your email for Alysis Code`, and carries
 *                 `…/auth/confirm#token_hash=<hex>&type=email`
 *   5. verify     `POST /auth/v1/verify` {type:'email', token_hash} → session JWT
 *   6. device     `POST /functions/v1/device-code` → {device_code, user_code}
 *   7. approve    Turnstile token for **action=device_approve** (a signup or
 *                 action-less token is refused with `403 Verification failed`),
 *                 then `POST /functions/v1/device-approve` {user_code, captcha_token}
 *                 with the session JWT
 *   8. key        `POST /functions/v1/device-token` {device_code} → `slk_…`
 *   9. gate       `POST /functions/v1/llm/v1/chat/completions` → 200 with content
 *                 or reasoning content = keep. The session JWT does NOT work on the
 *                 gateway: it answers `401 Missing Alysis key`.
 *
 * A key is appended to `keys.txt` only after step 9 answers 200 with content or
 * reasoning content. Rejected attempts go to `accounts.jsonl` with the reason.
 *
 * Measured gates worth knowing before you scale:
 *   · a successful sign-up is capped **per IP** — after ~13 accounts from one
 *     exit Supabase answers `403 We could not create an account with these
 *     details` and keeps answering it; another exit registers on the first try.
 *     That is the exit, not the address: this CLI burns it (see --cooldown).
 *   · the captcha is Turnstile and it is **action-scoped**; an action-less token
 *     passes Cloudflare but `device-approve` rejects it with `403 Verification
 *     failed. Complete a new challenge and try again.`
 *   · the token must be produced by the same exit that then spends it.
 *
 * Options:
 *   --count N        accounts (= keys) to mint                          [1]
 *   --pool <file>    proxy list, one exit per line (env ALYSISCODE_PROXIES) [optional]
 *   --captcha-cmd S  command that prints one Turnstile token     [env ANALYSISCODE_CAPTCHA_CMD]
 *   --model <id>     model used for the live gate              [deepseek-flash]
 *   --alt-models L   comma list tried after --model      [glm-5.3-flash,gpt-6-luna]
 *   --exits N        exits tried per account before giving up              [6]
 *   --addr-tries N   addresses tried per exit (address-side failures)      [3]
 *   --cooldown MIN   minutes an exit stays out after a sign-up throttle    [15]
 *   --timeout MS     per-request timeout                               [60000]
 *   --verify-only    re-run every key in keys.txt through the chat gate
 *   --screen         only test the proxy list against the Supabase settings endpoint
 *   --connect-9router  register keys.txt with a local 9Router (published repo)
 *   --help
 *
 * Zero dependencies. Node.js >= 18. The proxy list is OPTIONAL: pass --pool (or
 * ALYSISCODE_PROXIES) and every request for an account goes through one pinned
 * exit, fail-closed — a pool that yields no reachable exit fails the run instead
 * of leaking a request from your own address. Without a pool the tool connects
 * directly; the sign-up cap is then yours, so a direct run is a smoke test.
 *
 * CAPTCHA. Alysis gates signup, login and device-approve behind Cloudflare
 * Turnstile (sitekey 0x4AAAAAAFCGJnIFvPtF_pgs). This CLI does not ship a browser:
 * pass --captcha-cmd and it is invoked once per token, in a headed browser of
 * your own, with these placeholders substituted:
 *
 *   {action}     signup | device_approve
 *   {url}        https://alysiscode.com/signup | https://alysiscode.com/activate
 *   {label}      unique label for this token
 *   {proxy}      the pinned exit line (empty in direct mode)
 *   {tokenfile}  file to write the token into
 *
 * The command must print the token on stdout or write it to {tokenfile}. Tokens
 * are single-use: the flow spends each one immediately after it is minted.
 *
 *   --captcha-cmd "node .solverfix-act2.js --url {url} --sitekey 0x4AAAAAAFCGJnIFvPtF_pgs \
 *        --proxy {proxy} --action {action} --targets both --rounds 7 --mode render \
 *        --headed --label {label}"
 *
 * (`.solverfix-act2.js` is the headed Chrome recipe this project proved: mount the
 * widget yourself, click its host box with real mouse events, read
 * `cf-turnstile-response`. Headless --mount solving failed on this sitekey.)
 */

const fs = require('fs');
const path = require('path');
const net = require('net');
const tls = require('tls');
const http = require('http');
const crypto = require('crypto');
const { execSync } = require('child_process');
const { solveCaptcha: solveWithBrowser } = require('./solver.js');

const ROOT = path.basename(__dirname) === 'src' ? path.resolve(__dirname, '..') : __dirname;
const KEYS_FILE = path.join(ROOT, 'keys.txt');
const ACCOUNTS_FILE = path.join(ROOT, 'accounts.jsonl');
const OUT_DIR = path.join(ROOT, 'out');
const DEAD_FILE = path.join(ROOT, 'keys-dead.txt');
/** Dead keys from the last verify run (one `key<TAB># reason` per line). */
const writeDead = (dead) => fs.writeFileSync(DEAD_FILE, dead.map((d) => `${d.key}\t# ${d.why}`).join('\n') + (dead.length ? '\n' : ''));

/** Supabase project behind alysiscode.com; the anon key is the public client key. */
const SUPA = process.env.ALYSISCODE_SUPABASE_URL || 'https://vzigujbcjjmpntxhmyvr.supabase.co';
const ANON = process.env.ALYSISCODE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aWd1amJjamptcG50eGhteXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Mzc0NTIsImV4cCI6MjA5NjUxMzQ1Mn0.vLH9q-BNO8IWIZrVlvCw8pZWXdLgmKG4Tl9toTTD3pg';
const SITE = 'https://alysiscode.com';
const FN = `${SUPA}/functions/v1`;
const GW = `${FN}/llm/v1`;
const SITEKEY = process.env.ALYSISCODE_TURNSTILE_SITEKEY || '0x4AAAAAAFCGJnIFvPtF_pgs';
const EMAILNATOR = 'https://www.emailnator.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const BRAND = /alysisai|alysis code|supabase/i;
const CODE_WORDS = /confirm|verify|activation|alysis/i;

// ------------------------------------------------------------------- options
const argv = process.argv.slice(2);
function arg(name, dflt) {
  const eq = argv.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.slice(name.length + 3);
  const i = argv.indexOf(`--${name}`);
  if (i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--')) return argv[i + 1];
  return dflt;
}
const has = (name) => argv.includes(`--${name}`) || argv.includes(`-${name}`);

if (has('help') || has('h')) {
  console.log(`alysiscode-bulk-apikey — mint Alysis Code accounts, one gateway key each, verified by a live chat call.

  node src/cli.js --auto --count 1              mint (a key is kept only after a chat 200)
  node src/cli.js --verify-only                 re-check every key in keys.txt
  node src/cli.js --screen                      test your proxy list against the Supabase settings endpoint
  node src/cli.js --connect-9router             register keys.txt with a local 9Router
  node src/cli.js --help

  --count N          accounts to mint                                        [1]
  --model <id>       model used for the live gate              [deepseek-flash]
  --alt-models L     comma list tried after --model  [glm-5.3-flash,gpt-6-luna]
  --pool <file>      proxy list, one exit per line (env ALYSISCODE_PROXIES)  [optional]
  --auto             solve the Turnstile with the embedded src/solver.js       [on]
  --exits N          exits tried per account before giving up                  [6]
  --addr-tries N     addresses tried per exit                                 [3]
  --cooldown MIN     minutes an exit stays out after a sign-up throttle       [15]
  --timeout MS       per-request timeout                                  [60000]

Registration is guarded by Cloudflare Turnstile. The bundled src/solver.js solves
it automatically (--auto is the default) — no external command is needed. Advanced
escape hatches live in ADVANCED.md.

Requests go through the exits in your proxy list when one is provided (--pool or
the ALYSISCODE_PROXIES env) and the run FAILS CLOSED if none of them reach the
service. Without a pool the tool connects DIRECTLY — and Supabase throttles
sign-ups per IP (measured: ~13 accounts from one exit, then 403), so a direct run
is a single-account smoke test.`);
  process.exit(0);
}

const COUNT = Math.max(1, parseInt(arg('count', '1'), 10) || 1);
const EXITS = Math.max(1, parseInt(arg('exits', '6'), 10) || 6);
const ADDR_TRIES = Math.max(1, parseInt(arg('addr-tries', '3'), 10) || 3);
const COOLDOWN_MS = Math.max(0, (parseInt(arg('cooldown', '15'), 10) || 0) * 60000);
const TIMEOUT_MS = Math.max(5000, parseInt(arg('timeout', '60000'), 10) || 60000);
const CAPTCHA_TIMEOUT_MS = Math.max(30000, (parseInt(arg('captcha-timeout', '420'), 10) || 420) * 1000);
const MODEL = arg('model', 'deepseek-flash');
const ALT_MODELS = arg('alt-models', 'glm-5.3-flash,gpt-6-luna').split(',').map((s) => s.trim()).filter(Boolean);
const CAPTCHA_CMD = arg('captcha-cmd', process.env.ANALYSISCODE_CAPTCHA_CMD || process.env.ALYSISCODE_CAPTCHA_CMD || '');
const VERIFY_ONLY = has('verify-only');
const SCREEN = has('screen');
const CONNECT_ROUTER = has('connect-9router');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT_DIR, { recursive: true });
const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);
const randPass = () => `Al${crypto.randomBytes(6).toString('base64url')}!7x`;

// ------------------------------------------------------------------- proxy
function parseProxy(line) {
  const s = String(line || '').trim();
  if (!s || s.startsWith('#')) return null;
  let m = s.match(/^(https?|socks5h?|socks4):\/\/(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)/i);
  if (!m) m = s.match(/^(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)$/);
  if (!m) return null;
  if (m.length === 6) {
    const raw = m[1].toLowerCase();
    if (raw === 'socks4') return null;
    return { protocol: raw.startsWith('socks') ? 'socks5' : 'http', host: m[4], port: Number(m[5]), auth: m[2] ? `${m[2]}:${m[3]}` : null, line: s };
  }
  return { protocol: 'http', host: m[3], port: Number(m[4]), auth: m[1] ? `${m[1]}:${m[2]}` : null, line: s };
}

function directConnect(host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host, port });
    const t = setTimeout(() => { sock.destroy(); reject(new Error(`connect timeout (${host}:${port})`)); }, timeoutMs);
    sock.once('error', (e) => { clearTimeout(t); try { sock.destroy(); } catch { /* */ } reject(new Error(`connect failed: ${e.message}`)); });
    sock.once('connect', () => { clearTimeout(t); resolve(sock); });
  });
}

function connectThrough(proxy, host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host: proxy.host, port: proxy.port });
    const t = setTimeout(() => { sock.destroy(); reject(new Error(`proxy timeout (${proxy.host}:${proxy.port})`)); }, timeoutMs);
    const done = (err, s) => { clearTimeout(t); if (err) { try { sock.destroy(); } catch { /* */ } reject(err); } else resolve(s); };
    sock.once('error', (e) => done(new Error(`proxy connect failed: ${e.message}`)));
    sock.once('connect', () => {
      if (proxy.protocol === 'socks5') {
        sock.write(proxy.auth ? Buffer.from([5, 2, 0, 2]) : Buffer.from([5, 1, 0]));
        let stage = 0;
        let buf = Buffer.alloc(0);
        const sendConnect = () => {
          const hb = Buffer.from(host);
          sock.write(Buffer.concat([Buffer.from([5, 1, 0, 3, hb.length]), hb, Buffer.from([port >> 8, port & 0xff])]));
        };
        const onData = (d) => {
          try {
            buf = Buffer.concat([buf, d]);
            for (;;) {
              if (stage === 0) {
                if (buf.length < 2) return;
                const v = buf; buf = buf.slice(2);
                if (v[0] !== 5) return done(new Error('SOCKS5 bad version'));
                if (v[1] === 2) {
                  if (!proxy.auth) return done(new Error('SOCKS5 auth required'));
                  const [u, p] = proxy.auth.split(':');
                  sock.write(Buffer.concat([Buffer.from([1, u.length]), Buffer.from(u), Buffer.from([p.length]), Buffer.from(p)]));
                  stage = 1;
                  continue;
                }
                if (v[1] !== 0) return done(new Error('SOCKS5 no acceptable method'));
                stage = 2; sendConnect(); continue;
              }
              if (stage === 1) {
                if (buf.length < 2) return;
                const v = buf; buf = buf.slice(2);
                if (v[1] !== 0) return done(new Error('SOCKS5 auth failed'));
                stage = 2; sendConnect(); continue;
              }
              if (stage === 2) {
                if (buf.length < 5) return;
                const atyp = buf[3];
                const need = 4 + (atyp === 1 ? 4 : atyp === 3 ? 1 + buf[4] : 16) + 2;
                if (buf.length < need) return;
                const rep = buf[1]; buf = buf.slice(need);
                if (rep !== 0) return done(new Error(`SOCKS5 connect failed (code ${rep})`));
                sock.off('data', onData);
                return done(null, sock);
              }
            }
          } catch (e) { done(e); }
        };
        sock.on('data', onData);
        return;
      }
      const auth = proxy.auth ? `Proxy-Authorization: Basic ${Buffer.from(proxy.auth).toString('base64')}\r\n` : '';
      sock.write(`CONNECT ${host}:${port} HTTP/1.1\r\nHost: ${host}:${port}\r\n${auth}\r\n`);
      let buf = '';
      const onData = (d) => {
        buf += d;
        if (!buf.includes('\r\n\r\n')) return;
        sock.off('data', onData);
        if (!/^HTTP\/\d(\.\d)? 200/.test(buf)) return done(new Error(`proxy CONNECT refused: ${buf.split('\r\n')[0]}`));
        done(null, sock);
      };
      sock.on('data', onData);
    });
  });
}

async function exitFetch(proxy, url, { method = 'GET', headers = {}, body = null, timeoutMs = TIMEOUT_MS } = {}) {
  const u = new URL(url);
  const raw = proxy ? await connectThrough(proxy, u.hostname, u.port || 443, timeoutMs) : await directConnect(u.hostname, u.port || 443, timeoutMs);
  const sock = tls.connect({ socket: raw, servername: u.hostname });
  await new Promise((res, rej) => { sock.once('secureConnect', res); sock.once('error', rej); });
  const chunks = [];
  let resolve, reject;
  const p = new Promise((res, rej) => { resolve = res; reject = rej; });
  const req = http.request({ method, path: u.pathname + u.search, createConnection: () => sock, headers: { host: u.host, 'user-agent': UA, accept: '*/*', ...headers } });
  const t = setTimeout(() => { try { req.destroy(); } catch { /* */ } reject(new Error('request timeout')); }, timeoutMs);
  req.on('response', (res) => {
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => { clearTimeout(t); resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') }); });
  });
  req.on('error', (e) => { clearTimeout(t); reject(e); });
  if (body != null) req.write(Buffer.isBuffer(body) ? body : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body)));
  req.end();
  return p;
}

async function exitJson(proxy, url, opts = {}) {
  const headers = { ...(opts.headers || {}), apikey: ANON };
  const body = opts.body;
  if (body != null && !Buffer.isBuffer(body)) headers['content-type'] = 'application/json';
  const r = await exitFetch(proxy, url, { ...opts, headers });
  let json = null;
  try { json = JSON.parse(r.body); } catch { /* not json */ }
  return { status: r.status, json, text: r.body };
}

function loadExits() {
  const poolArg = arg('pool', process.env.ALYSISCODE_PROXIES || 'proxies.txt');
  const poolFile = fs.existsSync(path.resolve(poolArg)) ? path.resolve(poolArg) : path.resolve(ROOT, poolArg);
  if (!fs.existsSync(poolFile)) {
    console.log(`no proxy list at ${poolFile} — running WITHOUT a proxy (direct). Put exits there (or pass --pool) to route through them.`);
    return [null];
  }
  const exits = fs.readFileSync(poolFile, 'utf8').split(/\r?\n/).map(parseProxy).filter(Boolean);
  if (!exits.length) throw new Error(`${poolFile} has no usable exits — refusing to run (fail-closed).`);
  return exits;
}
/** A dead exit, not a panel verdict — the flow rotates to the next candidate. */
const isExitError = (e) =>
  /proxy connect failed|proxy CONNECT refused|proxy timeout|connect timeout|connect failed|ETIMEDOUT|ECONNREFUSED|ECONNRESET|ECONNABORTED|EPIPE|ENETUNREACH|EHOSTUNREACH|EAI_AGAIN|socket hang up|secureConnect|TLS|handshake/i.test(
    String((e && e.message) || e),
  );

/** `host:port` of the exit in play, or `direct` when the pool is empty. */
const exitLabel = (e) => (e ? `${e.host}:${e.port}` : 'direct');


async function screen(exits) {
  let ok = 0;
  const limited = exits.slice(0, 64);
  for (const e of limited) {
    try {
      const t0 = Date.now();
      const r = await exitFetch(e, `${SUPA}/auth/v1/settings`, { timeoutMs: 20000 });
      const good = r.status === 200 && /"email":true/.test(r.body);
      if (good) ok++;
      console.log(`  ${good ? 'OK ' : 'ERR'} ${e ? `${e.host}:${e.port}` : 'direct'} status=${r.status} ${Date.now() - t0}ms`);
    } catch (err) {
      console.log(`  ERR ${e ? `${e.host}:${e.port}` : 'direct'} ${String(err.message).slice(0, 80)}`);
    }
  }
  console.log(`screened ${limited.length} exit(s): ${ok} reach ${SUPA}`);
  return ok;
}
// ------------------------------------------------------------------- mail
const stripStyle = (html) => String(html || '').replace(/<style[\s\S]*?<\/style>/gi, ' ');
const stripTags = (html) => stripStyle(html).replace(/<[^>]+>/g, ' ').replace(/&nbsp;?/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

async function newMailbox(exit) {
  const r = await exitJson(exit, `${EMAILNATOR}/api/generate-email`, { method: 'POST', body: { ids: [3] }, headers: { origin: EMAILNATOR, referer: `${EMAILNATOR}/` } });
  const dotted = r.json && r.json.email;
  if (!dotted || !/@gmail\.com$/i.test(dotted)) throw new Error(`emailnator generate ${r.status}: ${String(r.text).slice(0, 120)}`);
  const [local, domain] = dotted.split('@');
  return { dotted, plain: `${local.replace(/\./g, '')}@${domain}` };
}

async function inboxIds(exit, plain) {
  const r = await exitJson(exit, `${EMAILNATOR}/api/message-list`, { method: 'POST', body: { email: plain, limit: 15 }, headers: { origin: EMAILNATOR, referer: `${EMAILNATOR}/` } });
  if (!r.json) throw new Error(`emailnator list ${r.status}: ${String(r.text).slice(0, 120)}`);
  return (r.json.messages || []).map((m) => ({ id: String(m.id), from: String(m.from || ''), subject: String(m.subject || '') }));
}

async function readMail(exit, id) {
  const r = await exitJson(exit, `${EMAILNATOR}/api/message/${encodeURIComponent(id)}`, { headers: { origin: EMAILNATOR, referer: `${EMAILNATOR}/` } });
  return String((r.json && r.json.content) || '');
}

/** Watch the shared public inbox for the provider's own confirmation mail. */
async function pollConfirm(exit, plain, baseline, timeoutMs = 150000) {
  const seen = new Set(baseline);
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    let list = [];
    try { list = await inboxIds(exit, plain); } catch (e) { log(`  inbox poll: ${e.message}`); }
    for (const m of list) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      if (!BRAND.test(`${m.from} ${m.subject}`)) continue;
      const html = (await readMail(exit, m.id)).replace(/&amp;/g, '&');
      const hit = /token_hash=([0-9a-f]{20,})/i.exec(html) || /token=([0-9a-f]{20,})/i.exec(html);
      if (hit) return { tokenHash: hit[1], subject: m.subject, from: m.from };
    }
    await sleep(9000);
  }
  throw new Error('no confirmation mail within timeout (the shared inbox may already have been used)');
}

// ------------------------------------------------------------------- captcha
/**
 * One Turnstile token for one action. Alysis is behind Turnstile on signup,
 * login and device-approve, and the edge function checks the token's action, so
 * a token minted for `signup` is refused by `device-approve`.
 */
async function solveCaptcha(action, page, exit, tag, attempt) {
  const label = `alysis-${tag}-${action === 'signup' ? 'su' : 'ap'}-${attempt}`;
  if (!CAPTCHA_CMD) {
    // Embedded rail (default): src/solver.js drives a real, headed Chrome over
    // the account's pinned exit. The panel is action-scoped, so the token is read
    // off the page whose widget carries the right action.
    const r = await solveWithBrowser({ type: 'turnstile', sitekey: SITEKEY, url: page, proxy: exit ? exit.line : null });
    const tok = r && r.token;
    if (!tok) throw new Error('CAPTCHA_FAILED: the embedded solver returned no token');
    return tok;
  }
  const tokenfile = path.join(OUT_DIR, `.turnstile-${label}.txt`);
  try { fs.unlinkSync(tokenfile); } catch { /* */ }
  const cmd = CAPTCHA_CMD
    .replace(/\{action\}/g, action)
    .replace(/\{url\}/g, page)
    .replace(/\{label\}/g, label)
    .replace(/\{proxy\}/g, exit ? exit.line : '')
    .replace(/\{tokenfile\}/g, tokenfile);
  let out = '';
  try {
    out = execSync(cmd, { cwd: ROOT, timeout: CAPTCHA_TIMEOUT_MS, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    out = String((e && (e.stdout || e.message)) || '');
  }
  let tok = '';
  try { tok = fs.readFileSync(tokenfile, 'utf8').trim(); } catch { /* */ }
  if (!tok) {
    const m = String(out).match(/(?:TOKEN\s+)?([A-Za-z0-9._-]{80,})/);
    if (m) tok = m[1];
  }
  return tok;
}

// ------------------------------------------------------------------- account
async function signupAccount(exit, idx) {
  let lastReason = 'no attempt';
  for (let a = 0; a < ADDR_TRIES; a++) {
    const box = await newMailbox(exit);
    const password = randPass();
    const baseline = (await inboxIds(exit, box.plain).catch(() => [])).map((m) => m.id);
    const t0 = Date.now();
    const cap = await solveCaptcha('signup', `${SITE}/signup`, exit, `${idx}${a}`, 0);
    if (!cap) { lastReason = 'captcha: no signup token'; log(`  address ${box.plain}: ${lastReason} (${Date.now() - t0}ms)`); continue; }

    const sup = await exitJson(exit, `${SUPA}/auth/v1/signup`, {
      method: 'POST',
      body: { email: box.plain, password, data: { full_name: 'Alysis User', marketing_opt_in: false }, gotrue_meta_security: { captcha_token: cap } },
    });
    if (sup.status === 403 && /could not create an account/i.test(sup.text)) {
      const e = new Error('EXIT_THROTTLED: sign-ups from this exit are blocked');
      e.exitThrottled = true;
      throw e;
    }
    if (sup.status >= 300) {
      lastReason = `signup ${sup.status} ${String(sup.text).slice(0, 120)}`;
      log(`  address ${box.plain}: ${lastReason}`);
      continue;
    }
    const uid = (sup.json && (sup.json.id || (sup.json.user && sup.json.user.id))) || null;

    let conf;
    try { conf = await pollConfirm(exit, box.plain, baseline); } catch (e) { lastReason = e.message; log(`  address ${box.plain}: ${lastReason}`); continue; }
    const ver = await exitJson(exit, `${SUPA}/auth/v1/verify`, { method: 'POST', body: { type: 'email', token_hash: conf.tokenHash } });
    const session = ver.json && ver.json.access_token;
    if (!session) { lastReason = `verify ${ver.status} ${String(ver.text).slice(0, 100)}`; log(`  address ${box.plain}: ${lastReason}`); continue; }

    const dc = await exitJson(exit, `${FN}/device-code`, { method: 'POST', body: { client_name: 'alysis-cli', installation_id: crypto.randomUUID() } });
    const ucode = dc.json && dc.json.user_code;
    const dcode = dc.json && dc.json.device_code;
    if (!ucode || !dcode) { lastReason = `device-code ${dc.status} ${String(dc.text).slice(0, 100)}`; log(`  address ${box.plain}: ${lastReason}`); continue; }

    let approved = false;
    for (let at = 0; at < 3 && !approved; at++) {
      const capA = await solveCaptcha('device_approve', `${SITE}/activate`, exit, `${idx}${a}`, at);
      if (!capA) { log('  captcha: no device_approve token'); continue; }
      const ap = await exitJson(exit, `${FN}/device-approve`, { method: 'POST', body: { user_code: ucode, captcha_token: capA }, headers: { authorization: `Bearer ${session}` } });
      if (ap.status < 300 && ap.json && ap.json.status === 'approved') { approved = true; break; }
      log(`  device-approve ${ap.status} ${String(ap.text).slice(0, 90)}`);
      if (ap.status === 429) await sleep(30000);
    }
    if (!approved) { lastReason = 'device-approve failed (a fresh action-scoped token is required)'; log(`  address ${box.plain}: ${lastReason}`); continue; }

    const dt = await exitJson(exit, `${FN}/device-token`, { method: 'POST', body: { device_code: dcode } });
    const key = dt.json && dt.json.key;
    if (!key) { lastReason = `device-token ${dt.status} ${String(dt.text).slice(0, 100)}`; log(`  address ${box.plain}: ${lastReason}`); continue; }
    return { email: box.plain, password, uid, key };
  }
  throw new Error(lastReason);
}

async function chatGate(exit, key, model) {
  const r = await exitJson(exit, `${GW}/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}` },
    body: { model, messages: [{ role: 'user', content: 'Reply with exactly: PONG' }], max_tokens: 24 },
  });
  const msg = (r.json && r.json.choices && r.json.choices[0] && r.json.choices[0].message) || {};
  const ok = r.status === 200 && !!(String(msg.content || '').trim() || String(msg.reasoning_content || '').trim());
  return { ok, status: r.status, sample: String(msg.content || msg.reasoning_content || r.text).slice(0, 120) };
}

// ------------------------------------------------------------------- files
const readKeys = () => {
  try { return fs.readFileSync(KEYS_FILE, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('#')); } catch { return []; }
};
function appendKey(key) { fs.appendFileSync(KEYS_FILE, `${key}\n`); }
function recordAccount(rec) { fs.appendFileSync(ACCOUNTS_FILE, `${JSON.stringify(rec)}\n`); }

// ------------------------------------------------------------------- mint
/** A throttled exit is dead for the cooldown window: the sign-up cap is per IP. */
const burns = new Map();
const exitUsable = (e) => (burns.get(e ? e.line : 'direct') || 0) < Date.now();

async function mint() {
  const exits = loadExits();
  if (SCREEN) return void (await screen(exits));
  log(`alysis · ${COUNT} key(s) · exits ${exits.filter(Boolean).length || 'direct'} · cooldown ${COOLDOWN_MS / 60000}min · keys land in ${KEYS_FILE}`);
  let made = 0;
  const routes = exits[0] === null ? 1 : EXITS;
  let transportDead = 0;
  for (let i = 0; i < COUNT; i++) {
    let lastErr = null;
    let lastWasExit = false;
    for (let a = 0; a < routes; a++) {
      const pool = exits.filter(exitUsable);
      if (!pool.length) { lastErr = new Error('every exit in the pool is cooling down after a sign-up throttle'); break; }
      const exit = pool[(i + a) % pool.length];
      lastWasExit = false;
      try {
        const rec = await signupAccount(exit, `${i}${a}`);
        let live = null;
        let gate = null;
        for (const model of [MODEL, ...ALT_MODELS]) {
          try { gate = await chatGate(exit, rec.key, model); } catch (e) { gate = { ok: false, status: 0, sample: e.message }; }
          if (gate.ok) { live = model; break; }
        }
        const base = { at: new Date().toISOString(), email: rec.email, password: rec.password, uid: rec.uid, exit: exit ? `${exit.host}:${exit.port}` : 'direct' };
        if (!live) {
          recordAccount({ ...base, key_masked: `${rec.key.slice(0, 12)}...`, gate: gate ? gate.status : null, sample: gate ? gate.sample : '', kept: false });
          lastErr = new Error(`chat gate ${gate ? gate.status : '?'}`);
          continue;
        }
        appendKey(rec.key);
        recordAccount({ ...base, base_url: GW, model: live, gate: 200, kept: true });
        made++;
        log(`account ${i + 1} OK chat-200 ${live} · ${rec.key.slice(0, 12)}...`);
        break;
      } catch (e) {
        lastErr = e;
        lastWasExit = isExitError(e);
        if (lastWasExit) {
          const where = exit ? `exit ${a + 1}/${routes} ${exitLabel(exit)}` : `direct attempt ${a + 1}/${routes}`;
          log(`account ${i + 1}: ${where} dead (${String(e.message).slice(0, 70)})${exit ? ' → next exit' : ''}`);
        }
        if (e.exitThrottled) {
          burns.set(exit ? exit.line : 'direct', Date.now() + COOLDOWN_MS);
          log(`exit ${exit ? `${exit.host}:${exit.port}` : 'direct'} throttled — cooling down ${COOLDOWN_MS / 60000}min, next exit`);
        }
      }
    }
    if (lastWasExit) transportDead++;
    if (lastErr) log(`account ${i + 1}: ${String(lastErr.message).slice(0, 160)}`);
  }
  log(`done — ${made}/${COUNT} key(s) written to ${KEYS_FILE}`);
  if (!made && transportDead === COUNT) {
    const route = exits[0] === null ? 'direct mode (no proxy list)' : `${exits.length}-exit pool`;
    console.error(`[fatal] no usable route — ${COUNT} account(s) × ${routes} candidate(s) over ${route}: every attempt died at the transport layer.`);
    process.exit(1);
  }
  if (made < COUNT) process.exitCode = 1;
}

async function verifyOnly() {
  const exits = loadExits();
  const usable = exits.filter(exitUsable);
  const keys = readKeys();
  if (!keys.length) { console.log(`no keys in ${KEYS_FILE}`); process.exit(0); }
  let live = 0;
  const dead = [];
  for (let i = 0; i < keys.length; i++) {
    const exit = usable.length ? usable[i % usable.length] : null;
    try {
      const g = await chatGate(exit, keys[i], MODEL);
      if (g.ok) live++;
      else dead.push({ key: keys[i], why: `chat ${g.status}` });
      console.log(`  ${g.ok ? 'OK ' : 'ERR'} ${keys[i].slice(0, 12)}... chat=${g.status}`);
    } catch (e) {
      dead.push({ key: keys[i], why: String(e.message).slice(0, 90) });
      console.log(`  ERR ${keys[i].slice(0, 12)}... ${String(e.message).slice(0, 90)}`);
    }
  }
  writeDead(dead);
  console.log(`verify: ${live}/${keys.length} keys live on ${MODEL}`);
  process.exit(live === keys.length ? 0 : 1);
}

async function connectRouter() {
  let mod;
  try { mod = require('./connect-9router.js'); }
  catch {
    console.error('connect-9router.js is not next to this CLI — run --connect-9router from the published repo (src/cli.js).');
    process.exit(1);
  }
  const keys = readKeys();
  if (!keys.length) { console.error(`no keys in ${KEYS_FILE} — mint some first.`); process.exit(1); }
  await mod.connectKeysFile({ keysFile: KEYS_FILE, base: arg('base', undefined), password: arg('password', undefined), apiKey: arg('api-key', undefined) });
}

(CONNECT_ROUTER ? connectRouter() : VERIFY_ONLY ? verifyOnly() : mint())
  .catch((e) => { console.error('[fatal]', e.message); process.exit(1); });
