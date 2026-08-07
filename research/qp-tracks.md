# QP status, MSSP tracks, and MIPS exposure — verified ground truth for PY2026

**Domain:** which MSSP tracks are Advanced APMs; QP thresholds that govern PY2026 performance;
individual/TIN-level QP determination; what non-QP clinicians in an Advanced-APM ACO face; and
the real magnitude of ACO Part B billing.

**Retrieval date for every source below: 2026-08-07.**
Compiled independently of the app source (`src/PathwayLab.tsx` was not read).

> ## Headline finding (this changes PY2026 economics)
>
> **The QP thresholds that apply to PY2026 performance are 50% payment amount / 35% patient count —
> not 75% / 50%.** The currently codified 42 CFR 414.1430 still reads "2027 and later: 75 percent"
> (payment) and "2027 and later: 50 percent" (patient), because it was last amended at 89 FR 98564
> (Dec 9, 2024). The **Consolidated Appropriations Act, 2026 (Pub. L. 119-75, Feb 3, 2026)**
> amended section 1833(z)(2) of the Act to restore the lower thresholds **for payment year 2028
> only**, which is the payment year fed by the **2026 QP performance period**. CMS-1848-P proposes
> the conforming regulation text. The statute controls whether or not CMS finalizes.
>
> Corroboration: CMS's own QP projection for the 2026 QP performance period jumped from
> **375,000–482,200** (CY2026 PFS final rule, Nov 2025, when 75%/50% was assumed) to
> **517,800–530,900** (CY2027 PFS proposed rule, Jul 2026, after CAA 2026).
>
> Second finding: **CAA 2026 also revived the lump-sum APM Incentive Payment at 3.1% for payment
> year 2028** — i.e., PY2026 QPs get a 3.1% lump sum on CY2027 covered-professional-services paid
> claims, *on top of* the qualifying APM conversion factor. There is no lump sum for payment year 2027.

---

## Sources

All fetched on **2026-08-07**. "curl" = `curl` in Bash; "FR raw text" = Federal Register full-text
`.txt` endpoint, de-tagged locally; "data-api" = `https://data.cms.gov/data-api/v1/...` JSON API.

| # | Source | URL | How fetched |
|---|---|---|---|
| S1 | CY 2027 PFS proposed rule, **CMS-1848-P**, 91 FR 43842–44557, published 2026-07-16 (display 2026-07-14); comments close 2026-09-14 | `https://www.federalregister.gov/documents/2026/07/16/2026-14327/medicare-and-medicaid-programs-cy-2027-payment-policies-under-the-physician-fee-schedule-and-other` — full text at `https://www.federalregister.gov/documents/full_text/text/2026/07/16/2026-14327.txt` | curl (2.82 MB), de-tagged |
| S2 | CY 2027 PFS proposed rule — **MSSP fact sheet** (CMS Newsroom, Jul 14 2026) | `https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2027-medicare-physician-fee-schedule-proposed-rule-cms-1848-p-medicare-shared` | curl with browser UA (WebFetch got 403) |
| S3 | CY 2026 PFS **final** rule, **CMS-1832-F**, 90 FR 49266, published 2025-11-05 | `https://www.federalregister.gov/documents/full_text/text/2025/11/05/2025-19787.txt` | curl (4.78 MB), de-tagged |
| S4 | CY 2026 PFS final rule **Correction**, 2026-03-12 | `https://www.federalregister.gov/documents/full_text/text/2026/03/12/2026-04797.txt` | curl (checked: contains **no** conversion-factor corrections) |
| S5 | **2026 QPP Final Rule Fact Sheet and Policy Comparison Table** (CMS/QPP) | `https://qpp-cm-prod-content.s3.amazonaws.com/uploads/3506/2026%20Quality%20Payment%20Program%20Final%20Rule%20Fact%20Sheet%20and%20Policy%20Comparison%20Table.pdf` | curl → `pdftotext -layout` |
| S6 | **2023 QPP Experience Report** (CMS, June 2025) | `https://qpp-cm-prod-content.s3.amazonaws.com/uploads/3269/2023-QPP-Experience-Report.pdf` | curl with browser UA + Referer `https://qpp.cms.gov/` |
| S7 | **2023 QPP Participation and Performance Results At-A-Glance** (CMS) | `https://qpp-cm-prod-content.s3.amazonaws.com/uploads/3238/2023-QPP-Results-At-A-Glance.pdf` | curl with browser UA + Referer |
| S8 | **Shared Savings Program Fast Facts — as of January 1, 2026** (CMS) | `https://www.cms.gov/files/document/2026-shared-savings-program-fast-facts.pdf` | curl → `pdftotext -layout` |
| S9 | **MSSP PY2024 Performance Year Financial and Quality Results PUF** (revised 2026-07-17) | `https://data.cms.gov/sites/default/files/2026-07/fb6ba14b-3450-47c2-8ff5-d1f2a5bdb3e3/PY_Financial_and_Quality_Results_2024_revised%202026_07_17.csv` (landing: `https://data.cms.gov/medicare-shared-savings-program/performance-year-financial-and-quality-results`) | curl (438 KB, 476 ACO rows) |
| S10 | **QPP Experience PUF, PY2024** (503,917 TIN/NPI rows; modified 2026-05-19) | data-api dataset `7adb8b1b-b85c-4ed3-b314-064776e50180`; landing `https://data.cms.gov/quality-of-care/quality-payment-program-experience` | data-api with `filter[participation option]` + `column` projection |
| S11 | **2024 QPP PUF Methodology** (defines level of attribution of PUF columns) | `https://data.cms.gov/sites/default/files/2026-06/6b2a84a1-32f7-45a6-aa4f-96bdb6f5817b/2024-QPP-PUF-Methodology.pdf` | curl → `pdftotext -layout` |
| S12 | **Medicare Physician & Other Practitioners — by Geography and Service**, CY2024 (National rows) | data-api dataset `6fea9d79-0129-4e4c-b1b8-23cd86a4f435` | data-api, `filter[Rndrng_Prvdr_Geo_Lvl]=National` (13,463 rows) |
| S13 | **Medicare Monthly Enrollment**, CY2024 national annual row | data-api dataset `d7fabe1e-d19b-4333-9eff-e80e0643f2fd` | data-api, `filter[BENE_GEO_LVL]=National&filter[YEAR]=2024&filter[MONTH]=Year` |
| S14 | **42 CFR 414.1430** (current codified QP/Partial QP thresholds; source note 89 FR 98564, Dec 9 2024) | `https://www.law.cornell.edu/cfr/text/42/414.1430` | WebFetch (eCFR API was returning HTTP 503 at retrieval time) |
| S15 | **42 CFR 414.1305** (definitions: low-volume threshold, QP, Partial QP, Advanced APM) and **414.1310** (MIPS exclusions) | `https://www.law.cornell.edu/cfr/text/42/414.1305`, `https://www.law.cornell.edu/cfr/text/42/414.1310` | WebFetch |
| S16 | **MSSP ACO Participants file, PY2026** (as of 2026-01-01) | `https://data.cms.gov/sites/default/files/2026-01/453bc69c-61a4-4030-8d03-e33895fd1cfd/PY2026_Medicare_Shared_Savings_Program_Participants.csv` | curl (5.9 MB, 15,370 lines) |

