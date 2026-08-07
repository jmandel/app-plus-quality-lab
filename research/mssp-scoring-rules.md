# MSSP APP Plus Scoring and Settlement Rules — Current Law for PY2026

Independent ground-truth research file. Every number below is traced to a primary
source (eCFR regulation text, Federal Register rule text, or a CMS-published
document). Numbers that are **derived** by arithmetic rather than stated by CMS
are labeled as such. Numbers that could not be verified are in
[Caveats and gaps](#caveats-and-gaps).

**Retrieval date for all sources: 2026-08-07.**

Scope: current law (i.e. rules in force today) for **performance year 2026**.
The CY2027 PFS proposed rule (CMS-1848-P, published 2026-07-16) is *proposed*
only and is described in a separate section so it is never confused with
current law.

---

## Sources

| # | Source | URL | How fetched |
|---|---|---|---|
| S1 | 42 CFR Part 425 (Medicare Shared Savings Program), full part text | `https://www.ecfr.gov/api/versioner/v1/full/2026-08-05/title-42.xml?chapter=IV&subchapter=B&part=425` | eCFR Versioner API via curl. Date `2026-08-05` = title 42's most recent issue date as of retrieval (the API rejects `2026-08-07` as past the latest issue date). |
| S2 | 42 CFR Part 414 Subpart O (MIPS / Quality Payment Program) | `https://www.ecfr.gov/api/versioner/v1/full/2026-08-05/title-42.xml?chapter=IV&subchapter=B&part=414&subpart=O` | eCFR Versioner API via curl (required one retry; first attempt returned HTTP 503). |
| S3 | CMS fact sheet — CY2025 PFS final rule (CMS-1807-F), MSSP changes | `https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2025-medicare-physician-fee-schedule-final-rule-cms-1807-f-medicare-shared-savings` | curl with a browser User-Agent. **Note:** plain fetchers get HTTP 403 from cms.gov; a browser UA is required. |
| S4 | CMS fact sheet — CY2026 PFS final rule (CMS-1832-F), MSSP changes | `https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2026-medicare-physician-fee-schedule-final-rule-cms-1832-f-medicare-shared-savings` | curl with browser UA. |
| S5 | CMS fact sheet — CY2027 PFS **proposed** rule (CMS-1848-P), MSSP proposals | `https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2027-medicare-physician-fee-schedule-proposed-rule-cms-1848-p-medicare-shared` | curl with browser UA. |
| S6 | CMS memo — "Medicare Shared Savings Program Quality Performance Standard: Performance Year 2026 40th Percentile MIPS Quality Performance Category Score", December 2025 | `https://www.cms.gov/files/document/medicare-shared-savings-program-quality-performance-standard-performance-year-2026-40th-percentile.pdf` | curl with browser UA; 4-page PDF read directly. Mirror: `https://www.cms.gov/sites/default/files/2025-12/py2026_performance_score_40th_percentile.pdf` |
| S7 | QPP PY2026 quality benchmarks CSV | `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2026` | curl (no special headers needed). 450 rows. Extract saved to `research/data/app-plus-py2026-benchmarks.csv`. |
| S8 | Federal Register full text — CY2026 PFS final rule, 90 FR 49266 (2025-11-05), FR Doc 2025-19787 | `https://www.federalregister.gov/documents/full_text/text/2025/11/05/2025-19787.txt` | curl. **Note:** file contains bytes that make GNU grep treat it as binary — use `grep -a`. |
| S9 | Federal Register full text — CY2025 PFS final rule, 89 FR (2024-12-09), FR Doc 2024-25382 | `https://www.federalregister.gov/documents/full_text/text/2024/12/09/2024-25382.txt` | curl; `grep -a`. |
| S10 | CMS data.gov catalog + PY2026 MSSP ACO roster CSV | `https://data.cms.gov/data.json` → dataset "Accountable Care Organizations" → `https://data.cms.gov/sites/default/files/2026-04/358ddf60-c203-41ef-a0c6-a62a79f466ee/PY2026_Medicare_Shared_Savings_Program_Organizations.csv` | curl. 511 ACOs. |
| S11 | PY2024 MSSP Performance Year Financial and Quality Results PUF (revised 2026-07-17) | `https://data.cms.gov/data.json` → dataset "Performance Year Financial and Quality Results" → `https://data.cms.gov/sites/default/files/2026-07/fb6ba14b-3450-47c2-8ff5-d1f2a5bdb3e3/PY_Financial_and_Quality_Results_2024_revised%202026_07_17.csv` | curl. 476 ACOs. |

All URLs in the app's session notes were still live on 2026-08-07. The one
correction: the MSSP results PUF is catalogued as **"Performance Year Financial
and Quality Results"** (not a title containing "Shared Savings"), so a title
search for "Shared Savings" in `data.cms.gov/data.json` misses it.

---

## (a) The APP Plus measure set for PY2026

**8 measures total: 5 ACO-reported + 2 administrative claims + 1 CAHPS.**

Source: S3 Table 1 (phase-in schedule), confirmed measure-by-measure by S6
Table 1 ("APP Plus Quality Measure Set for PY 2026"), codified at 42 CFR
§ 414.1367(c)(1)(iii)(B) and § 425.512(a)(5)(i)(B) (S1, S2).

| Quality # | Measure | Collection type (PY2026) | Measure type | Outcome measure? |
|---|---|---|---|---|
| 001 | Diabetes: Glycemic Status Assessment Greater Than 9% | eCQM / MIPS CQM / Medicare CQM | Intermediate Outcome | **Yes** |
| 134 | Preventive Care and Screening: Screening for Depression and Follow-up Plan | eCQM / MIPS CQM / Medicare CQM | Process | No |
| 236 | Controlling High Blood Pressure | eCQM / MIPS CQM / Medicare CQM | Intermediate Outcome | **Yes** |
| 112 | Breast Cancer Screening | eCQM / MIPS CQM / Medicare CQM | Process | No |
| 113 | Colorectal Cancer Screening | eCQM / MIPS CQM / Medicare CQM | Process | No |
| 479 | Hospital-Wide, 30-day, All-Cause Unplanned Readmission (HWR) Rate for MIPS Eligible Clinician Groups | **Administrative claims** | Outcome | **Yes** |
| 484 | Clinician and Clinician Group Risk-standardized Hospital Admission Rates for Patients with Multiple Chronic Conditions (MCC) | **Administrative claims** | Outcome | **Yes** |
| 321 | CAHPS for MIPS Survey | CAHPS Survey Vendor | Patient Engagement/Experience | No |

- The **two administrative claims measures are 479 (HWR) and 484 (MCC)**. 484 is
  new in PY2026 (PY2025 had only 479) — S3 Table 1 phase-in column.
- **PY2026 is the last year MIPS CQMs are available** as a collection type under
  current law (S3; S6 p.1). PY2027+ is eCQM/Medicare CQM only under
  § 425.512(a)(5)(i)(C) — though the CY2027 proposed rule would extend MIPS CQMs
  (see below).
- ACOs must report **all** measures in the set annually (S3;
  § 414.1335(b)); administrative claims measures require no submission because
  CMS calculates them (§ 414.1325(a)(2)(i), quoted at S9 fn.537).
- Measures 305, 487, 493 are **not** in the PY2026 set. 487 was removed
  entirely by the CY2026 final rule (S4).
- CAHPS 321 is a single Quality ID composed of **9 summary survey measures
  (SSMs)** in the PY2026 benchmark file (S7). CMS describes the SSMs as
  "survey measures that contribute to Quality ID: 321" (S8).

### Total available measure achievement points

Each measure is scored on a 1–10 point scale (§ 414.1380(b)(1)(i), 1–10 from
the CY2023 performance period onward).

| Quantity | Value | Basis |
|---|---|---|
| Measures in APP Plus PY2026 | 8 | S6 ("at least one of the remaining **seven** measures" + 1 outcome = 8) |
| Points per measure | 10 | § 414.1380(b)(1)(i) |
| **Total available measure achievement points (all 8 scored)** | **80** | **Derived** (8 × 10) |
| CAHPS contribution to the denominator | 10 | § 414.1380(b)(1)(vii)(B): when a group registers for CAHPS but misses the sampling minimum, "the total available measure achievement points are **reduced by 10 points**" |

**Important:** the denominator is not fixed at 80. Under § 414.1367(c)(1)(i),
"each submitted measure that does not have a benchmark or meet the case minimum
requirement is **excluded** from … total measure achievement points and total
available measure achievement points" — it leaves *both* the numerator and the
denominator. See the PY2026 benchmark gap below, which drops many ACOs to a
60-point denominator.

### PY2026 benchmark availability — a consequential wrinkle

From S7 (PY2026 QPP benchmarks, retrieved 2026-08-07):

| Measure | eCQM | MIPS CQM | Medicare CQM |
|---|---|---|---|
| 001 | benchmark | benchmark | benchmark (`001SSP`) |
| 134 | benchmark | benchmark | benchmark (`134SSP`) |
| 236 | benchmark | benchmark | benchmark (`236SSP`) |
| **112** | **NO benchmark** | **NO benchmark** | benchmark (`112SSP`, flat) |
| **113** | **NO benchmark** | **NO benchmark** | benchmark (`113SSP`, flat) |

CMS's stated reason, verbatim from the CSV `Comments` column for 112 and 113:
> "Insufficient volume of data submitted in PY 2024 to establish historical benchmark."

This is consistent with S6 footnote 1, which says only "PY 2026 flat benchmarks
for Medicare CQMs (**Quality IDs 112 and 113 only**)" would be posted.

Consequences for an ACO reporting 112/113 via **eCQM or MIPS CQM** in PY2026:

1. Measures 112 and 113 are excluded from numerator and denominator
   (§ 414.1367(c)(1)(i)), so the denominator is **60 points**, not 80 (derived:
   6 scored measures × 10).
2. **§ 425.512(a)(7)(ii)(B) is triggered.** Verbatim: CMS "will use the higher of
   the ACO's quality score or the equivalent of the 40th percentile MIPS Quality
   performance category score" when the ACO reports all required measures and
   meets data completeness for each, and "**At least one of the required measures
   in the APP Plus quality measure set does not have a benchmark** as described
   at § 414.1380(b)(1)(i)(A)."

Effect: such an ACO is **floored at 73.85** — the PY2026 40th-percentile value —
which is exactly the quality performance standard. In other words, an
eCQM/MIPS CQM reporter that reports everything with 75% data completeness
appears to meet the QPS in PY2026 as a matter of law regardless of measured
performance. Corroboration that this is real and material: the CY2027 proposed
rule (S5) proposes that "the current scoring policy would **no longer apply**
when at least one of the required measures in the APP Plus quality measure set
does not have a benchmark for PY 2027 and subsequent PYs" — CMS is proposing to
close exactly this valve, prospectively.

Administrative claims measures 479 and 484 have no benchmarks in the PY2026 file
either, but that is expected timing, not a gap: per S6 fn.1 their benchmarks are
"posted following the submission period in Calendar Year 2027." Whether their
pre-performance absence also trips § 425.512(a)(7)(ii)(B) is not addressed by any
source found — see caveats.

---

## (b) The eCQM/MIPS CQM reporting incentive — exact conditions

**Direct answer to the question posed: YES.** The incentive requires, in
addition to the outcome-measure condition, that the ACO also score **at or above
the 40th percentile on at least one OTHER measure**. The two conditions are
joined by "and", not "or".

Citation: **42 CFR § 425.512(a)(5)(i)(B)(*2*)** (PY2025 and PY2026), verbatim
from S1:

> "If the ACO reports all of the eCQMs/MIPS CQMs in the APP Plus quality measure
> set applicable for a performance year, meeting the data completeness
> requirement at § 414.1340 of this subchapter for all eCQMs/MIPS CQMs, and
> achieving a quality performance score equivalent to or higher than the 10th
> percentile of the performance benchmark on at least one of the outcome
> measures in the APP Plus quality measure set **and** a quality performance
> score equivalent to or higher than the 40th percentile of the performance
> benchmark on at least one of the remaining measures in the APP Plus quality
> measure set."

CMS restates it the same way in plain language (S6 p.1–2):

> "**For ACOs that report the five eCQMs/MIPS CQMs and meet the MIPS data
> completeness requirement for all five measures:** Meet the eCQM/MIPS CQM
> reporting incentive by achieving a quality performance score equivalent to or
> higher than the 10th percentile of the performance benchmark on at least one of
> the four outcome measures in the APP Plus quality measure set **and** a quality
> performance score equivalent to or higher than the 40th percentile of the
> performance benchmark on at least one of the remaining seven measures in the
> APP Plus quality measure set."

### Conditions, itemized

| # | Condition | Value / detail | Citation |
|---|---|---|---|
| 1 | Report **all five** eCQMs/MIPS CQMs in the APP Plus set | 001, 112, 113, 134, 236 | § 425.512(a)(5)(i)(B)(*2*); S6 |
| 2 | Meet data completeness on all five | **75%** of denominator-eligible patients, all payers | § 414.1340(a)(4) — 75% applies to MIPS payment years 2026–2030; PY2026 performance → 2028 payment year |
| 3 | ≥ **10th percentile** of the performance benchmark on ≥1 of the **four outcome measures** | outcome measures = 001, 236, 479, 484 | § 425.512(a)(5)(i)(B)(*2*); S6 Table 1 |
| 4 | **AND** ≥ **40th percentile** of the performance benchmark on ≥1 of the **remaining seven** measures | i.e. any other APP Plus measure | § 425.512(a)(5)(i)(B)(*2*); S6 |
| — | Collection type eligibility | **eCQM or MIPS CQM only.** Medicare CQM reporters are NOT eligible for this incentive. | S6 p.3: "only ACOs that submit quality performance data on the five eCQMs/MIPS CQMs are eligible for the eCQM/MIPS CQM reporting incentive" |

### Can administrative claims measures satisfy the outcome condition?

**Yes.** S6 Table 1 marks measures **479 and 484 (both Administrative Claims)**
with measure type "Outcome^", and footnotes the caret:

> "^ Indicates this is an outcome measure for purposes of qualifying for the
> eCQM/MIPS CQM reporting incentive and the alternative quality performance
> standard."

The four outcome measures are therefore **001, 236 (Intermediate Outcome^) and
479, 484 (Outcome^)**. Two of the four are administrative claims measures that
the ACO does not submit at all — CMS calculates them. The regulation's language
("at least one of the outcome measures in the APP Plus quality measure set")
contains no collection-type restriction, consistent with this reading.

### What the incentive buys

Meeting it **is** meeting the quality performance standard — it is one of the
three pathways to the QPS, not a separate bonus. Per S8: "Meeting the criteria
for the eCQM/MIPS CQM incentive allows an ACO to meet the quality performance
standard and be eligible to receive maximum shared savings and avoid maximum
shared losses (if applicable)."

### Percentile → decile mapping

MIPS benchmarks are published as 10 deciles (S7). Decile *N* spans percentiles
(N−1)×10 to N×10. So:

- "≥ 10th percentile of the performance benchmark" = reaching at least **Decile 2**.
- "≥ 40th percentile of the performance benchmark" = reaching at least **Decile 5**.

This is directly verifiable from the PY2026 **flat** benchmarks, where the
performance rate equals the percentile by construction: for `112SSP` and
`113SSP`, Decile 2 = "10.00 – 19.99" and Decile 5 = "40.00 – 49.99" (S7). S6
also uses the phrase "the CAHPS for MIPS **40th percentile decile score**",
confirming percentile↔decile equivalence.

Selected PY2026 decile thresholds (full extract in
`research/data/app-plus-py2026-benchmarks.csv`; measures 001 is **inverse** —
lower rate is better):

| Measure | Collection | Decile 2 (10th pctile) | Decile 5 (40th pctile) |
|---|---|---|---|
| 001 (inverse) | eCQM | 93.98 – 71.69 | 36.72 – 29.54 |
| 001 (inverse) | Medicare CQM | 49.19 – 38.29 | 25.93 – 22.28 |
| 134 | eCQM | 2.70 – 11.41 | 31.79 – 42.68 |
| 134 | Medicare CQM | 32.51 – 45.66 | 59.27 – 65.55 |
| 236 | eCQM | 45.28 – 55.55 | 65.61 – 68.97 |
| 236 | Medicare CQM | 44.87 – 62.32 | 70.15 – 72.53 |
| 112 / 113 | Medicare CQM (flat) | 10.00 – 19.99 | 40.00 – 49.99 |
| 112 / 113 | eCQM, MIPS CQM | *no benchmark* | *no benchmark* |

---

## (c) Complex Organization Adjustment (CoA)

Codified at **42 CFR § 414.1380(b)(1)(vii)(C)**, effective beginning the CY2025
performance period / 2027 MIPS payment year. Verbatim (S2):

> "Beginning in the CY 2025 performance period/2027 MIPS payment year, a Virtual
> Group and an APM Entity receives one measure achievement point for each **eCQM**
> submitted that meets the case minimum requirement at paragraph (b)(1)(iii) of
> this section and the data completeness requirement at § 414.1340. Each measure
> may not exceed 10 measure achievement points. The total adjustment to the
> Virtual Group or APM Entity's quality performance category score under this
> paragraph (b)(1)(vii)(C) may not exceed 10 percent of the total available
> measure achievement points."

| Mechanic | Value | Citation |
|---|---|---|
| Award | **+1 measure achievement point per submitted eCQM** meeting case minimum **and** data completeness | § 414.1380(b)(1)(vii)(C) |
| Collection types that earn it | **eCQM only** — not MIPS CQM, not Medicare CQM | § 414.1380(b)(1)(vii)(C) (text says "each eCQM submitted") |
| Per-measure ceiling | a measure may not exceed **10** measure achievement points after the adjustment | § 414.1380(b)(1)(vii)(C) |
| Numerator ceiling | total achievement points (numerator) may not exceed total available points (denominator) | S3; S8 |
| Overall cap | **10% of total available measure achievement points** | § 414.1380(b)(1)(vii)(C) |
| Applied at | individual measure level, added per measure submitted | S3 |
| Where it lands | added into the numerator of the quality performance category score | § 414.1380(b)(1)(vii) |

### What the cap equals for APP Plus PY2026

| Scenario | Denominator | 10% cap | Max eCQMs | **Binding limit** |
|---|---|---|---|---|
| All 8 measures scored | 80 pts *(derived)* | **8 pts** *(derived)* | 5 | **5 pts** (eCQM count) |
| 112/113 excluded for no benchmark (eCQM/MIPS CQM reporters) | 60 pts *(derived)* | **6 pts** *(derived)* | 5 (or 3 — see caveats) | **5 pts or 3 pts** |

**CMS states the operative number explicitly** (S8, CY2026 PFS final rule,
responding to a comment asking that the cap be raised to 10 points):

> "ACOs that report eCQMs will receive the Complex Organization Adjustment to
> their MIPS quality performance category score on up to four measures (that is,
> four points) in performance year 2025, **5 measures (that is, 5 points) in
> performance year 2026**, and 6 measures (that is, 6 points) in performance year
> 2027, if each eCQM meets the case minimum requirement at § 414.1380(b)(1)(iii)
> and the data completeness requirement at § 414.1340."

So in PY2026 the **10% cap is not the binding constraint** — the number of eCQMs
(5) is. The 10% cap would only bind if the denominator fell below 50 points,
i.e. if 3 or more of the 8 measures were excluded for lacking a benchmark or
case minimum (derived: 10% × 50 = 5).

Magnitude in score terms (derived): +5 points on an 80-point denominator =
**+6.25 percentage points** on the quality performance category score; on a
60-point denominator = **+8.33 percentage points**.

CMS declined to raise the cap, stating (S8, quoting 89 FR 98438) that capping it
at 10% of total achievable points "will serve to help these participants overcome
barriers to eCQM reporting while reducing scoring inflation."

---

## (d) Quality performance standard, and what failing it costs

### The standard

**QPS = a quality score at or above the equivalent of the 40th percentile MIPS
Quality performance category score**, across all MIPS Quality performance
category scores, excluding entities/providers eligible for facility-based
scoring. § 425.512(a)(5)(i)(B)(*1*).

**The PY2026 value is 73.85.** From S6 p.3, verbatim:

> "The 40th percentile MIPS quality performance category score used for the PY
> 2026 quality performance standard is **73.85**."

Computed by CMS as a rolling 3-year average with a one-performance-year lag:

| Input year | 40th percentile MIPS quality score |
|---|---|
| PY2022 | 77.73 |
| PY2023 | 74.54 |
| PY2024 | 69.27 |
| Sum | 221.54 |
| **÷ 3 = PY2026 standard** | **73.85** |

(PY2025 is excluded "due to the one-performance year lag" — S6.)

### Three pathways to meet the QPS in PY2026

1. Quality score ≥ 73.85 (§ 425.512(a)(5)(i)(B)(*1*)).
2. The eCQM/MIPS CQM reporting incentive — section (b) above
   (§ 425.512(a)(5)(i)(B)(*2*)).
3. First performance year of an ACO's first agreement period: report the set,
   meet data completeness on the five clinical measures, administer CAHPS, and
   receive a MIPS Quality score (§ 425.512(a)(2)(iii)).

Plus the § 425.512(a)(7) floor described in section (a): higher of own score or
73.85 when a required measure lacks a benchmark or points were reduced under
§ 414.1380(b)(1)(vii)(A).

### Alternative quality performance standard — the answer to "what happens on failure"

**It is partial / scaled sharing, not all-or-nothing.**

**Citation: 42 CFR § 425.512(a)(5)(ii)(B)**, verbatim (S1):

> "For performance year 2025 and subsequent performance years, the ACO reports
> quality data on the APP Plus quality measure set established under § 414.1367
> of this subchapter according to the method of submission established by CMS and
> achieves a quality performance score equivalent to or higher than the 10th
> percentile of the performance benchmark on at least one of the outcome measures
> in the APP Plus quality measure set."

The scaling mechanism is at **§ 425.512(b)(5)(ii)**:

> "In determining the final sharing rate for calculating shared savings payments
> under the BASIC track in accordance with § 425.605(d), and under the ENHANCED
> track in accordance with § 425.610(d), for an ACO that meets the alternative
> quality performance standard…"

and operationally in § 425.605(d)(1)(*i–v*)(A)(*4*)(*ii*) and
§ 425.610(d)(4)(ii): the final sharing rate is **the track's maximum rate
multiplied by the ACO's quality score**.

CMS in plain language (S6 p.2):

> "ACOs that do not meet the quality performance standard based on the criteria
> above can meet the alternative quality performance standard to be eligible to
> share in savings **at a lower rate that is scaled based on the ACO's quality
> performance**. … The ACO's quality score will be multiplied by the maximum
> sharing rate for the ACO's track to determine its final shared savings rate. A
> similar approach is applied to ENHANCED track ACOs to determine shared losses.
> The alternative quality performance standard is available to **all** ACOs,
> regardless of how they report quality data."

Key asymmetries worth noting:

- The alternative QPS needs **only** the 10th-percentile outcome condition —
  there is **no** 40th-percentile second condition (contrast with the reporting
  incentive in section (b)).
- The alternative QPS is open to **every** collection type, including Medicare
  CQM (S6 p.3), whereas the reporting incentive is eCQM/MIPS CQM only.

### Failing both

§ 425.512(a)(5)(iii)(B): an ACO meets neither standard if it "does not report any
of the eCQMs/MIPS CQMs/Medicare CQMs in the APP Plus quality measure set and does
not administer a CAHPS for MIPS survey." Consequence (S6 p.2): "ACOs that do not
meet the quality performance standard or the alternative quality performance
standard will not be eligible for shared savings, and ACOs participating in the
ENHANCED track will owe **maximum** shared losses."

Also, for PY2026+ CMS extended its § 425.316 compliance monitoring to the
alternative QPS, including possible termination for failing both (S4).

### Health equity adjustment — REMOVED for PY2026

The population-and-income bonus (up to 10 points) at § 425.512(b) applies only to
**performance years 2023 through 2025** — the paragraph heading reads
"Calculation of an adjustment to an ACO's quality score for **performance years
2023 through 2025**" and there is no PY2026 provision (S1).

Confirmed by S4 (CY2026 PFS final rule fact sheet), verbatim:

> "We are finalizing with modification to remove the health equity adjustment
> applied to an ACO's quality score beginning in performance year 2026 (instead of
> performance year 2025 as proposed). We believe that the application of the
> Complex Organization Adjustment, the extension of the … eCQM/MIPS CQM reporting
> incentive, and flat benchmarks for Medicare CQMs' first two performance periods
> in MIPS … have made it unnecessary…"

