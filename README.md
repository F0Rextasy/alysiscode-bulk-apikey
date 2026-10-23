<div align="center">

```
 █████╗ ██╗  ██╗   ██╗███████╗██╗███████╗ ██████╗ ██████╗ ██████╗ ███████╗
██╔══██╗██║  ╚██╗ ██╔╝██╔════╝██║██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝
███████║██║   ╚████╔╝ ███████╗██║███████╗██║     ██║   ██║██║  ██║█████╗
██╔══██║██║    ╚██╔╝  ╚════██║██║╚════██║██║     ██║   ██║██║  ██║██╔══╝
██║  ██║███████╗██║   ███████║██║███████║╚██████╗╚██████╔╝██████╔╝███████╗
╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
```

# alysiscode-bulk-apikey

**Bulk-create Alysis Code accounts and mint one hosted gateway key per account (slk_...) — OpenAI-compatible inference behind the Alysis Code LLM gateway, plus a 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](undefined)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-undefined-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

Alysis Code is an Apache-2.0 CLI coding agent (`pipx install alysis-code`) whose hosted tier runs behind a Supabase project — there is **no panel and no `/api/status`** to gate on. The account surface is Supabase auth plus three edge functions, and the credential the product itself uses is a device-flow gateway key (`slk_...`) for an OpenAI-compatible proxy. Every account carries a recurring **free allowance (50 credits / 30 days)**, so one account = one key = one free quota. Proven by minting **10 accounts → 10 verified keys** and re-proving them with the published CLI (`--verify-only`: **10/10 chat-200**).

## 🎁 Free tier — how much you get

| What | Value |
| --- | --- |
| Free allowance | **50 credits every 30 days** per account (`100 credits = $1` of usage; refill counts from the last refill, unused credits do not carry over) |
| Card | **none required** |
| Hosted models | DeepSeek V4.1 Flash, GLM 5.3 Flash, GPT-6 Luna, Claude Haiku 5.5 — one shared balance |
| Rolling caps | 25 base credits / 5 h and 50 / 7 d on the free plan |
| Peak pricing | Mon-Fri 01:00-04:00 & 06:00-10:00 UTC double the rates |
| The unit that scales | **one account = one key** |
| Sign-up throttle | a successful sign-up is capped **per IP** — measured: ~13 accounts from one exit, then `403 We could not create an account with these details` until the exit changes |

