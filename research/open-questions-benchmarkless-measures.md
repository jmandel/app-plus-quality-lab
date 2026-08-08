# Research brief — benchmark-less measures in APP Plus, PY2026

**Status:** open questions. Prepared 2026-08-08 for independent research (internal or external).
**Scope:** Medicare Shared Savings Program (MSSP) ACOs reporting the APP Plus quality measure
set for **performance year 2026**, submitted to CMS in early 2027. Current law as of August 2026,
with the CY2027 PFS proposed rule (CMS-1848-P, July 2026) treated as proposed, not final.

---

## Why these questions matter

For PY2026, CMS published **no quality benchmark** for two of the five ACO-reported measures
under two of the four collection types:

| Measure | eCQM | MIPS CQM | Medicare CQM |
|---|---|---|---|
| 112 — Breast cancer screening | **no PY2026 benchmark** | **no PY2026 benchmark** | flat bands |
| 113 — Colorectal cancer screening | **no PY2026 benchmark** | **no PY2026 benchmark** | flat bands |

Verified 2026-08-07 from `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/2026`
(MD5 `3c4ba299ad2f604f7852b3b9c5433400`): rows for 112 and 113 under eCQM and MIPS CQM carry
`Measure has a Benchmark = No`, all ten decile columns `--`, with the comment *"Insufficient
volume of data submitted in PY 2024 to establish historical benchmark."*

An ACO that reports all five measures through the all-payer column (eCQM or MIPS CQM) — which is
the only way to earn the reporting incentive ("deeming") — is therefore submitting two of its five
measures into a cell with no published scoring ladder. **How those two measures are treated
changes the quality score's denominator, the value of every other point, whether an electronic
reporting bonus accrues, and which reporting strategy maximizes revenue.** We could not settle it
from the public record, so a simulator we maintain currently exposes it as a user-facing toggle
rather than picking an answer.

---

## Question 1 — Are benchmark-less measures scored, or excluded?

**Q1.** For PY2026, when a required APP Plus measure is submitted under a collection type with no
pre-published benchmark, which of the following occurs?

- **(a) Scored on a performance-period benchmark.** CMS computes deciles from the performance
  year's own submissions after the submission deadline and scores the measure normally.
  Denominator stays at 80 points for the five-measure + CAHPS + two-claims set.
- **(b) Excluded from scoring.** Per 42 CFR § 414.1367(c)(1)(i), the measure is excluded from
  *both* total measure achievement points *and* total available measure achievement points —
  a 60-point denominator when both 112 and 113 are affected.
- **(c) Scored, but with the § 425.512(a)(7)(ii)(B) floor applied.** The ACO receives the higher
  of its own score or the 40th-percentile-equivalent MIPS quality score (**73.85** for PY2026).
- **(d) Some combination or sequence of the above**, or a treatment not listed here.

### What we have already verified (do not redo; do challenge)

1. **§ 414.1367(c)(1)(i)** (APM Performance Pathway scoring), verbatim: *"Each submitted measure
   that does not have a benchmark or meet the case minimum requirement is excluded from the MIPS
   eligible clinician, group, or APM Entity group's total measure achievement points **and total
   available measure achievement points**."* This is an express carve-out from § 414.1380(b)(1).
2. **§ 414.1380(b)(1)(ii)** permits benchmarks derived from *"the applicable baseline **or
   performance period**"* — i.e. performance-period benchmarks are a lawful mechanism, not a
   courtesy. The 2023 and 2024 QPP benchmark files contain 88 and 85 rows respectively whose
   Benchmark Type is a performance-period benchmark, so the mechanism is in active use.
3. **§ 425.512(a)(7)(ii)(B)**, verbatim: CMS *"will use the higher of the ACO's health equity
   adjusted quality performance score or the equivalent of the 40th percentile MIPS Quality
   performance category score … when … (B) At least one of the required measures in the APP Plus
   quality measure set does not have a benchmark as described at § 414.1380(b)(1)(i)(A)."* The
   PY2026 40th-percentile value is **73.85** (CMS QPS memo, derivation 77.73 + 74.54 + 69.27 = 221.54 / 3).
   **CORRECTED 2026-08-08:** an earlier draft of this brief claimed this provision is "real and
   applied" because the PY2024 PUF flags 35 ACOs at exactly 77.05. That attribution was **wrong**.
   `Recvd40p` is the **extreme-and-uncontrollable-circumstances** floor at § 425.512(c)(3)(iii),
   not the missing-benchmark floor: all 35 flagged ACOs carry `DisAffQual=1`, the pattern is fully
   explained by `DisAffQual=1 AND organic score < 77.05`, it replicates across four years
   (`Recvd30p` in PY2021–23) with zero counterexamples, and the PUF has **no field at all** for the
   (a)(7) floor. **The § 425.512(a)(7)(ii)(B) benchmark prong has no observed instance anywhere in
   the public record.** See `answers-q1-empirical.md`.
