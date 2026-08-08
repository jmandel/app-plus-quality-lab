# Q1 — empirical answers: what CMS has actually *done*

**Scope:** sub-question 1.5 (the 35 PY2024 `Recvd40p` ACOs) and the empirical corroboration for
Question 1, from the MSSP PUFs and the QPP benchmark files. Prepared **2026-08-08**.
Companion derived extracts: [`data/q1-py2024-recvd40p-acos.csv`](data/q1-py2024-recvd40p-acos.csv),
[`data/q1-euc-floor-by-year.csv`](data/q1-euc-floor-by-year.csv),
[`data/q1-app-benchmark-coverage.csv`](data/q1-app-benchmark-coverage.csv).

This document reports **observed CMS behaviour**. Where it makes a legal claim it labels it.
Where the data cannot settle something it says so.

---

## Headline findings

1. **The brief's premise 3 is wrong, and this is the single most important correction here.**
   `Recvd40p` is **not** evidence that § 425.512(a)(7)(ii)(B) — the *missing-benchmark* floor — is
   "real and applied." `Recvd40p` is the **extreme-and-uncontrollable-circumstances** floor under
   § 425.512**(c)(3)(iii)**, a different provision with a different trigger. All 35 flagged ACOs are
   EUC-affected (`DisAffQual = 1`), 35/35, with zero exceptions.

2. **The § 425.512(a)(7) floor has never been observed to fire on either prong** in any published
   MSSP PUF (PY2021–PY2024). PY2024 was its first eligible year, and nothing triggered it, because
   every required APP measure × collection-type cell had a benchmark at scoring time. Prong **(B)**
   — "does not have a benchmark" — has **no observed instance anywhere in the public record**, and
   CMS has proposed to delete it for PY2027+.

3. **CMS's revealed practice when a required APP cell lacks a *pre-year* benchmark is to build a
   performance-period benchmark and score it normally — option (a).** This has now happened in
   PY2021, PY2022, and PY2024, including for a brand-new collection type with no history at all.

4. **The one observed instance of exclusion (option (b)) was caused by affirmative measure
   *suppression*, not by thin data** — PY2022 eCQM 134 and 236. CMS said in writing those measures
   "won't be scored against a benchmark (historical or performance period)." That cause does not
   apply to 112/113 in PY2026.

5. **The QPP benchmark CSV is refreshed retrospectively.** Performance-period benchmark rows appear
   in a year's file only *after* that year is scored. The 2023 and 2024 files carry 88 and 85 such
   rows; the 2025 and 2026 files carry **zero**. The PY2026 file's "no benchmark" status for 112/113
   is therefore a **pre-scoring** status, not a final one, and cannot be read as evidence of the
   eventual outcome.

6. **Scored-vs-excluded is *not* empirically distinguishable from the PUF.** The quality-score
   denominator is not recoverable from published `QualScore` values. This is a clean negative; the
   arithmetic test is reported below so it is not repeated.

---

## Sources

All retrieved **2026-08-08** unless noted. MD5s are of the bytes as retrieved.

| # | Source | URL | Notes |
|---|---|---|---|
| E1 | PY2024 MSSP Results PUF (rev. 2026-07-17) | `https://data.cms.gov/sites/default/files/2026-07/fb6ba14b-3450-47c2-8ff5-d1f2a5bdb3e3/PY_Financial_and_Quality_Results_2024_revised%202026_07_17.csv` | 476 rows × 189 cols; retrieved 2026-08-07, reused |
| E2 | PY2023 MSSP Results PUF | `https://data.cms.gov/sites/default/files/2024-10/7d0067f6-55c1-4121-bcad-a4b7b45defb1/PY%202023%20ACO%20Results%20PUF.csv` | 381,089 B, md5 `d3bd888277dfc75bb173cc2b1925592d`; 453 rows × 168 cols |
| E3 | PY2022 MSSP Results PUF | `https://data.cms.gov/sites/default/files/2024-03/2489bcc5-3a6e-446a-bdd1-11a4cce17137/Performance_Year_Financial_and_Quality_Results_PUF_2022_01_01.csv` | 397,030 B, md5 `602a7134cced1ede500a4c7ab509733d`; 482 rows × 164 cols |
| E4 | PY2021 MSSP Results PUF | `https://data.cms.gov/sites/default/files/2023-09/e93c0c3b-9402-406f-ab49-61ec820ba0bf/Performance_Year_Financial_and_Quality_Results_2021_suppress.csv` | 469,381 B, md5 `9a53fc012688bd8c93acabd938768942`; 475 rows × 171 cols |
| E5 | QPP quality benchmarks, PY2023 | `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2023` | 168,827 B, md5 `1cf2032c6b87d37bd8a242e57c257555`; 525 rows |
| E6 | QPP quality benchmarks, PY2024 | `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2024` | 145,337 B, md5 `c1616da5de838eb2627df0c278f1c842`; 460 rows |
| E7 | QPP quality benchmarks, PY2025 | `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2025` | 145,955 B, md5 `68ef0db5b83df38b34479ef4be228ff3`; 480 rows |
| E8 | QPP quality benchmarks, PY2026 | `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2026` | 138,136 B, md5 `3c4ba299ad2f604f7852b3b9c5433400` — **matches the brief's hash exactly**; 450 rows |
| E9 | PY2021 MIPS Quality Benchmarks (historical) | `https://qpp-cm-prod-content.s3.amazonaws.com/uploads/1275/2021%20MIPS%20Quality%20Benchmarks.zip` | 753,689 B, md5 `7eb2e0f49ed0e5fccc4878c4dee3fbce` |
| E10 | PY2021 Performance Period Benchmarks | `https://qpp-cm-prod-content.s3.amazonaws.com/uploads/1973/2021%20Performance%20Period%20Benchmarks.zip` | 471,461 B, md5 `52512d1f3a7b73a0830a4a2b79701158` |
| E11 | PY2022 Quality Benchmarks (historical) | `https://qpp-cm-prod-content.s3.amazonaws.com/uploads/608/2022%20Quality%20Benchmarks.zip` | 987,659 B, md5 `7187964ba432d730698bff3c5460c15b` |
| E12 | PY2022 Performance Period Benchmarks | `https://qpp-cm-prod-content.s3.amazonaws.com/uploads/2469/PP2022MIPSQualityBenchmarks.zip` | 242,205 B, md5 `6df7e7a3dc9fd5c6a338535a903da961` |
| E13 | PUF Data Dictionary (Nov 2025, PY2024) | `https://data.cms.gov/sites/default/files/2025-11/0eb58c4e-6f40-497d-a90f-242151c20bb8/Data_Dictionary-Medicare_Shared_Savings_Program-Performance_Year_Financial_and_Quality_Results_2025_Nov2025.pdf` | field semantics quoted below |
| E14 | PY2025 APP Toolkit (scoring guide) | `https://qpp-cm-prod-content.s3.amazonaws.com/uploads/3244/2025%20APP%20Toolkit.zip` | operative scoring flowchart |
| E15 | eCFR Title 42 Part 425, full | `https://www.ecfr.gov/api/versioner/v1/full/2026-08-06/title-42.xml?part=425` | § 425.512 text |
| E16 | CY2024 PFS final rule (88 FR 78818), full text | `https://www.govinfo.gov/content/pkg/FR-2023-11-16/html/2023-24184.htm` | 4,792,816 B; source of the 88 FR 79121–79123 passages quoted in Findings 6–7, verified verbatim |

