# Answers — Question 1: benchmark-less measures in APP Plus, PY2026

**Scope:** Q1 core question + sub-questions 1.1, 1.2, 1.3, 1.4, 1.6. (1.5 assigned elsewhere; Q2 out of scope.)
**Research date:** 2026-08-08. All retrieval dates are 2026-08-08 unless noted.
**Working files:** `/home/jmandel/hobby/.agent-scratch/q1-benchmarks/`, `/q1-cfr/`, `/q1-cms/`, `/q1-puf/`

---

## BOTTOM LINE

**The answer is (d) — but a specific, fully-specified (d): a two-step sequence in which (a) is tried first,
and (b) and (c) fire together only if (a) fails.**

```
PY2026 submission closes (early 2027)
        │
        ▼
CMS attempts a PERFORMANCE-PERIOD benchmark for 112/113 under eCQM and MIPS CQM
(needs >=20 qualifying submissions per collection type; published ~summer 2027)
        │
        ├── SUCCEEDS  ──►  (a) Measure is scored 1–10 points on the performance-period
        │                      benchmark. Denominator stays 80. NO exclusion.
        │                      NO § 425.512(a)(7)(ii)(B) floor — the measure HAS a benchmark.
        │
        └── FAILS     ──►  (b) AND (c) TOGETHER:
                               (b) excluded from total AND total available measure
                                   achievement points, § 414.1367(c)(1)(i) → 60-pt denominator
                               (c) § 425.512(a)(7)(ii)(B) floor fires → higher of own score or 73.85
```

**The brief's load-bearing ambiguity is resolved, and it resolves against the pre-year reading.**
"Does not have a benchmark" means **no benchmark of any kind at the time scoring occurs** — after the
performance-period attempt — not "no benchmark published before the performance year." CMS said so in
terms, in the very rule that created § 425.512(a)(7):

> "Under Sec. 414.1380(b)(1)(i)(A) … for eCQMs and MIPS CQMs, that meet the MIPS data completeness
> requirement but **do not have a benchmark (for example, a historical or performance period
> benchmark)** will receive zero achievement points (or 3 points for small practices)."
> — CY2024 PFS final rule, **88 FR 79123** (verified verbatim 2026-08-08)

The parenthetical enumerates *both* benchmark types as things whose absence is required. A measure with a
performance-period benchmark **has** a benchmark and triggers neither the exclusion nor the floor.

**Confidence.** I am **~95% confident in the framework** above (it is codified, stated in preamble, restated
in current CMS operational guidance, and confirmed empirically). The remaining uncertainty is entirely
**which branch fires** for 112/113 in PY2026, which turns on a volume threshold that cannot be known until
2027. My estimate: **~80% that eCQM and MIPS CQM each clear the threshold** and land in branch (a).

**What would change the answer:**

1. **The PY2025 benchmark file gaining performance-period rows** (due imminently — see § 1.4). It is the
   nearest observable test of the same machinery.
2. **The 2026 APP Toolkit / APP Scoring Guide**, which CMS says arrives in Q3 PY2026 (i.e. now) and which
   the MSSP methodology spec already cross-references. It does not yet exist. It is the document most
   likely to state the 112/113 treatment plainly.
3. **Actual PY2026 collection-type counts.** If fewer than 20 APP/APP Plus reporters submit 112 (or 113)
   through a given collection type meeting case minimum + data completeness + rate > 0, that cell falls to
   branch (b)+(c).

---

## THREE CORRECTIONS TO THE BRIEF'S PREMISES

These matter because two of them are currently load-bearing in the brief's reasoning.

### Correction 1 — the benchmark CSVs are mutable; the 2023/2024 performance-period rows were added *after* those years

Brief point 2 says the 2023 and 2024 files "contain 88 and 85 rows … whose Benchmark Type is a
performance-period benchmark, so the mechanism is in active use." True, but the inference that the PY2026
file's *lack* of such rows is meaningful does not follow. **CMS overwrites the file at the same URL after
scoring.** Proven by Internet Archive diff — see § 1.1. CMS states the practice in its own guidance:

> "Column J identifies benchmark type (historical or performance period) because **we'll add performance
> period benchmarks to this same file in summer 2027** … You'll see '--' when no benchmark is available.
> **Measures that show '--' when historical benchmarks are released will be eligible for a performance
> period benchmark.**"
> — *2026 Quality Benchmarks User Guide*, p. 10 (verified verbatim)

