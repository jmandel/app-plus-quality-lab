# APP Plus Reporting: The 2×2 Matrix and the eCQM Thumb on the Scale

Under current rules as amended by the CY 2027 PFS proposed rule (CMS-1848-P), MSSP ACOs choose among four collection types for the five actively reported APP Plus measures — a clean 2×2 of **data pipeline** × **population**:

| | **All-payer / all-patient** | **Attributed beneficiaries only** |
|---|---|---|
| **eCQM pipeline** (CEHRT, end-to-end electronic) | **eCQM** | **Medicare eCQM** *(proposed, PY 2027+)* |
| **CQM pipeline** (registry / claims / abstraction) | **MIPS CQM** *(sunsets after PY 2026 under current law; CMS-1848-P proposes extension to PY 2027+ with anticipated sunset PY 2030 — proposed, not final)* | **Medicare CQM** |

## Axis effects

**Row (pipeline):** eCQM row submits QRDA III or QPP JSON and requires CEHRT capture end-to-end; CQM row is JSON-only, typically registry-mediated. Reporting any one measure via the eCQM row auto-satisfies the proposed CEHRT-use requirement (Option 1); the CQM row must instead attest to FHIR-based data collection (Option 2) or an operational CEHRT metric with audit exposure (Option 3).

**Column (population):** All-payer column carries the aggregation burden but keeps historical benchmarks and the eCQM/MIPS CQM reporting incentive (lenient quality performance standard → max sharing rate, loss protection). Attributed column gets CMS-defined denominators and flat benchmarks — but forfeits the reporting incentive.

## The single-cell anomaly

The **Complex Organization Adjustment** (+1 achievement point per submitted eCQM, ≤10% of available quality points) applies **only to the top-left cell**. MIPS CQMs share its column and get nothing; Medicare eCQMs share its row and are explicitly excluded. Classic eCQM is thus the only cell that stacks *both* the reporting incentive and the COA — a super-additive reward beyond what row + column effects imply.

## Why this misdirects dQM-readiness investment

CMS's stated destination is FHIR-based digital quality measures. But the near-term path to dQM competence is **FHIR-oriented data pipelines** — Bulk FHIR extraction, US Core normalization, cross-EHR aggregation — which today can be exercised most flexibly under **registry-based CQM reporting** (bottom row), where FHIR-sourced clinical data can feed measure computation without QRDA/CEHRT lock-in. The proposed Option 2 attestation even acknowledges this pattern.

The incentive structure, however, punishes exactly that investment. An ACO that builds FHIR pipelines under MIPS CQMs keeps the reporting incentive but **forgoes the COA**; one that pilots them under Medicare CQMs forgoes **both**. Meanwhile the maximally rewarded cell (eCQM) channels engineering effort into QRDA I/III generation and CEHRT roll-ups — a legacy CDA-based format with no role in the FHIR dQM endstate.

**Net effect:** CMS is paying a premium for the hardest *legacy* pipeline while imposing an opportunity cost on organizations doing early, voluntary exploration of the *future* one. Orgs rationally chase the stacked eCQM bonuses; FHIR pipeline maturity waits until CMS forces it. If dQM transition readiness is the goal, incentive parity — extending the COA (or an analogue) to FHIR-attested CQM reporting — would align rewards with the stated roadmap.

## CMS has already conceded the premise, in its own words

Every claim above rests on one fact — that the reporting method, not the care, moves the score. CMS
said so when it created collection-type benchmarks and has never revisited it (citations verified
against the Federal Register full text; see [`../research/cms-benchmark-design.md`](../research/cms-benchmark-design.md)):

- **The gaming concession, 2016, never followed up.** "We note that assigning separate benchmarks in
  this manner **creates opportunities for clinicians to achieve higher quality scores by selectively
  choosing submission mechanisms**; …we intend to monitor for such activity and to report back"
  (81 FR 77278). No such report-back appears in the nine subsequent rules searched.
- **Separate benchmarks were meant to be the narrow exception.** "We finalized separate benchmarks by
  submission mechanism **only when the differences in specifications make comparisons less valid**"
  (81 FR 77279). CMS's default was one national standard; it rejected stratification by specialty,
  size, region, and APM status.
- **CMS concedes the resulting inconsistency.** "We know there are differences in performance by data
  collection type," used to justify flattening only some collection types of a single measure, which
  it admits "may create some inconsistent evaluation between collection types for a single measure"
  (84 FR 63016). And for the new Ambulatory Specialty Model: "**Performance varies by collection type
  in MIPS**" (90 FR 49634).
- **The comparison pool is a reporting choice.** CMS calls the Medicare CQM pool a "tournament
  approach," where strong ACOs "could earn lower measure achievement points relative to comparable
  MIPS groups because the Medicare CQM benchmarking pool is comprised of higher-than-average
  performance data" — and offers the remedy of switching cells: "ACOs that prefer to be compared to
  clinicians at large may do so by reporting eCQMs or MIPS CQMs" (89 FR 98117).
- **The ladder is worth more than the care.** CMS's own impact estimate: "**Flat benchmarks were
  estimated to increase average quality scores by 11 percentage points**" (91 FR 44042, proposed).
- **CMS acknowledges the eCQM penalty and chose the COA as the remedy.** "We acknowledge that there
  may be instances when ACOs have lower performance reporting all payer/all patient eCQMs"
  (89 FR 98109); the Complex Organization Adjustment is a numerator adjustment "while not masking
  overall quality performance" (89 FR 98437). Note what this means for parity: CMS already accepts
  that a reporting method can depress measured performance and that a **numerator** correction is the
  appropriate answer. The argument here is only that the same logic should reach FHIR-attested CQM
  reporting.

One caveat worth stating plainly in any comment letter: **CMS has never published a figure
quantifying how much lower eCQM reporters score.** It asserts the variation and points to its
performance-data page without reproducing numbers. Any specific gap figure must be labeled as the
commenter's own analysis, not CMS's.
