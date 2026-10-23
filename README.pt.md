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

**Crie contas Alysis Code em massa e gere uma chave de gateway hospedada por conta (slk_...) — inferência compatível com OpenAI por trás do gateway LLM do Alysis Code, além de um conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](undefined)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Nível gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-undefined-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por que isto existe

Alysis Code é um agente de codificação CLI Apache-2.0 (`pipx install alysis-code`) cujo nível hospedado roda atrás de um projeto Supabase — **não há painel nem `/api/status`** para usar como critério. A superfície da conta é a autenticação do Supabase mais três edge functions, e a credencial que o próprio produto usa é uma chave de gateway de fluxo de dispositivo (`slk_...`) para um proxy compatível com OpenAI. Toda conta carrega uma **franquia gratuita recorrente (50 créditos / 30 dias)**, então uma conta = uma chave = uma cota gratuita. Comprovado gerando **10 contas → 10 chaves verificadas** e comprovando novamente com a CLI publicada (`--verify-only`: **10/10 chat-200**).

## 🎁 Nível gratuito — quanto você recebe

| O quê | Valor |
| --- | --- |
| Franquia gratuita | **50 créditos a cada 30 dias** por conta (`100 créditos = $1` de uso; a recarga conta a partir da última recarga, créditos não usados não são acumulados) |
| Cartão | **nenhum necessário** |
| Modelos hospedados | DeepSeek V4.1 Flash, GLM 5.3 Flash, GPT-6 Luna, Claude Haiku 5.5 — um saldo compartilhado |
| Limites móveis | 25 créditos base / 5 h e 50 / 7 d no plano gratuito |
| Preço de pico | Seg-Sex 01:00-04:00 & 06:00-10:00 UTC dobram as tarifas |
| A unidade que escala | **uma conta = uma chave** |
| Limite de cadastro | um cadastro bem-sucedido é limitado **por IP** — medido: ~13 contas a partir de uma saída, depois `403 We could not create an account with these details` até a saída mudar |

