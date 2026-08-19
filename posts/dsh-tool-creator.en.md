---
title: "The Tool Factory: Acceptance Evidence Ships Inside the Artifact"
description: "A three-day development retrospective of dsh-tool-creator: how a five-role, gate-guarded pipeline bakes re-verifiable acceptance evidence into every artifact it ships — the real P1 an attack round caught, the independent fix-audit that refuted me with my own evidence, and why a cheaper model is a corollary of the gate floor, not a gamble. With architecture and two rounds of flash-tier measurements."
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

[Two posts ago](/blog/fable-scaling-layering/) I wrote about models and harnesses; [the last one](/blog/skill-spiral/) covered the thing wedged in between: skills. This one is about the third layer — **the factory that makes skills**. The subject is [dsh-tool-creator](https://github.com/VincentJiang06/dsh-tool-creator): 2026-08-17 to 08-19, three days from a late-night research session to a GitHub v0.1.0 + npm double release. It is an artifact factory running on dsh (DeepSeek Harness): five confined role subagents deterministically stepped through to CREATE dsh skills / plugins / presets, with a **machine-adjudicated, re-runnable acceptance record** baked inside every shipped artifact. The executor, [dsh-pipeline-executor](https://www.npmjs.com/package/dsh-pipeline-executor), ships independently on npm; this project is its first dogfood consumer.

Conclusions first:

1. **Every nondeterminism gets a mechanical guarantee, never an instruction.** The capability level is stamped by the executor rather than trusted to the model; cross-session ledger contamination fail-closes on per-line sha checks; deep-frozen tool results get clone-before-write. Instruction-level "please ensure…" was empirically breached on deepseek-v4-pro too many times; everything that survived is mechanical.
2. **The quality floor is held by gates, so switching to a cheaper model is a corollary, not a gamble.** Three mechanical stages moved to deepseek-v4-flash for per-attempt speedups of 33–64%; the entire justification is the acceptance gate under each stage — and two live rounds each caught a real defect class, proving the floor exists.
3. **A fixer must not audit its own fix.** An independent fix-audit (a fresh context that had written none of the fixes) refuted my fix rationale using **evidence I had corrected myself in the very same commit** — I re-committed the exact "contract-level refusal ≠ mechanical guarantee" error while fixing it elsewhere.

## 1. Why a factory, not yet another skill

[The last post](/blog/skill-spiral/) ended at skill-creator-max: a thin conductor re-derived from a philosophy KB, with a human adjudicating every gate — the **human-judged lineage**. dsh-tool-creator walks the other line: the **machine-judged factory**. Fully headless, no human in the loop; every gate is decided by an executable validator's exit code, acceptance is beaten on by an adversarial battery, and the grade is folded mechanically by an assembler. Both lines share the same philosophical base; the fork is a single question — who holds the judgment.

For the factory line to stand, there is one prerequisite nobody in the ecosystem ships: **acceptance evidence must travel inside the artifact**. The common defect of generator-style tools isn't generation quality — it's that evidence is discarded at packaging time. The generator claims it verified; nobody holding the artifact can re-verify that claim. Every dsh-tool-creator artifact carries an `acceptance-manifest.json` at its root: per-file sha256 + rootHash, model and dsh versions pinned, the verdict fold, and re-runnable reverify commands. Whoever holds the directory runs one command:

```
node tools/reverify.mjs <artifact-dir>
```

Byte integrity plus the artifact's own deterministic harness are re-proven on the spot. "Verified on rc.6" stops being a claim and becomes an execution of "re-verify on rc.7".

## 2. Architecture: control flow never touches the model

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
  <text x="340" y="150" text-anchor="middle" class="t2">declarative manifest · confined subagent dispatch (persona + tool whitelist + outputSchema) · executor writes artifacts · execFile gates · append-only ledger</text>
  <line class="ar" x1="170" y1="164" x2="170" y2="180"/><polygon points="166,180 170,187 174,180" fill="var(--vz-axis)"/>
  <line class="ar" x1="510" y1="164" x2="510" y2="180"/><polygon points="506,180 510,187 514,180" fill="var(--vz-axis)"/>
  <rect class="bx" x="8" y="188" width="324" height="52" rx="4"/>
  <text x="170" y="208" text-anchor="middle" class="tb">evidence-ledger.jsonl</text>
  <text x="170" y="226" text-anchor="middle" class="t2">one line per attempt · per-line manifestSha256 pin · machine-written</text>
  <rect class="bx" x="348" y="188" width="324" height="52" rx="4"/>
  <text x="510" y="208" text-anchor="middle" class="tb">acceptance-manifest.json (ships inside the artifact)</text>
  <text x="510" y="226" text-anchor="middle" class="t2">per-file sha256 · verdict fold · one-command reverify</text>
</svg>
<figcaption>Fig. 1 · The five-role pipeline. Control flow lives in a declarative manifest stepped mechanically by the executor — the model never transcribes it; each stage has an executable acceptance gate (green advances, red retries per the charter's table, at most three attempts, all-green to ship). The flash/pro tags reflect the post-L7 model tiering (§5).</figcaption>
</figure>

A few design decisions deserve their own lines:

- **Artifacts are written by the executor, never transcribed by the model.** Role subagents return structured objects (pinned by outputSchema); the executor writes the files. Two posts ago I measured v4-pro byte transcription at 5/6 reliability — so it doesn't get to transcribe.
- **Role packs are dispatched as personas, not concatenated into prompts.** The root cause of the B15 loss in the last post (role-pack dilution) is structurally gone.
- **The ledger is machine-written and pins the manifest sha per line.** Once, mid-run, I installed a new preset version; the ledger immediately carried two manifestSha256 values and the assembler refused the entire run. Being caught by your own mechanical guarantee is a peculiar feeling — and exactly the point: **"never install mid-run" stopped being discipline and became an enforced fact**.
- **The acceptance battery is a first-class pipeline stage.** Three lenses (coherence / gaming / reality) attack the artifact independently; a synthesis writes the decision record; the assembler counts findings mechanically **from the lens artifacts on disk** — the verdict's word doesn't count, the findings do.

## 3. Three days, live scoreboard

- **08-17**: late-night autonomous research (dsh source deep-read + v4-pro behavioral studies), five structural decisions; L0 scaffold + L1 executor (a feasibility spike first — every seam of confined dispatch measured before writing the real thing).
- **08-18**: L2 conductor charter (intake gate / retry table / halt semantics) + L3 build manuals for the three targets (six plugin boot invariants, eight preset mount rules — all paid for by live-host mines) + L4 the acceptance-manifest standard with a zero-dependency reverifier.
- **08-18/19**: L5 live matrix — skill / preset / plugin all banked green manifests, plus one fault-injection run (a seeded-red zipper gate → three retries → an honest `stopped_unmet`, never a watered-down pass). The B15 head-to-head lost in the last post came back as 2 wins / 1 tie / 1 narrow loss — "no longer losing."
- **08-19**: L6 attack round + release (§4); L7 flash-tier, two live rounds (§5).

The offline test surface settled at 187: 61 validator selftest traps (each trap is a forgery class that must be caught) + 126 node cases. CI is fully offline and dependency-free — 14 seconds.

## 4. The attack round: turning the guns on ourselves

Before release, five independent attack lenses plus a cross-lens synthesis adversarially reviewed the whole system — a SEED gate keeps attackers honest (each lens gets a planted defect; miss it and the whole run is void). The haul: 1 P1 + 6 P2. The P1 was real:

> The assembler's floor was one-directional — it refused "breaches_found with zero findings" but **not "clean while P1/P2 findings sit on disk."** And clean is the only verdict that unlocks the top grade: a lazy synthesis could stamp the highest rating onto a lying artifact.

The fix was repro-first: craft a lying manifest, prove it currently passes (it did), add the converse floor (on-disk P1/P2 findings force breaches_found), prove it now refuses (it did) — all on the record. The attack ledger was committed to git **before** the fixes, so a fixer can't quietly delete a finding.

The real low point came next. Attacker discipline requires a **fix-audit rotation**: a fresh context that wrote none of the fixes re-aims all five lenses at the fix diff. Its top finding: my fix rationale claimed "the synthesis subagent is toolFilter read-only, so it physically cannot tamper with the lens artifacts" — **wrong**. The host-side subagent door stays open; a read-only child can still spawn an unconfined helper to rewrite files, and the proof sat in **the T-D2 data I had corrected myself in the same commit**. The same error class — mistaking a contract-level refusal for a mechanical guarantee — recommitted inside the commit that was fixing it, caught by an independent audit. "A fixer must not audit its own fix" went from doctrine to lived experience.

What can't be fixed isn't hidden: the hollow-lens false negative (if the battery collectively does nothing, a zero-finding clean can't be caught by counting) is disclosed in every shipped manifest's limits[], with the real cure (a mechanically enforced SEED gate) queued for v0.2. **Fix what is mechanically fixable; disclose what isn't** — that is the release posture.

## 5. L7: the cheaper model as a corollary of the gate floor

L5 measured a full run at 62.4 minutes. The two long poles are the engineer (26.5 — real implementation plus a 30-pair corpus; untouchable, the B15 win came from corpus depth) and the battery (17.8 — already cut 47% by budget; cutting further erodes the attack surface). The one lever left: move the three mechanical stages to deepseek-v4-flash — **justified entirely by the gates underneath**.

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
  <rect x="427" y="168.6" width="32" height="41.4" fill="var(--vz-s1)"><title>zipper baseline 6.9 min (r1c — actually pro at the time)</title></rect>
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
<figcaption>Fig. 2 · Per-stage wall-clock across three runs of the same task (csv-md-table skill, byte-identical request), y-axis in minutes. Totals: baseline 62.4 → V1 62.0 → V2 <b>59.69</b>. Flash green-attempt speedups: composer −33% / guidance −35% / zipper −64%. V1's two retries (+10.0 min) ate exactly the speedup; V2 eliminated the retries and landed sub-60 — but the 0.3-min margin is smaller than the engineer's same-model variance (21.2 / 26.5 / 30.2 across runs), so the honest claim is "typically sub-60, not guaranteed."</figcaption>
</figure>

After V1's partial verdict, a frame-by-frame session-log autopsy pinned the death mechanism cleanly: both `ROLE_NO_OUTPUT` failures were **reasoning blowout into maxTokens** — flash under deployment-level `reasoningEffort=high` (not pinnable per dispatch; confirmed at the seam) reasons far past budgets tuned for pro. The composer died at 24576 (18K of it reasoning, its structured output already streaming — 22 deltas in — when cut); the zipper died at 32768 (**one hundred percent reasoning**, a self-checking loop, output never began); guidance passed twice at 40960. Three stages bracket the failure into a clean interval: 24576 dies, 32768 dies, 40960 passes. The fix is pure manifest budget headroom (a cap is a ceiling, not a spend), and V2 delivered 0/4 deaths.

Two side findings outshone the main plot:

- **Dead config.** While digging, I found a `provider/model: flash` pair sitting in the zipper's role block — from an earlier optimization round. The executor reads stage-level config only; **those keys never took effect**, and every prior run's zipper had silently been pro. A lever is only real where the executor reads it; the only proof a config is live is the roleModel in the runtime ledger.
- **The gate floor, live.** V2's engineer (pro, run-to-run variance) shape-checked the trigger battery instead of executing it; the battery's gaming and reality lenses **independently** flagged exactly that as their P1s, and the verdict got pressed down to candidate. A real quality regression was caught, counted, and shipped in the grade — instead of slipping out the door. The claim "a cheaper model is safe because acceptance never relies on the model's diligence" cashed out once per live round.

## 6. Retrospective: entrustments vs. guarantees

The last post's criterion was "a concept that can't say who judges, by what standard, and who backstops a miss is just an entrustment." This project pushes the same sentence down to the execution layer:

> If a constraint exists only in a prompt — it is an entrustment. Given enough samples it will be breached.
>
> If breaching it triggers a mechanical refusal on the spot — it is a guarantee. The entire precondition for a headless factory is moving every load-bearing constraint from the former to the latter.

And what can't be moved? **Disclose it.** The real difference between the machine-judged factory and the human-judged lineage isn't quality — it's that the factory must write "who adjudicated, what wasn't adjudicated, whether a veto was present" into the shipped evidence verbatim, because no human is there to vouch for it. The shipped manifest's limits[] carries the machine-self-adjudication statement, the hollow-lens residual, the independence boundary (same-model-family attackers throughout; cross-vendor blind spots structurally invisible). These aren't disclaimers — they are part of the product's definition.

Three days, roughly ¥110–120 of API spend, ten live run workspaces, one P1 lesson, one humbling refutation by an independent audit, two rounds of flash measurements. The repo is at [github.com/VincentJiang06/dsh-tool-creator](https://github.com/VincentJiang06/dsh-tool-creator) (attack ledger, differential battery, and L7 measurements all in the evidence docs); the executor is on [npm](https://www.npmjs.com/package/dsh-pipeline-executor). The next hill is already queued: a mechanical SEED gate — moving "the acceptance battery itself slacking off" from entrustment to guarantee as well.
