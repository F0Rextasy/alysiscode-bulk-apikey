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

**批量创建 Alysis Code 账户，并为每个账户铸造一个托管网关密钥（slk_...）——通过 Alysis Code LLM 网关提供 OpenAI 兼容推理，外加一个 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](undefined)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-undefined-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么会有这个项目

Alysis Code 是一个 Apache-2.0 许可的 CLI 编程代理（`pipx install alysis-code`），其托管层运行在一个 Supabase 项目之后——**没有面板，也没有 `/api/status`** 可供判断。账户接口是 Supabase 认证加上三个边缘函数，而产品自身使用的凭证是一个用于 OpenAI 兼容代理的设备流网关密钥（`slk_...`）。每个账户都带有循环发放的**免费额度（50 积分 / 30 天）**，因此一个账户 = 一个密钥 = 一份免费配额。已通过铸造 **10 个账户 → 10 个已验证密钥** 得到证实，并用已发布的 CLI 再次验证（`--verify-only`：**10/10 chat-200**）。

## 🎁 免费额度——你能获得多少

| 项目 | 值 |
| --- | --- |
| 免费额度 | 每个账户**每 30 天 50 积分**（`100 积分 = $1` 用量；重新计算从上次补充开始，未使用的积分不结转） |
| 银行卡 | **无需提供** |
| 托管模型 | DeepSeek V4.1 Flash、GLM 5.3 Flash、GPT-6 Luna、Claude Haiku 5.5——共享同一余额 |
| 滚动上限 | 免费计划下 25 基础积分 / 5 小时和 50 / 7 天 |
| 高峰定价 | 周一至周五 01:00-04:00 与 06:00-10:00 UTC 费率翻倍 |
| 可扩展的单位 | **一个账户 = 一个密钥** |
| 注册限流 | 成功注册受**每 IP** 限制——实测：从同一出口约 13 个账户，之后出现 `403 We could not create an account with these details`，直到更换出口 |

