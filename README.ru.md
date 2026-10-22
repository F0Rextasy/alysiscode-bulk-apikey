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

**Массовое создание аккаунтов Alysis Code и выпуск одного ключа хостед-шлюза на каждый аккаунт (slk_...) — OpenAI-совместимый инференс через LLM-шлюз Alysis Code, плюс коннектор для 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](undefined)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-undefined-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

Alysis Code — это CLI-агент для программирования под лицензией Apache-2.0 (`pipx install alysis-code`), хостед-тариф которого работает на проекте Supabase — здесь **нет панели и нет `/api/status`**, за которые можно было бы зацепиться. Поверхность аккаунта — это Supabase auth плюс три edge-функции, а учётные данные, которые использует сам продукт, — это ключ шлюза device-flow (`slk_...`) для OpenAI-совместимого прокси. Каждый аккаунт несёт повторяющийся **бесплатный лимит (50 кредитов / 30 дней)**, так что один аккаунт = один ключ = одна бесплатная квота. Доказано выпуском **10 аккаунтов → 10 проверенных ключей** и повторной проверкой их с помощью опубликованного CLI (`--verify-only`: **10/10 chat-200**).

## 🎁 Бесплатный тариф — сколько вы получаете

| Что | Значение |
| --- | --- |
| Бесплатный лимит | **50 кредитов каждые 30 дней** на аккаунт (`100 кредитов = $1` использования; отсчёт пополнения идёт от последнего пополнения, неиспользованные кредиты не переносятся) |
| Карта | **не требуется** |
| Хостед-модели | DeepSeek V4.1 Flash, GLM 5.3 Flash, GPT-6 Luna, Claude Haiku 5.5 — один общий баланс |
| Скользящие лимиты | 25 базовых кредитов / 5 ч и 50 / 7 д на бесплатном тарифе |
| Пиковые цены | Пн-Пт 01:00-04:00 и 06:00-10:00 UTC удваивают тарифы |
| Единица масштабирования | **один аккаунт = один ключ** |
| Ограничение регистрации | успешная регистрация ограничена **на IP** — измерено: ~13 аккаунтов с одного выхода, затем `403 We could not create an account with these details` до смены выхода |

