import { test } from "node:test";
import assert from "node:assert/strict";
import { verdictFor } from "../src/index.js";

test("verdictFor is deterministic", () => {
  const a = verdictFor("Inkstack");
  const b = verdictFor("Inkstack");
  assert.equal(a.verdict, b.verdict);
  assert.equal(a.score, b.score);
});

test("verdictFor stamps the name", () => {
  const v = verdictFor("Stratagem");
  assert.equal(v.name, "Stratagem");
});

test("verdictFor includes the required disclaimer verbatim", () => {
  const v = verdictFor("Sigil");
  assert.ok(v.disclaimer.includes("records of record"));
  assert.ok(v.disclaimer.includes("not a law firm"));
});

test("verdictFor sets temporal validity", () => {
  const v = verdictFor("Aiyana");
  assert.ok(v.issued_at);
  assert.ok(v.valid_until);
  assert.ok(new Date(v.valid_until) > new Date(v.issued_at));
});

test("axes use canonical names (sound_symbolism, not sound)", () => {
  const v = verdictFor("Inkstack");
  assert.ok("sound_symbolism" in v.axes, "expected sound_symbolism axis");
  assert.ok(!("sound" in v.axes), "old 'sound' axis must be gone");
  for (const k of ["trademark", "domain", "cultural", "sound_symbolism", "pronunciation"]) {
    assert.ok(k in v.axes, `missing axis ${k}`);
  }
});

test("canonical name buckets — verified against actual hash output", () => {
  // After 3-value migration, hash buckets re-shuffle. Verify the actual mapping.
  // Use these canonical names for tests requiring specific verdicts.
  assert.equal(verdictFor("Stratagem").verdict, "ABANDON");
  assert.equal(verdictFor("Forgent").verdict, "PROCEED");
  // Sigil → ABANDON with status:partial (was INSUFFICIENT_SIGNAL)
  const sigil = verdictFor("Sigil");
  assert.equal(sigil.verdict, "ABANDON");
  assert.equal(sigil.status, "partial");
  // Inkstack → PROCEED_STRATEGIC (the new 3-value tier)
  assert.equal(verdictFor("Inkstack").verdict, "PROCEED_STRATEGIC");
});

test("partial status has null score", () => {
  const v = verdictFor("Sigil");
  assert.equal(v.status, "partial");
  assert.equal(v.score, null);
});

test("evp_version present on every verdict", () => {
  const v = verdictFor("Anything");
  assert.match(v.evp_version, /^1\.\d+\.\d+$/);
});
