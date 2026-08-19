---
title: "The Tool Factory: Acceptance Evidence Ships Inside the Artifact"
description: "A mechanism-level teardown of dsh-tool-creator: the anatomy of confined subagent dispatch (eight measured deviations), a three-layer hash evidence chain and one self-arrest, the verdict-fold algebra and the one-directional floor an attack round breached, six boot invariants, why a machine record is born at O-L3, and a bracketing experiment on flash tiering. Three days of development; every claim traceable to ledgers and session logs."
tags: [AI, agent, dsh, tech-report]
date: 2026-08-19
updated: 2026-08-19
lang: en
---

<style>
.vz{color-scheme:light;
  --vz-s1:#2a78d6; --vz-s2:#008300; --vz-s3:#e87ba4;
  --vz-ink:var(--fg,#1d1d2b); --vz-sub:var(--sub,#63637a);
  --vz-grid:rgba(20,20,40,.13); --vz-axis:rgba(20,20,40,.32);
  --vz-box:rgba(42,120,214,.08); --vz-band:rgba(0,131,0,.08);
  margin:2.2rem 0;}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]) .vz{color-scheme:dark;
    --vz-s1:#3987e5; --vz-s2:#00a300; --vz-s3:#d55181;
    --vz-grid:rgba(255,255,255,.14); --vz-axis:rgba(255,255,255,.32);
    --vz-box:rgba(57,135,229,.14); --vz-band:rgba(0,163,0,.12);}
}
:root[data-theme="dark"] .vz{color-scheme:dark;
  --vz-s1:#3987e5; --vz-s2:#00a300; --vz-s3:#d55181;
  --vz-grid:rgba(255,255,255,.14); --vz-axis:rgba(255,255,255,.32);
  --vz-box:rgba(57,135,229,.14); --vz-band:rgba(0,163,0,.12);}
