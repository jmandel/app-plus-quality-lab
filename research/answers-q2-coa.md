# Answers — Question 2: the Complex Organization Adjustment (COA) and excluded measures

**Prepared:** 2026-08-08. All retrievals 2026-08-08 unless noted.
**Scope:** Q2 and sub-questions 2.1–2.5 of `open-questions-benchmarkless-measures.md`.
**Frame:** MSSP ACOs reporting APP Plus for PY2026, scored in 2027.

---

## Bottom line

| # | Question | Answer | Confidence |
|---|---|---|---|
| **Q2** | Does an eCQM excluded under § 414.1367(c)(1)(i) for lack of a benchmark still generate a COA point? | **Not resolved by the public record.** No CFR text, preamble, scoring guide, or CMS memo addresses it. On the balance of the regulatory text and CMS's operational guides, the point **does** accrue. | **Moderate (~65% for accrual).** Label: *genuinely unaddressed*. |
| **2.1** | Any CMS text on COA + excluded / benchmark-less / case-min-failing measures? | **No.** Explicit negative finding across nine documents (lists below), including CMS's own APP scoring guide, which states the exclusion rule and the COA rule **on different pages of the same PDF and never reconciles them.** CMS *does* address case-minimum failure — by making it a condition of the COA — but never addresses the benchmark case. | High (negative finding) |
| **2.2** | Per-measure or pooled? | **Both, and the distinction does *not* decide Q2.** CMS says the adjustment is "added for each eCQM submitted **at the individual measure level**" and "by adding points to **specific measures**" — but the codified formula adds it to the numerator as a **separate addend**, listed after (and therefore outside) "the measure achievement points assigned for the measures." Per-measure attribution exists to administer the two ceilings, not to gate accrual on the measure being scored. | High on the facts; moderate on the reconciliation |
| **2.3** | Is the 10% cap on available points **before or after** exclusions? | **After.** With 112 and 113 excluded the cap is **6 points, not 8.** Direct CMS statement plus the fact that the cap's denominator is the same defined term § 414.1367(c)(1)(i) reduces. | **High** |
| **2.4** | "5 measures (5 points)" in PY2026 — submitted or scored? | **Submitted** (specifically: submitted as eCQMs, meeting case minimum and data completeness). It is a ceiling derived from the size of the PY2026 APP Plus measure set, not a count of scored measures. It is silent on benchmarks and is *not* evidence either way on Q2. | High |
| **2.5** | Is the § 425.512(a)(7)(ii)(B) floor compared before or after COA? | **After.** The COA is inside the MIPS quality performance category score; the floor takes the higher of that score and 73.85. **Consequence: if the floor fires, the COA is worth nothing to any ACO whose post-COA score is below 73.85.** | **High** |

### The practical number

For a PY2026 ACO routing all five ACO-reported measures to eCQM, with 112 and 113 excluded for lack of a benchmark (denominator 60):

| | COA points | Score effect |
|---|---|---|
| COA accrues on excluded eCQMs | 5 | **+8.33 pp** |
| COA dies with exclusion | 3 | **+5.00 pp** |
| **Spread** | 2 | **3.33 pp** |

The 10% cap (6 points) does not bind in either case. It would bind only if the denominator fell below 50 — i.e. four or more of the eight PY2026 measures excluded.

**But see 2.5:** if § 425.512(a)(7)(ii)(B) fires for PY2026 (it is triggered by exactly this fact pattern — "at least one of the required measures … does not have a benchmark"), the ACO receives the higher of its score or **73.85**, and the entire 3.33 pp spread is invisible unless the ACO is already above 73.85. **Q2 is materially moot for any ACO below the floor.** This is the single most important interaction and it is not reflected in the brief's framing.

---

## Sources retrieved

| # | Source | URL | Notes |
|---|---|---|---|
| A | 42 CFR § 414.1380 (current) | `https://www.ecfr.gov/api/versioner/v1/full/2026-08-06/title-42.xml?part=414&section=414.1380` | eCFR Versioner API. **Title 42's most recent issue date is 2026-08-06**; the API returns HTTP 404 with an explanatory JSON body for 2026-08-07 or later. Human-readable: `https://www.ecfr.gov/current/title-42/section-414.1380` |
| B | 42 CFR § 414.1367 (current) | `…?part=414&section=414.1367` | same API/date |
| C | 42 CFR § 414.1340 (current) | `…?part=414&section=414.1340` | same |
| D | 42 CFR § 425.512 (current) | `…?part=425&section=425.512` | same |
| E | CY2025 PFS **final** rule (CMS-1807-F), 89 FR 97710, 2024-12-09, FR Doc 2024-25382 | `https://www.federalregister.gov/documents/full_text/text/2024/12/09/2024-25382.txt` | md5 `d5550bd02785fa36efd6e11ee411e86c`. Use `grep -a`. |
| F | CY2026 PFS **final** rule (CMS-1832-F), 90 FR 49266, 2025-11-05, FR Doc 2025-19787 | `https://www.federalregister.gov/documents/full_text/text/2025/11/05/2025-19787.txt` | md5 `8e7986222e2ce1df94a957f2feeb7562` |
| G | CY2027 PFS **proposed** rule (CMS-1848-P), 91 FR 43842, 2026-07-16, FR Doc 2026-14327 | `https://www.federalregister.gov/documents/full_text/text/2026/07/16/2026-14327.txt` | md5 `ee130914e57734824424214240b2796b` |
| H | CY2025 PFS **proposed** rule (CMS-1807-P), 89 FR 61596, 2024-07-31, FR Doc 2024-14828 | `https://www.federalregister.gov/documents/full_text/text/2024/07/31/2024-14828.txt` | md5 `e6d889daca67af4546630fe1eda75ca3` |
| I | CMS PY2026 Quality Performance Standard / 40th-percentile memo, December 2025 | `https://www.cms.gov/files/document/medicare-shared-savings-program-quality-performance-standard-performance-year-2026-40th-percentile.pdf` | 4 pp. Requires a browser User-Agent (cms.gov 403s plain curl). |
| J | QPP quality benchmark CSVs, PY2023–PY2026 | `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/<year>` | md5: 2023 `1cf2032c…`, 2024 `c1616da5…`, 2025 `68ef0db5b83df38b34479ef4be228ff3`, 2026 `3c4ba299ad2f604f7852b3b9c5433400`. The 2025 and 2026 checksums **match those already recorded in the brief**, independently re-fetched. |
| K | 2026 Traditional MIPS Scoring Guide (pub. 2026-04-08) | `https://d2g5m5leph8kam.cloudfront.net/s3fs/s3fs-public/2026-04/2026-Traditional-MIPS-Scoring-Guide.pdf?VersionId=nk2MYLLH2IFx_8s4wtIhW_EhXre5UHYh` | Canonical link taken from the QPP resource-library index. Requires a browser User-Agent. |
| L | PY 2025 APM Performance Pathway (APP) Toolkit (pub. 2025-05-06) — 4 PDFs incl. the Scoring Guide | `https://qpp-cm-prod-content.s3.amazonaws.com/uploads/3244/2025%20APP%20Toolkit.zip` | The most recent APP-specific scoring guidance in existence. **No PY2026 equivalent has been published.** |
| M | QPP resource-library index (687 resources) | `https://qpp.cms.gov/api/frontend/resource-library` | The only working QPP frontend endpoints are `resource-library`, `glossary`, `webinars`. There is **no public QPP FAQ API**; `qpp.cms.gov` HTML pages are an Angular SPA and are not server-rendered, so they cannot be mined for text. |

