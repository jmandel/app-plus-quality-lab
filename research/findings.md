# Calibration Findings — APP Plus Pathway Lab

**Report date: 2026-08-07.** All source retrievals dated 2026-08-07 unless otherwise stated.

Scope: `src/PathwayLab.tsx` (the simulation engine and its UI copy), `docs/session-notes.md`,
`docs/scoring-calculation-spec.md`, and `docs/2x2-ecqm-preference.md`, checked against the five
independent ground-truth files in this directory (see [README.md](README.md)). Every finding below
was raised by a domain researcher and then re-verified adversarially against primary sources —
regulation text, Federal Register full text, CMS memos, and CMS public-use files — with the app's
model re-implemented independently to reproduce the numeric divergences.

---

## Executive summary

The app's **benchmark data is exact** and its **scoring skeleton is sound**; the defects cluster in
the *settlement* layer and in *whose measures count* for the deeming tests. Cell-by-cell diff of the
`BENCH` table against the PY2026 QPP benchmarks CSV found **zero numeric discrepancies** across all
nine published cells — cutpoints, averages, topped-out flags, the seven-point cap, the inverse
orientation for measure 001, and the four PY2025 stand-in ladders all reproduce digit-for-digit
(finding N5). The largest single dollar error is the opposite: a module-level `MAX_SHARE = 75`
applied to two scenarios the app itself narrates as **BASIC Level A and Level B**, whose statutory
maximum sharing rate is **40 percent**. At page-load defaults this overstates the median ACO's
shared savings by **$2.61M (+88%)**, and it propagates into the comparison table's Net $ column, the
best-mix search objective, and the marginal-value-per-point readout (E1). A companion defect applies
the ENHANCED-shaped quality-scaled loss curve to BASIC tracks, where losses are either **zero**
(Levels A/B) or a **flat 30 percent** that does not move with quality (E2) — so the safety-net
scenario's central teaching claim, "a higher score reduces how much of the loss the ACO must repay,"
holds for no BASIC level.

Three further errors concern **which measures the deeming tests may look at**. The reporting
incentive's 40th-percentile leg must be satisfiable by any of the *remaining seven* measures in the
eight-measure APP Plus set — including CAHPS (321) and the two administrative-claims measures (479,
484) — but the app searches only the five ACO-reported measures, and can therefore withhold DEEMED
from an ACO the regulation deems (E3). The same narrowing on the *outcome* leg silently drives the
ALT-versus-FAILED branch, where the undisclosed consequence is a **0% sharing rate and a 75% loss
rate** (E4) — a state that, empirically, **zero of 476 PY2024 ACOs** occupied. And the app scores
measures 112/113 on PY2025 stand-in ladders against a fixed 80-point denominator, where
42 CFR 414.1367(c)(1)(i) excludes benchmark-less measures from **both** numerator and denominator (E5).

Two items could **not be settled from the public record** and are flagged UNCERTAIN, not fixed: the
§ 425.512(a)(7)(ii)(B) 40th-percentile score floor (X3) — the rule text and the 73.85 constant verify
exactly, but whether the trigger actually *fires* for PY2026 turns on whether a missing pre-year
historical benchmark counts as "no benchmark" when CMS may still set a performance-period benchmark,
and CMS's own July 2026 preamble cuts against the trigger — and the non-QP Part B billing base (M3),
whose only public proxy measures a different population than the app's stated input.

Counts: **6 errors** (covering 10 raised findings, several duplicated across domains),
**2 confirmed miscalibrations + 1 uncertain**, **5 mislabels**, **2 confirmed missing + 2 uncertain**,
**6 notes** (2 of which are affirmative no-defect verifications). **8 candidate findings were refuted**
and are listed at the end.

---

## ERROR