**URL health check (2026-08-07)** for URLs the app's session notes claim:

| Claimed URL | Status |
|---|---|
| `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2026` | **Works on GET** (HTTP 200, 138,136 bytes, CSV header `Measure Title,Measure ID,CMS eCQM ID,Collection Type,...`). Note: `HEAD` returns 404 — health checks must use GET. |
| CY2027 PFS MSSP fact sheet (S2) | Works, but **403s for non-browser user agents**; needs a browser UA. |
| CY2025 PFS final rule MSSP fact sheet `.../calendar-year-cy-2025-...-cms-1807-f-medicare-shared-savings` | HTTP 200 |
| PY2026 40th-percentile QPS memo `https://www.cms.gov/files/document/medicare-shared-savings-program-quality-performance-standard-performance-year-2026-40th-percentile.pdf` | HTTP 200, 266,777 bytes |
| `https://qpp.cms.gov/resources/performance-data` | HEAD 404 / SPA. Machine-readable substitute: `https://qpp.cms.gov/api/frontend/resource-library` returns JSON for all 687 QPP resources with direct file URLs. |

---

## Key numbers

### (a) Which MSSP tracks are Advanced APMs vs MIPS APMs

Direct statement in CMS-1848-P (S1, at 91 FR ~44057, CEHRT discussion):

> "ACOs in the Advanced APM tracks of the Shared Savings Program (**BASIC track Level E and ENHANCED
> track**), whose qualifying participants are exempt from MIPS, have taken on financial risk…"
> and "…providers and suppliers who are MIPS eligible clinicians and who participate in ACOs in
> Shared Savings Program tracks that **do not meet the definition of an Advanced APM (BASIC track
> levels A-D)** … will still be required to report MIPS Promoting Interoperability…"

Restated in the CMS-1848-P Regulatory Impact Analysis list of APMs "expected to be Advanced APMs for
the 2027 QP Performance Period": "**Medicare Shared Savings Program (Level E of the BASIC Track and
the ENHANCED Track)**" (S1, 91 FR ~44260).

