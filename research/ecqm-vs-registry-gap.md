# Why eCQM Reporters Score Lower Than Registry/Chart-Review Reporters

Evidence base for the simulator's "data-capture efficiency" model.
**All retrieval dates: 2026-08-09** unless otherwise stated.

---

## BOTTOM LINE

**Verdict: PARTIALLY SUPPORTED. The capture tax is real, well-evidenced, and our model's
equation is exactly right — CMS publishes the identical arithmetic. But the conclusion we
draw from it is wrong: the rate gap mostly does *not* become a score gap, and the real
eCQM penalty in APP Plus comes from a benchmark-policy artifact on two measures, not from
"easier eCQM benchmarks."**

Four claims, graded:

| # | Claim | Verdict |
|---|---|---|
| 1 | eCQM reporting produces **lower measured rates** than registry/chart-review on the same measure | **SUPPORTED — strongly, but measure-specific.** National MIPS benchmarks: median **+12.3 pp**, eCQM worse in **95%** of 80 measure-years and **23 of 23** measures. PY2024 MSSP ACO-level vs chart abstraction: **+8.7 to +25.7 pp**, all p<0.0001. Never a uniform discount — it ranges from ~0 to 44 pp by measure. |
| 2 | The cause is **data capture**, not worse care | **SUPPORTED.** The gap scales with how hard the data element is to capture (§2.5, 3.7× gradient), and the literature reproduces that ordering independently on the same patients — Bailey 2016 finds κ 0.96–1.00 for in-office values vs **κ 0.42 for breast cancer screening** (PMID 27522472). Case mix is affirmatively ruled out (§7.2): eCQM ACOs are not sicker, and the registry ACOs outscoring them are markedly sicker. |
| 3 | Therefore **"CMS's eCQM benchmarks are systematically easier than MIPS CQM benchmarks"** | **PARTIALLY SUPPORTED — and FALSE for 001 and 236.** True where both sides carry observed benchmarks (median Decile 5 bar 14.7 pp easier). But CMS gives MIPS CQM a **flat** benchmark on 001 and 236, making the *registry* benchmark easier by **23.3 pp and 25.6 pp**. |
| 4 | *(implied by our design)* The rate gap is what disadvantages eCQM reporters | **LARGELY UNSUPPORTED.** Because CMS benchmarks each collection type against its own distribution, the average eCQM reporter earns a **higher** decile than the average registry reporter in **54 of 72** measure-years (mean +1.36 deciles) — often over-correcting. |

### The three corrections that matter

**1. The rate gap and the score gap are different things (§2.8).** CMS's collection-type-specific
benchmarking neutralizes, and frequently over-corrects, the raw-rate gap. On measure 134 an
eCQM reporter at 45.6% earns **Decile 6** while a registry reporter at 85.6% earns **Decile 3**.
The flattering registry rate scores *worse*. Our narrative implies the opposite.

**2. The real eCQM penalty in APP Plus is a flat-benchmark artifact, not a capture artifact.**
For the two intermediate-outcome measures that carry the outcome gate:

| Measure | avg eCQM reporter | avg MIPS CQM reporter | Δ |
|---|---|---|---|
| **001** | Decile 4 (historical ladder) | **Decile 8** (flat ladder) | **−4 deciles** |
| **236** | Decile 5 (historical ladder) | **Decile 7** (flat ladder) | **−2 deciles** |
| 112 / 113 | Decile 5 | Decile 5 | 0 |
| 134 | Decile 6 | Decile 3 | **+3** |

So the correct causal chain is:
`capture loss → lower eCQM rate → usually neutralized by collection-type benchmarks →
EXCEPT on 001 & 236, where MIPS CQM's flat benchmark fails to neutralize it → 2–4 deciles lost.`

**3. Our functional form is exactly CMS's arithmetic (§4.1a) — a genuine validation.** CMS's own
APP guidance works a 1,000-patient example in which identical care yields **eCQM 74% vs
MIPS CQM 78%**, because undeterminable patients are scored "Performance Not Met" in an eCQM
but dropped from the MIPS CQM performance-rate denominator. That rule implies
`eCQM/MIPS CQM = (1−u)`, i.e. `measured = true × capture` — precisely `captureLoss()` at
`PathwayLab.tsx:197`. Verified numerically to 6 decimal places. The inverse branch for 001
derives identically.

### Calibration and caveats

- **Our 85% global slider is not well calibrated.** Implied capture from real PY2024 MSSP data
  is **68.5%–99%** depending on measure and comparator (§3.4) — a spread wider than our entire
  slider range. 85% is about right against chart abstraction, too pessimistic against registry.
- **A large part of the *national benchmark* gap is reporter selection, not capture** (§7.3):
  eCQM reporters sit in practices ~6.6× larger, and the eCQM benchmarks in force were built
  from as few as 12–72 early-transition ACOs (§7.4). We read the whole national gap as capture.
- **Treating MIPS CQM as ground truth is an idealization the literature does not support**
  (§6.5). Homco 2020 found latent-class truth for BP control matched the **EHR (75.0%)**, not
  the abstraction (80.6%); physician abstractors agree with each other only at κ=0.75.
- **Denominator leakage flatters eCQM rates** (§5.1), so it works *against* the observed gap —
  our estimate is conservative, and our UI note on this has the right sign.
- **CMS never states in rulemaking that eCQM capture lowers rates** (§4.6). Its rulemaking
  attributes ACO score drops to the **all-payer denominator**, and its stated reason for
  collection-type benchmarks is **non-comparable specifications** — not lower eCQM rates. CMS
  has separately called eCQM structured capture "**more accurate**" than chart abstraction
  (82 FR 38357).

---

## Sources

| # | Source | URL | Retrieved | How fetched |
|---|---|---|---|---|
| B1 | QPP quality benchmarks CSV, PY2023 | `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2023` | 2026-08-09 | curl, HTTP 200, 168,827 B, 525 rows. MD5 `1cf2032c6b87d37bd8a242e57c257555` |
| B2 | QPP quality benchmarks CSV, PY2024 | `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2024` | 2026-08-09 | curl, HTTP 200, 145,337 B, 460 rows. MD5 `c1616da5de838eb2627df0c278f1c842` |
| B3 | QPP quality benchmarks CSV, PY2025 | `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2025` | 2026-08-09 | curl, HTTP 200, 145,955 B, 480 rows. MD5 `68ef0db5b83df38b34479ef4be228ff3` |
| B4 | QPP quality benchmarks CSV, PY2026 | `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2026` | 2026-08-09 | curl, HTTP 200, 138,136 B, 450 rows. MD5 `3c4ba299ad2f604f7852b3b9c5433400` |
| B5 | MSSP PY2024 Performance Year Financial and Quality Results PUF (revised 2026-07-17) | `https://data.cms.gov/sites/default/files/2026-07/fb6ba14b-3450-47c2-8ff5-d1f2a5bdb3e3/PY_Financial_and_Quality_Results_2024_revised%202026_07_17.csv` | 2026-08-09 | curl w/ browser UA, 437,855 B, 476 ACOs, 189 columns |
| B6 | 42 CFR Part 414 Subpart O (data completeness, § 414.1340) | `https://www.ecfr.gov/api/versioner/v1/full/2026-08-05/title-42.xml?chapter=IV&subchapter=B&part=414&subpart=O` | 2026-08-09 | eCFR Versioner API via curl |

Derived tables written by this analysis:

- `research/data/ecqm-vs-mipscqm-benchmark-gap.csv` (31.6 KB, 103 measure-years) — every
  paired eCQM/MIPS CQM benchmark cell PY2023–PY2026 with parsed decile entries and signed gaps.
- `research/data/mssp-py2024-rates-by-collection-type.csv` (26.3 KB, 443 ACOs) — per-ACO
  PY2024 rates on 001/134/236 plus risk score, % dual, track, revenue category, collection type.

---

## 1. The claim under test

The simulator (`src/PathwayLab.tsx:194-202`) models:

```
mipscqm : measured = underlying                      // "abstraction finds the evidence"
ecqm    : measured = captureLoss(underlying)         // structured-capture gaps
captureLoss(r) = inverse ? r + (1-c)*(100-r) : r*c   // c = capture efficiency, default 0.85
```

So MIPS CQM is treated as ground truth and eCQM as ground truth minus a capture tax. The
UI (`:937-944`) asserts the resulting gap is what CMS's "easier electronic benchmarks"
encode. Below I test the premise, the mechanism, and the benchmark claim separately,
because they turn out to have different verdicts.

---

## 2. Task 1 — Quantifying the gap from the published benchmark files

### 2.1 Method (my own computation)

1. Downloaded B1–B4. Headers are byte-identical across all four years (note the trailing
   space in the `Comments ` column).
2. Normalized `Measure ID` by stripping parenthetical suffixes
   (`112 (Not available in Traditional MIPS)` → `112`). Medicare CQM rows carry an `SSP`
   suffix and are kept separate.
3. Parsed each decile string into an **entry value** = the rate a reporter must reach to
   land in that decile. This is the *first* numeric token in both directions:
   normal `40.00 - 49.99` → 40.00; inverse `60.00 - 50.01` → 60.00 (you need a rate ≤ 60.00);
   `>= 90.00` → 90.00; `<= 10.00` → 10.00; `--` → null (a collapsed decile, the signature of
   a topped-out measure).
4. **Flat-benchmark detection.** The CSV's own `Benchmark Type` column never emits the
   string "Flat" — it only says `Historical` or `--`, and it labels flat ladders
   `Historical`. Flat status must therefore be inferred by matching the two canonical
   ladders: normal D2–D10 entries = 10,20,…,90; inverse = 90,80,…,10.
5. Paired eCQM against MIPS CQM on (year, base measure ID).
6. **Sign convention.** "eCQM disadvantage", in percentage points, is positive when eCQM is
   *worse*: `normal → CQM − eCQM`; `inverse → eCQM − CQM`. Applied identically to average
   rates and to every decile cutpoint.

**Two tiers, because flat cells are only half-synthetic.** The task brief said to exclude
flat-benchmarked cells as synthetic. That is correct for the *decile ladder* but not for
the *Average Performance Rate*, and the distinction turns out to matter a great deal:

- I verified that of 22 flat-benchmarked rows across the four files, **16 publish an
  Average Performance Rate and 6 do not**. The 6 without an average are exactly the
  brand-new Medicare CQM rows (`001SSP`, `112SSP`, `113SSP`, `134SSP`, `236SSP`) — no
  history existed.
- The 16 *with* an average are 001 and 236 under MIPS CQM and Medicare Part B Claims, and
  their averages move every single year (001 MIPS CQM: 34.00 → 27.30 → 25.75 → 23.12).
  A synthetic value would not do that.

**Conclusion: for measures 001 and 236, CMS demonstrably holds the observed MIPS CQM
distribution and applies a flat ladder as a policy choice, not for want of data.** So:

