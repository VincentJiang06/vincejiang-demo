#!/usr/bin/env node
/* validate_lesson.mjs — deterministic per-node gate for the reactor-study pace+translate batch.
 *
 * The machine safety net that replaces the human read (owner waived the human checkpoint,
 * NOT the machine fidelity guarantee). Two modes:
 *
 *   --mode pace       orig = original zh lesson, new = paced zh lesson
 *     * file must import (valid .mjs / template literals intact)
 *     * block count + t[] sequence + ids/module/variant identical
 *     * FROZEN block types (anything not prose/callout/myth/intuit/applied) BYTE-IDENTICAL
 *     * within editable blocks: every number, node-ID (e.g. B07) and capitalized-Latin
 *       name/term in the ORIGINAL survives in the paced version (no dropped citation/name)
 *
 *   --mode translate  orig = paced zh lesson, new = en lesson
 *     * file must import
 *     * block count + t[] sequence + module names + config key-sets + array lengths identical
 *     * every number, node-ID and capitalized-Latin token in the zh survives in the en
 *       (facts frozen §4); char rules (no em-dash / exclamation) reported as warnings
 *
 * Usage: node validate_lesson.mjs --orig A.mjs --new B.mjs --mode pace|translate
 * Exit 0 = GATE PASS, 1 = GATE FAIL.
 */
import { pathToFileURL } from "node:url";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, v, i, arr) => {
    if (v.startsWith("--")) a.push([v.slice(2), arr[i + 1]]);
    return a;
  }, [])
);
const { orig, new: neu, mode, zhorig, enorig } = args;
if (!orig || !neu || !mode) {
  console.error("usage: node validate_lesson.mjs --orig A.mjs --new B.mjs --mode pace|translate [--zhorig zhOrig.mjs --enorig enOrig.mjs]");
  process.exit(2);
}

const EDITABLE = new Set(["prose", "callout", "myth", "intuit", "applied"]);
const fails = [];
const warns = [];

async function load(p) {
  try {
    const mod = await import(pathToFileURL(path.resolve(p)).href + `?t=${Date.now()}`);
    if (!mod.default || !Array.isArray(mod.default.blocks)) throw new Error("no default.blocks[]");
    return mod.default;
  } catch (e) {
    fails.push(`PARSE ${p}: ${e.message}`);
    return null;
  }
}