---

## The three texts that do the work

### 1. The formula — § 414.1380(b)(1)(vii) (source A; reg text at **89 FR 98563**)

> "**Quality performance category score.** A MIPS eligible clinician's quality performance category score is the sum of all the measure achievement points assigned for the measures required for the quality performance category criteria **plus** the measure bonus points in paragraph (b)(1)(v) of this section **and Complex Organization Adjustment in paragraph (b)(1)(vii)(C)** of this section. The sum is divided by the sum of total available measure achievement points. The improvement percent score in paragraph (b)(1)(vi) of this section is added to that result. The quality performance category score cannot exceed 100 percentage points."

So:

```
                Σ(measure achievement points)  +  measure bonus points  +  COA
QPC score  =    ───────────────────────────────────────────────────────────────   +  improvement %
                          total available measure achievement points
```

The COA is a **third addend**, named separately from "the measure achievement points assigned for the measures." It is therefore **not part of** "total measure achievement points."

Corroborated by § 414.1380(b)(1)(vi)(D) (source A), which defines the term:

> "'quality performance category achievement percent score' means the **total measure achievement points divided by the total available measure achievement points**, without consideration of measure bonus points or improvement percent score."

*Explicit observation, not inference:* that definition names measure bonus points and the improvement percent score but **not** the COA. It was written before the COA existed (the COA was added by the CY2025 final rule, 89 FR 98563) and was not amended to mention it. I draw no conclusion about intent from that silence; I note only that "total measure achievement points" is unambiguously the bare measure-level sum, exclusive of the added terms.

### 2. The COA — § 414.1380(b)(1)(vii)(C) (source A; **89 FR 98563**)

> "Beginning in the CY 2025 performance period/2027 MIPS payment year, a Virtual Group and an APM Entity receives one measure achievement point for each **eCQM submitted** that meets the **case minimum requirement** at paragraph (b)(1)(iii) of this section and the **data completeness requirement** at § 414.1340. Each measure may not exceed 10 measure achievement points. The total adjustment to the Virtual Group or APM Entity's quality performance category score under this paragraph (b)(1)(vii)(C) may not exceed 10 percent of the total available measure achievement points."

**Two conditions. No benchmark condition.** Compare § 414.1380(b)(1)(i), six paragraphs earlier, which conditions ordinary achievement points on a measure that

> "**has a benchmark at paragraph (b)(1)(ii) of this section**, meets the case minimum requirement at paragraph (b)(1)(iii) of this section, and meets the data completeness requirement at § 414.1340…"

CMS used a **three**-part test for achievement points and a **two**-part test for the COA, in the same subsection, in the same rulemaking. That omission is the strongest single textual argument that the COA does not depend on a benchmark.

### 3. The exclusion — § 414.1367(c)(1) (source B)

> "**Except as provided in paragraphs (c)(1)(i) and (ii) of this section**, the quality performance category score is calculated for a MIPS eligible clinician, group, or APM Entity group **in accordance with § 414.1380(b)(1)** …
> (i) Each submitted measure that does not have a benchmark or meet the case minimum requirement is excluded from the MIPS eligible clinician, group, or APM Entity group's **total measure achievement points and total available measure achievement points**."

Two structural facts follow:

1. **§ 414.1380(b)(1)(vii)(C) applies in full inside the APP** — the chapeau incorporates all of § 414.1380(b)(1), carving out only (c)(1)(i) and (c)(1)(ii). Nothing displaces the COA.
2. **The carve-out names exactly two quantities**, and the COA is neither of them. On a strict reading, (c)(1)(i) removes the measure's own achievement points from the numerator and its 10 available points from the denominator, and leaves the COA addend untouched.

---

## Q2 — Does the COA accrue on an excluded eCQM?

### Answer

**Genuinely unaddressed by the public record.** No CMS document states a rule either way. The best reading of the text is that the point **accrues**, but this is a construction of ambiguous text, not a finding of law, and CMS's implementation could plainly go the other way. **~60–65% for accrual.**

### Evidence FOR accrual

**(a) The COA's condition list omits the benchmark requirement** — see §2 above. `expressio unius`. Current law.

**(b) CMS says "submitted," never "scored," in every single formulation across four rulemaking documents:**

