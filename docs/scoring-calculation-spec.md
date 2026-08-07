# APP Plus Quality Scoring: Calculations & Impacts Spec

*A stage-by-stage model of how measure data becomes points, scores, deemed statuses, and dollars — written to support a dynamic visualization language. Rules as of PY 2026, with CY 2027 proposed-rule deltas flagged `[PROPOSED]`.*

---

## 0. Design frame: two rails

The single most confusing thing for newcomers is that the pipeline splits into **two parallel rails** that consume the same upstream data but answer different questions:

- **The continuous rail** produces a *number* — the MIPS Quality performance category percent score — which then flows into several downstream consumers that care about magnitude.
- **The binary rail** produces a *status* — met / deemed-met / alternative-met / failed the MSSP Quality Performance Standard (QPS) — via threshold tests and a **deeming bypass** (the reporting incentive) that can short-circuit the continuous score entirely.

Bonuses attach at different points: the **Complex Organization Adjustment (COA)** injects points into the continuous rail; the **reporting incentive** is a wire on the binary rail. They stack because they live on different rails. Any visualization should render the rails as physically separate tracks that share Stage 1–2 inputs.

---

## 1. Object model

Entities the visual language needs to represent:

| Entity | Key attributes | Notes |
|---|---|---|
| `Measure` | id (001, 134, 236, 112, 113, 321, 479, 484), is_outcome, is_reportable | 5 reportable + CAHPS + 2 admin claims |
| `Routing` | measure → collection_type | Per-measure choice: eCQM / MIPS CQM / Medicare CQM / `[PROPOSED]` Medicare eCQM. Admin claims & CAHPS have fixed routing (CMS-calculated; survey vendor) |
| `MeasureData` | performance_rate, denominator_eligible, reported_count, case_count | Output of the ACO's pipeline for that measure |
| `Gate` | type ∈ {completeness, case_min, benchmark_exists} | Boolean pass/fail per measure |
| `Benchmark` | collection_type–specific; kind ∈ {historical, flat, performance-period} | Same measure ID → different benchmark per collection type |
| `PointsAccumulator` | achievement_numerator, available_denominator | The continuous rail's core register |
| `DeemingLogic` | condition set → QPS status | The binary rail |
| `Downstream` | sharing_rate, loss_rate, clinician_adjustments, public_score | Consumers of one or both rails |

---

## 2. Stage-by-stage pipeline

### Stage A — Routing (per measure)

Each of the five reportable measures is independently routed into a collection type. Routing determines three things downstream: **which benchmark table** the measure is scored against, **which bonuses** it can generate, and **which submission format** carries it (eCQM row: QRDA III or QPP JSON; CQM row: JSON only). Mixed routing across measures is allowed.

**Viz note:** render routing as a switchyard — five tokens entering a 2×2 grid of tracks; track color = collection type, and the color should persist on the token through all later stages, because collection type keeps mattering.

### Stage B — Gates (per measure)

Each routed measure hits two gates before scoring:

1. **Data completeness:** reported on ≥ 75% of denominator-eligible patients for that measure's population (all-payer or attributed, per the column). Fixed at 75% through PY 2028.
2. **Case minimum:** ≥ 20 cases in the denominator.

A measure failing a gate is **submitted but unscoreable** → contributes 0 achievement points while (usually) still counting 10 points in the available-points denominator, dragging the percent score down hard. Gate failure also severs that measure's bonus eligibility (no COA point) and — if it's one of the five — breaks the deeming condition on the binary rail. This triple consequence of one gate failure is the highest-leverage failure mode in the whole system and deserves visual emphasis (e.g., a token that fails a gate turns red and emits a "break" signal to the deeming wire).

`[PROPOSED]` PY 2026+: TIN-exclusion relief — an ACO may exclude qualifying participant TINs (closure, specialty-only CEHRT, etc.) from the submission if remaining TINs cover ≥ 95% of assigned beneficiaries, making the 75% test easier to pass. Render as an optional pre-gate filter.

### Stage C — Benchmark lookup & achievement points (per measure)

The measure's performance rate is compared to the **benchmark for its collection type**, yielding a decile → **1–10 achievement points**.

Benchmark kinds by cell (PY 2026 → `[PROPOSED]` PY 2027):