4. **CMS's July 2026 preamble** (CY2027 PFS proposed rule) states that *"none of the eCQMs, MIPS
   CQMs, or Medicare CQMs that Shared Savings Program ACOs have reported over the past four PYs
   lacked benchmarks."* This cuts **against** (b) and (c) firing in practice.
5. **CMS's PY2026 QPS memo** (December 2025) describes three pathways to meet the quality
   performance standard and **does not mention a floor among them**; it promises performance-period
   benchmarks explicitly only *"for the administrative claims-based measures."* It is silent on
   clinical measures that lack a pre-year benchmark.
6. CMS-1848-P proposes to **delete** the § 425.512(a)(7)(ii)(B) trigger for PY2027+, which implies
   it is live for PY2026.

### The unresolved tension

Points 1–3 describe three different mechanisms that could each apply, and points 4–5 suggest CMS
does not expect the situation to arise at all — yet for PY2026 it demonstrably *has* arisen for
112/113 under two collection types. The load-bearing ambiguity: **does "does not have a benchmark"
in § 414.1367(c)(1)(i) and § 425.512(a)(7)(ii)(B) mean "no benchmark published before the
performance year" or "no benchmark at the time scoring occurs"?** If CMS routinely creates a
performance-period benchmark after submission, a measure that lacks a *pre-year* benchmark still
has a benchmark *at scoring*, and neither the exclusion nor the floor ever fires.

### Sub-questions

1.1 **Precedent.** In PY2021–PY2025, were there measure × collection-type cells in the APP or APP
Plus set that lacked a pre-year benchmark? For each, what actually happened at scoring — excluded,
performance-period benchmark, or floor? Cite the benchmark files, scoring FAQs, or the PUF fields
that show it.

1.2 **Which measures get performance-period benchmarks?** The QPP benchmark files' performance-
period rows: which measures and collection types, and is there any pattern (e.g. only
administrative claims, only new measures, only measures below a volume threshold)?

1.3 **What has CMS actually promised for PY2026 for 112/113 specifically?** Any memo, FAQ,
webinar, ACO listening session, help-desk guidance, or QPP resource that addresses these exact
cells. Is there anything in the CY2026 PFS final rule preamble?

1.4 **Timing and disclosure.** If a performance-period benchmark is used, when is it published
relative to (i) the submission deadline and (ii) the settlement/reconciliation notice? Can an ACO
know its score's ladder before it must choose a collection type?

1.5 **The 35 PY2024 ACOs.** ~~What actually triggered `Recvd40p`…~~ **ANSWERED — see
`answers-q1-empirical.md`.** They are extreme-and-uncontrollable-circumstances cases, unrelated to
benchmarks. The decisive empirical test turned out to be elsewhere: **PY2024 Medicare CQM**, a
brand-new collection type with no possible pre-year benchmark (zero Medicare CQM rows exist in the
PY2023 benchmark file). CMS built **performance-period** benchmarks for it, and of the 26 ACOs
that reported it, **14 scored below the floor value and were not floored** — so "does not have a
benchmark" is evaluated **at scoring time**, and a performance-period benchmark satisfies it.

1.6 **Interaction.** If a measure is excluded under § 414.1367(c)(1)(i), does the
§ 425.512(a)(7)(ii)(B) floor *also* fire (the measure still "does not have a benchmark"), or does
exclusion moot the floor? These are not mutually exclusive on their face.

---

## Question 2 — Does an excluded measure still generate a Complex Organization Adjustment point?

**Q2.** The Complex Organization Adjustment (COA) awards **one measure achievement point per
eCQM** submitted by an APM Entity that meets the case minimum and data completeness requirements.
If a submitted eCQM is excluded from scoring for lack of a benchmark (Q1 outcome (b)), does it
still generate a COA point?

### What we have already verified

1. **§ 414.1380(b)(1)(vii)(C)**, effective CY2025 performance period: a Virtual Group or APM Entity
   *"receives one measure achievement point for each **eCQM**"* — the rule text conditions the
   point on the measure being an eCQM that **meets the case minimum requirement at
   § 414.1380(b)(1)(iii) and the data completeness requirement at § 414.1340**. On its face it does
   **not** condition the point on the measure having a benchmark.