The PY2026 file is a pre-scoring artifact; the PY2023/PY2024 files are post-scoring artifacts. They are not
comparable.

### Correction 2 — `Recvd40p` in the MSSP PUF is the **EUC** floor, not the § 425.512(a)(7) no-benchmark floor

Brief point 3 says § 425.512(a)(7)(ii)(B) "is real and applied: the PY2024 MSSP PUF carries a `Recvd40p`
flag on 35 of 476 ACOs." **`Recvd40p` is a different provision.** The PY2024 PUF data dictionary defines it
as the Extreme and Uncontrollable Circumstance adjustment under § 425.512(c):

> "**Extreme and Uncontrollable Circumstance- 40th Percentile Adjustment-Quality** … =1 if an ACO is
> determined to be affected by an EUC in PY 2024, the ACO's quality score will be set to the higher of its
> quality score or the equivalent of the 40th percentile MIPS quality performance category score…"
> — PY2024 PUF Data Dictionary,
> `https://data.cms.gov/sites/default/files/2025-11/0eb58c4e-6f40-497d-a90f-242151c20bb8/Data_Dictionary-Medicare_Shared_Savings_Program-Performance_Year_Financial_and_Quality_Results_2025_Nov2025.pdf`

Empirically confirmed: all 35 `Recvd40p=1` ACOs are a **perfect subset** of the 124 `DisAffQual=1` (EUC-affected)
ACOs; zero of the 352 non-EUC ACOs ever received 77.05, including 86 that scored *below* it (down to 34.29).

**The (a)(7) no-benchmark floor has no flag in the PUF at all.** The dictionary folds it silently into
`QualScore`:

> "The quality score is the ACO's MIPS quality performance category score after any applicable Population
> and Income Adjustment bonus points are applied, and after the Shared Savings Program Quality EUC Policy
> and **Shared Savings Program Scoring Policy for Excluded APP Measures and APP Measures that Lack a
> Benchmark** are applied, if applicable."

So the PY2024 PUF **cannot** identify which ACOs (if any) received the (a)(7) floor. This is a negative
finding that should be carried into sub-question 1.5.

*(Useful side-finding for Q2.5: MSSP Methodology Specs v14 footnote 200 defines the score the floor is
compared against as the score "after all Shared Savings Program policies have been applied, including the
addition of any earned bonus points … and any Complex Organization Adjustment bonus points that
contributed to the MIPS quality performance category score." The floor is therefore compared **after** COA
points are added.)*

### Correction 3 — CMS does not propose to *delete* § 425.512(a)(7); it sunsets (a)(7)(ii) after PY2026

Brief point 6 says CMS-1848-P proposes to "delete" the trigger. More precisely, CMS proposes to **confine
(a)(7)(ii) to PY2025 and PY2026** and add a new, narrower (a)(7)(iii) for PY2027+ that drops the
"lacks a benchmark" trigger but keeps an exclusion-based one. Amendatory instruction:

> "In paragraph (a)(7)(ii), removing the phrase 'For performance year 2025 and subsequent performance
> years,' and adding in its place the phrase 'For performance years 2025 and 2026'"
> — CMS-1848-P, 91 FR 43842 (July 16, 2026)

The brief's conclusion is unaffected and in fact strengthened: **(a)(7)(ii)(B) is unambiguously live for
PY2026**, and CMS is affirmatively re-stating that it applies to PY2026.

---

## Q1.1 — Precedent: PY2021–PY2025

**Label: CMS operational practice, empirically demonstrated. Corroborated by preamble.**

### The methodological finding

Internet Archive CDX for `qpp.cms.gov/api/frontend/benchmarks-csv/quality/2024`:

| Capture | HTTP | Archived length | Stage |
|---|---|---|---|
| 2024-10-22 21:24:50 | 200 | 24,754 | pre-performance-year |
| 2025-02-14 22:02:21 | 200 | 24,898 | ~6 weeks before the PY2024 submission deadline |
| 2025-03-22 22:53:48 | 301 | 314 | redirect, no content |
| 2025-10-14 04:02:49 | 200 | 32,417 | **post-scoring** |
| 2026-05-09 16:57:20 | 200 | 32,419 | same CDX digest as the 2025-10-14 capture |

Decoded content:

