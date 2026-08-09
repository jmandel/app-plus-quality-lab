# Q3 — Flat-percentage benchmarks for Measures 236 and 001: history and mechanism

**Verdict: CONFIRMED — high confidence** (on the mechanism and the decisive empirical test), with
three corrections and one sub-claim that remains **unverified**.

Independent verification performed 2026-08-09. All primary sources retrieved live on that date.

---

## 1. Verdict summary

The claim under test:

> "Measure 236 (Controlling High Blood Pressure) and 001 (Diabetes HbA1c Poor Control) have
> FLAT-percentage benchmarks under MIPS CQM and Medicare Part B Claims but DATA-DRIVEN (curved)
> benchmarks under eCQM because 42 CFR 414.1380(b)(1)(ii)(C) applies flat benchmarks
> per-collection-type — only to collection types whose observed top decile exceeded 90 percent —
> and the eCQM distributions run lower (structured-data capture loss) so they stayed below that line."

| Component of the claim | Status | Basis |
|---|---|---|
| 236/001 flat under MIPS CQM + Part B Claims, curved under eCQM | **PROVEN** | QPP benchmark CSVs PY2023–PY2026 + official CMS workbooks PY2017–PY2022 |
| The governing authority is 42 CFR 414.1380(b)(1)(ii)(C) | **PROVEN** | eCFR + govinfo CFR XML; CMS fact sheets name the measures |
| (C) applies **per collection type**, not per measure | **PROVEN** | Reg text, CY2020 PFS preamble comment-response, CMS PY2021 fact sheet |
| Trigger is the collection type's **observed top decile > 90%** | **PROVEN** | Reg text + CMS fact sheet footnote (adds "< 10% for inverse measures") |
| eCQM stayed curved because its distribution fell below that line | **PROVEN** | PY2019 pre-flat data: eCQM D10 = 82.21 vs MIPS CQM 100 and Claims 94.89 |
| ...because of **"structured-data capture loss"** | **UNVERIFIED** | Nowhere stated by CMS; claimant's own causal gloss (see §7) |

**Corrections to the framing of the question:**

1. **The rule was NOT finalized in the CY2021 PFS final rule (85 FR).** It was finalized in the
   **CY2020 PFS final rule, 84 FR 62568 (Nov. 15, 2019)**, FR Doc. 2019-24086 — preamble at
   **84 FR 63014–63017**, regulatory text at **84 FR 63196–63197**. CY2021 PFS contains only a bare
   cross-reference (85 FR 84729). The *effective date* framing in the question was right for the
   wrong rule: "beginning with the 2022 MIPS payment year" = CY2020 performance period, which is
   exactly what a rule published in November 2019 governs.
2. **The pre-2022 distributions ARE recoverable** — the premise that they cannot be is false. CMS
   still hosts the PY2017–PY2022 benchmark ZIPs on its S3 bucket (§3).
3. **For inverse measures the operative threshold is "< 10%", not "> 90%"** — this appears in CMS's
   fact sheet but **not** in the codified text, which says only "higher than 90 percent" (§6.3).

---

## 2. The regulation (verified from two independent authoritative sources)

**42 CFR 414.1380(b)(1)(ii)(C)**, verbatim:

> "Beginning with the 2022 MIPS payment year, for each measure that has a benchmark that CMS
> determines may have the potential to result in inappropriate treatment, CMS will set benchmarks
> using a flat percentage for all collection types where the top decile is higher than 90 percent
> under the methodology at paragraph (b)(1)(ii) of this section."

Sources (both retrieved 2026-08-09, character-identical):
- Live eCFR versioner API:
  `https://www.ecfr.gov/api/versioner/v1/full/2026-08-05/title-42.xml?chapter=IV&subchapter=B&part=414&section=414.1380`
  (the human URL `ecfr.gov/current/...` 302-redirects bots to `unblock.federalregister.gov`; the API works)
- govinfo CFR-2025 annual edition:
  `https://www.govinfo.gov/content/pkg/CFR-2025-title42-vol3/xml/CFR-2025-title42-vol3-sec414-1380.xml`

Section source note (confirms the amending rules):