> 💡 Бесплатный тариф устанавливается Alysis Code и может меняться. Проверяйте актуальные цифры на [alysiscode.com](https://alysiscode.com) — и пусть собственный гейт инструмента решает:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все undefined из них

## 🧪 Как использовать API

Базовый URL — **\`https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1\`** — OpenAI-совместимый, так что работает всё, что говорит на OpenAI (SDK, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Быстрый старт

### 🖱️ Лаунчер

## ✅ Проверено в работе — каждый ключ протестирован

| Проверка | Результат |
| --- | --- |
| `GET {supa}/auth/v1/settings` | **200** — `email: true`, `disable_signup: false`, `mailer_autoconfirm: false` |
| `POST {supa}/auth/v1/signup` без токена капчи | **400** `captcha_failed` |
| `POST {supa}/auth/v1/signup` с токеном action=`signup` | **200** (без сессии — требуется письмо с подтверждением) |
| письмо с подтверждением | `noreply@<panel-mail>`, `Confirm your email for Alysis Code`, ссылка `.../auth/confirm#token_hash=<hex>&type=email` |
| `POST {supa}/auth/v1/verify` | **200** с сессионным JWT |
| `POST {fn}/device-code` | **200** `{device_code, user_code, expires_in: 900, interval: 5}` |
| `POST {fn}/device-approve` | **200** `{"status":"approved"}` |
| `POST {fn}/device-token` | **200** `{"status":"approved","key":"slk_..."}` |
| `POST {gw}/chat/completions` с сессионным JWT | **401** `Missing Alysis key` |
| `POST {gw}/chat/completions` с `slk_...` (каждый ключ перед записью) | **200** с содержимым (`PONG`) — выпуск **10/10**, `--verify-only` **10/10** |
| ограничение регистрации | ~13 аккаунтов с одного выхода -> `403 We could not create an account with these details`; другой выход зарегистрировался с первой попытки |

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Alysis Code page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| почтовый ящик | Emailnator `POST /api/generate-email` | один свежий @gmail.com на аккаунт, форма без точек |
| капча | решатель `--captcha-cmd`, action=`signup` | с интерфейсом; тот же выход, что и у регистрации |
| регистрация | `POST {supa}/auth/v1/signup` | 200 без сессии; `403 could not create...` = ограничение выхода, `422 already registered` = адрес |
| чтение | Emailnator `/api/message-list` -> `/api/message/<id>` | сначала бренд (`alysisai`), извлечь `token_hash` |
| подтверждение | `POST {supa}/auth/v1/verify` | возвращает сессионный JWT |
| устройство | `POST {fn}/device-code` | `{device_code, user_code}`, срок жизни 15 минут |
| одобрение | капча (action=`device_approve`) + `POST {fn}/device-approve` | bearer = сессионный JWT |
| ключ | `POST {fn}/device-token` | поле ответа `key` (`slk_...`) |
| гейт | `POST {gw}/chat/completions` | 200 с содержимым или reasoning-содержимым = оставить |

## ⚙️ Опции CLI

```bash
node src/cli.js --count 10            # mint (chat gate per account)
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # exit pool self-test against the Supabase settings endpoint
node src/cli.js --connect-9router     # register keys.txt with a local 9Router
node src/cli.js --help
```

| Переменная | По умолчанию | Значение |
| --- | --- | --- |
| `ALYSISCODE_PROXIES` | `proxies.txt` | пул выходов, по одному прокси на строку |
| `ANALYSISCODE_CAPTCHA_CMD` | — | команда решателя (плейсхолдеры выше) |
| `ALYSISCODE_SUPABASE_URL` / `ALYSISCODE_ANON_KEY` / `ALYSISCODE_TURNSTILE_SITEKEY` | проект за alysiscode.com | переопределения для повторно развёрнутого проекта |

Аккаунты создаются **последовательно**: ограничение регистрации действует на выход, так что параллельные решатели лишь соревнуются за одну и ту же квоту.

## 🛰️ За прокси

**Необязательно — но провайдер делает это почти обязательным при любом масштабе.**

- **С пулом:** `--pool <file>` (или `ALYSISCODE_PROXIES`), и каждый запрос для аккаунта идёт через один закреплённый выход, так что капча никогда не выдаётся одним адресом, а расходуется другим. Регистрация, попавшая под лимит на IP, **сжигает этот выход на `--cooldown` минут**, и аккаунт переходит дальше. Запуск работает по принципу **fail-closed**: пул без пригодного выхода прерывается, вместо того чтобы утечь запросом с вашего собственного адреса.
- **Без пула:** CLI печатает `running WITHOUT a proxy (direct)`; тогда лимит ваш, так что прямой запуск — это дымовой тест на один аккаунт.

Ротация **последовательная** с внутрипроцессным cooldown: ротация из 4 выходов с 15-минутным cooldown подняла этот выпуск с 4/10 до 10/10 после того, как первый выход был ограничен.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один проверенный в работе ключ на строку — игнорируется git |
| `accounts.jsonl` | e-mail / пароль / uid / выход / base_url / модель / гейт — игнорируется git |
| `proxies.txt` | ваши выходы — игнорируется git |
| `out/` | логи запусков и файлы капчи по токенам — игнорируется git |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый OpenAI-совместимый роутер.

```bash
node src/cli.js --connect-9router
```

По умолчанию: `--prefix alysis`, `--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`, `--model deepseek-flash`. Модели подаются как `alysis/<model id>`.

## 🔌 Подключение к OmniRoute

[OmniRoute](https://omniroute.online) — это самостоятельно размещаемый OpenAI-совместимый роутер.

```bash
node src/cli.js --connect-omniroute
```

По умолчанию: `--prefix alysis`, `--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`, `--model deepseek-flash`. Модели подаются как `alysis/<model id>`.
## 🔑 Что даёт один ключ

| | |
| --- | --- |
| Провайдер | **Alysis Code** — [alysiscode.com](https://alysiscode.com) |
| Что даёт провайдер | **50 кредитов каждые 30 дней** на хостед-тарифе (без карты) |
| Что даёт один ключ | ключ шлюза `slk_...` на собственном аккаунте, проверенный чатом на `deepseek-flash` |
| Форма API | OpenAI-совместимая: `POST .../functions/v1/llm/v1/chat/completions` |
| Ваши данные | контактируют только проект Supabase за `alysiscode.com` и ваш бэкенд почтового ящика |

## 🐞 Проблемы

Если Alysis Code изменит свой проект Supabase, свой гейт Turnstile или device-flow, инструмент остановится на этом шаге и скажет, на каком. **[Откройте issue](../../issues)** с командой и точным выводом.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 alysiscode-bulk-apikey contributors

</div>