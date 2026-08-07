# Talk track — explaining the CQM system with this sim

Ten points to hit, then a run of show. Audience: people who know MSSP exists but
not how quality reporting mechanics move dollars.

## The ten points

1. **One ACO, five measures, four ways to report each.** Collection types form a
   2×2: pipeline (electronic vs chart-review/registry) × population (all-payer vs
   Medicare-attributed). One cell — Medicare eCQM — doesn't exist yet (proposed,
   2027+). Same care, different scores, different dollars.

2. **Same measure, different ladder.** Every cell has its own benchmark table.
   Measure 236 at a 72% care rate lands decile 3 on the eCQM ladder and decile 8
   on MIPS CQM — nothing about the care changed.

3. **The capture tax.** eCQMs count only care recorded as structured data. Direct
   measures get `rate × capture` (capture is a hard ceiling — the top eCQM rungs
   don't exist below ~93% capture); inverse 001 gets the uncaptured share *added*
   to its failure rate. This is the cost of the electronic pipeline, and CMS's
   easier eCQM ladders are the national reflection of it.

4. **Flat vs historical benchmarks are policy choices, not data accidents.**
   001/236 under MIPS CQM are flat by the inappropriate-treatment rule
   (§414.1380(b)(1)(ii)(C)). Medicare CQMs get flat ladders only for their first
   two years — 2026 is the year real ACO-data ladders bite (averages in the
   60s), which is exactly why CMS-1848-P proposes re-flattening them (the
   toggle, on by default).

5. **Sometimes there is no benchmark at all.** 112/113 under eCQM/MIPS CQM have
   no published 2026 benchmark; the rule (§414.1367(c)(1)(i)) drops them from
   numerator AND denominator — the score runs out of 60, and the real benchmark
   arrives only after everyone submits. You report into the unknown.

6. **Two routes to pass, one standard.** Route A: the reporting incentive
   ("deeming") — all five via all-payer methods, completeness, one outcome
   measure ≥ p10, one other measure ≥ p40. Route B: score ≥ 73.85 (the real
   published 2026 bar). Deeming raises the floor, never the ceiling — same max
   sharing rate either way.

7. **The Medicare-column tradeoff.** Attributed-population methods get CMS-built
   denominators and (proposed) flat ladders — but forfeit Route A. Below the
   bar that means PARTIAL: sharing scaled by the score. The comparison table's
   PARTIAL rows are this tradeoff priced out.

8. **Track sets the stakes, not the test.** Thresholds are identical in every
   track; what changes is consequences — BASIC A/B: 40% cap, no losses; C–E:
   50%, flat 30% losses that ignore quality; ENHANCED: 75%, quality-scaled
   losses. Flip the track selector on the same ACO to see the same verdict pay
   three different ways.

9. **The marginal point is a step function.** In a savings year above the bar,
   one more point is worth $0 — the sharing rate saturates. The score's value is
   insurance (deeming breakage, ENHANCED loss years) and reputation (public
   reporting). That's why best-mix ties break toward the higher score.

10. **The best mix is usually mixed — and the deck is stacked toward digital.**
    The exhaustive search (all 243 PY2026-legal assignments) routes measures to
    different methods: 001/236 to registry flat ladders, 134 to eCQM. The
    eCQM-only bonuses (COA, and the incentive narrowing to eCQMs-only from 2027
    under the proposal) are CMS's thumb on the scale toward FHIR/digital — the
    incentive-parity argument in `2x2-ecqm-preference.md`.

## Run of show (~10 minutes)

1. **Open on defaults** (median real 2024 ACO, all-eCQM, proposal on). Header:
   everything real unless labeled. Step 1: the preset *is* the PY2024 median —
   13k patients, $177M benchmark, +4.2%. (Point 1)
2. **Card anatomy on 236**: hover ladder rungs for cutpoints; drag the care
   slider; click the p90 chip — registry percentiles, not eCQM. (Points 2, 3)
3. **Drag capture 85 → 100 → 75**: watch measured rates, score, and dollars
   move; note 001 moving the wrong way. (Point 3)
4. **Route 236 to MIPS CQM**: ladder swaps to flat bands; decile jumps. Then
   uncheck the proposal toggle and route to Medicare CQM: the real-ACO ladder
   bites. (Points 2, 4)
5. **Point at 112/113**: dashed ladders, "excluded from score", denominator 60.
   (Point 5)
6. **Pass panel**: Route A lamps vs Route B bar. Route one measure to Medicare
   CQM — Route A dies, and if the score is under 73.85, PARTIAL dollars appear.
   (Points 6, 7)
7. **Track selector**: BASIC B → ENHANCED on the same ACO; drag spending
   negative to show the three loss rails. (Point 8)
8. **Comparison table**: the tie among passing rows, the PARTIAL rows, "Apply
   best mix" and why it's mixed. Close on the marginal-point readout: +$0k, and
   why that's the honest shape of the incentive. (Points 9, 10)
