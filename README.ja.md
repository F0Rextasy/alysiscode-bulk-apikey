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

**Alysis Code アカウントを一括作成し、アカウントごとにホスト型ゲートウェイキー（slk_...）を1つ発行します — Alysis Code LLM ゲートウェイの背後にある OpenAI 互換推論、さらに 9Router コネクタ付き。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](undefined)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-undefined-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題報告](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ なぜこれが存在するのか

Alysis Code は Apache-2.0 の CLI コーディングエージェント（`pipx install alysis-code`）で、そのホスト型ティアは Supabase プロジェクトの背後で動作します — ゲートとして使える**パネルも `/api/status` も存在しません**。アカウントの表面は Supabase 認証と3つのエッジ関数であり、製品自体が使用する認証情報は OpenAI 互換プロキシ用のデバイスフローゲートウェイキー（`slk_...`）です。すべてのアカウントには定期的な**無料枠（50クレジット / 30日）**が付与されるため、1アカウント = 1キー = 1無料クォータとなります。**10アカウント → 10検証済みキー**を発行して証明し、公開 CLI（`--verify-only`: **10/10 chat-200**）で再証明しています。

## 🎁 無料枠 — どれだけ得られるか

| 項目 | 値 |
| --- | --- |
| 無料枠 | アカウントごとに**30日ごとに50クレジット**（`100クレジット = $1` の使用量、補充は最後の補充からカウント、未使用クレジットは繰り越されない） |
| カード | **不要** |
| ホスト型モデル | DeepSeek V4.1 Flash、GLM 5.3 Flash、GPT-6 Luna、Claude Haiku 5.5 — 1つの共有残高 |
| ローリング上限 | 無料プランでは 25ベースクレジット / 5時間 および 50 / 7日 |
| ピーク料金 | 月〜金 01:00-04:00 & 06:00-10:00 UTC は料率が2倍 |
| スケールする単位 | **1アカウント = 1キー** |
| サインアップスロットル | 成功したサインアップは**IPごと**に制限される — 実測: 1つの出口から約13アカウント、その後出口が変わるまで `403 We could not create an account with these details` |

> 💡 無料枠は Alysis Code が設定するもので、変更される可能性があります。最新の数値は [alysiscode.com](https://alysiscode.com) で確認してください — そしてツール自身のゲートに判断させてください:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — そのすべて undefined

## 🧪 API の使い方

ベース URL は **\`https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1\`** です — OpenAI 互換なので、OpenAI を話せるものなら何でも動作します（SDK、Cursor、OpenCode、Kilo Code など）。

```bash
curl https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 クイックスタート

### 🖱️ ランチャー

## ✅ 検証済みで動作 — すべてのキーがテストされる

| チェック | 結果 |
| --- | --- |
| `GET {supa}/auth/v1/settings` | **200** — `email: true`、`disable_signup: false`、`mailer_autoconfirm: false` |
| キャプチャトークンなしの `POST {supa}/auth/v1/signup` | **400** `captcha_failed` |
| action=`signup` トークン付きの `POST {supa}/auth/v1/signup` | **200**（セッションなし — 確認メールが必要） |
| 確認メール | `noreply@<panel-mail>`、`Confirm your email for Alysis Code`、リンク `.../auth/confirm#token_hash=<hex>&type=email` |
| `POST {supa}/auth/v1/verify` | セッション JWT 付きで **200** |
| `POST {fn}/device-code` | **200** `{device_code, user_code, expires_in: 900, interval: 5}` |
| `POST {fn}/device-approve` | **200** `{"status":"approved"}` |
| `POST {fn}/device-token` | **200** `{"status":"approved","key":"slk_..."}` |
| セッション JWT 付きの `POST {gw}/chat/completions` | **401** `Missing Alysis key` |
| `slk_...` 付きの `POST {gw}/chat/completions`（書き込まれる前のすべてのキー） | コンテンツ付きで **200**（`PONG`） — 発行 **10/10**、`--verify-only` **10/10** |
| サインアップスロットル | 1つの出口から約13アカウント -> `403 We could not create an account with these details`、別の出口では初回で登録成功 |

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Alysis Code page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| メールボックス | Emailnator `POST /api/generate-email` | アカウントごとに1つの新しい @gmail.com、ドットなし形式 |
| キャプチャ | `--captcha-cmd` ソルバー、action=`signup` | ヘッド付き、サインアップと同じ出口 |
| サインアップ | `POST {supa}/auth/v1/signup` | セッションなしで200、`403 could not create...` = 出口スロットル、`422 already registered` = アドレス |
| 読み取り | Emailnator `/api/message-list` -> `/api/message/<id>` | ブランド優先（`alysisai`）、`token_hash` を抽出 |
| 検証 | `POST {supa}/auth/v1/verify` | セッション JWT を返す |
| デバイス | `POST {fn}/device-code` | `{device_code, user_code}`、15分間有効 |
| 承認 | キャプチャ（action=`device_approve`）+ `POST {fn}/device-approve` | bearer = セッション JWT |
| キー | `POST {fn}/device-token` | 応答フィールド `key`（`slk_...`） |
| ゲート | `POST {gw}/chat/completions` | コンテンツまたは推論コンテンツ付きで200 = 保持 |

## ⚙️ CLI オプション

```bash
node src/cli.js --count 10            # mint (chat gate per account)
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # exit pool self-test against the Supabase settings endpoint
node src/cli.js --connect-9router     # register keys.txt with a local 9Router
node src/cli.js --help
```

| 環境変数 | デフォルト | 意味 |
| --- | --- | --- |
| `ALYSISCODE_PROXIES` | `proxies.txt` | 出口プール、1行につき1プロキシ |
| `ANALYSISCODE_CAPTCHA_CMD` | — | ソルバーコマンド（プレースホルダは上記） |
| `ALYSISCODE_SUPABASE_URL` / `ALYSISCODE_ANON_KEY` / `ALYSISCODE_TURNSTILE_SITEKEY` | alysiscode.com の背後のプロジェクト | 再デプロイされたプロジェクト用のオーバーライド |

アカウントは**直列**で発行されます: サインアップ上限は出口ごとなので、並列ソルバーは同じクォータを奪い合うだけです。

## 🛰️ プロキシの背後で

**任意 — ただしプロバイダはどのような規模でもほぼ必須にします。**

- **プールあり:** `--pool <file>`（または `ALYSISCODE_PROXIES`）を使うと、アカウントのすべてのリクエストが1つの固定された出口を通るため、キャプチャが1つのアドレスで発行されて別のアドレスで消費されることはありません。IPごとの上限に達したサインアップは**その出口を `--cooldown` 分間焼き**、アカウントは次に進みます。実行は**フェイルクローズド**です: 使用可能な出口のないプールは、自分のアドレスからリクエストを漏らす代わりに中止します。
- **プールなし:** CLI は `running WITHOUT a proxy (direct)` と表示します。上限はあなた自身のものになるため、直接実行は単一アカウントのスモークテストです。

ローテーションは**直列**で、プロセス内クールダウン付きです: 15分のクールダウン付き4出口ローテーションで、最初の出口がスロットルされた後、この発行は4/10から10/10になりました。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 1行につき1つのライブ検証済みキー — git 無視 |
| `accounts.jsonl` | メール / パスワード / uid / 出口 / base_url / モデル / ゲート — git 無視 |
| `proxies.txt` | あなたの出口 — git 無視 |
| `out/` | 実行ログとトークンごとのキャプチャファイル — git 無視 |

## 🔌 9Router に接続

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです。

```bash
node src/cli.js --connect-9router
```

デフォルト: `--prefix alysis`、`--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`、`--model deepseek-flash`。モデルは `alysis/<model id>` として提供されます。

## 🔑 1つのキーで得られるもの

| | |
| --- | --- |
| プロバイダ | **Alysis Code** — [alysiscode.com](https://alysiscode.com) |
| プロバイダが提供するもの | ホスト型ティアで**30日ごとに50クレジット**（カード不要） |
| 1つのキーで得られるもの | 独自のアカウント上の `slk_...` ゲートウェイキー、`deepseek-flash` でチャット検証済み |
| API 形式 | OpenAI 互換: `POST .../functions/v1/llm/v1/chat/completions` |
| あなたのデータ | `alysiscode.com` の背後の Supabase プロジェクトとあなたの受信トレイバックエンドのみが接触される |

## 🐞 問題報告

Alysis Code がその Supabase プロジェクト、Turnstile ゲート、またはデバイスフローを変更した場合、ツールはそのステップで停止し、どれであるかを伝えます。コマンドと正確な出力を添えて **[issue を開いてください](../../issues)**。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 alysiscode-bulk-apikey contributors

</div>