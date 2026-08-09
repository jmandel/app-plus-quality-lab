# CMS's Design Choices and Stated Rationale for MIPS / APP Quality Benchmarks

An **explanatory reference**: not just what the benchmark rules are, but why CMS says it built them
this way, what problem each mechanism solves, and which tradeoffs CMS acknowledged on the record.

**Retrieval date for every source below: 2026-08-09.** Every load-bearing claim is quoted from
Federal Register preamble text with volume + page, or from codified CFR text with the paragraph
citation. Where CMS gave **no** rationale, this file says so explicitly rather than inventing one.

**Scope note.** This file covers the *general design architecture*. The specific rulemaking history
of flat benchmarks for Quality IDs 236 and 001 is being verified separately and is deliberately
not re-derived here; §5 states only the general policy those measures were the first instance of.

**Relationship to prior research in this directory.** `mssp-scoring-rules.md` and `findings.md`
establish the operative PY2026 rules and the codified text. Almost nothing in this file duplicates
them: prior files contain **no preamble rationale** for collection-type separation, **nothing at all**
on topped-out measures or the 7-point cap, and only paraphrases (never verbatim FR text) for flat
benchmarks. What is genuinely settled elsewhere and reused here is flagged inline.

---

## Design in one page

CMS's benchmark architecture is the product of six decisions, each with a stated purpose:

| # | Decision | Problem CMS says it solves | Cost CMS acknowledged |
|---|---|---|---|
| 1 | **Benchmark separately by collection type** (eCQM / MIPS CQM / registry / claims / …) | The same Quality ID has *different measure specifications* by collection type, so pooling would compare unlike things. | Creates "opportunities for clinicians to achieve higher quality scores by selectively choosing submission mechanisms" (81 FR 77278). CMS accepted this and promised monitoring. |
| 2 | **Refuse to stratify any further** (not by specialty, size, region, or APM status) | Keeps one national standard and keeps benchmark samples large. | CMS explicitly did **not** want "separate, potentially lower, standards of care" (81 FR 77279). |
| 3 | **Prefer historical (baseline-period) benchmarks; fall back to performance-period** | Advance notice, so clinicians "can set a clear performance goal." | The fallback benchmark is unknowable during the year — CMS called this a straight binary choice between the two (81 FR 77279). |
| 4 | **Deciles with partial points, ≥20 reporters, ≥20 cases, data completeness** | Reliability + a uniform points scale; partial points prevent "cliffs." | Too few submissions ⇒ **no benchmark at all**, which is a scoring event, not just a data gap. |
| 5 | **Topped-out lifecycle: identify → cap at 7 → remove** | Topped-out benchmarks "provide little room for improvement" and can distort scores. | Applied per collection type, so one Quality ID can be topped out in one collection type and not another. |
| 6 | **Flat percentage benchmarks as an escape hatch** | Used for four distinct problems (patient safety, tournament effects, missing data, transition support) — *not* one policy. | Flat benchmarks are "not topped out" measures; conflating the two is a category error CMS itself disclaims (84 FR 63015). |

**The single most important framing for the simulator.** CMS has never denied that the same clinical
care scores differently by collection type — it has repeatedly *asserted* it as a design premise:

> "We believe it is important to determine separate benchmarks for each of a measure's collection
> types **since performance varies by collection type in MIPS**. We considered determining one
> benchmark per quality measure regardless of collection type since having a single benchmark may
> help ASM participants more readily calibrate their performance. **Given the differences in MIPS
> performance by collection type** for measures that we proposed to require in ASM, we believe it
> would be more appropriate to calculate a benchmark for each collection type."
> — CY2026 PFS final rule, **90 FR 49634** (Ambulatory Specialty Model benchmarks). *Current law.*

And, from the rule that created flat benchmarks:

> "We recognize that not applying the same benchmarking methodology to all collection types may
> create some inconsistent evaluation between collection types for a single measure. On the other
> hand, **we know there are differences in performance by data collection type**, and we are
> concerned that if we apply this method to all collection types without regard to the collection
> type distribution, then we would harm those with top performance for certain collection types."
> — CY2020 PFS final rule, **84 FR 63016**. *Current law.*

**The honest gap.** CMS says performance *varies* by collection type, and it cites its own public
performance data as the evidence (90 FR 49634 nn.249–250, both pointing to
`https://qpp.cms.gov/resources/performance-data`). But **CMS has never published, in any rule this
research examined, a figure quantifying how much lower eCQM reporters score than other collection
types.** See §7 — do not attribute a number to CMS that CMS did not state.

---

## Source list

| # | Document | FR cite | URL | Status |
|---|---|---|---|---|
| F1 | CY2017 Quality Payment Program final rule with comment period (FR Doc 2016-25240, pub. 2016-11-04) | 81 FR 77008–77831 | `https://www.federalregister.gov/documents/full_text/text/2016/11/04/2016-25240.txt` | **Historical** (foundational; most policies survive in amended form) |
| F2 | CY2018 Quality Payment Program final rule (FR Doc 2017-24067, pub. 2017-11-16) | 82 FR 53568–54229 | `https://www.federalregister.gov/documents/full_text/text/2017/11/16/2017-24067.txt` | **Historical** (topped-out cap + lifecycle; cap survives) |
| F3 | CY2020 PFS final rule (FR Doc 2019-24086, pub. 2019-11-15) | 84 FR 62568–63563 | `https://www.federalregister.gov/documents/full_text/text/2019/11/15/2019-24086.txt` | **Historical** (origin of flat percentage benchmarks; policy is current law) |
| F4 | CY2022 PFS final rule (FR Doc 2021-23972, pub. 2021-11-19) | 86 FR 64996–66031 | `https://www.federalregister.gov/documents/full_text/text/2021/11/19/2021-23972.txt` | **Historical** |
| F5 | CY2023 PFS final rule (FR Doc 2022-23873, pub. 2022-11-18) | 87 FR 69404–70700 | `https://www.federalregister.gov/documents/full_text/text/2022/11/18/2022-23873.txt` | **Historical** (75% data completeness; MSSP Web Interface flat benchmarks) |
| F6 | CY2024 PFS final rule (FR Doc 2023-24184, pub. 2023-11-16) | 88 FR 78818–80047 | `https://www.federalregister.gov/documents/full_text/text/2023/11/16/2023-24184.txt` | **Historical** (Medicare CQMs created) |
| F7 | CY2025 PFS final rule (FR Doc 2024-25382, pub. 2024-12-09) | 89 FR 97710–99057 | `https://www.federalregister.gov/documents/full_text/text/2024/12/09/2024-25382.txt` | **Current law** (CoA; Medicare CQM flat benchmarks) |
| F8 | CY2026 PFS final rule (FR Doc 2025-19787, pub. 2025-11-05) | 90 FR 49266–50481 | `https://www.federalregister.gov/documents/full_text/text/2025/11/05/2025-19787.txt` | **Current law** |
| F9 | CY2027 PFS **proposed** rule, CMS-1848-P (FR Doc 2026-14327, pub. 2026-07-16) | 91 FR 43842–44557 | `https://www.federalregister.gov/documents/full_text/text/2026/07/16/2026-14327.txt` | **PROPOSED — not law.** Comments close 2026-09-14 |
| C1 | 42 CFR part 414 subpart O (as of eCFR issue date 2026-08-05) | — | `https://www.ecfr.gov/api/versioner/v1/full/2026-08-05/title-42.xml?chapter=IV&subchapter=B&part=414&subpart=O` | **Current law** |

Fetch notes: FR `.txt` files contain NUL bytes (`tr -d '\000'` or `grep -a`). Page numbers below were
resolved by binary-searching the `[[Page NNNNN]]` markers that precede each quote. Working copies and
the page-aware search tool are in `/home/jmandel/hobby/.agent-scratch/cms-benchmark-design/`.

---

## 1. Separate benchmarks per collection type

**Status: current law.** Codified at **42 CFR § 414.1380(b)(1)(ii)** (C1):

> "Except as provided in paragraphs (b)(1)(ii)(B) through (F) of this section, benchmarks will be
> based on performance **by collection type**, from all available sources, including MIPS eligible
> clinicians and APMs, to the extent feasible, during the applicable baseline or performance period."

Originally finalized in 2016 at § 414.1380(b)(1)(iii) using the older term "submission mechanism";
the substance moved into (b)(1)(ii) as the regulation was restructured and "collection type" replaced
"submission mechanism."

### 1.1 The stated reason: incomparable measure specifications

