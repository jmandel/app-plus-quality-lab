# CY 2027 PFS Proposed Rule (CMS-1848-P) — MSSP Quality / APP Plus Provisions

**Research date: 2026-08-07.** Everything below is **PROPOSED** unless explicitly labeled
"current law" / "finalized". The comment period closes **2026-09-14**; a final rule is
expected around November 2026. Nothing here is binding until finalized.

---

## Sources

| # | Source | URL | Retrieved | How fetched |
|---|--------|-----|-----------|-------------|
| S1 | CMS fact sheet: "CY 2027 Medicare Physician Fee Schedule Proposed Rule (CMS-1848-P) — Medicare Shared Savings Program Proposals" (issued 2026-07-14) | https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2027-medicare-physician-fee-schedule-proposed-rule-cms-1848-p-medicare-shared | 2026-08-07 | `curl` (WebFetch returns HTTP 403 for cms.gov; curl works), HTML→text |
| S2 | Federal Register full text, CMS-1848-P, 91 FR 43842–44557, published 2026-07-16, FR Doc 2026-14327 | https://www.federalregister.gov/documents/full_text/text/2026/07/16/2026-14327.txt (landing page: https://www.federalregister.gov/documents/2026/07/16/2026-14327/medicare-and-medicaid-programs-cy-2027-payment-policies-under-the-physician-fee-schedule-and-other) | 2026-08-07 | `curl`; located via FR API `documents.json?conditions[term]=CMS-1848-P`. **File contains 4 NUL bytes** — strip with `tr -d '\000'` before grepping |
| S3 | Same rule, official PDF (tables are embedded images, absent from the .txt) | https://www.govinfo.gov/content/pkg/FR-2026-07-16/pdf/2026-14327.pdf | 2026-08-07 | `curl` (41.3 MB); Tables B-G2/B-G3/B-G4/B-G5/B-G6 recovered by `pdftoppm -r 250` + `tesseract` OCR of PDF pages 197, 202, 203, 214, 215 |
| S4 | CMS memo: "MSSP Quality Performance Standard: PY 2026 40th Percentile MIPS Quality Performance Category Score" (Dec 2025) | https://www.cms.gov/files/document/medicare-shared-savings-program-quality-performance-standard-performance-year-2026-40th-percentile.pdf | 2026-08-07 | `curl` + `pdftotext` |
| S5 | QPP PY 2026 quality benchmarks CSV | https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2026 | 2026-08-07 | `curl` (HTTP 200, 138 KB) |
| S6 | QPP PY 2025 quality benchmarks CSV | https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2025 | 2026-08-07 | `curl` (HTTP 200, 146 KB) |
| S7 | QPP PY 2027 quality benchmarks CSV | https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2027 | 2026-08-07 | `curl` → **HTTP 500, not yet published** |
| S8 | CMS fact sheet: CY 2025 PFS final rule (CMS-1807-F) — MSSP | https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2025-medicare-physician-fee-schedule-final-rule-cms-1807-f-medicare-shared-savings | 2026-08-07 | `curl`, HTML→text |
| S9 | CMS fact sheet: CY 2026 PFS final rule (CMS-1832-F) — MSSP | https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2026-medicare-physician-fee-schedule-final-rule-cms-1832-f-medicare-shared-savings | 2026-08-07 | `curl`, HTML→text |

Small machine-readable extract written alongside this file:
`research/data/pfs-cy2027-medicare-cqm-benchmarks.json` (6 KB).

Federal Register page cites below are to the printed pages in S2/S3. Preamble discussion of
MSSP quality is section **III.G.3** (91 FR 44036–44056); QPP is section **IV** (91 FR
44147–44220); amendatory regulation text is at 91 FR 44280–44300.

---

## Key numbers

### 1. Headline dates and dollars

| Item | Value | Status | Cite |
|---|---|---|---|
| Rule issued / displayed | 2026-07-14 | — | S1 |
| Federal Register publication | 2026-07-16, 91 FR 43842 | — | S2 |
| Comment period closes | 2026-09-14 (file code CMS-1848-P, docket CMS-2026-2377) | — | S1; 91 FR 43842 |
| CY 2027 **qualifying APM** (QP) conversion factor | **$33.1693** (est.); +0.75% statutory update, +0.53% BN adj.; −$0.40 / −1.19% vs. CY 2026 $33.4009 | Proposed estimate | 91 FR 43843, 44241 |
| CY 2027 **nonqualifying APM** conversion factor | **$32.8409** (est.); +0.25% statutory update, +0.53% BN adj.; −$0.56 / −1.68% vs. CY 2026 $33.5875 | Proposed estimate | 91 FR 43843, 44241 |
| Program size | 511 ACOs, >700,000 providers/organizations, >12.6M assigned beneficiaries as of 2026-01-01 | Fact | 91 FR 44255 (cites Shared Savings Program Fast Facts, Jan 1 2026) |
| Projected 10-yr (2027–2036) Trust Fund effect of all MSSP proposals | −$5.5B (10th–90th pct: −$8.9B to −$2.3B) | Proposed estimate | S1; 91 FR 44018, 44257 |
| Projected 10-yr change in net shared savings paid to ACOs | +$1.05B (10th–90th pct: −$2.6B to +$4.63B) | Proposed estimate | 91 FR 44257 |
| Projected increase in ACO-assigned beneficiaries | +0.5M to +1.0M per year on average | Proposed estimate | 91 FR 44257 |

