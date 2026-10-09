import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { makeRecord, makeResult } from "../cli/profile.mjs";
import { decodeRecord } from "../src/model.js";
const input = {
  name: "示例耳机 🎧 + #",
  bands: ["突出", "均衡", "收敛", "均衡", "突出"],
  steps: [1, 2, 3, 4, 5],
  date: "2026-10-09",
  signature: "江",
  theme: "blue",
};
test("CLI profile preserves the web contract and bilingual description", () => {
  const r = makeRecord(input);
  assert.deepEqual(r.values, [0, 25, 50, 75, 100]);
  assert.equal(r.theme, 1);
  const result = makeResult(r);
  const decoded = decodeRecord(new URL(result.url).hash);
  for (const k of ["name", "bands", "values", "date", "theme", "signature"])
    assert.deepEqual(decoded[k], r[k]);
  assert.match(result.description.zh, /动态温和/);
  assert.match(result.description.en, /transient slightly slow/);
});
test("missing evidence scores are not silently filled, and malformed values fail", () => {
  for (const patch of [
    { steps: undefined },
    { bands: [0, 1] },
    { steps: [1, 2, 3, 4, 6] },
    { steps: [1, 2, 3, 4, null] },
    { date: "2026-02-30" },
    { theme: "invalid" },
    { name: "" },
    { values: [0, 25, 50, 75, 100] },
  ])
    assert.throws(() => makeRecord({ ...input, ...patch }));
});
test("raw web values are accepted without confusing them with steps", () => {
  const { steps, ...r } = input;
  assert.deepEqual(
    makeRecord({ ...r, values: [100, 75, 50, 25, 0] }).values,
    [100, 75, 50, 25, 0],
  );
});
test("command produces machine-readable link/intro without browser, exits nonzero on bad input", () => {
  const p = spawnSync(
    process.execPath,
    [
      "cli/sound-dashboard.mjs",
      "--name",
      "Example",
      "--bands",
      "0,1,1,0,1",
      "--steps",
      "3,4,3,4,4",
      "--no-image",
      "--format",
      "json",
    ],
    { encoding: "utf8" },
  );
  assert.equal(p.status, 0, p.stderr);
  assert.equal(JSON.parse(p.stdout).record.name, "Example");
  assert.match(
    JSON.parse(p.stdout).url,
    /https:\/\/vincejiang.com\/sound_dashboard\/#review=/,
  );
  const bad = spawnSync(
    process.execPath,
    ["cli/sound-dashboard.mjs", "--name", "Example", "--no-image"],
    { encoding: "utf8" },
  );
  assert.equal(bad.status, 1);
  assert.equal(bad.stdout, "");
});
test("stdin profile accepts Unicode and remains non-interactive", () => {
  const p = spawnSync(
    process.execPath,
    [
      "cli/sound-dashboard.mjs",
      "--input",
      "-",
      "--no-image",
      "--format",
      "json",
    ],
    { encoding: "utf8", input: JSON.stringify(input) },
  );
  assert.equal(p.status, 0, p.stderr);
  assert.equal(JSON.parse(p.stdout).record.name, input.name);
});