| Cell | Benchmark |
|---|---|
| eCQM | Historical (collection-type-specific) |
| MIPS CQM | Historical |
| Medicare CQM | Flat for #001/#134/#236 `[PROPOSED, PY 2026]`; **all flat** `[PROPOSED, PY 2027+]` |
| Medicare eCQM | Flat `[PROPOSED]` |

Flat benchmarks map fixed rate bands to deciles (top decile at ≥ 90% for non-inverse measures, next at 80–89.99%, and so on), which is typically generous for strong performers and — critically for the viz — makes attainable points *predictable before submission*, unlike historical benchmarks. CAHPS and the two admin-claims measures are scored by CMS against their own benchmarks and enter the accumulator the same way. A measure with **no benchmark** in its collection type gets special handling under the scoring policy (see Stage D note).

**Viz note:** a decile ladder per measure; the token's track color selects which ladder it climbs.

### Stage D — Continuous rail: category score assembly

```
quality_percent = (Σ achievement_points + COA_points) / (Σ available_points) × 100
```

- `available_points` = 10 per scored measure. With the full 8-measure set: 80.
- **COA injection:** +1 point per **eCQM-routed** measure that passed both gates. Constraints: no measure's total may exceed 10 points (so a decile-10 eCQM absorbs nothing — the COA point is wasted on perfect measures), the numerator may not exceed the denominator, and total COA ≤ 10% of available points (cap = 8 with an 80-point denominator; moot at ≤ 5 eCQMs). `[PROPOSED]` Medicare eCQMs do **not** generate COA points despite being electronically routed.
- Excluded/benchmark-less measures: current policy removes them under defined conditions; `[PROPOSED]` PY 2027 revises this so the special scoring policy applies only when ≥ 4 of the APP Plus measures are excluded from MIPS.

**Viz note:** the accumulator is a filling bar (numerator) against a fixed frame (denominator); COA points arrive as distinctly-styled increments (different texture/color) so their marginal contribution is always visually separable — this is the key to showing "stacking."

### Stage E — Binary rail: QPS determination

Three tests, evaluated in priority order:

1. **Standard QPS:** `quality_percent` ≥ the 40th-percentile MIPS quality score (a threshold CMS publishes per PY). Consumes the continuous rail's output — this is one of the two places the rails touch.
2. **Deeming bypass (the reporting incentive):** IF all five reportable measures were routed to **eCQM or MIPS CQM** (all-payer column) AND each met data completeness AND the ACO scored ≥ 10th percentile on ≥ 1 designated outcome measure (the annually-flagged outcome measures in the set — #001 and #236 among the reportables) THEN **deemed to meet QPS regardless of quality_percent**. `[PROPOSED]` extended to PY 2027+ alongside the MIPS CQM extension. Note the bypass reads *per-measure* facts (routing, gates, one measure's decile standing), not the aggregate score — COA points cannot help you qualify for deeming.
3. **Alternative QPS:** reported per requirements AND ≥ 10th percentile on ≥ 1 outcome measure → eligible for **scaled** (reduced) sharing, with the scale factor consuming `quality_percent` — the second rail-touch point.
4. Else: **failed** — no shared savings; maximum shared losses where applicable.

First-year, first-agreement ACOs have a softer standard: report meeting completeness + field CAHPS + receive a score.

**Viz note:** deeming is best drawn as a literal bypass wire around the threshold comparator, with its own AND-gate fed by per-measure status lights. When the bypass is live, the comparator grays out — that's the visual for "raw score doesn't matter *here*."

### Stage F — Downstream consumers

This is where newcomers get lost, because different consumers read different rails:

| Consumer | Reads | Effect |
|---|---|---|
| **Shared savings rate** | Binary rail | QPS met/deemed → max rate for track (e.g., 75% ENHANCED; 50%→`[PROPOSED]` 60% BASIC-E). Alternative-QPS → rate scaled by `quality_percent`. Failed → 0. |
| **Shared losses (ENHANCED)** | Both | QPS met/deemed avoids maximum losses; within that, the shared-loss rate is quality-scaled (bounded ~40–75%), so `quality_percent` still moves real dollars even when deemed. **This is why COA matters despite deeming.** |
| **Non-QP clinicians' MIPS adjustment** | Continuous rail only | APP final score = Quality 50% + PI 30% + IA 20% (IA auto-credited; PI aggregated from TIN-level reporting), judged against the 75-point MIPS threshold → Part B fee adjustment for every participant clinician who isn't a Qualifying APM Participant. Rough sensitivity: +5 COA points on /80 ≈ +6.25 pts of quality percent ≈ +3.1 pts of final score. |
| **Public reporting / Compare** | Continuous rail | Raw scores published; `[PROPOSED]` plus disclosure of elected CEHRT-use activity. |
| **eCQM incentive prerequisites** | Per-measure facts | Routing + gates feed both COA and deeming — shown above. |

---

## 3. The stacking story, stated precisely

For an ACO with all five measures routed to **eCQM**, passing all gates:

1. Deeming bypass is **live** (given one outcome measure ≥ 10th percentile) → max sharing rate secured *independent of score*.
2. COA adds up to +5 to the continuous rail → does **not** affect (1), but raises `quality_percent`, which (a) reduces ENHANCED loss exposure, (b) raises non-QP clinicians' fee adjustments, (c) provides fallback margin toward standard QPS if deeming ever breaks (e.g., one measure's completeness failure), and (d) improves the public number.
3. Route even one measure to Medicare CQM / Medicare eCQM → deeming condition breaks entirely (column violation) → the ACO falls back to the standard-QPS comparator, where `quality_percent` (including any surviving COA points) suddenly bears full financial weight. **The bonus structures are cell-dependent, but the *consequence* of losing them is score-dependent — the rails swap importance.**

