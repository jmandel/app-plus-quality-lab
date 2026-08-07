# PY2026 QPP Quality Benchmark Cutpoints — APP Plus Five eCQM/MIPS CQM/Medicare CQM Measures

Independent ground-truth extract for measures **001, 134, 236, 112, 113** across collection types
**eCQM, MIPS CQM, Medicare CQM** (Medicare Part B Claims included for completeness).
Retrieved **2026-08-07**. Nothing in this file is derived from the app's own source.

## Headline findings

1. **Measures 112 (Breast Cancer Screening) and 113 (Colorectal Cancer Screening) have NO PY2026
   benchmark for eCQM, MIPS CQM, or Medicare Part B Claims.** All six of those cells carry
   `Measure has a Benchmark = No` and the comment *"Insufficient volume of data submitted in PY 2024
   to establish historical benchmark."* Only the **Medicare CQM** cell has a benchmark for 112/113,
   and it is a **flat** benchmark. This is a regression from PY2025, when 112 and 113 had full
   historical benchmarks for eCQM, MIPS CQM, and Claims.
2. **The CSV's `Benchmark Type` column is unreliable.** It contains only `Historical` or `--` —
   it *never* says "Flat". Six PY2026 rows carrying the canonical flat-percentage decile ladder are
   nevertheless labelled `Historical`. Flat status must be inferred from the decile pattern (or read
   from CMS prose). See "Caveats" for the corroborating CMS language.
3. **134 MIPS CQM is topped out with a 7-point cap** (confirmed, as expected), and so is
   **134 Medicare Part B Claims**. No other target cell is topped out in PY2026.
4. **PY2026 is the first year Medicare CQM has real historical benchmarks** for 001, 134, and 236
   (in PY2025 every Medicare CQM cell was flat). 112/113 Medicare CQM remain flat.
5. **The CY2027 PFS proposed rule (CMS-1848-P) would retroactively undo finding 4 for PY2026**:
   it proposes scoring 001, 134, and 236 Medicare CQM with *flat* benchmarks "for PY 2026 (and
   subsequent PYs)". That is the A/B fork this dataset is meant to support.

## Sources

| # | Source | URL | Retrieved | How fetched |
|---|---|---|---|---|
| S1 | QPP PY2026 quality benchmarks CSV | https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2026 | 2026-08-07 | `curl` -> HTTP 200, 138,136 bytes, `text/csv`, 450 data records. MD5 `3c4ba299ad2f604f7852b3b9c5433400` |
| S2 | QPP PY2025 quality benchmarks CSV (comparison) | https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2025 | 2026-08-07 | `curl` -> HTTP 200, 145,955 bytes, 480 data records. MD5 `68ef0db5b83df38b34479ef4be228ff3` |
| S3 | MSSP Quality Performance Standard: PY2026 40th Percentile MIPS Quality Performance Category Score (CMS, **December 2025**) | https://www.cms.gov/files/document/medicare-shared-savings-program-quality-performance-standard-performance-year-2026-40th-percentile.pdf | 2026-08-07 | `curl` with browser UA -> HTTP 200 PDF, 266,777 bytes; text via `pdftotext -layout`. (Plain WebFetch returns 403.) |
| S4 | CY2027 PFS Proposed Rule (CMS-1848-P) — MSSP fact sheet, dated **July 14, 2026** | https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2027-medicare-physician-fee-schedule-proposed-rule-cms-1848-p-medicare-shared | 2026-08-07 | `curl` with browser UA -> HTTP 200 HTML (WebFetch returns 403); tags stripped locally |

Both benchmark URLs from the app's session notes still work as **GET** requests. Note that
`HEAD` on the benchmarks-csv endpoint returns **404** — the endpoint does not implement HEAD, so a
HEAD-based liveness check will produce a false negative.

## Method

1. `curl` S1 and S2 into `/home/jmandel/hobby/.agent-scratch/qpp-benchmarks/`; MD5s recorded above
   and in the JSON.
