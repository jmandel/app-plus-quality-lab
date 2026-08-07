# MSSP PY2024 ACO Results — Verified Distributions

Independent ground truth for the APP Plus Pathway Lab. Every number below was computed
from the CMS public-use files listed under **Sources**, retrieved **2026-08-07**. Nothing
here is estimated, back-filled, or carried over from the app's own assumptions.

Computed extract (machine-readable): [`data/mssp-py2024-distributions.json`](data/mssp-py2024-distributions.json) (19 KB).
The raw PUFs are **not** committed — see [Reproducing](#reproducing).

---

## Sources

| # | Source | URL | Retrieved | How fetched |
|---|---|---|---|---|
| S1 | PY2024 Performance Year Financial and Quality Results PUF (revision of 2026‑07‑17) | `https://data.cms.gov/sites/default/files/2026-07/fb6ba14b-3450-47c2-8ff5-d1f2a5bdb3e3/PY_Financial_and_Quality_Results_2024_revised%202026_07_17.csv` | 2026-08-07 | `curl` → 437,855 bytes, 476 data rows, 189 columns |
| S2 | data.cms.gov DCAT catalog (used to locate S1's current download URL) | `https://data.cms.gov/data.json` | 2026-08-07 | `curl`; dataset id `73b2ce14-351d-40ac-90ba-ec9e1f5ba80c`, distribution `d33cf946-28cd-4479-b55e-73024331f4ca`, `modified: 2026-07-20` |
| S3 | PY2024 ACO Participants file (snapshot 2024‑01‑24) | `https://data.cms.gov/sites/default/files/2024-01/afc09855-5e4b-4baf-bdc4-88a4459a52e5/PY2024_Medicare_Shared_Savings_Program_Participants.csv` | 2026-08-07 | `curl` → 5,832,684 bytes, 15,540 rows, 480 distinct `aco_id` |
| S4 | PY2026 ACO Participants file (snapshot 2026‑01‑01) — forward-looking cohort | `https://data.cms.gov/sites/default/files/2026-01/453bc69c-61a4-4030-8d03-e33895fd1cfd/PY2026_Medicare_Shared_Savings_Program_Participants.csv` | 2026-08-07 | `curl` → 5,908,105 bytes, 15,370 rows, 511 distinct `ACO_ID` |
| S5 | PY Financial and Quality Results Data Dictionary (Nov 2025, current) | `https://data.cms.gov/sites/default/files/2025-11/0eb58c4e-6f40-497d-a90f-242151c20bb8/Data_Dictionary-Medicare_Shared_Savings_Program-Performance_Year_Financial_and_Quality_Results_2025_Nov2025.pdf` | 2026-08-07 | `curl` + `pdftotext -layout`; all field semantics below quote this |
| S6 | ACO Participants Data Dictionary (2023–2024) | `https://data.cms.gov/sites/default/files/2023-01/SSP_ACO_Participants_Data-Dictionary_508.pdf` | 2026-08-07 | `curl` + `pdftotext -layout` |
| S7 | CMS fact sheet, "Updated Performance Year 2024 Financial and Quality Results" (2025‑09‑29) | `https://www.cms.gov/files/document/fact-sheet-ssp-py24-financial-quality-results.pdf` | 2026-08-07 | `curl` + `pdftotext`; used only to cross-check aggregates |
| S8 | CMS memo: PY2024 40th-percentile MIPS quality score | `https://www.cms.gov/files/document/medicare-shared-savings-program-health-equity-adjusted-quality-performance-score-equates-40th.pdf` | 2026-08-07 | `curl` + `pdftotext`; PY2024 QPS = **77.05** |
| S9 | CMS memo: PY2026 40th-percentile MIPS quality score | `https://www.cms.gov/files/document/medicare-shared-savings-program-quality-performance-standard-performance-year-2026-40th-percentile.pdf` | 2026-08-07 | `curl` (HTTP 200, still live) + `pdftotext`; PY2026 QPS = **73.85** |

**Percentile definition.** All percentiles use **linear interpolation between order
statistics** — NumPy `method="linear"`, identical to Hyndman & Fan **Type 7**, R's
`quantile(type=7)` default, and Excel `PERCENTILE.INC`. For sorted `x₁…xₙ` and probability
`p`: `h = (n−1)p`, result = `x⌊h⌋₊₁ + (h − ⌊h⌋)·(x⌊h⌋₊₂ − x⌊h⌋₊₁)`. With n=476 this
interpolates for p25/p75 (hence the `.2`/`.5` fractional values in beneficiary counts) and
is exact at p50 only when the two central values coincide. No weighting is applied unless a
row is explicitly labeled *beneficiary-weighted*.

---

## Key numbers

### N and aggregates

| Quantity | Value |
|---|---|
| **N ACOs with PY2024 reconciled results** | **476** |
| ACOs in the PY2024 Participants snapshot | 480 (4 — `A3151`, `A3597`, `A5074`, `A5253` — never reached reconciliation) |
| Total assigned beneficiaries (Σ `N_AB`) | 10,326,340 |
| Total assigned person-years (Σ `N_AB_Year_PY`) | 10,111,347 |
| Total updated benchmark dollars (Σ `ABtotBnchmk`) | $139,745,370,823 |
| Total expenditures (Σ `ABtotExp`) | $133,131,051,324 |
| Aggregate gross savings | $6,614,319,499 (**4.733%** of benchmark) |
| Earned shared savings paid out | $4,142,450,738 |
| Shared losses owed | −$19,966,437 (16 ACOs) |
| Net savings to Medicare | $2,491,835,198 |
| Gross per capita savings (per person-year) | $654.15 |
| Net per capita savings (per person-year) | $246.44 |
| ACOs earning shared savings | 360 (75.6%), holding 80.1% of assigned beneficiaries |
| ACOs settling at exactly $0 | 100 |
| ACOs with a positive *gross* savings rate | 422 (88.7%) |

### Distributions — one row per ACO, n = 476

| Metric (PUF field) | p10 | **p25** | **p50** | **p75** | p90 | mean | min / max |
|---|---|---|---|---|---|---|---|
| Assigned beneficiaries (`N_AB`) | 5,921 | **8,262.5** | **13,151** | **24,445.2** | 44,109.5 | 21,694 | 2,647 / 328,733 |
| Assigned person-years (`N_AB_Year_PY`) | 5,802.5 | 8,076.2 | 12,857.5 | 24,045.2 | 43,283 | 21,242 | 2,586 / 321,569 |
| Total updated benchmark $ (`ABtotBnchmk`) | $75.7M | **$106.0M** | **$177.3M** | **$331.4M** | $603.9M | $293.6M | $40.5M / $4.323B |
| Total expenditures $ (`ABtotExp`) | $73.8M | $101.3M | $167.6M | $317.1M | $578.6M | $279.7M | $34.9M / $4.150B |
| **Per-capita** updated benchmark (`UpdatedBnchmk`) | $11,474 | **$12,115** | **$13,278** | **$14,470** | $15,970 | $13,983 | $10,221 / $52,115 |
| Per-capita historical benchmark (`HistBnchmk`) | $9,829 | $10,459 | $11,438 | $12,531 | $13,563 | $12,079 | $8,752 / $50,894 |
| Per-capita PY expenditures (`Per_Capita_Exp_TOTAL_PY`) | $10,758 | $11,516 | $12,691 | $13,831 | $15,285 | $13,283 | $9,440 / $52,725 |
| **Gross savings rate %** (`Sav_rate`) | −0.40 | **2.00** | **4.22** | **7.03** | 10.36 | 4.76 | −10.72 / 22.13 |
| Gross savings/losses $ (`GenSaveLoss`) | $0 | $413,636 | $6.99M | $16.35M | $37.70M | $13.75M | −$11.0M / $173.0M |
| Earned savings/losses $ (`EarnSaveLoss`) | $0 | $81,618 | $3.72M | $9.07M | $23.05M | $8.66M | −$3.30M / $127.1M |
| **Participant TINs per ACO** (rows in S3) | 2.5 | **7** | **19** | **37.2** | 80 | 32.6 | 1 / 509 |
| PCPs (`N_PCP`) | 54 | 98.5 | 206 | 428 | 747 | 385 | 13 / 7,044 |
| Specialists (`N_Spec`) | 11 | 78.2 | 297 | 883 | 1,714 | 732 | 0 / 15,223 |
| NPs (`N_NP`) | 45.5 | 96 | 214.5 | 428.2 | 860.5 | 375 | 4 / 6,870 |
| PAs (`N_PA`) | 14.5 | 35 | 88 | 215.5 | 445 | 200 | 0 / 4,404 |

Weighted mean per-capita benchmark (Σ`ABtotBnchmk` ÷ Σ`N_AB_Year_PY`) = **$13,821**, above
the unweighted median of $13,278 — large ACOs run higher per-capita benchmarks.

`Sav_rate` reproduces exactly from `(ABtotBnchmk − ABtotExp) / ABtotBnchmk`: max absolute
discrepancy across all 476 ACOs is **0.005 percentage points** (rounding only). Modeling
either way is equivalent.

### Quality scores (`QualScore`), n = 476

| p5 | p10 | **p25** | p40 | **p50** | p60 | **p75** | p90 | p95 | mean | sd | min / max |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 63.18 | 71.81 | **77.05** | 81.42 | **83.11** | 85.21 | **88.12** | 91.78 | 93.75 | 81.90 | 9.45 | 34.29 / 98.69 |

**Median 83.11 — confirms the app's expected ~83.1.**

Histogram (5-point bins): 30–35: 1 · 35–40: 1 · 40–45: 1 · 45–50: 1 · 50–55: 9 · 55–60: 7 ·
60–65: 5 · 65–70: 13 · 70–75: 29 · 75–80: 95 · 80–85: 117 · 85–90: 121 · 90–95: 62 · 95–100: 14.

**The distribution is not smooth.** 35 ACOs (7.4%) sit at *exactly* 77.05 — every one has
`Recvd40p = 1`, i.e. the Quality Extreme & Uncontrollable Circumstances policy floored their
score at the PY2024 40th-percentile value of 77.05 (S8). That single value is the modal
score and it lands inside the p25 bucket. Excluding those 35 ACOs, the remaining 441 have
p25/p50/p75 = **79.07 / 83.71 / 88.38**, mean 82.28.

### How the 476 ACOs cleared the PY2024 quality performance standard

The gate flags partition the cohort exactly — there are only four observed combinations of
(`Met_QPS`, `Met_AltQPS`, `Met_40pctl`, `Recvd40p`), with no residual:

| Pathway | n | `Met_QPS` | Sharing rate consequence |
|---|---|---|---|
| Scored ≥ 40th percentile (77.05) organically | **355** | 1 | track max* |
| Scored < 77.05 but EUC-floored *up to* 77.05 | **35** | 1 | track max* |
| Scored < 40th pct, met QPS anyway via `Met_Incentive` and/or `Met_FirstYear` | **57** | 1 | track max* |
| Failed QPS, met the **alternative** standard (`Met_AltQPS`) | **29** | 0 | **quality-scaled** |
| **Total** | **476** | 447 met / 29 not | — |

\* except for 13 ACOs subject to `ReducedSS` — see below.

Of the 57 in the third row: 30 via the eCQM/MIPS CQM reporting incentive only, 18 via
first-year reporting criteria only, 9 via both. (`Met_Incentive = 1` for 122 ACOs overall;
all 122 met QPS. `Met_FirstYear = 1` for 59.)

`Met_40pctl = 1` for 390 = 355 + 35, i.e. the EUC floor lifts an ACO over the 40th percentile
by construction. `Met_SSP_quality_reporting_requirements` is 1 for 471, 0 for 5.

**The alternative-QPS scaling formula is exactly reproducible.** For all 29 alt-QPS ACOs,
`FinalShareRate = (QualScore / 100) × max track rate`, where max is 40% (BASIC A/B), 50%
(BASIC C/D/E), or 75% (ENHANCED). Verified 29/29 to within 0.02 pp. Their quality scores span
51.25–77.02 and the resulting sharing rates span **27.53%–57.66%**.

Final sharing rates among the 447 QPS-meeting ACOs: 75.00% (200, ENHANCED), 50.00% (107,
BASIC C/D/E), 40.00% (127, BASIC A/B) — plus 13 exceptions at 20.00% (12 ACOs) and 25.00%
(1 ACO). All 13 carry `ReducedSS = 1`, the reduced sharing rate for low-revenue ACOs; 12 are
BASIC A with `AIP = 1` (Advance Investment Payment). A model that hardcodes 40/50/75% will be
wrong for ~2.7% of ACOs.

Quality by **reporting mechanism** — the most decision-relevant cut for APP Plus, since
PY2026 is the last CMS Web Interface year:

| Mechanism | n | p25 | **p50** | p75 | mean |
|---|---|---|---|---|---|
| Web Interface only | 301 | 80.42 | **84.29** | 88.79 | 84.08 |
| Both WI + digital | 91 | 81.80 | **85.62** | 89.46 | 85.36 |
| Digital only (eCQM / MIPS CQM / Medicare CQM) | 76 | 60.66 | **74.58** | 77.05 | 69.62 |
| Neither | 8 | 77.05 | 77.05 | 77.05 | 77.05 |

The 8 "neither" ACOs all have `Recvd40p = 1` and `DisAffQual = 1` (disaster-affected for
quality) — 5 of them are the 5 that failed reporting requirements outright. Their uniform
77.05 is the EUC floor, not a performance measurement.

Digital-only ACOs scored **~10 points lower at the median**, and that understates the gap:
16 of the 76 were EUC-floored at 77.05. Excluding those, the 60 genuine digital-only scores
run p25/p50/p75 = **58.21 / 70.97 / 76.21**, mean 67.64. This is the single largest
empirical signal about what happens when ACOs leave the Web Interface.

Quality by track:

| Track | n | p25 | p50 | p75 | mean |
|---|---|---|---|---|---|
| ENHANCED | 205 | 80.64 | 85.46 | 89.99 | 84.23 |
| BASIC E | 104 | 79.51 | 83.89 | 89.43 | 82.83 |
| BASIC D | 5 | 79.00 | 80.65 | 85.23 | 80.94 |
| BASIC C | 5 | 73.44 | 76.88 | 79.78 | 76.34 |
| BASIC B | 103 | 77.68 | 82.13 | 85.39 | 81.37 |
| BASIC A | 54 | 70.86 | 77.05 | 80.29 | 72.87 |

### Track and risk mix (PY2024, n = 476)

| Track (`Current_Track`) | n | % of ACOs | Risk |
|---|---|---|---|
| ENHANCED (`EN`) | 205 | **43.1%** | two-sided |
| BASIC Level E | 104 | 21.8% | two-sided |
| BASIC Level B | 103 | 21.6% | one-sided |
| BASIC Level A | 54 | 11.3% | one-sided |
| BASIC Level C | 5 | 1.1% | two-sided |
| BASIC Level D | 5 | 1.1% | two-sided |
| **BASIC total** | **271** | **56.9%** | — |

| Split | n | % of ACOs | % of assigned benes |
|---|---|---|---|
| ENHANCED | 205 | 43.1% | 54.1% |
| BASIC | 271 | 56.9% | 45.9% |
| **Two-sided** | **319** | **67.0%** | **74.2%** |
| **One-sided** | **157** | **33.0%** | **25.8%** |
| Retrospective assignment | 328 | 68.9% | — |
| Prospective assignment | 148 | 31.1% | — |
| Low Revenue | 274 | 57.6% | — |
| High Revenue | 202 | 42.4% | — |
| Renewal / Initial / Re-entering | 298 / 128 / 50 | 62.6 / 26.9 / 10.5% | — |

One-sided = BASIC A + B exactly (54 + 103 = 157), matching `Risk_Model` with no exceptions.

Savings rate by subgroup (gross `Sav_rate` %, p25/p50/p75):

| Subgroup | n | p25 | p50 | p75 | mean |
|---|---|---|---|---|---|
| Low Revenue | 274 | 2.65 | 5.11 | 8.27 | 5.85 |
| High Revenue | 202 | 0.83 | 3.25 | 5.58 | 3.27 |
| Two-sided | 319 | 2.44 | 5.09 | 7.88 | 5.53 |
| One-sided | 157 | 0.94 | 2.95 | 5.15 | 3.20 |

### Part B / fee-for-service billing magnitude relative to ACO size

Two public fields bear on this, and they measure **different things**:

**1. `Rev_Exp_Cat` (High vs Low Revenue) — the only field about billing *by* the ACO.**
Per S5: *"If ACO participant total Medicare Parts A and B FFS revenue for the performance
year is less than 35% of the total Medicare Parts A and B FFS expenditures for the ACO's
assigned beneficiaries for the performance year, 'Low Revenue'. If … 35% or more, 'High
Revenue'."* This is exactly a billing-magnitude-relative-to-ACO-size ratio — but **only the
binary side of the 35% threshold is published; the underlying ratio is not in any public
file.** PY2024: 274 Low Revenue (57.6%) / 202 High Revenue (42.4%). Median `N_AB` is 12,028
for Low Revenue vs 15,766 for High Revenue.

By track: Low Revenue skews ENHANCED+E (122 EN, 67 E, 41 B, 35 A, 4 C, 5 D); High Revenue
skews BASIC B (83 EN, 62 B, 37 E, 19 A, 1 C).

**2. `CapAnn_PB` — Part B physician/supplier spend *on* the ACO's beneficiaries.**
Per S5: *"Annualized, truncated, weighted mean expenditures per assigned beneficiary person
years for Part B physician/supplier (Carrier) services … claim type codes 71 and 72"*,
including E&M, procedures, imaging, lab, Part B drugs, ambulance, ASCs, and independent labs.
It is spend on assigned beneficiaries by **any** provider, not revenue billed **by** ACO
participants.

| Metric | p10 | p25 | p50 | p75 | p90 | mean | min / max |
|---|---|---|---|---|---|---|---|
| `CapAnn_PB` per person-year | $3,047 | $3,587 | **$4,332** | $5,124 | $5,969 | $4,407 | $1,814 / $9,356 |
| `CapAnn_PB` as % of total per-capita PY spend | 23.6% | 28.3% | **33.4%** | 40.0% | 43.7% | 33.8% | 13.0% / 57.6% |
| Implied total carrier dollars per ACO (`CapAnn_PB` × person-years) | $22.8M | $32.7M | **$57.8M** | $107.4M | $194.5M | $92.6M | $10.7M / $1.237B |
| `CapAnn_OPD` (outpatient) per person-year | $2,161 | $2,461 | $3,077 | $3,802 | $4,607 | $3,249 | $1,284 / $8,861 |

Aggregate implied Part B carrier spend across all 476 ACOs: **$44.1 billion**, ~33% of the
$133.1B in total expenditures.

### Participant TIN counts

The public Participants file (S3) publishes `Par_LBN` — *"Legal Business Name of ACO
Participant"* (S6) — **not** the TIN itself, although ACO participants are TIN-identified in
the program. Counting rows per `aco_id` is therefore a close proxy for participant-TIN
count, not a literal one.

| Basis | p10 | p25 | p50 | p75 | p90 | mean | min / max |
|---|---|---|---|---|---|---|---|
| Rows per ACO, 476 reconciled ACOs | 2.5 | 7 | **19** | 37.2 | 80 | 32.6 | 1 / 509 |
| Distinct `Par_LBN` per ACO, same 476 | 2.5 | 7 | **19** | 37.2 | 79.5 | 32.5 | 1 / 508 |
| Rows per ACO, all 480 in the file | 2 | 7 | **19** | 37 | 80 | 32.4 | 1 / 509 |

Rows and distinct-LBN counts differ by only 51 out of 15,540 rows (0.3%) — either repeated
LBNs across distinct TINs or duplicate rows. The distinction is immaterial for modeling.

The distribution is extremely right-skewed: the median ACO has **19** participants while the
mean is 32.6 and the largest has 509. Any model that uses a mean participant count will
badly misrepresent the typical ACO.

### Forward-looking: PY2026 cohort (S4, snapshot 2026‑01‑01)

PY2026 financial/quality results do not exist yet (reconciliation lands ~2027). The
Participants file is the only PY2026 ground truth available today.

| Quantity | PY2024 (results) | PY2026 (participants) |
|---|---|---|
| N ACOs | 476 | **511** |
| ENHANCED | 205 (43.1%) | 296 (**57.9%**) |
| BASIC | 271 (56.9%) | 215 (42.1%) |
| One-sided (BASIC A+B) | 157 (33.0%) | 121 (**23.7%**) |
| Two-sided (C/D/E/EN) | 319 (67.0%) | 390 (**76.3%**) |
| High Revenue | 202 (42.4%) | 186 (36.4%) |
| Participant rows per ACO, median | 19 | **17** (p25 6, p75 36, mean 30.1, max 823) |
| BASIC levels A/B/C/D/E | 54/103/5/5/104 | 55/66/9/3/82 |

The mix has shifted materially toward ENHANCED and two-sided risk since PY2024. 572 of
15,370 PY2026 participant rows carry `pc_flex_agreement_status = 1` (Prospective Primary
Care Payment / PC Flex).

Related PY2026 anchor: the PY2026 quality performance standard is the **73.85** 40th-percentile
MIPS quality score (S9) — the average of PY2022 (77.73), PY2023 (74.54), and PY2024 (69.27)
submission-level 40th percentiles. Note this is *lower* than PY2024's 77.05 and that the
PY2024 input (69.27) is a MIPS-wide figure, distinct from the 77.05 that was applied to
ACOs in PY2024.

---

## Cross-check against the CMS fact sheet (S7)

The fact sheet describes the **original** September 2025 results; the PUF used here is the
**2026‑07‑17 revision** reflecting reopened reconciliations, so small drift is expected.

| Item | Fact sheet | Computed from S1 | Verdict |
|---|---|---|---|
| N ACOs | 476 | 476 | exact |
| Assigned beneficiaries | 10.3 million | 10,326,340 | exact |
| % ACOs earning payments | 75% | 75.6% | exact (rounded) |
| % of benes in those ACOs | 80% | 80.1% | exact (rounded) |
| Performance payments | $4.1 billion | $4.14 billion | exact (rounded) |
| ACOs owing losses | 16 ACOs / $20.0M | 16 ACOs / $20.0M | exact |
| Gross per capita savings | $651 | $654.15 | +$3.15 (revision drift) |
| Net per capita savings | $245 | $246.44 | +$1.44 (revision drift) |
| Net savings to Medicare | $2.5 billion | $2.49 billion | close |

Nine of nine aggregates reconcile. The PUF is being read correctly.

---

## Caveats / gaps

**Data-vintage issues**

- S1 is the **revised** PY2024 file (`revised 2026_07_17`, dataset `modified: 2026-07-20`),
  not the original September 2025 release. Numbers here will not match publications that
  used the original file. Per-capita savings drift ~$1–3.
- S3 is a **2024‑01‑24 snapshot**. ACO participant rosters change mid-year (additions,
  terminations), so participant counts are point-in-time and will not exactly match the
  roster in force at reconciliation.
- 4 ACOs appear in S3 but not S1 (`A3151`, `A3597`, `A5074`, `A5253`) — presumably terminated
  before reconciliation. All 476 result ACOs are present in S3, so no participant counts are
  missing.

**Field semantics that are easy to get wrong**

- `UpdatedBnchmk` and `HistBnchmk` are **per-capita** dollars, not totals. Totals are
  `ABtotBnchmk` / `ABtotExp`. Conflating them is off by ~10⁴.
- `N_AB` (headcount, 10,326,340) ≠ `N_AB_Year_PY` (person-years, 10,111,347). CMS per-capita
  figures use person-years. Using headcount as the denominator understates per-capita savings
  by ~2% ($640.53 vs $654.15).
- `Sav_rate` is the **gross** savings rate before MSR/MLR and before the sharing rate.
  `GenSaveLoss` is already zeroed for ACOs that did not cross MSR/MLR; `EarnSaveLoss` is the
  actual settlement.
- No suppression or missing values were found in any field used here — all 476 rows are
  complete for `N_AB`, `Sav_rate`, `UpdatedBnchmk`, `ABtotBnchmk`, `ABtotExp`, `QualScore`,
  `CapAnn_PB`, and the clinician counts.

**Things that could not be verified from public sources**

- **The actual ACO-participant revenue ratio behind `Rev_Exp_Cat` is not published** — only
  the binary High/Low side of the 35% threshold. There is no public field giving an ACO's own
  Part B billing as a dollar amount or as a continuous share of its beneficiaries' spend.
  `CapAnn_PB` is the closest public proxy but measures spend *on* beneficiaries by any
  provider, so it overstates ACO-participant billing by an unknown factor.
- **No TIN-level identifiers are public.** The Participants file gives legal business names
  only, so "participant TIN count" is a proxy (0.3% ambiguity from repeated LBNs).
- **Counts of MIPS-eligible clinicians per ACO are not directly published.** `N_PCP`,
  `N_Spec`, `N_NP`, `N_PA`, `N_CNS` are provider counts from the PUF but are not the same as
  the APM Entity's MIPS-eligible-clinician roster, and they do not roll up to TINs.
- **PY2026 financial and quality results do not exist.** Any PY2026 dollar figure in the app
  is a projection, not observable data. The PY2026 track/participant mix above (S4) is the
  only hard PY2026 fact available as of 2026-08-07.
- The CY2027 PFS proposed rule (CMS-1848-P) was **not** examined here; this document is
  strictly PY2024 observed results plus the PY2026 roster.

**Statistical caveats for anyone fitting distributions to this**

- Every dollar and size distribution is severely right-skewed (mean ≫ median throughout; e.g.
  benchmark mean $293.6M vs median $177.3M). Use medians and quantiles, not means.
- The quality-score distribution has an **artificial mode at 77.05** (35 ACOs, EUC-floored).
  A smooth parametric fit will misplace the left tail. Use the EUC-excluded cut (n=441,
  p25/p50/p75 = 79.07/83.71/88.38) if modeling organic quality performance.
- The digital-only quality figures rest on n=76 (n=60 excluding EUC), a self-selected early-
  adopter group. Treat the ~10–13 point median gap as directional, not as a PY2026 forecast.
- The BASIC C (n=5) and BASIC D (n=5) cells are too small for their quantiles to mean
  anything. Do not read the BASIC C median quality of 76.88 as a real level effect.
- `Met_40pctl` is measured against the PY2024 standard of 77.05. The PY2026 standard is
  73.85, so the PY2024 pass rate (390/476 = 81.9%) is **not** transferable to PY2026 — a
  lower bar plus a mandatory shift to digital reporting push in opposite directions.

---

## Reproducing

The raw PUFs (~12 MB total) are deliberately not committed. To regenerate
`data/mssp-py2024-distributions.json`:

```bash
D=$(mktemp -d)
curl -sL -o "$D/results.csv" \
  "https://data.cms.gov/sites/default/files/2026-07/fb6ba14b-3450-47c2-8ff5-d1f2a5bdb3e3/PY_Financial_and_Quality_Results_2024_revised%202026_07_17.csv"
curl -sL -o "$D/participants2024.csv" \
  "https://data.cms.gov/sites/default/files/2024-01/afc09855-5e4b-4baf-bdc4-88a4459a52e5/PY2024_Medicare_Shared_Savings_Program_Participants.csv"
curl -sL -o "$D/participants2026.csv" \
  "https://data.cms.gov/sites/default/files/2026-01/453bc69c-61a4-4030-8d03-e33895fd1cfd/PY2026_Medicare_Shared_Savings_Program_Participants.csv"
```

Then compute percentiles with `numpy.percentile(x, p, method="linear")` — no other
transformations were applied. If a download URL 404s, re-resolve it from the DCAT catalog at
`https://data.cms.gov/data.json` (dataset `73b2ce14-351d-40ac-90ba-ec9e1f5ba80c` for the
results PUF, `9767cb68-8ea9-4f0b-8179-9431abc89f11` for Participants); CMS rotates the
`sites/default/files/...` paths on each republication.