### 2. APP Plus quality measure set — current law vs. proposed

| Performance year | Current law (CY 2025 FR as amended by CY 2026 FR) | Proposed (CMS-1848-P) |
|---|---|---|
| PY 2025 | 6 measures (4 ACO-reported + 1 admin claims + CAHPS) | unchanged |
| PY 2026 | **8** measures: 5 ACO-reported (001, 112, 113, 134, 236) + 2 admin claims (479, 484) + CAHPS (321) | unchanged |
| PY 2027 | **9** measures — adds Quality ID **305** (Initiation and Engagement of Substance Use Disorder Treatment) as a 6th ACO-reported measure | **8** measures — 305 removed |
| PY 2028 (or 1 yr after eCQM spec available for 493, whichever later) | **10** measures — adds Quality ID **493** (Adult Immunization Status) as a 7th ACO-reported measure (487 already removed by CY 2026 FR) | **8** measures — 493 removed; set held flat |

Proposed **PY 2027 and subsequent** APP Plus set (Table B-G5, 91 FR 44055; also S1 Table 1):

| Quality # | Measure | Collection type(s) | Measure type |
|---|---|---|---|
| 321 | CAHPS for MIPS | CAHPS for MIPS Survey | Patient engagement/experience |
| 479 | Hospital-Wide, 30-day, All-Cause Unplanned Readmission (HWR) for MIPS Eligible Clinician Groups | Administrative Claims (CMS-calculated) | **Outcome\*** |
| 484 | Clinician & Clinician Group Risk-standardized Hospital Admission Rates for Patients with Multiple Chronic Conditions | Administrative Claims (CMS-calculated) | **Outcome\*** |
| 001 | Diabetes: Glycemic Status Assessment Greater Than 9% (inverse) | eCQMs / MIPS CQMs / Medicare CQMs / **Medicare eCQMs** | **Intermediate outcome\*** |
| 134 | Preventive Care and Screening: Screening for Depression and Follow-up Plan | eCQMs / MIPS CQMs / Medicare CQMs / **Medicare eCQMs** | Process |
| 236 | Controlling High Blood Pressure | eCQMs / MIPS CQMs / Medicare CQMs / **Medicare eCQMs** | **Intermediate outcome\*** |
| 112 | Breast Cancer Screening | eCQMs / MIPS CQMs / Medicare CQMs / **Medicare eCQMs** | Process |
| 113 | Colorectal Cancer Screening | eCQMs / MIPS CQMs / Medicare CQMs / **Medicare eCQMs** | Process |

\* The 4 measures flagged "outcome" for purposes of the eCQM/MIPS CQM reporting incentive and
the alternative quality performance standard (Table B-G5 footnote, 91 FR 44055).

Also proposed: **measure specification changes** to 001 (eCQM collection type only), 134, and 479
(91 FR 44054; Table Group D of Appendix 1). Reason given for removing 305 and 493: "operational
issues impacting the development of the collection types that were finalized in the CY 2025 PFS
final rule for these two measures" (91 FR 44150).

### 3. Collection types available to MSSP ACOs for APP Plus

| Collection type | PY 2025 | PY 2026 | PY 2027 current law | PY 2027 proposed |
|---|---|---|---|---|
| eCQMs (all-payer/all-patient) | yes | yes | yes | yes |
| MIPS CQMs (all-payer/all-patient) | yes | yes | **no** (sunset after PY 2026 per CY 2025 FR, 89 FR 98123) | **yes** (extended; anticipated sunset PY 2030) |
| Medicare CQMs (MSSP-only, claims-defined Medicare population) | yes | yes | yes | yes (anticipated sunset PY 2030) |
| **Medicare eCQMs (new, MSSP-only)** | — | — | — | **yes, new for PY 2027+** |
| FHIR-based dQMs / "Medicare dQMs" | — | — | — | RFI only: optional PY 2028–2029, mandatory PY 2030 (future rulemaking) |

ACOs may report the five Medicare eCQMs **or any combination** of eCQMs / MIPS CQMs /
Medicare CQMs / Medicare eCQMs to satisfy §425.510(b) and §425.512(a)(5) (91 FR 44050).

MIPS CQM uptake data CMS cites for the extension (91 FR 44039):