The rationale is narrow and specification-based, not performance-based. CMS proposed
(**81 FR 77277**, F1):

> "In addition, we proposed to create **separate benchmarks for submission mechanisms that do not
> have comparable measure specifications**. For example, several eCQMs have specifications that are
> different than the corresponding measure from registries. We proposed to develop separate
> benchmarks for EHR submission mechanisms, claims submission mechanisms, and QCDRs and qualified
> registry submission mechanisms."

Finalized after supportive comment (**81 FR 77278**, F1):

> "Response: We agree with commenters and are finalizing at Sec. 414.1380(b)(1)(iii) the
> establishment of separate benchmarks for the following submission mechanisms: EHR submission
> options; QCDR and qualified registry submission options; claims submission options; CMS Web
> Interface submission options; CMS-approved survey vendor for CAHPS for MIPS submission options;
> and administrative claims submission options."

### 1.2 CMS acknowledged the gaming problem in the same paragraph and accepted it

This is the sentence to quote when explaining why the same care scores differently
(**81 FR 77278**, F1):

> "**We note that assigning separate benchmarks in this manner creates opportunities for clinicians
> to achieve higher quality scores by selectively choosing submission mechanisms**; as discussed in
> section II.E.5.a.(2) in this final rule with comment period, we intend to monitor for such
> activity and to report back on any findings from our monitoring in future rulemaking."

CMS committed only to *monitoring*. This research found no subsequent rule reporting the results of
that monitoring; if CMS ever "reported back," it was not located in F2–F9. **State this as an
unfulfilled commitment, not as evidence either way.**

### 1.3 Why CMS refused to stratify benchmarks any further

Commenters asked for specialty-, region-, and size-specific benchmarks. CMS declined
(**81 FR 77279**, F1):

> "Response: **We want the benchmarks to be as broad and inclusive as possible and to establish a
> single performance standard whenever the measure specifications are comparable. We finalized
> separate benchmarks by submission mechanism only when the differences in specifications make
> comparisons less valid.** We do not believe differences in specialty, group size, and region create
> an inherent need for separate benchmarks as the specifications are comparable across each of these
> categories. Furthermore, we do not expect differences in location, practice size, and other
> characteristics to impact the quality of care provided. **We also want to keep robust sample sizes
> in each benchmark, and stratifying a benchmark by different characteristics would risk fragmenting
> the sample size in such a manner that we do not have a valid benchmark for some measures.**"

This is the key interpretive point: **collection-type separation is an exception CMS grants
reluctantly**, justified only by specification incomparability, against a stated default of one
national standard. It is not a policy of "fairness by peer group."

CMS also refused to segregate APM participants from non-APM clinicians in the benchmark pool
(**81 FR 77279**, F1):

> "we believe it is important to include APM participants when comparable information is available
> because the benchmark represents the true distribution of performance. **We do not want to
> establish separate, potentially lower, standards of care for clinicians who are not in APMs.**"

### 1.4 The all-payer vs. Medicare-only mismatch — flagged in 2016, never resolved by benchmark design

**81 FR 77278** (F1):

> "We recognized that **comparing all-payer performance to a benchmark that is built, in part, on
> Medicare data is a limitation** and noted we would monitor the benchmarks to see if we need to
> develop separate benchmarks. We also noted that this data issue would resolve in a year or two, as
> new MIPS data becomes the historical benchmark data in future years."

### 1.5 eCQM comparability across EHR vendors — the objection CMS never fully answered

Commenters warned that eCQMs are not calculated uniformly across EHRs. CMS's response
(**81 FR 77280**, F1) is notably about *future* improvement, not about benchmark construction:

> "Response: **To date, there have been issues with EHR data accuracy and consistency.** We have
> worked with ONC to address these issues through public feedback mechanisms, the availability of
> tools to support eCQM testing and value set uploads, and by encouraging vendors to consume the
> health quality measure format (HQMF) measure specifications directly. As these improvements
> penetrate to all systems in use by providers, we expect to see improvements in eCQM consistency."

### 1.6 Does CMS acknowledge that electronic reporters systematically score lower?

**Partly — and it matters exactly how.** CMS acknowledges (a) that performance *varies* by collection
type, and (b) that eCQM reporting specifically *may* produce lower performance. It has not published
a systematic magnitude. Three statements, in increasing directness:

**(a) Performance varies by collection type** — CY2026 PFS final rule, **90 FR 49634** (F8), quoted
in full in the one-page summary above. *Current law.* CMS's cited evidence is its own public
performance data (nn.249–250, `https://qpp.cms.gov/resources/performance-data`), with no figure
reproduced in the rule.

**(b) CMS knows the differences exist and designs around them** — CY2020 PFS final rule,
**84 FR 63016** (F3), quoted in the one-page summary. *Current law.*

**(c) eCQM reporting specifically may yield lower performance** — CY2025 PFS final rule,
**89 FR 98109** (F7), responding to ACOs warning that all-payer/all-patient eCQM reporting
disadvantages those with more underserved non-Medicare patients:

> "Response: All payer/all patient measures are valuable measures because they reflect the quality of
> care provided across all of a provider's patients and are consistent with CMS' health equity goals.
> All payer measures are broadly used across Medicare quality payment and quality reporting programs
> … **Nonetheless, we acknowledge that there may be instances when ACOs have lower performance
> reporting all payer/all patient eCQMs.**"

And CMS restates the concern as received from stakeholders (**89 FR 98436**, F7):

> "Some interested parties have also voiced concerns that **clinician specialty or patient population
> could yield lower quality scores when reporting eCQMs** and create resistance to switching to this
> collection type."

**How CMS says it addresses this.** Not by changing benchmarks. In the same rule, CMS's answer at
89 FR 98109 is a pointer to section IV.A.4.f.(1)(b)(iii) — the **Complex Organization Adjustment**,
a *numerator* adjustment (see §6). This is architecturally significant: CMS's stated remedy for
eCQM difficulty operates on the score, never on the benchmark ladder.

### 1.7 The Medicare CQM case — CMS's clearest statement that the comparison pool is the policy

Medicare CQMs exist only for MSSP ACOs, so their benchmark pool is ACOs only. Commenters objected.
CMS's response (**89 FR 98117**, F7) is the most explicit "you choose your comparison group"
statement in the corpus:

> "In our response to these comments, we stated that **given that benchmarks are specific to each
> collection type** and that we proposed to establish Medicare CQMs as a new collection type for only
> Shared Savings Program ACOs, only ACO data will be available to benchmark Medicare CQMs. … **ACOs
> that prefer to be compared to clinicians at large may do so by reporting eCQMs or MIPS CQMs**, for
> which CMS calculates a benchmark using data reported by MIPS eligible clinicians reporting under
> the chosen collection type."

And the "tournament" framing — CMS's own term for the pathology of a self-referential benchmark pool
(**89 FR 98117**, F7):

> "In performance year 2022, ACOs had a higher average performance on quality measures they were
> required to report in order to share in savings compared to other similarly sized clinician groups
> not in the Shared Savings Program. This includes statistically significant higher performance for
> quality measures related to diabetes and blood pressure control; breast cancer and colorectal
> cancer screening; tobacco screening and smoking cessation; and depression screening and follow-up.
> In shifting to Medicare CQMs, ACO performance would be benchmarked against other ACOs only
> reporting Medicare CQMs. **Since ACOs are high performers relative to comparably sized MIPS groups,
> benchmarking Medicare CQMs using only ACO data would lower some ACOs' MIPS measure achievement
> points on those measures. In other words, high-performing ACOs could earn lower measure achievement
> points relative to comparable MIPS groups because the Medicare CQM benchmarking pool is comprised
> of higher-than-average performance data-in effect, creating a ``tournament approach'' to scoring
> Medicare CQMs wherein ACOs must compete with other ACOs to earn measure achievement points.**"

**This is the cleanest CMS statement that identical care can score differently purely because of
which pool you are benchmarked against.** It is the reason flat benchmarks were extended to Medicare
CQMs (§5.3).

---

## 2. Historical (baseline-period) vs. performance-period benchmarks

**Status: current law**, in the phrase "during the applicable **baseline or performance** period" at
§ 414.1380(b)(1)(ii). Note the current CFR no longer spells out the preference ordering; it is
carried by preamble policy plus the (b)(1)(ii)(D)–(G) exceptions.

### 2.1 The rule as originally finalized

**81 FR 77282** (F1), the finalization bullets:

> "• For quality measures for which baseline period data is available, we are establishing at
> Sec. 414.1380(b)(1)(i) measure benchmarks are based on historical performance for the measure based
> on a baseline period. … **We will publish the numerical baseline period benchmarks prior to the
> start of the performance period** (or as soon as possible thereafter).
> • For quality measures for which there is no comparable data from the baseline period, we are
> establishing at Sec. 414.1380(b)(1)(ii) that CMS will use information from the performance period
> to create measure benchmarks. **We will publish the numerical performance period benchmarks after
> the end of the performance period.**"

### 2.2 What triggers a performance-period benchmark

Per **81 FR 77277** (F1), two triggers, both about the *absence of comparable baseline data*:

> "If a measure does not have baseline period information (for example, **new measures**), or if the
> **measure specifications for the baseline period differ substantially from the performance period**
> (for example, when the measure requirements change due to updated clinical guidelines), then we
> proposed to determine the array of benchmarks based on performance on the measure in the
> performance period, breaking the actual performance on the measure into deciles."

A new **collection type** triggers the same fallback, because no baseline data exists for it. That is
exactly what happened to Medicare CQMs: performance-period benchmarks for PY2024–PY2025, historical
from PY2026 (89 FR 98117, F7; and 88 FR 79110, F6 — already documented in prior research).

### 2.3 The predictability tradeoff — CMS's own framing

This is the passage to quote. **81 FR 77279** (F1), responding to commenters who objected to using
pre-MIPS data:

> "Response: **In establishing the performance standards, we had to choose between two feasible
> alternatives: Either develop benchmarks based on historical data and provide the numerical
> benchmarks in advance of the performance period; or use more current data for benchmarks and not
> provide the numerical benchmarks in advance of the performance period. We believe there is more
> value in providing advance notice for quality performance category measures so that MIPS eligible
> clinicians can set a clear performance goal for these measures, provided that historical data is
> available.** In many cases, MIPS quality measures are the same as those available under PQRS, so we
> believe that using PQRS data is appropriate for a MIPS benchmark."

CMS framed it as a **strict binary**: currency of data versus advance notice. You cannot have both.
It resolved the tradeoff toward advance notice for quality — and, notably, **the opposite way for
cost** (same page, 81 FR 77279):

> "In contrast, we do not believe there is more value in providing advance notice for cost
> performance category measures since the claims data for the cost performance category can vary due
> to payment policies, payment rate adjustment and other factors. Therefore, we believe having the
> cost performance category measures based on performance period data will be more beneficial to MIPS
> eligible clinicians given that it is based on more current data."

The contrast is the proof that advance notice, not accuracy, is the value driving the quality
benchmark design.

### 2.4 CMS's response to "we don't know the ladder in advance"

Commenters made exactly the ACO complaint. **81 FR 77278** (F1):

> "Comment: Commenters requested that CMS provide each measure's benchmarks in advance, with one
> recommending that CMS do so in the final rule and in future proposed rules so that MIPS eligible
> clinicians know their target goals … **The commenters stated that they did not want to be held
> accountable for performance if benchmarks cannot be provided in advance.**
>
> Response: **We agree with commenters that quality benchmarks should be made public and should be
> known in advance when possible so that MIPS eligible clinicians can understand how they will be
> measured.** We are finalizing that measure benchmarks are based on historical performance for the
> measures based on a baseline period. Those benchmarks will be known in advance of the performance
> period."

And, for the fallback case, CMS conceded the problem and answered with *scoring* protections rather
than benchmark changes (**81 FR 77278**, F1):

> "In this case, **while the benchmark methodology is being finalized in this final rule with comment
> period, the numerical benchmarks will not be known in advance of the performance period.** However,
> as discussed throughout this final rule with comment period, **we have added protections to protect
> MIPS eligible clinicians from poor performance**, particularly in the transition year."

Those protections were the 3-point floor for new/benchmark-less measures (81 FR 77281) and a global
3-point transition-year floor. The floor mechanism has since been replaced — under current law,
traditional-MIPS measures without a benchmark get **0** points (3 for small practices) per
§ 414.1380(b)(1)(i)(A), and new measures get a 7-point/5-point floor in their first/second years per
§ 414.1380(b)(1)(i)(C). The APP treats them differently again (§6.3).

### 2.5 The current-law preference, restated for ACOs

CY2027 proposed rule quoting the CY2025 proposed rule (**91 FR 44041**, F9):

> "As we stated in the CY 2025 PFS proposed rule (89 FR 61860), **the use of historical benchmarks,
> when data are available, allows Shared Savings Program ACOs to know benchmarks prior to start of
> the PY and create opportunities for improvement.**"

CMS then proposes to *abandon* that preference for Medicare CQMs (§5.4), saying at **91 FR 44041**
(F9), **PROPOSED**:

> "**We believe it is no longer logical to apply this benchmark methodology to Medicare CQMs** due to
> Shared Savings Program ACOs' concerns that quality-related changes are disruptive to the transition
> to digital quality measurement as well as due to the sunsetting of the population and income
> adjustment…"

---

## 3. Decile construction

**Status: current law**, § 414.1380(b)(1)(ii)(A) and (b)(1)(iii); data completeness at § 414.1340.

### 3.1 Why deciles at all

**81 FR 77282** (F1):

> "We proposed in Sec. 414.1380(b)(1)(x) of the proposed rule (81 FR 28251) **to establish benchmarks
> using a percentile distribution, separated into deciles, because it translates measure-specific
> score distributions into a uniform distribution of MIPS eligible clinicians based on actual
> performance values.** For each set of benchmarks, we proposed to calculate the decile breaks for
> measure performance and assign points for a measure based on the benchmark decile range in which
> the MIPS eligible clinician's performance rate on the measure falls. … **We proposed to assign
> partial points to prevent performance cliffs for MIPS eligible clinicians near the decile breaks.**
> The partial points would be assigned based on the percentile distribution."

The purpose is **normalization**: deciles convert measures with wildly different natural rate scales
into a common 1–10 points currency. That is precisely why the same performance rate means different
things in different collection types — the ladder is fitted to each pool's own distribution.

CMS restated the identical rationale nine years later for the Ambulatory Specialty Model
(**90 FR 49634**, F8): "because it translates measure-specific score distributions into a uniform
distribution of ASM participants based on actual performance values."

### 3.2 The 20-clinician/entity minimum — and exactly why 20

**81 FR 77277** (F1). This is the rationale; it is arithmetic, not statistics:

> "To ensure that we have robust benchmarks, we proposed that each benchmark must have a minimum of
> 20 MIPS eligible clinicians who reported the measure meeting the data completeness requirement …
> as well as meeting the required case minimum criteria for scoring… **We proposed a minimum of 20
> because, as discussed below, our benchmarking methodology relies on assigning points based on
> decile distributions with decimals. A decile distribution requires at least 10 observations. We
> doubled the requirement to 20 so that we would be able to assign decimal point values and minimize
> cliffs between deciles. We did not want to increase the benchmark sample size requirement due to
> concerns that an increase could limit the number of measures with benchmarks.**"

Two design facts follow. First, 20 is *twice the minimum needed to define ten deciles* — chosen so
partial points are meaningful. Second, CMS explicitly traded off statistical robustness against
**benchmark availability**: a higher threshold would produce fewer benchmarked measures, and CMS did
not want that.

Codified at **§ 414.1380(b)(1)(ii)(A)** (C1):

> "Each benchmark must have a minimum of 20 individual clinicians or groups who reported the measure
> meeting the case minimum requirement at paragraph (b)(1)(iii) of this section and the data
> completeness requirement at § 414.1340 and **having a performance rate that is greater than zero**."

### 3.3 The zero-performance-rate exclusion

**81 FR 77277** (F1), proposal:

> "We also proposed that MIPS eligible clinicians who report measures with a performance rate of 0
> percent would not be included in the benchmarks. In our initial analysis, we identified some
> measures that had a large cluster of eligible clinicians with a 0 percent performance rate. **We
> were concerned that the 0 percent performance rate represents clinicians who are not actively
> engaging in that measurement activity. We did not want to inappropriately skew the distribution.**"

Finalized at **81 FR 77278** (F1): "We are finalizing the policy to exclude 0 percent scores from the
benchmarks for the transition year." This is still in the codified text today as the
"performance rate … greater than zero" clause. Note the consequence for *inverse* measures (like
Quality ID 001, where lower is better): the exclusion removes the *best* performers from an inverse
measure's pool. No CMS document located addresses this asymmetry — **do not assert that CMS
considered it.**