Separately, the *benchmark*-side "health equity benchmark adjustment" was renamed
the **"population adjustment"** for PY2025+ (S4). Distinct thing — do not conflate
with the quality-score adjustment.

**Net for PY2026: quality score = MIPS Quality performance category score**
(including the CoA), with no health-equity bonus on top.

---

## (e) Sharing and loss rates by track

### Shared savings

| Track / level | Model | Max sharing rate | Rate if only the **alternative** QPS is met | Performance payment limit | Citation |
|---|---|---|---|---|---|
| BASIC A | one-sided | **40%** | 40% × quality score | 10% of updated benchmark | § 425.605(d)(1)(i) |
| BASIC B | one-sided | **40%** | 40% × quality score | 10% of updated benchmark | § 425.605(d)(1)(ii) |
| BASIC C | two-sided | **50%** | 50% × quality score | 10% of updated benchmark | § 425.605(d)(1)(iii) |
| BASIC D | two-sided | **50%** | 50% × quality score | 10% of updated benchmark | § 425.605(d)(1)(iv) |
| BASIC E | two-sided | **50%** | 50% × quality score | 10% of updated benchmark | § 425.605(d)(1)(v) |
| ENHANCED | two-sided | **75%** | 75% × quality score | **20%** of updated benchmark | § 425.610(d)(4), § 425.610(e)(2) |

