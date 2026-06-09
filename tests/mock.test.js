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

test("verdictFor includes the required disclaimer", () => {
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