- **Tier A (cutpoints)** — both sides carry a historical ladder. Used for decile gaps.
- **Tier B (rates)** — both sides publish an average, regardless of ladder type. Used for
  rate gaps. This is what lets measures 001 and 236 be analyzed at all.

**Year independence check.** Benchmark files could simply repeat. Comparing byte-identical
(average + all 10 deciles) rows between year files: 2023↔2024 1%, 2023↔2025 10%,
2023↔2026 1%, 2024↔2025 2%, **2024↔2026 22%**, 2025↔2026 2%. Restricted to eCQM and
MIPS CQM rows, 2024↔2026 identity is 6/36 and 15/105. So years are mostly but not entirely
independent; PY2026 reuses a meaningful minority of PY2024 cells. Treat n as somewhat
inflated. Per-measure means (each measure counted once) are reported alongside every
pooled figure for this reason.

### 2.2 Headline result — average performance rate

Tier B, 80 measure-years, 23 distinct measures:

| Slice | n | median gap | mean gap | IQR | range | eCQM worse in |
|---|---|---|---|---|---|---|
| **All measure-years** | 80 | **+12.34 pp** | +17.11 | [+5.2, +32.1] | [−13.6, +45.4] | **95%** |
| PY2023 | 23 | +12.08 | +17.31 | [+6.7, +33.7] | [−2.0, +44.8] | 96% |
| PY2024 | 20 | +14.16 | +17.35 | [+4.9, +35.2] | [−2.7, +44.0] | 95% |
| PY2025 | 19 | +13.08 | +18.41 | [+5.8, +32.1] | [+2.4, +42.6] | 100% |
| PY2026 | 18 | +12.45 | +15.21 | [+4.1, +25.2] | [−13.6, +45.4] | 89% |
| Neither side topped out | 29 | +12.32 | +13.74 | [+4.1, +17.8] | [−13.6, +43.9] | 90% |
| Outcome / intermediate outcome | 12 | +5.89 | +8.10 | [+4.0, +16.2] | [+2.4, +17.8] | **100%** |
| Process measures | 68 | +14.16 | +18.70 | [+6.8, +34.4] | [−13.6, +45.4] | 94% |
| **Per-measure means (years deduped)** | 23 | **+14.42** | +17.56 | [+6.1, +29.9] | [+1.2, +43.6] | **100%** |

The effect is **remarkably stable across four years** (median +12.1 / +14.2 / +13.1 / +12.5)
and survives every restriction. On a per-measure basis **23 of 23 measures show eCQM
measuring worse on average**.

Note the outcome/process split: outcome measures show a *much smaller* gap (+5.9 pp median)
than process measures (+14.2 pp). That is itself mechanistically informative — see §2.5.

### 2.3 Decile cutpoints (Tier A)

Both ladders historical. Positive = the eCQM bar is *lower*, i.e. the eCQM benchmark is easier.

| Decile | n | median | mean | eCQM benchmark easier in |
|---|---|---|---|---|
| 1 | 72 | +0.82 | +6.80 | 68% |
| 2 (10th pctile — outcome gate) | 71 | +15.83 | +20.83 | 90% |
| 3 | 68 | +15.67 | +26.23 | 91% |
| 4 | 64 | +16.32 | +26.93 | 92% |
| **5 (40th pctile — QPS gate)** | 47 | **+14.67** | +24.53 | **89%** |
| 6 | 41 | +13.87 | +22.98 | 88% |
| 7 | 31 | +13.72 | +19.60 | 90% |
| 8 | 19 | +13.97 | +22.44 | 89% |
| 9 | 15 | +16.41 | +22.85 | 87% |
| 10 | 72 | +3.52 | +7.98 | 69% |

Excluding pairs topped out on either side (n=21) the effect shrinks but persists:
Decile 2 median +6.14, Decile 5 median +12.71, Decile 10 median +13.86.

Deciles 1 and 10 show small gaps because they are floor/ceiling bands, not because the
distributions converge there.

### 2.4 The counter-finding: measures 001 and 236 reverse the benchmark claim

Because MIPS CQM carries a **flat** ladder for 001 and 236 in every year, "which benchmark
is easier to score against" flips for exactly those two measures. What a reporter must
achieve to reach Decile 5 (the 40th-percentile / QPS bar):

| Measure | Year | eCQM D5 bar | MIPS CQM D5 bar | Ladders | Easier benchmark |
|---|---|---|---|---|---|
| **001** (inverse) | 2026 | ≤ 36.72 | ≤ 60.00 | Historical / **Flat** | **MIPS CQM easier by 23.28 pp** |
| **001** | 2025 | ≤ 40.28 | ≤ 60.00 | Historical / Flat | MIPS CQM easier by 19.72 |
| **001** | 2024 | ≤ 41.62 | ≤ 60.00 | Historical / Flat | MIPS CQM easier by 18.38 |
| **001** | 2023 | ≤ 46.15 | ≤ 60.00 | Historical / Flat | MIPS CQM easier by 13.85 |
| **236** | 2026 | ≥ 65.61 | ≥ 40.00 | Historical / **Flat** | **MIPS CQM easier by 25.61 pp** |
| **236** | 2025 | ≥ 65.32 | ≥ 40.00 | Historical / Flat | MIPS CQM easier by 25.32 |
| **236** | 2024 | ≥ 65.61 | ≥ 40.00 | Historical / Flat | MIPS CQM easier by 25.61 |
| **236** | 2023 | ≥ 60.71 | ≥ 40.00 | Historical / Flat | MIPS CQM easier by 20.71 |
| 134 | 2026 | ≥ 31.79 | ≥ 98.97 | Historical / Historical | eCQM easier by **67.18** |
| 134 | 2023–25 | 24.40 / 31.79 / 35.28 | 96.65 / 99.22 / 99.78 | Hist / Hist | eCQM easier by 72.25 / 67.43 / 64.50 |
| 112 | 2025 | ≥ 55.16 | ≥ 67.87 | Hist / Hist | eCQM easier by 12.71 |
| 112 | 2023–24 | 48.18 / 52.42 | 59.02 / 67.09 | Hist / Hist | eCQM easier by 10.84 / 14.67 |
| 113 | 2025 | ≥ 45.90 | ≥ 70.92 | Hist / Hist | eCQM easier by 25.02 |
| 113 | 2023 | ≥ 43.90 | ≥ 52.67 | Hist / Hist | eCQM easier by 8.77 |

So of the five APP Plus clinical measures, **three confirm our benchmark claim and two
invert it** — and the two that invert it are the two intermediate-outcome measures that
carry the outcome gate.

(*Why* CMS flat-benchmarks 001 and 236 under MIPS CQM — the clinical-guardrail rationale
and the "top decile above 90%" test — is out of scope here and is covered by the separate
benchmark-design research file. What matters for this document is only that the flat ladder
is a policy choice made despite CMS holding the observed distribution, and that it reverses
the direction of the benchmark-difficulty comparison for those two measures.)

Underlying measured performance still runs the way we claim for all five:

| Measure | PY2023 | PY2024 | PY2025 | PY2026 | mean |
|---|---|---|---|---|---|
| 001 Glycemic >9% (inverse) | +12.35 | +16.23 | +16.95 | +17.79 | **+15.83** |
| 112 Breast cancer screening | +12.08 | +15.08 | +13.08 | *no benchmark* | +13.41 |
| 113 Colorectal screening | +7.33 | — | +21.51 | *no benchmark* | +14.42 |
| 134 Depression screening + follow-up | +43.37 | +44.00 | +40.73 | +40.03 | **+42.03** |
| 236 Controlling high blood pressure | +6.66 | +5.20 | +6.59 | +2.65 | **+5.27** |

Note 001's gap is **widening** year over year (+12.4 → +17.8) while 236's is **narrowing**
(+6.7 → +2.7).

### 2.5 The mechanistic gradient — my strongest evidence for *capture* specifically

If the gap were case mix or reporter selection, it should apply roughly uniformly across
measures, because the same reporters report all of them. If it is capture, it should scale
with how hard the required data element is to capture as conforming structured data.

I classified each of the 23 measures by what its numerator actually requires. **The
classification is my own judgment, not CMS's**, and is the softest link in this section:

| Data element the numerator depends on | n | mean gap | measures (gap) |
|---|---|---|---|
| 1. Satisfied by **absence** of an act, or by the med list itself | 3 | **+4.2** | 130 +2.9, 238 +3.6, 065 +6.3 |
| 2. Medication **present** on the active med list | 4 | **+7.4** | 438 +1.2, 007 +6.1, 008 +6.4, 005 +15.8 |
| 3. Vital sign / lab value generated **inside** the reporting practice | 3 | **+8.1** | 191 +3.2, 236 +5.3, 001 +15.8 |
| 4. Test that must be ordered, resulted **and** coded | 2 | +31.8 | 066 +29.9, 488 +33.7 |
| 5. Event usually performed **outside** the practice (needs interoperability) | 5 | **+23.1** | 019 +11.4, 112 +13.4, 113 +14.4, 117 +32.5, 374 +43.6 |
| 6. Assessment + documented **follow-up plan** (typically narrative) | 6 | **+26.4** | 143 +11.2, 226 +15.7, 128 +24.6, 110 +26.5, 317 +38.5, 134 +42.0 |

**Groups 1–3 (data already sitting in a discrete field): mean +6.7 pp.
Groups 5–6 (data outside the practice or inside a note): mean +24.9 pp. Ratio 3.7×.**

The ordering is monotone across groups 1→3 and again 5→6, and the two poles are exactly
the ones the capture hypothesis names. The extremes are instructive:

- **374 "Closing the Referral Loop: Receipt of Specialist Report" (+43.6 pp)** — the single
  largest gap in the dataset. Its numerator *is* an interoperability event.
- **134 "Depression Screening and Follow-Up Plan" (+42.0 pp)** — the follow-up plan is
  almost always narrative.
- **130 "Documentation of Current Medications" (+2.9 pp)** and **238 "Use of High-Risk
  Medications in Older Adults" (+3.6 pp)** — satisfied by the med list itself, or by the
  *absence* of a prescription, which an eCQM detects perfectly.
- **236 "Controlling High Blood Pressure" (+5.3 pp)** — a BP is a discretely-captured vital
  sign in every certified EHR. This is why 236 has the smallest gap of the APP Plus five,
  and it is a direct prediction of the capture model.

This gradient is difficult to explain by case mix or selection and is, in my judgment, the
most persuasive evidence in this document that the mechanism is capture.

### 2.6 Topped-out asymmetry — a clean directional signal

Across all 103 paired measure-years, PY2023–PY2026:

| | count |
|---|---|
| eCQM topped out but MIPS CQM not | **0** |
| MIPS CQM topped out but eCQM not | **40** |
| both topped out | 12 |
| neither | 51 |