| MSSP track / level | Risk | Advanced APM? | QPP treatment of its clinicians |
|---|---|---|---|
| BASIC Level A | One-sided | **No** — MIPS APM | All MIPS eligible clinicians subject to MIPS; APM Entity scored via APP/APP Plus |
| BASIC Level B | One-sided | **No** — MIPS APM | same |
| BASIC Level C | Two-sided | **No** — MIPS APM | same |
| BASIC Level D | Two-sided | **No** — MIPS APM | same |
| **BASIC Level E** | Two-sided | **Yes** | QPs exempt from MIPS; non-QPs subject to MIPS via APP/APP Plus |
| **ENHANCED** | Two-sided | **Yes** | same |

Historical confirmation of the same line (S1, recap of 83 FR 60092): the pre-2025 CEHRT rule split
ACOs into "a track that did **not** meet the financial risk standard to be an Advanced APM (for
example, ACOs participating under BASIC track Levels A through D)" vs. "a track that **met** the
financial risk standard … (for example, ACOs participating under BASIC track Level E or the
ENHANCED track)."

**PY2026 track mix** (S8, Fast Facts as of 2026-01-01; 511 ACOs, 12.6 M assigned beneficiaries):

| Track group | ACOs | Share of ACOs | Advanced APM? |
|---|---|---|---|
| BASIC Levels A & B | 121 | 24% | No |
| BASIC Levels C & D | 12 | 2% | No |
| BASIC Level E | 82 | 16% | **Yes** |
| ENHANCED | 296 | 58% | **Yes** |
| **Advanced-APM tracks total** | **378** | **74%** | — |
| **MIPS-APM tracks total (A–D)** | **133** | **26%** | — |

CMS-1848-P narrative agrees: "As of PY 2026, participation in BASIC track Level E has decreased to
16 percent" and "For PY 2026, 58 percent of ACOs are participating in the ENHANCED track" (S1).

**PY2024 actuals from the results PUF (S9, n = 476 ACOs, 10,326,340 assigned beneficiaries):**

| Track code in PUF | ACOs | Assigned beneficiaries | Share of MSSP beneficiaries |
|---|---|---|---|
| EN (ENHANCED) | 205 | 5,584,151 | 54.1% |
| E (BASIC Level E) | 104 | 1,981,657 | 19.2% |
| **Advanced APM subtotal** | **309** | **7,565,808** | **73.3%** |
| B | 103 | 1,899,937 | 18.4% |
| A | 54 | 768,144 | 7.4% |
| C | 5 | 48,225 | 0.5% |
| D | 5 | 44,226 | 0.4% |
| **MIPS APM subtotal (A–D)** | **167** | **2,760,532** | **26.7%** |

---

### (b) QP thresholds relevant to PY2026 performance, and observed QP rates

QP performance period runs **January 1 – August 31** of the year two years before the payment year,
with **three snapshot dates: March 31, June 30, August 31** (S1, recap of 81 FR 77446–77447).
So **PY2026 performance → 2028 payment year**.

#### Medicare Option thresholds by payment year

Currently codified 42 CFR 414.1430 (S14, last amended 89 FR 98564) vs. as proposed to be amended by
CMS-1848-P (S1, proposed regulation text at 91 FR ~44285–44286, amendatory instruction 46):

| Payment year (→ performance period) | QP payment amount | Partial QP payment amount | QP patient count | Partial QP patient count |
|---|---|---|---|---|
| 2019–2020 (2017–2018) | 25% | 20% | 20% | 10% |
| 2021–2026 (2019–2024) | 50% | 40% | 35% | 25% |
| 2027 (**PY2025**) | 75% | 50% | 50% | 35% |
| **2028 (PY2026)** — *proposed, per CAA 2026* | **50%** | **40%** | **35%** | **25%** |
| 2029 and later (PY2027+) | 75% | 50% | 50% | 35% |

*Codified text today* collapses the last three rows into "**2027 and later: 75 percent**" (payment)
/ "**2027 and later: 50 percent**" (patient) — i.e., the codified text is **stale** with respect to
PY2026 and CMS is proposing to fix it.

CMS-1848-P preamble (S1): "we note that these thresholds all increased for payment year 2027
(performance period 2025), and **were legislatively restored to lower levels for payment year 2028
(performance period 2026)**."

#### All-Payer Combination Option (proposed 414.1430(b), S1)

| Payment year | QP payment amount | Partial QP payment amount |
|---|---|---|
| 2021–2026 | 50% | 40% |
| 2027 | 75% | 50% |
| 2028 | 50% | 40% |
| 2029 and later | 75% | 75%¹ |

¹ The proposed text for (b)(2)(i)(D) reads "2029 and thereafter: 75 percent" for the *Partial QP*
payment amount threshold, which is almost certainly a drafting error (Partial QP should be 50%).
Flagged as a proposed-rule defect, not a real policy. The (b) bullet list in the preamble is
similarly garbled (duplicate paragraph designators, "2028 and later" where "2029 and later" is
meant); **the amendatory regulation text is the more reliable read**.

