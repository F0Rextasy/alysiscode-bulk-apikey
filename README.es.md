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

**Crea cuentas de Alysis Code en masa y genera una clave de gateway alojada por cuenta (slk_...) — inferencia compatible con OpenAI detrás del gateway LLM de Alysis Code, más un conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](undefined)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-undefined-of-them) · [🧪 Usa la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

Alysis Code es un agente de programación CLI con licencia Apache-2.0 (`pipx install alysis-code`) cuyo nivel alojado se ejecuta detrás de un proyecto de Supabase — **no hay panel ni `/api/status`** sobre el que filtrar. La superficie de la cuenta es la autenticación de Supabase más tres edge functions, y la credencial que usa el propio producto es una clave de gateway de flujo de dispositivo (`slk_...`) para un proxy compatible con OpenAI. Cada cuenta lleva una **asignación gratuita recurrente (50 créditos / 30 días)**, así que una cuenta = una clave = una cuota gratuita. Demostrado generando **10 cuentas → 10 claves verificadas** y volviéndolas a verificar con la CLI publicada (`--verify-only`: **10/10 chat-200**).

## 🎁 Nivel gratuito — cuánto obtienes

| Qué | Valor |
| --- | --- |
| Asignación gratuita | **50 créditos cada 30 días** por cuenta (`100 créditos = $1` de uso; la recarga cuenta desde la última recarga, los créditos no usados no se acumulan) |
| Tarjeta | **ninguna requerida** |
| Modelos alojados | DeepSeek V4.1 Flash, GLM 5.3 Flash, GPT-6 Luna, Claude Haiku 5.5 — un saldo compartido |
| Límites móviles | 25 créditos base / 5 h y 50 / 7 d en el plan gratuito |
| Precios en horas punta | Lunes-Viernes 01:00-04:00 y 06:00-10:00 UTC duplican las tarifas |
| La unidad que escala | **una cuenta = una clave** |
| Limitación de registro | un registro exitoso está limitado **por IP** — medido: ~13 cuentas desde una salida, luego `403 We could not create an account with these details` hasta que cambia la salida |

> 💡 El nivel gratuito lo define Alysis Code y puede cambiar. Consulta los números en vivo en [alysiscode.com](https://alysiscode.com) — y deja que la propia puerta de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los undefined de ellos

## 🧪 Cómo usar la API

La URL base es **\`https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1\`** — compatible con OpenAI, así que cualquier cosa que hable OpenAI funciona (SDKs, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Inicio rápido

### 🖱️ El lanzador

## ✅ Verificado y funcionando — cada clave se prueba

| Comprobación | Resultado |
| --- | --- |
| `GET {supa}/auth/v1/settings` | **200** — `email: true`, `disable_signup: false`, `mailer_autoconfirm: false` |
| `POST {supa}/auth/v1/signup` sin un token de captcha | **400** `captcha_failed` |
| `POST {supa}/auth/v1/signup` con un token action=`signup` | **200** (sin sesión — se requiere el correo de confirmación) |
| correo de confirmación | `noreply@<panel-mail>`, `Confirm your email for Alysis Code`, enlace `.../auth/confirm#token_hash=<hex>&type=email` |
| `POST {supa}/auth/v1/verify` | **200** con un JWT de sesión |
| `POST {fn}/device-code` | **200** `{device_code, user_code, expires_in: 900, interval: 5}` |
| `POST {fn}/device-approve` | **200** `{"status":"approved"}` |
| `POST {fn}/device-token` | **200** `{"status":"approved","key":"slk_..."}` |
| `POST {gw}/chat/completions` con un JWT de sesión | **401** `Missing Alysis key` |
| `POST {gw}/chat/completions` con `slk_...` (cada clave antes de escribirse) | **200** con contenido (`PONG`) — generadas **10/10**, `--verify-only` **10/10** |
| limitación de registro | ~13 cuentas desde una salida -> `403 We could not create an account with these details`; una salida diferente se registró al primer intento |

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Alysis Code page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| buzón | Emailnator `POST /api/generate-email` | un @gmail.com nuevo por cuenta, forma sin puntos |
| captcha | solucionador `--captcha-cmd`, action=`signup` | con interfaz; misma salida que el registro |
| registro | `POST {supa}/auth/v1/signup` | 200 sin sesión; `403 could not create...` = limitación de salida, `422 already registered` = dirección |
| lectura | Emailnator `/api/message-list` -> `/api/message/<id>` | marca primero (`alysisai`), extrae `token_hash` |
| verificación | `POST {supa}/auth/v1/verify` | devuelve el JWT de sesión |
| dispositivo | `POST {fn}/device-code` | `{device_code, user_code}`, vida de 15 minutos |
| aprobación | captcha (action=`device_approve`) + `POST {fn}/device-approve` | bearer = el JWT de sesión |
| clave | `POST {fn}/device-token` | campo de respuesta `key` (`slk_...`) |
| puerta | `POST {gw}/chat/completions` | 200 con contenido o contenido de razonamiento = conservar |

## ⚙️ Opciones de CLI

```bash
node src/cli.js --count 10            # mint (chat gate per account)
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # exit pool self-test against the Supabase settings endpoint
node src/cli.js --connect-9router     # register keys.txt with a local 9Router
node src/cli.js --help
```

| Env | Predeterminado | Significado |
| --- | --- | --- |
| `ALYSISCODE_PROXIES` | `proxies.txt` | grupo de salidas, una línea por proxy |
| `ANALYSISCODE_CAPTCHA_CMD` | — | el comando del solucionador (marcadores de posición arriba) |
| `ALYSISCODE_SUPABASE_URL` / `ALYSISCODE_ANON_KEY` / `ALYSISCODE_TURNSTILE_SITEKEY` | el proyecto detrás de alysiscode.com | anulaciones para un proyecto re-desplegado |

Las cuentas se generan **en serie**: el límite de registro es por salida, así que los solucionadores en paralelo solo compiten por la misma cuota.

## 🛰️ Detrás de un proxy

**Opcional — pero el proveedor lo hace casi obligatorio a cualquier escala.**

- **Con un grupo:** `--pool <file>` (o `ALYSISCODE_PROXIES`) y cada solicitud de una cuenta pasa por una salida fijada, así que el captcha nunca se emite desde una dirección y se gasta desde otra. Un registro que alcanza el límite por IP **quema esa salida durante `--cooldown` minutos** y la cuenta continúa. La ejecución es **fail-closed**: un grupo sin salida utilizable aborta en lugar de filtrar una solicitud desde tu propia dirección.
- **Sin un grupo:** la CLI imprime `running WITHOUT a proxy (direct)`; el límite entonces es tuyo, así que una ejecución directa es una prueba de humo de una sola cuenta.

La rotación es **en serie** con un enfriamiento en proceso: una rotación de 4 salidas con un enfriamiento de 15 minutos llevó esta generación de 4/10 a 10/10 después de que la primera salida fuera limitada.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave verificada en vivo por línea — ignorada por git |
| `accounts.jsonl` | correo / contraseña / uid / salida / base_url / modelo / puerta — ignorado por git |
| `proxies.txt` | tus salidas — ignorado por git |
| `out/` | registros de ejecución y archivos de captcha por token — ignorados por git |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un router autoalojado compatible con OpenAI.

```bash
node src/cli.js --connect-9router
```

Predeterminados: `--prefix alysis`, `--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`, `--model deepseek-flash`. Los modelos se sirven como `alysis/<model id>`.

## 🔌 Conectar con OmniRoute

[OmniRoute](https://omniroute.online) es un router autoalojado compatible con OpenAI.

```bash
node src/cli.js --connect-omniroute
```

Predeterminados: `--prefix alysis`, `--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`, `--model deepseek-flash`. Los modelos se sirven como `alysis/<model id>`.
## 🔑 Qué te da una clave

| | |
| --- | --- |
| Proveedor | **Alysis Code** — [alysiscode.com](https://alysiscode.com) |
| Qué da el proveedor | **50 créditos cada 30 días** en el nivel alojado (sin tarjeta) |
| Qué te da una clave | una clave de gateway `slk_...` en su propia cuenta, verificada por chat en `deepseek-flash` |
| Forma de la API | Compatible con OpenAI: `POST .../functions/v1/llm/v1/chat/completions` |
| Tus datos | solo se contacta el proyecto de Supabase detrás de `alysiscode.com` y tu backend de buzón |

## 🐞 Problemas

Si Alysis Code cambia su proyecto de Supabase, su puerta Turnstile o el flujo de dispositivo, la herramienta se detiene en ese paso e indica cuál. **[Abre un problema](../../issues)** con el comando y la salida exacta.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 alysiscode-bulk-apikey contributors

</div>