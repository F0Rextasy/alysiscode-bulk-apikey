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

**Alysis Code 계정을 대량으로 생성하고 계정마다 호스팅 게이트웨이 키(slk_...)를 하나씩 발급합니다 — Alysis Code LLM 게이트웨이 뒤의 OpenAI 호환 추론, 그리고 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](undefined)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-undefined-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 이게 왜 필요한가

Alysis Code는 Apache-2.0 CLI 코딩 에이전트(`pipx install alysis-code`)로, 호스팅 티어는 Supabase 프로젝트 뒤에서 돌아갑니다 — 게이트로 삼을 **패널도 `/api/status`도 없습니다**. 계정 표면은 Supabase 인증과 세 개의 엣지 함수이며, 제품 자체가 사용하는 자격 증명은 OpenAI 호환 프록시용 디바이스 플로우 게이트웨이 키(`slk_...`)입니다. 모든 계정에는 반복되는 **무료 허용량(50 크레딧 / 30일)**이 붙으므로, 계정 하나 = 키 하나 = 무료 할당량 하나입니다. **계정 10개 → 검증된 키 10개**를 발급해 증명했고, 공개된 CLI로 다시 증명했습니다(`--verify-only`: **10/10 chat-200**).

## 🎁 무료 티어 — 얼마나 받는가

| 항목 | 값 |
| --- | --- |
| 무료 허용량 | 계정당 **30일마다 50 크레딧** (`100 크레딧 = $1` 상당 사용량, 리필은 마지막 리필 시점부터 계산되며 미사용 크레딧은 이월되지 않음) |
| 카드 | **불필요** |
| 호스팅 모델 | DeepSeek V4.1 Flash, GLM 5.3 Flash, GPT-6 Luna, Claude Haiku 5.5 — 하나의 공유 잔액 |
| 롤링 한도 | 무료 플랜에서 5시간당 기본 25 크레딧, 7일당 50 크레딧 |
| 피크 요금 | 월-금 01:00-04:00 & 06:00-10:00 UTC에 요율 두 배 |
| 확장되는 단위 | **계정 하나 = 키 하나** |
| 가입 스로틀 | 성공한 가입은 **IP당** 제한됨 — 측정치: 한 출구에서 약 13개 계정까지, 그 후 출구가 바뀔 때까지 `403 We could not create an account with these details` |

