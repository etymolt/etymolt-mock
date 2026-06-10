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

Both `@etymolt/sdk` (Node) and `etymolt` (Python) SDKs honor `ETYMOLT_BASE_URL`.

## What you get

- `POST /v1/verify` — returns an EVP/1 verdict deterministically derived from the name.
- `GET /.well-known/evp-keys.json` — a stub JWKS for signature-verification testing.

Same name → same verdict, every time. SHA-256 of the name buckets into one of four fixture templates:

| Verdict | Canonical test name |
|---|---|
| `PROCEED` | `Inkstack`, `Aiyana`, `Lyra` |
| `ITERATE` | `Forgent`, `Tessera`, `Nexa` |
| `ABANDON` | `Stratagem` |
| `INSUFFICIENT_SIGNAL` | `Sigil` |

If you need a specific verdict path, use one of the canonical names above. Other names map deterministically into one of the four buckets via the same hash.

## The verdict envelope

Fixtures match the EVP/1 wire format:

```json
{
  "evp_version": "1.0.0",
  "verdict": "PROCEED" | "ITERATE" | "DECIDE" | "ABANDON" | "INSUFFICIENT_SIGNAL",
  "score": <int> | null,
  "axes": {
    "trademark":      { "status": "...", "score": ..., "confidence": ... },
    "domain":         { ... },
    "cultural":       { ... },
    "sound_symbolism":{ ... },
    "pronunciation":  { ... }
  },
  "verdict_id": "mock_...",
  "issued_at": "...",
  "valid_until": "...",
  "disclaimer": "...",
  "signature": "mock-sig-...",
  "signature_key_id": "mock-key-1",
  "signature_payload_digest": "..."
}
```

Score is `null` when the verdict is `INSUFFICIENT_SIGNAL`.

## License

Apache-2.0.