const stripTags = (s) => String(s).replace(/<[^>]+>/g, " ");
// fidelity tokens: numbers, node-IDs (B07/R14/…), capitalized-Latin names/terms
function tokens(str) {
  const t = stripTags(str);
  const nums = (t.match(/\d[\d.,]*\d|\d/g) || []).map((x) => x.replace(/[.,]+$/, ""));
  const ids = t.match(/\b[BRYKGCN]\d{2}\b/g) || [];
  const names = t.match(/\b[A-Z][A-Za-z][A-Za-z'’.\-]*\b/g) || [];
  return { nums: new Set(nums), ids: new Set(ids), names: new Set(names) };
}
function blockText(b) {
  // all human-text string values in a block (html + module config text)
  let s = "";
  const walk = (v) => {
    if (typeof v === "string") s += " " + v;
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(b);
  return s;
}
function missing(origSet, newSet) {
  return [...origSet].filter((x) => !newSet.has(x));
}

const A = await load(orig);
const B = await load(neu);

if (A && B) {
  if (A.id !== B.id) fails.push(`id mismatch: ${A.id} vs ${B.id}`);
  if (A.blocks.length !== B.blocks.length)
    fails.push(`block count: ${A.blocks.length} vs ${B.blocks.length}`);

  const n = Math.min(A.blocks.length, B.blocks.length);
  for (let i = 0; i < n; i++) {
    const a = A.blocks[i], b = B.blocks[i];
    if (a.t !== b.t) { fails.push(`block[${i}] type: ${a.t} vs ${b.t}`); continue; }
    // structural identity of non-text scaffolding
    if ((a.id || "") !== (b.id || "")) fails.push(`block[${i}] id: ${a.id} vs ${b.id}`);
    if ((a.module || "") !== (b.module || "")) fails.push(`block[${i}] module: ${a.module} vs ${b.module}`);
    if ((a.variant || "") !== (b.variant || "")) fails.push(`block[${i}] variant: ${a.variant} vs ${b.variant}`);

    if (mode === "pace") {
      if (!EDITABLE.has(a.t)) {
        // frozen block: must be byte/structure identical
        if (JSON.stringify(a) !== JSON.stringify(b))
          fails.push(`block[${i}] (t=${a.t}) FROZEN block was modified — must be identical`);
      } else {
        // editable: every source name/number/id must survive in this block
        const ta = tokens(blockText(a)), tb = tokens(blockText(b));
        const mn = missing(ta.nums, tb.nums), mi = missing(ta.ids, tb.ids), mnm = missing(ta.names, tb.names);
        if (mn.length) fails.push(`block[${i}] dropped NUMBERS: ${mn.join(", ")}`);
        if (mi.length) fails.push(`block[${i}] dropped node-IDs: ${mi.join(", ")}`);
        if (mnm.length) fails.push(`block[${i}] dropped names/terms: ${mnm.join(", ")}`);
      }
    } else if (mode === "translate") {
      // structure: module config key-set + array lengths
      if (a.module) {
        const ca = a.config || {}, cb = b.config || {};
        const ka = Object.keys(ca).sort().join(","), kb = Object.keys(cb).sort().join(",");
        if (ka !== kb) fails.push(`block[${i}] module config keys: [${ka}] vs [${kb}]`);
        for (const k of Object.keys(ca)) {
          if (Array.isArray(ca[k]) && Array.isArray(cb[k]) && ca[k].length !== cb[k].length)
            fails.push(`block[${i}] config.${k} length: ${ca[k].length} vs ${cb[k].length}`);
        }
      }
    }
  }

  if (mode === "translate") {
    // whole-lesson fidelity, SUBSTRING-based against raw en text so English
    // inflection (Blau -> "Blau's") and word-numbers (9月 -> "September") don't false-fail.
    const ta = tokens(blockText(A));
    const enRaw = stripTags(blockText(B));
    // names/terms: PROPER names (mixed-case, e.g. Foucault/Strathern/European) must survive
    // as substrings (hard). All-caps ACRONYMS (USN/MDP/ASQ) may expand in en -> warn only.
    const proper = [...ta.names].filter((x) => /^[A-Z][a-z]/.test(x) && x.length >= 3);
    const acro = [...ta.names].filter((x) => !/^[A-Z][a-z]/.test(x));
    const mnm = proper.filter((x) => !enRaw.includes(x));
    if (mnm.length) fails.push(`en dropped proper names/titles: ${mnm.join(", ")}`);
    const macro = acro.filter((x) => !enRaw.includes(x));
    if (macro.length) warns.push(`en acronyms not verbatim (may expand): ${macro.join(", ")}`);
    // node-IDs: must survive exactly (hard)
    const mi = [...ta.ids].filter((x) => !enRaw.includes(x));
    if (mi.length) fails.push(`en dropped node-IDs: ${mi.join(", ")}`);
    // 4-digit years/citations must survive (hard); smaller numbers -> warn (may be spelled out)
    const yrs = [...ta.nums].filter((x) => /^\d{4}$/.test(x));
    const myr = yrs.filter((x) => !enRaw.includes(x));
    if (myr.length) fails.push(`en dropped 4-digit numbers (years/citations): ${myr.join(", ")}`);
    const smallMiss = [...ta.nums].filter((x) => !/^\d{4}$/.test(x) && !enRaw.includes(x));
    if (smallMiss.length) warns.push(`en small-number mismatches (may be spelled out): ${smallMiss.slice(0, 12).join(", ")}`);
    if (enRaw.includes("——")) warns.push(`en contains em-dash 「——」 (§4 forbids)`);
    if (/[!！]/.test(enRaw)) warns.push(`en contains exclamation mark (§4 forbids)`);

    // changed-block correspondence: where the paced zh differs from its pre-pace snapshot,
    // the en at that block MUST also differ from its snapshot — else the en is a stale
    // translation of the OLD zh and does not carry the new unfolded steps.
    if (zhorig && enorig) {
      const ZO = await load(zhorig);
      const EO = await load(enorig);
      if (ZO && EO && ZO.blocks.length === A.blocks.length && EO.blocks.length === B.blocks.length) {
        for (let i = 0; i < A.blocks.length; i++) {
          if (!EDITABLE.has(A.blocks[i].t)) continue;
          const zhChanged = blockText(A.blocks[i]) !== blockText(ZO.blocks[i]);
          const enChanged = blockText(B.blocks[i]) !== blockText(EO.blocks[i]);
          if (zhChanged && !enChanged)
            fails.push(`block[${i}] (t=${A.blocks[i].t}) zh was re-paced but en is UNCHANGED — stale translation, re-translate this block`);
        }
      } else if (!EO) {
        warns.push(`no en snapshot (new lesson) — changed-block correspondence skipped`);
      }
    }
  }
}

for (const w of warns) console.log(`  ⚠ WARN: ${w}`);
if (fails.length) {
  console.log(`GATE FAIL (${orig} -> ${neu}, ${mode}):`);
  for (const f of fails) console.log(`   - ${f}`);
  process.exit(1);
}
console.log(`GATE PASS (${path.basename(neu)}, ${mode})${warns.length ? ` [${warns.length} warn]` : ""}`);
process.exit(0);