> 💡 The free tier is set by Alysis Code and can change. Check the live numbers at [alysiscode.com](https://alysiscode.com) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all undefined of them

## 🧪 How to use the API

The base URL is **\`https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1\`** — OpenAI-compatible, so anything that speaks OpenAI works (SDKs, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Quick start

### 🖱️ The launcher

## ✅ Verified working — every key is tested

> **Quality gates.** Every key here passed a live `chat-200` before it was written to `keys.txt`
> (dead keys are never shipped). Router combos follow the same rule at the model level: an entry is
> added **only if the model answers `chat-200` and can call tools** — a model without tool support,
> a dead key or a dead provider is dropped instead of added. Works with **9Router and OmniRoute**.

| Check | Result |
| --- | --- |
| `GET {supa}/auth/v1/settings` | **200** — `email: true`, `disable_signup: false`, `mailer_autoconfirm: false` |
| `POST {supa}/auth/v1/signup` without a captcha token | **400** `captcha_failed` |
| `POST {supa}/auth/v1/signup` with an action=`signup` token | **200** (no session — the confirmation mail is required) |
| confirmation mail | `noreply@<panel-mail>`, `Confirm your email for Alysis Code`, link `.../auth/confirm#token_hash=<hex>&type=email` |
| `POST {supa}/auth/v1/verify` | **200** with a session JWT |
| `POST {fn}/device-code` | **200** `{device_code, user_code, expires_in: 900, interval: 5}` |
| `POST {fn}/device-approve` | **200** `{"status":"approved"}` |
| `POST {fn}/device-token` | **200** `{"status":"approved","key":"slk_..."}` |
| `POST {gw}/chat/completions` with a session JWT | **401** `Missing Alysis key` |
| `POST {gw}/chat/completions` with `slk_...` (every key before it is written) | **200** with content (`PONG`) — mint **10/10**, `--verify-only` **10/10** |
| sign-up throttle | ~13 accounts from one exit -> `403 We could not create an account with these details`; a different exit registered on the first try |

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Alysis Code page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| mailbox | Emailnator `POST /api/generate-email` | one fresh @gmail.com per account, dot-free form |
| captcha | `--captcha-cmd` solver, action=`signup` | headed; same exit as the sign-up |
| signup | `POST {supa}/auth/v1/signup` | 200 without a session; `403 could not create...` = exit throttle, `422 already registered` = address |
| read | Emailnator `/api/message-list` -> `/api/message/<id>` | brand-first (`alysisai`), extract `token_hash` |
| verify | `POST {supa}/auth/v1/verify` | returns the session JWT |
| device | `POST {fn}/device-code` | `{device_code, user_code}`, 15-minute life |
| approve | captcha (action=`device_approve`) + `POST {fn}/device-approve` | bearer = the session JWT |
| key | `POST {fn}/device-token` | answer field `key` (`slk_...`) |
| gate | `POST {gw}/chat/completions` | 200 with content or reasoning content = keep |

## ⚙️ CLI options

```bash
node src/cli.js --count 10            # mint (chat gate per account)
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # exit pool self-test against the Supabase settings endpoint
node src/cli.js --connect-9router     # register keys.txt with a local 9Router
node src/cli.js --help
```

| Env | Default | Meaning |
| --- | --- | --- |
| `ALYSISCODE_PROXIES` | `proxies.txt` | exit pool, one line per proxy |
| `ANALYSISCODE_CAPTCHA_CMD` | — | the solver command (placeholders above) |
| `ALYSISCODE_SUPABASE_URL` / `ALYSISCODE_ANON_KEY` / `ALYSISCODE_TURNSTILE_SITEKEY` | the project behind alysiscode.com | overrides for a re-deployed project |

Accounts are minted **serially**: the sign-up cap is per exit, so parallel solvers only race for the same quota.

## 🛰️ Behind a proxy

**Optional — but the provider makes it nearly mandatory at any scale.**

- **With a pool:** `--pool <file>` (or `ALYSISCODE_PROXIES`) and every request for an account goes through one pinned exit, so the captcha is never issued by one address and spent by another. A sign-up that hits the per-IP cap **burns that exit for `--cooldown` minutes** and the account moves on. The run is **fail-closed**: a pool with no usable exit aborts instead of leaking a request from your own address.
- **Without a pool:** the CLI prints `running WITHOUT a proxy (direct)`; the cap is then yours, so a direct run is a single-account smoke test.

Rotation is **serial** with an in-process cooldown: a 4-exit rotation with a 15-minute cooldown carried this mint from 4/10 to 10/10 after the first exit was throttled.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one live-verified key per line — git-ignored |
| `accounts.jsonl` | e-mail / password / uid / exit / base_url / model / gate — git-ignored |
| `proxies.txt` | your exits — git-ignored |
| `out/` | run logs and per-token captcha files — git-ignored |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router.

```bash
node src/cli.js --connect-9router
```

Defaults: `--prefix alysis`, `--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`, `--model deepseek-flash`. Models are served as `alysis/<model id>`.

## 🔌 Connect to OmniRoute

[OmniRoute](https://omniroute.online) is a self-hosted, OpenAI-compatible router.

```bash
node src/cli.js --connect-omniroute
```

Defaults: `--prefix alysis`, `--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`, `--model deepseek-flash`. Models are served as `alysis/<model id>`.

## 🔑 What one key gets you

| | |
| --- | --- |
| Provider | **Alysis Code** — [alysiscode.com](https://alysiscode.com) |
| What the provider gives | **50 credits every 30 days** on the hosted tier (no card) |
| What one key gets you | a `slk_...` gateway key on its own account, chat-verified on `deepseek-flash` |
| API shape | OpenAI-compatible: `POST .../functions/v1/llm/v1/chat/completions` |
| Your data | only the Supabase project behind `alysiscode.com` and your inbox backend are contacted |

## 🐞 Issues

If Alysis Code changes its Supabase project, its Turnstile gate or the device flow, the tool stops at that step and says which one. **[Open an issue](../../issues)** with the command and the exact output.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 alysiscode-bulk-apikey contributors

</div>