> 💡 무료 티어는 Alysis Code가 정하며 변경될 수 있습니다. 실시간 수치는 [alysiscode.com](https://alysiscode.com)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 전부 undefined개

## 🧪 API 사용 방법

베이스 URL은 **\`https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1\`** 입니다 — OpenAI 호환이므로 OpenAI를 지원하는 모든 것(SDK, Cursor, OpenCode, Kilo Code, …)이 작동합니다.

```bash
curl https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 빠른 시작

### 🖱️ 런처

## ✅ 검증된 작동 — 모든 키가 테스트됨

| 검사 | 결과 |
| --- | --- |
| `GET {supa}/auth/v1/settings` | **200** — `email: true`, `disable_signup: false`, `mailer_autoconfirm: false` |
| 캡차 토큰 없이 `POST {supa}/auth/v1/signup` | **400** `captcha_failed` |
| action=`signup` 토큰으로 `POST {supa}/auth/v1/signup` | **200** (세션 없음 — 확인 메일이 필요함) |
| 확인 메일 | `noreply@<panel-mail>`, `Confirm your email for Alysis Code`, 링크 `.../auth/confirm#token_hash=<hex>&type=email` |
| `POST {supa}/auth/v1/verify` | 세션 JWT와 함께 **200** |
| `POST {fn}/device-code` | **200** `{device_code, user_code, expires_in: 900, interval: 5}` |
| `POST {fn}/device-approve` | **200** `{"status":"approved"}` |
| `POST {fn}/device-token` | **200** `{"status":"approved","key":"slk_..."}` |
| 세션 JWT로 `POST {gw}/chat/completions` | **401** `Missing Alysis key` |
| `slk_...`로 `POST {gw}/chat/completions` (기록되기 전의 모든 키) | 콘텐츠와 함께 **200** (`PONG`) — 발급 **10/10**, `--verify-only` **10/10** |
| 가입 스로틀 | 한 출구에서 약 13개 계정 -> `403 We could not create an account with these details`; 다른 출구에서는 첫 시도에 등록됨 |

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Alysis Code page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 메일함 | Emailnator `POST /api/generate-email` | 계정당 하나의 새 @gmail.com, 점 없는 형식 |
| 캡차 | `--captcha-cmd` 솔버, action=`signup` | headed; 가입과 동일한 출구 |
| 가입 | `POST {supa}/auth/v1/signup` | 세션 없이 200; `403 could not create...` = 출구 스로틀, `422 already registered` = 주소 |
| 읽기 | Emailnator `/api/message-list` -> `/api/message/<id>` | 브랜드 우선(`alysisai`), `token_hash` 추출 |
| 검증 | `POST {supa}/auth/v1/verify` | 세션 JWT 반환 |
| 디바이스 | `POST {fn}/device-code` | `{device_code, user_code}`, 15분 수명 |
| 승인 | 캡차 (action=`device_approve`) + `POST {fn}/device-approve` | bearer = 세션 JWT |
| 키 | `POST {fn}/device-token` | 응답 필드 `key` (`slk_...`) |
| 게이트 | `POST {gw}/chat/completions` | 콘텐츠 또는 추론 콘텐츠와 함께 200 = 유지 |

## ⚙️ CLI 옵션

```bash
node src/cli.js --count 10            # mint (chat gate per account)
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # exit pool self-test against the Supabase settings endpoint
node src/cli.js --connect-9router     # register keys.txt with a local 9Router
node src/cli.js --help
```

| 환경 변수 | 기본값 | 의미 |
| --- | --- | --- |
| `ALYSISCODE_PROXIES` | `proxies.txt` | 출구 풀, 프록시당 한 줄 |
| `ANALYSISCODE_CAPTCHA_CMD` | — | 솔버 명령 (위의 플레이스홀더) |
| `ALYSISCODE_SUPABASE_URL` / `ALYSISCODE_ANON_KEY` / `ALYSISCODE_TURNSTILE_SITEKEY` | alysiscode.com 뒤의 프로젝트 | 재배포된 프로젝트용 오버라이드 |

계정은 **직렬로** 발급됩니다: 가입 상한이 출구당이므로, 병렬 솔버는 같은 할당량을 두고 경쟁할 뿐입니다.

## 🛰️ 프록시 뒤에서

**선택 사항 — 하지만 제공자 때문에 어느 정도 규모에서는 거의 필수입니다.**

- **풀 사용 시:** `--pool <file>` (또는 `ALYSISCODE_PROXIES`)을 지정하면 계정에 대한 모든 요청이 하나의 고정된 출구를 통과하므로, 캡차가 한 주소에서 발급되고 다른 주소에서 사용되는 일이 없습니다. IP당 상한에 걸린 가입은 **해당 출구를 `--cooldown`분 동안 소진**시키고 계정은 다음으로 넘어갑니다. 실행은 **fail-closed**입니다: 사용 가능한 출구가 없는 풀은 자신의 주소에서 요청을 유출하는 대신 중단합니다.
- **풀 없이:** CLI는 `running WITHOUT a proxy (direct)`를 출력합니다; 그러면 상한은 본인 것이므로, 직접 실행은 단일 계정 스모크 테스트입니다.

로테이션은 프로세스 내 쿨다운과 함께 **직렬**입니다: 15분 쿨다운의 4-출구 로테이션이 첫 출구가 스로틀된 후 이 발급을 4/10에서 10/10으로 끌어올렸습니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 한 줄에 하나의 라이브 검증된 키 — git-ignored |
| `accounts.jsonl` | 이메일 / 비밀번호 / uid / 출구 / base_url / 모델 / 게이트 — git-ignored |
| `proxies.txt` | 사용자의 출구 — git-ignored |
| `out/` | 실행 로그 및 토큰별 캡차 파일 — git-ignored |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅, OpenAI 호환 라우터입니다.

```bash
node src/cli.js --connect-9router
```

기본값: `--prefix alysis`, `--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`, `--model deepseek-flash`. 모델은 `alysis/<model id>`로 제공됩니다.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 제공자 | **Alysis Code** — [alysiscode.com](https://alysiscode.com) |
| 제공자가 주는 것 | 호스팅 티어에서 **30일마다 50 크레딧** (카드 불필요) |
| 키 하나로 얻는 것 | 자체 계정의 `slk_...` 게이트웨이 키, `deepseek-flash`에서 채팅 검증됨 |
| API 형태 | OpenAI 호환: `POST .../functions/v1/llm/v1/chat/completions` |
| 사용자 데이터 | `alysiscode.com` 뒤의 Supabase 프로젝트와 사용자의 메일함 백엔드만 접촉됨 |

## 🐞 이슈

Alysis Code가 Supabase 프로젝트, Turnstile 게이트 또는 디바이스 플로우를 변경하면, 도구는 해당 단계에서 멈추고 어느 단계인지 알려줍니다. 명령과 정확한 출력을 포함해 **[이슈를 열어주세요](../../issues)**.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 alysiscode-bulk-apikey contributors

</div>