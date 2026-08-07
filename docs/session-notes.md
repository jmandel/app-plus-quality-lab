# APP Plus Quality Reporting — Session Artifacts

Materials produced while working through how Medicare Shared Savings Program (MSSP)
ACOs report the APP Plus quality measure set to CMS, how the four collection types
("reporting methods") score differently, and what that means in dollars. Everything
is scoped to the **2026 performance year** (reported to CMS in early 2027) with the
**CY2027 PFS proposed rule** (CMS-1848-P, July 2026; final expected November 2026)
treated as a labeled contingency, never as settled law.

## Contents

### Writeups

- **`app-plus-2x2-ecqm-preference.md`** — Short argument piece (<500 words):
  CMS concentrates its incentives (the eCQM/MIPS CQM reporting incentive and the
  Complex Organization Adjustment) on the classic all-payer eCQM cell, which
  penalizes organizations that invested early in FHIR/dQM pipelines but report
  through registry-style CQMs. Drafted as raw material for a comment letter on
  incentive parity.

- **`app-plus-scoring-calculation-spec.md`** — Full tutorial/specification of the
  scoring pipeline, written for someone implementing or auditing it: Stages A–F
  from underlying care rates through measured rates, decile lookup, gates
  (data completeness / case minimum), COA, fixed measures (CAHPS + administrative
  claims), the quality score, and the "two-rail" settlement model (binary
  standard-met rail vs. continuous score rail). Includes an object model, three
  worked examples, and visualization hooks.

### React components (visual language, in order of evolution)

All are self-contained single-file React components (default export, no required
props, inline styles, no external dependencies) suitable for dropping into any
React harness.

- **`app-plus-viz-language.jsx`** — First draft of the visual vocabulary.
- **`app-plus-viz-language-v2.jsx`** — Adds the routing-matrix cell anatomy
  (population disc ● / ◔ + pipeline trace ⌁ / ▪▪▪), benchmark ladders with
  rung heights proportional to real band widths (uniform rungs = flat benchmarks,
  irregular = historical), the threshold strip, rail wires (smooth = magnitude,
  square-wave = verdict), and the waterfall.
- **`app-plus-viz-language-v3.jsx`** — Adds settlement valves (savings/loss pools
  with rate apertures), the TIN roster fan-out, the marginal-value-per-point
  readout, and a savings-year vs. loss-year projection strip.

### The calculator (main deliverable)

- **`app-plus-pathway-lab.jsx`** — **"ACO Quality Reporting Calculator."**
  Standalone interactive app, written in plain language for a reader with no
  prior context. Features:
  - Real **PY2026 benchmark cutpoints** for all five ACO-reported measures
    (001 glycemic control, 134 depression screening, 236 blood pressure,
    112 breast cancer screening, 113 colorectal screening) across all four
    collection types, including the true historical Medicare CQM benchmarks
    CMS built from real PY2024 ACO submissions.
  - Honest handling of the two cells with **no published 2026 benchmark**
    (112/113 under eCQM and MIPS CQM): dashed "estimate" ladders using 2025
    values, labeled as such.
  - A **proposed-rule toggle** that swaps all Medicare CQM measures onto flat
    benchmarks per CMS-1848-P, so the November final rule's effect is a
    visible A/B.
  - Underlying-care-rate → measured-rate model with an adjustable eCQM
    structured-data-capture slider (inverse handling for measure 001) and a
    Medicare-population shift.
  - Per-measure routing plus an exhaustive **best-mix search over all 4^5 =
    1,024 assignments** (exact, not heuristic; within {eCQM, MIPS CQM} the
    problem is provably separable per measure, but attributed-column methods
    couple measures through the all-or-nothing reporting incentive), surfaced
    as a one-click "Apply best mix" button.
  - Two-rail settlement: standard met by score or by deeming → sharing rate;
    continuous score → loss scaling, marginal value of one point. (Clinician
    MIPS fee-adjustment modeling and the TIN roster fan-out were later removed
    from the sim; see Model scope.)
  - Example-ACO scenarios **calibrated to real PY2024 MSSP results**
    (see Data sources): the middle scenario matches the median 2024 ACO on
    size, benchmark, participant count, and savings rate; its BASIC Level B
    track is an illustrative choice (held by ~22% of 2024 ACOs — most are
    two-sided, with ENHANCED the plurality).

## Data sources (all fetched live during the session)

- **PY2026 quality benchmarks** (governing the current reporting year):
  https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2026
  (PY2025 file at .../2025 used only for the two estimate cells.)
- **PY2024 MSSP Performance Year Financial and Quality Results PUF** (476 ACOs)
  and **ACO Participants file** (~15.5k TIN rows), via data.cms.gov:
  median ACO = 13,151 assigned beneficiaries, $177M updated benchmark
  ($13,278 per capita), 19 participant TINs, +4.2% gross savings.
  Scenario parameters are named percentiles of these distributions.
