---
title: "The Skill Spiral: Parsing Concepts → Eval Arms Race → Back to Concepts"
description: "A full development retrospective of the Caoliao style-rewriting skill family — seven days, 80 commits — with timelines, blind-judging data, the semantic calibration loop, and the v2 two-plane architecture: how my understanding of skills went from concept parsing to an eval arms race and finally back to concepts."
tags: [AI, agent, skill, tech-report]
date: 2026-07-15
updated: 2026-07-15
lang: en
---

<style>
.vz{color-scheme:light;
  --vz-s1:#2a78d6; --vz-s2:#008300; --vz-s3:#e87ba4;
  --vz-ink:var(--fg,#1d1d2b); --vz-sub:var(--sub,#63637a);
  --vz-grid:rgba(20,20,40,.13); --vz-axis:rgba(20,20,40,.32);
  margin:2.2rem 0;}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]) .vz{color-scheme:dark;
    --vz-s1:#3987e5; --vz-s2:#008300; --vz-s3:#d55181;
    --vz-grid:rgba(255,255,255,.14); --vz-axis:rgba(255,255,255,.32);}
}
:root[data-theme="dark"] .vz{color-scheme:dark;
  --vz-s1:#3987e5; --vz-s2:#008300; --vz-s3:#d55181;
  --vz-grid:rgba(255,255,255,.14); --vz-axis:rgba(255,255,255,.32);}