### 3.4 One submission = one data point (CMS reversed its own proposal)

CMS proposed beneficiary-weighting the benchmark, then dropped it. **81 FR 77280** (F1):

> "In MIPS, weighting individual or group values by the number of patients is similar to cloning or
> replicating that individual or group score in the percentile distribution. … For example, assume a
> given benchmark has one large group and several smaller groups and individual reporters. The large
> group cares for 20 percent of the beneficiaries represented in the benchmark. If we weight the
> benchmark by patient weight, then another MIPS eligible clinician with a score just above or just
> below that performance rate will have a score that is different by a point or two, **not because of
> differences in performance but because of differences in the number of beneficiaries cared for**…
>
> Therefore, we are not finalizing our proposal to patient weight the benchmarks. Instead, **we will
> count each submission, either by individual or group, as a single data point for the benchmark.**"

Consequence for the simulator: a 200,000-beneficiary ACO and a solo practitioner contribute **equally**
to a decile ladder. This is why the Medicare CQM pool (a few dozen ACO submissions) can produce a
ladder shaped very differently from an eCQM pool of tens of thousands of MIPS submissions.

### 3.5 The case minimum (20 cases)

**81 FR 77287** (F1):

> "**We seek to ensure that MIPS eligible clinicians are measured reliably**; therefore, we proposed
> at Sec. 414.1380(b)(1)(iv) to use for the quality performance category measures the case minimum
> requirements for the quality measures used in the 2018 VM (see Sec. 414.1265): **20 cases for all
> quality measures, with the exception of the all-cause hospital readmissions measure, which has a
> minimum of 200 cases.** … MIPS eligible clinicians that report measures with fewer than 20 cases
> (and the measure meets the data completeness criteria) **would receive recognition for submitting
> the measure, but the measure would not be included for MIPS quality performance category scoring**."

Codified at **§ 414.1380(b)(1)(iii)** (C1): "Except as otherwise specified in the MIPS final list of
quality measures described in § 414.1330(a)(1), the minimum case requirement is 20 cases."

Note the rationale is **inherited from the Value Modifier**, by reference to a CY2016 PFS reliability
analysis (Table 46 of the CY2016 PFS final rule, 80 FR 71282) — CMS did not conduct a fresh
reliability analysis for MIPS quality measures. The case minimum does double duty: it filters *who
gets scored*, and (via (b)(1)(ii)(A)) it filters *who counts toward building the benchmark*.

### 3.6 The data completeness threshold

Current: **75%** for MIPS payment years 2026–2030 (§ 414.1340; see `mssp-scoring-rules.md` for the
paragraph-level cite). The increase from 70% to 75% was finalized in the CY2023 PFS final rule.

CMS's stated rationale for the *level* is readiness and burden, **not** statistical validity
(**87 FR 70049**, F5):

> "As noted in the CY 2023 PFS proposed rule, we believe that **increasing the data completeness
> criteria threshold to 75 percent … provides MIPS eligible clinicians with ample time prepare for a
> higher standard as most clinicians already meet or exceed this standard.**"

Responding to burden objections (**87 FR 70050**, F5):

> "Response: We disagree with commenters that increasing the data completeness criteria threshold
> would unnecessarily increase the reporting burden … Individual MIPS eligible clinicians, groups,
> and virtual groups will have had 4 years of a maintained data completeness criteria threshold of at
> least 70 percent before transitioning … and will have more than 12 months to prepare…"

**Be careful here.** It is tempting to say data completeness exists to prevent cherry-picking
favorable patients. That is a reasonable reading of the mechanism, but this research did **not** find
CMS stating that purpose for the threshold in F1–F9. Report the mechanism; do not attribute the
anti-cherry-picking rationale to CMS without a citation.

### 3.7 Why measures with too few submissions get no benchmark — and what "no benchmark" means

The chain is: fewer than 20 qualifying reporters ⇒ **no benchmark is published** ⇒ the measure cannot
be scored on achievement. CMS has always distinguished this from the "new measure" case.
**81 FR 77281** (F1):

> "We also note that the new measure 3-point floor for measures without a previously published
> benchmark, is different than **class 2 measures** … **that lack a benchmark because we do not have a
> minimum of 20 MIPS eligible clinicians who reported the measure meeting the case minimum and data
> completeness requirements.** The new measure 3-point floor allows MIPS eligible clinicians to be
> scored on performance … However, the class 2 measures … is not a floor but rather an automatic score
> of 3 points, in which MIPS eligible clinicians **are not scored on performance**."

CMS's later statement of purpose for capping benchmark-less measures (**84 FR 63013**, F3, quoting
82 FR 53729):

> "**we selected the 3-point cap because we did not want to provide more credit for reporting a
> measure that cannot be reliably scored against a benchmark than for measures for which we can
> measure performance against a benchmark.** We remind commenters that we only apply the 3-point cap
> if we cannot create a benchmark for a measure."

Under current law that treatment has hardened to 0 points in traditional MIPS
(§ 414.1380(b)(1)(i)(A)) — but under the **APP**, § 414.1367(c)(1)(i) instead *excludes* the measure
from both numerator and denominator (see §6.3, and `mssp-scoring-rules.md` for the operative PY2026
consequence). CMS's rationale for the ACO-specific hold-harmless is at **88 FR 79123** (F6), already
captured in prior research:

> "given that the Shared Savings Program does not determine which quality measures do not have a
> benchmark and that ACOs do not have a choice of measures they can report under the APP, **we do not
> want to adversely impact shared savings determinations for events outside the ACOs' control**"

And a compact 2025 restatement of the same principle (**90 FR 49634**, F8, on ASM):

> "**We believe that it would be unfair to penalize ASM participants due to a lack of a benchmark.**"

---

## 4. Topped-out measures and the 7-point cap

**Status: current law**, § 414.1380(b)(1)(iv); definitions at § 414.1305.

**Nothing in the prior research files in this directory covered this topic.** Everything in this
section is new.

### 4.1 Identification — the definition

**81 FR 77286** (F1), finalizing definitions at § 414.1305:

> "for **process measures**, we are defining at Sec. 414.1305 topped out process measures as those
> with a **median performance rate of 95 percent or higher**. For other measures, we are defining at
> Sec. 414.1305 **topped out non-process measures** using a definition similar to the definition used
> in the Hospital VBP Program: **Truncated Coefficient of Variation is less than 0.10 and the 75th
> and 90th percentiles are within 2 standard errors.**"

With footnotes on the same page (F1):

> "\25\ The 5 percent of MIPS eligible clinicians with the highest scores, and the 5 percent with
> lowest scores are removed before calculating the Coefficient of Variation.
> \26\ This is a test of whether the range of scores in the upper quartile is statistically
> meaningful."

The concept CMS was targeting (**81 FR 77282**, F1):

> "We did not propose to base scoring on decile distributions … when performance is clustered at the
> high end (that is, ``topped out'' measures), **as true variance cannot be assessed**. MIPS eligible
> clinicians report on different measures and may elect to submit measures on which they expect to
> perform well."

**Topped-out is a property of a benchmark, therefore of a (measure × collection type) cell** —
codified in § 414.1380(b)(1)(iv)(B) as "the benchmark for the applicable collection type." CMS spelled
this out (**82 FR 53721–53722**, F2):

> "We noted that **because we create a separate benchmark for each submission mechanism available for
> a measure, a benchmark for one submission mechanism for the measure may be identified as topped out
> while another submission mechanism's benchmark may not be topped out. The topped out designation
> and special scoring apply only to the specific benchmark that is topped out, not necessarily every
> benchmark for a measure.** For example, the benchmark for the claims submission mechanism may be
> topped out for a measure, but the benchmark for the EHR submission mechanisms for that same measure
> may not be topped out."

This is directly observable in the PY2026 data: Quality ID 134 is topped out with a 7-point cap in
MIPS CQM and Medicare Part B Claims, but not in eCQM (see `benchmarks-py2026.md`).

### 4.2 CMS's stated purpose for special scoring

**82 FR 53722** (F2):

> "**we believe it is important to score topped out measures differently because they could have a
> disproportionate impact on the scores for certain MIPS eligible clinicians and topped out measures
> provide little room for improvement for the majority of MIPS eligible clinicians who submit them**"

The proposed cap was **6** points, with this rationale (**82 FR 53722**, F2):

