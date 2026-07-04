---
lang: en
title: 'Simulated Annealing Research Matrix: Technical Retrospective'
description: >-
  A technical retrospective on the fully automated production of five
  economics-PhD-level papers: architectural effectiveness, failure modes, token
  economics, and the boundaries of autonomy, based on a complete audit of the
  execution log and 2,380 API requests.
---

> Object: the fully automated production process of five doctoral-level economics papers plus a system-level synthesis (2026-07-03 to 2026-07-04).
> Perspective: architectural efficacy, failure modes, token economics, and the boundaries of autonomy. Written by the loop's design model (Fable 5), based on the complete execution record and full audit data from 2,380 API requests.
> Statement of position: this retrospective records failures and uncertain points faithfully and does not advocate for the framework — the discipline of honest boundaries applies equally to the evaluation of the framework itself.

---

## 0. Ten Core Conclusions (TL;DR)

1. **The end-to-end pipeline ran to completion**: five finished papers of 38,000–44,000 words each, plus a 12,000-word synthesis, all passed the final review of the deterministic validator (five S7 passes + matrix M5 + a 22-probe self-check), over a total of approximately 17.7 hours (approximately 11–12 hours active), 209 agent instances, and 3.65 million output tokens.
2. **Adversarial annealing is the value center of the system**: the skeleton attacks across the four papers produced 53+ findings in total (including 18 critical), all converging to clean within three rounds — and the mode of convergence was not "rhetorical compromise" but **honest downgrade** (explicitly demoting unidentifiable claims to theory, illustrative case, or a pre-registered hypothesis awaiting testing). This is the direct production mechanism for both the quality of the finished product and the honesty of the system as a whole.
3. **The zero-fabrication discipline held throughout at the level of coefficients and facts, but was breached at the level of bibliographic metadata**: across the empirical layers of the five papers, there is not a single fabricated regression coefficient, p-value, or sample size, and the process proactively produced four corrections of seed-narrative calibration errors (Denmark's 20% ≠ 25%, FRS17 being an ownership share, Royal Mail's 50% being an efficiency ratio, and a proactive downgrade of an identification label after an SEC rule was judicially vacated). However, external verification during Fable's final check after completion found that P2's Works Cited contained **3 instances of misattributed authorship**: the finalization-stage Polisher, at points where the evidence ledger recorded only a title and URL, **fabricated author names on its own**. The factual claims themselves were correct, but this was genuine fabrication — it simply occurred in a field not covered by the discipline's predicates. Lesson: **the actual boundary of a discipline is the coverage of its predicates**; "zero fabrication" must be explicitly enumerated down to bibliographic metadata (author/journal/volume-issue), otherwise the model will complete unconstrained fields on its own. This has since been fixed in the final-check batch (see §4-8).
4. **The deterministic validator is the only role that cannot be corrupted**: gate.mjs was modified zero times throughout to accommodate anything (the 22-probe self-check passed throughout), and every failure was fixed on the data side. This discipline is the floor of the entire chain of trust.
5. **The largest efficiency loss was "format dialect"**: approximately 9–10 mismatches between the gate predicates' vocabulary and workers' free-form output (field names, citation formatting, parenthetical years, table row headers), estimated to have cost 5–8% of output tokens in rework. The remedy is clear: embed the gate predicates verbatim into the dispatch prompt (schema-in-dispatch).
6. **Caching is the economic precondition of this architecture**: of the 469 million input-side tokens, 94.3% were cache reads. Without prefix caching, this architecture would not be economically viable.
7. **Calibration of deduplication at the divergence layer is an unclosed gap**: the novelty_yield was almost constantly 1.0 (only 3 duplicates were killed across the entire run), making it impossible to distinguish "the orthogonal-lens design succeeded" from "the deduplicator is overly permissive" — because the deduplicator was never subjected to plant calibration (planted, known duplicates were used to calibrate the reviewer layer, but never the deduplication layer).
8. **The real boundary of autonomy**: execution autonomy was essentially complete (the longest unattended continuous stretch was about 7 hours), but **autonomy over goals and genre was essentially zero** — the mid-course r4 pivot (finalization + MLA formatting) was triggered by a single remark from the user ("the language isn't quite academic enough"); the framework itself could not detect that "the deliverable's genre was wrong."
9. **The compliance channel for the human gate was "standing authorization"**: the user's own words served as a batch-signed audit signature rather than item-by-item review. This is a necessary compromise for fully autonomous operation; its risk (uncorrected taste drift) was disclosed in the trust-boundary statement, and was indeed offset by two mid-course interventions from the user.
10. **Judgment on generalizability to the social sciences and business disciplines**: the framework's portable core is "the mechanized execution of epistemic honesty" (the discipline of aligning claims with evidence); what is domain-specific is merely the scoring rubric. The cost of porting to a new domain lies mainly in rewriting the "rigid-pattern checklist" and the "evidence-tier rubric" for that domain, not in rebuilding the loop.