| PY | ACOs reporting ≥1 MIPS CQM / financially reconciled ACOs |
|---|---|
| 2023 | 33 / 453 |
| 2024 | 36 / 476 |
| 2025 (initial submission data) | **140 / 472** |

### 4. Benchmark treatment for Medicare CQMs and Medicare eCQMs

| Collection type | Rule | Applies from | Status | Reg cite |
|---|---|---|---|---|
| Medicare CQMs | Performance-period benchmarks | PY 2024–2025 | Current law | CY 2024 FR, 88 FR 79110 |
| Medicare CQMs | **Flat** benchmarks, but only for a measure's **first two performance periods** in MIPS | CY 2025 perf. period / 2027 MIPS payment year | Current law | §414.1380(b)(1)(ii)(F); 89 FR 98120 |
| Medicare CQMs | Historical benchmarks once baseline data available (i.e., 3rd+ performance period) | PY 2026+ | Current law | §414.1380(b)(1)(ii); 89 FR 98120 |
| Medicare CQMs | **Flat benchmarks for ALL measures, no 2-period limit** | **CY 2026 performance period / 2028 MIPS payment year** (i.e., applied *retroactively* to PY 2026) | **PROPOSED** | new §414.1380(b)(1)(ii)(F)(2), 91 FR 44283 |
| **Medicare eCQMs** | **Flat benchmarks** | **CY 2027 performance period / 2029 MIPS payment year** | **PROPOSED** | new §414.1380(b)(1)(ii)(G)(1), 91 FR 44283 |

Note on "from which year": the *preamble* narrative is inconsistent — §III.G.3.c says flat
benchmarks for "PY 2027 and subsequent PYs, and for Quality IDs 001, 134, and 236 for PY 2026"
(91 FR 44040–44042), while §IV.B.1.c.(1) says "extending the use of flat benchmarks to score all
Medicare CQMs for performance year 2025 and subsequent performance years" (91 FR 44205). The
**operative proposed regulation text** is unambiguous: (F)(1) keeps the 2-period rule for CY 2025,
and (F)(2) makes flat benchmarks apply to all Medicare CQM measures **beginning CY 2026**. Net
effect: all five Medicare CQMs in APP Plus (001, 112, 113, 134, 236) are flat-benchmarked for
PY 2026 and every subsequent PY.

CMS invokes §1871(e)(1)(A) of the Act ("contrary to the public interest") to justify retroactivity,
because PY 2026 quality scoring happens during 2027 (91 FR 44042).

**What actually changes for PY 2026** (verified against the *published* PY 2026 benchmark file, S5):

| Measure (Medicare CQM) | PY 2025 published benchmark (S6) | PY 2026 published benchmark (S5) — current law | Under the proposal |
|---|---|---|---|
| 001 (inverse) | flat (top decile ≤ 10.00) | **data-driven**: top decile ≤ 7.03; avg perf 25.78 | → flat (top decile ≤ 10.00) |
| 112 | flat (top decile ≥ 90.00) | flat (top decile ≥ 90.00) | unchanged |
| 113 | (not in PY 2025 set) | flat (top decile ≥ 90.00) | unchanged |
| 134 | flat (top decile ≥ 90.00) | **data-driven**: top decile ≥ 92.34; avg perf 62.87 | → flat (top decile ≥ 90.00) |
| 236 | flat (top decile ≥ 90.00) | **data-driven**: top decile ≥ 82.81; avg perf 67.87 | → flat (top decile ≥ 90.00) |

(Caveat: the QPP CSV's "Benchmark Type" column labels *all* of these rows "Historical"; the
distinction above is read off the actual decile cut points, which for 112/113 are exactly the
flat-benchmark ranges. Measure IDs appear in the CSV as `001SSP`, `112SSP`, etc.)

**Flat benchmark decile tables** (Tables B-G3 / B-G4, 91 FR 44043–44044; identical to the
published PY 2025 Medicare CQM deciles in S6):

| Decile | Non-inverse (e.g., 236, 112, 113, 134) | Inverse (only 001) |
|---|---|---|
| 1 | 1.00 – 9.99 | 99.00 – 90.01 |
| 2 | 10.00 – 19.99 | 90.00 – 80.01 |
| 3 | 20.00 – 29.99 | 80.00 – 70.01 |
| 4 | 30.00 – 39.99 | 70.00 – 60.01 |
| 5 | 40.00 – 49.99 | 60.00 – 50.01 |
| 6 | 50.00 – 59.99 | 50.00 – 40.01 |
| 7 | 60.00 – 69.99 | 40.00 – 30.01 |
| 8 | 70.00 – 79.99 | 30.00 – 20.01 |
| 9 | 80.00 – 89.99 | 20.00 – 10.01 |
| 10 | ≥ 90.00 | ≤ 10.00 |

