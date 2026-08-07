# APP Plus Reporting: The 2×2 Matrix and the eCQM Thumb on the Scale

Under current rules as amended by the CY 2027 PFS proposed rule (CMS-1848-P), MSSP ACOs choose among four collection types for the five actively reported APP Plus measures — a clean 2×2 of **data pipeline** × **population**:

| | **All-payer / all-patient** | **Attributed beneficiaries only** |
|---|---|---|
| **eCQM pipeline** (CEHRT, end-to-end electronic) | **eCQM** | **Medicare eCQM** *(proposed, PY 2027+)* |
| **CQM pipeline** (registry / claims / abstraction) | **MIPS CQM** *(sunset reversed, extended indefinitely)* | **Medicare CQM** |

## Axis effects

**Row (pipeline):** eCQM row submits QRDA III or QPP JSON and requires CEHRT capture end-to-end; CQM row is JSON-only, typically registry-mediated. Reporting any one measure via the eCQM row auto-satisfies the proposed CEHRT-use requirement (Option 1); the CQM row must instead attest to FHIR-based data collection (Option 2) or an operational CEHRT metric with audit exposure (Option 3).

**Column (population):** All-payer column carries the aggregation burden but keeps historical benchmarks and the eCQM/MIPS CQM reporting incentive (lenient quality performance standard → max sharing rate, loss protection). Attributed column gets CMS-defined denominators and flat benchmarks — but forfeits the reporting incentive.

## The single-cell anomaly

The **Complex Organization Adjustment** (+1 achievement point per submitted eCQM, ≤10% of available quality points) applies **only to the top-left cell**. MIPS CQMs share its column and get nothing; Medicare eCQMs share its row and are explicitly excluded. Classic eCQM is thus the only cell that stacks *both* the reporting incentive and the COA — a super-additive reward beyond what row + column effects imply.

## Why this misdirects dQM-readiness investment

CMS's stated destination is FHIR-based digital quality measures. But the near-term path to dQM competence is **FHIR-oriented data pipelines** — Bulk FHIR extraction, US Core normalization, cross-EHR aggregation — which today can be exercised most flexibly under **registry-based CQM reporting** (bottom row), where FHIR-sourced clinical data can feed measure computation without QRDA/CEHRT lock-in. The proposed Option 2 attestation even acknowledges this pattern.

The incentive structure, however, punishes exactly that investment. An ACO that builds FHIR pipelines under MIPS CQMs keeps the reporting incentive but **forgoes the COA**; one that pilots them under Medicare CQMs forgoes **both**. Meanwhile the maximally rewarded cell (eCQM) channels engineering effort into QRDA I/III generation and CEHRT roll-ups — a legacy CDA-based format with no role in the FHIR dQM endstate.

**Net effect:** CMS is paying a premium for the hardest *legacy* pipeline while imposing an opportunity cost on organizations doing early, voluntary exploration of the *future* one. Orgs rationally chase the stacked eCQM bonuses; FHIR pipeline maturity waits until CMS forces it. If dQM transition readiness is the goal, incentive parity — extending the COA (or an analogue) to FHIR-attested CQM reporting — would align rewards with the stated roadmap.