Note the ENHANCED performance payment limit is **20%** (§ 425.610(e)(2)) — not to be
confused with its **15%** *loss recoupment* limit (§ 425.610(g)). All BASIC levels
cap shared savings at 10% of the updated benchmark.

Sharing applies **on a first dollar basis** once the MSR is met
(§ 425.605(d)(1)(*)(B)(*1*)).

**Low-revenue ACOs that miss the MSR** (§ 425.605(h)): an ACO that is low revenue,
has ≥5,000 assigned beneficiaries, is in an agreement period beginning
2024-01-01 or later, and has expenditures below benchmark may still share — at
**one-half** the otherwise applicable rate (§ 425.605(h)(2)). This is visible in
the PY2024 PUF as final sharing rates of exactly 20.0 (= ½ × 40) and 25.0
(= ½ × 50).

### Shared losses

| Track / level | Loss rate | Scaled by quality? | Loss recoupment limit | Citation |
|---|---|---|---|---|
| BASIC A, B | none (one-sided) | — | — | § 425.605(d)(1)(i)–(ii) |
| BASIC C | **fixed 30%** | **No** | 2% of ACO participants' Parts A+B FFS revenue, capped at 1% of updated benchmark | § 425.605(d)(1)(iii)(C)–(D) |
| BASIC D | **fixed 30%** | **No** | 4% of revenue, capped at 2% of updated benchmark | § 425.605(d)(1)(iv)(C)–(D) |
| BASIC E | **fixed 30%** | **No** | 8% of revenue, capped at 4% of updated benchmark | § 425.605(d)(1)(v)(C)–(D) via § 414.1415(c)(3)(i)(A)=8%, (B)=3% "+1 percentage point" |
| ENHANCED | **1 − (0.75 × quality score)**, floor 40%, ceiling 75% | **Yes** | 15% of updated benchmark | § 425.610(f)(4), § 425.610(g) |

