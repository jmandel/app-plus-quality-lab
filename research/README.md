# research/ — independent ground truth for the APP Plus Pathway Lab

Every file here was compiled **2026-08-07** from primary sources — eCFR regulation text, Federal
Register full text, CMS memos and fact sheets, and CMS public-use files — as an independent check on
`src/PathwayLab.tsx` and the `docs/` narrative. Each file states its own sources with URLs, retrieval
method, byte counts or checksums, and a "Caveats and gaps" section listing what could **not** be
verified.

**Start here:** [`findings.md`](findings.md) — the dated calibration report that reconciles all five
research files against the app and its docs, grouped by severity with app value vs. authoritative
value, source citation, verdict, and suggested fix.

**File status check (2026-08-07):** all five research files listed below are present on disk and
substantive (331–621 lines each). Nothing is missing.

---

## `benchmarks-py2026.md` (331 lines)

**PY2026 QPP quality benchmark cutpoints for the five ACO-reported APP Plus measures.** Extracts all
20 measure x collection-type cells for measures 001, 134, 236, 112, 113 across eCQM, MIPS CQM,
Medicare CQM and Medicare Part B Claims, straight from the published CSVs, and classifies each cell
flat-vs-historical by ladder pattern because the file's own `Benchmark Type` column cannot be
trusted. Three findings dominate. Measures **112 and 113 have no PY2026 benchmark at all** for eCQM,
MIPS CQM, or Medicare Part B Claims — six cells marked `Measure has a Benchmark = No` with the
comment "Insufficient volume of data submitted in PY 2024 to establish historical benchmark" — a
regression from PY2025, when both had full historical benchmarks in all three; only their Medicare
CQM cells have a benchmark, and it is flat. The CSV's `Benchmark Type` column contains only
`Historical` or `--` and **never says "Flat"**, so six rows carrying the canonical flat ladder are
mislabeled `Historical`; the classification here was corroborated against footnote 1 of CMS's
December 2025 40th-percentile memo. And **PY2026 is the first year Medicare CQM carries real
historical benchmarks** for 001, 134 and 236 (every Medicare CQM cell was flat in PY2025) — which is
precisely what the CY2027 proposed rule would retroactively undo, and precisely the app's A/B fork.

**Key numbers:** 450 data records in the PY2026 CSV, MD5 `3c4ba299ad2f604f7852b3b9c5433400`; PY2025
comparison MD5 `68ef0db5b83df38b34479ef4be228ff3`. 134 MIPS CQM is topped out with a **7-point cap**
(as is 134 Medicare Part B Claims); no other target cell is capped. Average performance rates across
the nine benchmarked cells: 40.91 / 23.12 / 25.78 (001 eCQM / MIPS CQM / Medicare CQM), 45.55 / 85.58
/ 62.87 (134), 66.06 / 68.71 / 67.87 (236). Operational note: **`HEAD` on the benchmarks endpoint
returns 404 while `GET` returns 200** — a HEAD-based liveness check produces a false negative.

---

## `mssp-py2024-results.md` (384 lines)

**Verified PY2024 MSSP results distributions.** Built from the CMS Performance Year Financial and
Quality Results PUF (the 2026-07-17 revision, 476 ACOs, 189 columns) joined to the PY2024 ACO
Participants file (15,540 rows, 480 ACOs). Nine of nine aggregates reconcile against the CMS PY2024
fact sheet; gross/net per-capita savings run ~$3 high only because the fact sheet describes the
original September 2025 release. All percentiles use NumPy `method="linear"` (Hyndman-Fan Type 7 /
R `quantile(type=7)` / Excel `PERCENTILE.INC`), stated explicitly. The single most decision-relevant
result for an APP Plus model is the **digital-reporting gap**: ACOs reporting digitally only had a
median quality score of 74.58 against 84.29 for Web-Interface-only reporters, and excluding the 16
EUC-floored digital reporters the remaining 60 median just **70.97** — a ~13-point gap for the exact
transition PY2026 forces. The file also resolves the QPS gate structure exactly (four pathways
partition all 476 ACOs with no residual) and verifies the alternative-QPS scaling formula
`FinalShareRate = QualScore/100 x track max rate` for 29 of 29 ACOs.

**Key numbers:** 476 reconciled ACOs, 10,326,340 assigned beneficiaries, 75.6% earning payments
(80.1% of beneficiaries), $4.14B paid, 16 ACOs owing $20.0M. Median quality **83.11**, with an
artificial mode at exactly **77.05** (35 ACOs, all EUC-floored at the PY2024 40th percentile), so a
smooth fit misplaces the left tail. Size p25/p50/p75 = **8,262.5 / 13,151 / 24,445.2** beneficiaries;
benchmark **$106.0M / $177.3M / $331.4M**; gross savings rate **2.00 / 4.22 / 7.03 %**; participant
TINs **7 / 19 / 37.2** (p10 2.5, p90 80). Track mix: ENHANCED 205, BASIC E 104, B 103, A 54, C 5,
D 5 — one-sided 157 (33.0%). Final sharing rates observed: 40.00 for 127 ACOs, 50.00 for 107, 75.00
for 200; `FinalLossRate` 30.0 for exactly 114 = BASIC C+D+E.

