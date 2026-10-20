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

**Alysis Code-Konten im Bulk erstellen und pro Konto einen gehosteten Gateway-Schlüssel (slk_...) ausgeben — OpenAI-kompatible Inferenz hinter dem Alysis Code LLM-Gateway, plus ein 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](undefined)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Free-Tier](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-undefined-of-them) · [🧪 API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

Alysis Code ist ein Apache-2.0-CLI-Coding-Agent (`pipx install alysis-code`), dessen gehostete Stufe hinter einem Supabase-Projekt läuft — es gibt **kein Panel und kein `/api/status`**, an dem man sich orientieren könnte. Die Konto-Oberfläche ist Supabase-Auth plus drei Edge-Funktionen, und die Credential, die das Produkt selbst verwendet, ist ein Device-Flow-Gateway-Schlüssel (`slk_...`) für einen OpenAI-kompatiblen Proxy. Jedes Konto trägt ein wiederkehrendes **kostenloses Kontingent (50 Credits / 30 Tage)**, also ein Konto = ein Schlüssel = ein kostenloses Kontingent. Bewiesen durch das Erzeugen von **10 Konten → 10 verifizierten Schlüsseln** und deren erneute Bestätigung mit der veröffentlichten CLI (`--verify-only`: **10/10 chat-200**).

## 🎁 Free-Tier — wie viel du bekommst

| Was | Wert |
| --- | --- |
| Kostenloses Kontingent | **50 Credits alle 30 Tage** pro Konto (`100 Credits = $1` Nutzung; die Auffüllung zählt ab der letzten Auffüllung, ungenutzte Credits verfallen) |
| Karte | **keine erforderlich** |
| Gehostete Modelle | DeepSeek V4.1 Flash, GLM 5.3 Flash, GPT-6 Luna, Claude Haiku 5.5 — ein gemeinsames Guthaben |
| Rollierende Obergrenzen | 25 Basis-Credits / 5 h und 50 / 7 d im Free-Plan |
| Peak-Preise | Mo–Fr 01:00–04:00 & 06:00–10:00 UTC verdoppeln die Sätze |
| Die Einheit, die skaliert | **ein Konto = ein Schlüssel** |
| Registrierungs-Drossel | eine erfolgreiche Registrierung ist **pro IP** begrenzt — gemessen: ~13 Konten von einem Exit, dann `403 We could not create an account with these details`, bis der Exit wechselt |

> 💡 Der Free-Tier wird von Alysis Code festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [alysiscode.com](https://alysiscode.com) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle undefined davon

## 🧪 So verwendest du die API

Die Basis-URL ist **\`https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1\`** — OpenAI-kompatibel, also funktioniert alles, was OpenAI spricht (SDKs, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Schnellstart

### 🖱️ Der Launcher

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

| Prüfung | Ergebnis |
| --- | --- |
| `GET {supa}/auth/v1/settings` | **200** — `email: true`, `disable_signup: false`, `mailer_autoconfirm: false` |
| `POST {supa}/auth/v1/signup` ohne Captcha-Token | **400** `captcha_failed` |
| `POST {supa}/auth/v1/signup` mit einem action=`signup`-Token | **200** (keine Session — die Bestätigungsmail ist erforderlich) |
| Bestätigungsmail | `noreply@<panel-mail>`, `Confirm your email for Alysis Code`, Link `.../auth/confirm#token_hash=<hex>&type=email` |
| `POST {supa}/auth/v1/verify` | **200** mit Session-JWT |
| `POST {fn}/device-code` | **200** `{device_code, user_code, expires_in: 900, interval: 5}` |
| `POST {fn}/device-approve` | **200** `{"status":"approved"}` |
| `POST {fn}/device-token` | **200** `{"status":"approved","key":"slk_..."}` |
| `POST {gw}/chat/completions` mit einem Session-JWT | **401** `Missing Alysis key` |
| `POST {gw}/chat/completions` mit `slk_...` (jeder Schlüssel, bevor er geschrieben wird) | **200** mit Inhalt (`PONG`) — erzeuge **10/10**, `--verify-only` **10/10** |
| Registrierungs-Drossel | ~13 Konten von einem Exit -> `403 We could not create an account with these details`; ein anderer Exit registrierte sich beim ersten Versuch |

## 🧭 So funktioniert es

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Alysis Code page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Mailbox | Emailnator `POST /api/generate-email` | eine frische @gmail.com pro Konto, punktfreie Form |
| Captcha | `--captcha-cmd`-Solver, action=`signup` | headed; derselbe Exit wie die Registrierung |
| Registrierung | `POST {supa}/auth/v1/signup` | 200 ohne Session; `403 could not create...` = Exit-Drossel, `422 already registered` = Adresse |
| Lesen | Emailnator `/api/message-list` -> `/api/message/<id>` | brand-first (`alysisai`), `token_hash` extrahieren |
| Verifizieren | `POST {supa}/auth/v1/verify` | gibt das Session-JWT zurück |
| Device | `POST {fn}/device-code` | `{device_code, user_code}`, 15 Minuten Lebensdauer |
| Genehmigen | Captcha (action=`device_approve`) + `POST {fn}/device-approve` | Bearer = das Session-JWT |
| Schlüssel | `POST {fn}/device-token` | Antwortfeld `key` (`slk_...`) |
| Gate | `POST {gw}/chat/completions` | 200 mit Inhalt oder Reasoning-Inhalt = behalten |

## ⚙️ CLI-Optionen

```bash
node src/cli.js --count 10            # mint (chat gate per account)
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # exit pool self-test against the Supabase settings endpoint
node src/cli.js --connect-9router     # register keys.txt with a local 9Router
node src/cli.js --help
```

| Env | Standard | Bedeutung |
| --- | --- | --- |
| `ALYSISCODE_PROXIES` | `proxies.txt` | Exit-Pool, eine Zeile pro Proxy |
| `ANALYSISCODE_CAPTCHA_CMD` | — | der Solver-Befehl (Platzhalter oben) |
| `ALYSISCODE_SUPABASE_URL` / `ALYSISCODE_ANON_KEY` / `ALYSISCODE_TURNSTILE_SITEKEY` | das Projekt hinter alysiscode.com | Overrides für ein neu deploytes Projekt |

Konten werden **seriell** erzeugt: Die Registrierungsgrenze gilt pro Exit, also konkurrieren parallele Solver nur um dasselbe Kontingent.

## 🛰️ Hinter einem Proxy

**Optional — aber der Anbieter macht es in jedem Maßstab nahezu zwingend.**

- **Mit einem Pool:** `--pool <file>` (oder `ALYSISCODE_PROXIES`) und jede Anfrage für ein Konto läuft über einen festgelegten Exit, sodass das Captcha nie von einer Adresse ausgestellt und von einer anderen eingelöst wird. Eine Registrierung, die die Pro-IP-Grenze erreicht, **verbrennt diesen Exit für `--cooldown` Minuten** und das Konto macht weiter. Der Lauf ist **fail-closed**: Ein Pool ohne nutzbaren Exit bricht ab, statt eine Anfrage von deiner eigenen Adresse durchsickern zu lassen.
- **Ohne einen Pool:** Die CLI gibt `running WITHOUT a proxy (direct)` aus; die Grenze ist dann deine, also ist ein direkter Lauf ein Single-Account-Smoke-Test.

Die Rotation ist **seriell** mit einem In-Process-Cooldown: Eine 4-Exit-Rotation mit einem 15-Minuten-Cooldown brachte diesen Mint von 4/10 auf 10/10, nachdem der erste Exit gedrosselt wurde.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live-verifizierter Schlüssel pro Zeile — von Git ignoriert |
| `accounts.jsonl` | E-Mail / Passwort / uid / Exit / base_url / Modell / Gate — von Git ignoriert |
| `proxies.txt` | deine Exits — von Git ignoriert |
| `out/` | Lauf-Logs und Captcha-Dateien pro Token — von Git ignoriert |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router.

```bash
node src/cli.js --connect-9router
```

Standardwerte: `--prefix alysis`, `--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`, `--model deepseek-flash`. Modelle werden als `alysis/<model id>` bereitgestellt.

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| Anbieter | **Alysis Code** — [alysiscode.com](https://alysiscode.com) |
| Was der Anbieter gibt | **50 Credits alle 30 Tage** in der gehosteten Stufe (keine Karte) |
| Was ein Schlüssel dir bringt | ein `slk_...`-Gateway-Schlüssel auf einem eigenen Konto, chat-verifiziert auf `deepseek-flash` |
| API-Form | OpenAI-kompatibel: `POST .../functions/v1/llm/v1/chat/completions` |
| Deine Daten | nur das Supabase-Projekt hinter `alysiscode.com` und dein Inbox-Backend werden kontaktiert |

## 🐞 Issues

Wenn Alysis Code sein Supabase-Projekt, sein Turnstile-Gate oder den Device-Flow ändert, stoppt das Tool an diesem Schritt und sagt, an welchem. **[Öffne ein Issue](../../issues)** mit dem Befehl und der exakten Ausgabe.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 alysiscode-bulk-apikey contributors

</div>