**ENHANCED loss-rate formula**, verbatim from § 425.610(f)(4) (S1):

> "(i) If the ACO meets either the quality performance standard … or the
> alternative quality performance standard …, CMS determines the shared loss rate
> as follows: (A) Calculate the product of 75 percent and the ACO's quality score
> calculated according to § 425.512. (B) Calculate the shared loss rate as 1 minus
> the product … The shared loss rate— (*1*) May not exceed 75 percent; and (*2*)
> May not be less than 40 percent.
> (ii) If the ACO fails to meet either the quality performance standard or the
> alternative quality performance standard … the shared loss rate is 75 percent."

Derived consequences of that formula:

| Quality score | ENHANCED shared loss rate |
|---|---|
| ≥ 80% | **40%** (floor binds; 1 − 0.75×0.80 = 0.40) |
| 73.85% (the QPS) | 44.61% |
| 60% | 55% |
| 40% | 70% |
| Fails both standards | **75%** (maximum) |

Note the asymmetry the app should model: **only ENHANCED shared losses scale with
quality**. BASIC C/D/E losses are a flat 30% regardless of quality score, and
regardless of whether the ACO met the QPS at all.

### Empirical validation from the PY2024 PUF (S11, 476 ACOs)

These are PY2024 results under PY2024 rules (APP measure set, health equity
adjustment still in force), used here only to confirm the settlement mechanics
read correctly.