> 💡 O nível gratuito é definido pelo Alysis Code e pode mudar. Confira os números ao vivo em [alysiscode.com](https://alysiscode.com) — e deixe o próprio gate da ferramenta decidir:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos os undefined deles

## 🧪 Como usar a API

A URL base é **\`https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1\`** — compatível com OpenAI, então qualquer coisa que fale OpenAI funciona (SDKs, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Início rápido

### 🖱️ O inicializador

## ✅ Verificado e funcionando — toda chave é testada

| Verificação | Resultado |
| --- | --- |
| `GET {supa}/auth/v1/settings` | **200** — `email: true`, `disable_signup: false`, `mailer_autoconfirm: false` |
| `POST {supa}/auth/v1/signup` sem um token de captcha | **400** `captcha_failed` |
| `POST {supa}/auth/v1/signup` com um token action=`signup` | **200** (sem sessão — o e-mail de confirmação é necessário) |
| e-mail de confirmação | `noreply@<panel-mail>`, `Confirm your email for Alysis Code`, link `.../auth/confirm#token_hash=<hex>&type=email` |
| `POST {supa}/auth/v1/verify` | **200** com um JWT de sessão |
| `POST {fn}/device-code` | **200** `{device_code, user_code, expires_in: 900, interval: 5}` |
| `POST {fn}/device-approve` | **200** `{"status":"approved"}` |
| `POST {fn}/device-token` | **200** `{"status":"approved","key":"slk_..."}` |
| `POST {gw}/chat/completions` com um JWT de sessão | **401** `Missing Alysis key` |
| `POST {gw}/chat/completions` com `slk_...` (toda chave antes de ser gravada) | **200** com conteúdo (`PONG`) — geradas **10/10**, `--verify-only` **10/10** |
| limite de cadastro | ~13 contas a partir de uma saída -> `403 We could not create an account with these details`; uma saída diferente registrou na primeira tentativa |

## 🧭 Como funciona

```

inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Alysis Code page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Observações |
| --- | --- | --- |
| caixa de correio | Emailnator `POST /api/generate-email` | um @gmail.com novo por conta, formato sem pontos |
| captcha | solucionador `--captcha-cmd`, action=`signup` | com interface; mesma saída do cadastro |
| cadastro | `POST {supa}/auth/v1/signup` | 200 sem sessão; `403 could not create...` = limite de saída, `422 already registered` = endereço |
| leitura | Emailnator `/api/message-list` -> `/api/message/<id>` | prioriza a marca (`alysisai`), extrai `token_hash` |
| verificação | `POST {supa}/auth/v1/verify` | retorna o JWT de sessão |
| dispositivo | `POST {fn}/device-code` | `{device_code, user_code}`, validade de 15 minutos |
| aprovação | captcha (action=`device_approve`) + `POST {fn}/device-approve` | bearer = o JWT de sessão |
| chave | `POST {fn}/device-token` | campo de resposta `key` (`slk_...`) |
| gate | `POST {gw}/chat/completions` | 200 com conteúdo ou conteúdo de raciocínio = manter |

## ⚙️ Opções da CLI

```bash
node src/cli.js --count 10            # mint (chat gate per account)
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # exit pool self-test against the Supabase settings endpoint
node src/cli.js --connect-9router     # register keys.txt with a local 9Router
node src/cli.js --help
```

| Env | Padrão | Significado |
| --- | --- | --- |
| `ALYSISCODE_PROXIES` | `proxies.txt` | pool de saídas, uma linha por proxy |
| `ANALYSISCODE_CAPTCHA_CMD` | — | o comando do solucionador (espaços reservados acima) |
| `ALYSISCODE_SUPABASE_URL` / `ALYSISCODE_ANON_KEY` / `ALYSISCODE_TURNSTILE_SITEKEY` | o projeto por trás de alysiscode.com | substituições para um projeto reimplantado |

As contas são geradas **serialmente**: o limite de cadastro é por saída, então solucionadores paralelos só disputam a mesma cota.

## 🛰️ Atrás de um proxy

**Opcional — mas o provedor torna isso quase obrigatório em qualquer escala.**

- **Com um pool:** `--pool <file>` (ou `ALYSISCODE_PROXIES`) e toda requisição de uma conta passa por uma saída fixada, então o captcha nunca é emitido por um endereço e usado por outro. Um cadastro que atinge o limite por IP **queima aquela saída por `--cooldown` minutos** e a conta segue adiante. A execução é **fail-closed**: um pool sem saída utilizável aborta em vez de vazar uma requisição do seu próprio endereço.
- **Sem um pool:** a CLI imprime `running WITHOUT a proxy (direct)`; o limite então é o seu, então uma execução direta é um teste de fumaça de conta única.

A rotação é **serial** com um cooldown em processo: uma rotação de 4 saídas com um cooldown de 15 minutos levou esta geração de 4/10 para 10/10 depois que a primeira saída foi limitada.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave verificada ao vivo por linha — ignorada pelo git |
| `accounts.jsonl` | e-mail / senha / uid / saída / base_url / modelo / gate — ignorado pelo git |
| `proxies.txt` | suas saídas — ignorado pelo git |
| `out/` | logs de execução e arquivos de captcha por token — ignorado pelo git |

## 🔌 Conectar ao 9Router

[9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI.

```bash
node src/cli.js --connect-9router
```

Padrões: `--prefix alysis`, `--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`, `--model deepseek-flash`. Os modelos são servidos como `alysis/<model id>`.

## 🔌 Conectar ao OmniRoute

[OmniRoute](https://omniroute.online) é um roteador auto-hospedado e compatível com OpenAI.

```bash
node src/cli.js --connect-omniroute
```

Padrões: `--prefix alysis`, `--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`, `--model deepseek-flash`. Os modelos são servidos como `alysis/<model id>`.

## 🔑 O que uma chave te dá

| | |
| --- | --- |
| Provedor | **Alysis Code** — [alysiscode.com](https://alysiscode.com) |
| O que o provedor dá | **50 créditos a cada 30 dias** no nível hospedado (sem cartão) |
| O que uma chave te dá | uma chave de gateway `slk_...` em sua própria conta, verificada por chat em `deepseek-flash` |
| Formato da API | Compatível com OpenAI: `POST .../functions/v1/llm/v1/chat/completions` |
| Seus dados | apenas o projeto Supabase por trás de `alysiscode.com` e seu backend de caixa de entrada são contatados |

## 🐞 Problemas

Se o Alysis Code mudar seu projeto Supabase, seu gate Turnstile ou o fluxo de dispositivo, a ferramenta para nessa etapa e diz qual. **[Abra uma issue](../../issues)** com o comando e a saída exata.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 alysiscode-bulk-apikey contributors

</div>