| Document | Page | Words |
|---|---|---|
| CY2025 final, MSSP section | 89 FR 98116 | "one measure achievement point for each **submitted** eCQM"; "The adjustment would be added for each measure **submitted** at the individual measure level." |
| CY2025 final, MSSP section (finalizing) | 89 FR 98117 | "one measure achievement point for each **submitted** eCQM … The adjustment will be added for each measure **submitted** at the individual measure level." |
| CY2025 final, MIPS section | 89 FR 98437 | "1 measure achievement point for each **submitted** eCQM"; "The adjustment would be added for each eCQM measure **submitted** at the individual measure level." |
| CY2025 final, regulation text | 89 FR 98563 | "one measure achievement point for each eCQM **submitted**" |
| CY2026 final | 90 FR 49803 | "one measure achievement point for each **submitted** eCQM … The adjustment will be added for each eCQM **submitted** at the individual measure level." |
| CY2026 final, PY2024 simulation | 90 FR 49808 | "18 ACOs would have been eligible to receive the Complex Organization Adjustment because these ACOs **submitted** at least one eCQM"; "the eight ACOs that **did not submit** at least one eCQM … would not have been eligible" |
| CY2027 proposed (July 2026) | 91 FR 44045 | "under the Complex Organization Adjustment, Shared Savings Program ACOs may receive one measure achievement point for each **submitted** eCQM that meets case minimum and data completeness requirements." |
| **2026 Traditional MIPS Scoring Guide** (source K, p. 20) | — | "We'll add one measure achievement point for each eCQM **submitted** for an APM Entity or virtual group that meets data completeness and case minimum requirements." |
| **2025 APP Toolkit Scoring Guide**, Appendix C (source L, p. 87) | — | "One measure achievement point is added for each **submitted** eCQM for an APM Entity or virtual group that meets data completeness and case minimum requirements." |
| **PY 2025 APP Quality Requirements (SSP ACOs Only)** | — | "One measure achievement point is added for each eCQM **submitted** when the APM Entity meets data completeness and case minimum requirements." |

This is consistent to the point of being a term of art: **ten independent formulations across six documents, spanning rule text, preamble, and operational guidance, and every one says "submitted" or "reported" — never "scored."** Every one names exactly two conditions. None mentions a benchmark. CMS's own operational eligibility test in the PY2024 simulation is literally "**submitted** at least one eCQM."

One eligibility restriction worth recording, from the 2025 APP Toolkit Fact Sheet (source L): *"Shared Savings Program ACOs are eligible to receive the complex organization adjustment **only when reporting eCQMs in the APP Plus quality measure set**."*

**(c) The COA sits outside "total measure achievement points."** § 414.1367(c)(1)(i) excludes the measure from that quantity and from total available points. The COA is a separate addend under § 414.1380(b)(1)(vii). The carve-out does not reach it.

**(d) The nearest structural analogue expressly survives non-inclusion.** § 414.1380(b)(1)(v) chapeau (source A):

> "MIPS eligible clinicians receive measure bonus points for the following measures … **regardless of whether the measure is included in the MIPS eligible clinician's total measure achievement points**."

Measure bonus points are the other addend in the same numerator, and the Program's design has long tolerated a per-measure bonus riding on a measure that contributes nothing to total measure achievement points. (The COA's direct ancestor is the end-to-end electronic reporting bonus at § 414.1380(b)(1)(v)(B) — CMS says so at 89 FR 98437: "This adjustment differs from the previous end-to-end electronic reporting bonus in that it does not merely award measure achievement points for reporting but provides an adjustment for clinicians facing complex organizational barriers…")

**(e) Under traditional MIPS the question cannot even arise, which explains the drafting.** For a Virtual Group — the other beneficiary of (b)(1)(vii)(C) — a benchmark-less measure is **not** excluded; § 414.1380(b)(1)(i)(A)(*1*) gives it 0 achievement points (3 for small practices) and it **stays in the denominator**. A +1 COA lands on it cleanly (0 + 1 out of 10). The APP's § 414.1367(c)(1)(i) exclusion is the *only* thing that creates the conflict, and there is no evidence in any of the four rulemaking documents that CMS considered the interaction. *This is my inference about why the text is silent; CMS never says it.*

**(f) Purpose.** The COA compensates for the burden of aggregating and deduplicating eCQM data across multiple EHRs (89 FR 98437; 89 FR 62080–62083). That burden is incurred at **submission**. The absence of a benchmark is a CMS-side data-volume failure — the PY2026 benchmark file's own comment is "Insufficient volume of data submitted in PY 2024 to establish historical benchmark" (source J) — not an ACO failure. § 425.512(a)(7)(ii)(B) shows CMS treats no-benchmark as something to hold ACOs **harmless** from. Denying the COA point would penalize the ACO for CMS's data gap.

**(g) A redundancy argument, partially available.** Under the APP, a measure failing the case minimum is *already* excluded by § 414.1367(c)(1)(i). If exclusion killed the COA, the case-minimum condition inside (b)(1)(vii)(C) would do **no work at all** for APM Entities. It does do work for Virtual Groups (traditional MIPS: failing case minimum → 0 points, measure stays in the denominator), so this argument is weakened but not eliminated.

### Evidence AGAINST accrual

**(h) CMS describes the COA as adding points *to measures*.** CY2026 final rule, **90 FR 49809**, in a comment response distinguishing the COA from the health equity adjustment:

> "Specifically, the Complex Organization Adjustment upwardly adjusts an ACO's MIPS quality performance category score **by adding points to specific measures** where the ACO reported via the eCQM collection type and met the case minimum and data completeness requirements; whereas, the health equity adjustment bonus points are added to the ACO's **overall** MIPS quality performance category score…"

This is the strongest evidence against. If a point is *added to a measure* and § 414.1367(c)(1)(i) removes that measure from both numerator and denominator, a mechanical implementation drops the point along with the measure.

**(i) CMS thinks in terms of measures "being scored."** CY2026 final rule, **90 FR 49813**:

> "While the Complex Organization Adjustment does have a cap as described at Sec. 414.1380(b)(1)(vii)(C), the cap is relative to the total available measure achievement points, and by design, would increase or decrease **based on the number of measures being scored**."

**(j) Same currency.** The COA is denominated in "measure achievement points," which is exactly what § 414.1367(c)(1)(i) says an excluded measure contributes none of.

**(k) The drafters knew how to preserve a bonus across exclusion and didn't.** § 414.1380(b)(1)(v)'s "regardless of whether the measure is included…" clause has no counterpart in (b)(1)(vii)(C). Cuts against (d).

### Why I land where I land

(a) and (b) are hard textual facts about the operative rule; (h) is a characterization in a comment response addressing a different question (COA vs. HEA duplication), and it is fully explained by the need to administer the per-measure 10-point ceiling — see 2.2. (k) is real but weaker: (b)(1)(v)'s clause exists because *high-priority* and *end-to-end* bonuses could attach to non-required measures, a problem the COA does not have.

I would not describe this as settled, and I would not remove a user-facing toggle on the strength of it. **Recommendation for the simulator: default to accrual (5 points), expose the alternative (3 points), and label the 3.33 pp spread as unresolved — but surface the § 425.512(a)(7)(ii)(B) floor first, because it very likely dominates the whole question (see 2.5).**

---

## 2.1 — Does any CMS text address it? (NEGATIVE FINDING)