| Observation | Value | Confirms |
|---|---|---|
| Final sharing rate = 40.0 | 127 ACOs | BASIC A/B max rate |
| Final sharing rate = 50.0 | 107 ACOs | BASIC C/D/E max rate |
| Final sharing rate = 75.0 | 200 ACOs | ENHANCED max rate |
| Final sharing rate = 20.0 / 25.0 | 12 / 1 ACOs | § 425.605(h) half-rate for low-revenue ACOs below MSR. **Verified directly:** all 12 ACOs at 20.0 are `Current_Track = A`, `Rev_Exp_Cat = Low Revenue`, and every one has `Sav_rate` < `MinSavPerc` (e.g. 0.12 vs 3.01; 2.85 vs 2.99) — i.e. they missed the MSR and received ½ × 40% |
| Off-cluster rates (27.5–57.7) | ~25 ACOs | alternative-QPS scaling (max rate × quality score) |
| Final **loss** rate = 30.0 | **114** ACOs | exactly = BASIC C(5) + D(5) + E(104); confirms flat 30% |
| Final loss rate = 40.0 | 157 ACOs | ENHANCED floor (quality score ≥ 80%) |
| Final loss rate > 40.0 | 48 ACOs, max **68.99** | ENHANCED scaling, never reaching 75% ceiling |
| Quality score distribution | min 34.29, p10 71.70, median 83.11, mean 81.90, max 98.69 | — |
| Total earned savings/losses | **$4.12 billion**; 360 ACOs positive | matches CMS's public "$4.1 billion" figure |
| Track counts | ENHANCED 205, BASIC E 104, B 103, A 54, C 5, D 5 | — |