#### What QP status is worth in the PY2026 → 2028 window

| Item | Value | Source |
|---|---|---|
| Qualifying APM conversion-factor update, CY2027 | **+0.75%** | S1, 91 FR ~44241 |
| Nonqualifying APM conversion-factor update, CY2027 | **+0.25%** | S1 |
| Steady-state CF gap created per year | "**approximately a 0.5 percent difference** in the two conversion factors each year" | S1 RIA |
| CY2026 qualifying APM CF (final) | **$33.5675** | S3, 90 FR ~49961 |
| CY2026 nonqualifying APM CF (final) | **$33.4009** | S3 |
| CY2027 **proposed** qualifying APM CF | **$33.1693** | S1 RIA |
| CY2027 **proposed** nonqualifying APM CF | **$32.8409** | S1 RIA |
| CY2027 proposed qualifying/nonqualifying CF gap | **$0.3284 (1.00%)** | derived from S1 |
| CY2027 proposed anesthesia CFs | qualifying 20.4165 / nonqualifying 20.2143 | S1 RIA |
| Lump-sum APM Incentive Payment, payment year 2025 | 3.5% | S1 (CAA 2023) |
| Lump-sum APM Incentive Payment, payment year 2026 | 1.88% | S1 (CAA 2024) |
| Lump-sum APM Incentive Payment, payment year 2027 | **none** | S1 (gap in the statute) |
| **Lump-sum APM Incentive Payment, payment year 2028 (PY2026 QPs)** | **3.1%** | S1: "The Consolidated Appropriations Act, 2026, now has provided for a 3.1 percent APM Incentive Payment in payment year 2028"; proposed 414.1450(b)(1)(iv) |
| Base for the lump sum | estimated aggregate payments for covered professional services furnished in the **calendar year immediately preceding the payment year** (so CY2027 claims for the 2028 payment) | S1, 414.1450(b)(1) |

> **Note on an apparent typo in CMS-1848-P's executive summary.** The summary (S1, 91 FR ~43843)
> says the 2027 qualifying CF "represents a projected decrease of $0.40 (-1.19 percent) from the
> current conversion factor of **$33.4009**" and the nonqualifying CF a decrease of "$0.56 (-1.68
> percent) from the current conversion factor of **$33.5875**". The dollar/percent deltas are right
> but the two anchor values are swapped and one digit is off: $33.5675 → $33.1693 is −$0.3982
> (−1.186%) ✓ qualifying; $33.4009 → $32.8409 is −$0.5600 (−1.677%) ✓ nonqualifying. `$33.5875`
> appears exactly once in the entire proposed rule and nowhere in the CY2026 final rule or its
> March 2026 correction (S3, S4). Use **$33.5675 / $33.4009** for CY2026.

#### Observed / projected QP rates

| Metric | Value | Source |
|---|---|---|
| Advanced APM participants (NPIs), 2021 | 333,658 | S6 Table 41 / S7 |
| … 2022 | 420,591 | S6 / S7 |
| … 2023 | **505,210** | S7 (S6 Table 41 prints 505,201 — 9-NPI discrepancy between the two CMS documents) |
| QPs, 2021 | 271,231 (**81.3%** of Advanced APM participants) | S6/S7 |
| QPs, 2022 | 384,105 (**91.3%**) | S6/S7 |
| QPs, 2023 | **463,669 (91.8%)** | S6/S7 |
| Partial QPs, 2023 | 1,339 (0.27%) | S6/S7 |
| Non-QP, non-Partial-QP Advanced APM participants, 2023 | ~40,202 (**8.0%**) | derived: 505,210 − 463,669 − 1,339 |
| Total clinicians receiving a MIPS payment adjustment, 2023 | 541,421 | S7 |
| **Average MSSP QP threshold scores, 2023** | payment method **64.59**, patient method **65.72** | S6 Table 40 |
| CMS estimate of QPs, 2026 QP performance period — *made Nov 2025 under 75%/50%* | **375,000 – 482,200** | S3, 90 FR ~49980 |
| CMS estimate of QPs, 2026 QP performance period — *made Jul 2026 under CAA 2026* | **517,800 – 530,900** | S1, 91 FR ~44260 |

Interpretation for an Advanced-APM MSSP ACO: with the MSSP average threshold score around 64–66
(2023) and the PY2026 payment-amount threshold at **50%**, the great majority of an
Advanced-APM ACO's clinicians clear the bar. The ~92% program-wide QP rate (2023, all Advanced APMs)
is the best public proxy; CMS publishes **no** MSSP-only QP rate.

**Caution on the 92% figure:** it is the share of *clinicians on Advanced APM participation lists*
who are QPs, across all Advanced APMs — it is **not** the share of an ACO's total participant-list
providers. MSSP participant lists (S8: 687,739 physicians and non-physicians across 511 ACOs in
PY2026) include many providers who are not eligible clinicians, are below the low-volume threshold,
or are in MIPS-APM tracks.

