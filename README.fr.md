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

**Créez en masse des comptes Alysis Code et générez une clé de passerelle hébergée par compte (slk_...) — inférence compatible OpenAI derrière la passerelle LLM Alysis Code, plus un connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](undefined)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-undefined-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi ce projet existe

Alysis Code est un agent de codage en CLI sous Apache-2.0 (`pipx install alysis-code`) dont l'offre hébergée tourne derrière un projet Supabase — il n'y a **ni panneau ni `/api/status`** sur lequel se baser. La surface du compte est l'authentification Supabase plus trois edge functions, et le justificatif d'accès que le produit lui-même utilise est une clé de passerelle en flux d'appareil (`slk_...`) pour un proxy compatible OpenAI. Chaque compte bénéficie d'une **allocation gratuite récurrente (50 crédits / 30 jours)**, donc un compte = une clé = un quota gratuit. Prouvé en générant **10 comptes → 10 clés vérifiées** et en les re-vérifiant avec la CLI publiée (`--verify-only` : **10/10 chat-200**).

## 🎁 Offre gratuite — ce que vous obtenez

| Quoi | Valeur |
| --- | --- |
| Allocation gratuite | **50 crédits tous les 30 jours** par compte (`100 crédits = 1 $` d'utilisation ; le rechargement compte à partir du dernier rechargement, les crédits non utilisés ne sont pas reportés) |
| Carte | **aucune requise** |
| Modèles hébergés | DeepSeek V4.1 Flash, GLM 5.3 Flash, GPT-6 Luna, Claude Haiku 5.5 — un solde partagé |
| Plafonds glissants | 25 crédits de base / 5 h et 50 / 7 j sur l'offre gratuite |
| Tarification en heure de pointe | Lun-Ven 01:00-04:00 & 06:00-10:00 UTC doublent les tarifs |
| L'unité qui évolue | **un compte = une clé** |
| Limitation d'inscription | une inscription réussie est plafonnée **par IP** — mesuré : ~13 comptes depuis une même sortie, puis `403 We could not create an account with these details` jusqu'à ce que la sortie change |

> 💡 L'offre gratuite est définie par Alysis Code et peut changer. Consultez les chiffres en direct sur [alysiscode.com](https://alysiscode.com) — et laissez la barrière de l'outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — tous les undefined d'entre eux

## 🧪 Comment utiliser l'API

L'URL de base est **\`https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1\`** — compatible OpenAI, donc tout ce qui parle OpenAI fonctionne (SDK, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Démarrage rapide

### 🖱️ Le lanceur

## ✅ Vérifié et fonctionnel — chaque clé est testée

| Vérification | Résultat |
| --- | --- |
| `GET {supa}/auth/v1/settings` | **200** — `email: true`, `disable_signup: false`, `mailer_autoconfirm: false` |
| `POST {supa}/auth/v1/signup` sans jeton captcha | **400** `captcha_failed` |
| `POST {supa}/auth/v1/signup` avec un jeton action=`signup` | **200** (pas de session — le mail de confirmation est requis) |
| mail de confirmation | `noreply@<panel-mail>`, `Confirm your email for Alysis Code`, lien `.../auth/confirm#token_hash=<hex>&type=email` |
| `POST {supa}/auth/v1/verify` | **200** avec un JWT de session |
| `POST {fn}/device-code` | **200** `{device_code, user_code, expires_in: 900, interval: 5}` |
| `POST {fn}/device-approve` | **200** `{"status":"approved"}` |
| `POST {fn}/device-token` | **200** `{"status":"approved","key":"slk_..."}` |
| `POST {gw}/chat/completions` avec un JWT de session | **401** `Missing Alysis key` |
| `POST {gw}/chat/completions` avec `slk_...` (chaque clé avant d'être écrite) | **200** avec du contenu (`PONG`) — génération **10/10**, `--verify-only` **10/10** |
| limitation d'inscription | ~13 comptes depuis une même sortie -> `403 We could not create an account with these details` ; une sortie différente s'est inscrite du premier coup |

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Alysis Code page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Notes |
| --- | --- | --- |
| boîte mail | Emailnator `POST /api/generate-email` | un nouveau @gmail.com par compte, forme sans point |
| captcha | solveur `--captcha-cmd`, action=`signup` | avec interface ; même sortie que l'inscription |
| inscription | `POST {supa}/auth/v1/signup` | 200 sans session ; `403 could not create...` = limitation de sortie, `422 already registered` = adresse |
| lecture | Emailnator `/api/message-list` -> `/api/message/<id>` | marque en premier (`alysisai`), extraire `token_hash` |
| vérification | `POST {supa}/auth/v1/verify` | renvoie le JWT de session |
| appareil | `POST {fn}/device-code` | `{device_code, user_code}`, durée de vie de 15 minutes |
| approbation | captcha (action=`device_approve`) + `POST {fn}/device-approve` | bearer = le JWT de session |
| clé | `POST {fn}/device-token` | champ de réponse `key` (`slk_...`) |
| barrière | `POST {gw}/chat/completions` | 200 avec contenu ou contenu de raisonnement = conserver |

## ⚙️ Options de la CLI

```bash
node src/cli.js --count 10            # mint (chat gate per account)
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # exit pool self-test against the Supabase settings endpoint
node src/cli.js --connect-9router     # register keys.txt with a local 9Router
node src/cli.js --help
```

| Env | Défaut | Signification |
| --- | --- | --- |
| `ALYSISCODE_PROXIES` | `proxies.txt` | pool de sorties, une ligne par proxy |
| `ANALYSISCODE_CAPTCHA_CMD` | — | la commande du solveur (espaces réservés ci-dessus) |
| `ALYSISCODE_SUPABASE_URL` / `ALYSISCODE_ANON_KEY` / `ALYSISCODE_TURNSTILE_SITEKEY` | le projet derrière alysiscode.com | remplacements pour un projet redéployé |

Les comptes sont générés **en série** : le plafond d'inscription est par sortie, donc des solveurs parallèles ne font que se disputer le même quota.

## 🛰️ Derrière un proxy

**Facultatif — mais le fournisseur le rend quasiment obligatoire à toute échelle.**

- **Avec un pool :** `--pool <file>` (ou `ALYSISCODE_PROXIES`) et chaque requête pour un compte passe par une sortie épinglée, de sorte que le captcha n'est jamais émis par une adresse et consommé par une autre. Une inscription qui atteint le plafond par IP **grille cette sortie pendant `--cooldown` minutes** et le compte passe au suivant. L'exécution est **fail-closed** : un pool sans sortie utilisable abandonne au lieu de laisser fuiter une requête depuis votre propre adresse.
- **Sans pool :** la CLI affiche `running WITHOUT a proxy (direct)` ; le plafond est alors le vôtre, donc une exécution directe est un test de fumée à un seul compte.

La rotation est **série** avec un temps de refroidissement en cours de processus : une rotation à 4 sorties avec un refroidissement de 15 minutes a fait passer cette génération de 4/10 à 10/10 après que la première sortie a été limitée.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne — ignoré par git |
| `accounts.jsonl` | e-mail / mot de passe / uid / sortie / base_url / modèle / barrière — ignoré par git |
| `proxies.txt` | vos sorties — ignoré par git |
| `out/` | journaux d'exécution et fichiers captcha par jeton — ignoré par git |

## 🔌 Se connecter à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé, compatible OpenAI.

```bash
node src/cli.js --connect-9router
```

Valeurs par défaut : `--prefix alysis`, `--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`, `--model deepseek-flash`. Les modèles sont servis sous `alysis/<model id>`.

## 🔌 Se connecter à OmniRoute

[OmniRoute](https://omniroute.online) est un routeur auto-hébergé, compatible OpenAI.

```bash
node src/cli.js --connect-omniroute
```

Valeurs par défaut : `--prefix alysis`, `--base-url https://vzigujbcjjmpntxhmyvr.supabase.co/functions/v1/llm/v1`, `--model deepseek-flash`. Les modèles sont servis sous `alysis/<model id>`.
## 🔑 Ce qu'une clé vous apporte

| | |
| --- | --- |
| Fournisseur | **Alysis Code** — [alysiscode.com](https://alysiscode.com) |
| Ce que le fournisseur donne | **50 crédits tous les 30 jours** sur l'offre hébergée (sans carte) |
| Ce qu'une clé vous apporte | une clé de passerelle `slk_...` sur son propre compte, vérifiée par chat sur `deepseek-flash` |
| Forme de l'API | Compatible OpenAI : `POST .../functions/v1/llm/v1/chat/completions` |
| Vos données | seuls le projet Supabase derrière `alysiscode.com` et votre backend de boîte mail sont contactés |

## 🐞 Problèmes

Si Alysis Code change son projet Supabase, sa barrière Turnstile ou le flux d'appareil, l'outil s'arrête à cette étape et indique laquelle. **[Ouvrez un ticket](../../issues)** avec la commande et la sortie exacte.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 alysiscode-bulk-apikey contributors

</div>