2. Parse with Python `csv.DictReader` (`encoding='utf-8-sig'`). Header columns, verbatim:
   `Measure Title, Measure ID, CMS eCQM ID, Collection Type, Measure Type, High Priority, Inverse,
   Average Performance Rate, Measure has a Benchmark, Benchmark Type, Decile 1 ... Decile 10,
   Topped Out, Seven Point Cap, Comments ` — note the **trailing space in `Comments `**.
3. Select rows whose `Measure ID` begins with one of the five target measure numbers (the raw IDs
   carry suffixes; see the naming table below).
4. Classify each row's effective benchmark type by matching its 10 decile strings against the two
   canonical flat-percentage ladders (normal and inverse). Recorded as
   `benchmark_type_effective` in the JSON, separate from the file's own
   `benchmark_type_as_published`.
5. Corroborate the flat/historical split against CMS prose in S3 and S4.

## Key numbers

### Exact naming in the file

`Collection Type` values present anywhere in the PY2026 file (verbatim, both years identical):

`CAHPS Survey Vendor`, `MIPS CQM`, `Medicare CQM`, `Medicare Part B Claims`, `QCDR Measure`, `eCQM`

**Watch the `Measure ID` field — it is not a bare number.** Joining on it requires normalization:

| Collection type | `Measure ID` string as published (PY2026) |
|---|---|
| eCQM / MIPS CQM / Medicare Part B Claims, measure 001 | `001` |
| eCQM / MIPS CQM / Medicare Part B Claims, measure 134 | `134` |
| eCQM / MIPS CQM / Medicare Part B Claims, measure 236 | `236` |
| eCQM / MIPS CQM / Medicare Part B Claims, measure 112 | `112 (Not available in Traditional MIPS)` |
| eCQM / MIPS CQM / Medicare Part B Claims, measure 113 | `113 (Not available in Traditional MIPS)` |
| **Medicare CQM**, all five | `001SSP (Only available for SSP ACOs reporting the APP Plus)` etc. — i.e. `<NNN>SSP (Only available for SSP ACOs reporting the APP Plus)` |

`CMS eCQM ID` for PY2026: 001 = `CMS122v14`, 112 = `CMS125v14`, 113 = `CMS130v14`,
134 = `CMS2v15`, 236 = `CMS165v14`. It is `N/A` for every non-eCQM row.

### PY2026 coverage matrix (measure x collection type)

`H` = historical benchmark, `F` = flat-percentage benchmark, **`NONE`** = no published PY2026 benchmark.

| Measure | eCQM | MIPS CQM | Medicare CQM | Medicare Part B Claims |
|---|---|---|---|---|
| 001 Glycemic >9% (inverse) | H | F | H | F |
| 134 Depression screening | H (topped out: no) | H — **topped out, 7-pt cap** | H | H — **topped out, 7-pt cap** |
| 236 Controlling High BP | H | F | H | F |
| 112 Breast cancer screening | **NONE** | **NONE** | F | **NONE** |
| 113 Colorectal screening | **NONE** | **NONE** | F | **NONE** |

The six `NONE` cells all carry the identical comment:
> Insufficient volume of data submitted in PY 2024 to establish historical benchmark.

### PY2026 full decile cutpoints

Decile cells are reproduced verbatim from the CSV. For measure 001 (inverse) the ranges run
*downward* — a lower rate is better, so D10 is `<= x`. For all other measures D10 is `>= x` or
`100.00`. A `--` cell inside an otherwise-populated ladder means the decile collapsed away, which is
the signature of a topped-out measure.

#### Measure 001 — Diabetes: Glycemic Status Assessment Greater Than 9% (inverse)