**No.** I searched the full text of every rulemaking document that discusses the COA, plus the operative CMS memo, for any statement connecting the COA to excluded, unscored, or benchmark-less measures.

Method: whitespace-normalized each document (the Federal Register text is hard-wrapped, so a line-based search misses occurrences split as "Complex\nOrganization"); found every occurrence of `[Cc]omplex [Oo]rganization [Aa]djustment`; and tested a **±1,200-character window** around each against `exclud\w*|does not have a benchmark|lacks? a benchmark|lacking a benchmark|no benchmark|without a benchmark|unscored|not scored`.

| Document | COA occurrences | Result |
|---|---|---|
| CY2025 PFS final rule (89 FR 97710) — source E | 33 | **Zero matches.** Not one of the trigger phrases appears within ±1,200 characters of any COA mention. |
| CY2026 PFS final rule (90 FR 49266) — source F | 98 | 11 distinct matched contexts, **all incidental**: 10 are the boilerplate "**excluding** entities/providers eligible for facility-based scoring" from the 40th-percentile definition; 1 is an unrelated comment about ACOs being incentivized "to **exclude** providers who primarily serve these populations." **"does not have a benchmark", "no benchmark", "unscored", and "not scored" appear zero times** near any COA mention. |
| CY2027 PFS proposed rule (91 FR 43842) — source G | 5 | 1 matched context — again "excluding entities/providers eligible for facility-based scoring." No proposed change to the COA (see below). |
| CY2025 PFS proposed rule (89 FR 61596) — source H | 18 | **Zero matches.** The COA proposal at 89 FR 62080–62083 is background on CEHRT and data-aggregation burden plus the operative text; no benchmark or exclusion discussion. |
| **CMS PY2026 QPS memo (Dec 2025) — source I** | **0** | **The memo does not contain the string "complex organization" — nor even the word "adjustment" — anywhere in its four pages.** It is entirely silent on the COA. |

In other words: across 154 mentions of the Complex Organization Adjustment in four rulemaking documents, CMS never once discusses it in the same breath as a measure that lacks a benchmark or is excluded from scoring. **The silence is total, and I am reporting it as silence — not as an implied rule in either direction.**

### The same negative finding in CMS's operational documents

| Document (version, retrieved 2026-08-08) | URL | Result |
|---|---|---|
| **2026 Traditional MIPS Scoring Guide** (pub. 2026-04-08) | `https://d2g5m5leph8kam.cloudfront.net/s3fs/s3fs-public/2026-04/2026-Traditional-MIPS-Scoring-Guide.pdf?VersionId=nk2MYLLH2IFx_8s4wtIhW_EhXre5UHYh` (canonical link from `https://qpp.cms.gov/api/frontend/resource-library`) | COA stated with **two conditions only**; no benchmark condition; no exclusion discussion. |
| **PY 2025 APM Performance Pathway (APP) Toolkit — Scoring Guide** (pub. 2025-05-06) | `https://qpp-cm-prod-content.s3.amazonaws.com/uploads/3244/2025%20APP%20Toolkit.zip` | **The single most important operational document.** States the exclusion rule *and* the COA rule, in the same PDF, and **never reconciles them.** See below. |
| PY 2025 APP Toolkit — Fact Sheet, Quick Start Guide, Infographic | same zip | COA mentioned in passing; no benchmark or exclusion discussion. |
| PY 2025 APP Quality Requirements (SSP ACOs Only) | `https://qpp-cm-prod-content.s3.amazonaws.com/uploads/3246/PY2025APPQualityReq_All%20%28SSP%20ACOs%29.zip` | COA footnote, two conditions only. |
| 2026 & 2025 Quality Benchmarks User Guides *with Scoring Examples* | `.../uploads/3611/2026-Quality-Benchmarks-User-Guide.pdf`, `.../uploads/3162/2025-Quality-Benchmarks-User-Guide.pdf` | **Zero occurrences of "complex"** — despite the titles promising scoring examples. |
| 2026 & 2025 MVPs Implementation Guides; 2026 QPP Final Rule Fact Sheet | QPP resource library | Zero mentions of the COA. |
| MSSP: Reporting eCQMs, MIPS CQMs, and Medicare CQMs in the APP (v. 2026-02-04) | `.../uploads/3124/MSSP-2024-Reporting-eCQMs-MIPS-CQMs-and-Medicare-CQMs-in-the-APP.pdf` | Zero mentions of "complex" or "achievement point". |
| MSSP QPS 40th-percentile memo for **PY2025** (March 2026) | `https://www.cms.gov/files/document/performance-year-2025-40th-percentile-mips-quality-performance-category-score.pdf` | Does not mention the COA. |

**There is no PY 2026 APP Toolkit or 2026 APP Scoring Guide.** Verified against the live QPP resource-library index (687 resources, retrieved 2026-08-08): APP Toolkits exist for PY2022–PY2025 only. The 2026 Traditional MIPS Scoring Guide itself says ACOs should refer to the 2026 APP Toolkit *"(once available)."* So the one document class that would most likely resolve Q2 **does not yet exist for the year in question.**

#### The 2025 APP Toolkit Scoring Guide states both rules and never connects them

Exclusion — measure achievement points table (p. ~23):
> "Measures that don't have a benchmark or meet the case minimum requirement are excluded from the total measure achievement points and total available measure achievement points as long as you meet data completeness requirements." — presented in the table as **"0 (0 out of 0 points)"**.

Exclusion — "Factors Impacting Numerator Points and Available Denominator Points" (p. ~28):
> "There's no historical benchmark for one of the required APP quality measures **and we can't calculate one based on data submitted for the performance period**… **…the measure will receive 0 out of 0 points.**"
> "You don't meet the case minimum for one or more quality measures… …the measure will receive 0 out of 0 points."

COA — footnote (p. 15):
> "In the CY 2025 performance period, APM Entities and virtual groups can receive the complex organization adjustment when reporting eCQMs."

COA — Appendix C (p. 87):
> "Beginning in the CY 2025 performance period, APM Entities (including Shared Savings Program ACOs) and virtual groups are eligible to receive the complex organization adjustment when reporting electronic clinical quality measures (eCQMs). One measure achievement point is added for **each submitted eCQM** for an APM Entity or virtual group that meets **data completeness and case minimum requirements**."

The guide's Step 1–4 scoring flowchart (data completeness → case minimum → benchmark → assign achievement points) **has no COA branch at all.**