.vz svg{display:block;max-width:100%;height:auto;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
.vz text{fill:var(--vz-ink);font-size:11px}
.vz .t2{fill:var(--vz-sub);font-size:10px}
.vz .tb{font-weight:600;font-size:12px}
.vz .bx{fill:var(--vz-box);stroke:var(--vz-axis);stroke-width:1;rx:4}
.vz .bd{fill:var(--vz-band);stroke:var(--vz-axis);stroke-width:1;rx:4}
.vz .ar{stroke:var(--vz-axis);stroke-width:1.2;fill:none}
.vz figcaption{font-size:.85rem;color:var(--sub,#63637a);margin-top:.5rem;line-height:1.5}
</style>

[Two posts ago](/blog/fable-scaling-layering/) I wrote about models and harnesses; [the last one](/blog/skill-spiral/) covered the thing wedged in between: skills. This one is about the third layer — **the factory that makes skills**. The subject is [dsh-tool-creator](https://github.com/VincentJiang06/dsh-tool-creator), a dsh (DeepSeek Harness) artifact factory built in three days (2026-08-17 to 08-19): five confined role subagents deterministically stepped to produce dsh skills / plugins / presets, with a **machine-adjudicated, re-verifiable acceptance record** baked into every shipped artifact. The executor, [dsh-pipeline-executor](https://www.npmjs.com/package/dsh-pipeline-executor), ships independently on npm. This is not a press release — it is a mechanism teardown: each section explains how one subsystem works, the specific forgery class it exists to stop, and where it was breached on a live host.

Conclusions first:

1. **The trust ceiling of a multi-agent pipeline is set by how many of its constraints live in the mechanical layer rather than in prompts.** This post takes inventory, seam by seam: which constraints the host enforces (tool whitelists, outputSchema validation, artifact-write authority), which are mere entrustments (helper delegation, SEED discipline), and what happens when you mistake the latter for the former — it happened twice, once inside the very commit that was fixing it.
2. **"Evidence cannot be faked" is not a slogan; it is a three-layer hash chain plus a fold algebra recomputed at three independent sites.** Every hash on the chain stops one concrete cheat. The chain's one known timing gap is disclosed rather than patched — because it is mechanically unpatchable, and claiming otherwise would be the real defect.
3. **A cheaper model earns its seat only because acceptance never depends on the model's diligence.** Flash tiering ran as a bracketing experiment — three stages, three budgets, pinning the failure mechanism inside a 16K-token interval; after the fix, both previously-fatal dispatches passed first-try — while in the same run, a pro-stage shortcut got caught by the battery and demoted. The floor plays no favorites.

## 1. The problem: green-but-wrong and the chain of custody

Every generator-class tool (skill-creator and its kin) shares one structural defect that has nothing to do with generation quality: **verification happens in the factory, and the evidence dies at packaging time.** The generator says "I verified it," and the trust chain for that sentence has exactly one link — the generator itself. The person holding the artifact cannot re-verify; a directory listing it cannot re-verify; three host versions later, nobody can. Eval engineering has a name for this: green-but-wrong — the light stays green after the proposition it certifies has quietly died, and nobody can tell, because the underlying exhibits never traveled.

dsh-tool-creator swaps the optimization target from "generate better" to "**extend the evidence's chain of custody across the artifact's whole life**." Concretely, every artifact carries an `acceptance-manifest.json` at its root (structure in §3), and whoever holds the directory runs:

```
node tools/reverify.mjs <artifact-dir>
```

reverify is dependency-free (node ≥20, no npm install) and runs three fail-closed phases: **shape** (schema + semantic rules + a recomputation of the verdict fold) → **bytes** (every file re-hashed; a file on disk that the manifest doesn't list is tampering; symlinks are illegal; rootHash recomputed) → **commands** (each shipped deterministic harness command runs via `execFile`, exit codes compared, then the whole tree is **re-hashed once more** to prove the commands had no side effects). The ordering is itself a security decision: if hashes aren't green, no command runs — **never execute unverified bytes**.

Why does producing this take a *factory* rather than a skill? Because every link demands that the generation process itself be auditable: which process wrote which file, on which attempt, under which model, and what each gate ruled — fields that cannot be reconstructed after the fact. They can only be recorded at generation time by a mechanical layer that the model's prose never passes through. Control flow has to live outside the model.

## 2. The executor: an anatomy of confined dispatch

The executor's atom is one `subagents.start` call. All of its constraining power comes from five parameters, and the actual semantics of each were measured against a real host by a feasibility spike before any real code was written (fakes don't count):

```js
subagents.start('spawn', {
  prompt:  [{ type: 'text', text: dispatchLine }],   // a short dispatch line; carries no artifact content
  persona: rolePackText,                             // the role pack rides as persona, never concatenated into prompts
  toolFilter: { allow: ['read'] },                   // whitelist, enforced host-side
  agentOptions: { provider, model, maxTokens },      // model pinned per stage
  outputSchema: schema,                              // structured return, host-validated
  signal, parent,                                    // required: the in-process driver derefs on entry
})
```

The spike produced ten "implementation laws." The heaviest ones:

- **`toolFilter.restrict()` throws on unknown tool names** — the whitelist is host-enforced, genuinely mechanical. But it **masks inherited tools only**: the own-scope `subagent` tool the host injects into every child session is exempt. In security terms: **tool-surface confinement is mechanical; delegation confinement is not.** A read-only `allow:['read']` child can still spawn a helper that inherits the full global tool surface, write and bash included. That door is host-side; a plugin cannot close it. The project's handling is three-layered: a prompt-level ban (entrustment), a battery-stage session-log audit (detection — §4 covers its blind spot), and honest downgraded wording in every evidence document (disclosure).
- **Structured runs end with empty text**: after the child calls the `structured_output` tool, `run.result`'s prose is empty; the payload is the structured block. This forces the key design — **artifacts are written to disk by the executor from structured returns; the model never gets a transcription job.** Two posts ago I measured v4-pro byte transcription at 5/6 reliability. The answer is not "remind it to be careful"; it is abolishing the position.
- **outputSchema accepts a fixed keyword subset** (`type/oneOf/properties/required/additionalProperties/items/enum/const` plus annotations); a top-level `$schema` is refused outright by the web host. Found on the first live run — offline fakes were all green.
- **`reasoningEffort` cannot be pinned per dispatch**; it comes from deployment defaults. Hold that thought — both corpses in §7 died of it.
- **Personas are additive**: harness identity and tool guidance still sit under the role pack. A role pack must assume it is not the only voice in the room.

<figure class="vz">
<svg viewBox="0 0 680 252" role="img" aria-label="Five-role pipeline architecture: five stages each with an acceptance gate, the executor beneath, and two shipped evidence artifacts">
  <rect class="bx" x="8" y="26" width="118" height="62" rx="4"/>
  <text x="67" y="46" text-anchor="middle" class="tb">composer</text>
  <text x="67" y="62" text-anchor="middle" class="t2">flash · request→SkillSpec</text>
  <text x="67" y="78" text-anchor="middle" class="t2">gate validate_spec</text>
  <line class="ar" x1="126" y1="57" x2="141" y2="57"/><polygon points="141,53 148,57 141,61" fill="var(--vz-axis)"/>
  <rect class="bx" x="143" y="26" width="118" height="62" rx="4"/>
  <text x="202" y="46" text-anchor="middle" class="tb">guidance</text>
  <text x="202" y="62" text-anchor="middle" class="t2">flash · structure contract</text>
  <text x="202" y="78" text-anchor="middle" class="t2">gate validate_structure</text>
  <line class="ar" x1="261" y1="57" x2="276" y2="57"/><polygon points="276,53 283,57 276,61" fill="var(--vz-axis)"/>
  <rect class="bx" x="278" y="26" width="118" height="62" rx="4"/>
  <text x="337" y="46" text-anchor="middle" class="tb">engineer</text>
  <text x="337" y="62" text-anchor="middle" class="t2">pro · impl+corpus+harness</text>
  <text x="337" y="78" text-anchor="middle" class="t2">gate validate_report</text>
  <line class="ar" x1="396" y1="57" x2="411" y2="57"/><polygon points="411,53 418,57 411,61" fill="var(--vz-axis)"/>
  <rect class="bx" x="413" y="26" width="118" height="62" rx="4"/>
  <text x="472" y="46" text-anchor="middle" class="tb">zipper</text>
  <text x="472" y="62" text-anchor="middle" class="t2">flash · packaging (skill only)</text>
  <text x="472" y="78" text-anchor="middle" class="t2">gate packaging check</text>
  <line class="ar" x1="531" y1="57" x2="546" y2="57"/><polygon points="546,53 553,57 546,61" fill="var(--vz-axis)"/>
  <rect class="bx" x="548" y="26" width="124" height="62" rx="4"/>
  <text x="610" y="46" text-anchor="middle" class="tb">battery</text>
  <text x="610" y="62" text-anchor="middle" class="t2">pro · 3-lens adversarial</text>
  <text x="610" y="78" text-anchor="middle" class="t2">gate validate_decision</text>
  <line class="ar" x1="340" y1="88" x2="340" y2="104"/><polygon points="336,104 340,111 344,104" fill="var(--vz-axis)"/>
  <rect class="bd" x="8" y="112" width="664" height="52" rx="4"/>
  <text x="340" y="132" text-anchor="middle" class="tb">dsh-pipeline-executor (standalone npm package)</text>
  <text x="340" y="150" text-anchor="middle" class="t2">declarative manifest · confined dispatch (persona + tool whitelist + outputSchema) · executor writes artifacts · execFile gates · append-only ledger</text>
  <line class="ar" x1="170" y1="164" x2="170" y2="180"/><polygon points="166,180 170,187 174,180" fill="var(--vz-axis)"/>
  <line class="ar" x1="510" y1="164" x2="510" y2="180"/><polygon points="506,180 510,187 514,180" fill="var(--vz-axis)"/>
  <rect class="bx" x="8" y="188" width="324" height="52" rx="4"/>
  <text x="170" y="208" text-anchor="middle" class="tb">evidence-ledger.jsonl</text>
  <text x="170" y="226" text-anchor="middle" class="t2">one line per attempt · per-line manifestSha256 pin · machine-written</text>
  <rect class="bx" x="348" y="188" width="324" height="52" rx="4"/>
  <text x="510" y="208" text-anchor="middle" class="tb">acceptance-manifest.json (ships inside the artifact)</text>
  <text x="510" y="226" text-anchor="middle" class="t2">per-file sha256 · verdict fold · one-command reverify</text>
</svg>
<figcaption>Fig. 1 · The five-role pipeline. Control flow lives in a declarative manifest stepped by the executor — the model never transcribes it. Each stage has an executable acceptance gate (`execFile` argv, no shell, no interpolation): green advances, red retries per the charter's table (attempts 1→2→3), and a third red halts the whole run as `stopped_unmet` — no gate is ever loosened to force a done. The flash/pro tags are the post-L7 model tiering (§7).</figcaption>
</figure>

The charter (the conductor's persona) contains control law only, no product knowledge: an intake gate (an under-specified request is refused within minutes as `stopped_needs_spec`, never allowed to burn an hour of pipeline), target routing, the retry table (branching on gateExit and nothing else), dispositions for seven error codes, and self-interception of malformed tool calls. The conductor is deliberately kept dumb — every piece of cleverness is confiscated and moved into a checkable validator.

## 3. The evidence chain: three hash layers and one self-arrest

The ledger is executor-written JSONL, one line per stage attempt (real shape):

```json
{"ts":"2026-08-19T13:39:xx Z","pipeline":"tool-creator",
 "manifestSha256":"<sha256 of pipeline.manifest.json>",
 "stage":"composer","attempt":1,"childSessionIds":["c3363b15…"],
 "gateExit":0,"roleModel":"deepseek-v4-flash","tokens":42581,"error":null}
```

Note `manifestSha256`: it pins **the control-flow file itself**. That one field plus one assembler rule — "two distinct manifestSha256 values in a ledger ⇒ refuse the whole run" — forms a trap I personally validated the hard way. Mid-run, I casually installed a new preset version; the next ledger line carried a different sha, and the assembler refused the run's entire evidence. **"Never install mid-run" stopped being discipline and became an enforced fact** — and the first person it arrested was the author. That is what mechanical means: it doesn't recognize faces.

<figure class="vz">
<svg viewBox="0 0 680 246" role="img" aria-label="Three-layer hash evidence chain: the pipeline manifest pinned per ledger line, the ledger hashed whole into the acceptance manifest along with the artifact tree">
  <rect class="bx" x="8" y="18" width="212" height="56" rx="4"/>
  <text x="114" y="38" text-anchor="middle" class="tb">pipeline.manifest.json</text>
  <text x="114" y="54" text-anchor="middle" class="t2">declarative control flow · sha256 = M</text>
  <rect class="bx" x="460" y="18" width="212" height="56" rx="4"/>
  <text x="566" y="38" text-anchor="middle" class="tb">artifact file tree</text>
  <text x="566" y="54" text-anchor="middle" class="t2">per-file sha256 → rootHash</text>
  <line class="ar" x1="114" y1="74" x2="114" y2="106"/><polygon points="110,106 114,113 118,106" fill="var(--vz-axis)"/>
  <text x="124" y="96" class="t2">one line per attempt, M pinned per line</text>
  <line class="ar" x1="566" y1="74" x2="566" y2="106"/><polygon points="562,106 566,113 570,106" fill="var(--vz-axis)"/>
  <text x="356" y="96" class="t2">shasum -a 256 line format — coreutils can re-check it</text>
  <rect class="bx" x="8" y="114" width="300" height="72" rx="4"/>
  <text x="158" y="134" text-anchor="middle" class="tb">evidence-ledger.jsonl (append-only)</text>
  <text x="158" y="150" text-anchor="middle" class="t2">{stage, attempt, gateExit, roleModel,</text>
  <text x="158" y="164" text-anchor="middle" class="t2">manifestSha256: M, childSessionIds, tokens}</text>
  <text x="158" y="180" text-anchor="middle" class="t2">≥2 distinct M ⇒ assembler refuses the run</text>
  <line class="ar" x1="308" y1="150" x2="336" y2="150"/><polygon points="336,146 343,150 336,154" fill="var(--vz-axis)"/>
  <text x="322" y="140" class="t2">whole-file sha</text>
  <rect class="bx" x="346" y="114" width="326" height="72" rx="4"/>
  <text x="509" y="134" text-anchor="middle" class="tb">acceptance-manifest.json</text>
  <text x="509" y="150" text-anchor="middle" class="t2">artifact.files + rootHash ← tree</text>
  <text x="509" y="164" text-anchor="middle" class="t2">evidenceLedgerSha256 ← ledger · pipelineVersion = manifest:M</text>
  <text x="509" y="180" text-anchor="middle" class="t2">verdicts = min-fold recomputed · limits[] disclosures</text>
  <text x="340" y="216" text-anchor="middle" class="t2">Known timing gap (disclosed, not papered over): assembly runs inside the battery gate, so the battery's own</text>
  <text x="340" y="232" text-anchor="middle" class="t2">ledger line lands after assembly — evidenceLedgerSha256 covers every line except the assembling attempt's own.</text>
</svg>
<figcaption>Fig. 2 · The three-layer hash chain. Each hash stops one concrete cheat: per-line M stops "swap the control flow mid-run"; rootHash stops "tamper with or smuggle files" (an unlisted on-disk file is ruled tampering; symlinks are illegal); evidenceLedgerSha256 stops "rewrite the ledger after the fact." reverify consumes the chain in three fail-closed phases — shape → bytes → commands — with no command executed over unverified bytes and a full re-hash afterwards proving zero side effects.</figcaption>
</figure>

The rootHash algorithm is deliberately boring: sort the paths in `files` by UTF-8 byte order, emit one `<sha256>␣␣<path>` line each, join with `\n`, trailing newline, sha256 the text — **exactly the `shasum -a 256` output format**, so a third party can re-check it with coreutils alone, without trusting reverify itself. The last link of the chain of custody is handed to the OS distribution.

## 4. The verdict algebra, the one-directional floor, and being refuted with my own evidence

Grading is a small algebra: three values, one order — `draft < candidate < industrial`. The battery verdict first maps to a cap:

```python
def battery_cap(battery_verdict):
    return "industrial" if battery_verdict == "clean" else "candidate"
    # breaches_found / not_run both cap at candidate

def min_fold(re_audit, battery):
    return min(re_audit, battery_cap(battery), key=VERDICT_ORDER.get)
```

`effective = min(re_audit, cap(battery))`, recomputed at **three independent sites**: `validate_decision` at the battery gate (writer side — a synthesis writing an effective above the fold is refused on the spot; in run r1c this fired for real, the synthesis under-reported `draft` and got bounced into a retry), the assembler (assembly side), and reverify (consumer side — a shipped effective above the recomputation is ruled fabricated). One algebra, three copies; bypass one and two remain.

The attack round (five independent lenses + a SEED gate + a cross-lens synthesis, findings committed to git **before** any fix so a fixer can't quietly delete one) found the project's only P1 exactly here:

> The floor was one-directional. The assembler refused "`breaches_found` with a zero count" (breaches without findings = suppressed evidence) but **not "`clean` while P1/P2 findings sit on disk."** And `clean` is the only verdict that lifts the cap to `industrial` — one lazy or gaming synthesis flips a word, and a lying artifact ships with the top grade while all three fold recomputations stay green, because the fold checks effective-vs-verdict consistency, never **verdict-vs-evidence** consistency.

The fix was repro-first: craft a lying manifest (`clean` + a real P1 on disk), prove the current code passes it, add the converse floor — **a counted P1/P2 on disk forces `breaches_found`** — and prove the same manifest is now refused; both runs on the record. Two design details worth spelling out. First, the converse floor tolerates P3: `clean` may carry disclosed P3 minors (counts travel verbatim in `batteryFindingsCounts`), because folding "has small flaws" into the same label as "has breaches" only teaches the upstream to hide the P3s too. Second, the count's data source is **the lens artifact files on disk**, which the executor wrote from the lenses' structured returns — and the synthesis's toolFilter is `['read']`, so it cannot edit the evidence being counted against it.

At least, that was my argument. Attacker discipline mandates a **fix-audit rotation**: a fresh context that wrote none of the fixes re-attacks the fix diff. Its top finding kept me quiet for a while:

> "The synthesis is read-only, so it physically cannot alter the lens artifacts" — wrong. The host's own-scope `subagent` door is exempt from toolFilter (§2, first law); a read-only child can spawn an **unconfined** helper to rewrite files. And no new evidence is needed: **in this same commit, you yourself corrected the T-D2 record to state that r1c's synthesis child did spawn a helper.**

The same error class — mistaking an entrustment for a guarantee — recommitted inside the commit fixing it, refuted by an independent audit using data I had corrected myself. Not a process drill; a lived instance of "a fixer must not audit its own fix." The corrected claim is one rung weaker: the converse floor guards against **the synthesis's relabeling** (verdict inconsistent with evidence), not against **the integrity of the evidence files themselves** (that needs a mechanical SEED gate plus closing the subagent door — queued for v0.2). That residual, together with the hollow-lens false negative (a battery that collectively does nothing produces a zero-finding `clean` no count can catch), is written verbatim into every shipped manifest's `limits[]`. **Fix what is mechanically fixable; disclose what isn't** — "honest limits" means executing that sentence down to the field level.

One more anti-perfunctory device at the schema level: every gate ruling in the decision record must be a complete decision object — the question, evidence pointers, options considered, and **options rejected with reasons** (an empty rejected list is treated as a signal of non-thought); the adjudicator field admits exactly `human | machine`, no third mumble.

## 5. Six boot invariants: the complete catalog of fakes-green, live-red

The plugin target's build manual distills six invariants, each paid for by an "offline tests all green, real host boot explodes" incident. Listed in full, because this knowledge class is only reusable as a checklist:

1. **`Config` must be a Standard-Schema object** — a plain object is refused at load;
2. **every `@deepseek-ai/*` package imported by `lib/index.js` must appear in `peerDependencies`** — miss one and installation succeeds while boot-time module resolution detonates;
3. **every OBJECT schema a tool declares must set `additionalProperties` explicitly** — omission is not leniency, it is refusal;
4. **`@deepseek-ai/*` never goes in `dependencies`, and "optional" dependencies use conditional imports** — otherwise a second instance of the same package appears inside the host; in a sibling project this once took every tool offline at once;
5. **the live host validates each tool's execute RETURN VALUE against its declared output schema** — one undeclared extra field in the return and live rejects it, while offline fakes never validate the return direction at all;
6. **every tool result the host hands back is DEEP-FROZEN; never mutate in place** — `structuredClone` first. The discovery path here is the archetype: the capability-stamping feature was green under all 111 offline cases and crashed on first live contact, because the fakes' freezing behavior didn't match the host's. The fix (clone-before-write) landed with a frozen-input regression case that is mutation-verified — revert the fix and the case must go red.

The meta-lesson outvalues the entries: **host-composition behavior (E-L4 class) has no offline proof, only live proof.** Hence a factory rule: if E-L4 wasn't actually run for an artifact, it ships as `not_run` in the limits — a layer whose green light never lit doesn't get to use the word.

## 6. Why a machine record is born at O-L3

The governance field `capability_level` walks a ladder from O-L0 (every gate human-judged) to O-L4 (fully automatic + human spot checks), and the doctrine says "ship at O-L0, earn upgrades with evidence." The factory line hits a clean deadlock here: in a headless all-machine record every gate's adjudicator is `machine`, and the validator's machine-factory invariant **rejects** O-L0/L1/L2 (all three require a human in the loop) — so "ship at O-L0" is an illegal value for the only kind of record this pipeline can produce. In run R2 the model honestly wrote O-L0, got refused, retried per the table, and closed with an honest `stopped_unmet` — every step rule-abiding, the composition a guaranteed non-producer.

The ruling: for a machine factory, O-L3 is not an *earned* level but a **structural floor** — the lowest label the validator tolerates — stamped as a constant by the executor rather than written by the model (let the model write it and you get R2 and R3 each rolling their own, which is exactly what happened). The semantics were corrected to the honest reading: O-L3 means "machine-adjudicated; the human veto is reserved but never exercised in headless operation" — **the veto is a disclosed limitation, not a safety net**, because no human is present during the run. The correction propagated to the doctrine text, the schema description, and every shipped manifest's limits[] — where the machine-self-adjudication disclosure is **derived** by the assembler from the gates' adjudicator fields (a selftest fixture with a human-judged gate proves the disclosure gets suppressed, so the disclosure itself can't rot into hardcoded decoration).

The general rule for governance fields: **when no human is present, every governance value must be either mechanically enforced or mechanically disclosed.** A field that is neither is a fig leaf.

## 7. L7: a bracketing experiment

L5 measured a full run at 62.4 minutes: composer 8.6 + guidance 9.5 + engineer 26.5 + zipper (skill targets only) + battery 17.8. The two long poles are untouchable — the engineer's 26.5 buys a real implementation plus a 30-pair golden corpus (the B15 head-to-head flipped from a clean loss to 2 wins / 1 tie / 1 narrow loss on corpus depth alone), and the battery had already been budget-cut 47%. The only lever left is the model tier of the three mechanical stages, and the licence to pull it was built in §1–§4: **their outputs all pass executable acceptance gates; the floor is held by gates, not by model diligence.**

<figure class="vz">
<svg viewBox="0 0 680 264" role="img" aria-label="Per-stage wall-clock, three runs compared: baseline, V1 with retries, V2 all first-pass">
  <rect x="150" y="6" width="12" height="12" fill="var(--vz-s1)"/><text x="167" y="16">baseline (R3, all-pro)</text>
  <rect x="316" y="6" width="12" height="12" fill="var(--vz-s2)"/><text x="333" y="16">V1 incl. retries</text>
  <rect x="444" y="6" width="12" height="12" fill="var(--vz-s3)"/><text x="461" y="16">V2 all first-pass</text>
  <line x1="46" y1="150" x2="668" y2="150" stroke="var(--vz-grid)"/>
  <line x1="46" y1="90" x2="668" y2="90" stroke="var(--vz-grid)"/>
  <line x1="46" y1="30" x2="668" y2="30" stroke="var(--vz-grid)"/>
  <text x="40" y="153" text-anchor="end" class="t2">10</text>
  <text x="40" y="93" text-anchor="end" class="t2">20</text>
  <text x="40" y="33" text-anchor="end" class="t2">30</text>
  <line x1="46" y1="210" x2="668" y2="210" stroke="var(--vz-axis)"/>
  <rect x="61" y="158.4" width="32" height="51.6" fill="var(--vz-s1)"><title>composer baseline 8.6 min</title></rect>
  <rect x="99" y="152.4" width="32" height="57.6" fill="var(--vz-s2)"><title>composer V1 9.6 min (incl. an a1 ROLE_NO_OUTPUT retry; green attempt 5.8)</title></rect>
  <rect x="137" y="181.8" width="32" height="28.2" fill="var(--vz-s3)"><title>composer V2 4.7 min (first-pass under the 40960 budget)</title></rect>
  <rect x="183" y="153" width="32" height="57" fill="var(--vz-s1)"><title>guidance baseline 9.5 min</title></rect>
  <rect x="221" y="172.8" width="32" height="37.2" fill="var(--vz-s2)"><title>guidance V1 6.2 min (first-pass)</title></rect>
  <rect x="259" y="166.2" width="32" height="43.8" fill="var(--vz-s3)"><title>guidance V2 7.3 min (first-pass)</title></rect>
  <rect x="305" y="51" width="32" height="159" fill="var(--vz-s1)"><title>engineer baseline 26.5 min (pro)</title></rect>
  <rect x="343" y="82.8" width="32" height="127.2" fill="var(--vz-s2)"><title>engineer V1 21.2 min (pro, fast-side variance)</title></rect>
  <rect x="381" y="28.8" width="32" height="181.2" fill="var(--vz-s3)"><title>engineer V2 30.2 min (pro, slow-side variance)</title></rect>
  <rect x="427" y="168.6" width="32" height="41.4" fill="var(--vz-s1)"><title>zipper baseline 6.9 min (r1c — actually pro at the time, see the dead-config note)</title></rect>
  <rect x="465" y="157.8" width="32" height="52.2" fill="var(--vz-s2)"><title>zipper V1 8.7 min (incl. an a1 ROLE_NO_OUTPUT retry; green attempt 2.5)</title></rect>
  <rect x="503" y="193.8" width="32" height="16.2" fill="var(--vz-s3)"><title>zipper V2 2.7 min (first-pass under the 49152 budget)</title></rect>
  <rect x="549" y="103.2" width="32" height="106.8" fill="var(--vz-s1)"><title>battery baseline 17.8 min (pro)</title></rect>
  <rect x="587" y="115.2" width="32" height="94.8" fill="var(--vz-s2)"><title>battery V1 15.8 min</title></rect>
  <rect x="625" y="126.6" width="32" height="83.4" fill="var(--vz-s3)"><title>battery V2 13.9 min</title></rect>
  <text x="115" y="228" text-anchor="middle" class="t2">composer</text>
  <text x="115" y="242" text-anchor="middle" class="t2">flash</text>
  <text x="237" y="228" text-anchor="middle" class="t2">guidance</text>
  <text x="237" y="242" text-anchor="middle" class="t2">flash</text>
  <text x="359" y="228" text-anchor="middle" class="t2">engineer</text>
  <text x="359" y="242" text-anchor="middle" class="t2">pro</text>
  <text x="481" y="228" text-anchor="middle" class="t2">zipper</text>
  <text x="481" y="242" text-anchor="middle" class="t2">flash</text>
  <text x="603" y="228" text-anchor="middle" class="t2">battery</text>
  <text x="603" y="242" text-anchor="middle" class="t2">pro</text>
</svg>
<figcaption>Fig. 3 · Per-stage wall-clock across three runs of the same task (csv-md-table skill, byte-identical request), y-axis in minutes. Totals: baseline 62.4 → V1 62.0 → V2 <b>59.69</b>. Flash green-attempt speedups: composer −33% / guidance −35% / zipper −64%. V1's two retries (+10.0 min) ate exactly the speedup; V2 eliminated them and landed sub-60 — but the 0.3-min margin is smaller than the engineer's same-model variance (21.2 / 26.5 / 30.2 across runs), so the honest claim is "typically sub-60, not guaranteed; the residual variance is pro-stage, unrelated to flash."</figcaption>
</figure>

V1 came back partial: 62.0 total ≈ baseline, with two of four flash dispatches dead of `ROLE_NO_OUTPUT`. This is the densest part of the story — **the autopsy**, frame by frame through the two children's session logs:

- **composer a1** (maxTokens 24576): 10 `read` calls, 1 `bash`, a 1.2KB prose preamble, then it began streaming its `structured_output` call — **cut off at the 22nd tool-call delta**. Final frame: `outputTokens 24576 == cap`, 18,243 of them reasoning; `turn/end {"kind":"max-tokens"}`. A few hundred tokens short of delivery.
- **zipper a1** (maxTokens 32768): 18 `read` calls, 1 `bash`, then a final frame of **32,768 / 32,768 tokens — one hundred percent reasoning** — a self-checking loop (log tail: "…occurrences: none. Wait — …") in which neither prose nor a tool call ever began.

Mechanism: **reasoning blowout into maxTokens**. Under the deployment-level `reasoningEffort=high` (§2: not pinnable per dispatch), flash emits several times pro's reasoning volume on the same task, against budgets tuned for pro's behavior. And the three flash stages happened to form a ready-made bracket: **24576 dies, 32768 dies, 40960 passes** (guidance was first-pass in both rounds). The fix therefore required no guessing: composer raised to 40960 (the proven-sufficient value), zipper to 49152 — a cap is a ceiling, not a spend; headroom bills nothing. V2: four flash dispatches, **zero deaths, five stages first-pass**; the two previously-fatal dispatches cleared in 4.7 and 2.7 minutes.

Two byproducts outshone the main plot:

- **Dead-config archaeology.** During the dig I found a `provider/model: flash` pair sitting in the zipper's *role* block — written by an earlier optimization round. But the executor reads the model at *stage* level only (`stage.model ?? defaults.model`); those role-level keys **had never been read**. Every earlier run's zipper had silently been pro — including the 6.9-minute figure I had been citing as a "flash baseline." The correction method is not to trust any document but to reconcile against the runtime ledger's `roleModel` field: **whether a config is live is provable only by a runtime record on the executor's actual read path.**
- **The gate floor, proven in both directions.** V2's engineer (pro, run-to-run variance) shape-checked the trigger battery instead of executing it: all 31 cases `live_run:false`, `observed:null`. The battery's gaming and reality lenses — with no knowledge of each other — each flagged exactly that as their P1; verdict `breaches_found`, effective pressed to `candidate`. A real quality regression caught, counted, and shipped in the grade. In one experiment, flash's failures were stopped and retried by gates while pro's shortcut was demoted by the battery: **the floor plays no favorites.** That is the complete proof structure behind "a cheaper model is a corollary, not a gamble."

## 8. Retrospective: entrustments vs. guarantees

The last post's criterion was "a concept that can't say who judges, by what standard, and who backstops a miss is just an entrustment." This project pushed it down to the execution layer — and got slapped by its own sentence once (§4). Three criteria remain, each checkable item-by-item against any multi-agent system:

> **Which layer does the constraint live in?** Prompt-only = entrustment; breached under enough samples. Breach triggers a mechanical refusal = guarantee. A headless system's trustworthiness equals the coverage of its guarantee list — not the sincerity of its prompts.
>
> **How far does the evidence travel?** If the exhibits from verification time don't travel with the artifact, "verified" has a one-link trust chain. Per-file hashes + a ledger hash + a recomputed fold extend the chain to anyone holding the directory.
>
> **Is the unfixable disclosed?** The mechanically unfixable residue (the host's open door, same-family model blind spots, the timing gap) — is it written into the shipped evidence? The part that isn't is the system's true ceiling.

Three days, roughly ¥110–120 of API spend, ten live workspaces, 61 selftest traps + 126 node cases, one P1, one refutation by an independent audit armed with my own evidence. The repo is at [github.com/VincentJiang06/dsh-tool-creator](https://github.com/VincentJiang06/dsh-tool-creator) (attack ledger, differential battery, and L7 measurements under docs/evidence/); the executor is on [npm](https://www.npmjs.com/package/dsh-pipeline-executor). The next hill is queued: a mechanical SEED gate — moving "the acceptance battery itself slacking off" from entrustment to guarantee as well.