| Version | Rows | Historical | Perf. Period | None | Medicare CQM | Admin Claims |
|---|---|---|---|---|---|---|
| 2024-10-22 | 453 | 238 | **0** | 215 | **0** | **0** |
| 2025-02-14 | 453 | 238 | **0** | 215 | **0** | **0** |
| 2025-10-14 | 460 | 237 | **85** | 138 | 3 | 4 |
| live today | 460 | 237 | **85** | 138 | 3 | 4 |

Diff (2025-02-14 → 2025-10-14): **78 rows** moved from no-benchmark to `Performance Period`; **7 rows added**
(`001SSP`/`134SSP`/`236SSP` Medicare CQM, `479`/`480`/`484`/`492` Administrative Claims), all
`Performance Period`; **0 removed**.

### The direct precedent: PY2024 required APP measures

| Measure | Collection type | Pre-year (2025-02-14) | Post-scoring (2025-10-14) |
|---|---|---|---|
| 001 | eCQM | Yes / Historical | Yes / Historical |
| 001 | MIPS CQM | Yes / Historical | Yes / Historical |
| 001SSP | Medicare CQM | **row absent** | **Yes / Performance Period** |
| 134 | eCQM | **No / "--"** | **Yes / Performance Period** |
| 134 | MIPS CQM | Yes / Historical | Yes / Historical |
| 134SSP | Medicare CQM | **row absent** | **Yes / Performance Period** |
| 236 | eCQM | **No / "--"** | **Yes / Performance Period** |
| 236 | MIPS CQM | Yes / Historical | Yes / Historical |
| 236SSP | Medicare CQM | **row absent** | **Yes / Performance Period** |
| 479 | Administrative Claims | **row absent** | **Yes / Performance Period** |
| 484 | Administrative Claims | **row absent** | **Yes / Performance Period** |

**Answer to 1.1: yes, PY2024 is a direct precedent, and in every instance the outcome was a
performance-period benchmark — never exclusion, never (observably) the floor.** An ACO reporting the APP
via eCQM in PY2024 faced exactly the PY2026 shape of problem: two of its three required clinical measures
(134, 236) had no pre-published benchmark. Both were scored. The pre-year reason on both was *"Measure was
suppressed in PY 2022 (baseline period); data isn't available for historical benchmark."*

Medicare CQM in PY2024 is the cleaner analogue still: a brand-new collection type, rows entirely absent
pre-year, required of all APP reporters — all three measures scored on performance-period benchmarks. CMS
predicted this outcome in advance:

> "For the CY 2024 performance period, benchmarks have not yet been established for the Medicare CQMs
> collection type since CY 2024 will be the first year in which such collection type will be available and
> as a result, **performance period benchmarks will be established for the Medicare CQMs collection type if
> the benchmarking requirement of 20 submissions of at least 20 cases is met** … With the number of Shared
> Savings Program ACOs reporting under the APP … there is little variation in the volume of Shared Savings
> Program ACOs reporting data. **As a result, we do not expect the establishment of reliable benchmarks for
> Medicare CQMs to be an issue.**" — **88 FR 79108** (verified verbatim)

### Corroboration: the recycled deciles

The PY2026 file's Medicare CQM rows for 001SSP, 134SSP, 236SSP carry `Benchmark Type = Historical` with
deciles **byte-identical** to the PY2024 `Performance Period` deciles, including average performance rates
(001SSP `80.94 - 49.20 … <= 7.03`, avg 25.78; 134SSP `11.44 - 32.50 … >= 92.34`, avg 62.87; 236SSP
`13.68 - 44.86 … >= 82.81`, avg 67.87). The PY2024 performance-period benchmarks were real, final, and
recycled as the PY2026 historical benchmark on the standard two-year lag.

### PY2023, PY2021–22

PY2023 (post-scoring file): all three required APP clinical measures had **Historical** benchmarks under
both eCQM and MIPS CQM; only administrative-claims measures used performance-period benchmarks. **No
precedent for a benchmark-less required clinical measure in PY2023.**

**Negative finding:** the endpoint returns `Unexpected Server Error` for 2019–2022, and the Internet
Archive has **no captures** for the 2021, 2022, or 2023 endpoints. I could not examine those years from
this source. In those years MSSP ACOs predominantly reported via the CMS Web Interface, which used its own
benchmarks, so the question largely did not arise.

### CMS's own summary of the whole PY2021–PY2024 record

> "we note that **none of the eCQMs, MIPS CQMs, or Medicare CQMs that Shared Savings Program ACOs have
> reported over the past four PYs lacked benchmarks.**" — CMS-1848-P, **91 FR 44053**