CMS's own impact estimates for flat benchmarks (both from internal PY 2024 analyses, 91 FR 44041–44042):

| Analysis | Effect |
|---|---|
| ACOs that reported all three Medicare CQMs in the APP set with performance-based benchmarks, PY 2024, simulated with flat benchmarks | average quality score **+11 percentage points** |
| 13 ACOs that earned population-and-income-adjustment bonus points and reported only Medicare CQMs, PY 2024 | flat benchmarks worth **+14 pp** vs. **+4 pp** from the population/income adjustment — a **10 pp** difference |

### 5. Medicare eCQMs — the new collection type

| Attribute | Proposed value | Cite |
|---|---|---|
| Full name | Medicare Electronic Clinical Quality Measures for ACOs Participating in the Medicare Shared Savings Program | §414.1305 "collection type", 91 FR 44154–44155 |
| First performance year | **PY 2027** (CY 2027 performance period / 2029 MIPS payment year) | 91 FR 44048, 44283 |
| Who may use it | MSSP ACOs only, reporting APP Plus | 91 FR 44049 |
| Population | eCQM measure specifications applied **only to the ACO's assigned beneficiaries** (not all-payer/all-patient) | 91 FR 44048–44049 |
| New §425.20 definition | "Beneficiary eligible for Medicare eCQMs" = a beneficiary **assigned to the ACO under subpart E** | 91 FR 44288 |
| Reporting mechanics | End-to-end electronic, same eCQM specs, but **unique measure identifiers** must be included in submission files starting PY 2027 | 91 FR 44050 |
| Data submission criteria | new §414.1335(a)(5)(i) — report the Medicare eCQMs in APP Plus + administer CAHPS for MIPS | 91 FR 44282 |
| Data completeness | **75%** of the ACO's applicable beneficiaries eligible for the Medicare eCQM who meet the denominator, for MIPS payment year 2029 and later | new §414.1340(e)(1), 91 FR 44283 |
| Benchmarks | **Flat**, from CY 2027 performance period / 2029 MIPS payment year | new §414.1380(b)(1)(ii)(G)(1), 91 FR 44283 |
| eCQM/MIPS CQM reporting incentive | **NOT eligible** ("we are not proposing to add Medicare eCQMs to the eCQM/MIPS CQM reporting incentive described at §425.512(a)(5)(i)(B)(2)") | 91 FR 44050 |
| Complex Organization Adjustment | **NOT eligible** ("we are also not proposing to add Medicare eCQMs to the Complex Organization Adjustment described at §414.1380(b)(1)(vii)(C)") | 91 FR 44050 |
| Counts toward CEHRT requirement | **Yes** — reporting ≥1 of the 5 ACO-reported measures via eCQMs *or Medicare eCQMs* satisfies proposed CEHRT option 1 | S1; 91 FR 44057+ |
| Support from CMS | Quarterly list of beneficiaries eligible for Medicare eCQMs via the ACO-MS Data Hub, starting Q1 of PY 2027; Q4 list may serve as the final list; **use of the list is not required** | 91 FR 44049–44050 |

Related: the definition of **"beneficiary eligible for Medicare CQMs"** would also be changed for
**PY 2027+** to simply "a beneficiary that is assigned to the ACO under subpart E" — i.e., the
*assigned* population rather than the (broader) *assignable* population used for PY 2025–2026
(§425.20, 91 FR 44051–44052, 44288). CMS previously measured an average **85%** overlap between
the PY 2024 Medicare-CQM-eligible list and the assignable list (90 FR 49799, cited at 91 FR 44051).
§425.702(c)(1)(iii) (the special aggregate-report authority) would be limited to PY 2024–2026 and
effectively sunset for PY 2027+, since the list would then be the ordinary assigned-beneficiary list.

### 6. eCQM/MIPS CQM reporting incentive ("deeming") — current vs. proposed

| Element | Current law | Proposed |
|---|---|---|
| eCQM leg | PY 2025 **and subsequent PYs** (CY 2025 FR) — already open-ended | unchanged |
| MIPS CQM leg | **PY 2025 and PY 2026 only** (§425.512(a)(5)(i)(C)) | **PY 2027 and subsequent PYs**; achieved by amending §425.512(a)(5)(i)(B) to read "For performance year 2025 and subsequent performance years" and **removing** §425.512(a)(5)(i)(C) (91 FR 44039, 44290) |
| Medicare CQMs | not eligible | still not eligible |
| Medicare eCQMs | n/a | **not** eligible |
| Anticipated sunset of the MIPS CQM incentive | — | PY 2028 (start of the FHIR transition period), subject to future rulemaking (91 FR 44039) |

