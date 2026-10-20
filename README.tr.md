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

**Toplu olarak Alysis Code hesabı oluşturun ve her hesap için bir barındırılan ağ geçidi anahtarı (slk_...) üretin — Alysis Code LLM ağ geçidi arkasında OpenAI uyumlu çıkarım, ayrıca bir 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](undefined)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-undefined-of-them) · [🧪 API'yi kullanın](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

Alysis Code, Apache-2.0 lisanslı bir CLI kodlama ajanıdır (`pipx install alysis-code`) ve barındırılan katmanı bir Supabase projesinin arkasında çalışır — üzerinde kapı oluşturabileceğiniz **ne bir panel ne de bir `/api/status`** vardır. Hesap yüzeyi Supabase kimlik doğrulaması artı üç edge fonksiyonundan oluşur ve ürünün kendisinin kullandığı kimlik bilgisi, OpenAI uyumlu bir proxy için cihaz akışı ağ geçidi anahtarıdır (`slk_...`). Her hesap, yinelenen bir **ücretsiz kota (50 kredi / 30 gün)** taşır, yani bir hesap = bir anahtar = bir ücretsiz kota. **10 hesap → 10 doğrulanmış anahtar** üretilerek ve bunlar yayımlanan CLI ile yeniden kanıtlanarak (`--verify-only`: **10/10 chat-200**) doğrulanmıştır.

## 🎁 Ücretsiz katman — ne kadar alıyorsunuz

| Ne | Değer |
| --- | --- |
| Ücretsiz kota | Hesap başına **her 30 günde 50 kredi** (`100 kredi = 1 $` kullanım; yenileme son yenilemeden itibaren sayılır, kullanılmayan krediler devretmez) |
| Kart | **gerekmez** |
| Barındırılan modeller | DeepSeek V4.1 Flash, GLM 5.3 Flash, GPT-6 Luna, Claude Haiku 5.5 — tek paylaşılan bakiye |
| Kayan limitler | Ücretsiz planda 25 temel kredi / 5 sa ve 50 / 7 g |
| Yoğun saat fiyatlandırması | Pzt-Cum 01:00-04:00 ve 06:00-10:00 UTC arası ücretler iki katına çıkar |
| Ölçeklenen birim | **bir hesap = bir anahtar** |
| Kayıt sınırlaması | başarılı bir kayıt **IP başına** sınırlandırılır — ölçüldü: tek bir çıkıştan ~13 hesap, ardından çıkış değişene kadar `403 We could not create an account with these details` |

> 💡 Ücretsiz katman Alysis Code tarafından belirlenir ve değişebilir. Güncel sayıları [alysiscode.com](https://alysiscode.com) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modeller — hepsi undefined

## 🧪 API nasıl kullanılır

Temel URL **\`https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1\`** — OpenAI uyumludur, yani OpenAI konuşan her şey çalışır (SDK'lar, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Hızlı başlangıç

### 🖱️ Başlatıcı

## ✅ Çalıştığı doğrulandı — her anahtar test edilir

| Kontrol | Sonuç |
| --- | --- |
| `GET {supa}/auth/v1/settings` | **200** — `email: true`, `disable_signup: false`, `mailer_autoconfirm: false` |
| Captcha belirteci olmadan `POST {supa}/auth/v1/signup` | **400** `captcha_failed` |
| action=`signup` belirteci ile `POST {supa}/auth/v1/signup` | **200** (oturum yok — onay e-postası gerekli) |
| onay e-postası | `noreply@<panel-mail>`, `Confirm your email for Alysis Code`, bağlantı `.../auth/confirm#token_hash=<hex>&type=email` |
| `POST {supa}/auth/v1/verify` | Oturum JWT'si ile **200** |
| `POST {fn}/device-code` | **200** `{device_code, user_code, expires_in: 900, interval: 5}` |
| `POST {fn}/device-approve` | **200** `{"status":"approved"}` |
| `POST {fn}/device-token` | **200** `{"status":"approved","key":"slk_..."}` |
| Oturum JWT'si ile `POST {gw}/chat/completions` | **401** `Missing Alysis key` |
| `slk_...` ile `POST {gw}/chat/completions` (yazılmadan önceki her anahtar) | İçerikle **200** (`PONG`) — üretim **10/10**, `--verify-only` **10/10** |
| Kayıt sınırlaması | Tek çıkıştan ~13 hesap -> `403 We could not create an account with these details`; farklı bir çıkış ilk denemede kaydoldu |

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Alysis Code page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| posta kutusu | Emailnator `POST /api/generate-email` | hesap başına bir taze @gmail.com, noktasız biçim |
| captcha | `--captcha-cmd` çözücü, action=`signup` | başlıklı; kayıtla aynı çıkış |
| kayıt | `POST {supa}/auth/v1/signup` | oturum olmadan 200; `403 could not create...` = çıkış sınırlaması, `422 already registered` = adres |
| okuma | Emailnator `/api/message-list` -> `/api/message/<id>` | marka öncelikli (`alysisai`), `token_hash` çıkar |
| doğrulama | `POST {supa}/auth/v1/verify` | oturum JWT'sini döndürür |
| cihaz | `POST {fn}/device-code` | `{device_code, user_code}`, 15 dakika ömür |
| onay | captcha (action=`device_approve`) + `POST {fn}/device-approve` | bearer = oturum JWT'si |
| anahtar | `POST {fn}/device-token` | yanıt alanı `key` (`slk_...`) |
| kapı | `POST {gw}/chat/completions` | içerik veya akıl yürütme içeriğiyle 200 = sakla |

## ⚙️ CLI seçenekleri

```bash
node src/cli.js --count 10            # mint (chat gate per account)
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # exit pool self-test against the Supabase settings endpoint
node src/cli.js --connect-9router     # register keys.txt with a local 9Router
node src/cli.js --help
```

| Ortam | Varsayılan | Anlam |
| --- | --- | --- |
| `ALYSISCODE_PROXIES` | `proxies.txt` | çıkış havuzu, her satırda bir proxy |
| `ANALYSISCODE_CAPTCHA_CMD` | — | çözücü komutu (yukarıdaki yer tutucular) |
| `ALYSISCODE_SUPABASE_URL` / `ALYSISCODE_ANON_KEY` / `ALYSISCODE_TURNSTILE_SITEKEY` | alysiscode.com arkasındaki proje | yeniden dağıtılan bir proje için geçersiz kılmalar |

Hesaplar **seri olarak** üretilir: kayıt sınırı çıkış başınadır, bu yüzden paralel çözücüler yalnızca aynı kota için yarışır.

## 🛰️ Proxy arkasında

**İsteğe bağlı — ancak sağlayıcı bunu her ölçekte neredeyse zorunlu kılar.**

- **Havuzla:** `--pool <file>` (veya `ALYSISCODE_PROXIES`) ve bir hesap için her istek tek bir sabitlenmiş çıkıştan geçer, böylece captcha asla bir adres tarafından verilip başka bir adres tarafından harcanmaz. IP başına sınıra takılan bir kayıt, **o çıkışı `--cooldown` dakika boyunca yakar** ve hesap devam eder. Çalışma **fail-closed**'dur: kullanılabilir çıkışı olmayan bir havuz, kendi adresinizden bir istek sızdırmak yerine iptal eder.
- **Havuz olmadan:** CLI `running WITHOUT a proxy (direct)` yazdırır; sınır o zaman size aittir, bu yüzden doğrudan çalıştırma tek hesaplı bir duman testidir.

Rotasyon, süreç içi bir bekleme süresiyle **seridir**: 15 dakikalık bekleme süreli 4 çıkışlı bir rotasyon, ilk çıkış sınırlandıktan sonra bu üretimi 4/10'dan 10/10'a taşıdı.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başına bir canlı doğrulanmış anahtar — git tarafından yok sayılır |
| `accounts.jsonl` | e-posta / parola / uid / çıkış / base_url / model / kapı — git tarafından yok sayılır |
| `proxies.txt` | çıkışlarınız — git tarafından yok sayılır |
| `out/` | çalıştırma günlükleri ve belirteç başına captcha dosyaları — git tarafından yok sayılır |

## 🔌 9Router'a bağlan

[9Router](https://9router.com) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir.

```bash
node src/cli.js --connect-9router
```

Varsayılanlar: `--prefix alysis`, `--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`, `--model deepseek-flash`. Modeller `alysis/<model id>` olarak sunulur.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| Sağlayıcı | **Alysis Code** — [alysiscode.com](https://alysiscode.com) |
| Sağlayıcının verdiği | Barındırılan katmanda **her 30 günde 50 kredi** (kart yok) |
| Bir anahtarın size kazandırdığı | Kendi hesabında bir `slk_...` ağ geçidi anahtarı, `deepseek-flash` üzerinde sohbet doğrulamalı |
| API biçimi | OpenAI uyumlu: `POST .../functions/v1/llm/v1/chat/completions` |
| Verileriniz | yalnızca `alysiscode.com` arkasındaki Supabase projesi ve gelen kutunuzun arka ucu ile iletişime geçilir |

## 🐞 Sorunlar

Alysis Code, Supabase projesini, Turnstile kapısını veya cihaz akışını değiştirirse araç o adımda durur ve hangisi olduğunu söyler. Komut ve tam çıktıyla birlikte **[bir sorun açın](../../issues)**.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 alysiscode-bulk-apikey katkıda bulunanlar

</div>