**This sentence is a decisive interpretive datum.** It is *false* under the pre-year reading — 134-eCQM and
236-eCQM demonstrably lacked pre-year benchmarks in PY2024, as did all three Medicare CQMs. It is *true*
under the at-scoring reading, because performance-period benchmarks were created in every case. **CMS is
therefore using "lacked benchmarks" to mean "lacked one at scoring."** This independently confirms the
reading established by 88 FR 79123.

---

## Q1.2 — Which measures get performance-period benchmarks?

**Label: criteria are codified and restated in guidance; the empirical hit-rate is operational practice.**

### The codified criterion

> "Except as provided in paragraphs (b)(1)(ii)(B) through (F) of this section, benchmarks will be based on
> performance by collection type, from all available sources, including MIPS eligible clinicians and APMs,
> to the extent feasible, **during the applicable baseline or performance period.**
> **(A)** Each benchmark must have a minimum of **20 individual clinicians or groups** who reported the
> measure meeting the case minimum requirement at paragraph (b)(1)(iii) … and the data completeness
> requirement at § 414.1340 and having a performance rate that is greater than zero."
> — **42 CFR § 414.1380(b)(1)(ii)** and **(ii)(A)**

Restated for PY2026:

> "If a quality measure's collection type doesn't have a historical benchmark, we'll attempt to calculate a
> benchmark based on data submitted for the 2026 performance period. We can establish performance period
> benchmarks when **at least 20 instances of the measure are reported through the same collection type and
> meet data completeness and case minimum requirements and have a performance rate greater than 0%**…"
> — *2026 Quality Benchmarks User Guide*, p. 15 (verified verbatim)

**Do APM Entity (ACO) submissions count toward the 20?** The 2026 User Guide p. 15 says performance-period
benchmarks are "established using data submitted by individual clinicians, groups, and virtual groups"
(omitting APM Entities), while the *2026 Traditional MIPS Scoring Guide* p. 14 says "20 or more
individuals, groups, virtual groups, **or APM Entities**" and "we use measure data submitted for traditional
MIPS, **the APP** and MVPs." **The discrepancy resolves in favour of counting APM Entities**, on two grounds:
CMS's preamble describes the Medicare CQM threshold as "a minimum of **20 Shared Savings Program ACOs** with
at least 20 cases reporting the measure" (88 FR 79108), and the PY2024 Medicare CQM performance-period
benchmarks demonstrably exist even though *only* ACOs can report that collection type. I flag the User
Guide wording as sloppy drafting, not as a substantive rule.

### The empirical hit-rate (PY2024 pre-year → post-scoring)

| Stated reason for missing historical benchmark | Converted | Total | Rate |
|---|---|---|---|
| Measure suppressed in baseline year | 8 | 8 | **100%** |
| Baseline data quality issues | 3 | 3 | **100%** |
| Substantive specification change | 7 | 10 | **70%** |
| New measure (added PY2023/PY2024) | 42 | 81 | **52%** |
| **Insufficient volume of data in baseline** | **18** | **113** | **16%** |
| **TOTAL** | **78** | **215** | **36%** |

Non-QCDR only (eCQM / MIPS CQM / Part B claims): suppressed 8/8, data issues 3/3, spec change 7/10,
new measure 11/20, **insufficient volume 4/51 (8%)**; total 33/92 (36%).

**Pattern:** administrative-claims measures always use performance-period benchmarks (they have no other
option — § 414.1380(b)(1)(ii)(D)). Otherwise the discriminator is **volume**. Where the historical
benchmark was missing for a reason *unrelated* to volume, CMS nearly always built a performance-period
benchmark. Where it was missing *because of* low volume, CMS usually could not — thin baseline volume
predicts thin performance-period volume.

### Why the 8–16% base rate is the wrong reference class for 112/113

The PY2026 gap for 112/113 has a **structural cause that reverses in PY2026**:

- **Measure 113 is entirely absent from the PY2024 benchmark file** — 0 rows in both the pre-year and
  post-scoring versions. It was not a collectible MIPS quality measure in PY2024. Its PY2026 "insufficient
  volume" is literally *zero* volume.
- **Measure 112** appears in PY2024 as `"112 (Not available in Traditional MIPS)"` — restricted to APP
  reporters, and the PY2024 APP required set did **not** include it. Almost nobody submitted it.
- **For PY2026, 112 and 113 are required of every MSSP ACO** under APP Plus (~480 ACOs, plus other APP
  reporters), and the CMS Web Interface no longer exists as an escape hatch.