**Not once in four years does an eCQM measure top out while its registry twin does not.**
Forty times the reverse happens. Under a null of no method effect this is essentially
impossible.

Related: the eCQM measure universe is also much smaller and shrinking — 47/45/47/49 eCQM
rows per year (36–41 with benchmarks) against 162–172 MIPS CQM rows (105–131 with
benchmarks).

### 2.7 Counterexamples (these matter)

Only **4 of 80** measure-years show eCQM measuring *better*:

| Year | Measure | eCQM | MIPS CQM | gap |
|---|---|---|---|---|
| PY2026 | 128 BMI Screening and Follow-Up Plan | 71.71 | 58.11 | **−13.60** |
| PY2024 | 438 Statin Therapy | 78.25 | 75.60 | −2.65 |
| PY2026 | 438 Statin Therapy | 78.25 | 75.60 | −2.65 |
| PY2023 | 130 Documentation of Current Medications | 88.50 | 86.45 | −2.05 |

- **128 in PY2026 is a measure respecification, not a reversal.** Both sides moved violently
  in opposite directions in the same year: eCQM 47.09 → 71.71 while MIPS CQM 86.90 → 58.11,
  and MIPS CQM simultaneously *lost* topped-out status. In PY2023–25 the measure ran
  +35.8 / +36.3 / +39.8. Treat PY2026 128 as a definitional break.
- **438 Statin Therapy is the one genuine, replicated counterexample** (−2.65 pp in two
  files — though those two rows are byte-identical, so it is really one observation
  repeated). It fits the mechanism: statin therapy is a medication on the active med list,
  the easiest possible thing for an eCQM to see, and unlike a registry it cannot be
  forgotten.
- **130 flipped sign after PY2023** (−2.0 → +3.9 → +4.4 → +5.2), so it is noise around zero.

No counterexample exceeds 2.7 pp once the respecification is set aside.

### 2.8 Does the rate gap become a *score* gap? Mostly no — except on 001 and 236

This is the most consequential thing in this document, and it is easy to miss: a lower
*rate* is not a lower *score*, because CMS benchmarks each collection type against its own
distribution. To test it I placed each collection type's own Average Performance Rate into
its own published decile ladder and compared the deciles earned.

**Across all 72 Tier A measure-years:**

| Result | count |
|---|---|
| eCQM average reporter earns a **higher** decile | **54 / 72** |
| tied | 15 / 72 |
| eCQM earns a **lower** decile | **3 / 72** |

Mean **+1.36 deciles in eCQM's favor**; median +1.0. Restricted to pairs where MIPS CQM is
*not* topped out (n=21): mean +0.62, median 0.0 — i.e. roughly neutral.

So collection-type-specific benchmarking does not merely neutralize the rate gap, it
frequently **over-corrects**, because the eCQM benchmark is built from a compressed
low distribution while the registry benchmark is topped out. The clearest case is 134: an
eCQM reporter at 45.55% earns **Decile 6**, while a MIPS CQM reporter at 85.58% earns
**Decile 3**. The flattering registry rate scores *worse*.

**But the APP Plus five do not follow the general pattern**, because 001 and 236 carry flat
MIPS CQM ladders:

| Measure | Year | eCQM rate → decile | MIPS CQM rate → decile | Δ deciles | Favored |
|---|---|---|---|---|---|
| **001** | 2026 | 40.91 → **D4** (Historical) | 23.12 → **D8** (Flat) | **−4** | MIPS CQM |
| **001** | 2023–25 | 46.35/43.53/42.70 → D4 | 34.00/27.30/25.75 → D7/D8/D8 | −3/−4/−4 | MIPS CQM |
| **236** | 2026 | 66.06 → **D5** (Historical) | 68.71 → **D7** (Flat) | **−2** | MIPS CQM |
| **236** | 2023–25 | 62.30/66.06/66.23 → D5 | 68.96/71.26/72.82 → D7/D8/D8 | −2/−3/−3 | MIPS CQM |
| 112 | 2023–25 | 50.99/53.86/56.08 → D5 | 63.07/68.94/69.16 → D5 | 0 | tie |
| 113 | 2023, 2025 | 49.64/49.80 → D5 | 56.97/71.31 → D5 | 0 | tie |
| 134 | 2023–26 | ~39.95–48.51 → **D6** | ~83.32–89.55 → **D3** | **+3** | eCQM |

**This identifies the real mechanism of the eCQM disadvantage in APP Plus, and it is not the
one we assert.** The capture tax lowers eCQM *rates* on all five measures. But that only
becomes lost *points* on 001 and 236 — and it does so because CMS gives MIPS CQM a **flat**
benchmark on exactly those two measures, so registry reporters are scored against a lenient
synthetic ladder while eCQM reporters are scored against their own real, harder distribution.
On 112/113 the effect washes out entirely, and on 134 it runs strongly in eCQM's favor.

So the correct causal chain is:

```
capture loss  →  lower eCQM rate  →  (usually neutralized by collection-type benchmarks)
                                  →  BUT on 001 & 236, MIPS CQM's flat benchmark
                                     fails to neutralize it  →  2–4 deciles lost
```

Our simulator's narrative — "capture loss is why CMS's eCQM benchmarks are easier" — has the
sign of the rate effect right and the benchmark consequence backwards.

---

## 3. A stronger test than the benchmark files: PY2024 MSSP ACO-level results

The national benchmark files pool *all* MIPS reporters — mostly small practices and
specialists — so they confound method with reporter composition. The MSSP PY2024 PUF (B5)
does much better: it publishes **each ACO's rate on measures 001, 134 and 236 broken out by
collection type**, within a single program, with a single attribution methodology, plus
risk scores and demographics for every ACO.

This is the best available natural experiment and, as far as I can tell, it has not been
used this way in the literature.

### 3.1 Who reported how in PY2024

| Collection type | ACOs |
|---|---|
| CMS Web Interface (manual chart abstraction on a CMS-drawn sample) | 391 |
| eCQM | 38 |
| MIPS CQM (registry) | 14 |
| both eCQM and MIPS CQM | 3 |
| neither / suppressed | 30 |

The Web Interface arm is large, which makes the eCQM-vs-abstraction comparison well powered.
The eCQM-vs-registry comparison is not (n=14).

### 3.2 The gap, with confidence intervals

Bootstrap 95% CIs (20,000 resamples) and two-sided Mann-Whitney. Positive = eCQM worse.

| Measure | Comparator | eCQM mean | comparator mean | **eCQM penalty** | 95% CI | p |
|---|---|---|---|---|---|---|
| 001 (inverse) | Web Interface | 29.38 | 9.44 | **+19.94 pp** | [+16.00, +24.23] | **<0.0001** |
| 134 | Web Interface | 55.77 | 81.43 | **+25.66 pp** | [+18.91, +32.60] | **<0.0001** |
| 236 | Web Interface | 70.75 | 79.43 | **+8.68 pp** | [+6.48, +10.81] | **<0.0001** |
| 001 (inverse) | MIPS CQM | 29.38 | 21.52 | +7.86 pp | [+1.96, +13.99] | 0.061 |
| 134 | MIPS CQM | 55.77 | 56.32 | +0.55 pp | [−14.56, +15.59] | 0.939 |
| 236 | MIPS CQM | 70.75 | 75.98 | +5.23 pp | [+0.47, +10.13] | 0.059 |

**Against manual chart abstraction the penalty is large and unambiguous** on all three
measures. **Against registry reporting inside MSSP it is small (0.5–7.9 pp) and not
conventionally significant**, though directionally consistent on 2 of 3 and severely
underpowered at n=10–14.

Note again the mechanistic ordering holds within MSSP: 236 (structured vital sign) shows
the smallest abstraction penalty at +8.7 pp; 134 (narrative follow-up plan) the largest at
+25.7 pp.

### 3.3 This reconciles the two datasets — and reveals a confound in ours

The national benchmark gap for these measures (001 +16.2, 134 +44.0, 236 +5.2 in PY2024) is
*much larger* than the within-MSSP eCQM-vs-registry gap (+7.9, +0.6, +5.2). The difference
is stark for 134: nationally the MIPS CQM average is 89.55, but among MSSP ACOs reporting
MIPS CQM it is only 56.32.

**Interpretation: the national eCQM-vs-MIPS CQM benchmark gap is part measurement-method
effect and part reporter-composition effect.** The national MIPS CQM benchmark is dominated
by small practices and specialists reporting near-ceiling rates through registries; those
reporters are not comparable organizations to eCQM-reporting ACOs. Our simulator implicitly
reads the whole national gap as capture loss. It is not.

The within-MSSP abstraction comparison (§3.2, top three rows) is the cleaner estimate of a
method effect, and it is still large.

### 3.4 Calibrating our slider against reality

Inverting the simulator's own `captureLoss()` against the PY2024 means:

| Measure | implied capture vs MIPS CQM | implied capture vs Web Interface |
|---|---|---|
| 001 Glycemic >9% | 90.0% | **78.0%** |
| 134 Depression screening + follow-up | 99.0% | **68.5%** |
| 236 BP control | 93.1% | **89.1%** |

Our default is a single global **85%**, slider range 65–100%.

- Against a **registry** comparator, 85% is too pessimistic (real: 90–99%).
- Against a **chart-abstraction** comparator, 85% is about right on average (real: 68.5–89%).
- **The measure-to-measure spread (68.5%–99%) is wider than our entire slider range**, and a
  single global value cannot reproduce it. The gradient in §2.5 says the same thing.

---

## 4. Task 2 — CMS's own acknowledgment

**Verdict: YES, but narrowly — and CMS's stated cause is mostly the DENOMINATOR
(all-payer population), not data capture. The one place CMS states a capture-style
numerator mechanism is a guidance PDF, not rulemaking — and there it is decisive.**

### 4.1 CMS's own worked example: 74% vs 78% for identical care

This is the single most on-point CMS artifact for our model, and it is stronger than
anything we had assumed.

Source: **"Medicare Shared Savings Program: Reporting MIPS CQMs and eCQMs in the
Alternative Payment Model Performance Pathway (APP) — Guidance"**, CMS/QPP Resource
Library, §6 "Performance Rate Calculation".
`https://www.cms.gov/files/document/medicare-shared-savings-program-reporting-mips-cqms-and-ecqms-alternative-payment-model-performance.pdf`
(mirror: `https://qpp-cm-prod-content.s3.amazonaws.com/uploads/2179/APP%20Guidance%20Document%20for%20ACOs.pdf`).
Retrieved 2026-08-09. Verbatim:

> "**Performance rate calculations for eCQMs differ from MIPS CQM measures in how
> unreported numerator performance is treated.** Because eCQMs reflect end-to-end
> electronic reporting, data submitted via eCQMs is by definition 100% complete when
> submitted by CEHRT. **For patients where numerator data is not submitted, the eCQM is
> scored as 'Performance Not Met.'** In contrast, MIPS CQM specifications allow for the
> aggregation of data from multiple sources, not exclusive to CEHRT. **Any missing
> numerator data submitted via MIPS CQM will count against the entity's data completeness
> and not the performance rate.**"