---

### (c) Individual-level and TIN/NPI-level QP determination

| Policy | Where finalized/proposed | Effective |
|---|---|---|
| QP determinations generally at the **APM Entity** level; QP *status* then applied at the **NPI** level (all of that NPI's TINs) | CY2017 QPP final rule, 81 FR 77439–77445 and 81 FR 77440 | 2017 QP performance period onward |
| Narrow individual-level determinations only for (1) clinicians on >1 APM Entity participation list who miss QP at every entity (414.1425(c)(4)), and (2) clinicians on an Affiliated Practitioner List (414.1425(b)(2)) | CY2017 QPP final rule | through **CY2025** QP performance period |
| CY2024 PFS proposal to move QP determinations to the individual level | **Proposed but NOT finalized** in the CY2024 PFS final rule | n/a |
| **Individual-level QP determination for ALL Advanced APM participants** (new 414.1425(b)(3), (c)(3)(ii)) — each eligible clinician gets *both* an APM-Entity-level and an individual-level calculation, based on services across all TINs to which they reassign billing rights; the more favorable result governs | **Finalized** in the **CY2026 PFS final rule** (CMS-1832-F, 90 FR 49266; discussion at 90 FR ~49923–49926, cited by CMS-1848-P as 90 FR 50012) | **Beginning with the 2026 QP performance period** — i.e. it applies to PY2026 |
| Two service sets for QP determinations: E/M services **and** all Covered Professional Services; "We will assign QP status based on the **most favorable** calculation" | CY2026 PFS final rule (414.1435, 414.1305 definitions of "Covered professional service attribution-eligible beneficiary" and "E/M attribution-eligible beneficiary") | 2026 QP performance period |
| **Operational detail:** individual-level calculations for all three snapshots are delivered **only with the third-snapshot feedback** at the end of the QP performance period | CY2026 PFS final rule comment response (S3) | 2026 onward |
| **TIN/NPI-level application of QP and Partial QP status** — proposed new 414.1425(c)(8) and (d)(5): QP status would apply **only at the TIN(s) participating with the APM Entity**, so both the APM Incentive Payment and the qualifying APM CF reach only those TINs; Partial QP's MIPS opt-in/opt-out would likewise be per-TIN | **PROPOSED ONLY** in CMS-1848-P (S1, 91 FR ~44215–44217) | not yet final; comments close **2026-09-14**; CY2027 final rule expected ~Nov 2026 |
| Related CMS-1848-P proposals: clarify 414.1425(c)(5)(ii) (strike "even if such termination date occurs within such QP Performance Period" as a clerical error from CY2020); APMs without a Participation List excluded from MIPS scoring and QP determinations | **PROPOSED ONLY** (S1) | — |

CMS's stated rationale for the TIN/NPI proposal (S1, verbatim): *"we are concerned that a
significant proportion of incentives paid for QP status will be paid to TINs that are not part of an
Advanced APM, creating a disincentive for these TINs to join an Advanced APM"*; and *"we recognize
that this proposal would decrease the dollar value of the financial incentives available for
affected QPs."* CMS also states *"for the majority of clinicians in Advanced APMs, this policy will
not change their participation in QPP, because they are already participating with an APM Entity in
an Advanced APM with all of their TIN reassignments"* and that *"relatively few QPs would be
affected"* — CMS publishes **no quantitative estimate** of the affected share.

Multi-entity tie-break under the proposal: if the clinician attains QP **individually**, QP status
attaches at *every* TIN participating across those APM Entities; if only via a specific APM Entity's
entity-level determination, QP status attaches only at the TIN(s) tied to that entity
(414.1435(h)(2) "greater QP status" preference preserved).

---

### (d) What non-QP clinicians in an Advanced-APM ACO face

Statutory/regulatory chain:

1. **QPs and non-electing Partial QPs are excluded from MIPS** — 42 CFR 414.1310(b)(1)(i)–(ii)
   (S15). Everyone else who is a MIPS eligible clinician and exceeds the low-volume threshold is in.
2. **Low-volume threshold** (42 CFR 414.1305, S15): for 2020 and later, excluded if Part B allowed
   charges ≤ **$90,000**, **or** ≤ **200** Medicare Part B patients, **or** ≤ **200** covered
   professional services. All three must be exceeded to be MIPS eligible (evaluated at individual,
   group/TIN, **or** APM Entity group level).
3. **MSSP is a MIPS APM regardless of track**, so its MIPS eligible clinicians can be scored at the
   **APM Entity** level via the **APM Performance Pathway (APP) / APP Plus**. The ACO's APP Plus
   reporting yields a **MIPS quality performance category score** under 414.1380(b)(1), which is
   what 42 CFR 425.512 then uses for the MSSP quality performance standard (S1).
4. CMS states it plainly (S1 RIA): *"If an eligible clinician does not attain either QP or Partial
   QP status and is not excluded from MIPS on another basis, the eligible clinician will be subject
   to the MIPS reporting requirements and will receive the corresponding MIPS payment adjustment."*
5. And specifically for ACOs (S1 CEHRT section): MIPS eligible clinicians in **BASIC A–D** ACOs
   **and** "those in Advanced APM tracks **who are not QPs**" remain required to report the MIPS
   Promoting Interoperability category.

**PY2026 MIPS parameters that bound a non-QP's exposure:**

| Parameter | PY2026 (→ 2028 MIPS payment year) | Source |
|---|---|---|
| Performance threshold | **75.00 points** (locked through CY2028 performance period / 2030 payment year) | S5 |
| Maximum negative adjustment | **−9%** (statutory, MACRA, since 2022 payment year) | S5 |
| Final score 0.00 – 18.75 | −9% flat | S5 |
| Final score 18.76 – 74.99 | scaled between −9% and 0% | S5 |
| Final score 75.00 | 0% | S5 |
| Final score 75.01 – 100.00 | positive, scaled for budget neutrality | S5 |
| Exceptional performance bonus | **gone** — funding expired after 2022 performance year / 2024 payment year | S7 |
| Adjustment base | "amounts otherwise paid under Medicare Part B for **covered professional services**" for the MIPS payment year | S1 |
| Partial QPs | may elect in or out of MIPS; **not** eligible for the APM Incentive Payment | S1 RIA |
| Traditional MIPS | proposed to sunset beginning **CY2029 performance period / 2031 payment year**; clinicians reporting the **APP are exempt** from the MVP-only requirement | S1 (proposal only) |

**Observed PY2024 APP scoring** (S10, my aggregation of the QPP Experience PUF):

| Metric | Value |
|---|---|
| TIN/NPI rows with participation option = APM Entity | 99,343 |
| … of which reporting option = **APM Performance Pathway** | **98,141** |
| … reporting option = Traditional MIPS | 1,202 |
| Final score among APP/APM-Entity rows: min / p10 / median / max | 38.65 / 88.83 / **94.00** / 100.0 |
| Payment adjustment % among APP/APM-Entity rows: min / median / max | **−4.36%** / +0.80% / +1.05% |
| Participation-option mix, all 503,917 PY2024 PUF rows | Group 360,752; APM Entity 99,343; Individual 43,142; Subgroup 569; Virtual Group 111 |

For context, in **PY2023** CMS reported 119,467 MIPS eligible clinicians received a MIPS final score
from **Shared Savings Program** APM Entity participation (99.08% of all APM-Entity-scored
clinicians; Enhancing Oncology Model accounted for the other 1,109) — S6 Table 39.

Note the practical asymmetry: the *upside* of a good APP score in PY2024 was at most **+1.05%**,
while the downside floor is **−9%**. A non-QP's MIPS exposure is overwhelmingly downside risk.

---

### (e) ACO Part B billing magnitude — sanity check on $15M / $60M / $30M

#### The app's ACO sizes match the PY2024 PUF quartiles exactly

From S9 (476 ACOs, PY2024), the distribution of `N_AB` (assigned beneficiaries):

| Statistic | Assigned beneficiaries |
|---|---|
| min | 2,647 |
| **p25** | **8,238** |
| **median** | **13,151** |
| **p75** | **24,494** |
| max | 328,733 |
| total | 10,326,340 |

The app's 8k / 13k / 24k scenarios are the p25 / median / p75 of the PY2024 PUF. Good provenance.

#### Per-capita physician/supplier (Part B) spend on assigned beneficiaries

`CapAnn_PB` in the PUF = capped, annualized **per-capita expenditure for physician/supplier Part B
services** for the ACO's assigned beneficiaries (PY2024, truncated at CMS's high-cost cap):

