// Deterministic verdict generator. Same name → same verdict, every time.
// Picks a fixture based on a stable hash of the name.

import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

const FIXTURES = readdirSync(fixturesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(fixturesDir, f), "utf8")));

/**
 * Deterministic verdict for any name.
 * Hash → bucket → fixture template → template the name in.
 */
export function verdictFor(name) {
  const h = createHash("sha256").update(name).digest();
  const bucket = h.readUInt32BE(0) % FIXTURES.length;
  const template = FIXTURES[bucket];

  const now = new Date();
  const validUntil = new Date(now.getTime() + 24 * 3600 * 1000);

  return {
    ...template,
    name,
    verdict_id: `mock_${h.toString("hex").slice(0, 16)}`,
    issued_at: now.toISOString(),
    valid_until: validUntil.toISOString(),
    permalink: `http://localhost:4242/v/mock_${h.toString("hex").slice(0, 16)}`,
  };
}