| Decile | eCQM | MIPS CQM | Medicare CQM | Medicare Part B Claims |
|---|---|---|---|---|
| D1 | `99.49 - 93.99` | `99.00 - 90.01` | `80.94 - 49.20` | `99.00 - 90.01` |
| D2 | `93.98 - 71.69` | `90.00 - 80.01` | `49.19 - 38.29` | `90.00 - 80.01` |
| D3 | `71.68 - 49.54` | `80.00 - 70.01` | `38.28 - 29.77` | `80.00 - 70.01` |
| D4 | `49.53 - 36.73` | `70.00 - 60.01` | `29.76 - 25.94` | `70.00 - 60.01` |
| D5 | `36.72 - 29.54` | `60.00 - 50.01` | `25.93 - 22.28` | `60.00 - 50.01` |
| D6 | `29.53 - 24.86` | `50.00 - 40.01` | `22.27 - 18.94` | `50.00 - 40.01` |
| D7 | `24.85 - 20.87` | `40.00 - 30.01` | `18.93 - 14.34` | `40.00 - 30.01` |
| D8 | `20.86 - 17.19` | `30.00 - 20.01` | `14.33 - 10.15` | `30.00 - 20.01` |
| D9 | `17.18 - 12.51` | `20.00 - 10.01` | `10.14 - 7.04` | `20.00 - 10.01` |
| D10 | `<= 12.50` | `<= 10.00` | `<= 7.03` | `<= 10.00` |
| **Effective benchmark type** | Historical | Flat percentage | Historical | Flat percentage |
| **Topped out** | No | No | No | No |
| **7-point cap** | No | No | No | No |
| **Avg performance rate** | 40.91 | 23.12 | 25.78 | 1.68 |

#### Measure 134 — Preventive Care and Screening: Screening for Depression and Follow-up Plan

| Decile | eCQM | MIPS CQM | Medicare CQM | Medicare Part B Claims |
|---|---|---|---|---|
| D1 | `0.07 - 2.69` | `0.07 - 40.33` | `11.44 - 32.50` | `24.03 - 87.85` |
| D2 | `2.70 - 11.41` | `40.34 - 76.29` | `32.51 - 45.66` | `87.86 - 99.54` |
| D3 | `11.42 - 21.64` | `76.30 - 94.00` | `45.67 - 54.48` | `99.55 - 99.99` |
| D4 | `21.65 - 31.78` | `94.01 - 98.96` | `54.49 - 59.26` | `--` |
| D5 | `31.79 - 42.68` | `98.97 - 99.81` | `59.27 - 65.55` | `--` |
| D6 | `42.69 - 53.93` | `99.82 - 99.99` | `65.56 - 70.54` | `--` |
| D7 | `53.94 - 67.47` | `--` | `70.55 - 76.10` | `--` |
| D8 | `67.48 - 80.71` | `--` | `76.11 - 82.16` | `--` |
| D9 | `80.72 - 93.43` | `--` | `82.17 - 92.33` | `--` |
| D10 | `>= 93.44` | `100.00` | `>= 92.34` | `100.00` |
| **Effective benchmark type** | Historical | Historical | Historical | Historical |
| **Topped out** | No | Yes | No | Yes |
| **7-point cap** | No | Yes | No | Yes |
| **Avg performance rate** | 45.55 | 85.58 | 62.87 | 95.64 |

#### Measure 236 — Controlling High Blood Pressure

| Decile | eCQM | MIPS CQM | Medicare CQM | Medicare Part B Claims |
|---|---|---|---|---|
| D1 | `4.76 - 45.27` | `1.00 - 9.99` | `13.68 - 44.86` | `1.00 - 9.99` |
| D2 | `45.28 - 55.55` | `10.00 - 19.99` | `44.87 - 62.32` | `10.00 - 19.99` |
| D3 | `55.56 - 61.53` | `20.00 - 29.99` | `62.33 - 68.16` | `20.00 - 29.99` |
| D4 | `61.54 - 65.60` | `30.00 - 39.99` | `68.17 - 70.14` | `30.00 - 39.99` |
| D5 | `65.61 - 68.97` | `40.00 - 49.99` | `70.15 - 72.53` | `40.00 - 49.99` |
| D6 | `68.98 - 71.99` | `50.00 - 59.99` | `72.54 - 74.08` | `50.00 - 59.99` |
| D7 | `72.00 - 74.99` | `60.00 - 69.99` | `74.09 - 74.69` | `60.00 - 69.99` |
| D8 | `75.00 - 78.69` | `70.00 - 79.99` | `74.70 - 76.41` | `70.00 - 79.99` |
| D9 | `78.70 - 84.03` | `80.00 - 89.99` | `76.42 - 82.80` | `80.00 - 89.99` |
| D10 | `>= 84.04` | `>= 90.00` | `>= 82.81` | `>= 90.00` |
| **Effective benchmark type** | Historical | Flat percentage | Historical | Flat percentage |
| **Topped out** | No | No | No | No |
| **7-point cap** | No | No | No | No |
| **Avg performance rate** | 66.06 | 68.71 | 67.87 | 79.68 |