**Endpoint note.** `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/<year>` returns HTTP 500
for 2021 and 2022; the JSON sibling returns the single-page-app HTML shell, not data. PY2021/PY2022
benchmarks must be taken from the S3 workbooks (E9–E12), which have a **different schema**: there is
no "Benchmark Type" column — historical vs performance-period is expressed by *which workbook the row
lives in*, and the performance-period workbooks are published after the fact (PP2021 dated Sep 2022,
PP2022 dated Jun 2023).

---

## Finding 1 — `Recvd40p` is the EUC floor, not the benchmark floor (sub-question 1.5)

### The field's own definition

E13, verbatim, term name **"Extreme and Uncontrollable Circumstance- 40th Percentile
Adjustment-Quality"**:

> `Recvd40p` — "0/1 flag; **=1 if an ACO is determined to be affected by an EUC in PY 2024**, the
> ACO's quality score will be set to the higher of its quality score or the equivalent of the 40th
> percentile MIPS quality performance category score across all MIPS quality performance category
> scores, excluding entities/providers eligible for facility-based scoring; otherwise =0."

That is § 425.512**(c)(3)(iii)**, the EUC provision — not § 425.512(a)(7). The two are structurally
distinct: (c) triggers on *disaster/cyberattack designation*; (a)(7) triggers on *reduced available
points or a missing benchmark*. Both produce the identical numeric outcome (the higher of the ACO's
score or the 40th-percentile value), which is exactly why they are easy to conflate.

### The data confirms it, with no residual

Method: read E1, cross-tabulate `Recvd40p` against `DisAffQual` over all 476 rows. `DisAffQual` is
defined at E13 as "=1 if 20 percent or more of the ACO's Quarter four list assigned beneficiaries
reside in an area identified under the Quality Payment Program as being affected by an EUC; or the
ACO's legal entity is located in an area identified under the QPP as being affected by an EUC."

| | `DisAffQual=0` | `DisAffQual=1` | total |
|---|---|---|---|
| `Recvd40p=0` | 352 | 89 | 441 |
| `Recvd40p=1` | **0** | **35** | 35 |
| total | 352 | 124 | 476 |

- **35/35 floored ACOs are EUC-affected.** The empty cell is the finding.
- Of the 124 EUC-affected ACOs, 89 were *not* floored — and every one of them scored **at or above**
  77.05 (minimum 77.40). The floor simply did not bind for them.
- **35 ACOs sit at exactly 77.05, and all 35 carry `Recvd40p=1`.** Zero ACOs sit at the floor value
  without the flag.

So `Recvd40p` is fully explained as the mechanical conjunction
`DisAffQual = 1 AND organic quality score < 77.05`. There is no unexplained remainder that a
benchmark-driven floor could account for.

### What triggered the floor for those 35

**A federally-designated extreme and uncontrollable circumstance** — not a missing benchmark, and not
any particular measure or collection type. The PUF publishes no measure-level or collection-type-level
attribution, and **there is no PUF field at all identifying ACOs floored under § 425.512(a)(7)**.

Two further points rule out (a)(7) for this cohort:

- **8 of the 35 reported neither measure set** (`Report_WI = 0` and
  `Report_eCQM_CQM_MedicareCQM = 0`), and 5 of those failed
  `Met_SSP_quality_reporting_requirements` outright. § 425.512(a)(7)(i) requires the ACO to have
  *reported all of the required measures* and *received a MIPS Quality performance category score*.
  Those 8 are categorically ineligible for (a)(7); they are covered by § 425.512**(c)(2)(ii)**, which
  sets a *minimum* score for EUC-affected ACOs regardless of reporting.