> `[83 FR 60081, Nov. 23, 2018, as amended at 84 FR 63196, Nov. 15, 2019; 85 FR 19287, Apr. 6, 2020;
> 85 FR 85031, Dec. 28, 2020; 86 FR 65673, Nov. 19, 2021; 86 FR 73159, Dec. 27, 2021; 87 FR 7747,
> Feb. 10, 2022; 87 FR 70228, Nov. 18, 2022; 88 FR 15921, Mar. 15, 2023; 88 FR 79535, Nov. 16, 2023;
> 89 FR 98562, Dec. 9, 2024; 90 FR 50010, Nov. 5, 2025; 91 FR 12079, Mar. 12, 2026]`

**Grammatical note.** Read in isolation, "for all collection types where the top decile is higher
than 90 percent" is ambiguous — it could describe a *filter on collection types* (restrictive) or
describe the *resulting flat scale*, whose top decile is indeed ≥ 90. The preamble and CMS's own
fact sheet remove the ambiguity in favour of the restrictive (per-collection-type) reading, and the
published data confirms it.

**Sibling paragraphs matter — "flat" has three unrelated meanings in this program:**

| Provision | Flat benchmark because... | Affects |
|---|---|---|
| **414.1380(b)(1)(ii)(C)** | measure may cause **inappropriate treatment**, per collection type where top decile > 90% | 001, 236 |
| **414.1380(b)(1)(ii)(F)** | **Medicare CQM** collection type, first two performance periods in MIPS | 112SSP, 113SSP, 134SSP, 001SSP, 236SSP |
| **42 CFR 425.512(b)(6)** (Shared Savings Program) | **no adequate historical data** for benchmarking | 134 in SSP Web Interface, PY2022 |

Conflating these is the single easiest error here. Measure 134's flat benchmarks come from the
second and third rows, never from (C).

---

## 3. Task 1 — Pre-2022 benchmarks: RECOVERED (the decisive empirical test)

### 3.1 Sources

The QPP JSON API (`https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/<year>`) returns
**HTTP 500 for every year before 2023** — confirmed by direct probe for 2018–2022. But CMS still
hosts the historical ZIPs on its content bucket. All retrieved 2026-08-09:

| PY | URL | Workbook used |
|---|---|---|
| 2017 | `https://qpp-cm-prod-content.s3.amazonaws.com/uploads/78/2017%20-%20Quality%20Benchmarks.zip` | `MIPS_Benchmark_Update 2018 08 21.xlsx` |
| 2018 | `.../uploads/162/2018%20Quality%20Benchmarks.zip` | `2018 MIPS Quality Benchmarks_01312019.xlsx` |
| 2019 | `.../uploads/342/2019%20MIPS%20Quality%20Benchmarks.zip` | `2019 MIPS Quality Historic Benchmarks.xlsx` |
| 2020 | `.../uploads/824/2020%20MIPS%20Quality%20Benchmarks.zip` | `2020 MIPS Historical Quality Benchmarks.xlsx` |
| 2021 | `.../uploads/1275/2021%20MIPS%20Quality%20Benchmarks.zip` | `2021 MIPS Historical Quality Benchmarks.xlsx` |
| 2022 | `.../uploads/608/2022%20Quality%20Benchmarks.zip` | `2022 MIPS Historical Quality Benchmarks.xlsx` |

Cross-checked value-for-value against CMS's open-source repo
`https://github.com/CMSgov/qpp-measures-data` (`benchmarks/<year>.json`). Note pre-2023 CMS files
publish only **Deciles 3–10** (3 points was the scoring floor then).

### 3.2 The decisive test — PY2019, the last fully pre-flat historical benchmark

The PY2019 workbook's own header reads: *"Table 2: Historical MIPS Quality Measure Benchmark
Results; created using PY2017 data and PY2019 Eligibility Rules"* — i.e. exactly the vintage CMS
cited in the preamble when it predicted which collection types would be flattened.

**Measure 236 (direct — higher is better; threshold > 90%):**

| Collection type | Decile 10 | vs 90% line | Outcome from PY2020 on |
|---|---|---|---|
| MIPS CQM | **100** | above | **FLATTENED** |
| Medicare Part B Claims | **>= 94.89** | above | **FLATTENED** |
| eCQM | **>= 82.21** | **below** | **stayed data-driven** |

**Measure 001 (inverse — lower is better; threshold < 10%):**