---

## `mssp-scoring-rules.md` (621 lines)

**Current-law APP Plus scoring and MSSP settlement rules for PY2026.** Sourced from eCFR 42 CFR
Parts 425 and 414 Subpart O, the Federal Register full text of the CY2025 and CY2026 PFS final
rules, CMS fact sheets, the December 2025 PY2026 40th-percentile memo, the PY2026 benchmarks CSV,
and two data.cms.gov datasets. It establishes the PY2026 APP Plus set as 8 measures — 5 ACO-reported
(001, 112, 113, 134, 236), 2 administrative claims (479 HWR, 484 MCC), and CAHPS (321) — and settles
the deeming question the sweep singled out: the eCQM/MIPS CQM reporting incentive at
42 CFR 425.512(a)(5)(i)(B)(2) is **conjunctive**, requiring the 40th percentile on at least one of the
remaining seven measures *in addition to* the 10th percentile on an outcome measure, and the two
administrative-claims measures **do** count as outcome measures for both the incentive and the
alternative QPS. Failing the QPS but meeting the alternative standard yields **scaled, not zero**,
sharing. Two findings not in the original brief materially change PY2026 economics: the **health
equity adjustment is removed** beginning PY2026, and the missing 112/113 benchmarks both shrink the
scoring denominator and arguably trigger a 40th-percentile score floor.

**Key numbers:** 80 total available measure achievement points under the app's assumptions; a
60-point denominator if benchmark-less measures are excluded per 42 CFR 414.1367(c)(1)(i). PY2026
quality performance standard and floor value = **73.85** (derivation 77.73 + 74.54 + 69.27 = 221.54,
/ 3). Data completeness threshold 75%. Sharing maxima by track: BASIC A/B **40%**, BASIC C/D/E 50%,
ENHANCED 75%. Shared losses: BASIC A/B none, BASIC C/D/E **flat 30%**, ENHANCED `1 - 0.75 x quality
score` with a 40% floor and 75% ceiling. Minimum savings rate is a sliding scale by beneficiary count
for one-sided BASIC, with a half-rate branch at 425.605(h) for low-revenue ACOs. **Caveat 4 of this
file flags the unresolved question** of whether a missing pre-year historical benchmark trips
425.512(a)(7) when CMS may still set a performance-period benchmark — carried forward as UNCERTAIN
finding X3.

---

## `pfs-cy2027-proposed.md` (393 lines)

**MSSP quality / APP Plus provisions of the CY2027 PFS proposed rule (CMS-1848-P).** Documented from
both the CMS fact sheet and the full Federal Register text, with proposed-vs-current-law
distinguished throughout and every number cited to a page or regulation section. The core proposals:
a new MSSP-only **Medicare eCQMs** collection type starting **PY 2027** (eCQM specs applied only to
assigned beneficiaries, 75% data completeness, flat benchmarks, explicitly ineligible for both the
eCQM/MIPS CQM reporting incentive and the Complex Organization Adjustment); **flat benchmarks for
all Medicare CQMs beginning with the CY2026 performance period**, retroactively converting Quality
IDs 001, 134 and 236 from the data-driven benchmarks CMS actually published for PY2026; extension of
**MIPS CQMs** and the MIPS CQM reporting incentive to PY 2027+ instead of sunsetting after PY 2026
(with anticipated sunsets at PY 2030 and PY 2028 respectively); and an **APP Plus set frozen at 8
measures** for PY 2027+ by removing Quality IDs 305 and 493. Separately, QP and Partial QP status
would apply strictly at the TIN/NPI level beginning with the 2027 QP performance period. The 40th-
percentile standard, the alternative QPS, the Complex Organization Adjustment formula and the 75%
data completeness threshold are all **unchanged**.

**Key numbers:** Issued 2026-07-14, published 2026-07-16 at **91 FR 43842**, FR Doc 2026-14327;
comments close **2026-09-14**; final rule expected ~November 2026. CY2027 conversion factors:
qualifying APM **$33.1693**, nonqualifying **$32.8409** (a 1.00% gap). Projected 10-year Trust Fund
effect of all MSSP proposals **-$5.5B**; projected change in net shared savings to ACOs **+$1.05B**.
Program size cited: 511 ACOs, >700,000 providers, >12.6M assigned beneficiaries as of 2026-01-01.
Non-quality changes that still move 2027 dollars are tabulated: BASIC Level E 60% sharing rate,
ENHANCED regional-adjustment weight cut to 35%, ACPT guardrails applied retroactively from PY 2025,
and the CEHRT requirement overhaul. Note the PY2027 benchmarks CSV was **not yet published**
(HTTP 500 on 2026-08-07).

---

## `qp-tracks.md` (476 lines)