Qualifying criteria (unchanged in substance; restated for PY 2027+ at 91 FR 44039 and Table B-G6):
report **all** eCQMs/MIPS CQMs in APP Plus, meet §414.1340 data completeness on all of them, **and**
score ≥ **10th percentile** of the performance benchmark on ≥1 of the **4 outcome measures**, **and**
score ≥ **40th percentile** of the performance benchmark on ≥1 of the **remaining 7 measures**.

CMS impact data: for PY 2024, **26 ACOs** reported MIPS CQMs and met the quality performance
standard *only* because of the MIPS CQM reporting incentive — they did not reach the 40th-percentile
MIPS quality performance category score (91 FR 44039).

### 7. Quality performance standard (QPS) — what does and does not change

| Element | Current law | Proposed for PY 2027+ |
|---|---|---|
| Main pathway | Quality score ≥ **40th percentile** of all MIPS quality performance category scores, excluding facility-based scoring | **unchanged** |
| 40th-percentile methodology | Rolling 3-PY average of historical submission-level 40th-percentile scores with a 1-PY lag | **unchanged** (no proposal to alter) |
| PY 2026 value | **73.85** = (77.73 + 74.54 + 69.27) ÷ 3, using PY 2022 / 2023 / 2024 | current law; PY 2027 value not yet published |
| Reporting-incentive pathway | see §6 above | MIPS CQM leg extended |
| First-year-ACO pathway (§425.512(a)(2)(iv)) | Report APP Plus, meet data completeness on the 5 eCQMs/MIPS CQMs/Medicare CQMs, administer CAHPS, receive a MIPS quality score | **Medicare eCQMs added** to the list of qualifying collection types |
| Alternative QPS (sliding scale) | ≥ **10th percentile** of the performance benchmark on ≥1 of the 4 outcome measures; available regardless of collection type | **unchanged** |
| Failure condition | ACO reports **none** of the 5 ACO-reported measures **and** does not administer CAHPS (absent a sampling exception at §414.1380(b)(1)(vii)(B)) → no shared savings; ENHANCED owes maximum losses | **unchanged**, but the measure list gains Medicare eCQMs (§425.512(a)(5)(iii)(C)) |
| EUC relief | §425.512(c) policies (expanded to cyberattacks by CY 2026 FR, PY 2025+) | **no change proposed** |
| Health equity adjustment / "population and income adjustment" to the quality score | **Removed beginning PY 2026** (CY 2026 FR, 90 FR 49815) | no change; CMS cites its removal as a reason to broaden flat benchmarks |
| Complex Organization Adjustment | §414.1380(b)(1)(vii)(C), from CY 2025 perf. period / 2027 MIPS payment year: **+1 measure achievement point per submitted eCQM** meeting case minimum and data completeness; ≤10 points per measure; total capped at **10%** of total available measure achievement points; **eCQMs only** | **no change proposed**; explicitly **not** extended to Medicare eCQMs (or Medicare CQMs) |

Table B-G6 (91 FR 44056) is the authoritative PY 2027 summary; its content is reproduced by the
three-pathway structure above and matches the PY 2026 memo (S4) except for the addition of
Medicare eCQMs and the MIPS CQM extension.

### 8. §425.512(a)(7) — scoring when APP Plus measures are excluded or lack a benchmark

| | Current law (PY 2024–2026) | Proposed (PY 2027+) |
|---|---|---|
| Trigger A: measure(s) excluded from MIPS under §414.1380(b)(1)(vii)(A) | Applies if **≥1** measure is excluded | Applies **only if the ACO's MIPS quality performance category score is calculated on fewer than five measures** — i.e., **≥4 of the 8** APP Plus measures excluded |
| Trigger B: measure lacks a benchmark under §414.1380(b)(1)(i)(A) | Applies if **≥1** required measure lacks a benchmark | **Trigger removed entirely** |
| Relief when triggered | Use the **higher** of the ACO's quality score or the 40th-percentile-equivalent MIPS quality performance category score | same relief, new trigger (new §425.512(a)(7)(iii)) |
| Case-minimum failures | (not a trigger) | Explicitly **not** a trigger; also, unscored measures must **not** have had total measure achievement points reduced under §414.1380(b)(1)(iii) |
| Mechanics | — | §425.512(a)(7)(ii) narrowed to "performance years 2025 and 2026"; new (a)(7)(iii) added |

CMS rationale: with 8 measures, each of a 5-measure minimum contributes a "reasonable weight (20
percent)"; and CMS notes that **no** eCQM, MIPS CQM, or Medicare CQM reported by ACOs in the past
four PYs has lacked a benchmark (91 FR 44052–44053). Two worked examples are given at 91 FR 44053.

### 9. New §425.508(c) — TIN exclusions and the 95% floor (applies from **PY 2026**, retroactively)