- **10 of the 35 are Web Interface-only reporters.** A WI-only ACO submits no eCQM/MIPS CQM/Medicare
  CQM at all, so the (a)(7)(i)(B) trigger ("at least one of the eCQMs/MIPS CQMs/Medicare CQMs does
  not have a benchmark") cannot describe them.

### Characteristics of the 35

Full per-ACO extract: [`data/q1-py2024-recvd40p-acos.csv`](data/q1-py2024-recvd40p-acos.csv).

| Cut | The 35 floored | All 476 |
|---|---|---|
| **Reporting mechanism** | digital only 16 · WI only 10 · neither 8 · WI+digital 1 | digital only 76 · WI only 301 · neither 8 · WI+digital 91 |
| **Track** | EN 14 · A 10 · B 7 · E 4 | EN 205 · E 104 · B 103 · A 54 · C 5 · D 5 |
| **Median `N_AB`** | 9,996 (mean 16,454; range 2,647–116,175) | 13,446 among the other 441 |
| **Revenue** | Low 23 · High 12 | Low 274 · High 202 |
| **Agreement** | Renewal 17 · Initial 15 · Re-entering 3 | — |
| `Met_QPS` | 35/35 = 1 | 447/476 |
| `Met_40pctl` | 35/35 = 1 (by construction) | 390/476 |
| `Met_Incentive` | 11/35 | 122/476 |
| `Met_FirstYear` | 10/35 | 59/476 |
| `Met_SSP_quality_reporting_requirements` | 30/35 = 1, **5 = 0** | 471/476 |

**They are not a digital-reporter phenomenon.** Only 16 of 35 are digital-only, and 10 are WI-only.
They are smaller than average and skew toward BASIC A and ENHANCED. The one thing they share
completely is EUC designation.

**Are they digital reporters?** Of the 476, 77 ACOs have per-measure rates published under a digital
collection type (the PUF publishes rates for the higher-scoring measure set only, per E13). Among
the 35: 16 report digitally. So the floored group is *enriched* for digital reporting relative to the
cohort (46% vs 16%) — but that is a **score effect, not a benchmark effect**: digital reporters score
lower, so conditional on EUC designation they are likelier to fall below the floor and be lifted.

---

## Finding 2 — Four-year replication: the floor is routine, EUC-driven, and not an anomaly

The equivalent field exists in every year. It is `Recvd30p` for PY2021–PY2023 (§ 425.512(c)(2)(i)
sets the **30th** percentile for those years) and `Recvd40p` from PY2024 (§ 425.512(c)(2)(ii)).
Extract: [`data/q1-euc-floor-by-year.csv`](data/q1-euc-floor-by-year.csv).

| PY | field | floor value | N | flagged | % | `DisAffQual=1` | flagged ⊆ EUC? | at floor value w/o flag | min score among EUC-not-floored |
|---|---|---|---|---|---|---|---|---|---|
| 2021 | `Recvd30p` | 61.73 | 475 | 4 | 0.8% | **475 (100%)** | ✅ yes | **0** | 63.40 |
| 2022 | `Recvd30p` | 70.63 | 482 | 39 | 8.1% | **482 (100%)** | ✅ yes | **0** | 70.75 |
| 2023 | `Recvd30p` | 65.76 | 453 | 22 | 4.9% | **453 (100%)** | ✅ yes | **0** | 66.60 |
| 2024 | `Recvd40p` | 77.05 | 476 | 35 | 7.4% | 124 (26.1%) | ✅ yes | **0** | 77.40 |

**Four years, 100 floored ACOs, zero counterexamples.** In every year the flag is a strict subset of
`DisAffQual`; in every year every EUC-affected non-floored ACO scored above the floor; in every year
nobody sits at the floor value without the flag. The mechanism is identical each year and is entirely
the EUC provision.

**PY2021–PY2023 had universal EUC coverage** (`DisAffQual = 1` for 100% of ACOs — the COVID-19 public
health emergency). PY2024 is the first year in this window where EUC designation is selective
(26.1%), which is why PY2024 is the only year where the floor's *scope* is informative.

### Is incidence rising as ACOs move off the Web Interface?

Raw incidence is **not** monotonic (0.8% → 8.1% → 4.9% → 7.4%), and raw comparison is invalid because
the EUC base rate collapsed from 100% to 26% in PY2024. Conditioning on EUC designation:

| PY | digital-only ACOs | of those, EUC | floored | **P(floor \| digital-only, EUC)** | WI-only ACOs | of those, EUC | floored | **P(floor \| WI-only, EUC)** |
|---|---|---|---|---|---|---|---|---|
| 2021 | 6 | 6 | 0 | **0.0%** | 459 | 459 | 1 | 0.2% |
| 2022 | 22 | 22 | 16 | **72.7%** | 442 | 442 | 19 | 4.3% |
| 2023 | 33 | 33 | 16 | **48.5%** | 379 | 379 | 4 | 1.1% |
| 2024 | 76 | 19 | 16 | **84.2%** | 301 | 80 | 10 | 12.5% |

Digital-only reporters are floored at **7–17× the WI-only rate** in every year from 2022 on, and the
conditional rate reached 84% in PY2024. The digital-only population itself grew 6 → 22 → 33 → 76.

**But this rise is about scores, not benchmarks.** The floor still requires EUC designation. In
PY2024, **46 digital-only ACOs scored below 77.05 and were *not* floored** — because they were not
EUC-affected. Their scores run from 34.29 to 77.01. That is the operative fact for PY2026 planning:
as EUC coverage normalises, the EUC floor rescues a shrinking fraction of the low scorers that the
shift off the Web Interface produces.

---

## Finding 3 — Benchmark coverage census for the APP / APP Plus required set, PY2021–PY2026

Extract: [`data/q1-app-benchmark-coverage.csv`](data/q1-app-benchmark-coverage.csv).

### Establishing the required measure set per year, from the data

The QPP benchmark files label the Medicare CQM rows
`"<id>SSP (Only available for SSP ACOs reporting the APP Plus)"`. Because that collection type exists
*only* for the APP/APP Plus set, its roster **is** the ACO-reported measure set for that year:

| PY | Medicare CQM roster | n |
|---|---|---|
| 2023 | *(collection type does not exist)* | 0 |
| 2024 | 001SSP, 134SSP, 236SSP | 3 |
| 2025 | 001SSP, **112SSP**, 134SSP, 236SSP | 4 |
| 2026 | 001SSP, 112SSP, **113SSP**, 134SSP, 236SSP | 5 |

This independently reproduces the APP Plus phase-in and the Complex Organization Adjustment
progression CMS describes (4 points PY2025 → 5 PY2026 → 6 PY2027), and it confirms the brief's
"five-measure" PY2026 set. **It also establishes that 438 (statin therapy) is *not* in the APP Plus
required set for PY2025** — which matters, because 438 lacked both eCQM and MIPS CQM benchmarks in
PY2025 and would otherwise have been a live § 425.512(a)(7)(ii)(B) trigger.

### Which required cells lacked a pre-year benchmark

| PY | Cell(s) lacking a pre-year (historical) benchmark | Reason CMS gave | What happened at scoring |
|---|---|---|---|
| **2021** | **134 eCQM** | no historical benchmark (`N`) | **Performance-period benchmark published** (E10) → scored |
| **2022** | **134 eCQM, 236 eCQM** | "Benchmark removed due to **measure suppression** for PY 2022" | **No benchmark of any kind** — "suppressed … won't be scored against a benchmark (historical or performance period)" → **excluded** |
| **2023** | *none* | — | all of 001/134/236 had historical benchmarks under eCQM and MIPS CQM |
| **2024** | **Medicare CQM 001/134/236** (new collection type, no history at all); **134 eCQM, 236 eCQM** (PY2022 baseline was suppressed) | — | **Performance-period benchmarks published for all five cells** → scored |
| **2025** | *none in the required set* | — | 001/112/134/236 all had historical benchmarks under eCQM, MIPS CQM, and Medicare CQM |
| **2026** | **112 eCQM, 112 MIPS CQM, 113 eCQM, 113 MIPS CQM** | "Insufficient volume of data submitted in PY 2024 to establish historical benchmark" | **Unresolved as of 2026-08-08** — see Finding 5 |

Two corroborating details:

- **PY2024's 134/236 eCQM gap is causally downstream of PY2022's suppression.** Historical benchmarks
  use a two-year lookback (the PY2026 file's own comment says "insufficient volume … in PY **2024**";
  the PY2025 file says "PY **2023**"). PY2024's historical benchmark for 134/236 eCQM would have come
  from PY2022 data — which CMS had suppressed. CMS's response was to **build performance-period
  benchmarks**, not to exclude.
- **PY2026 Medicare CQM 112/113 carry synthetic flat bands.** `112SSP` and `113SSP` have
  `Average Performance Rate = "--"` and deciles that are perfectly uniform 10-point-wide bands
  (`1.00 - 9.99`, `10.00 - 19.99`, … `>= 90.00`) — no empirical distribution exists behind them.
  Contrast `001SSP`/`134SSP`/`236SSP` in the same file, which carry real deciles and populated average
  rates **numerically identical to their PY2024 performance-period values** (25.78, 62.87, 67.87) —
  CMS carried the PY2024 performance-period benchmark forward as the PY2026 "Historical" benchmark.

---

## Finding 4 — The decisive test: PY2024 Medicare CQM

**Setup.** Medicare CQM was introduced as a collection type in PY2024. The PY2023 benchmark file (E5)
contains **zero** Medicare CQM rows — no pre-year benchmark existed, and could not have. This is a
structurally *cleaner* version of the PY2026 112/113 situation: not merely thin data, but no data.

**What CMS did.** The PY2024 file (E6) carries `001SSP`, `134SSP`, `236SSP` under Medicare CQM with
`Benchmark Type = "Performance Period"`.

**What happened to the ACOs.** 26 ACOs have Medicare CQM rates published in E1. All 26 have
`Met_SSP_quality_reporting_requirements = 1`. Their scores:

- 19 received ordinary, non-floor scores spanning **34.29 to 92.87**.
- 7 sit at 77.05 — and **all 7 carry `Recvd40p = 1` and `DisAffQual = 1`** (EUC).
- **14 scored below 77.05 and were not floored** (34.29, 35.95, 41.35, 50.89, 55.28, 56.82, 58.18,
  60.65, 70.80, 71.04, 71.85, 74.56, 75.08, 75.94). Every one has `Recvd40p = 0`, `DisAffQual = 0`.

**Why this settles the brief's load-bearing ambiguity.** The brief asks whether *"does not have a
benchmark"* in § 425.512(a)(7) means "no benchmark published before the performance year" or "no
benchmark at the time scoring occurs."

If it meant **pre-year**, then every one of those 26 ACOs had a required measure with no pre-year
benchmark, § 425.512(a)(7)(i)(B) would have fired, and all 26 would have been lifted to 77.05.
**Fourteen were not.** The same argument applies to PY2024 eCQM reporters, whose 134 and 236 were
likewise scored on performance-period benchmarks.

**Therefore: CMS reads "has a benchmark" as satisfied by a performance-period benchmark, evaluated at
scoring time.** This is CMS operational practice evidenced by outcome data, and it is corroborated by
the PY2025 APP Toolkit's own wording (E14): *"Under the APP, measures without a historical **or
performance period** benchmark are excluded from scoring as long as data completeness is met."* The
disjunction is the whole point — the performance-period route is tried first.

---

## Finding 5 — The QPP benchmark file is refreshed retrospectively (a methodological trap)

Counting `Benchmark Type` across the four machine-readable files:

| PY | Historical | **Performance Period** | `--` (no benchmark) | total |
|---|---|---|---|---|
| 2023 | 265 | **88** | 172 | 525 |
| 2024 | 237 | **85** | 138 | 460 |
| 2025 | 257 | **0** | 223 | 480 |
| 2026 | 254 | **0** | 196 | 450 |

PY2023 and PY2024 are the completed-and-scored years; PY2025 and PY2026 are not. A performance-period
benchmark is by definition computable only *after* the performance period closes, so its presence in
a file is proof the file has been refreshed post-scoring. The PY2023 file's own comments confirm this
— e.g. measure 264 MIPS CQM reads "Insufficient volume of data submitted in **PY 2023** to establish
a **performance period** benchmark," a statement that could not have been written before PY2023 ended.

The PY2021/PY2022 workbooks (E9–E12) make the same point through file structure rather than a column:
historical and performance-period benchmarks ship as **separate ZIPs**, with the performance-period
workbooks dated **Sep 2022** and **Jun 2023** respectively — i.e. published after their performance
years closed.

**Consequence for the brief.** The PY2026 file's `Measure has a Benchmark = No` for 112/113 under
eCQM and MIPS CQM is a **pre-scoring** status. It is *not* evidence that those cells will lack a
benchmark at scoring, and it should not be cited as such. The comparable pre-scoring snapshot for
PY2024 would also have shown Medicare CQM with no benchmark — and that cell ended up scored.

**Where the data cannot decide.** Whether CMS *will* create a PY2026 performance-period benchmark for
112/113 under eCQM and MIPS CQM is **not knowable from any file available on 2026-08-08**. The PY2025
file still shows zero performance-period rows as of today, so the refresh for PY2025 has not yet
happened either; PY2025 MSSP results are due around September 2026 and will be the next observation.

One structural argument, offered as inference and labelled as such: the stated obstacle is
*"insufficient volume of data submitted in PY 2024."* The benchmark-volume rule at
§ 414.1380(b)(1)(ii)(A) requires **at least 20** reporters meeting case minimum and data completeness.
In PY2024, 112 and 113 were not in the APP required set under eCQM/MIPS CQM at all. In PY2026 they are
required of every APP Plus ACO reporting all-payer, so PY2026's own submission volume should exceed
the threshold by a wide margin even though PY2024's did not. That makes the performance-period route
*mechanically available* in a way it was not for the baseline year. It does not prove CMS will use it.

---

## Finding 6 — Scored vs excluded is **not** distinguishable from the PUF (negative result)

The brief asks whether digital-only reporters' scores cluster at values consistent with a 60-point
denominator, an 80-point denominator, or the floor. **They do not cluster at all, and the denominator
is not recoverable.** Two tests:

### Test A — arithmetic grid fit (fails; reported so it is not repeated)

MIPS measure achievement points are awarded in tenths, so if the denominator were *D* available
points, `QualScore × D / 100` should land near a multiple of 0.1. Published `QualScore` is rounded to
2 dp, so the rounding-induced error is at most `D/2000` — well under the 0.05 needed for the test to
have power. Mean absolute residual from the nearest 0.1-point grid, PY2024:

| D | 50 | 60 | 70 | 80 | 90 | 100 | 110 | 120 | 130 | 140 |
|---|---|---|---|---|---|---|---|---|---|---|
| digital-only (n=60) | .0243 | .0264 | .0242 | .0253 | .0248 | .0247 | .0265 | .0255 | .0262 | .0263 |
| WI-only (n=291) | .0249 | .0258 | .0251 | .0244 | .0251 | .0244 | .0264 | .0250 | .0257 | .0246 |

The expected residual for **uniform noise** is exactly 0.0250. Every cell sits at the noise floor, for
every candidate denominator, in both groups. There is **no signal**. The cause is that `QualScore` is
a rounded percentage that already incorporates an unpublished health-equity / population-and-income
adjustment bonus (§ 425.512(b)), and the PUF contains **no field** for that bonus, for measure-level
achievement points, or for total available measure achievement points. The denominator is simply not
in the public data.

### Test B — mass points (informative, and it points away from exclusion)

Most-repeated `QualScore` values per year, out of ~450–480 ACOs:

| PY | top repeated values (count) |
|---|---|
| 2021 | **100.00 (50)** · **61.73 (4)** · 92.06 (3) · 95.05 (3) |
| 2022 | **70.63 (39)** · 85.05 (3) · 80.80 (3) · 86.70 (3) |
| 2023 | **65.76 (22)** · 87.27 (3) · 85.76 (3) · 85.38 (3) |
| 2024 | **77.05 (35)** · 82.45 (3) · 90.84 (3) · 79.78 (3) |

The **only** mass point in any year is the EUC floor value (plus the 100.00 ceiling in PY2021, an
artifact of the § 425.512(b) cap during universal COVID relief). Every other value repeats at most 3
times. A systematic denominator change affecting a subgroup would tend to produce additional
clustering or a discontinuity; none is present.

PY2024 digital-only organic scores (n=60, excluding the EUC-floored) run **continuously from 34.29 to
92.87** with p25/p50/p75 = 58.21 / 70.97 / 76.21. That smooth, wide spread is what ordinary decile
scoring produces. It is consistent with normal scoring on a full denominator, and shows no sign of a
truncated one — but, per Test A, it cannot **exclude** a truncated denominator either.

**Bottom line for this sub-question: the answer is "the PUF cannot settle it."** The distributional
evidence is consistent with (a) and inconsistent with a floor operating on anything other than EUC,
but it does not by itself discriminate 60 vs 80 available points.

**However, the question is answered elsewhere — by preamble, not by data.** CMS stated at
**88 FR 79122** that the PY2022 exclusions reduced affected ACOs' total available measure achievement
points **by 10 per excluded measure** (Finding 7). So when exclusion *does* occur, the denominator
demonstrably shrinks by 10 points per measure, exactly as § 414.1367(c)(1)(i) provides. What the PUF
cannot tell you is *which ACOs, if any, had it happen* — only CMS's narrative does, and only for
PY2022.

### Score distributions by reporting mechanism (organic only — EUC-floored ACOs removed)

| PY | mechanism | n | floored | organic n | p25 | median | p75 | min | max |
|---|---|---|---|---|---|---|---|---|---|
| 2024 | WI only | 301 | 10 | 291 | 80.97 | 84.63 | 89.03 | 45.58 | 98.56 |
| 2024 | WI+digital | 91 | 1 | 90 | 82.03 | 85.77 | 89.46 | 69.50 | 98.69 |
| 2024 | **digital only** | 76 | 16 | 60 | **58.21** | **70.97** | **76.21** | 34.29 | 92.87 |
| 2023 | WI only | 379 | 4 | 375 | 79.82 | 83.68 | 86.91 | 66.97 | 96.30 |
| 2023 | **digital only** | 33 | 16 | 17 | 70.31 | 74.26 | 80.76 | 66.60 | 91.45 |
| 2022 | WI only | 442 | 19 | 423 | 78.78 | 82.54 | 86.31 | 70.75 | 98.35 |
| 2022 | **digital only** | 22 | 16 | 6 | 74.40 | 75.49 | 77.80 | 73.00 | 91.21 |

Percentiles use linear interpolation between order statistics (NumPy `method="linear"` / Hyndman &
Fan Type 7), matching the convention in `mssp-py2024-results.md`.

---

## Finding 7 — PY2022 is the one observed exclusion, and its cause does not transfer

Verified directly from E11/E12 (not taken on trust). PY2022 historical workbook, `Measure has a
Benchmark` and `Reason for No Historical Benchmark`:

| measure | eCQM | MIPS CQM | Part B Claims |
|---|---|---|---|
| 001 | Y | Y | Y |
| **134** | **N/A** — *"Benchmark removed due to measure suppression for PY 2022."* | Y | Y |
| **236** | **N/A** — *"Benchmark removed due to measure suppression for PY 2022."* | Y | Y |
| 113 | **N/A** — same suppression note | Y | Y |
| 226 | N — *"Substantive changes to specification in PY 2021; PY 2022 measure can't be compared to PY 2020 measure"* | N — same | N — same |

PY2022 performance-period workbook, `Reason for No Performance Period Benchmark`:

- **134 eCQM, 236 eCQM, 113 eCQM** → `N`, *"This measure has been suppressed for the 2022 performance
  period and won't be scored against a benchmark (historical or performance period)."*
- **226 eCQM and 226 MIPS CQM** → `Y` — **performance-period benchmarks were granted.**

**The contrast inside a single year is the finding.** Faced with two different causes of a missing
historical benchmark, CMS did two different things:

- cause = **measure suppression** (134, 236, 113 eCQM) → refused a performance-period benchmark,
  measure excluded;
- cause = **specification change / non-comparable baseline** (226) → **granted** a performance-period
  benchmark, measure scored.

ACOs did report the affected cells: in E3, 13 ACOs have `QualityID_134_eCQM` populated and 6 have
`QualityID_236_eCQM`. § 425.512(a)(7) did not exist for PY2022 (it begins with PY2024), so no floor
was available.

**CMS confirmed the denominator effect in writing, and quantified it.** CY2024 PFS final rule,
**88 FR 79122** (verified verbatim 2026-08-08 from
`https://www.govinfo.gov/content/pkg/FR-2023-11-16/html/2023-24184.htm`):

> "In performance year 2022, two of the eCQMs/MIPS CQMs that are part of the APP measure set were
> excluded from MIPS measure achievement points and total available measure achievement points for
> the MIPS Quality performance category **under Sec. 414.1380(b)(1)(vii)(A)**. Specifically, the eCQM
> version of the … measure (Quality ID #134) and the Controlling High Blood Pressure measure (Quality
> ID #236) were excluded. Thus, under MIPS scoring policies, ACOs reporting one or both of these
> measures had their total measure achievement points and total available measure achievement points
> **reduced by 10** (for reporting one measure) **or 20** (for reporting both measures) points,
> respectively. Under the APP, these ACOs were still required to report all **6 measures**; however,
> their performance year 2022 MIPS Quality performance category score was based on the **4 or 5
> non-excluded measures**."

Three things follow, and one is a correction to how this episode is usually described:

1. **CMS attributes the PY2022 exclusion to § 414.1380(b)(1)(vii)(A) — the *significant changes /
   suppression* provision — not to the benchmark provision.** The benchmark removal was a
   *consequence* of the suppression, not the reason for exclusion. In § 425.512(a)(7) terms, PY2022
   is a **prong (A)** event. **Prong (B) — "does not have a benchmark" — still has no observed
   instance anywhere in the record.**
2. **Exclusion removes 10 *available* points per measure**, confirming that the denominator shrinks
   and not merely the numerator.
3. **The PY2022 APP denominator was 6 measures = 60 points** (3 eCQM/MIPS CQM + CAHPS + 2
   administrative claims), reduced to 50 or 40. This is direct CMS confirmation of the per-measure
   10-point structure the brief assumes, and by extension of the **80-point** PY2026 APP Plus
   denominator (5 measures + CAHPS + 2 claims = 8 × 10).

This episode is also what motivated § 425.512(a)(7): the floor was written *in response to* PY2022,
which is why its first effective year is PY2024, two years later.

For completeness, the same page derives the PY2024 floor value: *"summing the 2020 (75.59), 2021
(77.83), and 2022 (77.73) 40th percentile Quality performance category score values … 231.15 … divide
… by three … **77.05** for performance year 2024."* That is the value observed on all 35 floored ACOs.

**PY2026's 112/113 are not suppressed measures.** Their stated cause — *"insufficient volume of data
submitted in PY 2024 to establish historical benchmark"* — is a data-availability cause, the 226
pattern, not the suppression pattern. On CMS's own revealed rule, that points to a performance-period
benchmark.

**This also puts a caveat on CMS's July 2026 preamble claim** (91 FR 44053) that *"none of the eCQMs,
MIPS CQMs, or Medicare CQMs that Shared Savings Program ACOs have reported over the past four PYs
lacked benchmarks."* If "the past four PYs" means PY2022–PY2025, the claim is **contestable for
PY2022**, where 134 eCQM and 236 eCQM demonstrably had no benchmark of any kind and 13 and 6 ACOs
respectively reported them. The claim is defensible only if CMS treats *suppressed* measures as a
separate category from *benchmark-less* ones — which its Appendix G gloss of § 425.512(a)(7)(A) as
applying "due to measure suppression" suggests it may. Either way, the preamble sentence should not be
relied on as a clean four-year negative.

---

## Finding 8 — The rule's sequence vs. what has been observed

The two mechanisms in Question 1 are **not alternatives** as a matter of law; they compose, at two
different levels, and § 425.512(a)(7)'s two prongs map onto two different causes:

| Level | Mechanism | Trigger |
|---|---|---|
| Measure | Try a performance-period benchmark first. If none can be built, exclude the measure from **both** total measure achievement points and total available measure achievement points (§ 414.1367(c)(1)(i)) — denominator −10. The measure must still be *reported*, or it scores a hard 0 out of 10. | no benchmark of any kind |
| ACO composite | Floor the quality score at the 40th-percentile MIPS value — `max(ACO score, 40th pct)`. | **(A)** available points reduced by *measure suppression* under § 414.1380(b)(1)(vii)(A), **or** **(B)** a required measure lacks a benchmark |

So the brief's option (d) — "some combination or sequence" — is the legally correct description, and
(b) and (c) are stages of one process rather than rivals. Note the floor is a **floor on the
composite**, not a substitute *benchmark* at the measure level: no measure is ever scored "at the
40th percentile."

**But observationally, only the first stage has ever engaged, and only once.** Across PY2021–PY2024:

- the performance-period route fired in PY2021, PY2022 (measure 226) and PY2024 — every time the
  cause was thin or non-comparable data;
- the exclusion stage fired once, in PY2022, and only because of affirmative measure suppression;
- **the ACO-level floor has never fired on either prong.** Prong (A) requires suppression, and no APP
  measure was suppressed in PY2024 or PY2025; prong (B) requires a benchmark-less required measure,
  and none existed at scoring in PY2024 or PY2025. Every one of the 100 observed floors in four years
  is the *EUC* floor under § 425.512(c), a different provision entirely.

The floor was created in the CY2024 rulemaking as a **response to the PY2022 suppression episode** —
which is why its first effective year is PY2024, two years after the event that motivated it. It has
been on the books for three performance years without a single observed application, and CMS has
proposed to delete prong (B) outright for PY2027+.

---

## What the data can and cannot settle

### Settled by the data

| Claim | Evidence |
|---|---|
| `Recvd40p` / `Recvd30p` is the **EUC** floor, not the missing-benchmark floor | 4 years, 100 flagged ACOs, 100% subset of `DisAffQual`, zero at the floor value without the flag |
| The § 425.512(a)(7) missing-benchmark floor has **never been observed to fire** | PY2024 is its first eligible year; no required cell lacked a benchmark at scoring; no PUF field records it |
| CMS builds **performance-period benchmarks** for required APP cells lacking a pre-year benchmark | PY2021 (134 eCQM), PY2022 (226), PY2024 (Medicare CQM ×3; 134 and 236 eCQM) |
| CMS treats a performance-period benchmark as satisfying "has a benchmark" | 14 PY2024 Medicare CQM ACOs scored below 77.05 and were **not** floored |
| The benchmark CSV is **refreshed post-scoring**; the PY2026 "no benchmark" status is provisional | 88 and 85 performance-period rows in the 2023/2024 files, **0** in 2025/2026 |
| The APP Plus required set is 4 measures in PY2025, 5 in PY2026; **438 is not in it for PY2025** | Medicare CQM roster in E7/E8 |
| Exclusion (option b) is real but has fired only for **suppressed** measures | PY2022 eCQM 134/236, verbatim CMS reason text |

### Not settled — and not settleable from public data today

1. **What CMS will do for PY2026 112/113 under eCQM and MIPS CQM.** PY2026 has not been scored. The
   benchmark file will not show the answer until it is refreshed, which on the PY2023/PY2024 pattern
   happens well after the March 2027 submission deadline. **No ACO can know its PY2026 ladder for
   these cells before choosing a collection type** — which is itself the answer to sub-question 1.4.
2. **Whether a benchmark-less measure's exclusion changes the denominator in any specific PUF row.**
   The PUF publishes no achievement points, no available points, and no adjustment bonus. Test A
   above shows the denominator is not recoverable from `QualScore`. This is a hard limit, not a gap
   in effort.
3. **Whether the § 425.512(a)(7) floor and § 414.1367(c)(1)(i) exclusion compose** (sub-question 1.6).
   No observation exists because the floor has never fired on the benchmark trigger.
4. **Whether the COA point survives exclusion** (Question 2). Nothing in the PUFs speaks to it; there
   is no COA field.
5. **PY2025 outcomes.** The PY2025 PUF does not exist yet (due ~September 2026). Since no PY2025
   required cell lacked a benchmark, it is unlikely to show an (a)(7) firing either — but it will
   show whether the PY2025 benchmark file gains performance-period rows on refresh, which is the
   closest available forecast of PY2026 behaviour.

### Bearing on the brief's decision

**Formally the answer is (d):** (a), (b) and (c) are stages of one sequence, not rival readings —
try a performance-period benchmark; if none can be built, exclude the measure and shrink the
denominator by 10; then floor the composite (Finding 8).

**Operationally the answer is (a).** Stage 1 resolves the question every time the cause is thin or
non-comparable data — three instances in the APP set (PY2021 measure 134 eCQM, PY2022 measure 226,
PY2024 Medicare CQM and 134/236 eCQM) and no instance where thin data alone reached stage 2. The
single exclusion precedent (PY2022) was driven by measure *suppression*, a cause absent for 112/113.
The floor has never fired on the benchmark trigger in four years of PUFs, and CMS has proposed to
delete that trigger entirely for PY2027+.

For the simulator this argues for keeping the **80-point denominator** as the default for PY2026 and
presenting the 112/113 ladders as *unknowable at decision time* rather than absent — with the
60-point exclusion branch retained as a live minority case, since stage 2 is real, has fired before,
and cannot be ruled out for PY2026 from anything published today.

Two caveats against over-reading this. First, none of it is a *promise*: CMS has published nothing
addressing 112/113 for PY2026 specifically, and the PY2026 file's status is provisional in both
directions. Second, CMS's asymmetric treatment inside the PY2026 file is a real signal and cuts the
other way — it published **synthetic flat bands** for 112/113 under **Medicare CQM** while leaving
eCQM and MIPS CQM with no benchmark at all. CMS knew those cells were empty and chose to fill only
one of them. That is consistent with CMS intending the all-payer cells to be resolved later by a
performance-period benchmark, and equally consistent with CMS intending them to be excluded. The data
does not distinguish those two intentions.

---

## Reproducing

Downloads live in `/home/jmandel/hobby/.agent-scratch/q1-empirical` and
`/home/jmandel/hobby/.agent-scratch/q1-bench2122`. Raw PUFs and benchmark files are not committed.

```bash
D=/home/jmandel/hobby/.agent-scratch/q1-empirical; mkdir -p "$D"
for y in 2023 2024 2025 2026; do
  curl -sSL -o "$D/bench_$y.csv" "https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/$y"
done   # 2021 and 2022 return HTTP 500 — use the S3 workbooks E9-E12 instead
curl -sSL -o "$D/puf_2023.csv" "https://data.cms.gov/sites/default/files/2024-10/7d0067f6-55c1-4121-bcad-a4b7b45defb1/PY%202023%20ACO%20Results%20PUF.csv"
curl -sSL -o "$D/puf_2022.csv" "https://data.cms.gov/sites/default/files/2024-03/2489bcc5-3a6e-446a-bdd1-11a4cce17137/Performance_Year_Financial_and_Quality_Results_PUF_2022_01_01.csv"
curl -sSL -o "$D/puf_2021.csv" "https://data.cms.gov/sites/default/files/2023-09/e93c0c3b-9402-406f-ab49-61ec820ba0bf/Performance_Year_Financial_and_Quality_Results_2021_suppress.csv"
```

Field notes for anyone repeating this:

- **PY2021 `QualScore` carries a `%` suffix**; PY2022–PY2024 do not. Strip it before parsing.
- The floor flag is **`Recvd30p`** in PY2021–PY2023 and **`Recvd40p`** in PY2024+.
- Reporting-mechanism flags are `Report_WI` plus `Report_eCQM`/`Report_CQM` (PY2021),
  `Report_eCQM_CQM` (PY2022–PY2023), `Report_eCQM_CQM_MedicareCQM` (PY2024).
- Per-measure `QualityID_*` fields are **performance rates, not points**, and per E13 are published
  only for the **higher-scoring** measure set when an ACO reported both WI and digital.
- Collection type actually used is inferable from which of `QualityID_{001,134,236}_{eCQM,MIPSCQM,MedicareCQM}`
  are populated; measures 112/113/318/110/226/438/370 carry **no** collection-type suffix in the
  PY2024 PUF because they were Web Interface-only in the PY2024 APP set.
- In the QPP benchmark CSVs, Medicare CQM measure IDs are suffixed `SSP` and carry parenthetical
  text, so match on `Measure ID.split()[0]` after stripping `SSP`, not on exact equality.