> 💡 免费额度由 Alysis Code 设定，可能会变化。请在 [alysiscode.com](https://alysiscode.com) 查看实时数字——并让工具自身的关卡来判定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型——全部 undefined 个

## 🧪 如何使用 API

基础 URL 是 **\`https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1\`**——OpenAI 兼容，因此任何支持 OpenAI 的工具都能使用（SDK、Cursor、OpenCode、Kilo Code 等）。

```bash
curl https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 快速开始

### 🖱️ 启动器

## ✅ 已验证可用——每个密钥都经过测试

| 检查 | 结果 |
| --- | --- |
| `GET {supa}/auth/v1/settings` | **200** — `email: true`、`disable_signup: false`、`mailer_autoconfirm: false` |
| 不带验证码令牌的 `POST {supa}/auth/v1/signup` | **400** `captcha_failed` |
| 带 action=`signup` 令牌的 `POST {supa}/auth/v1/signup` | **200**（无会话——需要确认邮件） |
| 确认邮件 | `noreply@<panel-mail>`、`Confirm your email for Alysis Code`、链接 `.../auth/confirm#token_hash=<hex>&type=email` |
| `POST {supa}/auth/v1/verify` | **200**，返回会话 JWT |
| `POST {fn}/device-code` | **200** `{device_code, user_code, expires_in: 900, interval: 5}` |
| `POST {fn}/device-approve` | **200** `{"status":"approved"}` |
| `POST {fn}/device-token` | **200** `{"status":"approved","key":"slk_..."}` |
| 带会话 JWT 的 `POST {gw}/chat/completions` | **401** `Missing Alysis key` |
| 带 `slk_...` 的 `POST {gw}/chat/completions`（每个密钥在写入前） | **200**，返回内容（`PONG`）——铸造 **10/10**，`--verify-only` **10/10** |
| 注册限流 | 从同一出口约 13 个账户 -> `403 We could not create an account with these details`；更换出口后首次尝试即注册成功 |

## 🧭 工作原理

```

inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Alysis Code page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 备注 |
| --- | --- | --- |
| 邮箱 | Emailnator `POST /api/generate-email` | 每个账户一个全新的 @gmail.com，无点形式 |
| 验证码 | `--captcha-cmd` 求解器，action=`signup` | 有头模式；与注册使用同一出口 |
| 注册 | `POST {supa}/auth/v1/signup` | 200 但无会话；`403 could not create...` = 出口限流，`422 already registered` = 地址已被注册 |
| 读取 | Emailnator `/api/message-list` -> `/api/message/<id>` | 优先品牌（`alysisai`），提取 `token_hash` |
| 验证 | `POST {supa}/auth/v1/verify` | 返回会话 JWT |
| 设备 | `POST {fn}/device-code` | `{device_code, user_code}`，有效期 15 分钟 |
| 批准 | 验证码（action=`device_approve`）+ `POST {fn}/device-approve` | bearer = 会话 JWT |
| 密钥 | `POST {fn}/device-token` | 应答字段 `key`（`slk_...`） |
| 关卡 | `POST {gw}/chat/completions` | 200 且返回内容或推理内容 = 保留 |

## ⚙️ CLI 选项

```bash
node src/cli.js --count 10            # mint (chat gate per account)
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # exit pool self-test against the Supabase settings endpoint
node src/cli.js --connect-9router     # register keys.txt with a local 9Router
node src/cli.js --help
```

| 环境变量 | 默认值 | 含义 |
| --- | --- | --- |
| `ALYSISCODE_PROXIES` | `proxies.txt` | 出口池，每行一个代理 |
| `ANALYSISCODE_CAPTCHA_CMD` | — | 求解器命令（占位符见上文） |
| `ALYSISCODE_SUPABASE_URL` / `ALYSISCODE_ANON_KEY` / `ALYSISCODE_TURNSTILE_SITEKEY` | alysiscode.com 背后的项目 | 用于重新部署项目的覆盖值 |

账户是**串行**铸造的：注册上限按出口计算，因此并行求解器只会争抢同一配额。

## 🛰️ 在代理之后

**可选——但服务商在任何规模下都几乎使其成为必需。**

- **使用代理池时：** `--pool <file>`（或 `ALYSISCODE_PROXIES`），账户的每个请求都通过一个固定出口，因此验证码绝不会由一个地址签发而由另一个地址使用。触发每 IP 上限的注册会**将该出口冷却 `--cooldown` 分钟**，账户继续前进。运行是**故障关闭**的：没有可用出口的代理池会中止，而不是从你自己的地址泄露请求。
- **不使用代理池时：** CLI 会打印 `running WITHOUT a proxy (direct)`；此时上限就是你自己的，因此直接运行只是单账户冒烟测试。

轮换是**串行**的，带有进程内冷却：一个 4 出口轮换、15 分钟冷却，在第一个出口被限流后，将本次铸造从 4/10 提升到 10/10。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个经实时验证的密钥——已被 git 忽略 |
| `accounts.jsonl` | 邮箱 / 密码 / uid / 出口 / base_url / 模型 / 关卡——已被 git 忽略 |
| `proxies.txt` | 你的出口——已被 git 忽略 |
| `out/` | 运行日志和每个令牌的验证码文件——已被 git 忽略 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管的、OpenAI 兼容的路由器。

```bash
node src/cli.js --connect-9router
```

默认值：`--prefix alysis`、`--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`、`--model deepseek-flash`。模型以 `alysis/<model id>` 形式提供。

## 🔌 连接到 OmniRoute

[OmniRoute](https://omniroute.online) 是一个自托管的、OpenAI 兼容的路由器。

```bash
node src/cli.js --connect-omniroute
```

默认值：`--prefix alysis`、`--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`、`--model deepseek-flash`。模型以 `alysis/<model id>` 形式提供。

## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 服务商 | **Alysis Code** — [alysiscode.com](https://alysiscode.com) |
| 服务商提供 | 托管层**每 30 天 50 积分**（无需银行卡） |
| 一个密钥能给你什么 | 在其自身账户上的 `slk_...` 网关密钥，已在 `deepseek-flash` 上通过聊天验证 |
| API 形态 | OpenAI 兼容：`POST .../functions/v1/llm/v1/chat/completions` |
| 你的数据 | 仅会联系 `alysiscode.com` 背后的 Supabase 项目和你自己的收件箱后端 |

## 🐞 问题反馈

如果 Alysis Code 更改了其 Supabase 项目、Turnstile 关卡或设备流，工具会在该步骤停止并说明是哪一步。**[提交 issue](../../issues)**，附上命令和确切输出。

## 📄 许可证

MIT © 2026 — 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 alysiscode-bulk-apikey contributors

</div>