#### Measure 112 — Breast Cancer Screening

| Decile | eCQM | MIPS CQM | Medicare CQM | Medicare Part B Claims |
|---|---|---|---|---|
| D1 | _no benchmark_ | _no benchmark_ | `1.00 - 9.99` | _no benchmark_ |
| D2 | _no benchmark_ | _no benchmark_ | `10.00 - 19.99` | _no benchmark_ |
| D3 | _no benchmark_ | _no benchmark_ | `20.00 - 29.99` | _no benchmark_ |
| D4 | _no benchmark_ | _no benchmark_ | `30.00 - 39.99` | _no benchmark_ |
| D5 | _no benchmark_ | _no benchmark_ | `40.00 - 49.99` | _no benchmark_ |
| D6 | _no benchmark_ | _no benchmark_ | `50.00 - 59.99` | _no benchmark_ |
| D7 | _no benchmark_ | _no benchmark_ | `60.00 - 69.99` | _no benchmark_ |
| D8 | _no benchmark_ | _no benchmark_ | `70.00 - 79.99` | _no benchmark_ |
| D9 | _no benchmark_ | _no benchmark_ | `80.00 - 89.99` | _no benchmark_ |
| D10 | _no benchmark_ | _no benchmark_ | `>= 90.00` | _no benchmark_ |
| **Effective benchmark type** | — | — | Flat percentage | — |
| **Topped out** | — | — | No | — |
| **7-point cap** | — | — | No | — |
| **Avg performance rate** | — | — | — | — |

#### Measure 113 — Colorectal Cancer Screening

| Decile | eCQM | MIPS CQM | Medicare CQM | Medicare Part B Claims |
|---|---|---|---|---|
| D1 | _no benchmark_ | _no benchmark_ | `1.00 - 9.99` | _no benchmark_ |
| D2 | _no benchmark_ | _no benchmark_ | `10.00 - 19.99` | _no benchmark_ |
| D3 | _no benchmark_ | _no benchmark_ | `20.00 - 29.99` | _no benchmark_ |
| D4 | _no benchmark_ | _no benchmark_ | `30.00 - 39.99` | _no benchmark_ |
| D5 | _no benchmark_ | _no benchmark_ | `40.00 - 49.99` | _no benchmark_ |
| D6 | _no benchmark_ | _no benchmark_ | `50.00 - 59.99` | _no benchmark_ |
| D7 | _no benchmark_ | _no benchmark_ | `60.00 - 69.99` | _no benchmark_ |
| D8 | _no benchmark_ | _no benchmark_ | `70.00 - 79.99` | _no benchmark_ |
| D9 | _no benchmark_ | _no benchmark_ | `80.00 - 89.99` | _no benchmark_ |
| D10 | _no benchmark_ | _no benchmark_ | `>= 90.00` | _no benchmark_ |
| **Effective benchmark type** | — | — | Flat percentage | — |
| **Topped out** | — | — | No | — |
| **7-point cap** | — | — | No | — |
| **Avg performance rate** | — | — | — | — |

### Flat-percentage ladders, for reference

Every cell classified `F` above uses one of exactly two ladders:

| Decile | Normal (112, 113, 236) | Inverse (001) |
|---|---|---|
| D1 | `1.00 - 9.99` | `99.00 - 90.01` |
| D2 | `10.00 - 19.99` | `90.00 - 80.01` |
| D3 | `20.00 - 29.99` | `80.00 - 70.01` |
| D4 | `30.00 - 39.99` | `70.00 - 60.01` |
| D5 | `40.00 - 49.99` | `60.00 - 50.01` |
| D6 | `50.00 - 59.99` | `50.00 - 40.01` |
| D7 | `60.00 - 69.99` | `40.00 - 30.01` |
| D8 | `70.00 - 79.99` | `30.00 - 20.01` |
| D9 | `80.00 - 89.99` | `20.00 - 10.01` |
| D10 | `>= 90.00` | `<= 10.00` |