- **CY2027 PFS proposed rule (CMS-1848-P) MSSP fact sheet**:
  https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2027-medicare-physician-fee-schedule-proposed-rule-cms-1848-p-medicare-shared
- **CY2025 PFS final rule fact sheet** (APP Plus adoption; Complex Organization
  Adjustment finalized, +1 point per submitted eCQM meeting completeness/case
  minimum, capped at 10% of available achievement points):
  https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2025-medicare-physician-fee-schedule-final-rule-cms-1807-f-medicare-shared-savings
- **PY2026 40th-percentile QPS memo** (deeming conditions, MIPS CQM final year
  absent the proposed extension):
  https://www.cms.gov/files/document/medicare-shared-savings-program-quality-performance-standard-performance-year-2026-40th-percentile.pdf

## Key regulatory facts the artifacts encode

- Four collection types form a 2×2: population (all-payer vs. Medicare) ×
  specification (electronic vs. registry-style). Medicare eCQM exists only in
  the proposed rule (2027+, not final).
- **Reporting incentive ("deeming")**: ALL five measures via eCQM/MIPS CQM in
  any mix, each meeting 75% data completeness, plus ≥10th percentile on one
  outcome measure AND ≥40th percentile on at least one of the remaining seven
  measures → deemed to meet the quality performance standard. (The lab counts
  CAHPS and the two claims outcome measures toward both conditions via their
  fixed decile-equivalent points.) All-or-nothing: one Medicare-column measure forfeits it. It is a
  floor-raiser, never a ceiling-raiser — same maximum sharing rate as passing
  by score.
- **COA**: finalized (CY2025 rule, from PY2025), eCQM-only, per-measure +1,
  per-measure 10-point ceiling, total ≤10% of available points.
- **PY2026 benchmark reality**: Medicare CQM 001/134/236 = real historical
  benchmarks (tough mid-range); Medicare CQM 112/113 = flat; 112/113 eCQM and
  MIPS CQM = no published benchmark (performance-period, set after submission);
  134 MIPS CQM topped-out with 7-point cap; 001 is inverse-scored.
- **Two-rail settlement**: the standard-met decision gates the sharing rate
  (step function, saturates); the raw score continuously drives ENHANCED loss
  scaling, non-QP clinicians' MIPS fee adjustments (claim-level multiplier,
  paid two years later, bypassing the ACO), and public reporting. No deeming
  pass-through to clinician MIPS scores.
- PY2026 is the final year for MIPS CQMs unless the proposed extension
  finalizes.

## Model scope

The default model is the ACO-level settlement, complete in itself: measure
scoring against real 2026 benchmarks per collection type, the quality
performance standard (by score or reporting incentive), sharing rate, and
quality-scaled shared losses. Above the passing threshold in a savings year
the marginal value of a point is $0 by design — that is the honest shape of
the incentive, with downside (loss-year) scaling supplying the continuing
value of points. The clinician MIPS fee-adjustment channel is out of scope
and not modeled: the mechanism is real, but its boundary depends on
per-clinician QP status and billing arrangements with no public data source.

## Known simplifications (labeled in-app as well)

- Whole-decile scoring (real MIPS awards fractional points 1.0–10.9 within a
  decile) costs at most ~0.9 points per measure. The larger reason the lab's
  absolute scores run below the oft-quoted PY2024 all-ACO median of 83.1 is
  that 83.1 is Web-Interface-dominated: PY2024 digital-only reporters' median
  was 74.58 (70.97 excluding EUC-floored ACOs) — the right comparator for an
  all-digital measure set. Comparisons across strategies remain valid.
- The QPS threshold is CMS's published PY2026 value (73.85). The lab awards
  whole-decile points (no fractional 1.0–10.9), so its scores read a few
  points below CMS's scale — treat near-bar outcomes as borderline. Sharing
  and loss rates and the minimum savings rate follow statutory track rules;
  the low-revenue half-rate exception is not modeled.
- The § 425.512(a)(7)(ii)(B) 40th-percentile score floor (73.85 for PY2026)
  is not modeled: whether its trigger fires when 112/113 lack pre-year
  benchmarks is genuinely unsettled (CMS's July 2026 preamble suggests not).
  If it fires, ACOs routing 112/113 to eCQM/MIPS CQM would be floored at the
  40th percentile rather than losing points — the opposite of a penalty.
- Data-capture efficiency and Medicare-population shift are labeled modeling
  assumptions with no per-ACO public source.
- Deterministic model: known deciles, no score uncertainty — which prices
  deeming's insurance/option value at zero. Natural next step: add rate
  uncertainty and show probability-of-passing per strategy.

Session date: August 7, 2026. Regulatory posture may change with the CY2027
PFS final rule (~November 2026); the proposed-rule toggle and footnotes mark
every contingent element.
