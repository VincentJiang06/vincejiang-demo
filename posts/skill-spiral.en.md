---
title: "The Skill Spiral: Parsing Concepts → Eval Arms Race → Back to Concepts"
description: "A seven-day, 80-commit style-rewriting skill family for Caoliao, plus two months on a 16-skill repo: how my understanding of skills went from 'parse the concept' to 'eval everything' and finally back to concepts — and why that path is a spiral, not a circle."
tags: [AI, agent, skill, essay]
date: 2026-07-15
lang: en
---

[The last post](/blog/fable-scaling-layering/en/) was about models and harnesses. This one is about the thing squeezed between them: skills.

Over the past month or so I've been doing two intertwined things: maintaining a public repo of 16 skills (including the pipeline that builds skills), and, most recently, spending seven days and 80 commits turning "rewrite Caoliao's public-facing docs back into their own voice" into a family of 6 skills. Both threads took the same turn in the same place: my understanding of skills went from "parse the concept" to "eval-driven everything," and finally came back to concepts. The turn was sharp enough to be worth writing down properly.

Conclusions first:

1. **A concept is not prose.** A concept that can't answer "who makes this judgment, by what criterion, and what catches it when it fails" is just an exhortation — and exhortations execute on luck.
2. **Evals cannot define quality.** Blind panels, rubrics, and mechanical gates can tell you A beats B; they cannot tell you what "good" is. When two versions tie 83.92 : 83.92 across a hundred judging seats, that isn't quality converging — that's your eval running out of resolution.
3. **The way out is to return to concepts, carrying every asset from the eval era with you.** The concept becomes the single source of truth; evals get demoted to calibrating fidelity to the concept. A spiral, not a circle.

## I. Parsing concepts: believing a skill is "writing down what you understand"

First, the task itself. Caoliao (a QR-code SaaS) had its public docs — solution pages, help docs, promo articles, customer cases — rewritten by AI at some point. The page logic was fine, but the voice was off: too much AI flavor. The skill's job: preserve facts, images, and information density; swap sentence patterns, word choice, and register back to Caoliao's own voice; and inject zero knowledge — mechanisms, benefits, or feature names not in the original must never appear, even if the model is sure they're true.

The first instinct was natural: this is a "understand the style" problem. So day one (July 9) went entirely into concept parsing:

- **Four-way reconnaissance**: the help-center structure, the business scope, a local corpus inventory, and human-written vs AI-written A/B comparisons — including mining 2024–2025 Wayback Machine snapshots as a vein of "human flavor";
- **Diffing the AI fingerprint**: dense parallelism, the "not A but B" frame, em-dash interjections, rhetorical-question openers, chatty similes, precise numbers with named cases — each extracted from real paired pages;
- **Writing the style down as documents**: a "soul" doc (use 你 not 您, no marketing adjectives, honest boundaries) and a red-line codex (get to the point, no rhetorical questions, causal-chain argumentation, iron rules on internal data).

Then all that understanding got packed into skills: v3 was **prose exhortation** — thousands of carefully written characters in SKILL.md telling the model how to write; v3-doc added knowledge retrieval, distilling the corpus into a searchable library the model consults before rewriting.

The hidden assumption of this phase: **if the model understands the concept, it will execute the concept.** Real runs tore that apart. The same exhortation produced ten different results in ten runs: sometimes faithful, sometimes the model decided it had a better idea. Retrieval let it "know" what the old voice looked like, but knowing and writing are different things. Worse, I couldn't answer "is this version better than the last one" — no evidence beyond reading it again myself.

The skills repo had made the same mistake even earlier: writing methodology into a knowledge base and assuming knowledge density equals execution quality.

## II. The eval arms race: "whatever can't be verified doesn't count"

If exhortation runs on luck, replace everything with something measurable. This phase lasted about four days (July 9–13), at roughly this intensity:

- **Showdowns**: first compare-20 (20 real cases, 60 rewrites, blind judging), escalating to the R5 finale — 20 brand-new cases × 6 versions × 100 judging seats, unblinded at the end, with 120 rewrites mid-run at zero failures;
- **Mechanical gates**: finished-product gates for scraping residue, empty skeletons, dangling teasers; an absolutism red-line linter; hard structural gates (zero new facts, zero lost images, length within ±20%); public-page red lines like "eliminates fraud → raises the cost of fraud" all regexed (the contract also has a zero-tolerance rule on em-dashes — yes, this very post would light up the checker);
- **A classifier**: section-level context classification driving automatic register routing, accuracy pushed from 71.8% to 93.1% over three iterations;
- **Tier arms race**: the writer split into depth tiers -10 / -8 / -5 / -2, later renamed raw / xhigh / high / med, plus four matching checkers, with bench20 scoring 20 cases × 4 tiers;
- July 12, 1.0.0: a six-skill mirrored family, finalized.