### Benchmark averages present in PY2026 (`Average Performance Rate`)

| Measure | eCQM | MIPS CQM | Medicare CQM | Medicare Part B Claims |
|---|---|---|---|---|
| 001 | 40.91 | 23.12 | 25.78 | 1.68 |
| 134 | 45.55 | 85.58 | 62.87 | 95.64 |
| 236 | 66.06 | 68.71 | 67.87 | 79.68 |
| 112 | — (no benchmark) | — | **absent (`--`) despite a benchmark** | — |
| 113 | — (no benchmark) | — | **absent (`--`) despite a benchmark** | — |

The 112/113 Medicare CQM rows have a benchmark but no average performance rate — consistent with a
flat benchmark that was not computed from a performance distribution.

### PY2025 -> PY2026 change table

| Measure | Collection type | PY2025 benchmark | PY2026 benchmark | Change |
|---|---|---|---|---|
| 001 | eCQM | Historical | Historical | same |
| 001 | MIPS CQM | Flat percentage | Flat percentage | same |
| 001 | Medicare CQM | Flat percentage | Historical | **Flat percentage -> Historical** |
| 001 | Medicare Part B Claims | Flat percentage | Flat percentage | same |
| 134 | eCQM | Historical | Historical | same |
| 134 | MIPS CQM | Historical | Historical | same |
| 134 | Medicare CQM | Flat percentage | Historical | **Flat percentage -> Historical** |
| 134 | Medicare Part B Claims | Historical | Historical | same |
| 236 | eCQM | Historical | Historical | same |
| 236 | MIPS CQM | Flat percentage | Flat percentage | same |
| 236 | Medicare CQM | Flat percentage | Historical | **Flat percentage -> Historical** |
| 236 | Medicare Part B Claims | Flat percentage | Flat percentage | same |
| 112 | eCQM | Historical | NONE | **Historical -> NONE** |
| 112 | MIPS CQM | Historical | NONE | **Historical -> NONE** |
| 112 | Medicare CQM | Flat percentage | Flat percentage | same |
| 112 | Medicare Part B Claims | Historical | NONE | **Historical -> NONE** |
| 113 | eCQM | Historical | NONE | **Historical -> NONE** |
| 113 | MIPS CQM | Historical | NONE | **Historical -> NONE** |
| 113 | Medicare CQM | row absent from file | Flat percentage | **row absent from file -> Flat percentage** |
| 113 | Medicare Part B Claims | Historical | NONE | **Historical -> NONE** |

### Quality performance standard context (S3, December 2025)

| Item | Value |
|---|---|
| PY2026 40th-percentile MIPS quality performance category score | **73.85** |
| Computed as | (77.73 [PY2022] + 74.54 [PY2023] + 69.27 [PY2024]) = 221.54; 221.54 / 3 = 73.85 |
| PY2025 excluded from average | yes — one-performance-year lag |
| PY2026 APP Plus measure set | 8 measures: 321 CAHPS, 479 + 484 administrative claims, and 001/134/236/112/113 |
| Outcome measures (for reporting incentive + alternative QPS) | 479, 484, 001, 236 (marked `^`); 134, 112, 113 are Process |
| MIPS data completeness | report on >= 75% of the APM Entity's applicable beneficiaries meeting denominator criteria |

S3 also states: *"PY 2026 is the last year ACOs will have the option to report MIPS CQMs as part of
the APP Plus quality measure set"* — though S4 proposes to extend MIPS CQM availability into PY2027+.

### CY2027 PFS proposed rule overlay (S4, July 14, 2026) — verbatim

Under the heading **"Extending the Use of Flat Benchmarks to Score Medicare CQMs"**:

> For PY 2027 and subsequent PYs, we are proposing that all measures of the Medicare CQMs collection
> type would be scored using flat benchmarks. In addition, we are proposing that Diabetes: Glycemic
> Status Assessment Greater Than 9% (Quality ID: 001), Preventive Care and Screening: Screening for
> Depression and Follow-up Plan (Quality ID: 134), and Controlling High Blood Pressure
> (Quality ID: 236), if reported via the Medicare CQMs collection type **for PY 2026** (and
> subsequent PYs), would be scored using flat benchmarks.