> "We proposed a 6-point cap for multiple reasons. First, we noted that we believe applying a cap to
> the current method of scoring a measure against a benchmark **is a simple approach that can easily
> be predicted by clinicians**. Second, **the cap will create incentives for clinicians to submit
> other measures for which they can improve and earn future improvement points.** … **The rationale
> for a 6-point cap is that 6 points is the median score for any measure as it represents the start of
> the 6th decile** for performance and represents the spot between the bottom 5 deciles and start of
> the top 5 deciles."

### 4.3 Why 7 and not 6 — CMS changed its mind in response to comment

**82 FR 53724** (F2). This is the definitive rationale for the number 7:

> "Response: … However, we do understand that a significant number of measures may qualify for this
> scoring cap starting in the 2019 MIPS performance period/2021 MIPS payment year, which could affect
> scores for MIPS eligible clinicians with a limited choice of measures. **Therefore, we have been
> persuaded by the comments to increase the scoring cap to 7 points. We chose 7 points for several
> reasons. First, for simplicity in the scoring system, we believe we should have a single integer
> number cap for all topped out measures that are subject to the cap. We believe it would be easier
> for clinicians to understand a cap of 7 points than a policy which uses partial points or a system
> that gradually decreases points the longer a measure is topped out.** One additional component in
> assuring consistency in scoring is to apply the scoring cap to all identified topped out measures,
> including outcome and cross-cutting measures. **Second, 7 points is higher than the median, so this
> cap provides credit for good performance. Finally, the 7 point cap would mitigate to some degree the
> scoring concerns for clinicians who have a large number of topped out measures, while still
> providing incentives to all eligible clinicians to submit measures that are not topped out.**"

### 4.4 The lifecycle: identify → cap → consider removal → remove

**82 FR 53721** (F2):

> "**lifecycle for topped out measures by which, after a measure benchmark is identified as topped out
> in the published benchmark for 2 years, in the third consecutive year it is identified as topped out
> it will be considered for removal through notice-and-comment rulemaking or the QCDR approval process
> and may be removed from the benchmark list in the fourth year**, subject to the phased in approach…"

Rationale for the 4-year span (**82 FR 53640**, F2):

> "topped out measure lifecycle has built in a 4-year timeline, which would be triggered when topped
> out measures are identified through the benchmarks as topped out. **We believe the 4-year timeline
> would provide MIPS eligible clinicians, groups, and third-party intermediaries with a sufficient
> amount of time to adjust to the removal of identified topped out measures.** Topped out measures are
> identified through the benchmarks, and **cannot be identified as topped out until the benchmark is
> established**. … We believe that the 4-year timeline will provide MIPS eligible clinicians with
> sufficient time to incorporate measures into their EHR systems and to update their clinical
> practice."

CMS also explained why removal is preferable to a permanent cap (**82 FR 53724**, F2):

> "we believe that **considering the removal of topped out measures beginning with the 2019 MIPS
> performance period, subject to removal criteria, is more appropriate than maintaining an indefinite
> cap on scoring**."

### 4.5 Current codified form, and the CMS Web Interface / limited-measure-choice carve-outs

**§ 414.1380(b)(1)(iv)** (C1), current law:

> "(A) For the 2020 MIPS payment year, each topped out measure specified by CMS through rulemaking
> receives no more than 7 measure achievement points…
> (B) Beginning with the 2021 MIPS payment year, except as provided for in paragraph (b)(1)(iv)(C) of
> this section, **each measure (except for measures in the CMS Web Interface) for which the benchmark
> for the applicable collection type is identified as topped out for 2 or more consecutive years
> receives no more than 7 measure achievement points in the second consecutive year it is identified
> as topped out, and beyond.**
> (C) Beginning with the CY 2025 performance period/2027 MIPS payment year, measures impacted by
> limited measure choice as specified in paragraph (b)(1)(ii)(E) of this section are not subject to
> the 7 measure achievement point cap…"

Why the CMS Web Interface was exempted (**82 FR 53721**, F2) — the reasoning is squarely about
measure choice and is the conceptual ancestor of paragraph (C):

> "we finalized that MIPS eligible clinicians submitting via the CMS Web Interface must submit all
> measures included in the CMS Web Interface (81 FR 77116). **Thus, if a CMS Web Interface measure is
> topped out, the CMS Web Interface submitter cannot select other measures. Because of the lack of
> ability to select measures, we did not propose to apply the proposed special scoring adjustment to
> topped out measures for CMS Web Interface** … Additionally, because the Shared Savings Program
> incorporates a methodology for measures with high performance into the benchmark, we noted that we
> do not believe capping benchmarks from the CMS Web Interface for the Quality Payment Program is
> appropriate."

**This carve-out logic matters for APP/APP Plus.** ACOs must report the entire required set — they
have no measure choice. The Web Interface exemption rested on exactly that fact; the current
"limited measure choice" exception at (b)(1)(ii)(E)/(b)(1)(iv)(C) generalizes it. Note, however, that
(b)(1)(iv)(C) is keyed to CMS's published limited-measure-choice list (specialty sets and MVPs), and
this research found **no** provision exempting APP Plus measures from the 7-point cap. Consistent with
that, PY2026 data shows 134 MIPS CQM capped at 7 for ACOs.

The "defined topped out measure benchmark" that replaces the cap for listed measures —
**§ 414.1380(b)(1)(ii)(E)** (C1), current law:

> "Beginning with the CY 2025 performance period/2027 MIPS payment year, CMS will publish a list in
> the Federal Register of topped out measures determined to be impacted by limited measure choice on a
> yearly basis. Measures included in the list are scored from 1 to 10 measure achievement points
> according to defined topped out measure benchmarks calculated from performance data in the baseline
> period in which **a performance rate of 97 percent corresponds to 10 percent of the performance
> threshold** for the corresponding performance year."

The identification method for that list is itself collection-type-specific — CY2026 final rule at
**90 FR 49904–49908**, described in the CY2027 proposed rule (**91 FR 44200–44201**, F9,
**PROPOSED context, describing current law**):

> "We finalized that **each specialty measure set and MVP is reviewed by collection type** to identify
> if the prevalence of topped out measures within such a set of measures hinders a clinician's ability
> to successfully participate in the MIPS quality performance category. … Specifically, **at the
> collection type level**, each measure is assigned points based upon the current benchmarking data:
> new measures receive 7 or 5 points based on year in the program, measures with benchmarks are given
> points based upon the highest decile achievable with a less than perfect score …, and **measures with
> no available historic benchmark are given 0 points**."

### 4.6 Topped-out vs. flat-benchmark — the distinction, stated precisely

These are routinely conflated. They are different in trigger, mechanism, and effect.

| | **Topped out** | **Flat percentage benchmark** |
|---|---|---|
| **What it is** | A *diagnosis* about a benchmark's distribution | A *substitute* benchmark construction method |
| **Trigger** | Statistical: process median ≥95%, or truncated CoV <0.10 with 75th/90th percentiles within 2 SE (§ 414.1305) | Policy/judgment: CMS determines the benchmark "may have the potential to result in inappropriate treatment" (§ 414.1380(b)(1)(ii)(C)), or a designated collection type ((F)), or MSSP's § 425.512(b)(6) |
| **Effect on the ladder** | **None.** The decile ladder is still computed from the data distribution | **Replaces** the ladder: deciles become fixed percentages (10/20/…/90) |
| **Effect on points** | **Caps** achievement at 7 points, from the 2nd consecutive topped-out year | **No cap.** A flat-benchmark measure can score the full 10 |
| **Selected by** | Automatic, from published benchmarks each year | Named in advance through notice-and-comment rulemaking |
| **Applies to** | The specific (measure × collection type) benchmark | Under (C): only collection types whose top decile would exceed 90% |

CMS itself drew the line, in the rule that created flat benchmarks (**84 FR 63015**, F3):

> "**We also note that the measures that we selected to apply the flat percentage benchmarks to are
> not topped out for any of the collection types.**"

And it declined a commenter's request to merge the two concepts (**84 FR 63015**, F3):

> "Comment: One commenter suggested that CMS apply flat percentage benchmarks to otherwise ``topped
> out'' patient safety measures that should remain in the program due to their importance to patient
> safety.
> Response: **We intend to apply this policy to all measures with potential for inappropriate
> treatment based on the patient's circumstances. We believe it is important that we take a
> performance based approach to scoring, such that our benchmarks are based on a distribution of
> scores. We do not believe it would be appropriate to apply this standard broadly to a measure
> without this analysis.**"