| Statistic | CapAnn_PB ($/assigned beneficiary/yr) |
|---|---|
| min | 1,814 |
| p10 | 3,039 |
| p25 | 3,580 |
| **median** | **4,332** |
| p75 | 5,126 |
| p90 | 5,994 |
| max | 9,356 |
| **beneficiary-weighted mean** | **4,363** |
| PB share of total per-capita expenditure | **33.1%** (median total per-capita PY expenditure $12,691) |

Median by track group: Advanced APM tracks (E, EN) **$4,389**; MIPS APM tracks (A–D) **$4,150**.

#### Per-ACO totals (N_AB × CapAnn_PB), PY2024

| Statistic | Assigned-beneficiary Part B spend per ACO |
|---|---|
| p10 | $23M |
| p25 | $33M |
| **median** | **$59M** |
| p75 | $111M |
| p90 | $201M |
| max | $1,265M |
| total across 476 ACOs | **$45.1B** |
| median, Advanced APM tracks (n=309) | $67M |
| median, MIPS APM tracks A–D (n=167) | $45M |

At the app's exact scenario sizes, using the beneficiary-weighted $4,363/bene:

| Scenario | Assigned-beneficiary Part B spend | App's stated non-QP Part B base | Implied non-QP share |
|---|---|---|---|
| 24,494 benes (p75) | **$106.9M** | $15M | **14%** |
| 13,151 benes (median) | **$57.4M** | $60M | **105%** |
| 8,238 benes (p25) | **$35.9M** | $30M | **84%** |