| Element | Proposed rule |
|---|---|
| Effective | PYs beginning on or after **January 1, 2026** (retroactive under §1871(e)(1)(A)) |
| What it allows | Exclude one or more ACO participant TINs from the ACO's submission of eCQM / MIPS CQM / Medicare CQM / Medicare eCQM data, **per measure** |
| Allowed reasons (§425.508(c)(1)) | (i) unforeseen circumstances outside the ACO's control (e.g., unexpected practice closure); (ii) the TIN's CEHRT is specialty-purpose and doesn't support APP Plus measures (e.g., ophthalmology); (iii) other circumstances as determined by CMS |
| Prohibited reasons (§425.508(c)(2)) | beneficiary demographics; beneficiary health status; estimated impact of the TIN on the ACO's quality performance |
| Floor (§425.508(c)(3)) | Retained TINs must represent **≥ 95%** of beneficiaries **assigned** to the ACO, **before** applying measure specifications, **measure by measure** |
| 95% denominator | ALL assigned beneficiaries, including those with no eligible primary care claim; numerator excludes beneficiaries without an eligible primary care claim during the PY |
| Data completeness still applies | Yes — **75%** of applicable beneficiaries meeting the denominator, assessed at ACO level on the submitted data (§414.1340) |
| New CMS report | Beneficiary-TIN-level aggregate report via ACO-MS Data Hub, **Q3 and Q4** of each PY beginning **PY 2026**; the **Q4** report is the definitive source |
| Audit (§425.508(c)(4)) | CMS may audit/validate and request exclusion documentation; failures may trigger §425.216 / §425.218 compliance actions |

### 10. QP / Partial QP determinations (Advanced APM track)

**Proposed structural change — TIN/NPI-level QP status.**

| | Current law | Proposed |
|---|---|---|
| Level at which QP status is applied | Determined mostly at APM Entity level but **applied at the NPI level** — QP status attaches to *all* of a clinician's TIN/NPI relationships (81 FR 77440) | Applied **strictly at the TIN/NPI level** ("eligible clinician" as defined at §414.1305) — QP status attaches **only at the TIN(s) participating with the APM Entity in the Advanced APM** |
| Effective | — | **Beginning in the 2027 QP Performance Period** (→ 2029 payment year), new §414.1425(c)(8) and (d)(5), 91 FR 44285 |
| Consequences | QP conversion factor and APM Incentive Payment flow to all of the NPI's TINs | QP conversion factor / APM Incentive Payment apply only to claims at participating TIN(s); a clinician can be a QP at one TIN and MIPS-eligible at another; Partial QP MIPS opt-in/opt-out also becomes TIN/NPI-scoped |
| Multi-entity tie-break | §414.1435(h)(2): CMS assigns the score yielding the greater QP status | preserved — individual-level QP → status at each participating TIN; APM-Entity-level QP → status only at TINs tied to the qualifying Entity/Entities |

**QP / Partial QP thresholds** — proposed §414.1430 restructuring (91 FR 44285–44286). These are
conforming codifications of statute (CAA 2024 and CAA 2026), **not** discretionary CMS policy.
Note the performance-period ↔ payment-year lag (payment year = performance period + 2).

| Threshold (Medicare Option, §414.1430(a)) | PY 2019–2024 (pmt 2021–2026) | **perf. 2025 → pmt 2027** | **perf. 2026 → pmt 2028** | **perf. 2027+ → pmt 2029+** |
|---|---|---|---|---|
| QP payment amount | 50% | **75%** | **50%** | **75%** |
| Partial QP payment amount | 40% | 50% | 40% | 50% |
| QP patient count | 35% | **50%** | **35%** | **50%** |
| Partial QP patient count | 25% | 35% | 25% | 35% |

All-Payer Combination Option (§414.1430(b)) mirrors these values, with the same 2027/2028/2029+
pattern. For payment year 2026 the rule also restates the minimum Medicare Option thresholds
required to use the All-Payer option: **25%** payment amount or **20%** patient count for QP;
**20%** payment amount or **10%** patient count for Partial QP (91 FR 44219).

**Other Advanced APM proposals** (91 FR 44217–44219):

| Item | Proposal |
|---|---|
| APM Incentive Payment | Codify CAA 2026 extension: **3.1%** for **payment year 2028** (computed on covered professional services furnished in CY 2027). Existing: 5% (2019–2024), 3.5% (2025), 1.88% (2026), none for 2027 |
| §414.1305 "APM Incentive Payment" definition | Drop the hard-coded 2019–2024 years; cross-reference §414.1450(b)(1) instead |
| §414.1425(c)(5)(ii) | Remove the clause ", even if such termination date occurs within such QP Performance Period" (called a 2019 clerical error) |
| APMs without a Participation List | Clarify that APMs for which a participation list is not operationally practicable are excluded from MIPS scoring and QP determinations |

### 11. Other CMS-1848-P provisions that change what a PY 2027 simulator must model