A measure can nonetheless be both — CMS's medical-officer assessment for flat benchmarks explicitly
considers "**whether the measure is topped out**" as one input (84 FR 63014, F3).

---

## 5. Flat percentage benchmarks as a category

**Status: current law**, with a substantial **proposed** expansion.

A flat percentage benchmark discards the observed distribution and fixes the deciles at round
percentages: performance ≥90% is the top decile, ≥80% the ninth, and so on (for inverse measures the
ladder runs the other way). Under a flat benchmark **the performance rate equals the percentile by
construction** — which is why "40th percentile" is directly readable off a flat ladder.

CMS uses flat benchmarks for **four distinct purposes**. Treating them as one policy is a mistake.

### 5.1 Use A — avoiding incentives for inappropriate treatment (§ 414.1380(b)(1)(ii)(C))

Origin: CY2020 PFS final rule, **84 FR 63014–63016** (F3). Current law.

The problem (**84 FR 63014**, F3):

> "we have heard concerns from stakeholders that for a few measures, **the benchmark methodology may
> incentivize the inappropriate treatment of certain patients, in order for a clinician to achieve a
> score in the highest decile**. Our scoring system already provides some protection from
> inappropriate treatment because all clinicians in the top 10 percent of the distribution receive the
> same 10-point score, thus a clinician with performance in the 90th percentile has no incentive to go
> higher. However, for certain measures with benchmarks set at very high or maximum performance in the
> top decile, we are concerned that these levels may not be representative and may not provide the
> most appropriate incentives for clinicians. … for example, intermediate outcome measures that may
> encourage clinicians to over treat patients in order to achieve the highest performance level.
> **Patient safety is our primary concern**; therefore, we proposed to establish benchmarks based on
> flat percentages in specific cases where we determine the measure's otherwise applicable benchmark
> can potentially incentivize treatment that can be inappropriate for a particular patient type."

Why flat percentages specifically, and the MSSP lineage (**84 FR 63014**, F3):

> "For the measures identified, we proposed to use a flat percentage, **similar to how the Shared
> Savings Program uses flat percentages to set benchmarks for measures with high performance**. We
> selected this methodology for the following reasons: First, **it is a straight-forward and simple
> methodology** that currently exists for some MIPS measures that are collected through the CMS Web
> Interface. Second, because we are applying this methodology to measures with very high performance,
> we believe this approach is consistent with the Shared Saving Program approach established at
> Sec. 425.502(b)(2)(ii) of using flat percentages to set benchmarks when many reporters demonstrate
> high achievement on a measure. **The Shared Savings Program uses this method to avoid penalizing
> high ACO performance; however, in this case, we will be applying the flat percentages to ensure that
> the benchmark does not result in inappropriate and potentially harmful patient treatment.**"

Note the two different purposes CMS distinguishes there: MSSP's historical use was **anti-penalty**;
MIPS's new use was **patient safety**. Same mechanism, different problem.

**The collection-type-selective trigger — critical for the simulator.** Flat benchmarks under (C)
apply *only* to collection types whose top decile would otherwise exceed 90% (**84 FR 63015**, F3):

> "**We are limiting the application of the flat percentage methodology to all collection types where
> the top decile for any measure benchmark is higher than 90 percent so that our flat percentage
> methodology will actually reduce or remove the incentive for inappropriate care. If the top decile
> was originally below 90 percent, using the flat percentages would actually raise the level up to 90
> percent, and therefore, provide a stronger incentive to provide inappropriate care in order to get
> the top score.**"

So a single Quality ID can have a flat ladder in one collection type and a data-driven ladder in
another **by design, on purpose, for a stated reason** — and that reason is that the collection types
had different distributions to begin with.

CMS's response to the resulting inconsistency objection is the most candid cross-collection-type
statement in the corpus (**84 FR 63016**, F3):

> "Comment: … one commenter expressed concern that the measures proposed for the application of the
> flat percentages are claims based measures and MIPS CQMs, and that **the application of the flat
> benchmark may unfairly lower the bar for clinicians utilizing the claims-based and MIPS CQM versions
> of the measures, without providing the same adjustment to all collection types**. Another commenter
> expressed concern that the approach would lead to **inconsistent evaluation of clinicians, as
> clinicians would be compared to their peers on some measures, but compared on flat thresholds on
> other measures that are unrelated to peer performance**.
>
> Response: **We recognize that not applying the same benchmarking methodology to all collection types
> may create some inconsistent evaluation between collection types for a single measure. On the other
> hand, we know there are differences in performance by data collection type, and we are concerned
> that if we apply this method to all collection types without regard to the collection type
> distribution, then we would harm those with top performance for certain collection types. Given this
> tension, we believe it is better to limit the benchmark proposal to those collection types where the
> top decile is 90 percent or higher.** We also intend to apply this policy in very limited
> circumstances… **At this time, we are proceeding cautiously with this approach by limiting
> application of this policy to two measures and two collections types.**"

Process safeguard (**84 FR 63014**, F3): a CMS medical-officer assessment, informed by "the medical
literature, published practice guidelines, and feedback from clinicians, groups, specialty societies,
and the measure steward," and then — "**Before applying the flat percentage benchmarking methodology
to any recommended measure, we will propose the modified benchmark for the applicable MIPS payment
year through rulemaking.**"

*(The two measures CMS named are Quality IDs 001 and 236; their specific history is covered by
separate research and is not re-derived here.)*

### 5.2 Use B — MSSP measures lacking adequate historical data (42 CFR § 425.512(b)(6))

CY2023 PFS final rule, **87 FR 69865** (F5). *Historical as applied (CMS Web Interface era), but the
pattern recurs.*