CMS's Tables 4 and 5 then run the **same 1,000 initial population, same 50 denominator
exclusions, and the same 700 "Performance Met"** through both collection types:

| Collection type | Initial pop. | Denom. excl. | Perf. Met | Perf. Not Met | Numerator data not reported | Data completeness | **Performance rate** |
|---|---|---|---|---|---|---|---|
| **eCQM** | 1000 | 50 | 700 | 250 | — | 100% | **74%** |
| **MIPS CQM** | 1000 | 50 | 700 | 200 | 50 | 94% | **78%** |

And CMS's explanation of why:

> "Data completeness equals 100% since for eCQMs, the '**Performance Not Met**' number
> includes instances where performance data was identified but did not meet the measure
> performance target, **and also instances where performance data was not identified within
> the EHR.**"
>
> "**For MIPS CQMs, the 'Performance Not Met' number only includes instances where
> performance data was identified but did not meet the measure performance target. It does
> not include instances where performance data was not submitted.**"

The same section, same arithmetic, survives in the PY2024 guidance (§7):
`https://qpp-cm-prod-content.s3.amazonaws.com/uploads/3124/MSSP-2024-Reporting-eCQMs-MIPS-CQMs-and-Medicare-CQMs-in-the-APP.pdf`

**What this establishes:**

1. CMS itself publishes arithmetic in which **identical care yields a lower eCQM rate than
   MIPS CQM rate**. Our premise is CMS's own worked example.
2. CMS attributes the difference to data "**not identified within the EHR**" — i.e. capture,
   not population. This is the capture mechanism, stated by CMS.
3. The operative rule is a **denominator-treatment asymmetry**: patients whose numerator
   status cannot be determined stay in the eCQM performance-rate denominator *as failures*,
   but are **removed from the MIPS CQM performance-rate denominator** and charged to data
   completeness instead. In CMS's example the eCQM denominator is 950 and the MIPS CQM
   denominator is 900.

#### 4.1a Our model's functional form is exactly CMS's arithmetic (my derivation)

This is worth stating precisely, because it validates the simulator's core equation rather
than merely its direction.

Let `u` = share of denominator-eligible patients whose numerator status cannot be determined
from structured data, and `r` = the true met-rate among determinable patients. Under the rule
CMS states:

```
eCQM rate     = r·(1−u)     (undeterminable patients counted as Performance Not Met)
MIPS CQM rate = r           (undeterminable patients dropped from the denominator)
⇒ eCQM / MIPS CQM = (1 − u)
```

So with capture efficiency `c = 1 − u`, **`measured = true × c`** — which is exactly
`captureLoss()` in `src/PathwayLab.tsx:197` for a normal measure.

Verified against CMS's published numbers: eCQM 700/950 = 73.68% (CMS prints 74%),
MIPS CQM 700/900 = 77.78% (CMS prints 78%), data completeness 900/950 = 94.74% (CMS prints
94%). The ratio 73.68/77.78 = **0.947368**, and `1 − 50/950` = **0.947368**. Exact match.

For an **inverse** measure such as 001, a missing result counts *into* the numerator
(no HbA1c result ⇒ scored as poor control), so:

```
measured = r·(1−u) + u = r + u·(1−r) = r + (1−c)·(1−r)
```

which is exactly our inverse branch `r + (1-capture)*(100-r)`. Both branches of our model
are therefore derivable from CMS's stated scoring rule, not merely plausible.

**Caveat on interpretation.** CMS's example holds "Performance Met" constant at 700 across
both collection types. In reality a registry reporter can also *chart-chase* — actively hunt
the missing evidence and convert indeterminate patients into met ones — which CMS's example
does not model. So our single `capture` slider is really absorbing three distinct
mechanisms: (a) structured-capture loss, (b) the denominator-treatment asymmetry above, and
(c) registry chart-chasing. That is acceptable for a simulator but should be labeled.

**Important scope limit:** this appears only in MSSP-specific APP guidance PDFs. The phrase
"Performance Not Met" appears in **no PFS final rule** in this sense, and the mechanism is
absent from the 2025 APP Data Submission Guide and the APM Performance Pathway Toolkit.

### 4.2 What CMS says in rulemaking: the cause is the all-payer denominator

CMS repeatedly and explicitly says ACO quality scores fall on the switch to eCQMs/MIPS CQMs
— and attributes it to population, not capture.

CY2023 PFS final rule, **87 FR 69839** (FR Doc. 2022-23873),
`https://www.federalregister.gov/documents/full_text/text/2022/11/18/2022-23873.txt`:

> "The concern about lower quality scores for underserved populations **is magnified in
> eCQMs compared to reporting via the CMS Web Interface, because all-payer reporting in
> eCQMs includes quality scores for people with Medicaid** … whereas, historical reporting
> via the CMS Web Interface has only included those quality scores for people with
> Medicare. **Therefore, ACOs that serve a higher proportion of Medicaid enrollees may
> receive lower quality scores during the switch to eCQMs without an adjustment.**"

Same rule, **87 FR 69851** — CMS confirms it observed this in real data, but declines to
state a direction for its own observation:

> "**Indeed, we did observe variation in reporting between the CMS Web Interface and
> eCQMs/MIP CQMs across the different measures for those 12 ACOs that reported all payer
> data in PY 2021.**"

CY2025 PFS final rule, **89 FR 98109** (FR Doc. 2024-25382) — the blunt acknowledgment:

> "**Nonetheless, we acknowledge that there may be instances when ACOs have lower
> performance reporting all payer/all patient eCQMs.**"
> "**We will continue to evaluate whether ACOs serving higher underserved populations are
> being disproportionately disadvantaged through all-payer collection, which may inform
> future rulemaking.**"

CY2027 PFS proposed rule, **91 FR 44092** (FR Doc. 2026-14327) — non-comparability of the
sampling change:

> "Shared Savings Program ACOs have transitioned from reporting on a **sampling methodology
> (for example, web interface) to reporting on a broader patient population, which could
> impact comparisons on quality performance.**"

And CMS is now acting on the denominator specifically — the proposed **Medicare eCQM**
(91 FR 44048–44049) exists to shrink the eCQM denominator back to assigned beneficiaries,
because ACOs report that the all-payer population "would capture beneficiaries with no
primary care relationship to the Shared Savings Program ACO."

**Note the direct reversal in CMS's own position.** CY2022 PFS final rule, **86 FR 65440**:

> "**Based on the information available to us, we do not believe that the assessment of
> all-payer data … will negatively skew performance.**"

By CY2023 CMS asserts the opposite. Worth flagging: CMS's confidence here is not stable.

### 4.3 Separate benchmarks by collection type are NOT justified by lower eCQM rates

This is a direct hit on our claim 3. CMS's stated rationale is **non-comparable measure
specifications** — never a direction of difference.

CY2017 QPP final rule, **81 FR 77277** (FR Doc. 2016-25240):

> "**we proposed to create separate benchmarks for submission mechanisms that do not have
> comparable measure specifications. For example, several eCQMs have specifications that
> are different than the corresponding measure from registries.**"

**81 FR 77279**:

> "**We finalized separate benchmarks by submission mechanism only when the differences in
> specifications make comparisons less valid.**"