.vz svg{display:block;max-width:100%;height:auto;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
.vz text{fill:var(--vz-ink);font-size:11px}
.vz .t2{fill:var(--vz-sub);font-size:10.5px}
.vz .tb{font-weight:600;font-size:12px}
.vz figcaption{font-size:.85rem;color:var(--sub,#63637a);margin-top:.5rem;line-height:1.5}
</style>

[The last post](/blog/fable-scaling-layering/en/) was about models and harnesses; this one is about the thing squeezed between them: skills. The last post was commentary — this one is a development retrospective, covering two projects:

- **The Caoliao-Docs repo**: 2026-07-09 through 07-15 — seven days, 80 commits — building "rewrite Caoliao's public docs back into their own voice" from zero into a 6-skill family (3 writer tiers + 3 checker tiers, now at v2.3);
- **The skills repo**: roughly two months, 16 public skills plus the pipeline that builds skills.

Both projects traveled the same path: my understanding of skills went from **parsing concepts** (write down what you understand) to **eval-first** (whatever can't be verified doesn't count) and finally **back to concepts** (the concept becomes the single source of truth; evals get demoted to calibrating fidelity to it). This retrospective walks each phase in order — methods, data, failure modes. Conclusions up front:

1. **A concept is not prose.** A concept that can't answer "who makes this judgment, by what criterion, and what catches it when it fails" is just an exhortation, and exhortations execute with uncontrolled variance.
2. **Evals measure relative differences; they do not define quality.** Three major showdown rounds used three judging rubrics and crowned three different champions — the rubric itself is a concept smuggled in through the side door.
3. **Returning to concepts discards none of the eval-era assets — they change jobs**: from definers of quality to calibrators of concept fidelity. A spiral, not a circle.

## 1. Task definition and timeline

The engineering definition of the task: Caoliao's public-facing docs (solution pages, help docs, promo articles, customer cases, FAQ) had previously been rewritten by AI; the page logic held up, but the voice drifted. The skill's job is to **preserve facts, image references, and information density while swapping sentence patterns, word choice, and register**, under three invariants: zero knowledge injection (mechanisms, benefits, or feature names absent from the original may never be written in, even when the model is sure they're true), zero leakage of internal business statistics, and public-page red lines taking priority over style. The runtime is a Claude Code skill; the only prerequisite is Node.js ≥ 18.

<figure class="vz">
<svg viewBox="0 0 640 268" role="img" aria-label="Daily commit counts over seven days, colored by phase">
  <line x1="42" y1="145" x2="622" y2="145" stroke="var(--vz-grid)"/>
  <line x1="42" y1="81" x2="622" y2="81" stroke="var(--vz-grid)"/>
  <line x1="42" y1="18" x2="622" y2="18" stroke="var(--vz-grid)"/>
  <text x="36" y="148" text-anchor="end" class="t2">10</text>
  <text x="36" y="84" text-anchor="end" class="t2">20</text>
  <text x="36" y="21" text-anchor="end" class="t2">30</text>
  <path d="M 59.4 208 V 110.7 Q 59.4 106.7 63.4 106.7 H 99.4 Q 103.4 106.7 103.4 110.7 V 208 Z" fill="var(--vz-s1)"><title>07-09 · 16 commits · concept parsing + infra</title></path>
  <path d="M 142.3 208 V 22 Q 142.3 18 146.3 18 H 182.3 Q 186.3 18 186.3 22 V 208 Z" fill="var(--vz-s2)"><title>07-10 · 30 commits · eval arms race</title></path>
  <path d="M 225.1 208 V 104.3 Q 225.1 100.3 229.1 100.3 H 265.1 Q 269.1 100.3 269.1 104.3 V 208 Z" fill="var(--vz-s2)"><title>07-11 · 17 commits · eval arms race</title></path>
  <path d="M 308 208 V 205.7 Q 308 201.7 312 201.7 H 348 Q 352 201.7 352 205.7 V 208 Z" fill="var(--vz-s2)"><title>07-12 · 1 commit · 1.0.0 release</title></path>
  <path d="M 390.9 208 V 205.7 Q 390.9 201.7 394.9 201.7 H 430.9 Q 434.9 201.7 434.9 205.7 V 208 Z" fill="var(--vz-s2)"><title>07-13 · 1 commit · 1.0.1</title></path>
  <path d="M 473.7 208 V 161.3 Q 473.7 157.3 477.7 157.3 H 513.7 Q 517.7 157.3 517.7 161.3 V 208 Z" fill="var(--vz-s3)"><title>07-14 · 8 commits · v2 rebuild</title></path>
  <path d="M 556.6 208 V 167.7 Q 556.6 163.7 560.6 163.7 H 596.6 Q 600.6 163.7 600.6 167.7 V 208 Z" fill="var(--vz-s3)"><title>07-15 · 7 commits · calibration + distillation + v2.3</title></path>
  <text x="81.4" y="100.7" text-anchor="middle">16</text>
  <text x="164.3" y="12" text-anchor="middle">30</text>
  <text x="247.1" y="94.3" text-anchor="middle">17</text>
  <text x="330" y="195.7" text-anchor="middle">1</text>
  <text x="412.9" y="195.7" text-anchor="middle">1</text>
  <text x="495.7" y="151.3" text-anchor="middle">8</text>
  <text x="578.6" y="157.7" text-anchor="middle">7</text>
  <line x1="42" y1="208" x2="622" y2="208" stroke="var(--vz-axis)"/>
  <text x="81.4" y="226" text-anchor="middle" class="t2">07-09</text>
  <text x="164.3" y="226" text-anchor="middle" class="t2">07-10</text>
  <text x="247.1" y="226" text-anchor="middle" class="t2">07-11</text>
  <text x="330" y="226" text-anchor="middle" class="t2">07-12</text>
  <text x="412.9" y="226" text-anchor="middle" class="t2">07-13</text>
  <text x="495.7" y="226" text-anchor="middle" class="t2">07-14</text>
  <text x="578.6" y="226" text-anchor="middle" class="t2">07-15</text>
  <rect x="42" y="244" width="10" height="10" rx="2" fill="var(--vz-s1)"/>
  <text x="58" y="253">Concept parsing + infra</text>
  <rect x="220" y="244" width="10" height="10" rx="2" fill="var(--vz-s2)"/>
  <text x="236" y="253">Eval arms race (to 1.0.1)</text>
  <rect x="430" y="244" width="10" height="10" rx="2" fill="var(--vz-s3)"/>
  <text x="446" y="253">v2 rebuild + distillation</text>
</svg>
<figcaption>Fig. 1 · Daily commits in the Caoliao-Docs repo over seven days (80 total), colored by the day's dominant work. The dip on 07-12/07-13 is the 1.0.0/1.0.1 release; 07-14 starts the v2 teardown rebuild.</figcaption>
</figure>

| Phase | Dates | Representative output | How quality was judged |
|---|---|---|---|
| Concept parsing | 07-09 | corpus + style docs + v3 / v3-doc | reading it yourself |
| Eval arms race | 07-09 – 07-13 | blind-judging protocol v2.1, showdowns R1–R5, mechanical gates, six-skill family 1.0.x | blind scores + mechanical gates |
| Back to concepts | 07-14 – 07-15 | v2 design charter, judgment ledger, thin-shell distillation, v2.3 | contract fidelity (gates G1–G14) |

## 2. Phase one: concept parsing (07-09)

Day one went entirely into "understanding the voice." The methods were sound — v2 still consumes this output today:

- **Four-way reconnaissance**: help-center structure, business scope, local corpus inventory, and human-written vs AI-written A/B comparison. Old-voice samples came from enumerating 2024–2025 snapshots through the Wayback Machine's CDX API (live pages already contain AI rewrites and can't serve as a baseline); every corpus entry carries a cleanliness grade (confirmed-human / wayback-2025-earlier / suspect-live-2026 / confirmed-ai).
- **AI-fingerprint diffing**: item-by-item comparison of the human and AI versions of the same page, distilled into an actionable fingerprint list — dense parallelism, the "not A but B" frame, em-dash interjections, rhetorical-question openers, chatty similes, precise numbers with named cases, length inflated 4–5×.
- **Style as documents**: a "soul" doc (informal "you," no marketing adjectives, honest boundaries) and a red-line codex (get to the point, no rhetorical questions, causal-chain argumentation, iron rules on internal data).

Two skills came out of this: v3, **prose exhortation** — thousands of characters in `SKILL.md` telling the model how to write; and v3-doc, which added retrieval over the distilled corpus so the model could look things up before rewriting.

Three failure modes were diagnosed at the time: rules sliced from an abstract style guide with no native samples behind them; vocabulary and example density too thin (about 30 glossary entries and 7 good/bad pairs for 12 scenario types); no per-scenario routing. The deeper problem showed up in actual runs: **the same exhortation executes with uncontrolled variance** — sometimes faithful, sometimes the model decides it has a better idea; retrieval lets it "know" what the old voice looks like, but knowing and writing are different acts. And at this point there was no evidence that could answer "is this version better than the last one" — the only instrument was reading it yourself.

The skills repo had made the same mistake earlier: writing methodology into a knowledge base and assuming knowledge density equals execution quality.

## 3. Phase two: the eval arms race (07-09 – 07-13)

The response was to make everything measurable. The evaluation infrastructure built over four days:

- **Blind-judging protocol**: outputs anonymized A–F; judges split into five persona seats (decision-maker, operator, procurement, consumer reader, etc.); one vote per case per persona; the mapping kept private until unblinding; the protocol itself iterated to v2.1 (fix mechanisms, never adjust scores).
- **Six deterministic axes**: wrong terminology, red lines, heavy slang, light slang, concrete description and the like — mechanically countable, kept separate from blind scores.
- **Mechanical gates**: finished-product gates for scraping residue, empty skeletons, dangling teasers; an absolutism red-line linter ("zero missed detections" → "lower miss rate," "permanent" → "long-term," no "first in the city"); hard structural gates (zero new facts, zero lost image src, length within ±20%); later, a zero-tolerance gate on em-dashes.
- **A context classifier**: section-level classification over eight context classes driving automatic S/M/H register routing; three iterations pushed section-level accuracy from 71.8% to 93.1% and CLAIM-class recall from 58% to 92%.

<figure class="vz">
<svg viewBox="0 0 640 210" role="img" aria-label="Classifier before and after three iterations">
  <circle cx="48" cy="16" r="5" fill="var(--vz-s1)"/>
  <text x="60" y="20">Before</text>
  <circle cx="130" cy="16" r="5" fill="var(--vz-s2)"/>
  <text x="142" y="20">After 3 iterations</text>
  <line x1="44" y1="36" x2="44" y2="166" stroke="var(--vz-axis)"/>
  <line x1="184" y1="36" x2="184" y2="166" stroke="var(--vz-grid)"/>
  <line x1="324" y1="36" x2="324" y2="166" stroke="var(--vz-grid)"/>
  <line x1="464" y1="36" x2="464" y2="166" stroke="var(--vz-grid)"/>
  <line x1="604" y1="36" x2="604" y2="166" stroke="var(--vz-grid)"/>
  <text x="44" y="184" text-anchor="middle" class="t2">0</text>
  <text x="184" y="184" text-anchor="middle" class="t2">25</text>
  <text x="324" y="184" text-anchor="middle" class="t2">50</text>
  <text x="464" y="184" text-anchor="middle" class="t2">75</text>
  <text x="604" y="184" text-anchor="middle" class="t2">100%</text>
  <text x="44" y="46" class="tb">Section-level accuracy</text>
  <path d="M 44 52 H 442.1 Q 446.1 52 446.1 56 V 64 Q 446.1 68 442.1 68 H 44 Z" fill="var(--vz-s1)"><title>before 71.8%</title></path>
  <text x="452" y="64">71.8</text>
  <path d="M 44 72 H 517.4 Q 521.4 72 521.4 76 V 84 Q 521.4 88 517.4 88 H 44 Z" fill="var(--vz-s2)"><title>after 93.1%</title></path>
  <text x="527" y="84">93.1</text>
  <text x="44" y="114" class="tb">CLAIM-class recall</text>
  <path d="M 44 120 H 364.8 Q 368.8 120 368.8 124 V 132 Q 368.8 136 364.8 136 H 44 Z" fill="var(--vz-s1)"><title>before 58%</title></path>
  <text x="375" y="132">58</text>
  <path d="M 44 140 H 559.2 Q 563.2 140 563.2 144 V 152 Q 563.2 156 559.2 156 H 44 Z" fill="var(--vz-s2)"><title>after 92%</title></path>
  <text x="569" y="152">92</text>
</svg>
<figcaption>Fig. 2 · The context classifier before and after three iterations (0.9.0.1-o1). The classifier only produces evidence; v2 later assigned the ruling itself explicitly to the LLM (D→L).</figcaption>
</figure>

The showdowns advanced in rounds, each answering one specific question:

| Round | What it tested | Key result |
|---|---|---|
| R1+R2 | o1's equivalence rebuild of v5 | double acceptance passed, industrial |
| R3 | extension to three depth tiers (0.8.1-o1) | double acceptance passed |
| R4 | standard tier vs v5, final behavioral proof | blind scores 83.92 : 83.92, gap 0.00 — equivalence holds |
| R5 | 20 new cases × 6 versions × 100 judging seats | see Fig. 3 |

R5 was the peak of the phase: 20 brand-new cases (12 scenario types, zero overlap with the old set), 6 versions, 120 rewrites at zero failures, 100 blind seats.

<figure class="vz">
<svg viewBox="0 0 640 300" role="img" aria-label="R5 unblinded scores: six versions on overall and consumer-reader seats">
  <circle cx="98" cy="16" r="5" fill="var(--vz-s1)"/>
  <text x="110" y="20">Overall (100 seats)</text>
  <circle cx="300" cy="16" r="5" fill="var(--vz-s2)"/>
  <text x="312" y="20">Consumer-reader seats (20)</text>
  <line x1="92" y1="32" x2="92" y2="240" stroke="var(--vz-grid)"/>
  <line x1="222" y1="32" x2="222" y2="240" stroke="var(--vz-grid)"/>
  <line x1="352" y1="32" x2="352" y2="240" stroke="var(--vz-grid)"/>
  <line x1="482" y1="32" x2="482" y2="240" stroke="var(--vz-grid)"/>
  <line x1="612" y1="32" x2="612" y2="240" stroke="var(--vz-grid)"/>
  <text x="92" y="258" text-anchor="middle" class="t2">50</text>
  <text x="222" y="258" text-anchor="middle" class="t2">60</text>
  <text x="352" y="258" text-anchor="middle" class="t2">70</text>
  <text x="482" y="258" text-anchor="middle" class="t2">80</text>
  <text x="612" y="258" text-anchor="middle" class="t2">90</text>
  <text x="84" y="48" text-anchor="end">promo</text>
  <line x1="458.6" y1="44" x2="509.3" y2="44" stroke="var(--vz-grid)" stroke-width="2"/>
  <circle cx="509.3" cy="44" r="5.5" fill="var(--vz-s1)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>promo · overall 82.1</title></circle>
  <circle cx="458.6" cy="44" r="5.5" fill="var(--vz-s2)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>promo · consumer 78.2</title></circle>
  <text x="509.3" y="34" text-anchor="middle" class="t2">82.1</text>
  <text x="458.6" y="62" text-anchor="middle" class="t2">78.2</text>
  <text x="84" y="84" text-anchor="end">v3</text>
  <line x1="471.6" y1="80" x2="534" y2="80" stroke="var(--vz-grid)" stroke-width="2"/>
  <circle cx="471.6" cy="80" r="5.5" fill="var(--vz-s1)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>v3 · overall 79.2</title></circle>
  <circle cx="534" cy="80" r="5.5" fill="var(--vz-s2)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>v3 · consumer 84.0</title></circle>
  <text x="471.6" y="70" text-anchor="middle" class="t2">79.2</text>
  <text x="534" y="98" text-anchor="middle" class="t2">84.0</text>
  <text x="84" y="120" text-anchor="end">v5</text>
  <line x1="452.1" y1="116" x2="467.7" y2="116" stroke="var(--vz-grid)" stroke-width="2"/>
  <circle cx="467.7" cy="116" r="5.5" fill="var(--vz-s1)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>v5 · overall 78.9</title></circle>
  <circle cx="452.1" cy="116" r="5.5" fill="var(--vz-s2)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>v5 · consumer 77.7</title></circle>
  <text x="467.7" y="106" text-anchor="middle" class="t2">78.9</text>
  <text x="452.1" y="134" text-anchor="middle" class="t2">77.7</text>
  <text x="84" y="156" text-anchor="end">o1-S</text>
  <line x1="432.6" y1="152" x2="545.7" y2="152" stroke="var(--vz-grid)" stroke-width="2"/>
  <circle cx="432.6" cy="152" r="5.5" fill="var(--vz-s1)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>o1-S · overall 76.2</title></circle>
  <circle cx="545.7" cy="152" r="5.5" fill="var(--vz-s2)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>o1-S · consumer 84.9, best in field</title></circle>
  <text x="432.6" y="142" text-anchor="middle" class="t2">76.2</text>
  <text x="545.7" y="170" text-anchor="middle" class="t2">84.9 ①</text>
  <text x="84" y="192" text-anchor="end">o1-H</text>
  <line x1="181.7" y1="188" x2="326.6" y2="188" stroke="var(--vz-grid)" stroke-width="2"/>
  <circle cx="326.6" cy="188" r="5.5" fill="var(--vz-s1)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>o1-H · overall 68.2</title></circle>
  <circle cx="181.7" cy="188" r="5.5" fill="var(--vz-s2)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>o1-H · consumer 56.9</title></circle>
  <text x="326.6" y="178" text-anchor="middle" class="t2">68.2</text>
  <text x="181.7" y="206" text-anchor="middle" class="t2">56.9</text>
  <text x="84" y="228" text-anchor="end">v4</text>
  <line x1="159.6" y1="224" x2="283.1" y2="224" stroke="var(--vz-grid)" stroke-width="2"/>
  <circle cx="283.1" cy="224" r="5.5" fill="var(--vz-s1)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>v4 · overall 64.7</title></circle>
  <circle cx="159.6" cy="224" r="5.5" fill="var(--vz-s2)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>v4 · consumer 55.2</title></circle>
  <text x="283.1" y="214" text-anchor="middle" class="t2">64.7</text>
  <text x="159.6" y="242" text-anchor="middle" class="t2">55.2</text>
  <line x1="92" y1="240" x2="612" y2="240" stroke="var(--vz-axis)"/>
</svg>
<figcaption>Fig. 3 · R5 unblinded results (sorted by overall score). o1-S took first place with its own target readers (consumer seats), winning best-vote 11/20 by a wide margin; o1-H beat v5 with procurement judges — each tier hit its own readers and sacrificed the others, exactly the shape the reader-contract design predicts.</figcaption>
</figure>

| Version | Overall | Consumer seats | Best votes (/100) |
|---|---|---|---|
| promo | **82.1** | 78.2 | **47** |
| v3 | 79.2 | 84.0 | 19 |
| v5 | 78.9 | 77.7 | 14 |
| o1-S | 76.2 | **84.9** | 14 |
| o1-H | 68.2 | 56.9 | 5 |
| v4 | 64.7 | 55.2 | 1 |

1.0.0 shipped on 07-12: a six-skill mirrored family. The skills repo was doing the isomorphic thing at the same time: every skill ships a deterministic validator plus red-green evals plus an independent attacker; "whoever writes the answer must not also grade it" became a first-class rule.

For the record, most of what this phase built is genuinely sound: **regexable rules sunk into deterministic scripts (zero tokens, zero randomness), red-before-green, independent adversarial testing** — still the foundation of this engineering today. Conveying enumerable rules through document density had already been falsified by phase one.

Then come two structural problems. Both sit at the boundary of the method itself; more careful execution would not have routed around them.

**Problem one: the champion flips with the judging rubric.** Three major rounds, three rubrics, three champions: RUN-1, the promo style wins; RUN-3, under a strict product-page-standards rubric, v5 wins (89.8 vs promo's 85.5); R5, with the rubric relaxed to "judge appropriateness by reader positioning," promo wins again (82.1). The data don't contradict each other — the judging contract changed. Blind panels can only answer "who wins under this contract," and *which contract to use* is precisely the concept question being skipped. R4's perfect 0.00 tie deserves the same wary reading: as an equivalence acceptance test it succeeded, but it also shows that blind judging measures relative differences and makes no claim about absolute quality. The skills repo supplied harder counterexamples: a regex fact-linter that stayed green over wrong facts; a citation linter progressively gamed into uselessness by "invisible markers." Scores saturate — and optimizing past saturation no longer optimizes quality.

**Problem two: concept debt accrues under green lights.** Tiers were cut as -10/-8/-5/-2, later renamed raw/xhigh/high/med — bigger number, higher quality, more tokens — but "tiers of *what*" was never defined. The pre-v2 audit quantified the consequences: the same rule stated 2–4 times across `SKILL.md`, law, voice, and `rules.yaml`; the numbers-policy matrix copied at least 5 times, red lines at least 6, the H-register contract at least 7; three mojibake spots in `voice.md`; the frontmatter carrying an entire version history; no in-package evals for the writer, so an installed copy could not be verified. Every copy had been left behind by some local patch that turned an eval green.

## 4. Phase three: back to concepts (07-14 – 07-15)

The trigger was three criticisms of 1.0 from the user (the Caoliao side): **the structure is chaotic; the style control is weak; and it's impossible to tell which judgments are made by the LLM and which by hardcoded, corpus-fitted checkers.** The third carries the most weight — it points at a missing concept: nothing in the system could answer "who makes this judgment, by what criterion, and what catches it when it fails."

v2 was a teardown rebuild, starting from a design charter written before any code, governed by a gate regime: G1 through G14, each gate's acceptance criteria pre-registered before work starts, every ruling logged in a decision ledger, and the independent battery's budget and seeds registered — immutable — before dispatch. The charter reduces to three concepts.

### 4.1 Two planes plus a human gate: every judgment must have an owner

<figure class="vz">
<svg viewBox="0 0 640 372" role="img" aria-label="v2 two-plane architecture with human gate">
  <defs>
    <marker id="ah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L8,4 L0,8 Z" fill="var(--vz-axis)"/>
    </marker>
  </defs>
  <rect x="14" y="86" width="96" height="56" rx="6" fill="none" stroke="var(--vz-axis)"/>
  <text x="62" y="110" text-anchor="middle" class="tb">Input doc</text>
  <text x="62" y="128" text-anchor="middle" class="t2">extract_md</text>
  <line x1="110" y1="114" x2="126" y2="114" stroke="var(--vz-axis)" marker-end="url(#ah)"/>
  <rect x="130" y="18" width="230" height="106" rx="6" fill="var(--vz-s1)" fill-opacity="0.10" stroke="var(--vz-s1)" stroke-width="1.5"/>
  <text x="146" y="40" class="tb">Plane D · mechanical</text>
  <text x="146" y="60" class="t2">rules.yaml: single rule registry</text>
  <text x="146" y="78" class="t2">style_check / structure_check / gates</text>
  <text x="146" y="96" class="t2">zero tokens · byte-identical tiers</text>
  <text x="146" y="114" class="t2">docs hold pointers only</text>
  <rect x="130" y="180" width="230" height="106" rx="6" fill="var(--vz-s2)" fill-opacity="0.10" stroke="var(--vz-s2)" stroke-width="1.5"/>
  <text x="146" y="202" class="tb">Plane L · semantic</text>
  <text x="146" y="222" class="t2">independent attacker, 3 lenses</text>
  <text x="146" y="240" class="t2">cards VC-xx: criterion + ❌/✅ pair</text>
  <text x="146" y="258" class="t2">+ output shape + Plane-D backstop</text>
  <text x="146" y="276" class="t2">dosage = only inter-tier variable</text>
  <line x1="210" y1="124" x2="210" y2="176" stroke="var(--vz-axis)" marker-end="url(#ah)"/>
  <text x="218" y="146" class="t2">D→L: evidence,</text>
  <text x="218" y="160" class="t2">LLM adjudicates</text>
  <line x1="330" y1="180" x2="330" y2="128" stroke="var(--vz-axis)" marker-end="url(#ah)"/>
  <text x="338" y="146" class="t2">L→D: output,</text>
  <text x="338" y="160" class="t2">mech. recheck</text>
  <rect x="440" y="100" width="184" height="104" rx="6" fill="var(--vz-s3)" fill-opacity="0.12" stroke="var(--vz-s3)" stroke-width="1.5"/>
  <text x="456" y="122" class="tb">H · human gate</text>
  <text x="456" y="142" class="t2">image PII final review</text>
  <text x="456" y="160" class="t2">confirm gate before repairs</text>
  <text x="456" y="178" class="t2">plausible / abandon rulings</text>
  <text x="456" y="196" class="t2">machine never oversteps</text>
  <line x1="360" y1="80" x2="436" y2="118" stroke="var(--vz-axis)" marker-end="url(#ah)"/>
  <line x1="360" y1="226" x2="436" y2="186" stroke="var(--vz-axis)" marker-end="url(#ah)"/>
  <rect x="130" y="304" width="494" height="58" rx="6" fill="none" stroke="var(--vz-axis)" stroke-dasharray="5 4"/>
  <line x1="245" y1="286" x2="245" y2="304" stroke="var(--vz-axis)" stroke-dasharray="3 3"/>
  <line x1="532" y1="204" x2="532" y2="304" stroke="var(--vz-axis)" stroke-dasharray="3 3"/>
  <text x="146" y="328" class="tb">Judgment ledger — 23 registered points</text>
  <text x="146" y="348" class="t2">id · owner D/L/D→L/L→D/H · artifact · backstop — ledger_lint.mjs: ids exist · cards exist · no orphans</text>
</svg>
<figcaption>Fig. 4 · The v2 two-plane architecture. Every judgment is explicitly owned by Plane D (regexable → deterministic script), Plane L (unregexable in principle → LLM judgment card), or H (the human gate); cross-plane collaboration has exactly two registered notations, D→L and L→D.</figcaption>
</figure>

There is exactly one dividing criterion: **can it be regexed in principle?** If yes, it goes into `rules.yaml` and runs on Node engines, with docs holding only pointers. If no (novel variants, semantics, pragmatics, whether a causal claim holds), it becomes a judgment card handed to an independent attacker — and every card must name the mechanical gate that backstops it when it misses. The human gate stands apart; the machine never oversteps.

### 4.2 The judgment ledger: a concept that can be linted

The ledger in `SKILL.md` registers every judgment point in the pipeline (23 for writer-max). Three real rows:

| Id | Judgment | Owner | Artifact | Backstop |
|---|---|---|---|---|
| J-01 | doc typing (doc_type × biz_scene × subtype) | L | `doc-types.md` criteria + misuse guard | subtype wrong → VC-08, low confidence goes to human |
| J-04 | section context, 8 classes | D→L | `context_classify.mjs` (evidence + low-confidence flag) | VC-08; UNKNOWN falls into the fail-safe strict gate |
| J-05 | slang register (too colloquial) | D | colloquial-register (error level) | VC-01 (novel variants outside the wordlist) |

The companion `ledger_lint.mjs` verifies it mechanically: every rule id cited must exist in `rules.yaml`, every VC-xx card must exist in `voice.md`, the registry may contain no orphan rules missing from the ledger, and every wordlist gate must register its Plane-L backstop. The user's third criticism became an assertion that runs red or green — no longer a feeling.

### 4.3 Single source of truth plus thin shells: a concept lives in one place

<figure class="vz">
<svg viewBox="0 0 640 280" role="img" aria-label="Thin-shell resolution: four shell tiers resolve two max sources at runtime">
  <defs>
    <marker id="ah2" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L8,4 L0,8 Z" fill="var(--vz-axis)"/>
    </marker>
  </defs>
  <rect x="96" y="16" width="212" height="92" rx="6" fill="var(--vz-s1)" fill-opacity="0.10" stroke="var(--vz-s1)" stroke-width="1.5"/>
  <text x="112" y="38" class="tb">writer-max (contract home)</text>
  <text x="112" y="58" class="t2">control/rules.yaml + engines</text>
  <text x="112" y="76" class="t2">docs/ judgment cards, red lines</text>
  <text x="112" y="94" class="t2">contract-api.json (manifest)</text>
  <rect x="368" y="16" width="212" height="92" rx="6" fill="var(--vz-s2)" fill-opacity="0.10" stroke="var(--vz-s2)" stroke-width="1.5"/>
  <text x="384" y="38" class="tb">checker-max (tool home)</text>
  <text x="384" y="58" class="t2">mark_violations / repair_lint</text>
  <text x="384" y="76" class="t2">score_rubric / ledger_lint</text>
  <text x="384" y="94" class="t2">contract via contract-api →</text>
  <line x1="368" y1="98" x2="312" y2="98" stroke="var(--vz-axis)" marker-end="url(#ah2)"/>
  <rect x="20" y="176" width="130" height="54" rx="6" fill="none" stroke="var(--vz-ink)" stroke-opacity="0.5" stroke-dasharray="5 4"/>
  <text x="85" y="198" text-anchor="middle" class="tb">writer</text>
  <text x="85" y="216" text-anchor="middle" class="t2">thin shell · no copies</text>
  <rect x="175" y="176" width="130" height="54" rx="6" fill="none" stroke="var(--vz-ink)" stroke-opacity="0.5" stroke-dasharray="5 4"/>
  <text x="240" y="198" text-anchor="middle" class="tb">writer-lite</text>
  <text x="240" y="216" text-anchor="middle" class="t2">thin shell · no copies</text>
  <rect x="330" y="176" width="130" height="54" rx="6" fill="none" stroke="var(--vz-ink)" stroke-opacity="0.5" stroke-dasharray="5 4"/>
  <text x="395" y="198" text-anchor="middle" class="tb">checker</text>
  <text x="395" y="216" text-anchor="middle" class="t2">thin shell · dual resolve</text>
  <rect x="485" y="176" width="130" height="54" rx="6" fill="none" stroke="var(--vz-ink)" stroke-opacity="0.5" stroke-dasharray="5 4"/>
  <text x="550" y="198" text-anchor="middle" class="tb">checker-lite</text>
  <text x="550" y="216" text-anchor="middle" class="t2">thin shell · dual resolve</text>
  <line x1="85" y1="176" x2="160" y2="112" stroke="var(--vz-axis)" marker-end="url(#ah2)"/>
  <line x1="240" y1="176" x2="220" y2="112" stroke="var(--vz-axis)" marker-end="url(#ah2)"/>
  <line x1="395" y1="176" x2="440" y2="112" stroke="var(--vz-axis)" marker-end="url(#ah2)"/>
  <line x1="550" y1="176" x2="510" y2="112" stroke="var(--vz-axis)" marker-end="url(#ah2)"/>
  <text x="150" y="146" class="t2">resolve_writer.mjs</text>
  <text x="440" y="146" class="t2">resolve_checker.mjs</text>
  <text x="20" y="262" style="fill:#d03b3b;font-weight:600">⛔ fail-closed</text>
  <text x="118" y="262" class="t2">missing contract / version &lt;2.0.0 / path escape → print install guide and refuse; never fall back silently</text>
</svg>
<figcaption>Fig. 5 · Thin-shell resolution. The contract and the tools each live in exactly one place; the four shell tiers resolve real paths through a machine-readable manifest at runtime and call in place. Byte-identical mechanical verdicts across tiers are asserted by the bundled evals.</figcaption>
</figure>

Change one place and the whole family updates; drift becomes physically impossible; v1's two-to-seven rule copies drop to zero. The six packages ship 125 assertions that run on install: contract resolution, the three fail-closed paths, byte-identical cross-tier verdicts, each tier's dosage protocol, and the SKILL residence tax (by character count, lite ≤ std ≤ max — currently 6366 / 6369 / 6792).

### 4.4 Semantic-layer calibration: the eval's new job

Plane D verifies byte-for-byte. How do you verify Plane L? Gate G10 pre-registered three thresholds: P0-level recall = 100%, overall alignment ≥ 85%, false-hit rate ≤ 10%, three rounds maximum. The method: construct 40 gold cases derived from the judgment cards (with a generator and a scorer, the scorer itself passing a red-green self-test first), have Opus·medium run them blind under protocol, and measure how well its judgments align with the contract's:

| Metric | Threshold (pre-registered) | Round 1 (40 blind cases) | Round 2 (after fix) |
|---|---|---|---|
| Overall alignment | ≥ 85% | 88.3% (pass) | **98.3%** |
| P0 confirmed recall | = 100% | 62.5% (**fail**) | **100% (8/8)** |
| False-hit rate | ≤ 10% | 0% (pass) | **0%** |

Round 1's failure is itself a representative case: all three missed P0s fell on a single execution instance. Checking against ground truth (grepping the drafts directly) proved the missed spans all existed — that instance had cross-contaminated cases during batch execution, writing case-25's findings into case-23. **The root cause was blind-run execution hygiene, not the protocol: the judgment cards and attacker spec had zero defects.** The fix added "single-case isolation + on-disk span self-attestation" to the blind-run protocol; the judgment cards were not touched; rerunning the contaminated slice brought the merged final scores over every threshold. This is the operational difference between "evals calibrate the concept" and "evals define quality": a failure gets attributed to the concept, the protocol, or execution hygiene — and the three call for entirely different fixes.

### 4.5 Distillation and v2.3: tier semantics and the performance anchor

G12 pre-registered the distillation contract. The core ruling fits in one sentence: **the tier axis is the dosage of Plane L; Plane D is identical across all tiers.**

| Tier | Plane L dosage | Notes |
|---|---|---|
| lite | **0** | no attacker, zero LLM subagents; semantic blind spots honestly declared ("not covered at this tier — go up a tier"); the ledger's L rows are all OFF, and citing any semantic card fails the eval |
| standard | single pass | three lenses once → fix confirmed → one recheck, no convergence rescan |
| max | multi-round | rescan until one round yields zero confirmed, hard three-round fail-stop; checker-max adds a falsification recheck round |

Phase one's open question — "tiers of what?" — takes one sentence at the concept layer, and the arms-race era's four-way contract drift simply disappears under this definition, with no repair step needed.

v2.3's positioning ruling came from a cross-model benchmark: six models (Opus / Sonnet / GLM-5.2 / DeepSeek-V4-Pro / Kimi-K2.6 / Qwen3.7-Max) × six tiers × end-to-end rewriting and checking, with an A/B web report on disk. The conclusion went into the README verbatim: **this skill family is scaffolding that lets Opus perform; a weaker model's typical pathologies (knowledge injection, intensity inflation, invented feature names, register slippage) can be suppressed by guardrails, but suppression is not parity.** So the standard tier locks Opus·medium, lite returns to being the bulk tier (Sonnet can run it, with every output flowing back through the checker on Opus as the backstop), the "domestic-model tuning" line was dropped, and its guardrails were kept as general assets. The benchmark also caught a bug in our own harness: the benchmark's `style_check` result parser had been reading a JSON key that doesn't exist, so error/warning counts were stuck at zero — all 30 outputs were re-verified after the fix, and exactly one verdict flipped — a GLM rewrite that actually carried one error. Benchmark infrastructure needs auditing too; that lesson went into the ledger.

The output side closed under "output economics": the writer delivers exactly one file (`rewritten.md`); the checker exactly two (`report.md` + `findings.json`); repairs are anchored replacements only — copy the original, then apply precise "original fragment → new fragment" edits, never regenerate the document — so **output tokens scale with the number of violations, not the length of the document**, and `structure_check` re-verifies zero lost images and zero drift in untouched paragraphs.

## 5. The parallel case: the skills repo

The same path replayed at larger scale in the skills repo, and can be read as an independent replication:

- **Concept phase**: methodology written into a knowledge base, transmitted by density;
- **Eval phase**: red-green evals, independent batteries, attackers, mutation scores, trigger holdouts all built out — and the two green-but-wrong specimens (the regex fact-linter, the citation linter gamed by invisible markers) collected here;
- **Back to concepts**: the skill-building pipeline (four skills — guidance / engineer / conductor / zipper — plus an attacker) kept getting heavier with every fix. The resolution was to stop and write a philosophy knowledge base first — 10 axioms, 43 guidelines, 38 constitutional articles, attacked by itself for five rounds until all 54 findings (15 P1) were fixed — then **re-derive** from it a thin conductor (skill-creator-max), retiring the old four-piece set; the attacker's five lenses were re-derived from the philosophy layer the same way; and the first skill rebuilt through the new pipeline (TDD) grew its red-green evals directly out of the concept.

## 6. Retrospective: why a spiral

Laid end to end, the three phases invite the reading "went around a circle." The data don't support it:

1. **Phase one's "concepts" had no execution semantics** — no ownership, no backstops, no coverage inventory. To a model they were exhortations, with uncontrolled variance and no way to answer "did it get better."
2. **Phase two was the only road through.** The boundary between "mechanizable" and "not mechanizable" — the foundation of the two-plane concept — is empirical data, surveyed by hundreds of rewrites, a hundred judging seats, and three classifier iterations. Without this phase, the Plane D / Plane L dividing line and the "Plane-D backstop" on every judgment card could not have been written.
3. **Phase three deleted nothing.** The blind-judging protocol, the mechanical gates, the red-green evals, the independent attacker all remain — reassigned from "defining quality" to "calibrating concept fidelity" (all three G10 thresholds are fidelity metrics) — while adding what the eval era could not produce: judgment ownership, a single source of truth, fail-closed behavior, tier semantics.

Two operational tests, for the record:

> If a skill contains a judgment and you can't say who makes it, by what criterion, and what catches it when it fails — that isn't a concept yet; it's an exhortation.
>
> If the evals are all green but you can't say what proposition the green proves — that isn't quality; it's a score.

The last post argued that "more loops and better specs cannot solve intelligence problems." This retrospective adds the second half: **loops and evals cannot solve concept problems either.** Concepts are settled outside the loop; the loop executes and calibrates. v2.3's performance anchor is a corollary of the same logic: a skill is scaffolding that lets a strong model perform, not a prosthetic that makes a weak model whole — and even the clause "declare degraded use on weaker models honestly" was derived at the concept layer, not chosen as marketing.