**Verdict:** all three app figures are *within a defensible range*, but they are only coherent under
specific track assumptions:

- **$60M at 13k benes** ≈ 100% of the assigned-beneficiary Part B base — consistent with a **BASIC
  A–D (MIPS APM) ACO where every clinician is a non-QP**. Very close to the true median ($57–59M).
- **$30M at 8k benes** ≈ 84% — plausible for a MIPS-APM ACO or a mostly-non-QP Advanced APM ACO.
- **$15M at 24k benes** ≈ 14% — requires ~86% of Part B dollars to come from QPs. That is
  **consistent with the ~92% QP rate observed program-wide in 2023 (S6/S7)** for an
  ENHANCED / Level E ACO, but it is a strong assumption that should be surfaced in the UI, not
  buried.

#### Independent cross-checks on the per-beneficiary magnitude

| Check | Value | Source |
|---|---|---|
| CY2024 national Medicare **allowed** amount, Physician & Other Practitioners | **$153,112,787,693** | S12 (Σ Tot_Srvcs × Avg_Mdcr_Alowd_Amt over 13,463 National rows) |
| … of which drug-HCPCS allowed | $36,457,309,887 (23.8%) | S12 |
| … non-drug allowed | $116,655,477,806 | S12 |
| CY2024 national Medicare **payment** amount, same file | **$120,801,671,724** | S12 |
| CY2024 Original-Medicare beneficiaries **with Part B** | **27,982,142** | S13 (`B_ORGNL_MDCR_BENES`) |
| ⇒ allowed per FFS Part B beneficiary | **$5,472** | derived |
| ⇒ **paid** per FFS Part B beneficiary | **$4,317** | derived |
| MSSP beneficiary-weighted CapAnn_PB (paid, truncated) | **$4,363** | S9 |

The MSSP per-capita figure ($4,363 paid) lands within 1% of the national FFS Part B paid figure
($4,317) — the two sources corroborate each other.

#### Per-clinician anchors (useful for bottom-up construction of a non-QP base)

| Anchor | Value | Source |
|---|---|---|
| CMS RIA estimate, CY2026: MIPS eligible clinicians | **607,419** with **~$51.84B** in allowed charges → **$85,343 per MIPS EC** | S3, 90 FR ~49980 |
| CMS RIA estimate, CY2027: MIPS eligible clinicians | **586,925** with **~$51.70B** in allowed charges → **$88,053 per MIPS EC** | S1, 91 FR ~44261 |
| Initial population of clinicians with PFS claims (CY2024 data) | 1,984,786 | S1 |
| Median allowed charges for clinicians who reported MIPS **as individuals**, PY2024 | $183,904 (mean $264,462; p25 $126,470; p75 $298,950) | S10 — a high-volume self-selected subset, **do not** use as a general per-clinician figure |
| Allowed charges per MIPS-scored TIN/NPI in APM-Entity/APP reporting, PY2024 | ≈$113k (see caveat below) | S10, derived |
| MSSP participant-list providers, PY2026 | 687,739 physicians and non-physicians across 511 ACOs (mean 1,346/ACO); 15,353 participant TINs | S8 |
| MSSP participant-list clinicians per ACO, PY2024 (N_PCP+N_Spec+N_NP+N_PA+N_CNS) | median **827** (p25 364, p75 2,002); 806,048 summed across 476 ACOs, **with double counting** across ACOs | S9 |

**Bottom-up rule of thumb:** non-QP Part B base ≈ (number of non-QP **MIPS eligible** clinicians in
the ACO) × **~$85,000–88,000** in Part B allowed charges. At that rate the app's bases imply roughly
**170 / 682 / 341** non-QP MIPS eligible clinicians for the $15M / $60M / $30M scenarios — all
plausible against a median ACO participant list of ~827 providers, of whom only a minority are MIPS
eligible clinicians above the low-volume threshold.

---

## Caveats and gaps

**Things that could not be verified from a public source:**

1. **No MSSP-specific QP rate is published by CMS.** The 91.8% (2023) QP rate is across *all*
   Advanced APMs. The only MSSP-specific QP signal published is the average threshold score
   (payment 64.59, patient 65.72 in 2023, S6 Table 40).