**Shared Savings Program CEHRT use requirement (proposed, PY 2027 onward)** — replaces the current
requirement that ACOs report all MIPS Promoting Interoperability measures/activities. ACOs would
instead complete **one** of three activities (S1; 91 FR 44057–44063):

1. Completely report ≥1 of the five ACO-reported APP Plus measures via the **eCQMs or Medicare eCQMs** collection type; **or**
2. Use CEHRT to support complete reporting of ≥1 of the five ACO-reported measures **and** attest to using an HL7® FHIR®-based API via a certified Health IT Module; **or**
3. Attest to one of three new ACO-specific CEHRT use metrics: (A) ACO Electronic Prescribing — ≥1 e-prescription per participating TIN (TINs with <100 permissible prescriptions in the PY excepted); (B) ACO Health Information Exchange — ≥1 provider per TIN in bi-directional HIE for ≥1 patient; (C) ACO Provider to Patient Exchange — ≥1 provider per TIN gave ≥1 patient electronic access.

TIN-level exclusions may be self-applied (special status / hardship) with documentation retained for
audit. Public reporting requirement replaced by reporting which activity the ACO elected. Confirmed
to have **no impact on Shared Savings Program quality or MIPS scoring** (§III.G.4.b.(6)).

**Financial methodology (proposed)** — S1; 91 FR 44066+:

| Change | From | To | Applies |
|---|---|---|---|
| BASIC Level E shared savings rate | 50% | **60%** | (ENHANCED remains 75%) |
| ENHANCED max positive regional adjustment weight | 50% | **35%** | ACOs lower-spending than region |
| Prior savings adjustment scaling factor | 50% | **75%** | |
| 5% cap on upward benchmark adjustments | flat 5% | **risk-adjusted** for severity/case mix | |
| New "growth adjustment" to historical benchmark | — | stacks on the highest of regional/prior-savings/population adjustment, subject to the risk-adjusted 5% cap | |
| ACPT guardrail | none | ACPT no more than **1.0 pp below** / **1.5 pp above** national growth | agreement periods starting 2027-01-01+ |
| ACPT lower guardrail, retroactive | — | 1.0 pp below national growth | 2024/2025/2026 start dates, from **PY 2025** reconciliation forward |
| PY 2025 financial reconciliation | normal timing | **delayed to November 2026** so the ACPT proposal can be applied if finalized | |
| ACPT annualized growth rates | per agreement period | per performance year | agreement periods starting 2027-01-01+ |
| Prepaid shared savings | available | **removed**; no new cohorts after the 2027-01-01 application cycle; payments run through 2027-12-31 | |
| Part B cost-sharing support | — | ACOs may reduce/eliminate Part B cost sharing under an approved plan (excludes DMEPOS and drugs); applications early 2027, effective **2027-04-01** | |
| Advance investment payments | risk-score-based (ADI) | **$45/quarter** per LIS/dual/rural-county beneficiary; **$25/quarter** for others, capped at 10,000 beneficiaries | PY 2028+ |
| Beneficiary notification | tied to first primary care visit; plus follow-up communication | once per agreement period, by **May 30** unless CMS specifies later; follow-up removed | effective **2027-01-01** |
| "Experienced with performance-based risk" | includes TINs in reconciliation | excludes TINs with no written participation agreement ("Legacy" TINs) | effective **2027-01-01** |

**Assignment (proposed)** — exclude non-ACO-TIN primary care allowed charges by ACO professionals;
modify Medicare-enrollment-based eligibility criteria — both **PY 2028+**. Primary care service
definition additions (SBIRT, Vaccine Adverse Effects Management, Advance Care Planning codes) —
**PY 2027+**. G2211 replaced by modifiers MOD1/MOD2 with differential payment for ACO participants.

**Already-final items that first bite in PY 2027 (current law, not proposed here):** CAHPS for MIPS
survey administration moves from mail-phone to **web-mail-phone** beginning PY 2027 (CY 2026 FR, S9).

**FHIR/dQM roadmap (RFI only — no binding proposal)** — Table B-G2 (91 FR 44038) and §IV.A.4.c:

| Period | Reporting options | Benchmarks |
|---|---|---|
| PY 2028–2029 (2-yr transition) | FHIR dQMs and "Medicare dQMs" **plus** eCQMs, MIPS CQMs, Medicare CQMs, Medicare eCQMs | Medicare CQMs & Medicare eCQMs: flat (proposed). All other non-FHIR: per §414.1380(b)(1)(ii). FHIR dQM benchmarks TBD by future rulemaking. CMS anticipates **sunsetting the MIPS CQM reporting incentive** at the start of PY 2028 |
| PY 2030+ | FHIR-based dQM reporting **mandatory** for applicable measures (the 5 eCQMs and Medicare eCQMs in APP Plus) | TBD by future rulemaking. CMS anticipates sunsetting **MIPS CQMs** and **Medicare CQMs** (and their flat benchmarks) beginning PY 2030 |

