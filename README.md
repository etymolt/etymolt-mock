# etymolt-mock — local mock EVP/1 server

> Develop your Etymolt integration offline. Deterministic verdicts from fixtures. No API key, no network.

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

## Use it

```bash
npx etymolt-mock
# → etymolt-mock listening on http://localhost:4242
```

Then point your SDK or app at it:

```bash
export ETYMOLT_BASE_URL=http://localhost:4242
```

```js
import { Etymolt } from "@etymolt/sdk";

const etymolt = new Etymolt({ baseUrl: "http://localhost:4242" });
const verdict = await etymolt.verify("Stratagem");
```

## What you get

- `POST /v1/verify` — returns an EVP/1 verdict deterministically derived from the name.
- `GET /.well-known/evp-keys.json` — a stub JWKS for signature-verification testing.

Same name → same verdict, every time. Use the four fixture names below to test each verdict path:

| Verdict | Pick names that hash into | Used in tests |
|---|---|---|
| `PROCEED` | (1 in 4 of any name) | `Inkstack` |
| `ITERATE` | (1 in 4 of any name) | `Stratagem` |
| `ABANDON` | (1 in 4 of any name) | `Sigil` |
| `INSUFFICIENT_SIGNAL` | (1 in 4 of any name) | `Aiyana` |

(Deterministic, but bucket assignment is by name-hash. The cookbook recipes use those four canonical names.)

## License

Apache-2.0.