The skills repo was doing the isomorphic thing at the same time: every skill ships a deterministic validator plus red-green evals, plus an independent attacker whose only job is to break it — "whoever writes the answer must not also grade it" became a first-class citizen.

The honest part first: **most of what this phase produced is genuinely right.** Sinking every regexable rule into deterministic scripts (zero tokens, zero randomness), red-before-green, independent adversarial testing — I still consider these three the foundation of skill engineering. Conveying enumerable rules through document density is running on luck.

But by the end of those four days, two pits could no longer be walked around.

**Pit one: evals saturate, then start lying.** In round R4, the rebuilt standard tier and the old v5 tied in blind judging at 83.92 : 83.92 — a gap of 0.00. First reaction: relief (the rebuild didn't regress). Second reaction: a chill. Two implementations that differ enormously tying perfectly across a hundred seats has only one plausible explanation: **the panel could no longer measure the difference between them.** Adding cases, adding seats, fixing the judging protocol (v2.1 deliberately "fixed mechanisms, not scores") bought less and less resolution. The repo-side lessons were blunter: a regex fact-linter that stayed green while the facts were wrong; a citation linter progressively gamed into uselessness by "invisible markers." Goodhart's law grants no exemptions to skill engineering.

**Pit two: evals can't answer "what is good."** A hundred blind seats can tell you A beats B by 0.3 points; they can't tell you what that 0.3 is, or whether you should want it. The tier arms race is the best exhibit: -10 / -8 / -5 / -2, bigger number, higher quality, more tokens — but **tiers of *what*, exactly?** At the time I couldn't answer. So there were four tiers with four subtly drifting copies of the contract; the same rule stated 2–4 times across SKILL.md, law, voice, and rules.yaml; the numbers-policy matrix copied at least 5 times, the red lines at least 6, the H-register contract at least 7. Every copy had been left behind by some eval turning green.

## III. Back to concepts: one rewrite bought with three criticisms

After 1.0 shipped, the user gave three criticisms: **the structure is chaotic; the style control is weak; and it's impossible to tell which judgments are made by the LLM and which by hardcoded, corpus-fitted checkers.**

The third one cut deepest. It sounds like an engineering complaint, but it points at a missing concept: nowhere in the entire family could you answer "who makes this judgment, by what criterion, and what catches it when it fails." Four days of eval armament, piles of scores — and the system was full of **dark judgments**.

v2 was a teardown rebuild, and it started from a design charter written before any code. The whole charter is really just three concepts.

### Two planes plus a human gate: every judgment must have an owner

- **Plane D (mechanical)**: any judgment expressible as regex, wordlist, threshold, or structural comparison sinks into a single rule registry (rules.yaml) plus Node engines. Deterministic, zero tokens, byte-identical verdicts across all tiers. The docs may not contain an authoritative statement of any regexable rule — pointers only.
- **Plane L (semantic)**: any judgment that in principle can't be regexed (novel variants, semantics, pragmatics, whether a causal claim holds) goes to an independent attacker. Every criterion must ship four things: a one-sentence test, a minimal ❌/✅ pair, an output shape, and a **Plane-D backstop note** (which mechanical gate catches it when it misses).
- **H (the human gate)**: final review of images for PII, confirmation before repairs, adjudication of the doubtful. The machine does not overstep.

### The judgment ledger: a warranty of "no dark judgments"

SKILL.md carries one master table registering every judgment point in the pipeline: number, what is being judged, owner (D / L / D→L / L→D / H), the executing artifact, and the backstop. A ledger_lint script verifies it mechanically: every rule id the ledger cites must exist in rules.yaml, every judgment-card anchor must exist in the docs, and the registry may contain no orphan rules the ledger forgot. The user's third criticism became an assertion that can run red or green.

### Single source of truth plus thin shells: a concept lives in exactly one place

The contract lives only in writer-max. Every other tier is a **thin shell** — it carries no copies; at runtime it resolves the real paths through a machine-readable contract manifest and calls things in place. If resolution fails, it fails closed: print install instructions and refuse to run, never silently fall back to a stale contract. Change one place, the whole family updates; drift becomes physically impossible. v1's two-to-seven copies of each rule: zeroed.

Once the concepts stood, the problems phase two couldn't walk around turned almost trivial one by one:

- **What is a tier?** One sentence: **a tier is a dosage of Plane L.** Lite is zero (purely mechanical, no attacker at all — and it honestly declares "semantic violations are not covered at this tier, go up a tier"); standard is single-pass; max converges over multiple rounds with a hard three-round fail-stop. The mechanical plane is byte-identical across all three, and the evals assert exactly that. The old "four tiers, four contracts" drift wasn't fixed — the concept abolished it.
- **What are evals for?** Evals got redefined: they no longer define quality, they **calibrate fidelity to the concept**. v2's semantic-layer calibration works like this: construct 40 gold cases derived from the judgment cards (not dredged from historical scores), have a different model run them blind under protocol, and measure how well its judgments align with the contract's — final alignment 98.3%, P0 recall 100%, zero false hits. Same blind-judging machinery, completely different question: not "which version scores higher" but "does execution stay faithful to the concept."
- **What does output look like?** Also derived from a concept. In a bulk pipeline the dominant cost is output tokens, so: the writer delivers exactly one file (the rewritten body); the checker delivers exactly two; and repairs are anchored replacements only — emit "original fragment → new fragment" pairs, so **output tokens scale with the number of violations, not with document length**. These aren't scattered optimizations; they're corollaries of a concept called output economics.

The skills repo took the same turn at a larger radius. The skill-building pipeline used to be four skills (guidance / engineer / conductor / zipper) plus an attacker, each dragging heavy eval infrastructure, getting heavier with every fix. The eventual answer wasn't more fixing. It was stopping to write a philosophy knowledge base — 10 axioms, 43 guidelines, 38 constitutional articles, attacked by itself for five rounds until all 54 findings (15 of them P1) were fixed — and then **re-deriving** from it a thin conductor (skill-creator-max), retiring the old four-piece pipeline outright. The attacker was rewritten the same way: five attack lenses, each derived from the philosophy layer rather than accumulated from history. The first skill rebuilt through the new pipeline (TDD) had its red-green evals grow out of the concept, instead of the concept bending to the evals.

## IV. Why a spiral, not a circle

Lay the three phases in a row and it's tempting to read "went around and came back to the start." That's not what happened.

**Phase one's "concepts" didn't deserve the name.** They were prose: no execution semantics, no ownership, no backstops, no idea what they covered or missed. Guiding a model with them means relying on its goodwill.

**Phase two wasn't a detour; it was the only road.** The boundary between "mechanizable" and "not mechanizable" — the very foundation of the two-plane concept — wasn't thought up. It was surveyed, empirically, by hundreds of rewrites, a hundred judging seats, and three classifier iterations. Without wading through the eval arms race, you cannot draw the line between Plane D and Plane L, let alone write the "Plane-D backstop" on every judgment card.

**Phase three threw away none of the eval assets.** The blind-judging protocol, the mechanical gates, the red-green evals, the independent attacker — nothing was deleted; everything changed jobs, demoted from definers of quality to calibrators of the concept. The six packages ship 125 assertions that run on install — verifying not "the score is high" but "this matches the contract."

So, one operational test, in two sentences:

> If your skill contains a judgment and you can't say who makes it, by what criterion, and what catches it when it fails — you don't have a concept yet, only an exhortation.
>
> If your evals are all green but you can't say what proposition the green proves — you don't have quality, only a score.

In the last post I wrote that "more loops and better specs cannot solve intelligence problems." I can now add the second half: **loops and evals cannot solve concept problems either.** Concepts get thought through outside the loop; the loop's job is to execute them faithfully and stay calibrated. Which incidentally explains v2.3's final ruling: the family's performance is explicitly anchored to Opus — a skill is scaffolding that lets a strong model perform, not a prosthetic that makes a weak model whole. Guardrails can suppress a weak model's typical pathologies (knowledge injection, intensity inflation, invented feature names), but suppression is not parity, so the docs state plainly that running on a weaker model is degraded use. At the concept layer, even honesty is a derived design.

## V. Coda: a concept is a letter to amnesiacs

The last post ended with Fable saying it would write about forgetting: every session is a brand-new, thoroughly amnesiac instance.

That is, in fact, the hardest reason a skill must have a concept layer. An exhortation depends on the exhorter being present — and every model instance that arrives to execute a skill is not present: it never read your conversations, doesn't remember why the last version changed, doesn't know which incident sits behind which rule. The contract, the ledger, the judgment cards, the fail-closed thin shells are all the same object: **a letter written to countless amnesiac executors.** The mark of a good letter is that any newly arrived instance, without asking anyone, knows who makes each judgment, by what criterion, and what catches it when it fails.

Seven days, 80 commits, from "write down what you understand" to "register every judgment." The next skill, I'll start from the ledger.