CMS posted draft FHIR digital specifications for 49 eligible-clinician dQMs (including all 5 APP Plus
ACO-reported measures) for comment 2026-01-21 through 2026-02-23.

---

## Caveats / gaps

1. **Everything is proposed.** The 60-day comment period closes 2026-09-14 and a final rule is
   expected ~November 2026. Any of these provisions may be modified, delayed, or dropped. The
   retroactive PY 2026 items (flat benchmarks for 001/134/236; §425.508(c) TIN exclusions) are
   especially uncertain because they depend on CMS sustaining a §1871(e)(1)(A) public-interest
   finding.
2. **PY 2027 benchmark values are not published.** `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2027`
   returned HTTP 500 on 2026-08-07. Historically PY benchmarks post around January of the
   performance year. Only the *flat* benchmark deciles are knowable in advance.
3. **The PY 2027 40th-percentile MIPS quality performance category score is not published.** The
   PY 2026 value (73.85) is known (S4). PY 2027 would be the average of the PY 2023, 2024, and 2025
   40th-percentile values; PY 2023 = 74.54 and PY 2024 = 69.27 are published in S4, but the **PY 2025
   value is not public**, so PY 2027 cannot be computed yet. (Directionally, the two known components
   are trending downward.) I found no CMS memo for PY 2027 as of 2026-08-07.
4. **PY 2026 *published* flat benchmarks for 001/134/236 do not exist yet.** If the retroactive
   proposal is finalized, CMS would need to reissue/repoint those benchmarks; there is no published
   artifact for them today. Model them from the Table B-G3/B-G4 decile grids.
5. **Drafting errors in the proposed rule** (do not model these literally; expect correction):
   - The amendatory text for §414.1425(c)(5)(ii) at 91 FR 44285 **still contains** the clause
     ", even if such termination date occurs within such QP Performance Period" that the preamble
     (91 FR 44217–44218) says it is removing.
   - §414.1430(b)(2)(i)(D) as printed says "2029 and thereafter: 75 percent" for the All-Payer
     **Partial QP payment amount** threshold; the Medicare Option counterpart (a)(2)(v) says
     50 percent. 50% is almost certainly intended.
   - The preamble bullets at 91 FR 44219–44220 describing the §414.1430 revisions are internally
     garbled (duplicate paragraph designators, "for 2028 and later, the amount is 50 percent"). The
     amendatory regulation text at 91 FR 44285–44286 is the reliable version and is what the
     threshold table above uses.
   - The preamble restatement of the current PY 2025/2026 reporting-incentive criteria at 91 FR 44037
     has a truncated bullet ("and; of the performance benchmark on at least one of the remaining
     measures"); the correct wording (40th percentile) appears in the PY 2027+ restatement at
     91 FR 44039 and in Table B-G6.
   - The narrative at 91 FR 44205 says Medicare CQM flat benchmarks extend "for performance year
     2025 and subsequent performance years", contradicting the §III.G section and the operative
     reg text (CY 2026 onward). Treat the reg text as controlling.
6. **Tables are images.** In the Federal Register .txt (S2) all tables appear as
   `[GRAPHIC] [TIFF OMITTED]`. Table contents in this document were recovered by OCR of the govinfo
   PDF (S3) and cross-checked against prose and the fact sheet. OCR of Table B-G3 rendered decile 1
   as "<10.00"; the value used above (1.00 – 9.99) comes from the *published* PY 2025 flat benchmarks
   in S6, which is the authoritative rendering of the same grid. Table C-BC2 (the QPP-side APP/APP
   Plus measure table) and the RIA tables D-B11/D-B12/D-B13 were **not** OCR'd for this document.
7. **No proposed change** was found to: the 40th-percentile QPS methodology; the alternative quality
   performance standard; the Complex Organization Adjustment formula or duration; the MIPS 75% data
   completeness threshold; the extreme-and-uncontrollable-circumstances policies; or the CAHPS for
   MIPS measure's role in APP Plus. Absence is asserted from full-text searches of S2 for
   "Complex Organization" (5 hits, all descriptive), "40th percentile" (9 hits, all descriptive),
   "alternative quality performance standard", and "extreme and uncontrollable".
8. **Not verified independently:** CMS's internal analyses (the 11 pp / 14 pp / 10 pp flat-benchmark
   effects; the 26 ACOs saved by the MIPS CQM incentive in PY 2024; the 140/472 PY 2025 MIPS CQM
   submission count) are cited to unpublished CMS internal analyses and ACO interviews. They are
   reported here as CMS's claims, not as reproducible facts.
9. **Not examined:** the PY 2024 MSSP Performance Year Financial and Quality Results PUF and the ACO
   Participants file on data.cms.gov — out of scope for this document, which covers the proposed
   rule only.