2. **The 2024 QPP Participation and Performance Results At-A-Glance is not retrievable from this
   environment.** The CMS resource-library entry (nId 3666, last updated 2026-05-20) points to
   `https://d2g5m5leph8kam.cloudfront.net/s3fs/s3fs-public/2026-05/2024-qpp-participation-results-at-a-glance.pdf?VersionId=yQGh5j15BoP.LpM8TxKuiS_lTlrpS9IQ`, which returns S3 `AccessDenied` (HTTP 403)
   with and without the VersionId, with browser UA and Referer. There is no 2024 QPP Experience
   Report published yet. **PY2024 Advanced APM participant / QP / Partial QP counts are therefore
   unverified**; 2023 is the latest confirmed year.
3. **CMS gives no estimate of how many QPs would lose incentives under the TIN/NPI proposal.** It
   says only "relatively few" and "the majority … will not change."
4. **CMS gives no track-level (Level E vs ENHANCED) QP rate**, and no ACO-level distribution of
   non-QP clinician counts or their Part B billing. Any per-ACO non-QP share in the app is a
   modeling assumption, not a published statistic.
5. **`CapAnn_PB` is not the MIPS payment-adjustment base.** Two errors run in opposite directions
   and do **not** cancel:
   - *Too low:* the MIPS adjustment applies to the ACO clinicians' Part B covered professional
     services for **all** FFS patients, not just the ACO's assigned beneficiaries. MSSP assigned
     beneficiaries are 10.3M of 28.0M FFS Part B beneficiaries (37%), so ACO clinicians bill
     substantially outside the assigned population.
   - *Too high:* `CapAnn_PB` counts Part B physician/supplier spending on assigned beneficiaries by
     **any** provider, including non-ACO clinicians; and the carrier-claim "PB" category includes
     physician-administered drugs and lab services that are **not** PFS "covered professional
     services" (nationally, drug HCPCS are 23.8% of allowed amounts, S12).
   - `CapAnn_PB` is also **truncated/capped** at CMS's high-cost threshold, so it understates raw
     spend; and it is **program payment**, not allowed charges (allowed ≈ paid ÷ 0.79 nationally in
     CY2024, per S12).
6. **The QPP Experience PUF cannot be aggregated to APM Entity.** Per S11, for
   `participation option = APM Entity` the columns `allowed charges`, `medicare patients`,
   `services`, and `practice size` are attributed to the clinician's **group (TIN)**, not the APM
   Entity, and there is no ACO/APM-entity identifier in the file. My "distinct TIN signature"
   dedupe (1,926 signatures summing to $11.05B) is a lower-confidence estimate — signatures can
   collapse distinct TINs with identical values — and should **not** be treated as a verified
   number. The verified numbers from that file are the row counts, the score/adjustment
   distributions, and the individual-reporter charge distribution.
7. **CMS-1848-P is a proposed rule.** The TIN/NPI QP application, the 414.1430 threshold
   codification, the 3.1% APM Incentive Payment codification, the BASIC Level E sharing-rate
   increase (50%→60%), the ENHANCED regional-adjustment cap (50%→35%), the prior-savings scaling
   factor (50%→75%), the CEHRT-requirement replacement, and the traditional-MIPS sunset are **all
   subject to change** in the CY2027 final rule (expected ~Nov 2026). Comments closed 2026-09-14.
   The **CAA 2026 threshold change is statutory and applies regardless** of what CMS finalizes.
8. **Drafting defects in CMS-1848-P** (documented above): the executive-summary conversion factors
   are mislabeled/mistyped; the All-Payer Partial QP payment-amount threshold for "2029 and
   thereafter" is written as 75% (should almost certainly be 50%); the preamble bullet list for
   414.1430 contains duplicated paragraph designators. Track whether these are cleaned up in the
   final rule before relying on them.
9. **eCFR was unavailable** (HTTP 503, "under heavy load (queue full)") at retrieval time, so the
   current codified 414.1305 / 414.1310 / 414.1430 text was read from Cornell LII (S14, S15)
   rather than from ecfr.gov. Cornell's copy of 414.1430 carries the source note "89 FR 98564,
   December 9, 2024", consistent with the CY2025 PFS final rule being its last amendment.
10. **Two CMS documents disagree by 9 NPIs** on the 2023 Advanced APM participant count (505,210 in
    the At-A-Glance vs 505,201 in the Experience Report Table 41). Immaterial, but noted.

**Local data extract:** `research/data/mssp-py2024-aco-size-and-partb.csv` (15 KB, 476 rows) —
ACO_ID, Current_Track, Advanced_APM_track flag, N_AB, CapAnn_PB, and derived assigned-beneficiary
Part B dollars, from S9. Raw downloads (rule texts, PUFs, PDFs) are in
`/home/jmandel/hobby/.agent-scratch/qp-tracks/` and are **not** committed.