### PY2026 participation context (S10, 511 ACOs)

| Track | ACOs |
|---|---|
| ENHANCED | 296 |
| BASIC E | 82 |
| BASIC B | 66 |
| BASIC A | 55 |
| BASIC C | 9 |
| BASIC D | 3 |
| **Total** | **511** |

Low revenue 325 / high revenue 186.

---

## (f) APP-entity MIPS score → clinician payment adjustment pipeline

| Step | Detail | Citation |
|---|---|---|
| 1. Category weights under the APP | Quality **50%**, Cost **0%**, Improvement Activities **20%**, Promoting Interoperability **30%** | § 414.1367(d)(1) |
| 2. Quality category score | (measure achievement points + bonus points + **CoA**) ÷ total available measure achievement points, + improvement percent score; **cannot exceed 100** percentage points | § 414.1380(b)(1)(vii) |
| 3. Final score | computed per § 414.1380(c) | § 414.1367(e) |
| 4. **Two-year lag** | PY2026 performance period → **2028 MIPS payment year**. "MIPS payment year means a calendar year in which the MIPS payment adjustment factor … are applied to Medicare Part B payments." | § 414.1305; the pairing convention "CY 2025 performance period/2027 MIPS payment year" is used throughout S2/S3/S8 |
| 5. **Non-QP only** | "a MIPS eligible clinician does not include an eligible clinician who: (i) Is a Qualifying APM Participant …; (ii) Is a Partial Qualifying APM Participant and does not elect to participate in MIPS …; or (iii) Does not exceed the low volume threshold." | § 414.1310(b)(1) |
| 6. Performance threshold (2028 payment year) | **75 points** | § 414.1405(b)(10)(ii) |
| 7. Applicable percent | **9%** (MIPS payment year 2022 and each subsequent year) | § 414.1405(c) |
| 8. Positive side | linear sliding scale: **0%** at a final score of 75, **+9%** at a final score of 100, then multiplied by a budget-neutrality **scaling factor not to exceed 3.0** | § 414.1405(b)(1), (b)(3) |
| 9. Negative side | linear sliding scale: 0% at 75 down to **−9%** at 0; and any score **≤ ¼ of the threshold (≤ 18.75)** receives the full **−9%** | § 414.1405(b)(2) |
| 10. Exceptional-performance bonus | **None for 2028.** The additional performance threshold exists only "for each of the MIPS payment years 2019 through 2024" | § 414.1405(d) |
| 11. **Claim-level multiplier** | "the amount otherwise paid under Part B with respect to such covered professional services and MIPS eligible clinician for such year, **is multiplied by 1, plus the sum of the MIPS payment adjustment factor divided by 100**, and as applicable, the additional MIPS payment adjustment factor divided by 100" | § 414.1405(e) |
| 12. Range | **−9% to +9% × scaling factor** (theoretical max +27% if the scaling factor hit its 3.0 ceiling; in practice historical scaling factors have been far below 1.0) | § 414.1405(b)(3), (c) |
| 13. Exception | adjustment factors do not apply to certain model-specific payments under section 1115A APMs | § 414.1405(f) |