---

## 1. Final State and Overall Ledger

### 1.1 Deliverables

| Layer | Content | Scale |
|---|---|---|
| Finished-product layer | 5 papers (thesis.md) + synthesis (overview.md) | 204,830 CJK characters (42,916 / 43,987 / 37,837 / 41,087 / 38,988 / 12,032) |
| Style conventions | MLA in-text parenthetical citations (including year) × 54–82/paper, Works Cited 15–23 entries/paper, row-header-numbered tables/figures ≥3/paper | All passed the THESIS predicates |
| Audit layer | Full state/ archive: direction pools of 39+31+36+33+39 candidates, 25 argument clusters, 25 viewpoint dossiers, 13 rounds of skeleton attacks + 5 rounds of final-verification attacks + 1 round of matrix attacks, all dispositions and sha-bound scorecards | Fully re-verifiable |
| Verification | All-green S0–S7 for all five papers + S4F freeze + THESIS + M5 matrix final verification + 22-probe self-check | All green again after directory reorganization and re-run |

### 1.2 Resource Ledger (Full History, After Deduplication of 2,380 Requests)

| Metric | Value | Notes |
|---|---|---|
| Time span | 07-03 10:38 → 07-04 04:20 (UTC) | Approximately 17.7h; excluding the idle window from 20:00–03:00, approximately 11–12h active |
| Output tokens | **3.65M** (Opus 3.25M + Fable 0.40M) | Actual generation volume, the primary cost item |
| Input side | 468.6M (uncached 3.83M + cache write 22.83M + cache read 441.94M) | **94.3% were cache reads** |
| Agents | 209 instances (including the main loop) | Reconnaissance/review/attack/revision/drafting/finalization/verification |
| Main-loop share | Output 1.17M (32%), 624 requests | Dispatch prompts + checkpoints + format fixes |
| Productive subagents | Output 2.48M (68%), 1,756 requests | Largest single instances: P2 drafter 113k, the four papers' Polishers each 53–67k |
| Per-paper average | ≈730,000 output tokens/paper | Fully amortized including design, governance, matrix layer, and rework |

An intuitive ratio of output to input: **approximately 178,000 output tokens were consumed per 10,000 characters of finished body text** — of which roughly 30,000–40,000 are the drafting and transcription itself, with the remainder going to divergence, adversarial review, governance, and rework. This roughly 4–5x "governance multiplier" is the essential difference between this framework and "single-pass direct writing," and it is also the source of the quality (see §3.3).

### 1.3 Shape of the Timeline

The hourly output curve has three phases: a design phase (10:38–13:00, Fable, planning + red-teaming + trial runs), an execution ramp-up phase (13:00–17:00, full pipeline for P1 + the front end of P2, 130,000–240,000 per hour), and a parallel sprint phase (17:00–20:00, S1–S7 for four papers in parallel, 660,000–730,000 per hour, reflecting the throughput ceiling of the design), followed by a 7-hour shutdown once the user's quota was exhausted, with the matrix closeout completed the next day from 03:00–04:20. **Quota exhaustion occurred midway through the matrix closeout** — this exposed the absence of budget metering (see §7, Improvement 8).

---

## 2. The Architectural Form Validated in Practice

The design documents are in `docs/design/`; recorded here is only the form that **actually bore weight in practice**:

```
High-temperature divergence (S1) — blind/informed reconnaissance ×15 lenses → deduplication → dual-exit cooling (exhaustion | rich vein ≥30 × 3 rounds)
     ↓ Final review Judge (plant calibration + sha binding + judgment-density threshold)
Clustering (S2) — clusters = falsifiable judgments, not topic labels → cluster-level review (recalibration)
     ↓
Attack annealing (S3) — fresh-context red team → item-by-item disposition (fixed | honest downgrade | reclassification) → re-verification → until clean
     ↓ Human tone-setting gate (standing-authorization signature)
Modeling design (S4) — viewpoint dossiers (identification strategy + pre-registered falsifiability threshold + steelman ×2) → inspection → FROZEN-S4 relay lock
     ↓ Slow-modeling stake (DESIGN-GATE-PASS required before DATA-EXEC is permitted)
Honest empirics (S5) — aggregate facts WebSearch-verified [verified] / micro-identification explicitly downgraded / zero fabrication
     ↓
Drafting (S6, working draft) → final verification (S7: integrated attack + final review + human gate) → finalization (Polisher → MLA thesis → humanizer)
     ↓
Matrix layer (M5) — bidirectional traceability + re-derivation verification + cross-paper duplicate check + calibration-conflict check + synthesis
```

