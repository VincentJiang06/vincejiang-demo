import { test } from "node:test";
import assert from "node:assert/strict";
import {
  encodeRecord,
  decodeRecord,
  validateRecord,
  newRecord,
} from "../src/model.js";
test("URL restores every field including Chinese, emoji and symbols", () => {
  const r = {
    ...newRecord(),
    name: "耳机 NM10 🎧 & / # ?",
    signature: "江 Vince + 测试",
    date: "2026-10-08",
    bands: [2, 0, 1, 2, 0],
    values: [0, 25, 50, 75, 100],
  };
  const restored = decodeRecord("#review=" + encodeRecord(r));
  for (const k of ["name", "signature", "date", "bands", "values"])
    assert.deepEqual(restored[k], r[k]);
});
test("only the five discrete positions can be encoded", () => {
  for (const v of [0, 25, 50, 75, 100])
    assert.doesNotThrow(() =>
      validateRecord({ ...newRecord(), values: Array(5).fill(v) }),
    );
  for (const v of [-1, 1, 26, 99, 101, NaN])
    assert.throws(() =>
      validateRecord({ ...newRecord(), values: Array(5).fill(v) }),
    );
});
test("invalid URL data, shape, lengths and bands are rejected", () => {
  for (const s of ["bad!", "e30", "a".repeat(5001)])
    assert.throws(() => decodeRecord(s));
  assert.throws(() => validateRecord({ ...newRecord(), bands: [0] }));
  assert.throws(() => validateRecord({ ...newRecord(), name: "x".repeat(81) }));
  assert.throws(() =>
    validateRecord({ ...newRecord(), bands: [0, 0, 0, 0, 3] }),
  );
});

test("all six themes survive sharing and older links default to mint", () => {
  for (let theme = 0; theme < 6; theme++) {
    assert.equal(
      decodeRecord(encodeRecord({ ...newRecord(), theme })).theme,
      theme,
    );
  }
  const legacy = newRecord();
  delete legacy.theme;
  assert.equal(validateRecord(legacy).theme, 0);
  for (const theme of [-1, 6, 1.5, "1", null]) {
    assert.throws(() => validateRecord({ ...newRecord(), theme }));
  }
});