**QP status, MSSP tracks, and MIPS exposure for PY2026.** Verifies from CMS/QPP primary sources that
**BASIC Level E and ENHANCED are the only Advanced APM tracks** (BASIC A–D are MIPS APMs), confirmed
by direct quotes in CMS-1848-P and by its RIA list of Advanced APMs for the 2027 QP performance
period. The headline finding is that the **QP thresholds governing PY2026 performance are 50% payment
amount / 35% patient count, not 75%/50%** — the Consolidated Appropriations Act, 2026 (Pub. L.
119-75, 2026-02-03) restored the lower thresholds for payment year 2028 only, and CMS-1848-P proposes
the conforming regulation text while the currently codified 42 CFR 414.1430 still stale-reads "2027
and later: 75 percent." CAA 2026 also revived a **3.1% lump-sum APM Incentive Payment** for payment
year 2028 (i.e. PY2026 QPs), with no lump sum in payment year 2027. Individual-level QP determination
for all Advanced APM participants was **finalized** in the CY2026 PFS final rule effective with the
2026 QP performance period; the TIN/NPI-level *application* of QP status is proposal-only. The file
closes with a bottom-up sanity check on the app's Part B billing bases.

**Key numbers:** PY2026 track mix **82 BASIC Level E + 296 ENHANCED = 378 of 511 ACOs (74%)** in
Advanced APM tracks. CMS's own PY2026 QP projection jumped from 375,000–482,200 (CY2026 final rule,
75%/50% assumed) to **517,800–530,900** (CY2027 proposed rule, after CAA 2026). Program-wide QP rate
proxy: 463,669 QPs of 505,210 Advanced APM participants = **91.8%**. Non-QP MIPS eligible clinicians
in Advanced-APM ACOs are scored at the APM Entity level against a **75-point threshold** with a −9%
floor and only about **+1.05% observed upside** in PY2024 (median +0.80%). Part B sanity check: the
app's 8k/13k/24k ACO sizes are exactly the p25/median/p75 of the PY2024 PUF, and assigned-beneficiary
Part B spend at those sizes is **$35.9M / $57.4M / $106.9M** — so the app's $60M base at 13k implies
~100% non-QP, $30M at 8k implies 84%, and $15M at 24k implies only 14%.

---

## `data/` — machine-readable extracts

Small committed extracts so results can be re-checked without re-downloading the multi-megabyte
PUFs. The raw CMS public-use files are **not** committed; each research file's "Reproducing" or
"Sources" section gives the exact URL and fetch command.

| File | Size | Contents | Produced by |
|---|---|---|---|
| `benchmarks-py2026.json` | 83 KB | All PY2026 decile ladders for the target measures, with `benchmark_type_as_published` kept separate from `benchmark_type_effective` (flat-vs-historical derived from the ladder pattern) | `benchmarks-py2026.md` |
| `app-plus-py2026-benchmarks.csv` | 7.4 KB | Filtered PY2026 benchmark rows for the eight APP Plus measures | `mssp-scoring-rules.md` |
| `mssp-py2024-distributions.json` | 20 KB | Every percentile, aggregate and cross-tab computed from the PY2024 PUF | `mssp-py2024-results.md` |
| `mssp-py2024-aco-size-and-partb.csv` | 15 KB | Per-ACO size and Part B carrier-spend extract used for the Part B base sanity check | `mssp-py2024-results.md` |
| `pfs-cy2027-medicare-cqm-benchmarks.json` | 6.1 KB | Medicare CQM benchmark cells under current law vs. the proposed flat treatment | `pfs-cy2027-proposed.md` |

**Note:** there is no top-level `data/` directory in this project — all extracts live here, under
`research/data/`.

---

## Conventions used across these files

- **Retrieval date 2026-08-07** is stated on every source; no number is carried over from the app's
  own assumptions or from an earlier session.
- **Percentiles** are NumPy `method="linear"` (Hyndman-Fan Type 7) unless a row is explicitly labeled
  beneficiary-weighted.
- **Proposed vs. current law** is distinguished in every sentence that touches CMS-1848-P; nothing
  proposed is presented as settled.
- **Derived numbers** (arithmetic performed here rather than published by CMS) are labeled as such.
- **Unverifiable numbers** go in each file's "Caveats and gaps" section rather than being estimated —
  and the two that survived into the calibration report are marked UNCERTAIN in `findings.md`
  (the § 425.512(a)(7) floor trigger, and the non-QP Part B billing base).
- **Fetch gotchas** worth remembering: `cms.gov` returns HTTP 403 without a browser User-Agent; the
  QPP benchmarks endpoint 404s on `HEAD` but 200s on `GET`; Federal Register `.txt` files contain NUL
  bytes (use `grep -a` or `tr -d '\000'`); the eCFR Versioner API intermittently returns 503 and
  rejects dates past the latest issue date; and the MSSP results PUF is catalogued as "Performance
  Year Financial and Quality Results", so a title search for "Shared Savings" misses it.