> "**We have determined that we do not have adequate historical data available for benchmarking for
> the Preventive Care and Screening: Screening for Depression and Follow-up Plan (Quality ID# 134)
> measure for the 2022 performance year. Therefore, we proposed pursuant to Sec. 425.512(b)(6) to set
> flat percentage benchmarks** for the … (Quality ID# 134) measure."

CMS's rationale here is about **preserving scored measures**, not safety (**87 FR 69865**, F5):

> "we believe it would be advantageous for the measure to keep its flat percentage benchmarks for the
> 2022 performance year **for continuity** and that **having another scored measure can be beneficial
> to an ACO's overall quality performance**. … We also noted that we believe ACOs might prefer to be
> scored under a greater number of measures which may improve their overall score… **Lastly, use of
> flat percentages allows ACOs with high scores to earn maximum or near maximum achievement points
> while allowing room for improvement and rewarding that improvement in subsequent years. Use of flat
> percentages also helps to ensure that ACOs with high performance on a measure are not penalized as
> low performers.**"

That last sentence pair becomes CMS's boilerplate rationale for every later flat-benchmark expansion.

### 5.3 Use C — a new collection type's first performance periods (§ 414.1380(b)(1)(ii)(F))

CY2025 PFS final rule, **89 FR 98117–98120** (F7). **Current law.**

> "**(F) Beginning in the CY 2025 performance period/2027 MIPS payment year, measures of the Medicare
> CQM collection type use flat benchmarks for their first two performance periods in MIPS.**"
> — § 414.1380(b)(1)(ii)(F) (C1)

Rationale (**89 FR 98118**, F7):

> "**The use of flat benchmarks would allow ACOs with high scores to earn maximum or near maximum
> achievement points while allowing room for quality improvement and rewarding that improvement in
> subsequent years. Use of flat benchmarks also helps to ensure that ACOs with high quality
> performance on a measure are not penalized as low performers.**"

The problem it solves is the **tournament effect** described in §1.7 (89 FR 98117) — a benchmark pool
made entirely of high performers. Note the design logic: because CMS would not pool Medicare CQMs
with MIPS reporters (specifications and population differ), it instead **replaced the ladder** rather
than **changing the pool**. That is the whole architecture in miniature.

CMS deliberately time-boxed it to two periods, on the historical-benchmark preference
(**89 FR 98118**, F7):

> "The use of historical benchmarks, when data are available, is consistent with MIPS benchmarking
> policies at Sec. 414.1380(b)(1)(ii), allow ACOs to know benchmarks prior to start [of the PY]…"

Commenters asked for permanence; CMS declined at the time (per **91 FR 44040**, F9, recounting
89 FR 98120): "many commenters recommended that flat benchmarks for Medicare CQM be made permanent
rather than for 2 years and noted that **flat benchmarks make Medicare CQM scoring more
predictable**."

### 5.4 Use D — PROPOSED: all Medicare CQMs, and the new Medicare eCQM collection type

**CY2027 PFS proposed rule (CMS-1848-P), 91 FR 44039–44044 and 44205 (F9). PROPOSED — NOT LAW.**
Comments close 2026-09-14.

Proposed § 414.1380(b)(1)(ii)(F)(2) would make flat benchmarks apply to **all** Medicare CQMs
beginning with the CY2026 performance period — retroactively converting Quality IDs 001, 134 and 236,
which CMS *actually published* PY2026 historical benchmarks for. Proposed (G)(1) would apply flat
benchmarks to the new Medicare eCQMs collection type from CY2027.

Stated rationale — continuity through the digital transition (**91 FR 44041**, F9):

> "**Given the challenges and concerns that Shared Savings Program ACOs have shared regarding
> navigating additional Shared Savings Program policy changes in a time of larger quality reporting
> transition, coupled with Shared Savings Program ACO patient data privacy concerns and lack of
> capability to report other measure collection types such as eCQMs … we propose to extend the use of
> flat benchmarks to score all Medicare CQMs for PY 2027 and subsequent PYs, and for Quality IDs 001,
> 134, and 236 for PY 2026.**"

Reversal of the historical-benchmark preference (**91 FR 44041**, F9):

> "**We believe it is no longer logical to apply this benchmark methodology to Medicare CQMs** due to
> Shared Savings Program ACOs' concerns that quality-related changes are disruptive to the transition
> to digital quality measurement as well as due to the sunsetting of the population and income
> adjustment as finalized in the CY 2026 PFS final rule…"

Compensating for the removed population-and-income adjustment (**91 FR 44042**, F9):

> "Since the population and income adjustment is no longer applicable beginning in PY 2026 … using
> flat benchmarks to score Quality IDs 001, 134, and 236 if reported via the Medicare CQMs collection
> type for PY 2026 … **would further support Shared Savings Program ACOs that will no longer have
> access to the population and income adjustment and help ensure that Shared Savings Program ACOs with
> high quality performance on a measure are not penalized as low performers.**"

A distinct, fourth rationale — **benchmark-availability insurance** (**91 FR 44053**, F9):

> "**The use of flat benchmarks to score Medicare CQMs and Medicare eCQMs would mitigate the risk that
> MIPS would not be able to calculate benchmarks for these measures in the APP Plus quality measure
> set.**"

That sentence is load-bearing: it is CMS's justification for *also* deleting the § 425.512(a)(7)
"lacks a benchmark" trigger for PY2027+. Flat benchmarks are being used as a structural guarantee
that a benchmark always exists.

Retroactivity justification (**91 FR 44042**, F9):

> "Section 1871(e)(1)(A) of the Act prohibits the Secretary from applying substantive changes in
> regulations retroactively … except where the Secretary determines … that failure to apply the change
> retroactively would be contrary to the public interest. … The evaluation of Shared Savings Program
> ACOs' PY 2026 quality performance … will occur in PY 2027. **Retroactive application of flat
> benchmarks for Medicare CQMs for PY 2026 would enable the Shared Savings Program to better recognize
> the quality of care provided in PY 2026 and incentivize future improvements based on the evaluation
> of that care.**"

**Known drafting inconsistency.** At **91 FR 44205** (F9) CMS describes the same proposal as
"extending the use of flat benchmarks to score all Medicare CQMs for **performance year 2025** and
subsequent performance years," while section III.G.3.c and the proposed regulation text say the
CY2026 performance period. `pfs-cy2027-proposed.md` caveat 5 already flags this; the proposed
regulation text controls (CY2026).

**Medicare eCQMs are excluded from both the reporting incentive and the CoA** (91 FR 44050, F9 —
established in prior research), so flat benchmarks are their *only* scoring accommodation.

---

## 6. The scoring-vs-benchmarking distinction

This is an architectural boundary worth teaching explicitly, because CMS keeps it strictly: **the
benchmark determines how a performance rate becomes points; everything else operates on points.**

### 6.1 The formula

**§ 414.1380(b)(1)(vii)** (C1), current law — quality performance category score =

```
  (measure achievement points + measure bonus points + Complex Organization Adjustment)
  ---------------------------------------------------------------------------------------
                       total available measure achievement points

  + improvement percent score,     capped at 100 percentage points
```

### 6.2 Measure achievement points — the only place the benchmark acts

**§ 414.1380(b)(1)(i)** (C1):

> "Except as provided under paragraph (b)(1)(i)(C) of this section, beginning with the CY 2023
> performance period/2025 MIPS payment year, MIPS eligible clinicians receive **between 1 and 10
> measure achievement points (including partial points)** for each such measure. Except as specified
> otherwise under paragraph (b)(1)(ii) of this section, **the number of measure achievement points
> received for each such measure is determined based on the applicable benchmark decile category and
> the percentile distribution.**"

Three gates must all be satisfied to earn achievement points: a **benchmark** exists ((b)(1)(ii)), the
**case minimum** is met ((b)(1)(iii)), and **data completeness** is met (§ 414.1340). Also note
(b)(1)(i): where a clinician submits the same measure via multiple collection types, they are "scored
only on the data submission with the **greatest** number of measure achievement points" — a codified
acknowledgment that collection type changes the score.

New-measure floors — **§ 414.1380(b)(1)(i)(C)** (C1): 7–10 points in a measure's first year in MIPS,
5–10 in its second. These are *scoring* floors layered on top of a real benchmark, not benchmark
substitutes.

### 6.3 Available points (the denominator) — where exclusions bite

Two different regimes, and the difference is the whole PY2026 story:

- **Traditional MIPS** — § 414.1380(b)(1)(i)(A): a submitted measure meeting data completeness but
  lacking a benchmark or case minimum gets **0 points** (3 for small practices) and **stays in the
  denominator**. Missing the benchmark is a penalty.
- **APP / APP Plus** — § 414.1367(c)(1)(i): such a measure is **excluded from both** total measure
  achievement points and total available measure achievement points. The denominator shrinks.
  (Verbatim text and PY2026 consequences: `mssp-scoring-rules.md` §(a).)

CMS's rationale for the ACO-specific treatment is the no-choice/no-control principle at 88 FR 79123
(F6), quoted in §3.7.

### 6.4 Bonus points — a historical layer, now nearly gone

**§ 414.1380(b)(1)(v)** (C1) still contains the high-priority-measure bonus and the end-to-end
electronic reporting bonus, both explicitly sunset: high priority "**Beginning in the 2022 performance
period/2024 MIPS payment year, MIPS eligible clinicians will no longer receive these measure bonus
points**"; end-to-end limited to "CY 2017 through 2021 MIPS performance periods." Bonus points sat in
the numerator, outside the denominator — which is why they could inflate scores above straight
achievement.

### 6.5 Where the Complex Organization Adjustment sits

**§ 414.1380(b)(1)(vii)(C)** (C1), current law from the CY2025 performance period:

> "a Virtual Group and an APM Entity receives **one measure achievement point for each eCQM submitted**
> that meets the case minimum requirement at paragraph (b)(1)(iii) of this section and the data
> completeness requirement at § 414.1340. Each measure may not exceed 10 measure achievement points.
> The total adjustment … may not exceed **10 percent of the total available measure achievement
> points**."

**Architecturally: the CoA is in the numerator. It never touches a benchmark.** CMS's rationale
(**89 FR 98437**, F7):

> "To account for the organizational complexities faced by Virtual Groups and APM Entities, including
> ACOs in the Shared Savings Program, we proposed to establish a Complex Organization Adjustment…
> **Adding one point for each eCQM would help complex organizations to overcome barriers to reporting
> eCQMs while not masking overall quality performance. By limiting the Complex Organization Adjustment
> to Virtual Groups and APM Entities, we can limit scoring inflation and target this intervention to
> those facing challenges to eCQM implementation.** Moreover, while acknowledging the Complex
> Organization Adjustment is a recognition of current challenges to eCQM reporting we believe that
> adoption of approaches to the exchange and aggregation of quality data enabled by Fast Healthcare
> Interoperability Resources (FHIR) Application Programing Interfaces (APIs) will reduce or eliminate
> the barriers posed by organizational complexities to eCQM reporting **and will revisit and end this
> Adjustment** as uptake of capabilities for quality data aggregation and exchange using FHIR APIs
> increases…"

And CMS distinguishes it from a pure reporting bonus (**89 FR 98437**, F7):

> "**This adjustment differs from the previous end-to-end electronic reporting bonus in that it does
> not merely award measure achievement points for reporting but provides an adjustment for clinicians
> facing complex organizational barriers for adopting the eCQM collection type.**"

**The teaching point.** CMS's answer to "eCQM reporting is harder and may score lower" was a
+1-point-per-eCQM numerator adjustment available only to eCQM reporters — **not** an easier eCQM
benchmark. The benchmark ladder is left to describe the distribution honestly; the compensation is
applied afterward, visibly, and capped. Contrast Medicare CQMs, where CMS did the opposite: it
replaced the ladder (flat benchmarks) and gave **no** CoA. Two different architectural answers to two
different problems.

Additional current-law detail already established in prior research and reused here: the CoA cap
"is relative to the total available measure achievement points, and **by design, would increase or
decrease based on the number of measures being scored**" (90 FR 49813, F8); the CoA "is accounted for
in the calculation of" the score whereas the health equity adjustment was "added to" it
(90 FR 49805, F8); and the binding PY2026 constraint is the eCQM count (5 points), not the 10% cap
(90 FR 49804/49809; see `mssp-scoring-rules.md` §(c)).

---

## 7. CMS analysis and data comparing collection types

### 7.1 The headline number: flat benchmarks ≈ +11 percentage points

**PROPOSED-rule analysis. CY2027 PFS proposed rule, 91 FR 44042 (F9).** Verbatim — this is the
sentence, with its pinpoint page (prior research had only a paraphrase and a two-page range):

> "We analyzed PY 2024 data on Shared Savings Program ACOs that reported all three Medicare CQMs in
> the APP quality measure set, which had performance-based benchmarks, and compared PY 2024 quality
> scores to simulated quality scores using flat benchmarks for the three Medicare CQMs. **Flat
> benchmarks were estimated to increase average quality scores by 11 percentage points in this
> analysis.**"

Footnote 254 on the same page reads, in full: "Findings are based on internal analysis." (The adjacent
footnote 253 for the ACO interviews reads "Findings are based on internal analysis of interviews with
ACOs that reported Medicare CQMs for PY 2024.") **These are unpublished internal analyses — cite them
as CMS's claims, not as reproducible facts.**

### 7.2 The second analysis: 14 pp vs 4 pp

**91 FR 44041–44042 (F9), PROPOSED**, recounting an analysis first presented in the CY2026 final rule
at 90 FR 49807 (F8):

> "we conducted an internal analysis of the PY 2024 Shared Savings Program ACO quality results to
> better understand the potential impact of the proposed removal of the population and income
> adjustment on **13 ACOs** that earned the population and income adjustment bonus points and reported
> only Medicare CQMs. … **Had flat benchmarks been applied to the three Medicare CQMs in the APP
> quality measure set in PY 2024, the average MIPS quality performance category score earned by these
> 13 Shared Savings Program ACOs would have been on average 14 percentage points higher compared to an
> average increase of 4 percentage points that these Shared Savings Program ACOs earned from the
> population and income adjustment in PY 2024, a difference of 10 percentage points.**"

CMS's own characterization (**91 FR 44042**, F9): "**This analysis further reflected the substantial
impact of flat benchmarks on Shared Savings Program ACOs' quality scores.**"

**Interpretation for the simulator.** An 11–14 percentage-point swing from *nothing but changing the
benchmark construction method*, holding clinical performance fixed, is CMS's own quantification of how
much the ladder — not the care — drives the score. This is the strongest citable evidence for the
app's core teaching point.

### 7.3 CMS's evidence that ACOs outperform comparable MIPS groups

**89 FR 98117 (F7), current law.** Quoted in full in §1.7. CMS cites its own 2023 press release
(nn.539–540, `https://www.cms.gov/newsroom/press-releases/medicare-shared-savings-program-saves-medicare-more-18-billion-2022-and-continues-deliver-high`)
for statistically significant higher ACO performance on diabetes and blood pressure control, breast
and colorectal cancer screening, tobacco screening/cessation, and depression screening/follow-up.
**No effect sizes are given in the rule.**

### 7.4 Complex Organization Adjustment magnitude

**90 FR 49808 and 49810 (F8), current law** — established in prior research (`answers-q2-coa.md`):
for 18 PY2024 ACOs, the CoA was worth about **6 percentage points** versus about **3 percentage
points** from the health equity adjustment. This is the closest CMS comes to sizing the eCQM-specific
accommodation.

### 7.5 What CMS did **not** publish

State these as gaps, not as findings:

1. **No CMS quantification of the eCQM-vs-other-collection-type score gap.** CMS asserts "performance
   varies by collection type in MIPS" (90 FR 49634) and points to `qpp.cms.gov/resources/performance-data`,
   but reproduces no figure. The project's own PUF-derived gap numbers (digital-only median 74.58 vs
   Web-Interface-only 84.29 in PY2024; see `mssp-py2024-results.md` and `answers-q1-empirical.md`) are
   **this project's analysis, not CMS's** — and they measure a *reporting-mechanism* gap that mixes
   benchmark effects with EUC flooring and other scoring effects. `answers-q1-empirical.md` is
   explicit that the EUC-flooring component is "a score effect, not a benchmark effect." Do not
   present those numbers as CMS's estimate of a benchmark effect.
2. **No follow-up on the 2016 monitoring commitment** about clinicians selecting favorable submission
   mechanisms (81 FR 77278). Nothing in F2–F9 reports results.
3. **No rationale, anywhere located, for how the zero-performance-rate exclusion interacts with
   inverse measures.**
4. **No CMS statement that data completeness exists to prevent selective patient reporting** — the
   stated rationale for the 75% level is readiness and burden (87 FR 70049–70050).
5. **No reliability analysis specific to MIPS quality measures behind the 20-case minimum** — it is
   inherited from the Value Modifier (81 FR 77287, citing 80 FR 71282).
6. The RIA of the CY2027 proposed rule (91 FR 44198 ff.) describes the flat-benchmark proposals
   qualitatively; the quantitative flat-benchmark estimates live in the **preamble** at 91 FR
   44041–44042, not in the RIA's dollar tables.

---

## Caveats and gaps

1. **Page attribution method.** Every page number was resolved by locating the nearest preceding
   `[[Page NNNNN]]` marker in the FR full-text file. Where a quote straddles a page break this is
   noted inline (e.g. 82 FR 53721–53722). Quotes are transcribed from the FR `.txt` rendering, which
   uses double-backtick/double-quote conventions (``topped out'') and line-wraps mid-sentence;
   whitespace has been normalized, wording has not.
2. **The CY2027 material is PROPOSED.** Comments close 2026-09-14; a final rule is expected around
   November 2026. Nothing in §5.4 or §7.1–7.2 is law. The internal analyses behind the 11 pp and
   14/4/10 pp figures are unpublished.
3. **Flat benchmarks for Quality IDs 236 and 001 specifically** are out of scope here by design.
   §5.1 documents only the general § 414.1380(b)(1)(ii)(C) policy those measures instantiate.
4. **§ 414.1380(b)(1)(iv)(C) and the APP Plus set.** This research found no provision exempting APP
   Plus measures from the 7-point topped-out cap, and PY2026 data is consistent with the cap applying
   (134 MIPS CQM). But the limited-measure-choice list is published annually and this file did not
   verify the CY2026 or proposed CY2027 lists against the APP Plus measures. **Re-check before
   relying on it.**
5. **Paragraph renumbering.** Several provisions moved between 2016 and today (separate benchmarks:
   (b)(1)(iii) → (b)(1)(ii); topped-out lifecycle: (b)(1)(xiii) → (b)(1)(iv); case minimum:
   (b)(1)(iv) → (b)(1)(iii)). Citations above give the paragraph as it existed in the cited document
   and, separately, the current paragraph from C1. Do not assume a 2016 paragraph letter is still
   valid.
6. **CAHPS benchmarks** are not addressed by this file. CMS finalized separate CAHPS survey-vendor
   benchmarks in 2016 (81 FR 77278) but this research did not examine how the summary survey measures
   aggregate — an open question already recorded in `mssp-scoring-rules.md` caveat 2.
7. **The improvement percent score** appears in the § 414.1380(b)(1)(vii) formula but was not
   researched here; it is not available to APM Entities under the APP in the same way and should be
   verified separately before being modeled.
8. **Not verified independently:** all CMS statements of empirical fact quoted above (ACO
   outperformance, flat-benchmark impact estimates, CoA impact estimates) are reported as CMS's
   claims. Where this project has its own competing measurements, they are labeled as such in §7.5.