CY2019 PFS final rule, **83 FR 59842**: a *commenter* — not CMS — supplies the
performance-difference rationale ("citing the difference in measure performance across
collection types"); CMS responds only "We thank commenters for their support."

CMS also flagged, at **81 FR 77278**, the gaming risk this creates:

> "**assigning separate benchmarks in this manner creates opportunities for clinicians to
> achieve higher quality scores by selectively choosing submission mechanisms**"

The **2024 and 2026 MIPS Quality Benchmarks User Guides** are purely mechanical and contain
no statement of direction or cause. **Negative result.**

### 4.4 The Complex Organization Adjustment is justified by aggregation burden, not lower rates

CY2025 PFS final rule, **89 FR 98436**:

> "**The requirement to aggregate patient data collected across multiple health records into
> a single data stream before sending to CMS poses administrative challenges** … Additionally,
> **data deduplication is resource intensive** …"

Lower scores appear only as third-party concern, immediately after:

> "**Some interested parties have also voiced concerns that clinician specialty or patient
> population could yield lower quality scores when reporting eCQMs** and create resistance
> to switching to this collection type."

**89 FR 98437** — CMS refuses to extend the CoA to MIPS CQMs precisely because it considers
the problem organizational, not measurement:

> "**This adjustment is to offset the challenges associated with adoption of eCQMs because
> of the organizational complexity** required by definition of virtual groups and APM
> Entities and is therefore **not appropriate for other types of participants or collection
> types such as MIPS CQMs or Medicare CQMs.**"

CMS also gives a scale figure that is useful context for eCQM burden (**89 FR 98436**):
ACOs reported "**33 times more denominator eligible patients for eCQM 001** … **53 times more**
… for eCQM 134 … and **25 times more** … for eCQM 236 than other MIPS reporters," with one
ACO reporting "over 700,000 denominator eligible beneficiaries for a single eCQM."

### 4.5 Contrary evidence — CMS has said eCQMs are MORE accurate than abstraction

We must not suppress this. FY2018 IPPS/LTCH final rule, **82 FR 38357** (FR Doc. 2017-16434):

> "**We believe that recording patient information in structured fields for the purpose of
> reporting eCQMs is more accurate, less prone to errors because it relies less on
> interpretation, and ultimately reduces burden on hospitals because it does not require
> manual abstraction, as compared with conventional chart-abstracted data reporting.**"

This is the hospital program, and it is about *data-element accuracy*, not measured rates —
but it is CMS on the record asserting the opposite polarity from our narrative, and it
should be quoted rather than ignored.

Second counterpoint, CY2026 PFS final rule, **90 FR 50002** — CMS's published eCQM comparison
favors ACOs:

> "**In performance year 2024, ACOs scored better than comparable MIPS groups on all three
> eCQMs in the APP quality measure set**, and the difference was statistically significant
> for Quality ID: 134 … (p < .001) and Quality ID: 236 … (p < .01)."

But CMS immediately supplies the selection caveat that corroborates my §7.3 (**90 FR 50002–3**):

> "Shared Savings Program ACOs are **required** to report the eCQMs/MIPS CQMs included in the
> APP quality measure set; **whereas MIPS groups can choose which eCQMs and MIPS CQMs they
> report on and tend to choose those they will perform well on.**"

**CMS has never published a within-entity eCQM-vs-MIPS CQM rate comparison.**

### 4.6 Where CMS says nothing (negative results)

Searched the full text of every PFS rule 2016–2026 (CY2017 QPP final through CY2027 proposed)
for "lower performance", "lower rates", "artificially low", "data capture", "structured data",
"unstructured", "abstract*", "value set", "Performance Not Met", "comparab*":

- **No CMS statement in any rule** that eCQM rates are lower than registry rates for the same
  measure *and same population* because of EHR data capture.
- **Value sets / coding as a cause: never.** "Value set" appears once across six rules
  (86 FR 65381, a dQM RFI) and never as an explanation of performance differences.
- **EHR vendor implementation variability as a cause of lower rates: never by CMS** (commenters
  only, 83 FR 41491). CMS raises vendors only as a reporting-feasibility issue.
- **Flat benchmarks are not justified by low eCQM rates** — the rationale is tight performance
  distributions and not penalizing high performers (87 FR 69866; 89 FR 98118).
- **eCQI Resource Center and CMS MMS Blueprint:** no acknowledgment of an eCQM-vs-abstracted
  rate discrepancy. What exists is validity methodology in which **manual abstraction is the
  gold standard** against which eCQM data-element agreement is measured — implying, but never
  stating, that eCQM capture can miss things.

**Instructive contrast:** CMS *will* state a cross-type score gap plainly when it chooses to.
CY2026 PFS final rule, **90 FR 49909–49910**, on administrative-claims measures:

> "**we observed lower scores for the administrative claims-based quality measures than for
> the non-administrative claims-based quality measures. Means for administrative claims-based
> quality measure achievement scores tend to be around 5 to 6 points out of 10, whereas means
> for non-administrative claims-based measures tend to be around 7 to 9 points out of 10.**"
> "**We are concerned that the current decile-based, performance period benchmark is a key
> contributor to lower scores**…"

CMS has simply never done this for eCQM vs MIPS CQM.

---

## 5. Task 4 — Denominator vs numerator effects

**Verdict: our model's framing is right in sign. Denominator *case-finding* leakage
flatters measured rates, so it cannot explain an eCQM-below-registry gap — it partially
*masks* one. But there is a second, opposite denominator effect (missing-data treatment)
that does hurt eCQM reporters, and it is the one CMS actually documents.**

Four distinct denominator forces operate, and they do not point the same way.

### 5.1 Case-finding leakage — flatters eCQM rates (our UI note is correct)

A patient whose diagnosis is never coded is invisible to the measure and drops out of the
denominator entirely. The question is whether those patients are better or worse controlled
than the visible ones. The evidence says worse — undiagnosed means untreated:

- **Adediran E, et al. "Risk factors of undiagnosed and uncontrolled hypertension in primary
  care patients with hypertension: a cross-sectional study." *BMC Prim Care.*
  2024;25:311. doi:10.1186/s12875-024-02511-4. PMID 39164618.** Reported by the research
  agent as finding roughly **29% of true hypertensives were uncoded** in primary care data.
- **Chapman AB, et al. "Association of documented high blood pressure measurements with time
  to hypertension diagnosis." *Am J Med.* 2026;139:189-195.e2.
  doi:10.1016/j.amjmed.2025.09.024. PMID 41005387.** Reported as finding **~75% still
  undiagnosed at 5 years** despite documented elevated readings.

Patients with undiagnosed, uncoded hypertension are by construction untreated and
uncontrolled. Excluding them from measure 236's denominator therefore **raises** the
measured control rate. Same logic for undiagnosed diabetes and measure 001.

**Consequence: denominator leakage biases eCQM rates UPWARD.** It is a confound working
*against* the gap we observe, which means the true capture penalty is somewhat larger than
the measured gap — not smaller. Our UI text at `PathwayLab.tsx:941-942` ("invisible patients
skew unscreened and uncontrolled … that often flatters rates") states this correctly, and
leaving it unmodeled is conservative in the right direction.

### 5.2 Missing-data treatment — hurts eCQM rates, and this is the documented one

The opposite-signed denominator effect is the one from §4.1a: a patient whose numerator
status cannot be determined **stays in the eCQM denominator as a failure**, but is
**removed from the MIPS CQM performance-rate denominator**. CMS's own example puts the
eCQM denominator at 950 and the MIPS CQM denominator at 900 for the same population.

This is formally a denominator effect, though it is mathematically identical to the
numerator haircut our model implements (§4.1a). **This is the single best-documented
mechanism in the entire evidence base, and it is CMS's own.**

### 5.3 Denominator identification is generally *more* accurate than numerator capture

Where studies decompose eCQM error into denominator and numerator components, the
denominator is the better-behaved half:

- **Schmaltz SP, et al. "Comparison of electronic versus manual abstraction for 2
  standardized perinatal care measures." *J Am Med Inform Assoc.* 2022;29(5):789-797.
  doi:10.1093/jamia/ocab276. PMID 34918098.**
- **Phipps MS, et al. "Validation of Stroke Meaningful Use Measures in a National Electronic
  Health Record System." *J Gen Intern Med.* 2016;31(Suppl 1):46-52.
  doi:10.1007/s11606-015-3562-5. PMID 26951273.** Retrospective cross-sectional comparison
  of stroke eCQMs against chart review in 2,130 ischemic stroke admissions across 11 VHA
  hospitals, explicitly designed to "determine sources of error in using centralized
  electronic health record (EHR) data."

Both are reported by the research agent as finding denominators more accurate than
numerators. **I verified the citations but did not read the full texts**, so treat the
denominator-vs-numerator decomposition as agent-reported rather than independently confirmed.

**Important caution on a citation we might have reached for:** **Kern LM, et al. "Accuracy
of electronically reported 'meaningful use' clinical quality measures: a cross-sectional
study." *Ann Intern Med.* 2013;158(2):77-83.
doi:10.7326/0003-4819-158-2-201301150-00001. PMID 23318309** is **numerator-focused and
does not support a denominator decomposition**. It also contains a *counterexample* to our
thesis: electronic reporting **overestimated** diabetes cholesterol control (57% vs 37% by
manual review). Do not cite Kern as evidence that eCQMs under-measure — it cuts both ways.

### 5.4 All-payer denominator expansion — hurts, and CMS quantifies it

CMS, CY2025 PFS final rule, **89 FR 98436**:

> "An internal analysis of performance year 2022 submission data indicates that Shared
> Savings Program ACOs reported on **33 times more denominator eligible patients for
> eCQM 001** …, **53 times more** … for eCQM 134 …, and **25 times more** … for eCQM 236 …
> **than other MIPS reporters.** In performance year 2022, one ACO reported on **over
> 700,000 denominator eligible beneficiaries** for a single eCQM."

A denominator 25–53× larger necessarily reaches patients with thinner records, weaker
attachment to the practice, and less complete data — the CY2027 proposed Medicare eCQM
exists precisely because ACOs report the all-payer population "would capture beneficiaries
with **no primary care relationship**" (91 FR 44048–44049).

**This is a real effect our model does not represent for the eCQM pathway.** We apply the
Medicare-population shift only to the `medcqm`/`medecqm` pathways. Note it explains the
*Web Interface* comparison in §3.2 far better than it explains eCQM vs MIPS CQM, since both
of those are all-payer by rule (§7.1).

### 5.5 Patient-matching attrition — direction unknown

The CMS APP guidance requires patient matching at "90% or higher," and unmatched patients
are **dropped from the initial population entirely** (agent-reported from the APP guidance).
No public estimate exists of whether dropped-unmatched patients differ in performance.
**Unmeasured and unmeasurable from public data.**

### 5.6 Net

| Force | Direction on measured eCQM rate | Modeled by us? |
|---|---|---|
| Case-finding leakage (uncoded diagnosis) | **UP** (flatters) | No — noted in UI, correctly |
| Missing-data treatment (§4.1a) | **DOWN** | Yes — this *is* our capture slider |
| All-payer denominator expansion | **DOWN** | No (only on Medicare pathways) |
| Patient-matching attrition | unknown | No |

The net observed gap is what survives after the flattering force partially offsets the two
depressing ones. **Our single numerator-side slider is a defensible reduced form**, and
because the omitted forces are mixed in sign with the largest omission (case-finding
leakage) working *against* the gap, our estimate is more likely conservative than inflated.

---

## 6. Task 3 — The mechanism literature

**Verdict: the direction is well established but measure-specific, and the literature
independently reproduces the gradient I found in §2.5. Two important qualifications: the
ambulatory canon is old, and chart abstraction is not a gold standard.**

All PMIDs below were verified against PubMed on 2026-08-09. Where I did not read the full
text, findings are attributed to the research agent's reading.

### 6.1 The gradient, confirmed independently — the key literature finding

**Bailey SR, Heintzman JD, Marino M, et al. "Measuring Preventive Care Delivery: Comparing
Rates Across Three Data Sources." *Am J Prev Med.* 2016;51(5):752-761.
doi:10.1016/j.amepre.2016.07.004. PMID 27522472.** 43 community health centers, EHR
extraction vs manual chart review:

| Service | agreement (κ) |
|---|---|
| In-office measurement (BMI, BP) | **0.96 – 1.00** |
| Colorectal cancer screening | **0.62** |
| **Breast cancer screening** | **0.42** |

The authors attribute the difference to "services commonly referred out."

**This is the single most important citation in this document.** It is an independent,
patient-level confirmation of exactly the pattern I computed from benchmark files in §2.5 —
near-perfect agreement for internally-generated structured values, degrading sharply for
services performed elsewhere — and it maps directly onto MIPS 236 (BP, small gap) versus
112/113 (breast/colorectal, large gaps).

Corroborating the interoperability mechanism: **D'Amore JD, McCrary LK, Denson J, et al.
"Clinical data sharing improves quality measurement and patient safety." *J Am Med Inform
Assoc.* 2021;28(7):1534-1542. doi:10.1093/jamia/ocab039. PMID 33712850** — 53 organizations,
5,300 patients, 14 measures: **79% of patients received care at more than one facility in
the year; adding HIE data changed 15% of all measure calculations (P<.001)**, affecting 19%
of patients.

### 6.2 Direction and magnitude — head-to-head, same patients

| Study | Setting | Measure | eCQM vs abstraction |
|---|---|---|---|
| **Kern 2013** (PMID 23318309) | FQHC, 1,154 pts, 12 measures | asthma medication | **−39 pp** (38% vs 77%) |
| | | pneumococcal vaccination | **−21 pp** (27% vs 48%) |
| | | diabetes cholesterol control | **+20 pp — eCQM HIGHER** (57% vs 37%) |
| **Phipps 2016** (PMID 26951273) | VA, 2,130 stroke admissions, 11 hospitals | STK-1 VTE prophylaxis | **−10.6 pp** (76.7 vs 87.3, p=0.03) |
| | | STK-2/5/10, NIHSS | −0.6 to −2.5 pp, all ns |
| **Homco 2020** (PMID 32721028) | 21 practices, 621 pts | BP control | **−5.5 pp** (75.1 vs 80.6) |
| | | smoking counseling | **−10.3 pp** (75.4 vs 85.7) |
| | | aspirin | −1.1 pp |
| **Urech 2015** (PMID 26340661) | VA, 2,840 HTN pts | BP control | **−2.7 pp** (66.8 vs 69.5, κ=0.87) |
| | | guideline-recommended meds | **−7.3 pp** (65.0 vs 72.3, κ=0.51) |
| | | appropriate response to uncontrolled BP | **−12.4 pp** (39.8 vs 52.2, κ=0.28) |
| **Baker 2007** (PMID 17310051) | outpatient heart failure | warfarin for AF | **−23.2 pp** (70.4 vs 93.6) |
| | | LVEF, beta-blocker, ACE/ARB | −2.7 to −4.8 pp |
| **Amster 2015** (PMID 25326598) | Kaiser Permanente NW | NQF 0012 | **−25.4 pp** (62.9 vs 88.3) |
| | | NQF 0137 | **−100 pp** (0% vs 100%) |

Kern's sensitivity across 12 measures was **46–98%** — the spread itself is the finding.

**Schmaltz S, Vaughn J, Elliott T. "Comparison of electronic versus manual abstraction for 2
standardized perinatal care measures." *J Am Med Inform Assoc.* 2022;29(5):789-797.
doi:10.1093/jamia/ocab276. PMID 34918098** is the best modern same-patient study (Joint
Commission ORYX, 68,015 matched Elective Delivery records across 270 hospitals). Its result
is a sharp illustration that the gap is element-specific, not method-wide:

- **Elective Delivery numerator κ = 0.08 (2017), 0.10 (2019)** — essentially no agreement
  beyond chance.
- **Exclusive Breast Milk Feeding numerator κ = 0.85 / 0.84** — near-perfect.
- Denominator agreement *improved* over time (ED 0.59→0.84; EBMF 0.58→0.70).

Note the last point: **denominators behaved better than numerators**, consistent with §5.3.

**Persell SD, Wright JM, Thompson JA, Kmetik KS, Baker DW. "Assessing the validity of
national quality measures for coronary artery disease using an electronic health record."
*Arch Intern Med.* 2006;166(20):2272-2277. doi:10.1001/archinte.166.20.2272. PMID 17101947**
quantifies the narrative-documentation mechanism directly: **15% to 81% of apparent quality
failures were actually satisfied or validly excluded** once free text was read. LDL control
rose from 81.6% to 87.5–99.2%.

### 6.3 The NCQA HEDIS ECDS analogue — the closest thing to a controlled experiment

NCQA's transition from hybrid (administrative + chart review) to Electronic Clinical Data
Systems reporting is the same natural experiment as ours, with paired same-plan/same-year
submissions. Reported by the research agent from NCQA Special Reports (grey literature —
**PubMed returns 0 results for `"ECDS" AND "HEDIS"`**, which is itself a finding):

- **MY2021 colorectal cancer screening (COL):** ECDS 54.4 vs traditional 60.1 commercial
  (**−6.2 pp**); 60.5 vs 70.7 Medicare (**−9.3 pp**).
- **MY2023 decomposition — the cleanest result:** administrative ≈ identical to ECDS, while
  **hybrid was higher by 5.2 pp (commercial) / 6.3 pp (Medicare)**. In other words **the gap
  *is* the chart review**, not the electronic capture.
- **Breast cancer screening (BCS-E) vs administrative: −0.1 to −0.5 pp** — negligible. (The
  agent flags a premise correction worth keeping: BCS was never a HEDIS *hybrid* measure, so
  this is an admin↔ECDS comparison, not a chart-review comparison.)
- **MY2020 depression screening (DSF-E): claims-only plans reported mean, median AND max of
  0.0%**, versus 2.9–11.4% for plans with any non-claims data.

Historical anchor: **Pawlson LG, Scholle SH, Powers A. "Comparison of administrative-only
versus administrative plus chart review data for reporting HEDIS hybrid measures." *Am J
Manag Care.* 2007;13(10):553-558. PMID 17927459** — 283 plans, 15 hybrid measures:
administrative-only was lower on **every** measure by an average of **20.4 pp (2004) and
20.6 pp (2006)**, and **more than half of plans changed quartile rank** by method.

**The trend line matters for calibration:** ~20 pp in 2004–2006, ~5–6 pp by MY2023.
Electronic clinical data has recovered roughly two-thirds of what chart review used to add.
This argues our capture penalty should be modeled as *shrinking over time*, and reinforces
§7.4's concern that benchmarks built from early-transition cohorts overstate it.

### 6.4 Causes, ranked by evidence strength

1. **Care delivered outside the reporting organization** — strongest. Bailey 2016 (κ 0.42
   breast / 0.62 colorectal vs 0.96–1.00 in-office); D'Amore 2021 (79% multi-facility, 15%
   of calculations changed); O'Connor 2010 (PMID 20225917) — adding immunization registry
   data raised observed rates **6.5–54.1 pp** (childhood) and **57.6–78.0 pp** (adolescent).
2. **Unstructured / free-text documentation** — very strong. **Parsons A, McCullough C,
   Wang J, Shih S. "Validity of electronic health record-derived quality measurement for
   performance monitoring." *J Am Med Inform Assoc.* 2012;19(4):604-609.
   doi:10.1136/amiajnl-2011-000557. PMID 22249967** — 4,081 charts, 57 NYC practices: **only
   10.7% of mammogram orders/results were in structured fields**; labs 53.4–63.0%; smoking
   status 53.4%; problem-list diagnoses 75.1–91.4%. *Caveat flagged by the agent: Parsons's
   "1.8 vs 2.7" figures are mean patient counts per practice, not rates — because both
   numerator and denominator shrink, the net effect on the rate is ambiguous. Do not quote
   them as percentage-point gaps.* Also Persell 2006 and Baker 2007 above; **Roth CP, Lim YW,
   Pevnick JM, Asch SM, McGlynn EA. *Am J Med Qual.* 2009;24(5):385-394. PMID 19482968** —
   only ~1/3 of QA Tools indicators readily accessible from EHR data.
3. **Workflow / field placement / denominator identification** — strong. **Wright A, McCoy
   AB, Hickman TT, et al. "Problem list completeness in electronic health records: A
   multi-site study and assessment of success factors." *Int J Med Inform.*
   2015;84(10):784-790. doi:10.1016/j.ijmedinf.2015.06.011. PMID 26228650** — across 10
   organizations, the share of patients with HbA1c ≥7.0% who had diabetes on the problem list
   ranged **60.2% to 99.4% (mean 78.2%)**. Up to 40% of a diabetes denominator can be
   invisible from documentation habit alone. **Tang PC, Ralston M, Arrigotti MF, et al.
   *J Am Med Inform Assoc.* 2007;14(1):10-15. doi:10.1197/jamia.M2198. PMID 17068349** —
   claims-style denominator logic found **75%** of true diabetics vs **97%** using EHR coded
   data.
4. **Value-set / terminology mismatch** — good evidence; modest on global rates, large on
   subgroups. **Cholan RA, et al. *EGEMS.* 2017;5(1):19. doi:10.5334/egems.212.
   PMID 29881739** — two independently authored value sets for the *same* statin CQM differed
   only **0.8 pp** globally but included **up to 2.3× as many patients** with key conditions,
   and subgroup performance differed **7.5 pp**. Also Baumann Kreuziger 2025 (PMID 39930618),
   Dorr 2021 (PMID 34348408) — 60% of required concept sets unused or inaccurate.
5. **EHR vendor / implementation variation** — mechanism documented, **direct rate comparison
   never published**. No study implements one eCQM spec across multiple named vendors and
   reports divergent rates. Closest: Ahmad 2019 (PMID 32025638, 116 practices across 7 EHRs)
   and D'Amore 2018 (PMID 29898468, 11 facilities / 5 EHRs, iterative fixes needed for 14 of
   17 measures).