That last inversion — deeming makes the score irrelevant for sharing until the moment deeming breaks, at which point the score is everything — is the core dynamic the visualization should let users *feel* by toggling routings and watching consequences propagate.

---

## 4. Worked examples (tokens for the machine)

**Example 1 — "Stacked eCQM shop."** All 5 → eCQM; rates land deciles {7, 8, 10, 6, 9}; gates all pass; CAHPS decile 6; admin claims deciles {5, 7}.
Achievement = 70+... per-measure: 7+8+10+6+9+6+5+7 = 58. COA: +1 ×5 but the decile-10 measure is capped → +4. Quality = 62/80 = **77.5%**. Deeming: live (assume #236 at decile 8 ≥ 10th pctile) → **QPS deemed met, max sharing**. COA's realized value: loss-scaling + clinician adjustments + 4-point cushion.

**Example 2 — "One gate failure."** Same shop, but #134 hits 71% completeness. #134 → 0 points, no COA point, **deeming breaks** (not all five meeting completeness). Quality = (58−6−1... recompute: lose #134's 8 pts and its COA) 62−8−1 = 53/80 = **66.25%**, now compared against the standard 40th-percentile threshold — likely still fine, but sharing status now rides on the score. One gate flipped a deemed-safe org onto the comparator.

**Example 3 — "FHIR-forward CQM shop."** 3 → Medicare CQM (flat benchmarks: deciles {9, 9, 10}), 2 → MIPS CQM (deciles {6, 7}). No COA (no eCQMs). Deeming: **dead** (Medicare CQMs violate the all-payer condition). Achievement = 9+9+10+6+7+6+5+7 = 59/80 = **73.75%** → standard QPS comparator. Same rough score as Example 1, but zero bypass protection and no COA cushion — the artifact's "penalized cell" rendered numerically.

---

## 5. Visualization hooks (for the language we'll build)

Primitives implied by the above: **tokens** (measures) with persistent collection-type color; **switchyard** (routing); **gates** (pass/fail with break-signal emission); **decile ladders** (per-collection-type benchmark); **accumulator bar** with texture-distinct COA increments; **bypass wire + AND-gate with status lights** (deeming); **comparator** that grays out when bypassed; **consumer panel** (four downstream meters: sharing rate, loss rate, clinician adjustment, public score) each visibly wired to its rail(s). Interactions to support: re-route a token and watch deeming/COA/benchmark consequences ripple; fail a gate and watch the triple consequence; slide a performance rate and watch which meters move under deemed vs non-deemed status.

---

## 6. Accuracy caveats

Threshold values (40th/10th percentile equivalents) are published annually by CMS; the exact ENHANCED loss-rate formula and PI aggregation mechanics are summarized here at model fidelity, not reg-text fidelity — verify against § 425.605/610 and the year's APP Scoring Guide before wiring real numbers. All `[PROPOSED]` items are CMS-1848-P proposals (comment period closes Sept 14, 2026; final rule expected ~November).