**This is the cleanest possible demonstration that the question is unaddressed:** CMS's own APP scoring guide contains the exclusion rule, contains the COA rule, restates the COA's two conditions without a benchmark caveat, and never puts the two in the same sentence.

#### Highly relevant to Q1 (flagging for the Q1 owner)

The p. 28 language — *"There's no historical benchmark … **and we can't calculate one based on data submitted for the performance period**… the measure will receive 0 out of 0 points"* — is CMS operational documentation stating a **two-step sequence**: attempt a performance-period benchmark first; exclude (0/0) only if that also fails. That is direct support for Q1 outcome **(a)-then-(b)**, and it is stronger and more specific than anything in the preambles. It is also consistent with the PY2024 benchmark file, in which measures 134 and 236 under eCQM carry `Benchmark Type = Performance Period`.

**What CMS *does* address:** failure of the **case minimum** (made an express condition of the COA) and failure of **data completeness** (also an express condition). CMS also states in the CY2027 proposed rule, 91 FR 44045, that "if a Shared Savings Program ACO fails to meet data completeness on a measure in the APP Plus quality measure set, it will receive a **0/10** for the affected quality measure(s)" — confirming that a data-completeness failure yields a scored zero with the 10 available points **retained in the denominator**, and that the APP's exclusion mechanism is limited to the two triggers named in § 414.1367(c)(1)(i). That is a useful confirmation of the exclusion's scope, but it says nothing about the COA.

**CY2027 status:** CMS proposes **no change** to § 414.1380(b)(1)(vii)(C). It expressly declines to extend the COA to the new Medicare eCQMs collection type (91 FR 44050): *"We are also not proposing to add Medicare eCQMs to the Complex Organization Adjustment described at Sec. 414.1380(b)(1)(vii)(C) for PY 2027 and subsequent PYs."* Label: **proposed, PY2027+**; does not affect PY2026.

---

## 2.2 — Per-measure or pooled?

**CMS says both, and they are reconcilable. The distinction narrows Q2 but does not decide it.**

**Per-measure attribution (repeated four times):**
- 89 FR 98116 / 98117 / 98437: *"The adjustment [would be / will be] added for each eCQM measure submitted **at the individual measure level**."*
- 90 FR 49803: same sentence.
- 90 FR 49809: *"…by adding points to **specific measures**…"* (contrasted with HEA, which is "added to the ACO's **overall** MIPS quality performance category score").

**Pooled numerator addition (the codified formula):**
- § 414.1380(b)(1)(vii): numerator = Σ measure achievement points **+** measure bonus points **+** COA. The COA enters the sum as its own term, exactly parallel to measure bonus points.

**Reconciliation.** Per-measure attribution exists to operate two ceilings that cannot be applied to a pool:

1. **"Each measure may not exceed 10 measure achievement points"** (§ 414.1380(b)(1)(vii)(C)) — you must know which measure a COA point lands on to know whether that measure has hit 10. Restated in the preamble as *"Each reported eCQM may not **score** more than 10 measure achievement points"* (89 FR 98116, 90 FR 49803).
2. **"the total achievement points (numerator) may not exceed the total available measure achievement points (denominator) for the quality performance category"** (89 FR 98116, 89 FR 98437, 90 FR 49803) — a numerator-level cap. *Note: this second constraint appears only in the preamble; it is **not** in the codified text of (b)(1)(vii)(C), which caps the score at 100 percentage points instead via (b)(1)(vii).*

The practical effect: an eCQM already scoring 10/10 earns no COA point; one scoring 7/10 becomes 8/10.

**Where CMS's operational guides put it — a third data point.** The **2026 Traditional MIPS Scoring Guide** (p. 19–20) files the COA under the section heading **"Quality Performance Category Bonus Points"**, immediately after the Small Practice Bonus, which the same page describes as *"6 bonus points, **added to the numerator** of the quality performance category."* The COA entry reads:

> "**Complex Organization Adjustment.** We'll add one measure achievement point for each eCQM **submitted** for an APM Entity or virtual group that meets data completeness and case minimum requirements. The adjustment may not exceed 10% of the total available measure achievement points in the quality performance category. The complex organization adjustment doesn't apply to clinicians participating as an individual or group."

CMS thus classifies the COA as a **bonus added to the numerator**, in the same breath as a bonus (small practice) that plainly attaches to no particular measure. This cuts **against** the "the point has nothing to attach to" reading and **for** the separate-addend reading. Caveat: the guide's own quality-score formula diagram (p. 26) shows only `Total Measure Achievement Points ÷ Total Available Measure Achievement Points + Improvement Score` with a Small Practice Bonus callout — the COA does not appear in the diagram at all, so the placement is suggestive rather than dispositive.

**Why this does not decide Q2.** The brief hypothesizes that "per-measure ⇒ COA dies with the measure." That does not follow, because per-measure attribution is a **ceiling-administration device**, not an attachment requirement, and the codified arithmetic still adds the COA outside the two quantities § 414.1367(c)(1)(i) reduces. An excluded measure has no achievement points and no available points, so the 10-point ceiling is not implicated — there is nothing for the ceiling to bind, but also nothing in the rule that says the addend disappears.

It is nonetheless the strongest available argument for the "COA dies" reading, and I would not dismiss it.

### No CMS worked example anywhere applies the COA (negative finding)

I looked specifically for the arithmetic examples the brief hoped would settle this. **None exists.**

- **2026 Traditional MIPS Scoring Guide**, pp. 30–32 (and the identical example in the 2025 guide, p. 39): the sole quality scoring example is a *small practice reporting as a group* — 36.1/50 + 6 small-practice bonus + 1.6% improvement = 85.8%. **No COA**, correctly, since the COA does not apply to groups.
- **2025 APP Toolkit Scoring Guide**, Example #1 (p. 34): ACO REACH APM Entity, 46.1/60 + 1.11% improvement = 78.00%. **No COA line.**
- **2025 APP Toolkit Scoring Guide**, Example #2 (p. 35): *"A Shared Saving Program ACO reported a full set of quality measures through a combination of MIPS CQMs and eCQMs for 2024 and 2025. They earn 49.3 achievement points out of 60 possible points for the 2025 performance period"* → 49.3/60 = 82.2% + 0.43% improvement = 82.63%. **No COA is added, despite this being an eCQM-reporting APM Entity in the first year the COA applies.**