| Collection type | Decile 10 | vs 10% line | Outcome |
|---|---|---|---|
| MIPS CQM | **<= 2.70** | below | **FLATTENED** |
| Medicare Part B Claims | **<= 2.78** | below | **FLATTENED** |
| eCQM | **<= 14.71** | **not below** | **stayed data-driven** |

This is a clean, non-trivial, six-for-six prediction match. **The claim's decisive empirical test
passes.**

### 3.3 Full pre-flat series for 236 (Decile 10 floor)

| PY (data vintage) | MIPS CQM / Registry | Part B Claims | eCQM / EHR |
|---|---|---|---|
| 2017 (PY2015) | >= 91.07 | >= 93.43 | >= 80.90 |
| 2018 (PY2016) | >= 88.59 | >= 94.07 | >= 80.43 |
| 2019 (PY2017) | **100** | **>= 94.89** | **>= 82.21** |
| 2020 (PY2018) | FLAT | FLAT | FLAT *(anomaly — §6.1)* |
| 2021 (PY2019) | FLAT | FLAT | >= 82.38 |
| 2022 (PY2020) | FLAT | FLAT | *suppressed, no benchmark* |
| 2023 (PY2021) | FLAT | FLAT | >= 81.35 |
| 2024 (PY2022) | FLAT | FLAT | >= 84.04 |
| 2025 (PY2023) | FLAT | FLAT | >= 84.74 |
| 2026 (PY2024) | FLAT | FLAT | >= 84.04 |

The PY2022 gap is fillable: although the PY2022 eCQM benchmark was suppressed, the same ZIP contains
`Preparing for 2023_Informational Benchmarks_Deciles 1 and 2.xlsx`, which carries the full
data-driven eCQM distribution for 236 — D1 `6.85 - 43.58` … **D10 `>= 81.43`** — alongside flat
MIPS CQM and Claims (D1 `0.01 - 9.99`, D2 `10.00 - 19.99`). That is the cleanest single-file
side-by-side of the flat and real distributions, and 81.43 is again below the 90% line.

**The eCQM top decile for 236 has never once reached 90% in any published year** — range 80.43 to
84.74 across a decade (81.43 in the suppressed PY2022 vintage). The registry/CQM figure crossed the line (88.59 → 100) exactly in the vintage
CMS used to make the determination.

Average performance rates tell the same story: PY2019 CQM 69.3 / Claims 72.2 / eCQM 63.0;
PY2022 CQM 63.68 / Claims 75.06 / eCQM 62.80. eCQM runs consistently lowest.

### 3.4 The smoking gun — 001 MIPS CQM oscillates

| PY (vintage) | 001 MIPS CQM Decile 10 | Flat? |
|---|---|---|
| 2019 (PY2017) | <= 2.70 | data-driven (pre-policy) |
| 2020 (PY2018) | — | **FLAT** |
| **2021 (PY2019)** | **<= 12.87** | **data-driven — fails the < 10% test** |
| 2022 (PY2020) | — | **FLAT** |
| 2023+ | — | **FLAT** |

Same measure, same collection type, flat in PY2020 and PY2022+, but **data-driven in PY2021** —
precisely the year its observed top decile (12.87%) failed the < 10% inverse criterion. A one-time,
measure-level designation cannot produce this. **This proves the test is applied per collection
type, against the observed distribution, and re-evaluated annually.**

---

## 4. Task 2 — Where CMS finalized (C), and what the preamble says

**CY 2020 PFS final rule**, 84 FR 62568 (Nov. 15, 2019), FR Doc. 2019-24086.
Preamble section III.K.3.d.(1)(b)(i)(C), headed **"(C) Modifying Benchmarks To Avoid the Potential
for Inappropriate Treatment"**, 84 FR 63014–63017. Reg text 84 FR 63196–63197. Proposed at
84 FR 40789–40790 (84 FR 40482, Aug. 14, 2019).
Source: `https://www.govinfo.gov/content/pkg/FR-2019-11-15/html/2019-24086.htm` (retrieved 2026-08-09).

Federal Register full-text search for the exact phrase *"potential to result in inappropriate
treatment"* returns **exactly two documents ever** — the CY2020 proposed and final rules. No later
rule has amended (C).

### 4.1 Measures named — exactly two