Also relevant: reweighting. If CMS reweights Quality to 0%, PI → 75% and IA →
25%; if PI is reweighted to 0%, Quality → 75% and IA → 25%
(§ 414.1367(d)(2)).

---

## CY2027 PFS proposed rule (CMS-1848-P) — PROPOSED, NOT LAW

Published 2026-07-16 (91 FR, FR Doc 2026-14327); final rule expected ~Nov 2026.
Source S5. Listed here so the app's A/B toggle can be checked against CMS's own
words. **None of this is current law.**

| Proposal | Current law | Proposed |
|---|---|---|
| BASIC Level E sharing rate | 50% | **60%** |
| ENHANCED max positive regional adjustment weight | 50% | **35%** |
| Prior savings adjustment scaling factor | 50% | **75%** |
| 5% cap on upward benchmark adjustments | flat 5% | **risk-adjusted** 5% cap |
| MIPS CQM collection type | ends after PY2026 | **extended** to PY2027+ |
| eCQM/MIPS CQM reporting incentive | eCQM/MIPS CQM | **extended** to MIPS CQM for PY2027+ |
| Medicare eCQM collection type | n/a | **new** for PY2027+; flat benchmarks; **not eligible for the reporting incentive or the CoA** |
| § 425.512(a)(7) scoring policy | applies when any required measure lacks a benchmark, or points reduced | for PY2027+, applies **only if fewer than five measures are scored**; the "lacks a benchmark" trigger is **removed** |
| APP Plus set | 8 measures in PY2026; 9 in PY2027 under current law | **8 measures** in PY2027 (removes 305 and 493) |
| Prepaid shared savings option | exists | **removed** after the 1/1/2027 application cycle |
| ACPT | 3-way blend | **guardrail**: no more than 1 pp below / 1.5 pp above national growth; lower guardrail applied retroactively to PY2025+ |
| CEHRT requirement | report all MIPS PI measures | sunset; replaced by one of three activities for PY2027+ |
| PY2025 reconciliation timing | — | **delayed to November 2026** so the ACPT guardrail can be applied |
| ACO participant TIN exclusions | — | new, for **PYs beginning on or after 1/1/2026**, if remaining TINs cover **≥95%** of assigned beneficiaries |