**On Example #2 — read with care.** The 60-point denominator is *correct* for PY2025: CMS finalized that "in performance year 2025, ACOs will be scored on the required **six** measures in the APP Plus quality measure set: four eCQMs/MIPS CQMs/Medicare CQMs, the CAHPS for MIPS survey, and **one** administrative claims-based measure" (89 FR 98116). So this is not a stale PY2024 example carried over on the denominator, and the omission of the COA is harder to wave away.

**But it is not evidence on Q2.** The example does not say how many of the ACO's measures were eCQMs versus MIPS CQMs, its stated purpose is to demonstrate *improvement scoring*, and it says nothing about benchmarks. What it does establish is a **negative finding about CMS's documentation quality**: as of the most recent APP scoring guide, CMS has published no worked example in which the Complex Organization Adjustment is actually applied to a number. Anyone modelling the COA is extrapolating from rule text, not from a CMS demonstration.

---

## 2.3 — Is the 10% cap computed before or after exclusions?

**After exclusions. With 112 and 113 excluded, the cap is 6 points, not 8. Confidence: high. Label: current law + direct CMS confirmation.**

Two independent grounds:

**(1) Textual.** The cap's denominator is the defined term *"total available measure achievement points"* (§ 414.1380(b)(1)(vii)(C)). That is precisely the quantity § 414.1367(c)(1)(i) reduces: *"…is excluded from the … total measure achievement points **and total available measure achievement points**."* The same term cannot carry one value in the score denominator and a different value in the cap in the same calculation. The reduced figure is also the one § 425.512(a)(7)(ii)(A) refers to: *"The ACO's **total available measure achievement points used to calculate the ACO's MIPS Quality performance category score** are reduced under § 414.1380(b)(1)(vii)(A)."*

**(2) Direct CMS statement.** CY2026 final rule, **90 FR 49813**:

> "While the Complex Organization Adjustment does have a cap as described at Sec. 414.1380(b)(1)(vii)(C), the cap is relative to the total available measure achievement points, and **by design, would increase or decrease based on the number of measures being scored**."

CMS made this statement to argue the COA cap is superior to the HEA's fixed 10-point cap, which "was not designed to increase (or decrease) as the quality measure set expands (or contracts)" (90 FR 49813). The cap is explicitly dynamic and keyed to measures **being scored**.

**PY2026 arithmetic (derived):**

| Denominator | Cap (10%) | eCQMs submitted | Binding limit |
|---|---|---|---|
| 80 (all 8 measures scored) | 8 | 5 | **5** (eCQM count) |
| 70 (one measure excluded) | 7 | 5 | **5** |
| 60 (112 + 113 excluded) | **6** | 5 | **5** |
| 50 | 5 | 5 | 5 (tie) |
| 40 (four measures excluded) | **4** | 5 | **4 (cap binds)** |

So the cap does **not** bind in the fact pattern at issue under either reading of Q2. It binds only if the denominator falls below 50.

**Caveat 1, labeled as such:** ground (2) uses the phrase "measures being scored," which is the same phrase that supports the "COA dies with exclusion" reading. The two are not in tension for 2.3 — a measure excluded under § 414.1367(c)(1)(i) is not being scored, so the denominator and the cap both fall — but the reader should note that 2.3 and Q2 are answered from partly overlapping language pulling in different directions.

**Caveat 2 — CMS's operational guides are internally inconsistent on the denominator.** Both the 2025 APP Toolkit Scoring Guide (p. 32 footnote) and the 2026 Traditional MIPS Scoring Guide (p. 26 footnote) define it *pre*-exclusion:

> "*Total Available Measure Achievement Points = the number of required measures (including administrative claims measures) x 10"

That footnote sits in the same PDF as the "0 out of 0 points" table quoted above, which necessarily reduces the denominator. The footnote is a simplification for the common case, not a competing rule — but it means **no CMS operational document states the cap basis, and one states a denominator formula that would give the wrong answer here (8 points instead of 6).** The regulation and the CY2026 preamble are the controlling sources, and both point to post-exclusion.

---

## 2.4 — Does "5 measures (5 points)" count submitted or scored eCQMs?

**Submitted** — specifically, eCQMs in the PY2026 APP Plus measure set that meet case minimum and data completeness. **It is a ceiling derived from the size of the measure set, and it carries no information about benchmarks.**

CY2026 final rule, **90 FR 49804** (and repeated at **90 FR 49809**), full sentence with its antecedent:

> "**Based on the quality measures finalized for the APP Plus quality measure set** that Shared Savings Program ACOs are required to report beginning in performance year 2025 (89 FR 98128 through 98130), ACOs that report eCQMs will receive the Complex Organization Adjustment to their MIPS quality performance category score on **up to** four measures (that is, four points) in performance year 2025, **5 measures (that is, 5 points) in performance year 2026**, and 6 measures (that is, six points) in performance year 2027, **if each eCQM meets the case minimum requirement at Sec. 414.1380(b)(1)(iii) and the data completeness requirement at Sec. 414.1340**."

Reading:
- "**Based on the quality measures finalized for the APP Plus quality measure set**" — the counts 4 / 5 / 6 / 7 are the number of ACO-reported measures in the set in each PY, nothing more.
- "**up to**" — a ceiling.
- The trailing conditional restates the **same two conditions** as the rule. Benchmarks are not mentioned. The sentence neither grants nor denies the point for a benchmark-less measure.

Context matters: CMS wrote this in response to a comment asking it to raise the COA maximum to 10 points (90 FR 49809). CMS was explaining how large the adjustment can get, not adjudicating exclusions.

**Corroborating operational usage:** in the PY2024 simulation, CMS's stated eligibility test is submission — *"18 ACOs would have been eligible to receive the Complex Organization Adjustment because these ACOs **submitted** at least one eCQM"* and *"the eight ACOs that **did not submit** at least one eCQM … would not have been eligible"* (90 FR 49808).

### An arithmetic observation from CMS's PY2024 simulation — labeled inferential

CY2026 final rule, **90 FR 49808** and **90 FR 49810**:

> "for the 18 ACOs that would have been eligible to receive the Complex Organization Adjustment, the average MIPS quality performance category score would have been **6 percentage points higher on average** as compared to an average increase of 3 percentage points that these ACOs earned through the application of the health equity adjustment bonus points."