6. **Timing / lookback** — weakest. **Colin NV, et al. *EGEMS.* 2018;6(1):17.
   doi:10.5334/egems.235. PMID 30094289** — 209 practices: between-clinic differences ranged
   −3.3% to +14.2%, but patient-level recomputation *within* clinics showed only **−1.6% to
   +0.6%**, i.e. most of the apparent period effect was data-quality noise. The
   historical-screening story (screening done pre-EHR-adoption) is widely asserted but
   **no study isolates and quantifies it**.

### 6.5 Counterexamples and the abstraction-is-not-truth problem

These deserve prominence, because our model treats registry/abstraction as ground truth.

1. **Kern 2013**: diabetes cholesterol control **57% electronic vs 37% manual (+20 pp,
   P=0.001)** — eCQM measured *higher*.
2. **Homco 2020** (PMID 32721028): Bayesian latent-class analysis put the truth for BP
   control at **75.0%**, matching the **EHR (75.1%)** and *below* chart abstraction (80.6%).
   **Abstraction, not the eCQM, was the biased estimator.** This is directly about MIPS 236.
3. **Goulet JL, Erdos J, Kancir S, et al. "Measuring performance directly using the veterans
   health administration electronic medical record: a comparison with external peer review."
   *Med Care.* 2007;45(1):73-79. doi:10.1097/01.mlr.0000244510.09001.e5. PMID 17279023** —
   where values are natively structured, correlations **0.89–0.98**, κ **0.86–0.99**, and
   **no clinically meaningful bias** (LDL 0.9 mg/dL, SBP 1.2 mmHg, no difference for HbA1c).
4. **Warner JL, Anick P, Drews RE. "Physician inter-annotator agreement in the Quality
   Oncology Practice Initiative manual abstraction task." *J Oncol Pract.* 2013;9(3):e96-e102.
   doi:10.1200/JOP.2013.000931. PMID 23942509** — two physician abstractors on the same 49
   charts agreed at only **κ=0.75**; dated elements only 73% raw agreement. **Manual
   abstraction is a second noisy measurement, not a gold standard.**
5. **Boussina A, et al. *NEJM AI.* 2024;1(11). PMID 39703686** — versus 100 SEP-1
   abstractions UCSD actually reported to CMS, expert adjudication found **4 of the 10
   discordances were errors by the human abstractors**.
6. **Krause TM, Ganduglia-Cazaban C, Finkel KW. *Manag Care.* 2018;27(8):45-49.
   PMID 30142069** — 28.3M lives: an ACE/ARB pathway contributed 14–16% of a diabetic
   nephropathy numerator with only 1% having microalbuminuria evidence. **Claims/registry
   measures can overstate**, so "registry higher" ≠ "registry correct."

**Implication for our model:** treating MIPS CQM as `underlying` (true care) is an
idealization the literature does not support. Registry/abstraction rates are biased *upward*
in at least some settings.

### 6.6 Corroboration of my topped-out finding