The typical member of the "insufficient volume" bucket is a niche specialty measure few will ever report.
112/113 are mandatory population-health measures for the entire MSSP. The fitting reference class is the
PY2024 Medicare CQM rows — no baseline data at all, required of all APP reporters, threshold cleared
easily, performance-period benchmark created. **Labeled as reasoning, not as a CMS statement.**

**Residual risk, quantified.** The threshold is per collection type. Derived PY2024 collection-type counts
from the PUF: eCQM ~41 ACOs, Medicare CQM ~26, MIPS CQM ~17 — and MIPS CQM was **below 20**. PY2026 spreads
all ~480 ACOs across three types rather than four, so each type should clear 20 comfortably, but **MIPS CQM
is the cell with the least headroom**, and each submission must independently meet the 20-case minimum and
75% all-payer data completeness to count.

---

## Q1.3 — What has CMS actually promised for PY2026 for 112/113 specifically?

**Label: no CMS document addresses these cells by name. The applicable rules are stated generically.**

### The explicit negative finding

**No CMS memo, FAQ, webinar, listening-session deck, or QPP resource addresses measures 112 and 113 under
eCQM or MIPS CQM for PY2026.** Documents searched and found silent, by name:

- **PY2026 40th-Percentile / Quality Performance Standard memo** (December 2025,
  `https://www.cms.gov/files/document/medicare-shared-savings-program-quality-performance-standard-performance-year-2026-40th-percentile.pdf`,
  `last-modified: Tue, 23 Dec 2025`). Contains **no** discussion of measures lacking benchmarks. Its Table 1
  lists 112 and 113 as `eCQM/MIPS CQM/Medicare CQM` process measures **with no annotation** about the gap.
  Footnote 1, verbatim: *"PY 2026 historical benchmarks for eCQMs/MIPS CQMs/Medicare CQMs and PY 2026 flat
  benchmarks for Medicare CQMs (Quality IDs 112 and 113 only) will be posted in January 2026. **PY 2026
  performance period benchmarks will be posted following the submission period in Calendar Year 2027 for
  the administrative claims-based measures.**"* — note the performance-period sentence is scoped to
  administrative claims only. **The brief's point 5 is confirmed.**
- **2026 Quality Quick Start Guide** (nId 3596): zero occurrences of "112", "113", "Breast Cancer", or
  "Colorectal". Its Appendix C listing measures without historical benchmarks covers spec-change measures
  (493, 500, 501), **not** 112/113.
- **PY2026 Medicare CQM Reporting Resource** (nId 3686, 04/30/2026): FAQ #8 covers 112SSP/113SSP flat
  benchmarks; **says nothing** about the eCQM/MIPS CQM versions.
- **CY2026 PFS final rule (90 FR 49266)**: **zero** occurrences of "§ 425.512(a)(7)" and zero of "lacks a
  benchmark". It made **no substantive change** to this policy. **Answers the brief's question about the
  CY2026 final-rule preamble: it does not address this.**
- **CMS SSP "In the News" page**, NAACOS's January 2026 "Quality Conundrum" article and its November 2025
  quality-scenarios deck: all silent on the gap. An exact-phrase web search for *"Insufficient volume of
  data submitted in PY 2024 to establish historical benchmark"* returns **zero** relevant hits — nobody has
  publicly quoted the Column W text.
- **The 2026 APP Toolkit / APP Scoring Guide does not exist.** PY2022–PY2025 each have one; PY2026 has
  none as of today. CMS states the companion submission guide "will be available in the QPP Resource
  Library in the **third quarter of PY 2026**". **This is a live documentation gap**: MSSP Methodology
  Specs v14 tells ACOs to "refer to the 2026 APP Toolkit" for exactly these scoring policies, and that
  document is unpublished.

### What CMS *has* promised, generically but on point

**(i) A performance-period attempt, and a publication commitment for the file:**

> "Column J identifies benchmark type (historical or performance period) because we'll add performance
> period benchmarks to this same file in **summer 2027** … **Measures that show '--' when historical
> benchmarks are released will be eligible for a performance period benchmark.**"
> — *2026 Quality Benchmarks User Guide*, p. 10

112 and 113 under eCQM and MIPS CQM show exactly `--`. **This is the closest thing to a CMS promise that
these specific cells will get a performance-period benchmark attempt.**