The PY2024 APP measure set was six measures (001, 134, 236, CAHPS, 479, 484) = **60 nominal available points**, with at most **three** eCQMs. Three COA points on a 60-point denominator is **5.00 percentage points**, not 6. Six percentage points corresponds to 3 ÷ **50**.

**This is consistent with — and only with — a denominator below the nominal 60 for a material share of these ACOs, i.e. measures having been excluded under § 414.1367(c)(1)(i) (or available points reduced under § 414.1380(b)(1)(vii)(A)/(B)), with the COA still delivering its points against the reduced denominator.**

**Label: my inference from CMS's stated averages, not a CMS statement.** CMS does not publish the per-ACO denominators, the eCQM counts per ACO, or its rounding convention, and I could not verify the figure independently. Alternative explanations exist (rounding of a distribution whose mean is between 5 and 6; ACOs submitting fewer than three eCQMs would push the average *down*, not up, which makes the sub-60 denominator explanation more rather than less likely). Treat as suggestive corroboration for 2.3 (post-exclusion denominator), **not** as evidence on Q2 — PY2024 had no benchmark-less APP cell (see below), so these exclusions, if they occurred, were case-minimum or § 414.1380(b)(1)(vii)(A)/(B) exclusions, not benchmark exclusions.

---

## 2.5 — Is the § 425.512(a)(7)(ii)(B) floor compared before or after the COA?

**After. The floor is compared against a score that already contains the COA. Confidence: high.**

### First, a correction to the brief

The brief quotes § 425.512(a)(7) as *"the higher of the ACO's **health equity adjusted quality performance score** or the equivalent of the 40th percentile…"*. **That is no longer the operative text.** As of the current eCFR issue (2026-08-06, source D), § 425.512(a)(7) reads:

> "CMS will use the higher of **the ACO's quality score** or the equivalent of the 40th percentile MIPS Quality performance category score across all MIPS Quality performance category scores, excluding entities/providers eligible for facility-based scoring, for the relevant performance year when—
> …
> (ii) For performance year 2025 and subsequent performance years, if an ACO reports all of the required measures in the APP Plus quality measure set, meeting the data completeness requirement at § 414.1340 of this subchapter for each measure in the APP Plus quality measure set, and **receiving a MIPS Quality performance category score as described at § 414.1380(b)(1)** of this subchapter, for the relevant performance year, and the ACO meets either of the following:
> (A) The ACO's total available measure achievement points used to calculate the ACO's MIPS Quality performance category score are reduced under § 414.1380(b)(1)(vii)(A) of this subchapter.
> (B) At least one of the required measures in the APP Plus quality measure set **does not have a benchmark as described at § 414.1380(b)(1)(i)(A)** of this subchapter."

The health-equity wording was removed because the CY2026 final rule sunset the adjustment: § 425.512(b) is now titled *"Calculation of an adjustment to an ACO's quality score for performance years 2023 **through 2025**"* and CMS finalized removal "beginning in performance year **2026**" (90 FR 49815; the proposal had been retroactive to PY2025 and was finalized prospectively for PY2026 instead — 90 FR 49813–49815). **For PY2026 there is no separate adjustment layer: the ACO's quality score *is* the MIPS quality performance category score.**

### Therefore the order of operations for PY2026 is

1. Score each measure → measure achievement points.
2. Apply § 414.1367(c)(1)(i): drop measures with no benchmark or failing case minimum from **both** numerator and denominator.
3. Add measure bonus points and the **COA** to the numerator; divide by total available measure achievement points; add improvement percent score; cap at 100 pp → **MIPS quality performance category score** (§ 414.1380(b)(1)(vii)).
4. That score **is** the ACO's quality score for PY2026 (§ 425.512(b) no longer supplies an adjustment).
5. § 425.512(a)(7): take **the higher of** that score **or 73.85**.

CMS states step 3/4 explicitly — CY2026 final rule, **90 FR 49805**:

> "The Complex Organization Adjustment **is accounted for in the calculation of** the ACO's MIPS quality performance category score; whereas, the health equity adjustment bonus points are **added to** the ACO's MIPS quality performance category score."

That contrast is the answer: the COA is *inside* the score; the floor operates on the finished score.

### The consequence the brief does not draw

§ 425.512(a)(7)(ii)(B) is triggered by exactly the PY2026 fact pattern — "at least one of the required measures in the APP Plus quality measure set does not have a benchmark." If it fires, the ACO receives **max(own score, 73.85)**.

- 5 COA points on a 60-point denominator = 8.33 pp.
- 3 COA points on a 60-point denominator = 5.00 pp.
- If the ACO's post-COA score is **below 73.85**, both numbers are discarded and the ACO receives 73.85. **The entire Q2 spread is worth zero.**
- Q2 only has cash value for an ACO whose score is already above 73.85, or in a world where the floor does not fire.

**This makes Q2 conditional on Q1.** If Q1 resolves to (c) — the floor applies — then Q2 is close to moot for the ACOs most likely to care about it. If Q1 resolves to (a) — a performance-period benchmark is created — then 112/113 are scored, nothing is excluded, and Q2 does not arise at all: the ACO gets all 5 COA points on an 80-point denominator (+6.25 pp). **Q2's 3.33 pp spread only materializes under Q1 outcome (b) *without* the floor — i.e. only if exclusion moots the floor (the brief's sub-question 1.6).** That is worth flagging prominently to whoever is resolving Q1.

*Caveat, stated explicitly:* § 425.512(a)(7)(ii)(B) cross-references § 414.1380(b)(1)(i)(A) — the **traditional-MIPS** "Lack of benchmark or case minimum" paragraph — which is the paragraph § 414.1367(c)(1)(i) effectively displaces inside the APP. Whether that cross-reference is a live pointer or a drafting artifact is a Q1 question and I do not resolve it here.

---

## Why no empirical record exists — and cannot yet exist

**PY2026 is the first performance year in which any APP / APP Plus clinical measure × eCQM or MIPS CQM cell lacks a benchmark.** Verified directly against the QPP benchmark CSVs (source J, all four re-fetched 2026-08-08):

| PY | 001 | 112 | 113 | 134 | 236 | (eCQM and MIPS CQM) |
|---|---|---|---|---|---|---|
| 2023 | Yes | Yes | Yes | Yes | Yes | all Historical |
| 2024 | Yes | Yes | n/a | Yes | Yes | 134 and 236 eCQM = **Performance Period** type |
| 2025 | Yes | Yes | Yes | Yes | Yes | all Historical |
| **2026** | Yes | **No** | **No** | Yes | Yes | 112/113 eCQM + MIPS CQM: `Measure has a Benchmark = No` |