Net effect on this dataset if CMS-1848-P is finalized as proposed: the three PY2026 Medicare CQM
cells currently published as historical (001, 134, 236) would instead be scored on the flat ladders
in the reference table above. The 112/113 Medicare CQM cells are already flat, so they do not move.

Also relevant, from the same fact sheet:

> We are also proposing that the current scoring policy would no longer apply when at least one of
> the required measures in the APP Plus quality measure set does not have a benchmark for PY 2027 and
> subsequent PYs.

— i.e. CMS is revising § 425.512(a)(7) for measures lacking a benchmark, but **for PY2027+**, which
does not resolve how the six PY2026 `NONE` cells are handled.

## Caveats / gaps

- **`Benchmark Type` in the CSV never says "Flat".** The flat/historical split in this document is
  derived by pattern-matching the decile ladder. It is corroborated for 112/113 Medicare CQM by
  footnote 1 of S3, verbatim:
  > PY 2026 historical benchmarks for eCQMs/MIPS CQMs/Medicare CQMs and PY 2026 flat benchmarks for
  > Medicare CQMs (Quality IDs 112 and 113 only) will be posted in January 2026.

  That footnote confirms exactly two flat Medicare CQM cells (112, 113) and historical Medicare CQM
  benchmarks for the rest, which matches the CSV pattern-match exactly.
- **The flat classification of 001 and 236 under MIPS CQM and Medicare Part B Claims is NOT
  confirmed by a source I retrieved.** The ladders are unambiguously the flat ones, and CMS has a
  longstanding MIPS policy of flat benchmarks for these two measures, but I did not retrieve the
  rule text establishing it. Treat as pattern-derived, not source-verified.
- **Points-per-decile are not in this file.** The CSV gives cutpoints only. Mapping deciles to MIPS
  points (and how the 7-point cap on 134 MIPS CQM interacts with that) is a scoring rule from the
  MIPS regulations, not from this dataset. Do not infer it from here.
- **"10th percentile" and "40th percentile of the performance benchmark"** (used in S3 for the
  eCQM/MIPS CQM reporting incentive and the alternative QPS) are stated by CMS in percentile terms,
  not decile terms. The natural reading is that they correspond to the D1/D2 and D4/D5 boundaries
  respectively, but **S3 does not state that mapping** and I did not verify it. Flagged rather than
  assumed.
- **No CAHPS (measure 321) or administrative-claims (479, 484) benchmarks here.** S3 states the
  CAHPS 40th-percentile decile score is published in the PY2026 Quality Performance Reports inside
  the financial reconciliation package, and that administrative-claims performance-period benchmarks
  are posted after the CY2027 submission period. Neither is publicly available as of 2026-08-07.
- **Complex Organization Adjustment size is not in this dataset.** S4 mentions it only in passing
  (Medicare eCQM reporters would be ineligible). Its magnitude must come from the CY2025 PFS final
  rule, which I did not retrieve for this domain.
- **CMS-1848-P is a proposal.** The final rule is expected ~November 2026. Nothing in the S4 section
  above is in effect as of 2026-08-07.
- **113 Medicare CQM did not exist as a row in the PY2025 file at all** (19 target rows in PY2025 vs
  20 in PY2026, once 113SSP is added). Not a data error on my part — the row is genuinely absent.
- The endpoint serving S1/S2 is an undocumented frontend API (`/api/frontend/...`). It is what the
  QPP site itself calls, and content matches the resource-library description, but it carries no
  version stamp, `Last-Modified`, or `ETag`, so re-fetches cannot be diffed against a published
  revision. MD5s above pin what was retrieved on 2026-08-07.

## Machine-readable extract

`research/data/benchmarks-py2026.json` (82.8 KB) — all 20 PY2026 rows and 19 PY2025 rows with raw
decile strings plus parsed `lower` / `upper` / `entry` numerics, where `entry` is the rate you must
reach to land in that decile (lower bound normally, upper bound for inverse measure 001), and
`empty: true` marks a `--` cell.