> "We have identified two measures for which we believe we need to apply benchmarks based on flat
> percentages to avoid potential inappropriate treatment--**MIPS #1 (NQF 0059): Diabetes: Hemoglobin
> A1c (HbA1c) Poor Control >9%) and MIPS #236 (NQF 0018): Controlling High Blood Pressure.** Although
> there are protections built into both of these measures, such as the use of less stringent
> requirements than current clinical guidelines, they lack comprehensive denominator exclusions and
> risk-adjustment or risk-stratification, which can lead to the possible over treatment of patients
> in order to meet numerator compliance." — 84 FR 63014–63015

**236 — named. 001 — named. 134 — NOT named** (see §5).

### 4.2 Rationale

> "Patient safety is our primary concern; therefore, we proposed to establish benchmarks based on
> flat percentages in specific cases where we determine the measure's otherwise applicable benchmark
> can potentially incentivize treatment that can be inappropriate for a particular patient type."
> — 84 FR 63014

> "Overtreatment could lead to instances where the patient's blood sugar or blood pressure is lowered
> to a level that meets the measure standard but is too low for their optimum health given other
> coexisting medical conditions." — 84 FR 63015

> "As long as the percent of these patients (those who may be at risk because they fall in this
> category) is less than 10 percent of the practice's eligible cases, our flat benchmark approach can
> completely remove any potential incentive to over-treat." — 84 FR 63016

### 4.3 Per collection type or per measure? — BOTH, a conjunctive two-part test

The clinical determination is **measure-level**; the > 90% screen is **collection-type-level**.

> "Because the factors for determining if a measure benchmark has the potential to cause
> inappropriate treatment may include both measure and benchmark considerations, we are concerned
> that all the benchmarks associated with the different collection types of a measure could be
> affected. Therefore, we proposed to use the flat percentage benchmarks ... **for all collection
> types where the top decile for any measure benchmark is higher than 90 percent** under the
> performance-based benchmarking methodology at Sec. 414.1380(b)(1)(ii)." — 84 FR 63015

The finalization sentence states both prongs:

> "we are finalizing a policy to use the flat percentage benchmarks as an alternative to our standard
> method of calculating benchmarks by a percentile distribution of measure performance rates **for
> all collection types where the top decile for any measure benchmark is higher than 90 percent** and
> **when CMS medical officers assess that there are patients for whom it would be inappropriate to
> achieve the outcome targeted by the measure benchmark**." — 84 FR 63016

A commenter raised exactly the asymmetry at issue here, and CMS's response is decisive:

> *Comment:* "one commenter expressed concern that the measures proposed for the application of the
> flat percentages are claims based measures and MIPS CQMs, and that the application of the flat
> benchmark may unfairly lower the bar for clinicians utilizing the claims-based and MIPS CQM
> versions of the measures, **without providing the same adjustment to all collection types**."
>
> *Response:* "**We recognize that not applying the same benchmarking methodology to all collection
> types may create some inconsistent evaluation between collection types for a single measure.** On
> the other hand, **we know there are differences in performance by data collection type**, and we
> are concerned that if we apply this method to all collection types without regard to the collection
> type distribution, then we would harm those with top performance for certain collection types.
> Given this tension, **we believe it is better to limit the benchmark proposal to those collection
> types where the top decile is 90 percent or higher.** ... At this time, we are proceeding cautiously
> with this approach by **limiting application of this policy to two measures and two collections
> types**." — 84 FR 63016

### 4.4 Why 90 percent — the mechanism the claim asserts

> "We are limiting the application of the flat percentage methodology to all collection types where
> the top decile for any measure benchmark is higher than 90 percent so that our flat percentage
> methodology will actually reduce or remove the incentive for inappropriate care. **If the top decile
> was originally below 90 percent, using the flat percentages would actually raise the level up to 90
> percent, and therefore, provide a stronger incentive to provide inappropriate care in order to get
> the top score.**" — 84 FR 63015

This is the load-bearing sentence. Flattening a sub-90% benchmark would *raise* the bar and make the
patient-safety problem worse. That is precisely why eCQM — sitting at ~82% — was left alone.

### 4.5 CMS predicted the outcome in advance