**Golding LP, Nicola GN, Duszak R, Rosenkrantz AB. "The Quality Measure Crunch: How CMS
Topped Out Scoring and Removal Policies Disproportionately..." *J Am Coll Radiol.*
2020;17(1 Pt B):110-117. doi:10.1016/j.jacr.2019.08.014. PMID 31918866** — the only
peer-reviewed paper quantifying MIPS performance differences by collection type. Percent of
measures topped out: **claims 82.7%, registry 60.4%, eCQM 11.6% (P<.001)**.

This independently corroborates my 40:0 topped-out asymmetry (§2.6) using a different year
and method.

### 6.7 Where the evidence is thin — state plainly

- **The ambulatory canon is old.** Kern (2013), Parsons (2012), Chan (2010), Roth (2009),
  Persell (2006), Baker (2007), Tang (2007) predate modern certified EHRs, FHIR, and
  near-universal e-prescribing and lab interfaces. **There is no post-2020 replication of
  Kern at comparable scale.**
- **No systematic review of eCQM vs chart-abstraction validity exists.** Chan KS, Fowles JB,
  Weiner JP. *Med Care Res Rev.* 2010;67(5):503-527. PMID 20150441 reviewed 35 studies of
  EHR *data quality*, not eCQM measure validity, and is 16 years old.
- **No peer-reviewed study exists on the MSSP Web Interface → APP eCQM/MIPS CQM transition.**
  Everything on the exact question our simulator models is CMS primary data, rulemaking, or
  my own computation.
- **No peer-reviewed study reports MIPS scores by collection type in points.** Golding 2020
  is the sole direct paper. The agent verified in full text that Bond 2022 (*JAMA*,
  PMID 36472595) and Khullar 2020 (*JAMA*, PMID 32897345) do **not** stratify by submission
  method; Chung 2026 (*Health Aff Sch*, PMID 41982632) explicitly declines to.
- **No cross-vendor rate-divergence study exists.**
- **No same-patient validity study exists for depression screening (MIPS 134)** — despite it
  showing the largest gap in every dataset here (−40.0 to −44.0 pp in benchmarks, −25.7 pp in
  MSSP, 0.0% for claims-only HEDIS plans). The mechanism evidence is qualitative only:
  Morden 2022 (PMID 34648936) and Liu 2019 (PMID 31622072), the latter finding **40–46% had
  screening documentation but standardized tools were rarely used** — the *service* occurs
  while the *structured standardized result* does not.
- **CMS eCQM validation agreement rates are confidential.** The only public figures, FY2025
  IPPS final rule (89 FR 69574): FY2024 national average **~90%**, ranging **~84% (STK-3)** to
  **~94% (STK-5)**, with CMS warning these rest on two quarters of data from long-established
  eCQMs and "may decrease."

### 6.8 The literature's own suggested framing — which matches my §2.5 gradient

The research agent proposed a three-tier model derived independently from the literature.
Set against my benchmark-derived gradient:

| Measure type | Literature estimate | My benchmark gradient (§2.5) |
|---|---|---|
| Natively structured, internal (236 BP, A1c value) | **0 to −7 pp** | groups 1–3: **+6.7 pp** |
| Referred out / historical (112, 113) | **−6 to −13 pp** | group 5: **+23.1 pp** |
| Patient-reported instrument / judgment in notes (134) | **−20 to −41 pp** | group 6: **+26.4 pp** |

The two agree closely at the structured end and on rank order. My benchmark-derived middle
tier is larger than the literature's, which is expected: benchmark files carry the
reporter-selection inflation documented in §7.3, while the literature studies are
same-patient.

**This convergence — two independent methods producing the same rank ordering — is the
strongest support in this document for the capture mechanism.**

---

## 7. Task 5 — Is the gap capture, or case mix / selection?

### 7.1 Payer mix is ruled out by regulation, not by inference

**42 CFR § 414.1340(a)**, retrieved from eCFR (B6), verbatim:

> "MIPS eligible clinicians, groups, virtual groups, subgroups, and APM Entities submitting
> quality measures data on **QCDR measures, MIPS CQMs, or eCQMs** must submit data on: …
> (4) At least 75 percent of the MIPS eligible clinician, group, virtual group, subgroup,
> and APM Entity's patients that meet the measure's denominator criteria, **regardless of
> payer** for MIPS payment years 2026, 2027, 2028, 2029, and 2030."

QCDR measures, MIPS CQMs and eCQMs are named in a **single sentence** under a **single
all-payer rule at a single threshold**. Only Medicare Part B Claims measures are
Medicare-only (§ 414.1340(b)), and CMS Web Interface is Medicare-only *and* sampled —
§ 414.1340(c)(1)(i) requires reporting on "the first 248 consecutively ranked beneficiaries
in the sample."

**Therefore the "eCQM reporters include younger, healthier, commercially-insured patients"
hypothesis cannot explain an eCQM-vs-MIPS CQM gap at all** — both collection types are
all-payer by rule, same population definition, same year. That hypothesis is available only
against the Web Interface and Medicare Part B Claims comparators, where it is real and
should be retained as a caveat on §3.2's abstraction rows.

**Verdict: CONTRADICTED for eCQM vs MIPS CQM. Live confound for eCQM vs Web Interface.**

### 7.2 Case mix — tested directly, and it points the wrong way

From B5, PY2024, medians by collection type:

| Metric | eCQM (n=38) | MIPS CQM (n=14) | Web Interface (n=391) |
|---|---|---|---|
| Assigned beneficiaries | 11,128 | 11,335 | 13,579 |
| HCC risk score, aged/non-dual | 0.98 | **1.07** | 0.98 |
| HCC risk score, aged/dual | 0.94 | **1.02** | 0.95 |
| HCC risk score, disabled | 0.91 | **1.00** | 0.93 |
| **% dual eligible** | 8.28 | **38.42** | 6.70 |
| % age < 65 | 9.48 | 9.40 | 7.91 |
| % age 85+ | 10.21 | 13.68 | 11.14 |
| % Black | 2.61 | **8.54** | 4.06 |
| Quality score | 74.86 | 73.92 | 84.78 |

Two findings, both damaging to the case-mix explanation:

1. **MIPS CQM ACOs serve a substantially sicker and more disadvantaged population** —
   higher HCC risk on all three segments, 4.6× the dual-eligible share, 3.3× the Black
   share — **and they still outscore eCQM ACOs on 001 and 236.** If case mix drove the gap
   it would run the other way. Risk-adjusting would make the eCQM penalty *larger*, so the
   §3.2 registry estimates are conservative.
2. **eCQM and Web Interface ACOs are near-identical on case mix** (HCC 0.98 vs 0.98,
   0.94 vs 0.95, 0.91 vs 0.93; dual 8.28% vs 6.70%, eCQM slightly *more* dual). Yet the
   measured gap between them is 8.7–25.7 pp. No plausible case-mix difference of that size
   exists between two groups with identical risk scores.

**Verdict: CONTRADICTED as the driver of the gap.** Case mix differs across collection
types, but in the direction opposite to the observed gap.

### 7.3 Reporter selection and composition — STRONGLY SUPPORTED, and larger than we thought

This is real, large, and we had not accounted for it. §3.3 already showed the national MIPS
CQM benchmark for 134 (average 89.55) is not reproduced by MSSP ACOs reporting MIPS CQM
(56.32). The research agent's analysis of the PY2024 QPP Experience PUF (n=443,222
clinicians, assigning each a modal collection type) quantifies why:

| Primary collection type | clinicians | median practice size | % in small practices |
|---|---|---|---|
| CMS Web Interface | 90,817 | 1,417 | 0.0% |
| **eCQM** | 241,330 | **557** | 9.3% |
| **MIPS CQM** | 78,339 | **85** | 22.6% |
| QCDR | 28,855 | 92 | 11.9% |
| Medicare Part B Claims | 3,881 | 3 | 100.0% |

**eCQM reporters sit in practices ~6.6× larger than MIPS CQM reporters**, and among
clinicians using exactly one of the two, the eCQM share rises monotonically with size —
**45.8% at 2–15 clinicians vs 89.6% at 500+**. (Agent-computed from the QPP Experience PUF;
I did not independently reproduce this, and CMS discontinued its published collection-type
share table after PY2021, so there is no CMS cross-tab to check it against.)

Corroborating peer-reviewed work:
- **Johnston KJ, et al. *JAMA.* 2020;324(10):984-992** — system-affiliated practices scored
  79.0 vs 60.3 mean MIPS final score.
- **Rula EY, et al. *Health Affairs Scholar.* 2026;4(4):qxag061** — 137 of 275 measures
  topped out; more than half reported by fewer than 5% of relevant physicians; median
  reporting rate 7.1%.

**Verdict: SUPPORTED as a major contributor to the *national benchmark* gap. Does NOT
explain the within-MSSP abstraction gap** (§3.2), which persists among organizations matched
on HCC risk score, nor the cross-measure gradient (§2.5), which the same reporters produce.

### 7.4 Benchmark-pool endogeneity — the biggest unresolved confound

MIPS benchmarks are historical with a two-year lag, so the eCQM benchmarks our simulator
uses were built from whoever was reporting eCQMs two years earlier. In MSSP that pool was
tiny and self-selected:

| PY | Total ACOs | Web Interface | eCQM / MIPS CQM |
|---|---|---|---|
| 2021 | 475 | 466 | **12** (5 eCQM) |
| 2022 | 482 | 457 | 37 |
| 2023 | 453 | 418 | 72 |
| 2024 | 476 | 392 | 167 |

(Agent-compiled from MSSP results PUFs, corroborated at 89 FR 98102.)

**The PY2025/PY2026 eCQM benchmarks therefore encode the performance of an early-transition
vanguard with immature data pipelines** — organizations that had *just* stood up eCQM
reporting. That is exactly the population in which capture loss should be worst, which means
the published eCQM benchmarks may overstate the steady-state capture penalty. This confound
cannot be corrected from public data and should be stated plainly in the app.

### 7.5 Gaming and collection-type shopping — SUPPORTED, and codified

**42 CFR § 414.1380(b)(1)(i)** contains an explicit max-selection rule: clinicians who submit
"data … on a single measure via multiple collection types are scored only on the data
submission with the **greatest number of measure achievement points**." CMS therefore
guarantees that hedging is free.

Reporters use it. **91 MSSP ACOs in PY2024 reported both routes, and had the highest mean
quality score of any group (85.36)** — above Web-Interface-only (84.08) and far above
digital-only (69.62). (Agent-computed from the PY2024 PUF.)

§ 414.1340(d) separately prohibits "unrepresentative" selective submission — CMS
acknowledging the risk exists precisely where partial submission is possible (MIPS CQM),
which is not possible for eCQMs.