> "Measures without a benchmark will earn 0 points – 3 points for a small practice – unless a performance
> period benchmark can be created for use in PY 2026. **We'll attempt to create a performance period
> benchmark following the data submission period.** If we can create one based on submission data, the
> measure will be eligible for up to 10 points…" — *ibid.*, p. 25, Scoring Example 4

**(ii) The APP carve-out if the attempt fails** — *2026 Quality Benchmarks User Guide*, p. 15:

> "**If no historical benchmark exists and no performance period benchmark can be calculated**, then the
> measure will receive 0 points unless: … • The measure is submitted under the APM Performance Pathway. In
> this case, measures that do not have a historical benchmark are **excluded from scoring**."

The parent condition requires **both** to be absent; the APP bullet's use of "historical" alone is a
drafting slip. The PY2025 predecessor is unambiguous — *2025 APP Toolkit → Scoring Guide*, p. 21:

> "**Under the APP, measures without a historical or performance period benchmark are excluded from scoring
> as long as data completeness is met.**"

and p. 27: *"There's no historical benchmark for one of the required APP quality measures **and we can't
calculate one based on data submitted for the performance period**… the measure will receive **0 out of 0
points**."*

**(iii) The MSSP floor layered on top** — *MSSP Shared Savings and Losses, Assignment and Quality
Performance Standard Methodology Specifications*, **April 2026 Version #14**, pp. 67–68
(`https://www.cms.gov/files/document/medicare-shared-savings-program-shared-savings-losses-assignment-methodology-specifications-version.pdf-0`,
`last-modified: Mon, 27 Apr 2026`), verified verbatim:

> "**Shared Savings Program Scoring Policy for Excluded APP Plus Measures and APP Plus Measures that Lack a
> Benchmark**
> Where there are excluded measures or measures without a benchmark in the APP Plus quality measure set,
> the Shared Savings Program will use the higher of a) the ACO's quality score or b) the 40th percentile
> MIPS quality performance category score value used for the quality performance standard when either of
> the following occur:
> ▪ The ACO's total available measure achievement points … is reduced due to measure suppression; or
> ▪ **At least one of the eCQMs/MIPS CQMs/Medicare CQMs in the APP Plus quality measure set does not have a
> benchmark**
> ACOs will qualify for this policy provided that they report all quality data on the APP Plus quality
> measure set via the eCQM, MIPS CQM, or Medicare CQM collection types, or a combination of these three
> collection types, meet the MIPS data completeness requirement for each measure, and receive a MIPS
> quality performance category score. **Measures not meeting the MIPS case minimum requirement are not
> addressed by this policy.**"

**This is current, PY2026-applicable CMS operational guidance confirming the floor is live.**

---

## Q1.4 — Timing and disclosure

**Label: CMS operational practice + one explicit CMS-stated date.**

**Answer: no. An ACO cannot know the scoring ladder for a benchmark-less measure before it must choose and
execute its collection type.**

1. **CMS's stated date:** performance-period benchmarks are added to the benchmark file in **summer 2027**
   (*2026 Quality Benchmarks User Guide*, p. 10). The PY2026 submission deadline is ~2027-03-31. The ladder
   is published roughly **3–6 months after** submission closes.
2. **Necessarily so**, not merely observed: a performance-period benchmark is computed *from* performance-
   period submissions and cannot exist before they are complete. CMS said this from the outset — *"we would
   use information from the performance period to create measure benchmarks, **which would not be published
   until after the performance period**"* (CY2017 QPP final rule, 81 FR 77544).
3. **Empirically:** the PY2024 performance-period benchmarks were absent as of 2025-02-14 and present as of
   2025-10-14, bracketing the ~2025-03-31 deadline.
4. **And the lag is long.** As of **2026-08-08** — over four months past the PY2025 submission deadline —
   the PY2025 file still shows **0 performance-period rows and 0 Administrative Claims rows**, structurally
   unchanged from its 2025-04-10 capture.

**Relative to reconciliation:** PY2024's benchmarks appeared by 2025-10-14, i.e. around the MSSP settlement
window. The ladder is published at or near settlement — long after the strategic decision.

**Consequences for PY2026 strategy:**

- The eCQM / MIPS CQM ladder for 112/113 **cannot exist** until after the ACO has already committed and
  submitted.
