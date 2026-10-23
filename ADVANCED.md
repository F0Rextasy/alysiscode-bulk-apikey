# Advanced: captcha escape hatches

The default mint path is fully automatic: `node src/cli.js --auto --count 1` solves
the Cloudflare Turnstile in the embedded browser rail (`src/solver.js`, driven by
`puppeteer-core`), once per token, on the same pinned exit that then spends it.
Nothing else has to be installed or run by hand.

The flags below exist for the rare case where you already run your own solver and
want to plug it in instead. They are not needed for a normal run.

## `--captcha-cmd "<command>"`

Runs your own command once per token and reads the token back from stdout or from
the file named by `{tokenfile}`. Placeholders substituted in the command:

| placeholder   | value                                                             |
| ------------- | ----------------------------------------------------------------- |
| `{action}`    | `signup` \| `device_approve` (tokens are single-use per action)   |
| `{url}`       | `https://alysiscode.com/signup` \| `https://alysiscode.com/activate` |
| `{label}`     | unique label for this token (`alysis-<tag>-<su\|ap>-<attempt>`)   |
| `{proxy}`     | the pinned exit line, empty in direct mode                        |
| `{tokenfile}` | file your command should write the token into                     |

The command must print the token on stdout or write it to `{tokenfile}`. If you
set this flag, the embedded solver is not used at all.

```sh
node src/cli.js --auto --count 1 \
  --captcha-cmd 'node my-solver.js --url {url} --action {action} --proxy {proxy} --label {label}'
```

## `--captcha-timeout <seconds>`

Seconds allowed for **one** `--captcha-cmd` invocation. Default `420`. Ignored when
the embedded solver runs (it has its own internal timeout).

## `ALYSISCODE_CAPTCHA_CMD`

Environment variable holding the same command as `--captcha-cmd`, so you can keep
it out of the command line. Precedence: `--captcha-cmd` > `ALYSISCODE_CAPTCHA_CMD`.

```sh
ALYSISCODE_CAPTCHA_CMD='node my-solver.js --url {url} --action {action}' \
  node src/cli.js --auto --count 3
```

The legacy spelling `ANALYSISCODE_CAPTCHA_CMD` is still read as a fallback.