Supporting evidence:
- **Roberts ET, et al. "Changes in patient experiences and assessment of gaming among large
  clinician practices in precursors of the Merit-Based Incentive Payment System."
  *JAMA Health Forum.* 2021;2(10):e213105. doi:10.1001/jamahealthforum.2021.3105.
  PMID 34841400** — top- vs bottom-quintile practices selected their CAHPS measures 96.3%
  vs 67.9% of the time (+28.4 pp, P=0.004), "consistent with gaming."
- **GAO-22-104667** (2021-10-01), `https://www.gao.gov/products/gao-22-104667` — "providers
  choosing to report on quality measures on which they are performing well, rather than on
  measures in areas where they may need improvement."
- **CMS itself**, 81 FR 77278: separate benchmarks by collection type "creates opportunities
  for clinicians to achieve higher quality scores by **selectively choosing submission
  mechanisms**."
- **CMS**, 90 FR 50002: MIPS groups "**can choose which eCQMs and MIPS CQMs they report on
  and tend to choose those they will perform well on**" — whereas ACOs must report the whole
  APP Plus set.

**This matters directly for our claim.** eCQM reporting under APP Plus is mandatory and
all-or-nothing; MIPS CQM reporting nationally is selective. Part of the national benchmark
gap is registry reporters *choosing their best measures*, which is not a capture effect at
all.

### 7.6 Multi-EHR aggregation — SUPPORTED, and CMS conceded it in regulation

CMS created the Complex Organization Adjustment (§ 414.1380(b)(1)(vii)(C)) specifically for
multi-TIN/multi-EHR entities, citing "challenges aggregating patient data from multiple TINs,
data deduplication, and interoperability between different health IT/EHR systems"
(89 FR 98435–98436). CMS's own simulation, CY2026 PFS final rule **90 FR 49808**: had the CoA
applied in PY2024, quality scores for the 18 affected ACOs would have risen **about 6
percentage points on average**.

Also on point, **86 FR 65257–65258**: a NAACOS survey found **77% of ACOs "do not have the
infrastructure in place to aggregate data"** across all payers.

### 7.7 MedPAC — supports non-comparability generally, but says nothing about eCQM vs MIPS CQM

**MedPAC, March 2018 Report to the Congress, Ch. 15, p. 452**
(`https://www.medpac.gov/wp-content/uploads/import_data/scrape_files/docs/default-source/reports/mar18_medpac_ch15_sec.pdf`):

> "**clinicians who achieve the same performance level on the same quality measure can
> receive a different score based on the method with which they choose to report** (e.g., by
> means of a registry or EHR)."

Also p. 446 ("MIPS scores are not comparable among clinicians"), p. 453 (score maximization
by "reporting measures through relatively less commonly used reporting methods"), p. 455
("MIPS fails to meet these standards"); March 2026 Ch. 4, pp. 118–119 on measure selection
"as a strategy to maximize their performance score."

**Honest limit: MedPAC has never addressed eCQM vs MIPS CQM vs Medicare CQM comparability or
the all-payer APP denominator.** Its critique is general and must not be represented as
being about our specific question.

### 7.8 What distinguishes capture from selection, and which way the evidence falls

Three discriminating tests, all available here:

| Test | Selection predicts | Capture predicts | Observed |
|---|---|---|---|
| Does the gap vary by data-element type across measures reported by the same reporters? | roughly uniform | scales with capture difficulty | **3.7× gradient (§2.5)** → capture |
| Do sicker reporters score worse? | yes | not necessarily | **sicker MIPS CQM ACOs score better (§7.2)** → not case mix |
| Does the gap survive matching on risk score? | no | yes | **8.7–25.7 pp at identical HCC (§7.2)** → capture |

**All three favor capture over selection for the within-organization effect, while §3.3
shows selection inflates the national benchmark gap.** Both are real; they operate at
different levels.

### 7.9 What I could not test

- **No within-organization data.** Nothing here measures the same ACO both ways in the same
  year (only 3 ACOs reported both, too few, and the PUF does not indicate whether they
  covered the same population). The gold-standard design — same patients, both methods —
  requires the literature (§6).
- **CMS does not publish reporter counts per benchmark cell**, so I cannot weight the
  national benchmark comparison by reporter volume or test composition directly in B1–B4.
- **Gaming/optimization is untested here.** Registry and QCDR reporting plausibly allows
  chart-chasing and denominator management that eCQMs do not; I found nothing in the
  benchmark files that can distinguish that from capture.

---

## 8. What we should change in the app

| # | Change | Priority | Basis |
|---|---|---|---|
| 1 | **Fix the "easier electronic benchmarks" claim** (`src/PathwayLab.tsx:942`). It is false for 001 and 236, where the MIPS CQM *flat* ladder is easier by 23.3 and 25.6 pp. Replace with: eCQM reporters measure lower on all five APP Plus measures, but that only costs points on **001 and 236**, because CMS flat-benchmarks MIPS CQM there and the flat ladder is lenient. On 134 the eCQM benchmark is so much easier that eCQM reporters score **3 deciles higher** despite a 40 pp worse rate. | **high** | §2.4, §2.8 |
| 2 | **Separate "rate effect" from "score effect" in the UI.** This is the single biggest conceptual gap. The capture slider should visibly move the *rate*, and the benchmark ladder should then visibly decide whether that costs any *points*. Right now the app implies rate loss ⇒ point loss, which is false in 54 of 72 measure-years. | **high** | §2.8 |
| 3 | **Make capture measure-specific.** Implied capture is 68.5%–99% depending on measure — wider than our whole slider range. Suggested anchors vs abstraction: **134 ≈ 68%, 001 ≈ 78%, 236 ≈ 89%**; 112/113 in between. Both my benchmark gradient and the literature's three-tier model support this. | **high** | §2.5, §3.4, §6.8 |
| 4 | **Stop calling MIPS CQM the true care rate.** `measuredRate()` returns `underlying` unchanged for `mipscqm` with the comment "abstraction finds the evidence." The literature says abstraction is itself biased upward (Homco: latent-class truth matched the *EHR*; abstractor-vs-abstractor κ=0.75). Re-label as "comparator/registry-reported rate," not truth. | medium | §6.5 |
| 5 | **Add a note that the eCQM benchmarks are built from an early-transition cohort** (12–72 ACOs in the relevant baseline years) and may overstate the steady-state capture penalty — NCQA's analogous gap fell from ~20 pp (2004) to ~5–6 pp (MY2023). | medium | §7.4, §6.3 |
| 6 | **Keep the denominator caveat, and keep it unmodeled.** The UI note that uncoded patients vanish and that this "often flatters rates" has the right sign and makes our estimate conservative. | keep as-is | §5.1 |
| 7 | Consider surfacing the **topped-out asymmetry** (40 : 0 across four years; corroborated by Golding 2020 at 11.6% vs 60.4%) — a vivid one-line demonstration that the method effect is real. | nice-to-have | §2.6, §6.6 |
| 8 | If we ever cite literature in-app, cite **Bailey 2016 (PMID 27522472)** — κ 0.96–1.00 for in-office values vs 0.42 for breast cancer screening is the cleanest published statement of our mechanism. Do **not** cite Kern 2013 as evidence eCQMs under-measure; it found the opposite for one measure. | nice-to-have | §6.1, §6.5 |

---

## 9. Caveats and gaps

1. **The measure-classification gradient in §2.5 is my own judgment.** No CMS or published
   taxonomy assigns measures to "narrative" vs "structured" data elements. The ordering is
   robust to reasonable reclassification of any single measure, but the category means with
   n=2–6 are not precise, and group 4 (n=2) is out of monotone order.
2. **Benchmark years are not fully independent** — PY2026 repeats 22% of PY2024 rows overall
   (6/36 eCQM, 15/105 MIPS CQM). Pooled n overstates independent observations; per-measure
   means are reported throughout as the conservative alternative.
3. **The within-MSSP registry comparison is underpowered** (n=10–14 ACOs). Its CIs are wide
   and two of three p-values sit at ~0.06. Do not quote those point estimates as precise.
4. **The Web Interface comparison conflates method with population.** WI is Medicare-FFS-only
   and sampled (248 consecutively ranked beneficiaries, § 414.1340(c)(1)(i)) and abstractors
   may read the entire chart including scanned outside records; eCQM is all-payer, whole
   population, structured data only. Some of the 8.7–25.7 pp is population, not capture.
   The near-identical HCC risk scores bound how much.
5. **PY2024 was the last Web Interface year**, so this natural experiment cannot be repeated
   going forward. PY2025+ MSSP data will only support the underpowered eCQM-vs-registry and
   eCQM-vs-Medicare CQM contrasts.
6. **Flat classification is pattern-derived**, since the CSV's `Benchmark Type` column never
   emits "Flat". Corroborated for the Medicare CQM cells by CMS prose (see
   `research/benchmarks-py2026.md`), but *not* independently source-verified for 001/236
   MIPS CQM.
7. **B1–B4 are undocumented frontend API endpoints** with no version stamp, `ETag`, or
   `Last-Modified`. MD5s in the source table pin exactly what was retrieved. `HEAD` returns
   404 — use `GET`.
8. **Suppression in B5 is not characterized.** 30 ACOs report no rate on any of the three
   measures; I did not determine whether suppression is random with respect to performance.
9. **Provenance of individual findings.** Everything in §2, §3 and §7.1–7.2 is my own
   computation from B1–B6 and is reproducible from the scripts and derived CSVs. §4 and §6,
   and the reporter-size/participation figures in §7.3–7.7, come from research agents; I
   verified all 18 PMIDs against PubMed and spot-checked the CMS arithmetic in §4.1a, but I
   did **not** read the full text of the cited papers or independently reproduce the QPP
   Experience PUF analysis in §7.3. Those are attributed in place.
10. **A caution about joining on `Measure ID`.** One agent reported that measures 112 and 113
    "have no 2025 benchmark rows." That is **wrong**, and the error is instructive: in the
    PY2024–PY2026 files those measures are published as
    `112 (Not available in Traditional MIPS)`, so a literal join on `"112"` silently drops
    them. My §2.4 values for 112/113 in PY2025 (eCQM 56.08 / 49.80 vs MIPS CQM 69.16 / 71.31)
    are verified directly against the raw CSV. Always normalize the ID before joining.
11. **The §2.8 decile computation places the *average* reporter**, which is not the same as
    the average of reporters' deciles (Jensen's inequality). It answers "where does a typical
    reporter land," not "what is the mean decile earned." The direction of the finding is
    robust — 54:3 is not a close call — but do not quote "+1.36 deciles" as a mean score
    difference.
12. **No within-organization, same-year, both-methods comparison exists anywhere** — not in the
    MSSP PUF (only 3 such ACOs, and no indication they covered the same population) and not in
    the peer-reviewed literature for MIPS collection types. This is the missing experiment that
    would settle capture-vs-selection cleanly, and its absence is the main reason claim 2 is
    "supported" rather than "established."
