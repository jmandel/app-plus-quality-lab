# Why eCQM Reporters Score Lower Than Registry/Chart-Review Reporters

Evidence base for the simulator's "data-capture efficiency" model.
**All retrieval dates: 2026-08-09** unless otherwise stated.

---

## BOTTOM LINE

**Verdict: PARTIALLY SUPPORTED — the empirical premise is strongly confirmed, but the
benchmark claim we build on it is wrong for two of our five measures, and our headline
magnitude is inflated by a confound we had not accounted for.**

Three separable claims, graded:

| # | Our claim | Verdict |
|---|---|---|
| 1 | eCQM reporting produces **lower measured rates** than chart-review/registry reporting on the same measure | **SUPPORTED — strongly.** Confirmed independently in national MIPS benchmarks (median +12.3 pp, 95% of 80 measure-years) and in PY2024 MSSP ACO-level results (+8.7 to +25.7 pp vs chart abstraction, all p<0.0001). |
| 2 | The cause is **data capture** (care happened, not provable as structured data) rather than worse care | **SUPPORTED, with the strongest single piece of evidence being ours.** The gap scales monotonically with how hard the data element is to capture — 3.7× larger for outside/narrative elements than for elements already sitting in a discrete field. Case mix is affirmatively ruled out: eCQM ACOs are *not* sicker than their comparators, and the registry ACOs that outscore them are *substantially* sicker. |
| 3 | This is why **"CMS's eCQM benchmarks are systematically easier than MIPS CQM benchmarks"** | **PARTIALLY SUPPORTED — and FALSE for measures 001 and 236.** True where both sides carry observed benchmarks (median eCQM Decile 5 bar is 14.7 pp easier). But for 001 and 236 CMS applies a *flat* benchmark to MIPS CQM, and the flat ladder is far more lenient than the eCQM historical ladder. For those two measures the eCQM benchmark is **harder by 23.3 pp and 25.6 pp** respectively. |

**The correction that matters most for the app.** `src/PathwayLab.tsx:942` currently says
"CMS's easier electronic benchmarks bake in both effects." That is not true of the two
APP Plus **outcome** measures — 001 and 236 — which are exactly the measures that carry
the 10th-percentile outcome gate. There, eCQM reporters are hit twice: they measure lower
*and* they are scored against a harder ladder, because their registry counterparts get a
lenient flat benchmark. See §2.4.

**The magnitude correction.** Our single global 85% capture slider is not well calibrated.
Backing capture efficiency out of real PY2024 MSSP data gives **68.5%–99% depending on the
measure and comparator** (§3.4). The measure-to-measure spread is larger than the entire
slider range we expose, and a single global value cannot reproduce it.

**Where our model is conservative in a way we should keep:** we model capture loss as a
pure numerator effect and note in the UI that denominator leakage is unmodeled and
probably flatters rates. That is the right sign — see §5.

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

**Three things this establishes, and one it complicates:**

1. CMS itself publishes arithmetic in which **identical care yields a lower eCQM rate than
   MIPS CQM rate**. Our premise is CMS's own worked example.
2. CMS attributes the difference to data "**not identified within the EHR**" — i.e. capture,
   not population. This is the capture mechanism, stated by CMS.
3. **But the mechanism is not what our model implements.** Our model applies a multiplicative
   numerator haircut. CMS's mechanism is a *denominator-treatment asymmetry*: patients with
   unfound data stay in the eCQM performance-rate denominator as failures, but are
   **removed from the MIPS CQM performance-rate denominator** and charged to data
   completeness instead. In CMS's example the eCQM denominator is 950 and the MIPS CQM
   denominator is 900.
4. Complication: this means part of the gap is a **pure accounting rule**, not a difference
   in how much care was captured. A registry reporter and an eCQM reporter with *identical*
   data capture would still post different rates. See §5.

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

*(pending — see agent findings integration)*

---

## 6. Task 3 — The mechanism literature

*(pending — see agent findings integration)*

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

### 7.3 Reporter selection and composition — SUPPORTED as a partial explanation

This one is real, and we had not accounted for it. §3.3 shows the national MIPS CQM
benchmark (134 average 89.55) is not reproduced by MSSP ACOs reporting MIPS CQM (56.32).
Different kinds of organizations choose different methods, and the national benchmark files
compare *methods entangled with organizations*.

Within MSSP the composition differences are visible but modest in size: eCQM ACOs skew
two-sided (29 of 38 in ENHANCED/BASIC-E vs 7 of 14 for MIPS CQM) and are more evenly split
on revenue (21 low / 17 high vs 12 low / 2 high).

**Verdict: SUPPORTED as a contributor to the *national benchmark* gap; does NOT explain the
within-MSSP abstraction gap**, which persists among organizations matched on risk score.

### 7.4 What distinguishes capture from selection, and which way the evidence falls

Three discriminating tests, all available here:

| Test | Selection predicts | Capture predicts | Observed |
|---|---|---|---|
| Does the gap vary by data-element type across measures reported by the same reporters? | roughly uniform | scales with capture difficulty | **3.7× gradient (§2.5)** → capture |
| Do sicker reporters score worse? | yes | not necessarily | **sicker MIPS CQM ACOs score better (§7.2)** → not case mix |
| Does the gap survive matching on risk score? | no | yes | **8.7–25.7 pp at identical HCC (§7.2)** → capture |

**All three favor capture over selection for the within-organization effect, while §3.3
shows selection inflates the national benchmark gap.** Both are real; they operate at
different levels.

### 7.5 What I could not test

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

| # | Change | Basis |
|---|---|---|
| 1 | **Fix the "easier electronic benchmarks" claim** (`src/PathwayLab.tsx:942`). It is false for 001 and 236, where the MIPS CQM flat ladder is easier by 23.3 and 25.6 pp. Say instead: eCQM reporters measure lower on every APP Plus measure, *and* on 134/112/113 the eCQM benchmark is correspondingly easier — but on 001 and 236 the flat MIPS CQM benchmark is far more lenient, so eCQM reporters are penalized twice. | §2.4 |
| 2 | **Make capture measure-specific, or widen and re-label the slider.** Implied capture ranges 68.5%–99% by measure/comparator; our 65–100% range is fine but a single global value is not. Suggested per-measure anchors vs abstraction: 134 ≈ 68%, 001 ≈ 78%, 236 ≈ 89%. | §2.5, §3.4 |
| 3 | **Re-label what MIPS CQM means in the model.** We treat it as ground truth ("abstraction finds the evidence"). Within MSSP, registry reporters are only 0.5–7.9 pp better than eCQM reporters — the *Web Interface* was the true high-water mark, and it is gone after PY2024. Calling MIPS CQM "true care rate" overstates it. | §3.2 |
| 4 | **Keep the denominator caveat, and keep it unmodeled.** Our UI note that uncoded patients vanish and that this "often flatters rates" has the right sign. | §5 |
| 5 | Consider surfacing the **topped-out asymmetry** (40 : 0) — it is a vivid, one-line way to show the method effect is real. | §2.6 |

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