### E1. 75% sharing rate applied to scenarios narrated as BASIC Level A and B
*Findings f9 / f24 / f30 (raised independently by the acos, scoring-rules, and qp-tracks domains) —* **CONFIRMED**

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:118` (`const AVAILABLE = 80, QPS = 55, MAX_SHARE = 75, POP_ADJ = 3`); sole use site `:270` (`sharePct`). Scenario narration at `:145` (ENHANCED), `:152` ("It's in BASIC Level B"), `:159` ("in BASIC Level A"). Display at `:877`; propagates to the Compare table Net $ at `:931` and the marginal readout at `:579-585`. |
| **App value** | 75% maximum sharing rate for **all three** scenarios. Middle scenario at page-load defaults (all eCQM, capture 0.85): status DEEMED, `sharePct` 75, savings = 0.75 x 4.2% x $177M = **$5.58M**. |
| **Authoritative value** | **40%** for BASIC Levels A and B; 50% for Levels C/D/E; 75% for ENHANCED. Correct middle-scenario figure: **$2.97M** — the app overstates by **$2.61M (+88%)**. |
| **Source** | 42 CFR 425.605(d)(1)(i)(A)(4) and (ii)(A)(4), performance years beginning on or after 2024-01-01: "40 percent for an ACO that meets the quality performance standard… 40 percent multiplied by the ACO's quality score… for an ACO that meets the alternative quality performance standard." ENHANCED at 425.610(d)(4). eCFR 2026-08-05 issue: `https://www.ecfr.gov/api/versioner/v1/full/2026-08-05/title-42.xml?chapter=IV&subchapter=B&part=425&section=425.605`. Empirically confirmed in the PY2024 PUF: `FinalShareRate` max = 40.00 across all 157 BASIC A/B ACOs (0 above), 50.00 for BASIC C/D/E, 75.00 for ENHANCED — `https://data.cms.gov/sites/default/files/2026-07/fb6ba14b-3450-47c2-8ff5-d1f2a5bdb3e3/PY_Financial_and_Quality_Results_2024_revised%202026_07_17.csv`. |
| **Undisclosed** | Not in `docs/session-notes.md` "Known simplifications" (which lists only the QPS threshold, loss-scaling curve, and fee-adjustment formula), and **contradicted by the project's own spec**: `docs/scoring-calculation-spec.md:102` states "QPS met/deemed -> max rate for track (e.g., 75% ENHANCED; 50%->[PROPOSED] 60% BASIC-E)". |
| **Suggested fix** | Add a `track` (or `maxShare`) field to the `Scenario` interface — ENHANCED 75, BASIC A/B 40, BASIC C/D/E 50 — and use it in `settle()` for **both** the MET/DEEMED branch and the ALT branch (the ALT branch's *shape*, quality score x track max, is correct and was verified 29/29 against the PUF). Alternatively move the middle and safety-net scenarios to two-sided tracks and say so — but then the "ALL of its clinicians remain subject to MIPS" premise behind the Part B base must change too. |

### E2. Quality-scaled loss curve applied to BASIC tracks, where losses are flat 30% or zero
*Findings f25 / f31 —* **CONFIRMED**

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:271` (`lossPct = mach.status === "FAILED" ? 75 : Math.min(75, Math.max(40, 75 - 0.45 * mach.q))`), computed inside `settle()` (`:269-279`), which takes no track parameter. Unconditional readout at `:878`. Safety-net story at `:159`. |
| **App value** | Loss rate scales with quality for every scenario. Safety-net at defaults: q = 48.8 -> `lossPct` 53.1% -> **$0.252M** repayment on a -0.5% result. |
| **Authoritative value** | BASIC Levels A and B are **one-sided** — no shared losses at all. BASIC Levels C, D, E owe a **fixed 30 percent** loss rate that does not move with quality and does not depend on meeting the QPS. Quality scaling exists **only** in ENHANCED. Under every BASIC level the quality score changes the repayment by exactly **$0**. |
| **Source** | 42 CFR 425.605(d)(1)(iii)(C), (iv)(C), (v)(C), each verbatim: "the amount of shared losses is determined based on a fixed 30 percent loss sharing rate." 425.605(d)(1)(i) and (ii) are headed "Level A (one-sided model)" / "Level B (one-sided model)" and contain no shared-loss paragraph. Quality scaling only at 425.610(f)(4). eCFR 2026-08-05 issue (URL as E1). PY2024 PUF: `FinalLossRate` = 30.0 for exactly 114 ACOs = BASIC C(5) + D(5) + E(104). |
| **Note on shape** | The app's curve is **not** the ENHANCED formula either — ENHANCED is `100 - 0.75q` in percentage terms (floor reached at q = 80); the app uses `75 - 0.45q`. That coefficient difference *is* covered by the documented "illustrative stand-in" label. The **wrong-population** problem is not: `session-notes.md:117` itself calls this "ENHANCED loss scaling" while the app applies it to two BASIC scenarios. |
| **Also affected** | The in-app hedge at `:159` ("in BASIC Level A, actual loss repayment wouldn't apply — treat the loss figure as illustrating a two-sided variant") does not rescue the claim, because the two-sided BASIC variants are flat 30% and do not scale either. The hedge's *first* half is correct. |
| **Suggested fix** | Gate the loss rail on track: no loss rail for BASIC A/B; a flat, quality-insensitive 30% rail for BASIC C/D/E; the quality-scaled curve only for ENHANCED. If the safety-net scenario stays in BASIC A, retire "a higher score reduces how much of the loss the ACO must repay" from its story. |

### E3. Reporting incentive's 40th-percentile leg tested only over the five ACO-reported measures
*Findings f4 / f20 / f26 —* **CONFIRMED**

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:245-246` (`otherOK`, which iterates only `rows`); lamp label at `:862` ("At least one other measure reached the 40th percentile (decile 5+)"). `scen.fixedPts` is never consulted in the deeming path. |
| **App value** | Only measures 001, 134, 236, 112, 113 can satisfy the 40th-percentile condition. |
| **Authoritative value** | Any of the **remaining seven** measures of the eight-measure APP Plus set may satisfy it — which includes **CAHPS (321)** and the two administrative-claims measures **479 (HWR)** and **484 (MCC)**, all three of which the app already models as decile-equivalent fixed point values (strong 7/6/7, middle 6/5/6, safety-net 5/4/5). |
| **Source** | 42 CFR 425.512(a)(5)(i)(B)(2): "…and a quality performance score equivalent to or higher than the 40th percentile of the performance benchmark on at least one of the **remaining measures** in the APP Plus quality measure set." (The PY2022–2024 APP paragraph in the same section says "remaining five measures" — the count is deliberately dropped.) `https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-425/subpart-F/section-425.512`. CMS states the count explicitly: "…on at least one of the **remaining seven measures** in the APP Plus quality measure set," with Table 1 listing the eight-measure set — CMS PY2026 40th-percentile QPS memo, `https://www.cms.gov/files/document/medicare-shared-savings-program-quality-performance-standard-performance-year-2026-40th-percentile.pdf`. |
| **Reproduced divergence** | Middle scenario, all eCQM, capture 0.85, all five care-rate sliders dragged to the slider minimum of 5 -> deciles 001 = 8, 134 = 2, 236 = 1, 112 = 1, 113 = 1 -> `otherOK` = false -> `deemed` = false -> status **ALT**, sharing rate 32.8%, q = 43.8. Under the regulation the ACO is **DEEMED** at the full rate: 001 at decile 8 satisfies the 10th-percentile outcome leg, and CAHPS at 6 points (decile 6 >= 5) satisfies the 40th-percentile remaining-measures leg. |
| **Undisclosed** | `session-notes.md:104` states the condition generically; its only caveat covers the **outcome** leg ("the lab checks 001/236 only"). Nothing in Known simplifications (`:136-148`) and nothing in `docs/scoring-calculation-spec.md` covers this narrowing. |
| **Suggested fix** | Include `fixedPts.cahps`, `.claims1`, `.claims2` in the `otherOK` candidate pool (treat >= 5 as satisfying the 40th percentile) and relabel the lamp: "At least one of the remaining seven measures (including CAHPS and the two claims measures) reached the 40th percentile." |

### E4. `outcomeOK` excludes claims measures 479/484 — and that flag alone drives the FAILED state (0% sharing, 75% loss)
*Finding f27 —* **CONFIRMED**

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:240` (`outcomeOK = rows.some((r) => r.outcome && gates[r.id] && r.decile >= 2)`; `outcome: true` is set only on 001 and 236 at `:112`/`:114`); `:248` (`status = deemed ? "DEEMED" : q >= QPS ? "MET" : outcomeOK ? "ALT" : "FAILED"`); `:270-271` (FAILED -> `sharePct` 0, `lossPct` 75); lamp at `:861`. |
| **App value** | Only 001 and 236 can establish the outcome condition, for **both** the reporting incentive **and** the alternative-QPS branch. FAILED is reachable by a fully-reporting ACO: middle scenario with all five failure checkboxes ticked -> pts 0, gates false, q = 17/80 = 21.25 -> **FAILED** -> 0% sharing, 75% loss. |
| **Authoritative value** | The PY2026 APP Plus set has **four** outcome measures — 001, 236, **479, 484** — and the administrative-claims measures count for both purposes. Under the app's own fixed points those claims measures sit at deciles 5 and 6, so the alternative standard would be met. Separately, the true failure condition is **conjunctive** and essentially unreachable for a reporting ACO. |
| **Source** | CMS PY2026 40th-percentile memo, Table 1: 479 and 484 carry Measure Type "Outcome^", footnote "^ Indicates this is an outcome measure for purposes of qualifying for the eCQM/MIPS CQM reporting incentive **and the alternative quality performance standard**" (URL as E3). Alternative standard codified at 42 CFR 425.512(a)(5)(ii)(B); failure condition at (a)(5)(iii)(B): "does not report any of the eCQMs/MIPS CQMs/Medicare CQMs… **and** does not administer a CAHPS for MIPS survey." eCFR 2026-08-05 issue. |
| **Empirical check** | In PY2024, **zero of 476** ACOs met neither standard: 447 met the QPS, 29 met only the alternative QPS (PY2024 PUF, URL as E1). The app's FAILED state has no real-world analogue for a reporting ACO. |
| **Undisclosed** | The existing disclosure is scoped to the reporting incentive only — the code comment at `:241-244` sits under "Second incentive condition (CY2025 final rule)" and `session-notes.md:102-107` places it inside the "Reporting incentive (deeming)" bullet. Neither mentions ALT/FAILED or dollars. |
| **Suggested fix** | Split the two uses. Keep the conservative 001/236-only test for DEEMED if desired, but compute the **alternative-QPS** branch over all four outcome measures including the fixed claims points, so ALT is reached whenever 479 or 484 clears decile 2. Reserve FAILED for the actual statutory condition (no reported clinical measures **and** no CAHPS). Extend the session-notes caveat to say the simplification also moves ALT/FAILED and therefore dollars. |

### E5. Denominator stays 80 when measures 112/113 have no PY2026 benchmark
*Finding f22 —* **CONFIRMED**

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:118` (`const AVAILABLE = 80`); `:236-237` (`total = Math.min(earned + coa + fixed, AVAILABLE); q = (total / AVAILABLE) * 100`); `:80-81` and `:86-87` (`est: true` PY2025 stand-in ladders for 112/113 under eCQM and MIPS CQM). |
| **App value** | 112/113 are always scored — on PY2025 ladders — and always counted in an 80-point denominator. Middle scenario at defaults: 112 measures 58.65% -> decile 5 -> 5 pts; 113 measures 56.10% -> decile 6 -> 6 pts; earned 26 + COA 5 + fixed 17 = 48; **q = 48/80 = 60.0**. |
| **Authoritative value** | A submitted measure without a benchmark is excluded from **both** the numerator and the total available achievement points — a 60-point denominator when both 112 and 113 are routed to eCQM or MIPS CQM. Under the exclusion rule the scored set is 001/134/236 plus the three fixed measures. |
| **Source** | 42 CFR 414.1367(c)(1)(i), verbatim: "Each submitted measure that does not have a benchmark or meet the case minimum requirement is excluded from the MIPS eligible clinician, group, or APM Entity group's total measure achievement points **and total available measure achievement points**." 414.1367 is the APM Performance Pathway section — the pathway MSSP ACOs are scored under — and (c)(1) makes this an express carve-out from 414.1380(b)(1). `https://www.ecfr.gov/api/versioner/v1/full/2026-08-05/title-42.xml?chapter=IV&subchapter=B&part=414&section=414.1367`. No-benchmark fact re-verified live from `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2026` (MD5 `3c4ba299ad2f604f7852b3b9c5433400`): rows "112 (Not available in Traditional MIPS)" and "113 (Not available in Traditional MIPS)" for eCQM and MIPS CQM show `Measure has a Benchmark = No`, all ten deciles `--`, comment "Insufficient volume of data submitted in PY 2024 to establish historical benchmark." (112SSP/113SSP Medicare CQM *do* carry flat benchmarks, matching the app.) |
| **Interaction** | The app's own UI already states the fact ("measures 112 and 113 have NO published 2026 benchmark under eCQM or MIPS CQM") but treats it purely as a data gap, not as a scoring rule. **See X3** — dropping to a 60-point denominator is necessary but may not be sufficient; § 425.512(a)(7)(ii)(B) may additionally floor the score at 73.85, but that trigger is UNSETTLED. |
| **Suggested fix** | Make the denominator dynamic: when a routed measure's cell has `est === true` (no PY2026 benchmark), drop it from both `earned` and the denominator. Keep the estimate ladder visible as an explanatory overlay but exclude it from the score, and make the waterfall's "total/80" label follow the computed denominator. |

### E6. Scoring spec's deeming-bypass rule omits the second required condition
*Finding f19 —* **CONFIRMED** *(documentation defect; the app code is correct here)*

| | |
|---|---|
| **App location** | `docs/scoring-calculation-spec.md:88` (Stage E, item 2) and `docs/scoring-calculation-spec.md:114`. |
| **App value** | States the bypass as: all five reportable measures routed to eCQM or MIPS CQM **AND** each met data completeness **AND** >= 10th percentile on >= 1 outcome measure -> deemed. Line 114 repeats the incomplete version ("Deeming bypass is live (given one outcome measure >= 10th percentile)"). |
| **Authoritative value** | A **four-part** conjunction — the >= 40th-percentile-on-a-remaining-measure condition is missing from the spec. |
| **Source** | 42 CFR 425.512(a)(5)(i)(B)(2) (current law, PY2025–2026), joining all four conditions with "and" (URL as E3). Restated unchanged for PY2027+ at 91 FR 44039 / Table B-G6, 91 FR 44056. |
| **Why it matters** | The app's **code** implements the missing condition (`otherOK` at `src/PathwayLab.tsx:245-246`) and surfaces it as a fourth status lamp (`:862`), so the spec contradicts both the regulation and the implementation — and `session-notes.md:21-27` describes the spec as written "for someone implementing or auditing it." |
| **Suggested fix** | Add the second conjunct to Stage E item 2 and to the line-114 summary. **Also fix a second staleness in the same item** that this finding did not raise: for PY2027+ the incentive narrows to eCQMs only (425.512(a)(5)(i)(C)(2)), so the "[PROPOSED] extended to PY 2027+" aside needs the same correction. |

---

## MISCALIBRATION

### M1. Best-mix search recommends Medicare eCQM inside a PY2026-only model
*Finding f16 —* **CONFIRMED**

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:601-606` (the exhaustive 1,024-assignment loop, which enumerates all four `PATHWAYS` including `medecqm`), `:614-617` (`bestRouting`), `:696-727` ("Apply best mix" button). Scope statement at `:650`: "Everything here is for the 2026 performance year." |
| **App value** | Medicare eCQM is a selectable route in the optimizer and carries a dollar value in the comparison table's Net $ column; the "Apply best mix" button will route PY2026 measures to it. |
| **Authoritative value** | Medicare eCQMs are a **proposed new collection type whose first performance period is CY 2027**. They are unavailable in PY2026 under current law **and** under the proposal. |
| **Source** | CMS-1848-P: "we are proposing to create the Medicare eCQMs collection type, which would be a new collection type for PY 2027 and subsequent PYs"; 91 FR 44048-44050 and 44283. `https://www.federalregister.gov/documents/full_text/text/2026/07/16/2026-14327.txt`. |
| **Reproduced** | Safety-net, capture 0.85, proposed-flat toggle OFF, clinician channel at its default off -> best mix = 001:MIPS CQM / 134:eCQM / 236:MIPS CQM / **112:Medicare eCQM** / 113:Medicare CQM, q 58.8, net -$0.2307M; the best PY2026-legal mix ties at -$0.2307M, so the enumeration order keeps `medecqm` and the button's chip for 112 renders "X". At capture 1.00 with the clinician channel on, Medicare eCQM wins **outright**: q 60.0 / net -$0.2424M vs. q 58.8 / net -$0.2676M for the best legal mix. |
| **Partial mitigation** | The app does disclose the collection type's status — an asterisk on every route button (`:456`) and strategy row (`:693`), plus prose at `:735-736` ("proposed to begin in 2027, not yet final") and `:969` ("does not exist until 2027"). But that disclosure is about the *collection type*, not about the *optimizer recommending it inside a PY2026-scoped model*; neither the button nor the Net $ column is gated, and this is not in Known simplifications. |
| **Suggested fix** | Exclude `medecqm` from the 1,024-assignment search and from `bestRouting` whenever the app is in PY2026 mode (i.e. always, as currently built), or add an explicit performance-year selector so Medicare eCQM becomes selectable only in a PY2027 mode. At minimum, suppress it from the tie-break preference and mark the "All Medicare eCQM*" row's Net $ as not-available-in-PY2026. |

### M2. Session notes attribute the whole gap to 83.1 to whole-decile rounding; the digital-reporting gap is real
*Finding f13 —* **CONFIRMED**

| | |
|---|---|
| **App location** | `docs/session-notes.md:138-140` (Known simplifications, first bullet). |
| **App value** | "Whole-decile scoring (real MIPS awards fractional points 1.0–10.9 within a decile) — **this is why** the lab's absolute scores run below the real PY2024 median quality score of 83.1." |
| **Authoritative value** | 83.11 is the correct all-ACO median, but it is the **wrong comparator** for a lab that models only digital collection types. PY2024 quality by reporting mechanism: Web Interface only **n = 301, median 84.29**; both **n = 91, median 85.62**; **digital only n = 76, median 74.58** (p25 60.66); digital only excluding the 16 EUC-floored **n = 60, p25/p50/p75 = 58.21 / 70.97 / 76.21**. |
| **Source** | PY2024 results PUF fields `Report_WI` and `Report_eCQM_CQM_MedicareCQM` (URL as E1); reproduces `research/mssp-py2024-results.md:135-152`, which itself calls the digital-only gap "the single largest empirical signal about what happens when ACOs leave the Web Interface." |
| **Why the label fails on its own terms** | Being on the "Known simplifications" list does not save it, because the defect is in the bullet's own **causal explanation**. Fractional within-decile scoring is worth at most ~0.9 points per measure — roughly 3.6 points of an 80-point denominator, about 4.5 score points across all eight measures — against a **23-point gap** from the lab's middle-scenario q = 60.0 to 83.1. The note as written tells a reader to discount a signal the app is arguably right about. |
| **Suggested fix** | Rewrite the bullet to separate the two effects: whole-decile rounding costs up to ~0.9 points per measure, but the relevant real-world comparator for an all-digital measure set is the PY2024 **digital-only median of 74.58** (70.97 excluding EUC-floored ACOs), not the Web-Interface-dominated 83.1. Consider surfacing that as a reference marker on the threshold strip. |

### M3. Non-QP Part B bases sit at ~90–106% of the closest public proxy — UNSETTLED
*Finding f12 —* **UNCERTAIN — could not be settled from the public record; do not "fix" as an error**

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:148` / `:155` / `:162` (`partB: 15`, `60`, `30`); footer disclosure at `:976-978`. |
| **App value** | Middle: $60M / 13,000 benes = **$4,615 per beneficiary**. Safety-net: $30M / 8,000 = **$3,750**. Strong: $15M / 24,000 = **$625** (internally consistent with its ENHANCED QP-exemption story). |
| **Closest public proxy** | PY2024 `CapAnn_PB` (Part B physician/supplier carrier spend per assigned beneficiary person-year, **any** provider): p25/p50/p75 = **$3,587 / $4,332 / $5,124**. For the 114 ACOs with 10,400–16,250 benes the median implied carrier total is ~**$58.1M**, so the middle scenario's $60M is ~**103%** of it; safety-net ~90%; strong ~15%. |
| **Why it is not adjudicable** | `CapAnn_PB x N_AB` is **not a ceiling** on the quantity the slider models. The app defines the input at `:785-789` as professional billing at the ACO's *participant practice groups* by non-QP clinicians — that is participant-TIN billing across those TINs' whole Medicare FFS panel, including patients **not assigned to this ACO**, a different population from `CapAnn_PB`'s assigned-beneficiary denominator. `CapAnn_PB` is additionally a *truncated* mean. No public field gives an ACO's own Part B billing. |
| **Source** | PUF data dictionary (S5), `https://data.cms.gov/sites/default/files/2025-11/0eb58c4e-6f40-497d-a90f-242151c20bb8/Data_Dictionary-Medicare_Shared_Savings_Program-Performance_Year_Financial_and_Quality_Results_2025_Nov2025.pdf`; distributions from the PY2024 PUF (URL as E1). |
| **Fair residual observation** | $60M against the middle scenario's implied expenditures of ~$169.6M is **35.4%** on Part B professional billing alone, which by CMS's own `Rev_Exp_Cat` definition would classify the ACO as **High Revenue** — a large minority (202/476 = 42.4% in PY2024; 186/511 = 36.4% in PY2026). That is an internal-consistency note against "built to match the median real 2024 ACO," not a proven wrong value; the app never claims Low Revenue status. |
| **Suggested action** | Treat as a **labeling improvement, not a correction**. Replace the vague "anchored loosely to professional-services spending per beneficiary" with a stated fraction of the assigned-population carrier proxy and the reason (leakage to non-participant providers; participant TINs' non-assigned patients). Do not change the numbers on the strength of this finding alone. |

---

## MISLABEL

### L1. Measures 001 and 236 under MIPS CQM labeled "historical" although their PY2026 ladders are flat-percentage
*Finding f5 —* **CONFIRMED** *(labels only — every number is correct)*

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:63` (001 `mipscqm`, `caps: [99, 90, 80, 70, 60, 50, 40, 30, 20, 10]`, `kind: "historical"`) and `:75` (236 `mipscqm`, `floors: FLAT`, `kind: "historical"`). Rendered at `:466` ("ladder: {row.bench.kind}") and in the `RealLadder` tooltip at `:417`. |
| **App value** | "ladder: historical" printed beside ten visually identical rungs — `RealLadder` (`:404-429`) sizes rungs by band width, so flat ladders draw as equal rungs. |
| **Authoritative value** | Both are the canonical **flat-percentage** ladders CMS applies to measures with potential to result in inappropriate treatment. |
| **Source** | 42 CFR 414.1380(b)(1)(ii)(C): "Beginning with the 2022 MIPS payment year, for each measure that has a benchmark that CMS determines may have the potential to result in inappropriate treatment, CMS will set benchmarks using a flat percentage for all collection types where the top decile is higher than 90 percent." `https://www.govinfo.gov/content/pkg/CFR-2025-title42-vol3/xml/CFR-2025-title42-vol3-sec414-1380.xml`. Decisive evidence: 001 MIPS CQM = "99.00 - 90.01" … "<= 10.00" and 236 MIPS CQM = "1.00 - 9.99" … ">= 90.00" are **byte-identical across the 2023, 2024, 2025 and 2026 CSVs**, while their eCQM counterparts move every year — impossible for a real percentile distribution. |
| **Root cause** | The CSV's `Benchmark Type` column emits only `Historical` or `--` and **never** `Flat` (distinct values are exactly `{"--","Historical"}` in the 2025 and 2026 files). CMS's own PY2026 memo footnote 1 calls the 112SSP/113SSP Medicare CQM benchmarks "PY 2026 flat benchmarks," yet those exact CSV rows carry `Benchmark Type = Historical`. The app already overrides the CSV at `:82` and `:88` ("flat (finalized for PY26)") but not at `:63`/`:75`. |
| **Consequence** | Contradicts the app's own stated visual convention (`docs/session-notes.md:39-40`: "uniform rungs = flat benchmarks, irregular = historical") and its narrative contrast at `:843-844` between real-data ladders and "the old flat bands." |
| **Suggested fix** | Change both `kind` values to `"flat percentage"` (and 001/236 Medicare Part B Claims if ever modeled), keeping 134 MIPS CQM as `"historical · topped out"`. Add a code comment recording that the CSV's `Benchmark Type` column never reports "Flat" and that flat status must be derived from the ladder pattern. |

### L2. Strong scenario's 7 practice groups is the 25th percentile, documented as 75th-percentile
*Finding f10 —* **CONFIRMED**

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:148` (`tins: 7`); displayed in the Step 1 tag at `:667` ("$330M cost benchmark · 7 practice groups"); footer claim at `:975` ("the strong scenario uses 75th-percentile values … from the same file"); `docs/session-notes.md:86` ("Scenario parameters are named percentiles of these distributions"). |
| **App value** | 7 participant practice groups, labeled a 75th-percentile value. |
| **Authoritative value** | Participant rows per ACO across the 476 reconciled PY2024 ACOs: **p10 2.5 / p25 7 / p50 19 / p75 37.25 / p90 80** (NumPy `method="linear"`). **7 is percentile rank 24.2** — the 25th percentile, off by 5 deciles. The true p75 is 37 (percentile rank 74.5). Among the 122 ACOs with >= 24,000 assigned beneficiaries the median is **41** participants and 7 sits at the **13.9th** percentile (19 of 122 have <= 7). |
| **Source** | PY2024 ACO Participants file `https://data.cms.gov/sites/default/files/2024-01/afc09855-5e4b-4baf-bdc4-88a4459a52e5/PY2024_Medicare_Shared_Savings_Program_Participants.csv` (15,540 rows, 480 ACO ids) joined to the 476 reconciled ACOs in the results PUF (URL as E1). Reproduces `research/mssp-py2024-results.md:72`. |
| **Contrast** | The scenario's other three anchors are exact: 24,000 benes = percentile rank 74.4, $330M = 74.8, +7.0% = 74.2. The practice-group count is the only value that misses. |
| **Suggested fix** | Either raise `tins` to ~37 (the true p75) to match the footer, or keep 7 as a deliberate "integrated health system" choice and amend the footer and session-notes to say the practice-group counts are narrative rather than percentile-derived (real p25/p50/p75 = 7/19/37). If keeping 7, note it is realistic but atypical for this size. **Fix jointly with L3** — the footer sentence misdescribes two of three scenarios. |

### L3. Safety-net scenario's 24 practice groups is the 58th percentile, documented as a 25th/10th-percentile value
*Finding f11 —* **CONFIRMED**

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:162` (`tins: 24`); story at `:159` ("across 24 small independent practices"); footer at `:975-976`, whose preceding clause enumerates "19 participating practice groups" among the median anchors — so practice groups are squarely inside the percentile claim. |
| **App value** | 24 participant practice groups, labeled a 25th/10th-percentile value. |
| **Authoritative value** | **Percentile rank 58.3** — above the median of 19, and 3–5 deciles off the claimed label. Among the 127 ACOs at or below 8,500 assigned beneficiaries it is the 68th percentile. |
| **Structural inversion** | The three scenarios invert the real size-to-participant relationship: the app gives the p25-size ACO 24 groups, the median ACO 19, and the p75-size ACO 7, whereas in the PUF participant counts **rise** with ACO size — median participants by `N_AB` quartile = **16 / 16 / 15 / 41**, Spearman rho = 0.251 (p = 2.9e-8). |
| **Source** | Same join as L2; reproduces `research/mssp-py2024-results.md:72` and `:240-251`. |
| **Contrast** | The scenario's other anchors are fine: 8,000 benes = percentile rank 23.7, -0.5% savings = 9.7 (`Sav_rate` p10 = -0.40), $95M benchmark = 19.1 (between p10 $75.7M and p25 $106.0M). |
| **Suggested fix** | Drop the practice-group counts from the footer's percentile claim, or set them to real percentiles (safety-net p25 = 7, strong p75 = 37). If the narrative intent is "many small independent practices," say so explicitly and note it is a p58 value. |

### L4. 2x2 doc states the MIPS CQM extension as accomplished and indefinite
*Finding f18 —* **CONFIRMED**

| | |
|---|---|
| **App location** | `docs/2x2-ecqm-preference.md:8` — "\| **MIPS CQM** *(sunset reversed, extended indefinitely)* \|", against "**Medicare eCQM** *(proposed, PY 2027+)*" in the row above. |
| **App value** | "sunset reversed, extended indefinitely." |
| **Authoritative value** | Both halves are wrong. The extension is **proposed, not adopted** (comments close 2026-09-14; final rule expected ~November 2026), and it is **not indefinite** — CMS anticipates sunsetting MIPS CQMs beginning **PY 2030** and sunsetting the MIPS CQM reporting incentive at **PY 2028**. |
| **Source** | CMS-1848-P: "we propose to extend the reporting incentive … for PY 2027 and subsequent PYs"; "Subject to future notice and comment rulemaking, we anticipate sunsetting the MIPS CQMs collection type beginning in PY 2030, when FHIR-based reporting becomes mandatory"; "we anticipate sunsetting the MIPS CQM reporting incentive when we introduce the 2-year transition period beginning with PY 2028." 91 FR 44039, 44290; PY 2030 mandatory-FHIR transition table B-G2 at 91 FR 44038. `https://www.federalregister.gov/documents/full_text/text/2026/07/16/2026-14327.txt`. |
| **Why it matters** | The asymmetric phrasing within the same table tells the reader the MIPS CQM extension is settled law while the Medicare eCQM one is not — directly violating the project's own stated posture (`docs/session-notes.md:7-8`: the proposed rule is "treated as a labeled contingency, never as settled law"). |
| **Suggested fix** | "**MIPS CQM** *(sunsets after PY 2026 under current law; CMS-1848-P proposes extension to PY 2027+, anticipated sunset PY 2030 — proposed, not final)*". |

### L5. "In BASIC A–D every clinician is MIPS-subject" / "ALL of its clinicians remain subject to MIPS"
*Finding f32 —* **CONFIRMED**

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:789` (financial-inputs footnote, "Track note:") and `:152` (middle scenario story). |
| **App value** | Two absolutes: "in BASIC A–D every clinician is MIPS-subject" and "ALL of its clinicians remain subject to MIPS — the full Part B base rides on the quality score." |
| **Authoritative value** | Two live exceptions break the absolute. **(1) Low-volume threshold and clinician type:** only MIPS *eligible clinicians* who exceed **all three** low-volume criteria are in MIPS. CMS itself hedges the same population in CMS-1848-P: MIPS eligible clinicians in "BASIC track levels A-D … will still be required to report MIPS Promoting Interoperability … **(unless they are otherwise excluded under MIPS)**." **(2) NPI-level QP leakage, more material for PY2026:** QP status today applies at the NPI level to **all** of a clinician's TIN reassignments regardless of whether that TIN is in an Advanced APM, so a clinician who reaches QP through any other Advanced APM is MIPS-exempt even on billing routed through a BASIC A–D ACO's TIN. |
| **Source** | 42 CFR 414.1305 (low-volume threshold: exceed all three of >$90,000 Part B allowed charges, >200 Part B patients, >200 covered professional services) and MIPS exclusions at 414.1310. CMS-1848-P, verbatim: "we continue to identify misalignment between Advanced APM participation and the incentive structure of QPP, specifically in the application or the QP status to all of an eligible clinician's Tax Identification Number (TIN) reassignments irrespective of whether the TIN in question is participating in an Advanced APM"; and "we are concerned that a significant proportion of incentives paid for QP status will be paid to TINs that are not part of an Advanced APM." Fix proposed at new §§ 414.1425(c)(8) and (d)(5). `https://www.federalregister.gov/documents/full_text/text/2026/07/16/2026-14327.txt`. |
| **Direction error** | The app's parenthetical hedge points the **opposite** way — it frames increasing granularity as the reason the base is a spectrum, when in fact today's *coarser* NPI-level rule is what makes a BASIC A–D ACO's non-QP base less than 100%, and the proposal would **close** that leak. The hedge also does not cover the low-volume threshold at all. |
| **Suggested fix** | "In BASIC A–D, MIPS eligible clinicians are not exempt via that ACO — but some are still QPs through another Advanced APM, and clinicians below the low-volume threshold are out of MIPS entirely, so the non-QP base is high but not 100%." Re-point the parenthetical: today's NPI-level application of QP status is what leaks QP exemption into BASIC A–D TINs; CMS-1848-P would remove that leak beginning with the 2027 QP performance period. |

---

## MISSING

### X1. MIPS CQM sunset after PY2026 never disclosed in the app
*Finding f15 —* **CONFIRMED**

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:727-735` (Step 2 method glossary), `:939-956` ("Sources and limitations"); `docs/session-notes.md:121`. |
| **App value** | "All MIPS CQM" is presented as a co-equal reporting strategy — and is routinely selected by the best-mix search (the middle scenario at default capture 0.85 routes 001 and 236 to MIPS CQM, reproduced by re-running the app's exhaustive 1,024-assignment search). No UI text anywhere states the sunset. A grep of `src/PathwayLab.tsx` for "sunset" / "final year" / "last year" returns **nothing**; the only 2027 references are the Medicare eCQM footnote (`:736`), the submission-date line (`:651`), and the QP-determination aside (`:789`). |
| **Authoritative value** | Under **current law, PY 2026 is the LAST performance year** in which MIPS CQMs may be used for APP Plus. Using them in PY 2027+ depends on the very CMS-1848-P proposal the app flags elsewhere. |
| **Source** | CMS PY2026 memo: "PY 2026 is the last year ACOs will have the option to report MIPS CQMs as part of the APP Plus quality measure set" (URL as E3). 42 CFR 425.512(a)(2)(iv) and (a)(5)(i)(C)(2) are keyed to eCQMs/Medicare CQMs only for PY2027+; (a)(5)(iii)(C) likewise names only "eCQMs/Medicare CQMs." `https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-425/subpart-F/section-425.512`. CY2027 proposed rule confirms MIPS CQMs "would no longer be available under the policy finalized in the CY 2025 PFS final rule (89 FR 98123)" absent the proposed extension. |
| **Why asymmetric** | Every *other* proposed-rule-contingent element **is** flagged (Medicare eCQM carries a "*"; the flat-benchmark proposal has its own toggle), so the omission reads as "MIPS CQM is settled." Worse, `docs/session-notes.md:121` lists "PY2026 is the final year for MIPS CQMs unless the proposed extension finalizes" under "Key regulatory facts the artifacts encode" — so the documentation's own claim is false — and `docs/2x2-ecqm-preference.md:8` states the opposite (see L4). |
| **Mitigation** | The app is scoped to PY2026, where MIPS CQM is fully legal, so **no in-scope number is wrong**. This is a disclosure gap, not a computational error. |
| **Suggested fix** | Add a marker to the MIPS CQM button and glossary parallel to the Medicare eCQM "*": "MIPS CQM (dagger) = chart review / registry, all patients — scheduled to sunset after PY2026 under current law; CMS-1848-P proposes extending it to PY2027+ (not final)." Repeat it in the Sources-and-limitations paragraph. |

### X2. No minimum savings rate gate before shared savings are paid
*Finding f28 —* **CONFIRMED**

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:269-279` (`settle`), specifically `:273` (`const savings$ = gross > 0 ? (sharePct / 100) * gross : 0`). Spending slider at `:795` runs min -3 to max +12. |
| **App value** | A share of **any** positive gross result is paid. There is no MSR anywhere in the module. |
| **Authoritative value** | An ACO must beat its **minimum savings rate** before any shared savings are payable. At the app's scenario sizes the real one-sided BASIC MSR is roughly **3.17%** near 8,238 beneficiaries, **2.81%** near 13,151, and **2.46%** near 24,494 — so the app pays full-rate shared savings across roughly the **first fifth of its slider range** where a real ACO of these sizes gets nothing. Qualifying low-revenue ACOs with >= 5,000 beneficiaries instead get **one-half** the otherwise applicable rate. |
| **Source** | 42 CFR 425.605(a)(6): "In order to qualify for a shared savings payment, the ACO's average per capita Medicare Parts A and B fee-for-service expenditures for the performance year must be below the applicable updated benchmark **by at least the minimum savings rate** established for the ACO under paragraph (b) of this section except as provided in paragraph (h)." (b)(1) sets the sliding scale by assigned beneficiary count; (h)(1)-(2) sets the half-rate branch. eCFR 2026-08-05 issue (URL as E1). Magnitudes computed from the PY2024 PUF `MinSavPerc` for one-sided BASIC ACOs (A n=54, B n=103); the half-rate branch is visible as `FinalShareRate` = 20.0 for 12 ACOs and 25.0 for 1. |
| **Undisclosed** | MSR appears nowhere in `docs/session-notes.md` Known simplifications (`:136-148`) nor in the in-app sources paragraph (`:962-979`), and `src/PathwayLab.tsx:955-956` claims the model is "a complete model of the ACO-level settlement." |
| **Suggested fix** | Add an MSR to the scenario profile (sliding scale by assigned beneficiaries for one-sided BASIC; ACO-selected 0–2% for two-sided) and zero out savings below it, or show the half-rate 425.605(h) branch for the low-revenue safety-net scenario. At minimum add the omission to the documented simplifications, since it changes whether the headline dollar figure exists at all in the lower half of the slider's range. |

### X3. § 425.512(a)(7)(ii)(B) 40th-percentile score floor is not modeled — UNSETTLED
*Findings f2 / f23 —* **UNCERTAIN — the rule and constants verify, but the PY2026 trigger does not. Do not implement without resolving.**

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:224-250` (`runMachine` — `q` computed with no floor), `:248` (status), `:269-279` (`settle`). |
| **App value** | No floor mechanism at all. The three scenarios produce q = **70.0 / 60.0 / 48.8** (all-eCQM, capture 0.85) and those numbers drive MET/ALT/FAILED, the ALT sharing-rate scaling, the loss curve, and the clinician rail. |
| **Claimed authoritative value** | For PY2026, an ACO that reports all required APP Plus measures at 75% data completeness **and** has at least one required measure with no benchmark is scored at the **higher** of its own quality score or the 40th-percentile-equivalent MIPS quality score — **73.85** for PY2026. If the trigger fires, an ACO routing 112/113 to eCQM/MIPS CQM is held harmless at 73.85 rather than losing points, which **inverts** the app's story. |
| **What verifies** | The rule text is exact — 42 CFR 425.512(a)(7)(ii)(B): "CMS will use the higher of the ACO's health equity adjusted quality performance score or the equivalent of the 40th percentile MIPS Quality performance category score … when … (B) At least one of the required measures in the APP Plus quality measure set does not have a benchmark as described at § 414.1380(b)(1)(i)(A)." (`https://www.govinfo.gov/content/pkg/CFR-2025-title42-vol3/xml/CFR-2025-title42-vol3-sec425-512.xml`; the eCFR API returned HTTP 503 on repeated attempts.) The **73.85** constant verifies verbatim in the CMS PY2026 memo p.3, with its derivation 77.73 + 74.54 + 69.27 = 221.54 / 3 = 73.85 (URL as E3). The floor is a **real applied mechanism**: the PY2024 PUF carries a `Recvd40p` column flagged for 35 of 476 ACOs, every one scored at exactly 77.05 (the PY2024 40th-percentile value). And it is genuinely absent from the app, from Known simplifications, and from `docs/scoring-calculation-spec.md` Stage D/E. |
| **What does NOT verify** | The load-bearing predicate — that the (ii)(B) trigger actually **fires for PY2026** because 112/113 lack eCQM/MIPS CQM benchmarks. (a)(7)(ii)(B) points to 414.1380(b)(1)(i)(A) ("Lack of benchmark or case minimum"), and 414.1380(b)(1)(ii) expressly permits benchmarks "during the applicable baseline **or performance period**"; the 2023 and 2024 QPP files in fact carry a `Performance Period` Benchmark Type for 88 and 85 rows respectively. So a missing **pre-year historical** benchmark is not the same as having **no benchmark at scoring**. The app takes exactly that position (`src/PathwayLab.tsx:56-58`: "CMS sets a performance-period benchmark AFTER submission"; footer `:964-965`). Cutting the same way: CMS's own July 2026 preamble states "none of the eCQMs, MIPS CQMs, or Medicare CQMs that Shared Savings Program ACOs have reported over the past four PYs lacked benchmarks," and the December 2025 PY2026 memo lists three QPS pathways with **no floor among them** and promises CY2027 performance-period benchmarks only "for the administrative claims-based measures." The project's own `research/mssp-scoring-rules.md` caveat 4 flags the same unresolved reading. |
| **Suggested action** | **Do not implement the floor unilaterally.** Either (a) resolve the predicate by submitting a comment / seeking CMS clarification and record the answer, or (b) model both branches behind a labeled toggle, or (c) add the ambiguity itself to Known simplifications, stating that if the trigger fires the affected ACOs are floored at 73.85 rather than losing points. Note that CMS-1848-P proposes to delete this trigger for PY2027+, so it is a PY2026-only question. If a floor is ever added, the QPS constant would also need to move from the illustrative 55 to the published 73.85 — the app cannot show a floor while its threshold is a stand-in. |

### X4. Footnote treats QP status as dollar-neutral, omitting PY2026 QP upside — UNSETTLED as a defect
*Finding f36 —* **UNCERTAIN — the regulatory facts verify, but the app may not have the claimed defect**

| | |
|---|---|
| **App location** | `src/PathwayLab.tsx:900-902` (TIN roster footnote) and `:789` ("Track note:"). |
| **App value** | The fee adjustment "only affects clinicians below 'Qualified APM Participant' thresholds; clinicians above them are exempt from MIPS entirely, which is why the slider is labeled non-QP billing." |
| **Authoritative facts (verified)** | For PY2026, QPs receive a **3.1% lump-sum APM Incentive Payment** in payment year 2028 **plus** a qualifying conversion factor **1.00% above** the nonqualifying one — together larger than the MIPS channel's realistic upside. CMS-1848-P verbatim: "The Consolidated Appropriations Act, 2026, now has provided for a 3.1 percent APM Incentive Payment in payment year 2028. Accordingly, we are proposing to codify this extension for 2028 into Secs. 414.1450(a)(1)(i) and (b)(1)"; and "We estimate the CY 2027 PFS qualifying APM CF to be 33.1693 … We estimate the CY 2027 PFS nonqualifying APM CF to be 32.8409" — a $0.3284 gap, exactly 1.00%. `https://www.federalregister.gov/documents/full_text/text/2026/07/16/2026-14327.txt`. |
| **Why UNCERTAIN** | The quoted footnote is **accurate**, and its subject is why the slider is labeled non-QP billing — it never asserts QP billing is inert. The clinician channel is **off by default** (`:565` `clinOn = false`) and is explicitly declared out of default scope at `:952-961` and in `docs/session-notes.md:124-134`. The real residue is a modeling **asymmetry** visible only when the optional channel is enabled: QP billing then contributes exactly $0 to net$ while non-QP billing at a good score contributes positively. That is an editorial completeness judgment, not a value conflicting with an authoritative source. The comparison's other leg (PY2024 observed MIPS upside — median +0.80%, max +1.05%) was **not independently re-fetched** during verification. |
| **Suggested action** | Optional one-clause addition, framed as enrichment rather than correction: "QP billing is not neutral — for PY2026 QPs earn a 3.1% lump-sum APM Incentive Payment (paid on CY2027 claims) plus a conversion factor ~1.00% above the nonqualifying one, both larger than the MIPS channel's ~+1% ceiling. The 3.1% is CAA-2026 statutory; the codifying regulation is proposed." |

---

## NOTE

### N1. File header comment still says PY2025 cutpoints
*Finding f7 —* **CONFIRMED** *(code comment; not user-facing)*

- **App location:** `src/PathwayLab.tsx:6-8` and `:12`.
- **App value:** "now wired to REAL PY2025 QPP benchmark decile cutpoints (qpp.cms.gov benchmarks file)" and "Medicare CQM = flat 10-pt bands."
- **Authoritative value:** The `BENCH` table below it is **PY2026**, verified cell-by-cell (see N5), and Medicare CQM for 001/134/236 is **no longer flat** in PY2026 — e.g. 134 Medicare CQM is 11.44–32.50 … >= 92.34, avg 62.87. The second block comment at `:54` correctly says PY2026, so the file contradicts itself.
- **Source:** `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2026` (MD5 `3c4ba299ad2f604f7852b3b9c5433400`); the four `est` cells match `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2025` (MD5 `68ef0db5b83df38b34479ef4be228ff3`).
- **Suggested fix:** Update the header to PY2026 and drop "Medicare CQM = flat 10-pt bands" (true only for 112/113, or for 001/134/236 under the proposed-rule toggle).

### N2. Deeming explanation says three conditions; the panel and the rule have four
*Finding f29 —* **CONFIRMED**

- **App location:** caption at `src/PathwayLab.tsx:872` vs. the four `StatusLamp` elements at `:859-862`.
- **App value:** "All three lights are on, so CMS counts the standard as met automatically…"
- **Authoritative value:** **Four.** The panel renders four lamps (all-patient collection type; data completeness on every measure; >= 10th percentile on an outcome measure; >= 40th percentile on another measure), the engine computes `deemed = allFull && allGates && outcomeOK && otherOK` (`:247`), and 42 CFR 425.512(a)(5)(i)(B)(2) joins exactly four conditions with "and."
- **Source:** `https://www.govinfo.gov/content/pkg/CFR-2025-title42-vol3/xml/CFR-2025-title42-vol3-sec425-512.xml`.
- **Suggested fix:** Change "All three lights" to "All four lights", or render the count from the lamp array so it cannot drift.

### N3. "The median real 2024 ACO" is placed in a track held by 21.6% of PY2024 and 12.9% of PY2026 ACOs
*Finding f14 —* **CONFIRMED**

- **App location:** `src/PathwayLab.tsx:152` (middle story); `docs/session-notes.md:74-75` ("the middle scenario is literally the median 2024 ACO" — unqualified).
- **App value:** "A regional ACO built to match the median real 2024 ACO… It's in BASIC Level B (not an Advanced APM), so ALL of its clinicians remain subject to MIPS."
- **Authoritative value:** The four **numeric** anchors are exactly median — 13,000 benes = percentile rank 49.6 (median 13,151), $177M = 50.0 (median $177.3M), +4.2% = 49.6 (median 4.215), 19 TINs = 50.4. The **track** is not: BASIC Level B is held by **103/476 = 21.6%** of PY2024 ACOs and **66/511 = 12.9%** of the PY2026 cohort the app models. 67.0% of PY2024 and 76.3% of PY2026 ACOs are two-sided; ENHANCED is the plurality (43.1% / 57.9%). Two of three scenarios are one-sided, a group that is 23.7% of PY2026 ACOs.
- **Source:** PY2024 results PUF `Current_Track` (EN 205, E 104, B 103, A 54, C 5, D 5; one-sided = A+B per 42 CFR 425.600(a)(4)(i)(A)) and `https://data.cms.gov/sites/default/files/2026-01/453bc69c-61a4-4030-8d03-e33895fd1cfd/PY2026_Medicare_Shared_Savings_Program_Participants.csv` (511 ACOs: ENHANCED 296, E 82, B 66, A 55, C 9, D 3).
- **Why it matters:** The track choice is what makes the 100%-MIPS Part B premise operate, and (incorrectly, per E1) the 75% sharing rate.
- **Suggested fix:** Soften to "median on size, benchmark, participant count, and savings rate; its BASIC Level B track is chosen to illustrate full MIPS exposure and is held by ~22% of PY2024 (13% of PY2026) ACOs." **Fixing E1 is the prerequisite** for the track label to be meaningful.

### N4. "TIN/NPI-level determination" should be "application of QP status at TIN/NPI level"
*Finding f37 —* **CONFIRMED** *(low-stakes wording)*

- **App location:** `src/PathwayLab.tsx:789` parenthetical.
- **App value:** "TIN/NPI-level determination is proposed for 2027."
- **Authoritative value:** The **year is right**, but nothing about how QP status is *determined* changes — determinations stay at the APM Entity level and (since PY2026) the individual NPI level. What CMS proposes is to limit where an already-determined QP status **applies**. The 2026 half of the parenthetical is correct: 42 CFR 414.1425(c)(3)(ii), "Beginning with the CY 2026 QP Performance Period, the eligible clinician individually, or as part of an APM Entity group, achieves a Threshold Score…"
- **Source:** Proposed 42 CFR 414.1425(c)(8): "Beginning in the 2027 QP Performance Period, application of QP determination is limited strictly to eligible clinicians as defined at Sec. 414.1305…"; preamble: "QP status and Partial QP status would therefore only apply to the clinician at the TIN that is participating with the APM Entity in the Advanced APM." `https://www.federalregister.gov/documents/full_text/text/2026/07/16/2026-14327.txt`. Confirmed that 414.1430 is amended **only** to change threshold percentages, not the level at which threshold scores are computed.
- **Mitigations:** CMS's own section heading is "Applying QP Determinations at the TIN/NPI Level" and its preamble says "assigning QP status at the TIN/NPI level," so the app's shorthand is close to CMS's own; the app also labels it a proposal and draws the correct practical conclusion.
- **Suggested fix:** "…and CMS has proposed that, beginning with the 2027 QP performance period, QP status would apply only at the TINs participating in the Advanced APM (proposed, not final)."

### N5. NO DEFECT — every cutpoint, average, cap and topped-out flag in `BENCH` is exact
*Finding f8 —* **CONFIRMED (affirmative verification)**

- **App location:** `src/PathwayLab.tsx:59-91` (`FLAT` + `BENCH`).
- **Result:** Independent re-fetch and programmatic diff found **zero numeric discrepancies**. All nine benchmarked PY2026 cells reproduce the published entry bounds exactly, including the **inverse orientation for 001** (caps 99.49 / 93.98 / 71.68 / 49.53 / 36.72 / 29.53 / 24.85 / 20.86 / 17.18 / 12.50 from "99.49 - 93.99" … "<= 12.50") and the **collapsed deciles for 134 MIPS CQM** (`[0.07, 40.34, 76.30, 94.01, 98.97, 99.82, null, null, null, 100]` from D7–D9 = "--", D10 = 100.00). All nine `avg` values match `Average Performance Rate` (40.91 / 23.12 / 25.78 / 45.55 / 85.58 / 62.87 / 66.06 / 68.71 / 67.87). `cap: 7 / topped: true` appears on **exactly** the one modeled cell CMS flags (134 MIPS CQM, Topped Out = Yes, Seven Point Cap = Yes). `est: true` appears on **exactly** the four modeled cells with `Measure has a Benchmark = No`, and all four arrays reproduce the PY2025 file digit-for-digit. The Medicare eCQM cells' flat ladders are consistent with the proposed rule, and the app correctly matches **both** of that collection type's exclusions — `CT.medecqm` has `fullPop: false` at `:37` so it breaks the deeming lamp, and the Complex Organization Adjustment is gated on `pathway === "ecqm"` at `:230`.
- **Source:** `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2026` (MD5 `3c4ba299ad2f604f7852b3b9c5433400`) and `/2025` (MD5 `68ef0db5b83df38b34479ef4be228ff3`), both re-fetched 2026-08-07. Medicare eCQM exclusions per the CY2027 fact sheet: "ACOs that choose to report Medicare eCQMs would not be eligible for the eCQM/MIPS reporting incentive or the Complex Organization Adjustment" — `https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2027-medicare-physician-fee-schedule-proposed-rule-cms-1848-p-medicare-shared`.
- **Scope:** This note is about **numbers only** and does not conflict with L1, which concerns the `kind` label.
- **Optional improvement:** Record the CSV MD5s and retrieval date next to the `BENCH` table so a future refresh can be diffed — the endpoint carries no ETag or Last-Modified, and **HEAD returns 404 while GET returns 200**, so liveness checks must use GET.

### N6. NO DEFECT — track facts and the 2026 individual-level QP claim check out
*Finding f38 —* **CONFIRMED (affirmative verification)**

- **App location:** `src/PathwayLab.tsx:145`, `:152`, `:159`, `:789`.
- **Result:** (1) "It's in the ENHANCED track (an Advanced APM), so nearly all its clinicians are Qualified APM Participants — exempt from MIPS" is correct on both halves. (2) "BASIC Level B (not an Advanced APM)" is correct as a track fact. (3) "in BASIC Level A, actual loss repayment wouldn't apply" is correct. (4) "individual-level determinations began in 2026" is correct **and was finalized, not proposed**. (5) The $15M non-QP base at 24k beneficiaries (~14% of assigned-beneficiary Part B spend, implying ~86% of Part B dollars from QPs) and the $60M base at 13k (~100%, a fully non-QP BASIC ACO) are both defensible given their track labels.
- **Source:** CMS-1848-P RIA list of Advanced APMs for the 2027 QP performance period: "Medicare Shared Savings Program (Level E of the BASIC Track and the ENHANCED Track)"; "We also finalized our proposal to add a QP determination at the individual level for all Advanced APM participants, beginning with the 2026 QP Performance Period" (finalized in the CY2026 PFS final rule, 90 FR 49266). 42 CFR 425.600(a)(4)(i)(A): Level A "operates under a one-sided model." QP-rate proxy: **463,669 QPs of 505,210 Advanced APM participants = 91.8%** — 2023 QPP Participation and Performance Results At-A-Glance, `https://qpp-cm-prod-content.s3.amazonaws.com/uploads/3238/2023-QPP-Results-At-A-Glance.pdf`.
- **Scope:** This note does **not** defend the "every clinician is MIPS-subject" absolute, which L5 separately and correctly flags.
- **Optional improvement:** Cite the ~92% program-wide QP rate in the footnote so "nearly all" and the 14% non-QP base are anchored to a published number (CMS publishes no MSSP-specific QP rate).

---

## Refuted candidates

These were raised during the sweep and **refuted** on verification. They are recorded so they are not re-opened.

1. *"No-benchmark cells are scored from PY2025 ladders; CMS scores them 0"* — refuted: 42 CFR 414.1367(c)(1)(i) **excludes** them from numerator and denominator (that is E5), the opposite of the claimed 0-of-80 treatment; the proposed fix would have introduced a new error. (Its secondary sub-claim — that the "performance-period benchmark set after submission" narrative is unsupported for clinical measures — remains live inside X3.)
2. *"Quality performance standard set to 55 when CMS published 73.85"* — refuted: the value is doubly labeled as illustrative (`:864` `flagLabel="40th pctile (illus. 55)"`, `:970`, `session-notes.md:142`), and the premise that app-`q` shares the real 0–100 scale is contradicted by the app's own docs; a scale-preserving equivalent of 73.85 is ~42 in app units, so 55 is **stricter**, not laxer.
3. *"Proposed-rule toggle described as covering all Medicare CQMs in PY2026"* — refuted: the checkbox text (`:805-809`) names exactly measures 001, 134, 236 and dates the change to 2026; no number changes.
4. *"'Apply pending proposed rule' toggle labeled as the whole rule"* — refuted: the label (`:802-811`) is followed by a colon naming the exact provision and a bolded scope limit; the suggested fix is already implemented, and the Medicare eCQM half is disclosed four separate ways.
5. *"80-point denominator assumed for the PY2027-only Medicare eCQM pathway"* — refuted: `AVAILABLE = 80` is correct for PY2026 (the app's declared scope) **and** for PY2027 under the same proposed rule the Medicare eCQM cell already depends on.
6. *"Middle scenario billed as the median ACO but assigned to a minority track"* — refuted **as filed** (the "median" claim attaches to an enumerated list of three verified medians, and the track drives neither sharing rate nor Part B base in this codebase); the residual documentation issue is captured as N3.
7. *"Stated anchor for the non-QP Part B base does not describe the numbers actually used"* — refuted: the finding divides by assigned-beneficiary spend, which is not the app's stated denominator; the track-driven explanation the finding calls "unstated" is at `:789` and `:145`.
8. *"Safety-net non-QP Part B base sits at ~94% of the bottom-up ceiling"* — refuted: the top-down "ceiling" is invalid on the app's own definition of the input, the value is a labeled assumption in an off-by-default channel, and the per-beneficiary difference the finding calls unexplained is stated at `:145`.