- **The Medicare CQM ladder is known in advance** — flat 10-point bands (`1.00 - 9.99` … `>= 90.00`),
  published January 2026, guaranteed by **§ 414.1380(b)(1)(ii)(F)**: *"Beginning in the CY 2025 performance
  period/2027 MIPS payment year, measures of the Medicare CQM collection type use flat benchmarks for their
  first two performance periods in MIPS."* This is a real, codified asymmetry: **Medicare CQM offers ladder
  certainty for 112/113 that the all-payer collection types cannot offer for PY2026.**

**Negative findings:** CMS makes no commitment to a publication *date* beyond "summer 2027", and the PY2026
40th-percentile memo's only performance-period promise is scoped to administrative-claims measures. The
file is silently overwritten at the same URL with **no version stamp, no changelog, and no `Last-Modified`
header** on the live endpoint (verified 2026-08-08: only a `date` header is returned). An ACO tracking this
must diff the file itself.

**One contrast worth noting (inference, not a CMS statement):** CMS has explicit vocabulary for "won't be
scored" and uses it in the Comments column — measure `389` MIPS CQM lost its PY2025 benchmark mid-year with
the comment *"This measure has been suppressed for PY 2025 and won't be scored again."* The PY2026 rows for
112/113 do **not** carry that language; their comment is only the insufficient-volume explanation.

---

## Q1.6 — Interaction: if a measure is excluded, does the floor also fire?

**Answer: YES — exclusion does not moot the floor. They are triggered by the identical condition, and the
floor exists precisely as the remedy for exclusion. Label: current law for PY2026, confirmed by CMS
operational guidance.**

Four independent supports:

**1. The provision's own title couples them.** CMS finalized the heading for § 425.512(a)(7) as
*"Shared Savings Program Scoring Policy for **Excluded** APP Measures **and** APP Measures That Lack a
Benchmark"* (89 FR 98113). The MSSP Methodology Specs v14 reproduces it verbatim as a section heading and
opens: *"**Where there are excluded measures or measures without a benchmark** in the APP Plus quality
measure set, the Shared Savings Program will use the higher of…"*. Exclusion is not an alternative to the
floor; it is one of the two situations the floor addresses.

**2. The floor presupposes a score rather than replacing one.** The (a)(7) chapeau conditions the floor on
the ACO *"**receiving a MIPS Quality performance category score** as described at § 414.1380(b)(1)"*. So
the sequence is: compute the score on the surviving measures (60-point denominator), **then** take
max(own score, 73.85). It is a `max()` operator, not a substitution. This is confirmed empirically by the
EUC analogue in the PY2024 PUF, where 89 of 124 EUC-affected ACOs kept their own above-floor scores and the
retained distribution truncates exactly at the floor with no gap.

**3. Same condition, same words.** § 414.1367(c)(1)(i) excludes measures that "**does not have a benchmark**
or meet the case minimum requirement"; § 425.512(a)(7)(ii)(B) fires when a required measure "**does not have
a benchmark** as described at § 414.1380(b)(1)(i)(A)". Both are evaluated at scoring, after the
performance-period attempt (88 FR 79123). When one is satisfied for a benchmark reason, so is the other.

**4. Purpose.** *"Given that the Shared Savings Program does not determine which quality measures do not
have a benchmark and that ACOs do not have a choice of measures they can report under the APP, we do not
want to adversely impact shared savings determinations for events outside the ACOs' control"*
(88 FR 79123). Exclusion is the harm; the floor is the compensation.

### Two important limits on the coupling

**(a) The floor does not fire when a performance-period benchmark IS created.** If branch (a) obtains, the
measure has a benchmark, is scored normally, is not excluded, and (a)(7)(ii)(B) is not satisfied. **This is
why CMS could truthfully say no reported measure "lacked benchmarks" over four PYs despite 134-eCQM and
236-eCQM having no pre-year benchmark in PY2024.**

**(b) CMS added an impact condition.** *"We are also clarifying that **this policy will not apply if an
ACO's MIPS Quality performance category score is not impacted by measure exclusion or the lack of a
benchmark**"* (88 FR 79123). Not codified in § 425.512(a)(7) itself — labeled as **preamble gloss**.

**Also note an asymmetry relevant to modelling:** § 414.1367(c)(1)(i) excludes measures failing *either* the
benchmark test *or* the case-minimum test, but § 425.512(a)(7)(ii)(B) is triggered *only* by the benchmark
test. Methodology Specs v14 makes this explicit: *"**Measures not meeting the MIPS case minimum requirement
are not addressed by this policy.**"* A case-minimum exclusion therefore shrinks the denominator **without**
earning the floor.