Combined with the fact that the COA first applies in **PY2025** (§ 414.1380(b)(1)(vii)(C); "Performance year 2025 will be the first performance year when the Complex Organization Adjustment will apply to ACOs for reporting eCQMs," 90 FR 49805), it follows that:

- **PY2024 and earlier:** COA did not exist. No test case.
- **PY2025:** COA existed, but every APP Plus eCQM cell had a benchmark. No test case.
- **PY2026:** first year both conditions coincide. **Scoring occurs in 2027.**

So there is no PUF, no scoring report, and no historical arithmetic that can settle Q2. The question is prospective. Anyone who claims to know the answer from CMS's past behavior is extrapolating.

*(Side note relevant to Q1, not Q2: the PY2024 file shows 134 eCQM and 236 eCQM scored on **Performance Period** benchmarks — direct evidence that CMS creates performance-period benchmarks for APP clinical eCQMs, not only for administrative-claims measures.)*

---

## How to actually resolve this

1. **QPP Service Center / Shared Savings Program help desk.** Ask directly: "For PY2026, if an eCQM in the APP Plus set is excluded from total measure achievement points and total available measure achievement points under 42 CFR 414.1367(c)(1)(i) because no benchmark was published, does the ACO still receive the Complex Organization Adjustment point for that eCQM under 414.1380(b)(1)(vii)(C)?" This is a scoring-mechanics question a help desk can answer definitively, and it is the fastest path.
2. **CY2027 PFS final rule** (expected ~November 2026). CMS is already amending § 414.1380(b)(1) for Medicare eCQMs and flat benchmarks; a commenter raising this interaction would likely draw a response.
3. **The PY 2026 APP Toolkit, when CMS publishes it.** It does not exist yet (verified against the live resource-library index, 2026-08-08); the 2026 Traditional MIPS Scoring Guide points readers to it "(once available)." The PY2025 edition is the document that comes closest to addressing Q2 and stops just short, so the PY2026 edition is the most likely place for a resolution to appear. Watch `https://qpp.cms.gov/api/frontend/resource-library` for it.
4. **PY2026 Shared Savings Program Quality Performance Report**, delivered with the PY2026 Financial Reconciliation Package (source I, footnote 1) — will show the actual denominator and COA for each ACO, but not until 2027.
5. **Comment on CMS-1848-P** if the window is still open — the ambiguity is squarely within the scope of the Medicare-eCQM/COA discussion at 91 FR 44050.

---

## Appendix — verbatim texts relied on

**§ 414.1380(b)(1)(v) chapeau** (source A):
> "Measure bonus points. MIPS eligible clinicians receive measure bonus points for the following measures, except as otherwise required under § 414.1335, regardless of whether the measure is included in the MIPS eligible clinician's total measure achievement points."

**§ 414.1380(b)(1)(iii)** (source A) — the case minimum the COA cross-references, in full:
> "**Minimum case requirements.** Except as otherwise specified in the MIPS final list of quality measures described in § 414.1330(a)(1), the minimum case requirement is 20 cases."

**§ 414.1340(a)(4)** (source C) — the data completeness threshold the COA cross-references, for the PY2026 performance period / 2028 MIPS payment year:
> "At least **75 percent** of the MIPS eligible clinician, group, virtual group, subgroup, and APM Entity's patients that meet the measure's denominator criteria, regardless of payer for MIPS payment years 2026, 2027, 2028, 2029, and 2030."

Both are conditions an ACO can satisfy or fail through its own conduct. **The existence of a benchmark is not.** That asymmetry is the substantive reason the COA's two-condition list is defensible as written, and the reason I read the omission of a benchmark condition as deliberate rather than accidental — though CMS never says so.

**§ 414.1380(b)(1)(i)(A)(*1*)** (source A) — traditional MIPS treatment of a benchmark-less measure, which is *not* exclusion:
> "Except as provided in paragraphs (b)(1)(i)(A)(2) and (3) of this section, for the CY 2017 through 2022 performance periods/2019 through 2024 MIPS payment years, MIPS eligible clinicians receive 3 measure achievement points for each submitted measure that meets the data completeness requirement, but does not have a benchmark or meet the case minimum requirement. Beginning with the CY 2023 performance period/2025 MIPS payment year, MIPS eligible clinicians other than small practices receive 0 measure achievement points for each such measure, and small practices receive 3 measure achievement points for each such measure."

**§ 414.1380(b)(1)(i)(A)(*2*)** (source A) — the *only* exclusions in traditional MIPS, and note that neither covers a benchmark-less eCQM:
> "The following measures are excluded from a MIPS eligible clinician's total measure achievement points and total available measure achievement points: (i) Each submitted CMS Web Interface-based measure that meets the data completeness requirement, but does not have a benchmark or meet the case minimum requirement, or is redesignated as pay-for-reporting for all Shared Savings Program accountable care organizations by the Shared Savings Program; and (ii) Each administrative claims-based measure that does not have a benchmark or meet the case minimum requirement."

**CY2025 final rule, 89 FR 98437** — the fullest statement of the COA's mechanics:
> "To account for the organizational complexities faced by Virtual Groups and APM Entities, including ACOs in the Shared Savings Program, we proposed to establish a Complex Organization Adjustment beginning in the CY 2025 performance period/2027 MIPS Payment Year. Virtual Group and APM Entities would receive 1 measure achievement point for each submitted eCQM that meets the data completeness at Sec. 414.1380(b)(1)(iii) and case minimum requirements at Sec. 414.1340. Each reported eCQM may not receive more than 10 measure achievement points and the total achievement points (numerator) may not exceed the total available measure achievement points (denominator) for the quality performance category. The Complex Organization Adjustment for a Virtual Group or APM Entity may not exceed 10 percent of the total available measure achievement points in the quality performance category. The adjustment would be added for each eCQM measure submitted at the individual measure level."

*Note the transposed cross-references in that passage — "data completeness at § 414.1380(b)(1)(iii) and case minimum requirements at § 414.1340" reverses the two. The codified text at 89 FR 98563 and the MSSP-section description at 89 FR 98116 both have them the right way round (case minimum at § 414.1380(b)(1)(iii), data completeness at § 414.1340). A preamble typo, not a substantive difference.*