2. CMS's own framing (CY2025 PFS final rule, responding to comments): ACOs reporting eCQMs receive
   the COA *"on up to four measures … in performance year 2025, **5 measures (that is, 5 points) in
   performance year 2026**, and 6 measures … in performance year 2027, if each eCQM meets the case
   minimum requirement … and the data completeness requirement."*
3. The COA total is capped at **10% of the total available measure achievement points**.

### The tension

The COA point is denominated in **"measure achievement points"** — the same currency
§ 414.1367(c)(1)(i) says an excluded measure contributes none of. Two readings:

- **COA survives exclusion.** The rule's conditions (eCQM + case minimum + data completeness) are
  satisfied regardless of benchmark existence, so the point accrues. Consequence: a benchmark-less
  eCQM is *strictly better than free* — it costs nothing in the denominator and pays +1.
- **COA dies with exclusion.** If the measure is excluded from total measure achievement points,
  a bonus point attached to it has nothing to attach to; the "per-measure 10-point ceiling"
  language presumes a measure with a score. Consequence: benchmark-less cells are inert.

The difference is up to **2 points** for an ACO routing 112 and 113 to eCQM, and it changes the
optimal routing strategy.

### Sub-questions

2.1 Does any CMS text (preamble, FAQ, scoring guide, QPP resource) state whether the COA applies
to measures that are excluded, lack benchmarks, or fail the case minimum?

2.2 Is the COA computed **per measure** (attached to that measure's achievement points) or as a
**pooled addition** to the numerator? The distinction decides the question.

2.3 Is the 10%-of-available-points cap computed on available points **before or after** exclusions?
(With two measures excluded, is the cap 8 points or 6?)

2.4 CMS's PY2026 statement says the COA covers "5 measures (that is, 5 points)" — is that a count
of *submitted* eCQMs or *scored* eCQMs?

2.5 Does the COA interact with the § 425.512(a)(7)(ii)(B) floor — i.e., is the floor compared
against the score before or after COA points are added?

---

## Evidence standard for answers

For each question, we want:

- **A direct citation**: CFR section and paragraph, Federal Register page (volume + page), CMS
  memo/FAQ with its URL and publication date, or a data file with its retrieval date.
- **A clear label**: current law for PY2026 / proposed for PY2027+ / CMS operational practice with
  no codified basis / genuinely unaddressed by the public record.
- **Explicit negative findings.** "The PY2026 QPS memo does not address this" is a valuable answer.
  Do **not** infer a rule from silence without saying so.
- **Empirical corroboration where available**: the MSSP PUFs (`Recvd40p`, `QualScore`, and the
  reporting-mechanism flags), the annual QPP benchmark CSVs, and the QPP Experience/participation
  reports can often show what CMS *did*, which beats what a rule *permits*.

## Key sources to start from

- 42 CFR §§ 414.1367, 414.1380, 414.1340, 425.512 (eCFR, current issue — note eCFR's API has been
  intermittently returning 503; govinfo CFR XML is a stable fallback)
- CY2025 PFS final rule (CMS-1807-F), 89 FR — APP Plus adoption and COA
- CY2026 PFS final rule, 90 FR — population adjustment removal, APP Plus updates
- CY2027 PFS proposed rule (CMS-1848-P), 91 FR 44039 ff. — Medicare eCQMs, flat benchmarks,
  MIPS CQM extension, § 425.512(a)(7) deletion
- CMS PY2026 Quality Performance Standard / 40th-percentile memo (December 2025)
- QPP benchmark files, PY2023–PY2026: `https://qpp.cms.gov/api/frontend/benchmarks-csv/quality/<year>`
- MSSP Performance Year Financial and Quality Results PUFs (data.cms.gov), PY2022–PY2024
- QPP Resource Library: APP/APP Plus scoring guides, MIPS scoring FAQs

## What we will do with the answers

- **Q1 = (a)**: score 112/113 on a performance-period benchmark; keep the 80-point denominator;
  present the ladder as unknowable-at-decision-time rather than absent.
- **Q1 = (b)**: keep the exclusion and the 60-point denominator; drop the estimate ladders from
  scoring entirely.
- **Q1 = (c)**: implement the 73.85 floor, which would *invert* the current teaching — routing
  112/113 to an all-payer method would become a shelter rather than a risk.
- **Q2**: gate the COA point on the measure being scored, or not.

A simulator currently models Q1 as a labeled user toggle (default: exclusion) precisely because
this brief is unresolved. Resolving it lets us remove the toggle and state one answer.