---

## Consequences for the simulator

The toggle can be replaced by a **modelled branch** with a stated probability, rather than a single answer:

| | Branch (a) — perf-period benchmark created | Branch (b)+(c) — not created |
|---|---|---|
| 112/113 eCQM/MIPS CQM | scored 1–10 pts each | excluded |
| Denominator | **80** | **60** |
| § 425.512(a)(7)(ii)(B) floor | **does not apply** | **applies — max(score, 73.85)** |
| Ladder knowable at decision time | **No** (published summer 2027) | n/a |
| My estimated likelihood | **~80%** per collection type | ~20% |

Two further points the brief's "what we will do with the answers" section should absorb:

1. **Routing 112/113 to an all-payer method is not simply a risk — it is a bounded gamble with a floor.**
   The downside branch carries the 73.85 protection; the upside branch preserves the 80-point denominator.
   Neither branch produces the "0 out of 10" outcome that would be the genuine disaster.
2. **The real exposure is the reporting incentive, not the quality score.** Per Methodology Specs v14, the
   eCQM/MIPS CQM reporting incentive requires clearing the 10th percentile *of the performance benchmark*
   on an outcome measure **and** the 40th percentile *of the performance benchmark* on one of the remaining
   measures. A benchmark-less measure cannot supply either. 001/134/236 retain benchmarks under all
   collection types for PY2026 and can, so the incentive is not lost — but it now rests on a narrower base.
   *(Note: v14 describes the incentive as requiring the 40th percentile on "one of the remaining seven
   measures"; I did not independently reconcile that count with the five-measure + CAHPS + two-claims set.)*

---

## Appendix — sources and reproduction

**Regulations** (govinfo bulk CFR XML, Title 42 2025 annual edition, `CFR-2025-title42-vol3.xml`,
cross-checked against eCFR current text; eCFR HTML intermittently returns a bot-protection interstitial):
§ 414.1367(c)(1)(i); § 414.1380(b)(1)(i)(A), (b)(1)(ii) and (ii)(A)–(F), (b)(1)(iii), (b)(1)(vii)(A)/(C);
§ 425.512(a)(7); § 414.1340.

**Federal Register:** 88 FR 79107–79108, 88 FR 79123 (CY2024 final, doc 2023-24184); 89 FR 98112–98113,
98117–98120 (CY2025 final, doc 2024-25382); 90 FR 49908, 50016 (CY2026 final, doc 2025-19787);
91 FR 44052–44053 (CY2027 proposed, doc 2026-14327); 81 FR 77282, 77544 (CY2017); 86 FR 65493 (CY2022).

**CMS documents:** PY2026 40th-Percentile memo (Dec 2025); *2026 Quality Benchmarks User Guide*
(`https://qpp-cm-prod-content.s3.amazonaws.com/uploads/3611/2026-Quality-Benchmarks-User-Guide.pdf`);
*2026 Traditional MIPS Scoring Guide* (nId 3682); *2025 APP Toolkit → Scoring Guide* (nId 3244);
*MSSP Methodology Specifications v14* (April 2026).

**Data files** (`/home/jmandel/hobby/.agent-scratch/q1-benchmarks/`):

| File | Source |
|---|---|
| `bench-2023.csv` … `bench-2026.csv` | `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/<year>` |
| `wb-2024-20241022212450.csv` | `https://web.archive.org/web/20241022212450id_/https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2024` |
| `wb-2024-20250214220221.csv` | `https://web.archive.org/web/20250214220221id_/…` |
| `wb-2024-20251014040249.csv` | `https://web.archive.org/web/20251014040249id_/…` |
| `wb-2025-20250410214858.csv` | `https://web.archive.org/web/20250410214858id_/…/quality/2025` |

MD5 `bench-2026.csv` = `3c4ba299ad2f604f7852b3b9c5433400` (matches the brief). MD5 `bench-2024.csv` =
`c1616da5de838eb2627df0c278f1c842`.

**PUF** (`/home/jmandel/hobby/.agent-scratch/q1-puf/`): PY2024 Performance Year Financial and Quality
Results, `https://data.cms.gov/sites/default/files/2026-07/fb6ba14b-3450-47c2-8ff5-d1f2a5bdb3e3/PY_Financial_and_Quality_Results_2024_revised%202026_07_17.csv`
(476 rows, 189 cols, MD5 `743c1a244c0e37e537f40c6842803ed3`), plus its data dictionary PDF.