Three engineering principles proven to be **non-omissible**:

- **Separation of roles**: the conductor does not write content, workers do not self-grade, and reviewers are always fresh-context. The single temptation across the entire run toward "role transgression" (the conductor modifying a judge's sha typo on its behalf) was refused; instead the scorer recomputed and rebound it personally — attribution in the audit chain belongs to the scorer.
- **Disk as ground truth**: append-only logs + content locks (FROZEN sha) + a re-runnable gate enabled lossless recovery across multiple context compactions and one session crash. The session is volatile; the state on disk is the system.
- **The validator does not compromise**: every gate failure (approximately 15 instances) was fixed on the data side without exception. Once the precedent of "modifying the gate to accommodate the data" is set, the entire meaning of the 22-probe self-check collapses.

---

## 3. Item-by-Item Determination of Mechanism Efficacy

### 3.1 Temperature-Graded Divergence + Blind/Informed Interleaving — Verdict: **effective, but calibration incomplete**

The 15 lenses produced 178 candidate directions (39+31+36+33+39), with very little cross-lens core overlap. The direct evidence of divergence quality is the density of original judgment in the final drafts — counterintuitive judgments such as "the day coverage improves is precisely the day the welfare is withdrawn," "the Netherlands not blowing up is survivorship bias," and "contribution-rate coldness is a rational response" all originated at the S1 layer, not from rhetorical flourishes added during drafting. Blind/informed interleaving effectively guarded against seed anchoring (the seed outline's "reaching for yield vs. ALM" framing was argued by P1 to be a false dichotomy — the divergence layer dared to defeat the incumbent baseline).

**Point of uncertainty**: across all 13 rounds of deduplication, only 3 duplicates were ever identified (novelty_yield constant at 1.0). Two explanations cannot be distinguished: either the orthogonal-lens design truly succeeded, or the deduplicator is systematically too permissive. Because the **deduplication layer was never subjected to plant calibration** (no known duplicates were ever planted to test the deduplicator's kill rate), this is a calibration gap not afforded the same treatment as the review layer.

### 3.2 Review + Plant Calibration + Sha Binding — Verdict: **calibration effective, score compression uncertain**

Across the entire run, 20+ planted rigid-pattern samples were killed 100% of the time (including finished-draft-level plants of "fabricated coefficients disguised as causality" and "scaffolding leakage"), demonstrating that review maintained its discriminating power against rigid patterns throughout, with no occurrence of "reviewer somnolence." Sha binding caught 2 genuine binding failures (1 transcription typo, 1 expiration after format normalization), and the freeze lock caught 1 instance of "modification after freezing" (a sha drift caused by reordering fields in a brief) — these mechanisms are not ceremonial; all of them actually intercepted something in practice.

**Point of uncertainty**: the scores of genuine candidates clustered at 0.72–0.92, with nearly all being kept (P5 even kept 39/39). The funnel narrowed at the top-K selection stage rather than at the kill stage — under the anti-conservatism clause of "unpublished ≠ mediocre," this is by design, but it means there is **no kill-rate test for the middle ground of "mediocre but not rigid-pattern"**: the plants used were all obvious targets, and a sample that was "passable but lacked judgment" was never planted. The flip side of score compression is insufficient ranking information — prioritization between clusters in practice relied on the judge's top-K narrative rather than the scores themselves.

### 3.3 Attack Annealing (S3+S7) — Verdict: **the value center of the system, the mechanism most worth retaining**

The numbers: P2's skeleton attack produced 10 findings (2 critical) + an F11 follow-up; P3, 15 findings (6 critical); P4, 17 findings (7 critical); P5, 11 findings + 2 systemic (3 critical); all four papers converged to clean within 3 rounds, with zero use of the tempering budget. The S7 final-draft integrated attack caught a further 15 findings (mostly labeled as major-class), and the matrix attack caught 1 more instance of overreach in the synthesis. **Across the entire run, 69+ findings were produced, each disposed of and re-verified to closure item by item, with none left open.**

The quality characteristic of this convergence is the crux: what the attacks forced out was not rhetorical concessions but structural honesty —

- P3's "valuation-smoothing **collusion**": collusive intent is unfalsifiable → downgraded to a hypothesis pending pre-registration, retaining only the identified demand-side value and the error-correction speed gradient;
- P4's "Netherlands–Denmark comparison": survivorship bias cuts both ways symmetrically, severing both the "the system is superior" and "the system is not superior" directions → the headline converged to "not blowing up cannot support an inference of superiority," with N=1 downgraded to an illustrative case;
- P4's "stress test mis-specified the independent variable": the attack pointed out that "more extreme ≠ larger basis points" was an analytical proposition being smuggled in as causal → its status as an axiom was acknowledged, and the causal version was downgraded pending testing;
- P5's "decumulation-side vacuum": a universal-ontology claim → narrowed to a testable version of structural mismatch plus soft constraints, correcting a factual error about PAYG along the way;
- Matrix layer: the synthesis still described a leg of P3 — one already downgraded because the underlying SEC rule was judicially vacated — as "identified" → this was forced into alignment with the individual paper's withdrawn status.

This set of examples shows that: **what adversarial annealing bears responsibility for in this framework is not "fault-finding" but converging the claims of judgment onto the position their evidence can actually bear.** The defensibility of the finished product derives directly from this. If only one mechanism of the framework were to be kept, this is the one to keep.

### 3.4 FROZEN Relay and Parallelism — Verdict: **effective, with one lesson**

The FROZEN-S4 relay lock allowed P5 to consume upstream frozen artifacts without waiting for upstream S7, and the throughput during the parallel sprint phase of the four papers (660,000–730,000 tokens per hour) is a direct benefit of the relay design. Lesson: **freezing must occur after the artifact's final form** — P3/P4's briefs underwent field reordering after freezing, causing sha drift and a second freeze. The correct order is "content finalized → format gate passed → then freeze."

### 3.5 Honest-Empirics Protocol (S5) — Verdict: **the hardest evidence for T-1, established**

Under the iron rule of "fabricate no coefficient/p-value/sample size whatsoever," the empirical executors across the five papers delivered 76 [verified] aggregate facts (all with source URLs attached, independently verified via WebSearch) plus 80+ explicit downgrade annotations. More importantly, there were **four proactive corrections** (see §0, item 3) — the executors, in the course of verification, discovered numerical-calibration errors in the seed/upstream narrative and corrected them rather than deferring to the upstream account. This proves that "honesty" is not passive compliance but proactive behavior. The matrix fact-table ultimately settled into 22 rows of cross-paper reconciled facts, with zero cross-paper calibration conflicts.

An honest statement of the cost: **the empirical layer of the five papers is complete at the level of "identification design + institutional facts," not at the level of "estimated econometric results."** Wherever micro-panel data were unobtainable, the work stopped at the design layer. "Publication-ready" here refers to the completeness of style, logic, and honest boundary-setting; submission to a top journal would still require execution with real data — this boundary is stated in each paper's limitations section and in the synthesis.

### 3.6 Two-Layer Artifacts (draft/thesis) — Verdict: **necessity proven in reverse by the S7 attack**

The layering introduced at r4 — a "working draft (with audit markers) → finished draft (MLA transcription)" — was originally meant to address the user's feedback that "the language isn't academic enough." In practice its second function proved more important: of the major findings the S7 integrated attack caught across the four papers, roughly 60% were **working-draft audit markers** such as `[service judgment:]`, `C1..C5`, or footer self-descriptions — these are gate-mandated reconciliation requirements in the draft, but scaffolding that must be stripped in the thesis. The layering meant that "auditability" and "a clean finished product" were no longer mutually exclusive; findings of this kind were legitimately closed in the disposition record as refuted-with-evidence (working-draft markers are not finished-product defects). Without the layering, this would have been an unresolvable contradiction.

### 3.7 Matrix Layer (M5) — Verdict: **not window dressing, caught real problems**

Bidirectional traceability (every upstream reference number cited by P5's ten derivation blocks had to actually exist), re-derivation verification (premise fidelity / support / no-cherry-picking, 10/10 on all three criteria), cross-paper duplicate checking (25 clusters, 0 duplicates, along with a non-duplication argument that "endogeneity is a meta-signature acting on different objects"), and zero calibration conflicts. The overreach the matrix attack caught in the synthesis (C-1) is direct proof of the matrix layer's value: **each paper being individually honest does not guarantee system-level honesty — the synthesis has its own independent motive to overreach** (wanting to sell the system as more powerful than it is).

### 3.8 Human Gate = Standing Authorization — Verdict: **a necessary channel for full automation, carrying genuine risk**

The user's own authorizing words ("keep running until all the papers have been thoroughly completed to a publication-ready state") served as a batch-signed audit signature for the S3/S7/M gates. Benefit: 11 hours of unattended operation became possible. Risk (disclosed): the tone-setting gate was originally designed as the injection point for human taste, and batch signing meant that taste correction came to depend on the user's proactive mid-course intervention — which in fact happened twice ("the language isn't academic enough" triggering r4, and "speed up via parallelism" triggering package B), both of which prove that **the critical taste signal still comes from a human**. This is not a defect of the framework; it is the real boundary of autonomy (see §6).

---

## 4. Catalog of Failure Modes

| # | Failure class | Count | Symptom and root cause | Verified mitigation | Direction for a permanent fix |
|---|---|---|---|---|---|
| 1 | Dispatch corruption | ~7 | Subagent received context garbled and unrelated to the task (returning outputs like "skill selection / summary," 0 tool calls); suspected harness-side prompt-assembly race condition | Strengthened upfront statement of the task's nature ("this is task X, not skill selection, does not involve $skill") before re-dispatching, all succeeded | Post-dispatch echo verification (require the agent to first restate the task type before proceeding) |
| 2 | Format dialect | ~9–10 | Mismatch between the gate predicates' machine vocabulary (`候选`/`明·盲`/`证据链`/`服务判断: P#-#`/row-header `表N`/parenthetical containing year/```json disposition block) and workers' free-form vocabulary | All fixed on the data side (reordering/normalization/block completion), zero gate modifications | **schema-in-dispatch**: embed the predicates verbatim into the dispatch prompt (later-stage dispatches already did this; P5's S4 dossier thereby passed on the first try) |
| 3 | Sha-binding failure | 2 | Scorer manually transcribed a 64-bit sha and dropped one character; a pool's sha expired after format normalization | Recomputed and rebound by **the scorer personally** (via SendMessage continuing the session), the conductor did not modify the anchor on the scorer's behalf | Scorers should compute sha with a tool and write it directly, manual transcription prohibited |
| 4 | Post-freeze drift | 2 | Fields in a brief were reordered after freezing → FROZEN sha mismatch | Re-froze after reordering; the gate's mismatch alarm itself served as a line of defense | Freezing scheduled after the format gate (process-order correction) |
| 5 | Harness constraints | 3 | During certain periods subagents were forbidden from writing report files; zsh not word-splitting unquoted variables; a `[test]&&` trailing iteration broke the && chain | Attackers returned inline + the conductor transcribed verbatim (independence preserved via context separation); `${=var}`; node scripts replacing shell loops | Route critical writes through node, not dependent on shell dialect |
| 6 | Session volatility | Compaction ×N + crash ×1 | Context window exhaustion / crash on the user's side | Disk-state design enabled lossless recovery throughout (logs + FROZEN + re-runnable gate) | Already a built-in design resilience, no change needed |
| 7 | Quota exhaustion | 1 | User's subscription window ran out midway through matrix closeout, interrupting closeout | User resumed and completed the run after recovery | Budget metering + phase-cost forecasting (§7-8) |
| 8 | Fabricated bibliographic metadata | 3 entries (P2) + several same-family orphan citations | The Polisher, at points where the ledger contained only title/URL, fabricated author names on its own (Ni & Yin / Anantharaman & Chuk / Bikker & Vlaar were all misattributed); the gate only validated the **quantity and format** of parenthetical citations, not the **authenticity** of attribution | Caught by item-by-item external verification during Fable's final check after completion; the remediation principle "rather no name (title-first MLA style) than a fabricated name" was applied, with real-name verification across all five papers' full tables | Force capture of the author field when recording sources in the ledger; prohibit the Polisher from filling in any field absent from the ledger (§7-11) |
| 9 | Residual final-check items (style/labeling layer) | 35 instances (P1:9/P2:7/P3:6/P4:5/P5:8) | Of these, 2 were substantive content errors (P3 an order-of-magnitude error of 10×, P3 a citation misattributed to the wrong subject), 2 were calibration-precision errors (P5 a cross-period spread, P1 a £65bn daily-vs.-total-amount confusion), and the rest were over-applied "identified" labels, register drift from inspection edits, pointer/numbering mismatches, and bibliographic hygiene — **the S7 gate preserved structural and honesty-related integrity, but could not guarantee editorial precision** | Fully disposed of in a fresh-eyes final-check batch after completion (5 reviewer agents + 5 fixer agents) | Institutionalize "external-perspective editorial final check" as a standing S8 stage (§7-12) |

Overall: **no failure class caused any loss of content or compromise of quality**; all costs manifested as rework tokens (estimated at 5–8% of output) and clock-time delay. The most broadly valuable lessons in the failure catalog are #2 and #3 — machine-adjudicable validators require the dispatch side to convey the "machine vocabulary" as an interface contract, rather than expecting the agent to guess it correctly.

---

## 5. Token Economics

### 5.1 Where the Money Went (Structural Estimate of the 3.65M Output)

| Use | Estimated Share | Basis |
|---|---|---|
| Draft production and transcription (S6 Writer + Polisher + humanizer verification) | ~30% | Five Writer passes 55–113k + Polisher 53–67k + humanizer checks ~10k each |
| Divergence and review (reconnaissance × 15 lenses + deduplication + Judges at each tier) | ~20% | Single reconnaissance unit 4–6k × ~30, single Judge unit 8–15k × ~15 |
| Adversarial governance (S3/S7/matrix attacks + revisions + re-verification + patrols) | ~25% | Single attack unit 7–29k × 13 rounds + revisions 9–12k + re-verification |
| Command overhead (dispatch prompts/checkpoints/gate runs/format-fix coordination) | ~32%→about half of this overlaps with the above | Main loop 1.17M |
| Empirical verification (S5 WebSearch verification × 5) | ~8% | Single unit 11–15k × 5 |
| Rework (formatting dialects/corrupted redispatches/integration fixes) | ~5–8% | Reflow agent 29–33k × 2 + bracket-annotation fixes + redispatch |

Rough breakdown: **roughly three-tenths production, roughly five-tenths fidelity (divergence + review + adversarial governance + verification), roughly two-tenths coordination and friction**. "Fidelity ≈ 1.7× production" is precisely this framework's pricing structure — what it buys is enumerated in §3.3/§3.5 (69+ findings closed, zero fabrication, four proactive corrections).

### 5.2 Cache Dependence

Of the 468.6M input-side tokens, 441.9M were cache reads (94.3%). This means the same long system prompt and project context were reused across 2,380 requests. **Without prefix caching, input costs would run roughly 17× current levels, and the architecture would not be economically viable at all.** Corollary: the dispatch design of this kind of multi-agent loop should maximize prefix stability (a fixed template with variable content only at the tail) — something this project achieved unintentionally (via templated dispatch), and which should become an explicit design constraint going forward.

### 5.3 Efficiency Verdict

At "178,000 output tokens per 10,000 words of finished body text," this framework costs roughly 4–5× more than a single-pass direct draft. What that premium buys: fixes to 53+ skeleton-level findings (18 of them critical — a single-pass draft would ship with these structural defects intact), zero-fabrication discipline, and end-to-end auditability. **For judgment-dense research deliverables that claim to need defensibility, the premium is justified; for formatted-report-type tasks, this framework is unnecessary.** Another real constraint is the subscription window: total output of 3.65M already brushed against the single-window ceiling (the user ran out mid-course once); any larger matrix would need a cross-window checkpoint-resume design — the framework's on-disk-state resilience happens to already satisfy this, an unplanned architectural dividend.

---

## 6. Autonomy Assessment: Can It Generalize to Social Science / Business Research

### 6.1 Three Preconditions for Autonomy (as Actually Satisfied in This Project)

1. **Standing authorization**: the user pre-grants the executor signing authority for human gates (in the original wording, "audit signature"). Without it, every tone-setting gate is a stopping point.
2. **Deterministic verifiers**: gate.mjs provides a hard floor that does not depend on model judgment (field existence, sha consistency, count minimums, banned-word checks, disposition closure). A model reviewer can be argued with; a regex cannot.
3. **Externalized taste**: the taste-ledger compresses the user's research taste into 5 portable clauses (judgment-first / slow modeling / logic-as-core / degree-level convention / MLA + humanizer), and every reviewer and attacker is required to echo it back. This turns "taste" from session memory into a machine-readable contract.

With all three in place, the measured autonomy was: **7 continuous hours without human intervention**, advancing 4 papers in parallel; across an 11–12-hour active period, the user intervened only 4 times (2 taste-direction pivots, 1 shutdown, 1 resume instruction).

### 6.2 Directly Portable Components (Domain-Agnostic)

- The adversarial-annealing closed loop (attack → item-by-item disposition → re-verify until clean) and the "honest downgrade" disposition grammar;
- Plant calibration (blind-injecting known-bad samples into reviewers to test their killing power);
- The audit trio of sha-bound scoring + content freezing + append-only logging;
- Two-tier artifacts (working draft with audit markers / finished draft with scaffolding stripped);
- Dual-exit cooling (exhaustion / rich-vein) and blind/sighted mixing to prevent anchoring;
- Cross-document provenance tracing / deduplication / accounting reconciliation at the matrix layer.

None of these mechanisms depend on economics content — what they enforce is **the discipline of aligning claims with evidence**, which is isomorphic across any domain where argument is the product (social science, business, law, policy analysis).

### 6.3 Components Requiring Domain Adaptation (Where Porting Costs Lie)

| Component | This Project (Economics) | Qualitative Social Science | Business Case/Strategy |
|---|---|---|---|
| Rigid-pattern checklist | Coefficient regurgitation / data-first / paeans to advanced-country experience / disregard for endogeneity | Theory-as-costume / stacked interview quotes / absence of reflexivity | Framework fill-in-the-blank (Porter's Five Forces-style) / success-literature narrative / survivorship-bias case selection |
| Evidence-tier ruler | Identification design (IV/DiD/RDD) + pre-registration | Triangulation / saturation / member checking | Within-case/cross-case replication logic / honest disclosure of confidential-data availability |
| Where "honest downgrade" lands | Demoting to a theoretical proposition / awaiting pre-registration | Demoting to an interpretive description / awaiting fieldwork | Demoting to a hypothetical framework / awaiting interviews or a data room |
| Empirical verification method | WebSearch verification of institutional facts | Literature and archival verification | Financial-report/industry-database verification |

Estimated porting effort: rewriting the rigid-pattern checklist, scoring rubric, S5 verification protocol, and gate field predicates for a new domain amounts to about one r-level methodology iteration (in this project, r3/r4 each took about half a day). **The loop's ontology itself (the S0–S7 state machine, the attack loop, the freeze-and-relay handoff, the M layer) needs no rewriting.**

### 6.4 An Honest Delimitation of Autonomy's Boundaries

Three things the framework **cannot do**, all demonstrated by actual events in this project:

1. **Genre self-check**: when P1's draft was completed, the logic layer was all-green, but it "did not read like a paper" (no abstract/citations/references) — this defect was invisible to the gate (no such predicate existed at the time), invisible to reviewers (who assess judgment), and visible only to the user, at a glance. An automated system will satisfy the contract it is given; **a gap in the contract itself can only be spotted by a human.**
2. **Correcting taste drift**: under the standing-authorization mode, if the five papers gradually drift toward some style that is internally consistent but diverges from the user's taste, no role inside the loop can raise an alarm. This project avoided the problem through short duration (17 hours) and the user's spot checks; long-duration projects need a designed "taste-regression sampling" mechanism (periodically pushing summaries of intermediate outputs to a human).
3. **Goal-level decisions**: increasing parallelism, pivoting toward finalization, and pacing the closeout were all decisions made by the user. The framework's autonomy is **execution autonomy** (running a given contract to completion unattended), not **goal autonomy**.

Conclusion: in social-science/business contexts, this framework can fully automate the execution segment — from a pool of candidate topics to a defensible finished draft — with the human's irreplaceable role converging to three points: **setting the contract (spec + taste), a mid-course genre spot check, and final acceptance.** This happens to mirror exactly the role structure of an academic advisor to a doctoral student, which suggests this division of labor is not a stopgap but a stable equilibrium.

---

## 7. Improvement Checklist (Ranked by Expected Return)

1. **schema-in-dispatch**: for every dispatch that produces a structured artifact, embed the gate predicates verbatim (field names / regex examples / counter-examples). Expected to eliminate the entire class of §4-2 failures (this project's largest single source of rework). Piloted in later dispatches (P5 S4 archive passed the gate in one shot), and confirmed effective.
2. **Tool-enforced sha for scorers**: the scorecard's target_sha256 should be pasted directly from a shasum command's output executed by the scorer, with manual transcription prohibited; the gate should add a formal check that "the sha line must be adjacent to the command output block."
3. **Plant calibration for the deduplication layer**: blind-inject known semantic-duplicate pairs to the deduplicator to test its killing power; auto-trigger a calibration round whenever novelty_yield is constantly 1.0. This closes the gap noted in §3.1.
4. **Planting in the middle ground**: beyond "obviously rigid," add a "passable but lacking judgment" tier to reviewer plants, to test discriminative power in the compressed scoring band (§3.2).
5. **Dispatch echo protocol**: before starting work, a subagent restates in one sentence the task type and output path; the conductor checks this and then releases the task — a single minimal round trip that eliminates the entire class of dispatch-corruption total losses (§4-1).
6. **Compressing command overhead**: extract dispatch templates into file references ("read prompts/X.md and execute, with parameters as follows"), expected to compress the main loop's 32% output share down to ~20%, while also improving prefix-cache hit rates.
7. **Taste-regression sampling**: every N gates, auto-generate a one-page "taste snapshot" (a sample of current judgment style) and push it to the human, converting the drift risk in §6.4-2 from "relying on the user's proactive spot checks" to "the system proactively submitting for review."
8. **Budget metering and phase forecasting**: the conductor should maintain a token-consumption ledger (this retrospective's audit script can be directly repurposed as a runtime component), forecasting before each phase whether the remaining budget can cover it, and automatically front-loading the highest-value tasks as the ceiling approaches (in this project, the budget ran out right at the matrix closeout — with forecasting, closeout could have been completed first before optional items).
9. **Downgrading mechanical steps**: registration/deduplication/format-normalization-type mechanical steps should use lightweight models (this project's 208 subagents ran almost entirely on a fully-loaded flagship model; mechanical steps account for roughly three-tenths of request count, a clear downgrade opportunity).
10. **External anchor for attack quality**: periodically pull 1–2 already-clean clusters and send them to an independent second red team (a different prompt lineage) for re-attack, to calibrate the "clean" verdict itself — this project's evidence for attack quality was entirely internal (the specificity of findings), lacking an external control.
11. **Real-name citation policy**: when the evidence ledger registers a source, mandatorily fetch and verify the author/journal/volume-issue fields; Polisher's MLA entries may only transcribe ledger fields, and if the ledger lacks an author, use a title-first entry format — explicitly extending the "zero fabrication" predicate to bibliographic metadata (a root fix for §4-8).
12. **Standing final editorial pass (S8)**: after S7, institute a fixed round of "fresh-eyes external review plus fixes" (when added retroactively in this project, it netted 35 catches, 2 of them substantive errors). Gate predicates can only verify machine-checkable items; editorial precision (orders of magnitude, pointer consistency, terminology consistency, register/tone) requires one close read unencumbered by history — cost was about 150,000 output tokens per five papers, 4% of total consumption, among the highest return-to-cost ratios of any step in the whole pipeline.

---

## 8. Overall Verdict

**Validity**: established. The defensibility of the five finished papers rests on a traceable production mechanism (adversarial annealing + honest downgrade + deterministic verification), not on the luck of a single generation pass. The process by which 53+ skeleton-level findings were forced out and then closed is itself the craft record of "judgment that holds up."

**Efficiency**: upper-middle, with clear room for improvement. The quality bought by the 4–5× governance multiplier is worthwhile for judgment-dense deliverables; rework at 5–8% and command overhead at 32% are two known compressible items — once improvements 1/5/6/9 land, estimated total consumption could drop 25–35%.

**Autonomy**: full autonomy in the execution segment has been empirically validated over 11 hours; autonomy at the goal level is a false proposition — the correct product form is not "an unmanned research machine," but rather **mechanizing the advisor–doctoral-student division of labor**: the human retains contract authority, genre spot-check authority, and acceptance authority, while everything else is delegated to the loop. Under this definition, this framework has reached a reusable state for judgment-dense long-form deliverables in social science/business, with porting costs concentrated in domain adaptation of the rigid-pattern checklist and evidence ruler, while the loop's ontology can be carried over directly.

In one sentence: **the true product of this simulated-annealing framework is not the five papers, but the verification that "honesty can be engineered into a forced outcome" — the papers are merely its first batch of output.**

---

*Retrospective basis: the complete state/ archive, the docs/runbook execution contract, a token audit of 2,380 requests (script included in the execution record), and the all-green re-verification status of S7 + M5 across all five papers. This document was authored by Fable 5 after matrix completion, as a methodological appendix to the reviews/ layer.*