> "For the two measures we proposed to modify, we will not know which benchmarks and their associated
> collection types are impacted until we run our analysis; however, **based on the benchmarks for the
> 2019 MIPS performance period, we anticipate using the modified benchmarks for the Medicare Part B
> claims and the MIPS CQM collection types.**" — 84 FR 63015

CMS named Part B Claims and MIPS CQM — and, by omission, not eCQM — *before* running the analysis,
based on the PY2019 benchmarks. §3.2 shows those PY2019 benchmarks had eCQM at 82.21 vs CQM at 100
and Claims at 94.89. CMS's prediction and the observed outcome agree.

---

## 5. Task 3 — Is there a published list? No. Is 134 on it? No.

**There is no standing published list.** The only commitment is rulemaking:

> "**Before applying the flat percentage benchmarking methodology to any recommended measure, we will
> propose the modified benchmark for the applicable MIPS payment year through rulemaking.**"
> — 84 FR 63014

> "We believe identifying these measures through rulemaking provides a transparent process for the
> public to provide feedback." — 84 FR 63015

The determination is made by **CMS medical officers**:

> "CMS medical officers will assess if there are patients for whom it would be inappropriate to
> achieve the outcome targeted by the measure benchmark. This assessment will include reviews of
> factors such as whether the measure specifications allow for clinical judgment to adjust for
> inappropriate outcomes, if the benchmarks for any of the impacted measure's collection types could
> put these patients at risk by setting a potentially harmful standard for top decile performance, or
> whether the measure is topped out. ... The assessment will take into account all available
> information, including from the medical literature, published practice guidelines, and feedback
> from clinicians, groups, specialty societies, and the measure steward." — 84 FR 63014

Contrast **(b)(1)(ii)(E)**, which *does* mandate an annual Federal Register list — but for
topped-out measures impacted by limited measure choice, an unrelated policy.

**The population subject to (C) is exactly {001, 236}, and has never changed since Nov. 2019.**
Since then, the string "(b)(1)(ii)(C)" appears in exactly one CMS PFS final rule — a bare
cross-reference at 85 FR 84729 (CY2021 PFS).

**Measure 134 is absent, and that is a genuine trap.** 134 (Preventive Care and Screening: Screening
for Depression and Follow-Up Plan) *does* appear alongside "flat percentage benchmarks" at
**87 FR 69865** (CY2023 PFS) — but under Shared Savings Program authority **§ 425.512(b)(6)**, for a
different reason entirely:

> "We have determined that we do not have adequate historical data available for benchmarking for the
> Preventive Care and Screening: Screening for Depression and Follow-up Plan (Quality ID# 134) measure
> for the 2022 performance year. Therefore, we proposed pursuant to Sec. 425.512(b)(6) to set flat
> percentage benchmarks..." — 87 FR 69865

The phrase "inappropriate treatment" appears **zero times** in the entire CY2023 PFS final rule
(verified by full-text scan). In the PY2023–PY2026 QPP files, 134 carries ordinary data-driven
distributions under MIPS CQM, eCQM, and Part B Claims (and is topped out under CQM/Claims). Its only
flat rows are `134SSP` Medicare CQM in PY2025, which come from **(F)**.

The QPP benchmark CSVs never label a flat benchmark as such: `Benchmark Type` emits only
`Historical`, `Performance Period`, or `--`, and across all four years 2023–2026 the `Comments`
column carries only topped-out / insufficient-data / new-measure / spec-change notes — **no comment
value in any year contains the word "flat"**, and every 001, 236 and 134 row reads literally `N/A`
(verified). Flatness is inferable only from the decile values.

(Caution when parsing: the CSV header for that field is `"Comments "` **with a trailing space**. A
naive `row["Comments"]` lookup silently yields nothing and makes the column look empty.)

---

## 6. Task 4 — Alternative explanations tested

### 6.1 "CMS never flattens eCQM" — **REFUTED** (and this is the claim's one real blemish)

In **PY2020, measure 236 eCQM WAS flat** — all three collection types were flattened. CMS's own
Version History sheet in `2020 MIPS Historical Quality Benchmarks.xlsx` documents it as a mid-cycle
change (Excel serial 43880 = **2020-02-14**):

> "3. Measure 236 now has a flat benchmark applied to the eCQM"

(Original posting was serial 43830 = 2019-12-26.) CMS **reverted** this for PY2021, where 236 eCQM is
data-driven again at `>= 82.38`. Likewise **001 eCQM was flat in PY2022** and data-driven again in
PY2023.

So the honest statement is not "eCQM is never flattened" but "**eCQM does not meet the criteria in
the ordinary case, and the two years it was flattened look like errors CMS corrected**." The PY2018
data vintage underlying PY2020 had all three 236 collection types below 90 (registry ~84, claims ~89,
eCQM ~77 per the pre-flat repo commit `99ab227021d7`), which would not have triggered the rule for
*any* collection type — so PY2020's all-flat treatment is inconsistent with (C) as written, in both
directions. Treat those specific pre-flat commit numbers as **indicative only**: the interim
`qpp-measures-data` commits carry a decile-shift defect that CMS documents in its own 2021 Version
History, and the array convention changed ("Trim decile 0", "Shift nonProp measure deciles back").
The final `benchmarks/<year>.json` files match the published workbooks exactly; the interim ones do
not.

### 6.2 "The eCQM version is a distinct measure (CMS165) with its own determination" — **REFUTED**

CMS treats 236 as **one measure with multiple collection types**, not as separate measures. The
regulation's clinical prong is measure-level ("for each measure that has a benchmark that CMS
determines..."); only the > 90% screen is per collection type. The comment-response at 84 FR 63016
explicitly frames the result as "inconsistent evaluation between collection types **for a single
measure**." The eCQM ID (CMS165vNN) varies year to year while the (C) treatment does not track it.

### 6.3 "Flat applies only where the measure is topped out" — **REFUTED**

CMS said the opposite in the same rule: "the measures that we selected to apply the flat percentage
benchmarks to are **not topped out** for any of the collection types" (84 FR 63015). The data agrees:
236 MIPS CQM and Claims carry `Topped Out = No` in every year 2023–2026 yet are flat, while 134 IS
topped out under MIPS CQM/Claims and is **not** flat under (C). Topped-out status is one input to the
medical officers' review, not the trigger.

### 6.4 "eCQM benchmarks were unavailable/performance-period so flattening never applied" — **REFUTED**

236 eCQM had ordinary **Historical** benchmarks in PY2023, PY2025 and PY2026 and was still not
flattened. See also §7.

### 6.5 The inverse-measure wrinkle — a real gap between text and practice

The codified text says only "**higher than 90 percent**," which is incoherent for an inverse measure
like 001, where better performance is a *lower* rate. CMS operationalizes a symmetric analog that
appears **only in the fact sheet, never in the CFR or the preamble**:

> "*Flat benchmarks are applied to collection types where the top decile for a historical benchmark
> is **greater than 90% (or less than 10% for inverse measures)**."
> — *2021 MIPS Quality Benchmarks Fact Sheet*, p. 3

This is the single most decisive secondary document found, because it also states the outcome
per collection type and confirms annual re-evaluation:

> "The 2021 benchmark file also reflects the flat benchmarks finalized through previous rulemaking
> for Measures 001 and 236.
> • **Measure 001: Flat benchmarks only apply to the Medicare Part B Claims measure collection type.
>   (The MIPS CQM and eCQM collection type did not meet the criteria set forth in the rule for
>   establishing a flat benchmark*.)**
> • **Measure 236: Flat benchmarks apply to MIPS CQM and Medicare Part B Claims measure collection
>   types**"

Source: `2021 MIPS Quality Benchmarks Fact Sheet.pdf`, inside
`https://qpp-cm-prod-content.s3.amazonaws.com/uploads/1275/2021%20MIPS%20Quality%20Benchmarks.zip`
(retrieved and text-extracted 2026-08-09). This is CMS stating the claim's mechanism outright.

---

## 7. Task 5 — Does `Benchmark Type = Performance Period` exempt a benchmark? **NO**

The PY2024 file shows 236 eCQM with `Benchmark Type = Performance Period`. That is **not** why it
escaped flattening.

**Direct counterexample:** in the **PY2023** file, measure **001 / Medicare Part B Claims** carries
`Benchmark Type = Performance Period` **and is flat** (`99.00 - 90.01` … `<= 10.00`). A
performance-period benchmark was flattened. The exemption hypothesis is refuted by CMS's own data.

Structurally this is also right: (b)(1)(ii) covers benchmarks based on "the applicable baseline **or
performance period**," and (C) applies to "the methodology at paragraph (b)(1)(ii)" — which includes
both. Note the fact sheet says "top decile for a **historical** benchmark," so the *screen* is
computed on historical data, but the resulting flat treatment is not confined to historical-type rows.

Separately, the "Performance Period" label on 236 eCQM in PY2024 is explained by ordinary benchmark
mechanics, not by (C): 236 eCQM had **no benchmark at all in PY2022** (suppressed), so no historical
baseline existed for PY2024. Confirming this, the **PY2026 236 eCQM row is byte-identical to the
PY2024 row** (`4.76 - 45.27` … `>= 84.04`, avg 66.06) but relabeled `Historical` — exactly what the
two-year lookback predicts when PY2026's baseline is PY2024.

---

## 8. What the record proves vs. what is merely consistent

**PROVEN:**
- The text, authorship, and date of (C); that it was finalized in CY2020 PFS, never amended.
- That the test is conjunctive: measure-level clinical determination by CMS medical officers **AND**
  a per-collection-type top-decile screen.
- That the screen is > 90% (direct) / < 10% (inverse), applied to the historical benchmark.
- That in the decisive PY2019 vintage, 236 eCQM (82.21) and 001 eCQM (14.71) failed the screen while
  MIPS CQM and Part B Claims passed it — six for six.
- That the screen is re-run annually (001 MIPS CQM reverted to data-driven in PY2021 at 12.87%).
- That only 001 and 236 are subject to (C); 134 is not.
- That performance-period benchmark type confers no exemption.

**CONSISTENT BUT NOT PROVEN:**
- That eCQM performance is *systematically* lower than MIPS CQM and Part B Claims. The pattern holds
  in every year examined for 236 (eCQM avg 62.8–66.2 vs CQM 63.7–72.8 vs Claims 72.2–79.7) and is
  dramatic for 134 (eCQM ~40–48 vs CQM ~85–90 vs Claims ~95–96). But this is an observed regularity
  across a handful of measures, not a demonstrated general law.

**UNVERIFIED — the claim's one unsupported element:**
- **"(structured-data capture loss)"**. CMS nowhere attributes the eCQM/registry performance gap to
  structured-data capture, EHR extraction fidelity, or any other cause. The closest CMS comes is the
  bare acknowledgment at 84 FR 63016: *"we know there are differences in performance by data
  collection type."* The causal explanation is the claimant's own inference. It is plausible and
  widely believed, but **it is not in the record**, and nothing in this investigation tests it. The
  claim's *conclusion* does not depend on it — the mechanism works on the observed distributions
  regardless of why they differ.

**NOT RECOVERABLE:** the exact PY2018-vintage top deciles for 236/001 as CMS finally computed them,
because the published PY2020 workbook had already been overwritten with flat values. The pre-flat
figures survive only in an interim `qpp-measures-data` commit that carries a documented decile-shift
defect, so they cannot be quoted as authoritative.

---

## 9. Artifacts

Downloads and extracts: `/home/jmandel/hobby/.agent-scratch/q3-benchmarks/`
- `bm-2023.csv` … `bm-2026.csv` — authoritative QPP benchmark CSVs
- `cms/` — official CMS benchmark ZIPs and workbooks, PY2017–PY2022, plus fact sheets
- `cy2020pfs.clean.txt` — whitespace-normalized CY2020 PFS final rule (FR text is hard-wrapped, so
  naive `grep "flat percentage"` returns **zero** hits on the raw HTML — normalize first)
- `ecfr-1380.xml`, `cfr2025-414-1380.xml` — regulation text from two sources
- `gh-bm-2017.json` … `gh-bm-2023.json` — CMS `qpp-measures-data` benchmark JSONs

Decile-array convention for `qpp-measures-data` (calibrated, not assumed): the 9-element `deciles`
array holds the **lower bounds of deciles 2 through 10**; the last element is the decile-10 floor.
Verified by exact match of PY2021 measure 134 EHR `[1.8, 7.13, 15.39, 24.4, 33.79, 45.43, 58.94,
72.82, 90.52]` against the PY2023 CSV bands (D2 `1.80 - 7.12` … D10 `>= 90.52`).