Note the last row: the TIN-exclusion proposal is written to apply to PY2026
itself if finalized, so it is one place where the CY2027 proposed rule could
retroactively change PY2026 mechanics.

---

## Caveats and gaps

Things I could **not** verify from a public source, stated plainly rather than
guessed:

1. **The 80-point denominator is derived, not quoted.** No CMS document I found
   states "the APP Plus quality measure set has 80 total available measure
   achievement points." It follows from 8 measures × 10 points/measure
   (§ 414.1380(b)(1)(i)), with CAHPS contributing 10 points inferred from
   § 414.1380(b)(1)(vii)(B) (the "reduced by 10 points" rule). The 10% CoA cap of
   8 points is derived the same way. **This does not affect the operative PY2026
   number**, which CMS states directly: the CoA is capped at 5 points in PY2026
   by the eCQM count, and the 10% cap would only bind below a 50-point
   denominator.

2. **How CAHPS's 9 SSMs collapse into one measure score is not documented in any
   source I retrieved.** The PY2026 benchmark file gives each of the 9 SSMs its
   own decile table, but no CMS document found explains the aggregation (average?
   weighted?) into Quality ID 321's 0–10 points. S6 fn.1 says the CAHPS 40th
   percentile decile score is published only in the PY2026 Quality Performance
   Reports inside each ACO's Financial Reconciliation Package — i.e. not public.

3. **Whether an eCQM that lacks a benchmark still earns its CoA point is
   unresolved.** § 414.1380(b)(1)(vii)(C) conditions the point on case minimum
   and data completeness, not on having a benchmark; but § 414.1367(c)(1)(i)
   excludes unbenchmarked measures from the score entirely. For PY2026 this
   matters concretely: 112 and 113 have no eCQM/MIPS CQM benchmark, so an eCQM
   reporter's CoA could be 5 points or 3 points. CMS's "5 points in performance
   year 2026" statement (S8, November 2025) predates the January 2026 benchmark
   publication and appears to assume all five measures are benchmarked. **No
   source resolves this.**

4. **Whether the administrative claims measures' pre-performance lack of
   benchmarks trips § 425.512(a)(7)(ii)(B)** is not addressed anywhere I looked.
   Their benchmarks are computed from performance-period data and published in
   CY2027 (S6 fn.1), so they are "absent" only in a timing sense. Read
   literally the provision would trigger every year for every ACO, which cannot
   be the intent — but I found no CMS text excluding them.

5. **PY2026 40th-percentile figure 73.85 is fixed and published; the inputs
   (77.73 / 74.54 / 69.27) are only stated inside S6.** I did not find an
   independent publication of the PY2022–PY2024 40th-percentile values.

6. **Benchmark file volatility.** `research/data/app-plus-py2026-benchmarks.csv`
   is a snapshot taken 2026-08-07. CMS can republish PY2026 benchmarks; the
   112/113 "no benchmark" status in particular is the kind of thing that could be
   revised. Re-fetch S7 before relying on it.

7. **MIPS budget-neutrality scaling factor for the 2028 payment year is
   unknowable now** — it is computed after the fact. Any dollar figure the app
   shows for clinician-level payment adjustment is therefore an estimate, and the
   +9% upper bound is nominal.

8. **PY2024 PUF caveat:** the file used (S11) is the *revised* version published
   2026-07-17, reflecting reopened reconciliation for ACOs with agreement periods
   beginning 2024-01-01. Earlier-published PY2024 numbers differ.

9. I did **not** read the app's source or `docs/session-notes.md`, by design, so
   nothing here is reconciled against what the app currently implements.
