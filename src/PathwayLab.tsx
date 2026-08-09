import { useEffect, useMemo, useRef, useState } from "react";
import type * as React from "react";

/* ============================================================
   APP PLUS PATHWAY LAB — VL-04
   A standalone lab on the visual language (rev 3), now wired to
   REAL PY2026 QPP benchmark decile cutpoints (qpp.cms.gov
   benchmarks file) for the five APP Plus reportable measures.

   Core realism:
   - Each measure × collection type has its actual cutpoint table
     (historical = irregular; flat-percentage = uniform bands;
     134 MIPS CQM is topped-out with a 7-point cap — all real).
   - The SAME underlying care rate produces DIFFERENT measured
     rates per pathway (eCQM capture gaps; Medicare-only
     population shift) and lands on DIFFERENT ladders.
   - Global pathway switch + per-measure override.
   - Three comparable ACO stories with plausible financials.
   ============================================================ */

const T = {
  bg: "#EDF0F2", film: "#F7F9FA", line: "#C9D2D8", grid: "#DEE4E8",
  ink: "#1F2A33", inkSoft: "#5B6B77", inkFaint: "#8C9AA5",
  pass: "#16A34A", fail: "#DC2626", grayed: "#AEB9C1", fixed: "#9AA7B0",
  money: "#0F766E", debt: "#B91C1C",
};
type PathwayId = "ecqm" | "medecqm" | "mipscqm" | "medcqm";
interface CollectionType {
  label: string;
  color: string;
  electronic: boolean;
  fullPop: boolean;
  proposed?: boolean;
  sunset?: boolean;
}
const CT: Record<PathwayId, CollectionType> = {
  ecqm:    { label: "eCQM",          color: "#2563EB", electronic: true,  fullPop: true  },
  medecqm: { label: "Medicare eCQM", color: "#0D9488", electronic: true,  fullPop: false, proposed: true },
  mipscqm: { label: "MIPS CQM",      color: "#D97706", electronic: false, fullPop: true,  sunset: true },
  medcqm:  { label: "Medicare CQM",  color: "#A21CAF", electronic: false, fullPop: false },
};
const PATHWAYS: PathwayId[] = ["ecqm", "medecqm", "mipscqm", "medcqm"];

type MeasureId = "001" | "134" | "236" | "112" | "113";
interface Bench {
  caps?: (number | null)[];
  floors?: (number | null)[];
  kind: string;
  avg?: number;
  cap?: number;
  topped?: boolean;
  est?: boolean;
}

/* ---- REAL PY2026 benchmark cutpoints (qpp.cms.gov 2026 benchmarks file).
   direct: floors[i] = min rate for decile i+1. inverse: caps[i] = max rate for decile i+1.
   null = decile doesn't exist. cap = scoring cap. est = no PY2026 benchmark exists for
   this cell (CMS sets a performance-period benchmark AFTER submission); PY2025 cutpoints
   are shown as an estimate only.
   NOTE: the QPP CSV's "Benchmark Type" column only ever reads Historical or "--", never
   Flat — flat-percentage cells (001/236 MIPS CQM, per 42 CFR 414.1380(b)(1)(ii)(C)) must
   be identified by their ladder pattern, not the CSV label. ---- */
const FLAT = [1, 10, 20, 30, 40, 50, 60, 70, 80, 90];
const BENCH: Record<MeasureId, { inverse: boolean } & Record<PathwayId, Bench>> = {
  "001": { inverse: true,
    ecqm:    { caps: [99.49, 93.98, 71.68, 49.53, 36.72, 29.53, 24.85, 20.86, 17.18, 12.50], kind: "historical", avg: 40.91 },
    mipscqm: { caps: [99, 90, 80, 70, 60, 50, 40, 30, 20, 10], kind: "flat percentage", avg: 23.12 },
    medcqm:  { caps: [80.94, 49.19, 38.28, 29.76, 25.93, 22.27, 18.93, 14.33, 10.14, 7.03], kind: "historical (real ACO data)", avg: 25.78 },
    medecqm: { caps: [99, 90, 80, 70, 60, 50, 40, 30, 20, 10], kind: "flat*" },
  },
  "134": { inverse: false,
    ecqm:    { floors: [0.07, 2.70, 11.42, 21.65, 31.79, 42.69, 53.94, 67.48, 80.72, 93.44], kind: "historical", avg: 45.55 },
    mipscqm: { floors: [0.07, 40.34, 76.30, 94.01, 98.97, 99.82, null, null, null, 100], kind: "historical", avg: 85.58, cap: 7, topped: true },
    medcqm:  { floors: [11.44, 32.51, 45.67, 54.49, 59.27, 65.56, 70.55, 76.11, 82.17, 92.34], kind: "historical (real ACO data)", avg: 62.87 },
    medecqm: { floors: FLAT, kind: "flat*" },
  },
  "236": { inverse: false,
    ecqm:    { floors: [4.76, 45.28, 55.56, 61.54, 65.61, 68.98, 72.00, 75.00, 78.70, 84.04], kind: "historical", avg: 66.06 },
    mipscqm: { floors: FLAT, kind: "flat percentage", avg: 68.71 },
    medcqm:  { floors: [13.68, 44.87, 62.33, 68.17, 70.15, 72.54, 74.09, 74.70, 76.42, 82.81], kind: "historical (real ACO data)", avg: 67.87 },
    medecqm: { floors: FLAT, kind: "flat*" },
  },
  "112": { inverse: false,
    ecqm:    { floors: [0.18, 9.48, 32.76, 46.11, 55.16, 62.60, 68.22, 73.37, 78.90, 85.59], kind: "no PY26 benchmark — 2025 est.", est: true },
    mipscqm: { floors: [1.20, 29.56, 45.87, 57.89, 67.87, 76.47, 81.94, 87.64, 95.31, 100], kind: "no PY26 benchmark — 2025 est.", est: true },
    medcqm:  { floors: FLAT, kind: "flat (finalized for PY26)" },
    medecqm: { floors: FLAT, kind: "flat*" },
  },
  "113": { inverse: false,
    ecqm:    { floors: [0.12, 5.71, 23.98, 36.10, 45.90, 53.54, 60.33, 67.16, 73.82, 83.55], kind: "no PY26 benchmark — 2025 est.", est: true },
    mipscqm: { floors: [1.21, 26.42, 50.00, 65.11, 70.92, 78.93, 83.45, 89.04, 97.13, 100], kind: "no PY26 benchmark — 2025 est.", est: true },
    medcqm:  { floors: FLAT, kind: "flat (finalized for PY26)" },
    medecqm: { floors: FLAT, kind: "flat*" },
  },
};

// Resolve the effective benchmark, honoring the pending CY2027 proposed rule if toggled:
// the proposal would score ALL Medicare CQMs on flat benchmarks for PY2026 and later,
// replacing the tough real-data historical tables for 001/134/236.
function getBench(id: MeasureId, pathway: PathwayId, proposedFlat: boolean): Bench {
  const b = BENCH[id][pathway];
  if (proposedFlat && pathway === "medcqm" && !b.kind.startsWith("flat")) {
    return BENCH[id].inverse
      ? { caps: [99, 90, 80, 70, 60, 50, 40, 30, 20, 10], kind: "flat (per proposed rule)" }
      : { floors: FLAT, kind: "flat (per proposed rule)" };
  }
  return b;
}

interface Measure {
  id: MeasureId;
  name: string;
  outcome: boolean;
}
const MEASURES: Measure[] = [
  { id: "001", name: "Diabetes: glycemic >9% (inverse)", outcome: true },
  { id: "134", name: "Depression screening + follow-up", outcome: false },
  { id: "236", name: "Controlling high BP", outcome: true },
  { id: "112", name: "Breast cancer screening", outcome: false },
  { id: "113", name: "Colorectal cancer screening", outcome: false },
];
// QPS = CMS's published PY2026 40th-percentile quality performance standard (QPS memo:
// (77.73 + 74.54 + 69.27) / 3 = 73.85). The lab awards whole-decile points (no fractional
// 1.0–10.9), so its scores read a few points below CMS's scale — near-bar results are borderline.
const AVAILABLE = 80, QPS = 73.85, POP_ADJ = 3;

type TrackKey = "enhanced" | "basicA" | "basicB" | "basicCDE";
// Sharing caps and loss rails per 42 CFR 425.605(d) (BASIC) and 425.610(d), (f)(4) (ENHANCED):
// one-sided A/B share up to 40% with no shared losses; C–E share up to 50% with a fixed 30%
// loss rate that ignores quality; only ENHANCED (75%) scales losses with the quality score.
const TRACKS: Record<TrackKey, { label: string; maxShare: number; loss: "none" | "flat30" | "scaled" }> = {
  enhanced: { label: "ENHANCED", maxShare: 75, loss: "scaled" },
  basicA:   { label: "BASIC Level A (one-sided)", maxShare: 40, loss: "none" },
  basicB:   { label: "BASIC Level B (one-sided)", maxShare: 40, loss: "none" },
  basicCDE: { label: "BASIC Level C–E", maxShare: 50, loss: "flat30" },
};

type Routing = Record<MeasureId, PathwayId>;
type Rates = Record<MeasureId, number>;
type Gates = Record<MeasureId, boolean>;
interface FixedPts {
  cahps: number;
  claims1: number;
  claims2: number;
}
type ScenarioKey = "strong" | "middle" | "safetynet";
interface Scenario {
  key: ScenarioKey;
  name: string;
  story: string;
  rates: Rates;
  fixedPts: FixedPts;
  perCap: number;
  grossPct: number;
  track: TrackKey;
  benes: number;
  msrElect?: number;
}

const SCENARIOS: Record<ScenarioKey, Scenario> = {
  strong: {
    key: "strong", name: "Integrated high performer",
    story: "An integrated health system ACO: 24,000 assigned Medicare patients (75th percentile of real 2024 ACOs), a few large consolidated practice groups, an experienced quality team, and spending 7.0% under its cost benchmark — a 75th-percentile 2024 financial result. It's in the ENHANCED track: two-sided risk, savings shared at up to 75%, and loss repayment scaled by the quality score. Its clinical performance is strong on every measure; the open question is which reporting method turns that performance into the most points and dollars.",
    rates: { "001": 17, "134": 76, "236": 79, "112": 77, "113": 73 },
    fixedPts: { cahps: 7, claims1: 6, claims2: 7 },
    perCap: 13750, grossPct: 7.0, track: "enhanced", benes: 24000, msrElect: 0,
  },
  middle: {
    key: "middle", name: "Middle-of-the-road regional",
    story: "A regional ACO built to match the median real 2024 ACO: 13,000 assigned patients, 19 practice groups on four different electronic health records, spending 4.2% under benchmark. It's in BASIC Level B: one-sided (no loss repayment), savings shared at up to 40% once it beats its ~2.8% minimum savings rate. Average clinical performance. Note how measure 134 (depression screening) scores very differently by method — a 64% rate lands low on the MIPS CQM ladder (practices reporting that way average 86%) but mid-to-high on the electronic ladder — while measure 236 (blood pressure) runs the opposite direction.",
    rates: { "001": 24, "134": 64, "236": 72, "112": 69, "113": 66 },
    fixedPts: { cahps: 6, claims1: 5, claims2: 6 },
    perCap: 13600, grossPct: 4.2, track: "basicB", benes: 13000,
  },
  safetynet: {
    key: "safetynet", name: "Safety-net / rural network",
    story: "A safety-net ACO: 8,000 assigned patients (25th percentile) across 24 small independent practices, and it spent 0.5% more than its cost benchmark — a bottom-decile 2024 financial result. Its one-sided BASIC Level A track means it repays nothing back — but it also shares nothing until savings beat its ~3.2% minimum savings rate, so the quality standard gates only potential upside here. (A two-sided track would repay: a flat 30% in BASIC C–E regardless of quality; quality-scaled in ENHANCED.)",
    rates: { "001": 33, "134": 52, "236": 63, "112": 56, "113": 49 },
    fixedPts: { cahps: 5, claims1: 4, claims2: 5 },
    perCap: 11900, grossPct: -0.5, track: "basicA", benes: 8000,
  },
};

const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };
const sans: React.CSSProperties = { fontFamily: "'Instrument Sans', system-ui, sans-serif" };
const stripe = (c: string): React.CSSProperties => ({ backgroundImage: `repeating-linear-gradient(135deg, ${c} 0 4px, #fff 4px 7px)` });
const fmt$ = (m: number) => `${m < 0 ? "−" : ""}$${Math.abs(m).toFixed(2)}M`;
const SHORT: Record<PathwayId, string> = { ecqm: "E", mipscqm: "R", medcqm: "C", medecqm: "X" };
type Status = "DEEMED" | "MET" | "ALT" | "FAILED";
const statusLabel = (s: Status) => s === "DEEMED" ? "DEEMED" : s === "MET" ? "MET" : s === "ALT" ? "PARTIAL" : "NOT MET";

/* ---------------- measurement + scoring model ---------------- */

// Underlying care rate → pathway-measured rate. Assumptions are labeled in the UI.
function measuredRate(id: MeasureId, pathway: PathwayId, underlying: number, capture: number) {
  const inv = BENCH[id].inverse;
  const popShift = (r: number) => inv ? Math.max(0, r - POP_ADJ) : Math.min(100, r + POP_ADJ);
  const captureLoss = (r: number) => inv ? r + (1 - capture) * (100 - r) : r * capture;
  if (pathway === "mipscqm") return underlying;                 // abstraction finds the evidence, all-payer
  if (pathway === "medcqm") return popShift(underlying);        // abstraction, Medicare-only population
  if (pathway === "ecqm") return captureLoss(underlying);       // structured-capture gaps, all-payer
  return captureLoss(popShift(underlying));                     // medecqm: both effects
}

function decileWith(bench: Bench, inverse: boolean, rate: number) {
  let d = 1;
  if (inverse) {
    bench.caps!.forEach((cap, i) => { if (cap !== null && rate <= cap) d = i + 1; });
    if (rate > bench.caps![0]!) d = 1;
  } else {
    bench.floors!.forEach((f, i) => { if (f !== null && rate >= f) d = i + 1; });
  }
  return d;
}

interface MeasureRow extends Measure {
  pathway: PathwayId;
  underlying: number;
  measured: number;
  decile: number;
  pts: number;
  coa: number;
  capped: boolean;
  excluded: boolean;
  bench: Bench;
  inverse: boolean;
}
interface Machine {
  rows: MeasureRow[];
  earned: number;
  coa: number;
  fixed: number;
  total: number;
  q: number;
  qRaw: number;
  floored: boolean;
  available: number;
  allFull: boolean;
  allGates: boolean;
  outcomeOK: boolean;
  otherOK: boolean;
  deemed: boolean;
  status: Status;
}

function runMachine(routing: Routing, rates: Rates, gates: Gates, capture: number, fixedPts: FixedPts, proposedFlat: boolean, assumePerfBench: boolean): Machine {
  const rows = MEASURES.map((m) => {
    const meas = measuredRate(m.id, routing[m.id], rates[m.id], capture);
    const b = getBench(m.id, routing[m.id], proposedFlat);
    const dec = decileWith(b, BENCH[m.id].inverse, meas);
    // A submitted measure with no benchmark is excluded from BOTH earned points and the
    // available-points denominator (42 CFR 414.1367(c)(1)(i)); its estimate ladder stays
    // visible for context but scores nothing.
    // Genuinely unsettled (research/findings.md X3): if CMS sets a performance-period benchmark
    // after submissions (its historical practice), the measure IS scored — on a ladder unknowable
    // now, estimated here by the 2025 tables; if none materializes, 414.1367(c)(1)(i) excludes it
    // from both sides of the score. The toggle picks the reading.
    const excluded = !!b.est && !assumePerfBench;
    const pts = !excluded && gates[m.id] ? Math.min(dec, b.cap || 10) : 0;
    const coa = routing[m.id] === "ecqm" && gates[m.id] && pts < 10 ? 1 : 0;
    return { ...m, pathway: routing[m.id], underlying: rates[m.id], measured: meas, decile: dec, pts, coa, capped: !!b.cap && dec > b.cap, excluded, bench: b, inverse: BENCH[m.id].inverse };
  });
  const available = AVAILABLE - 10 * rows.filter((r) => r.excluded).length;
  const earned = rows.reduce((s, r) => s + r.pts, 0);
  const coa = Math.min(rows.reduce((s, r) => s + r.coa, 0), available * 0.1);
  const fixed = fixedPts.cahps + fixedPts.claims1 + fixedPts.claims2;
  const total = Math.min(earned + coa + fixed, available);
  const qRaw = (total / available) * 100;
  // 42 CFR 425.512(a)(7)(ii)(B): if a required measure ends up with no benchmark of any kind,
  // CMS uses the HIGHER of the ACO's score or the 40th-percentile equivalent (73.85 for PY2026).
  // Exclusion and this floor share a trigger and fire together (88 FR 79123; research answers-q1).
  const floored = rows.some((r) => r.excluded) && qRaw < QPS;
  const q = floored ? QPS : qRaw;
  const allFull = rows.every((r) => CT[r.pathway].fullPop);
  const allGates = rows.every((r) => gates[r.id]);
  // Outcome condition: 001, 236, or either administrative-claims outcome measure (479/484,
  // modeled as fixed points) at/above the 10th percentile — claims outcome measures count for
  // both the reporting incentive and the alternative QPS (CMS PY2026 QPS memo, Table 1).
  const outcomeOK = rows.some((r) => r.outcome && gates[r.id] && r.decile >= 2)
    || fixedPts.claims1 >= 2 || fixedPts.claims2 >= 2;
  // Second incentive condition (42 CFR 425.512(a)(5)(i)(B)(2)): >=40th percentile on at least
  // one of the remaining seven measures of the eight-measure set — CAHPS and the claims
  // measures count, via their fixed decile-equivalent points.
  const otherOK = [fixedPts.cahps, fixedPts.claims1, fixedPts.claims2].some((p) => p >= 5)
    || rows.some((r) => !(r.outcome && r.decile >= 2) && r.decile >= 5 && r.pts > 0)
    || rows.filter((r) => r.outcome && r.decile >= 2).length >= 2 && rows.some((r) => r.decile >= 5 && r.pts > 0);
  const deemed = allFull && allGates && outcomeOK && otherOK;
  const status = deemed ? "DEEMED" : q >= QPS ? "MET" : outcomeOK ? "ALT" : "FAILED";
  return { rows, earned, coa, fixed, total, q, qRaw, floored, available, allFull, allGates, outcomeOK, otherOK, deemed, status };
}

/* ---- Real-context pins for the input sliders. Care-rate pins are measured-rate percentiles
   of real reporters, read off the benchmark ladders themselves (001/134/236: CMS's 2026
   Medicare CQM benchmarks, built from actual PY2024 ACO submissions; 112/113: the PY2025
   MIPS CQM file, since their Medicare CQM benchmarks are flat policy, not data — their p90
   of 100 is clamped to the slider max of 95). Dollar and savings pins are PY2024 MSSP PUF
   percentiles (research/data/mssp-py2024-distributions.json). For 001 (inverse) percentiles
   are of PERFORMANCE, so the care-rate values descend. ---- */
interface Pin { p: string; v: number }
const RATE_PINS: Record<MeasureId, Pin[]> = {
  "001": [{ p: "p10", v: 49 }, { p: "p30", v: 30 }, { p: "p50", v: 22 }, { p: "p70", v: 14 }, { p: "p90", v: 7 }],
  "134": [{ p: "p10", v: 33 }, { p: "p30", v: 54 }, { p: "p50", v: 66 }, { p: "p70", v: 76 }, { p: "p90", v: 92 }],
  "236": [{ p: "p10", v: 45 }, { p: "p30", v: 68 }, { p: "p50", v: 73 }, { p: "p70", v: 75 }, { p: "p90", v: 83 }],
  "112": [{ p: "p10", v: 30 }, { p: "p30", v: 58 }, { p: "p50", v: 76 }, { p: "p70", v: 88 }, { p: "p90", v: 95 }],
  "113": [{ p: "p10", v: 26 }, { p: "p30", v: 65 }, { p: "p50", v: 79 }, { p: "p70", v: 89 }, { p: "p90", v: 95 }],
};
const PERCAP_PINS: Pin[] = [{ p: "p10", v: 11500 }, { p: "p25", v: 12100 }, { p: "p50", v: 13300 }, { p: "p75", v: 14500 }, { p: "p90", v: 16000 }];
const GROSS_PINS: Pin[] = [{ p: "p10", v: -0.4 }, { p: "p25", v: 2.0 }, { p: "p50", v: 4.2 }, { p: "p75", v: 7.0 }, { p: "p90", v: 10.4 }];
const CAPTURE_PINS: Pin[] = [{ p: "low", v: 75 }, { p: "default", v: 85 }, { p: "top-rung", v: 93 }, { p: "perfect", v: 100 }];
const BENE_PINS: Pin[] = [{ p: "p10", v: 5900 }, { p: "p25", v: 8300 }, { p: "p50", v: 13200 }, { p: "p75", v: 24400 }, { p: "p90", v: 44100 }];

// 42 CFR 425.605(b)(1): one-sided BASIC ACOs get a MANDATORY sliding-scale minimum savings
// rate set by assigned-beneficiary count (larger population = less noise = lower bar).
// Anchors interpolated from the real PY2024 PUF MinSavPerc values (research/data/).
const MSR_SCALE: [number, number][] = [[5000, 3.9], [8238, 3.17], [13151, 2.81], [24494, 2.46], [60000, 2.0]];
function slidingMsr(benes: number): number {
  if (benes <= MSR_SCALE[0][0]) return MSR_SCALE[0][1];
  for (let i = 1; i < MSR_SCALE.length; i++) {
    const [x1, y1] = MSR_SCALE[i - 1], [x2, y2] = MSR_SCALE[i];
    if (benes <= x2) return Math.round((y1 + ((benes - x1) / (x2 - x1)) * (y2 - y1)) * 10) / 10;
  }
  return 2.0;
}

function PinRow({ pins, cur, onPick, fmt, color = T.ink }: { pins: Pin[]; cur: number; onPick: (v: number) => void; fmt: (v: number) => string; color?: string }) {
  return (
    <span style={{ display: "inline-flex", gap: 3, flexWrap: "wrap" }}>
      {pins.map((pin) => {
        const on = Math.abs(cur - pin.v) < 0.75;
        return (
          <button key={pin.p} onClick={() => onPick(pin.v)} title={`jump to ${pin.p}: ${fmt(pin.v)}`}
            style={{
              border: `1px solid ${on ? color : T.line}`, background: on ? color : "#fff",
              color: on ? "#fff" : T.inkSoft, borderRadius: 2, padding: "0 4px",
              fontSize: 8.5, ...mono, cursor: "pointer", lineHeight: "13px", whiteSpace: "nowrap",
            }}>
            {pin.p} {fmt(pin.v)}
          </button>
        );
      })}
    </span>
  );
}

// Why each ladder has its shape — policy rationale, not just data (see research/findings.md L1).
function benchBadge(bench: Bench): { label: string; why: string } {
  if (bench.est) return { label: "PENDING · set after submit", why: "No 2026 benchmark published for this cell. CMS computes a performance-period benchmark after all submissions; the 2025 ladder is shown as an estimate and the measure is excluded from the score (42 CFR 414.1367(c)(1)(i))." };
  if (bench.kind === "flat percentage") return { label: "FLAT · clinical guardrail", why: "Flat by rule, not data — 42 CFR 414.1380(b)(1)(ii)(C), finalized in the CY2020 PFS final rule. CMS applies flat bands to collection types whose top decile exceeds 90% (or falls under 10% for an inverse measure), re-tested every year, and says why: \"if the top decile was originally below 90 percent, using the flat percentages would actually raise the level up to 90 percent, and therefore, provide a stronger incentive to provide inappropriate care\" (84 FR 63015). The last pre-flat data (PY2019) passes the test exactly: measure 236's top decile was 100% under MIPS CQM and 94.9% under claims — both flattened — versus 82.2% under eCQM, which kept its graded curve. Not a permanent exemption: CMS flattened 236 eCQM in PY2020 and reverted the next year." };
  if (bench.kind === "flat (finalized for PY26)") return { label: "FLAT · M-CQM policy", why: "Policy-set flat bands for a Medicare CQM's first two performance periods (CY2025 PFS final rule)." };
  if (bench.kind.startsWith("flat")) return { label: "FLAT · proposed rule", why: "CMS-1848-P proposes flat bands for all Medicare CQMs and the new Medicare eCQMs — not final (decision ~November 2026)." };
  if (bench.kind === "historical (real ACO data)") return { label: "HISTORICAL · real ACOs", why: "Deciles of actual PY2024 ACO Medicare CQM submissions — the first year CMS had real ACO data for these measures, and a pool of only ACOs rather than all MIPS clinicians. CMS calls this a \"tournament approach\": high-performing ACOs \"could earn lower measure achievement points relative to comparable MIPS groups because the Medicare CQM benchmarking pool is comprised of higher-than-average performance data\" (89 FR 98117). Same care, tougher room. CMS's stated alternative: \"ACOs that prefer to be compared to clinicians at large may do so by reporting eCQMs or MIPS CQMs.\"" };
  return { label: "HISTORICAL · peer curve", why: "Deciles of what real reporters scored nationally for this collection type in the baseline period." };
}

function RateMeter({ actual, max }: { actual: number; max: number }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (actual / max) * 100)) : 0;
  return (
    <div style={{ margin: "2px 0" }}>
      <div style={{ fontSize: 10, color: T.inkSoft, ...mono }}>ACTUAL SHARING RATE</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "2px 0 4px", ...mono }}>
        <b style={{ fontSize: 20, color: T.money, lineHeight: 1 }}>{actual.toFixed(actual % 1 ? 1 : 0)}%</b>
        <span style={{ fontSize: 11, color: T.inkSoft }}>of {max}% max</span>
      </div>
      <div style={{ display: "flex", height: 12, border: `1px solid ${T.line}`, borderRadius: 3, background: "#fff", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, background: T.money, opacity: 0.8 }} />
        {pct < 100 && <div style={{ flex: 1, background: `repeating-linear-gradient(135deg, rgba(220,38,38,0.22) 0 5px, #ffffff 5px 10px)` }} title="sharing rate forfeited by the quality score" />}
      </div>
    </div>
  );
}

function Info({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details style={{ fontSize: 10.5, color: T.inkFaint, lineHeight: 1.5, margin: "3px 0 0" }}>
      <summary style={{ cursor: "pointer", fontSize: 10, color: T.inkSoft }}>{summary}</summary>
      <div style={{ margin: "4px 0 0" }}>{children}</div>
    </details>
  );
}

function LossMeter({ actual, max, fixed = false }: { actual: number; max: number; fixed?: boolean }) {
  const aPct = Math.max(0, Math.min(100, (actual / max) * 100));
  return (
    <div style={{ margin: "2px 0" }}>
      <div style={{ fontSize: 10, color: T.inkSoft, ...mono }}>ACTUAL LOSS RATE</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "2px 0 4px", ...mono }}>
        <b style={{ fontSize: 20, color: T.debt, lineHeight: 1 }}>{actual.toFixed(actual % 1 ? 1 : 0)}%</b>
        <span style={{ fontSize: 11, color: T.inkSoft }}>of {max}% max exposure{fixed ? " (fixed)" : ""}</span>
      </div>
      <div style={{ display: "flex", height: 12, border: `1px solid ${T.line}`, borderRadius: 3, background: "#fff", overflow: "hidden" }}>
        <div style={{ width: `${aPct}%`, background: T.debt, opacity: 0.8 }} />
        {aPct < 100 && <div style={{ flex: 1, background: `repeating-linear-gradient(135deg, rgba(15,118,110,0.25) 0 5px, #ffffff 5px 10px)` }} title="exposure trimmed by the quality score" />}
      </div>
    </div>
  );
}

interface FinInputs {
  grossPct: number;
  benchmarkM: number;
  track: TrackKey;
  msr: number;
}
interface Settlement {
  sharePct: number;
  lossPct: number;
  gross: number;
  savings$: number;
  losses$: number;
  net$: number;
}

function settle(mach: Machine, fin: FinInputs): Settlement {
  const tr = TRACKS[fin.track];
  const sharePct = mach.status === "DEEMED" || mach.status === "MET" ? tr.maxShare : mach.status === "ALT" ? tr.maxShare * (mach.q / 100) : 0;
  // ENHANCED loss scaling is 1 − 0.75 × score, clamped to [40, 75] (42 CFR 425.610(f)(4)),
  // applied here to the lab's compressed q scale.
  const lossPct = tr.loss === "none" ? 0 : tr.loss === "flat30" ? 30 : Math.min(75, Math.max(40, 100 - 0.75 * mach.q));
  const gross = (fin.grossPct / 100) * fin.benchmarkM;
  // The MSR/MLR is a symmetrical DEADBAND, not a deductible: clear it and you share (or owe) from
  // the first dollar — "a shared savings payment of X percent of ALL the savings under the updated
  // benchmark" (42 CFR 425.605(d)(1)(iii)(A)); inside it, nothing moves in either direction.
  // Two-sided elections set both edges at once (425.605(b)(2), 425.610(b)(1)): MLR = −MSR.
  const inBand = Math.abs(fin.grossPct) < fin.msr;
  const savings$ = gross > 0 && !inBand ? (sharePct / 100) * gross : 0;
  const losses$ = gross < 0 && !inBand ? (lossPct / 100) * gross : 0;
  const net$ = savings$ + losses$;
  return { sharePct, lossPct, gross, savings$, losses$, net$ };
}

/* ---------------- glyphs (carried from rev 3) ---------------- */

function PopGlyph({ full, color, size = 16 }: { full: boolean; color: string; size?: number }) {
  const r = size / 2 - 1.5, c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={c} cy={c} r={r} fill={full ? color : "none"} stroke={color} strokeWidth="1.5" />
      {!full && <path d={`M ${c} ${c} L ${c} ${c - r} A ${r} ${r} 0 0 1 ${c + r * 0.95} ${c + r * 0.31} Z`} fill={color} />}
    </svg>
  );
}
function PipeGlyph({ electronic, color, width = 28 }: { electronic: boolean; color: string; width?: number }) {
  return (
    <svg width={width} height={12} viewBox="0 0 34 14" aria-hidden>
      {electronic
        ? <path d="M1 7 H8 L11 2 L15 12 L18 7 H33" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        : <g><path d="M1 7 H33" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" fill="none" />{[8, 17, 26].map((x) => <rect key={x} x={x - 2.5} y={4.5} width={5} height={5} fill={color} rx={1} />)}</g>}
    </svg>
  );
}
function GateGlyph({ pass }: { pass: boolean }) {
  return (
    <div style={{
      width: 22, height: 22, transform: "rotate(45deg)",
      border: `2px solid ${pass ? T.pass : T.fail}`, background: pass ? "#EAF7EE" : "#FBEAEA",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ transform: "rotate(-45deg)", color: pass ? T.pass : T.fail, fontSize: 11, fontWeight: 700 }}>{pass ? "✓" : "✕"}</span>
    </div>
  );
}
function WireIcon({ binary, color = T.ink, width = 26 }: { binary: boolean; color?: string; width?: number }) {
  return (
    <svg width={width} height={12} viewBox="0 0 30 12" aria-hidden>
      {binary
        ? <path d="M1 10 H8 V2 H16 V10 H23 V2 H29" fill="none" stroke={color} strokeWidth="1.8" />
        : <path d="M1 8 C 7 2, 12 12, 17 6 S 26 2, 29 5" fill="none" stroke={color} strokeWidth="1.8" />}
    </svg>
  );
}
function StatusLamp({ on, label }: { on: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: on ? T.pass : "#fff", border: `2px solid ${on ? T.pass : T.fail}`, boxShadow: on ? `0 0 6px ${T.pass}` : "none" }} />
      <span style={{ fontSize: 11, color: T.ink }}>{label}</span>
    </div>
  );
}
function Panel({ children, title, tag, style }: { children?: React.ReactNode; title?: string; tag?: string; style?: React.CSSProperties }) {
  return (
    <div style={{ background: T.film, border: `1px solid ${T.line}`, borderRadius: 4, padding: 14, ...style }}>
      {title && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, letterSpacing: "0.12em", color: T.inkSoft, textTransform: "uppercase", ...mono }}>{title}</span>
          {tag && <span style={{ fontSize: 10, color: T.inkFaint, ...mono }}>{tag}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
function ThresholdStrip({ value, threshold, flagLabel, markerColor = T.ink, dimmed = false, height = 54 }: { value: number; threshold: number; flagLabel: string; markerColor?: string; dimmed?: boolean; height?: number }) {
  const w = 260, h = height, ph = h - 13;
  const x = (v: number) => 8 + (Math.max(0, Math.min(100, v)) / 100) * (w - 16);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: 330, height: "auto", display: "block" }}>
      <path d={`M8 ${ph} C ${w * 0.25} ${ph - 1}, ${w * 0.32} 8, ${w * 0.5} 10 S ${w * 0.75} ${ph - 4}, ${w - 8} ${ph} Z`}
        fill={dimmed ? "#EDF0F2" : "#E3EAEF"} stroke={dimmed ? T.grayed : T.line} strokeWidth="1" />
      <line x1={8} y1={ph} x2={w - 8} y2={ph} stroke={dimmed ? T.grayed : T.ink} strokeWidth="1.2" />
      <line x1={x(threshold)} y1={4} x2={x(threshold)} y2={ph} stroke={dimmed ? T.grayed : T.fail} strokeWidth="1.6" strokeDasharray="4 3" />
      <path d={`M ${x(threshold)} 4 l 12 4 l -12 4 Z`} fill={dimmed ? T.grayed : T.fail} />
      <text x={x(threshold) - 6} y={11} fontSize="8.5" textAnchor="end" fontFamily="IBM Plex Mono, monospace" fill={dimmed ? T.grayed : T.inkSoft}>{flagLabel}</text>
      <path d={`M ${x(value)} ${ph + 1} l -5 7 h 10 Z`} fill={dimmed ? T.grayed : markerColor} />
      <text x={Math.max(38, Math.min(w - 38, x(value)))} y={h - 1} fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={dimmed ? T.grayed : markerColor}>score {value.toFixed(1)}</text>
    </svg>
  );
}

/* Real-cutpoint ladder: rung heights ∝ actual band widths; dashed outline = estimated bench. */
function RealLadder({ bench, inverse, color, measured, height = 92 }: { bench: Bench; inverse: boolean; color: string; measured: number; height?: number }) {
  const bounds = (inverse ? bench.caps : bench.floors)!;
  const dec = decileWith(bench, inverse, measured);
  const bands: { d: number; wdt: number; lo: number; hi: number }[] = [];
  for (let i = 0; i < 10; i++) {
    if (bounds[i] === null) continue;
    let wdt: number, lo: number, hi: number;
    if (inverse) { hi = bounds[i]!; lo = i < 9 && bounds[i + 1] !== null ? bounds[i + 1]! : 0; wdt = hi - lo; }
    else { lo = bounds[i]!; hi = 100; for (let j = i + 1; j < 10; j++) if (bounds[j] !== null) { hi = bounds[j]!; break; } if (i === 9) hi = 100; wdt = i === 9 ? Math.max(100 - lo, 2) : hi - lo; }
    bands.push({ d: i + 1, wdt: Math.max(wdt, 1.5), lo, hi });
  }
  return (
    <div style={{ display: "flex", flexDirection: "column-reverse", gap: 1, height, opacity: bench.est ? 0.75 : 1 }}
      title={`${bench.kind}${bench.topped ? " · topped out, 7-pt cap" : ""}`}>
      {bands.map((band) => (
        <div key={band.d}
          title={`decile ${band.d}: ${inverse ? `${band.hi}% down to ${band.lo}% (lower = better)` : `${band.lo}% up to ${band.hi}%`} → ${bench.cap ? Math.min(band.d, bench.cap) : band.d} pts${bench.cap && band.d > bench.cap ? ` (capped at ${bench.cap})` : ""}${bench.est ? " · 2025 estimate" : ""}`}
          style={{
          flexGrow: band.wdt, flexBasis: 0, width: 20, position: "relative",
          background: band.d <= dec ? color : "#fff",
          border: `1px ${bench.est ? "dashed" : "solid"} ${band.d <= dec ? color : T.line}`,
          opacity: band.d <= dec ? 0.45 + 0.055 * band.d : 1,
        }}>
          {bench.cap && band.d === bench.cap && <div style={{ position: "absolute", top: -1, left: -4, right: -4, borderTop: `2px dashed ${T.fail}` }} title="7-point scoring cap" />}
        </div>
      ))}
    </div>
  );
}

/* ---------------- station ---------------- */

function Station({ row, gate, onRoute, onRate }: { row: MeasureRow; gate: boolean; onRoute: (id: MeasureId, k: PathwayId) => void; onRate: (id: MeasureId, v: number) => void }) {
  const ct = CT[row.pathway];
  const line: React.CSSProperties = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
  return (
    <div style={{ border: `1px solid ${T.line}`, borderTop: `3px solid ${ct.color}`, background: "#fff", borderRadius: 4, padding: 10, display: "flex", flexDirection: "column", gap: 7, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline", minWidth: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: T.ink, flex: 1, minWidth: 0, ...line }}>{row.id} · {row.name}</span>
        {row.outcome && <span style={{ fontSize: 8, ...mono, color: T.inkFaint, flexShrink: 0 }}>OUTCOME</span>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
        {PATHWAYS.map((k) => (
          <button key={k} onClick={() => onRoute(row.id, k)} style={{
            display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-start",
            fontSize: 8.5, ...mono, padding: "3px 6px", borderRadius: 2, cursor: "pointer",
            border: `1.5px solid ${row.pathway === k ? CT[k].color : T.line}`,
            background: row.pathway === k ? CT[k].color : "#fff",
            color: row.pathway === k ? "#fff" : T.inkSoft,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3, width: 34, flexShrink: 0 }}>
              <PopGlyph full={CT[k].fullPop} color={row.pathway === k ? "#fff" : CT[k].color} size={11} />
              <PipeGlyph electronic={CT[k].electronic} color={row.pathway === k ? "#fff" : CT[k].color} width={20} />
            </span>
            <span style={{ textAlign: "left" }}>{CT[k].label.replace("Medicare ", "M-")}{CT[k].proposed ? "*" : ""}{CT[k].sunset ? "†" : ""}</span>
          </button>
        ))}
      </div>
      {/* Fixed-height body so every card's ladder and footer align across the row */}
      <div style={{ display: "flex", gap: 10, height: 112, alignItems: "stretch" }}>
        <RealLadder bench={row.bench} inverse={row.inverse} color={ct.color} measured={row.measured} height={112} />
        <div style={{ flex: 1, minWidth: 0, fontSize: 10, ...mono, color: T.inkSoft, display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>care
            <input type="range" min={5} max={95} value={row.underlying} onChange={(e) => onRate(row.id, +e.target.value)} style={{ flex: 1, minWidth: 0, accentColor: T.ink }} aria-label={`underlying rate ${row.id}`} />
            <b style={{ color: T.ink, flexShrink: 0 }}>{row.underlying}%</b>
          </span>
          <span style={line}>measured ({ct.label.replace("Medicare ", "M-")}): <b style={{ color: ct.color }}>{row.measured.toFixed(1)}%</b></span>
          <span style={{ ...line, cursor: "help" }} title={benchBadge(row.bench).why}>{benchBadge(row.bench).label}{row.bench.topped ? " · 7-pt cap" : ""}</span>
          <span style={line}>{row.excluded
            ? <>est. decile <b style={{ color: T.ink }}>{row.decile}</b> — <b style={{ color: "#D97706" }}>excluded from score</b></>
            : <>decile <b style={{ color: T.ink }}>{row.decile}</b>{row.capped ? ` → capped @7` : ""} = <b style={{ color: gate ? T.ink : T.fail }}>{row.pts} pts</b></>}</span>
          {!gate && <span style={{ ...line, color: T.fail, fontWeight: 700 }}>REPORTING FAILURE — scored 0</span>}
        </div>
      </div>
      <PinRow pins={RATE_PINS[row.id]} cur={row.underlying} onPick={(v) => onRate(row.id, v)} fmt={(v) => `${v}`} />
      {(row.coa > 0 || (row.pathway === "ecqm" && row.pts === 10 && gate)) && <div style={{ display: "flex", gap: 4, ...mono, fontSize: 9.5, height: 20, alignItems: "center" }}>
        {row.coa > 0 && (
          <span style={{
            borderRadius: 2, padding: "1px 6px", border: `1px solid ${CT.ecqm.color}`, color: CT.ecqm.color, fontWeight: 600,
            backgroundImage: "repeating-linear-gradient(135deg, #F1F6FE 0 5px, #ffffff 5px 10px)",
          }}>+1 COA</span>
        )}
        {row.pathway === "ecqm" && row.pts === 10 && gate && <span style={{ borderRadius: 2, padding: "1px 6px", border: `1px solid ${T.line}`, color: T.inkFaint, textDecoration: "line-through" }}>COA capped</span>}
      </div>}
    </div>
  );
}

/* ---------------- waterfall ---------------- */

interface WaterfallStep {
  key: string;
  label: string;
  pts: number;
  color: string;
  pattern?: string;
  kind?: string;
  excluded?: boolean;
}

function Waterfall({ steps, total, available }: { steps: WaterfallStep[]; total: number; available: number }) {
  const w = 640, h = 190, pad = { l: 34, r: 8, t: 14, b: 24 };
  const plotW = w - pad.l - pad.r, plotH = h - pad.t - pad.b;
  const n = steps.length + 1, colW = plotW / n, barW = Math.min(colW * 0.62, 50);
  const y = (v: number) => pad.t + plotH - (v / AVAILABLE) * plotH;
  let cum = 0;
  const cols = steps.map((s, i) => {
    const y0 = y(cum), y1 = y(cum + s.pts);
    const col = { ...s, i, start: cum, x: pad.l + i * colW + (colW - barW) / 2, yTop: Math.min(y0, y1), hgt: Math.max(Math.abs(y0 - y1), s.pts > 0 ? 2 : 0), connY: y(cum + s.pts) };
    cum += s.pts;
    return col;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {[0, 20, 40, 60, 80].map((g) => (
        <g key={g}>
          <line x1={pad.l} x2={w - pad.r} y1={y(g)} y2={y(g)} stroke={T.grid} strokeWidth="1" />
          <text x={pad.l - 5} y={y(g) + 3} fontSize="8.5" textAnchor="end" fontFamily="IBM Plex Mono, monospace" fill={T.inkFaint}>{g}</text>
        </g>
      ))}
      {cols.map((c) => (
        <g key={c.key}>
          {c.pattern === "stripe" ? (
            <>
              <defs><pattern id={`pl-${c.key}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#fff" /><rect width="3.2" height="6" fill={c.color} /></pattern></defs>
              <rect x={c.x} y={c.yTop} width={barW} height={c.hgt} fill={`url(#pl-${c.key})`} stroke={c.color} strokeWidth="1" />
            </>
          ) : c.excluded ? (
            <rect x={c.x} y={y(0) - 7} width={barW} height={7} fill="#fff" stroke={T.grayed} strokeWidth="1" strokeDasharray="3 2" />
          ) : c.pts === 0 ? (
            <rect x={c.x} y={c.yTop} width={barW} height={c.hgt} fill="#fff" stroke={T.fail} strokeWidth="1.5" strokeDasharray="3 2" />
          ) : (
            // One rung per point, echoing the benchmark ladders' banded idiom and opacity ramp.
            <g>
              {Array.from({ length: Math.round(c.pts) }, (_, ri) => (
                <rect key={ri} x={c.x} y={y(c.start + ri + 1)} width={barW}
                  height={Math.max(y(c.start + ri) - y(c.start + ri + 1) - 0.5, 0.8)}
                  fill={c.color} opacity={(c.kind === "fixed" ? 0.3 : 0.45) + 0.05 * Math.min(ri + 1, 10)}
                  stroke={c.color} strokeWidth="0.4" />
              ))}
            </g>
          )}
          <line x1={c.x + barW} x2={c.x + colW} y1={c.connY} y2={c.connY} stroke={T.inkFaint} strokeWidth="1" strokeDasharray="2 2" />
          <text x={c.x + barW / 2} y={c.excluded ? y(0) - 11 : c.yTop - 3} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={c.excluded ? T.inkFaint : c.pts === 0 ? T.fail : T.inkSoft}>{c.excluded ? "excl." : c.pts === 0 ? "0!" : `+${c.pts}`}</text>
          <text x={c.x + barW / 2} y={h - 12} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={T.inkSoft}>{c.label}</text>
        </g>
      ))}
      <g>
        <rect x={pad.l + steps.length * colW + (colW - barW) / 2} y={y(total)} width={barW} height={y(0) - y(total)} fill={T.ink} opacity="0.88" />
        <text x={pad.l + steps.length * colW + colW / 2} y={y(total) - 4} fontSize="9.5" fontWeight="700" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={T.ink}>{total}/{available}</text>
        <text x={pad.l + steps.length * colW + colW / 2} y={h - 12} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={T.ink}>TOTAL</text>
      </g>
    </svg>
  );
}

/* ---------------- app ---------------- */

interface ComparisonRow {
  key: string;
  label: string;
  labelColor: string;
  showMethods: boolean;
  m: Machine;
  f: Settlement;
}

export default function AppPlusPathwayLab() {
  const s0 = SCENARIOS.middle;
  const [scenario, setScenario] = useState<ScenarioKey>("middle");
  const [routing, setRouting] = useState<Routing>({ "001": "ecqm", "134": "ecqm", "236": "ecqm", "112": "ecqm", "113": "ecqm" });
  const [gates, setGates] = useState<Gates>({ "001": true, "134": true, "236": true, "112": true, "113": true });
  const [rates, setRates] = useState<Rates>({ ...s0.rates });
  const [capture, setCapture] = useState(0.85);
  const [fixedPts, setFixedPts] = useState<FixedPts>({ ...s0.fixedPts });
  const [grossPct, setGrossPct] = useState(s0.grossPct);
  const [proposedFlat, setProposedFlat] = useState(true);
  const [assumePerfBench, setAssumePerfBench] = useState(true);
  const [perCap, setPerCap] = useState(s0.perCap);
  const [track, setTrack] = useState<TrackKey>(s0.track);
  const [benes, setBenes] = useState(s0.benes);
  const [msrElect, setMsrElect] = useState<number | "scale">(s0.msrElect ?? "scale");

  const scen = SCENARIOS[scenario];
  const load = (key: ScenarioKey) => {
    const s = SCENARIOS[key];
    setScenario(key); setRates({ ...s.rates }); setGrossPct(s.grossPct); setFixedPts({ ...s.fixedPts });
    setPerCap(s.perCap); setTrack(s.track); setBenes(s.benes); setMsrElect(s.msrElect ?? "scale");
    setGates({ "001": true, "134": true, "236": true, "112": true, "113": true });
  };
  // Presets expose their implied data: once any scenario-derived input deviates, Step 1 shows Custom.
  const isCustom = MEASURES.some((m) => rates[m.id] !== scen.rates[m.id])
    || (["cahps", "claims1", "claims2"] as const).some((k) => fixedPts[k] !== scen.fixedPts[k])
    || perCap !== scen.perCap || Math.abs(grossPct - scen.grossPct) > 1e-9
    || track !== scen.track || benes !== scen.benes || msrElect !== (scen.msrElect ?? "scale");
  // MSR is set by rule, not freely chosen: mandatory sliding scale for one-sided BASIC;
  // an elected 0/0.5/1/2% (or the scale) for two-sided tracks.
  const oneSided = TRACKS[track].loss === "none";
  const msr = oneSided || msrElect === "scale" ? slidingMsr(benes) : msrElect;
  const benchmarkM = Math.round((benes * perCap) / 1e6);
  const routeAll = (k: PathwayId) => setRouting({ "001": k, "134": k, "236": k, "112": k, "113": k });
  const allSame = PATHWAYS.find((k) => MEASURES.every((m) => routing[m.id] === k));

  const mach = useMemo(() => runMachine(routing, rates, gates, capture, fixedPts, proposedFlat, assumePerfBench), [routing, rates, gates, capture, fixedPts, proposedFlat, assumePerfBench]);
  const fin = useMemo(() => settle(mach, { grossPct, benchmarkM, track, msr }), [mach, grossPct, benchmarkM, track, msr]);
  const marginal = useMemo(() => {
    const plus = { ...mach, total: Math.min(mach.total + 1, mach.available), q: (Math.min(mach.total + 1, mach.available) / mach.available) * 100 };
    plus.status = plus.deemed ? "DEEMED" : plus.q >= QPS ? "MET" : plus.outcomeOK ? "ALT" : "FAILED";
    const base$ = settle(mach, { grossPct, benchmarkM, track, msr }).net$;
    const plus$ = settle(plus, { grossPct, benchmarkM, track, msr }).net$;
    return (plus$ - base$) * 1000;
  }, [mach, grossPct, benchmarkM, track, msr]);

  // Comparison rows: four uniform strategies, the current configuration, and the exact best
  // mixed assignment. Among eCQM/MIPS CQM only, per-measure greedy is provably optimal
  // (scoring is separable there — the automatic-pass condition holds for every such mix and
  // COA is per-measure). Attributed-column methods break separability only through the
  // automatic-pass AND-condition, so we simply check every legal assignment exactly.
  // Medicare eCQM is excluded from the search — it does not exist for PY2026 (proposed for
  // 2027) — leaving 3^5 = 243 assignments; its uniform row stays visible as a preview.
  const comparison = useMemo(() => {
    const ALLPASS: Gates = { "001": true, "134": true, "236": true, "112": true, "113": true };
    const finP = { grossPct, benchmarkM, track, msr };
    const evalR = (r: Routing, g: Gates) => { const m = runMachine(r, rates, g, capture, fixedPts, proposedFlat, assumePerfBench); return { m, f: settle(m, finP) }; };
    const rows: ComparisonRow[] = PATHWAYS.map((k) => ({
      key: k, label: `All ${CT[k].label}${CT[k].proposed ? "*" : ""}${CT[k].sunset ? "†" : ""}`, labelColor: CT[k].color,
      showMethods: false, ...evalR({ "001": k, "134": k, "236": k, "112": k, "113": k }, ALLPASS),
    }));
    let best: { m: Machine; f: Settlement } | null = null;
    for (let n = 0; n < 1024; n++) {
      let x = n; const r = {} as Routing;
      MEASURES.forEach((mm) => { r[mm.id] = PATHWAYS[x % 4]; x = Math.floor(x / 4); });
      if (MEASURES.some((mm) => r[mm.id] === "medecqm")) continue;
      const e = evalR(r, ALLPASS);
      if (!best || e.f.net$ > best.f.net$ + 1e-9 || (Math.abs(e.f.net$ - best.f.net$) < 1e-9 && e.m.q > best.m.q)) best = e;
    }
    rows.push({ key: "cfg", label: "As configured above", labelColor: T.ink, showMethods: true, ...evalR(routing, gates) });
    rows.push({ key: "best", label: "Explore: highest-$ mix (243 checked)", labelColor: T.money, showMethods: true, ...best! });
    return rows;
  }, [rates, capture, fixedPts, grossPct, benchmarkM, track, msr, scen, proposedFlat, assumePerfBench, routing, gates]);

  // Routing behind the "Best mix" row, reconstructed from its per-measure results,
  // so Step 2 can offer a one-click apply.
  const bestRouting = useMemo(() => {
    const bestRow = comparison[comparison.length - 1];
    return Object.fromEntries(bestRow.m.rows.map((r): [MeasureId, PathwayId] => [r.id, r.pathway])) as Routing;
  }, [comparison]);
  const isBestApplied = MEASURES.every((m) => routing[m.id] === bestRouting[m.id]);

  const steps: WaterfallStep[] = [
    ...mach.rows.map((r) => ({ key: r.id, label: r.id, pts: r.pts, color: CT[r.pathway].color, excluded: r.excluded })),
    ...(mach.coa > 0 ? [{ key: "coa", label: "COA", pts: mach.coa, color: CT.ecqm.color, pattern: "stripe" }] : []),
    { key: "cahps", label: "CAHPS", pts: fixedPts.cahps, color: T.fixed, kind: "fixed" },
    { key: "c479", label: "479", pts: fixedPts.claims1, color: T.fixed, kind: "fixed" },
    { key: "c484", label: "484", pts: fixedPts.claims2, color: T.fixed, kind: "fixed" },
  ];
  const statusColor = mach.status === "FAILED" ? T.fail : mach.status === "ALT" ? "#D97706" : T.pass;
  const deemLit = [mach.allFull, mach.allGates, mach.outcomeOK, mach.otherOK].filter(Boolean).length;

  // Sticky outputs: top-pinned until Step 2 reaches the viewport top; from there the column
  // scrolls 1:1 with the page until its bottom edge pins to the viewport bottom — settlement
  // and compare stay reachable through the whole input scroll, with no inner scrollbar.
  const outRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = outRef.current;
    if (!el) return;
    const set = () => {
      const h = el.offsetHeight;
      const lock = step2Ref.current ? step2Ref.current.getBoundingClientRect().top + window.scrollY - 10 : 0;
      // The sticky containing block (the grid row) must reach past the pinned phase, or the
      // browser force-releases the pin at the container bottom before Step 2 tops out.
      const inEl = inRef.current;
      if (inEl) {
        const inTop = inEl.getBoundingClientRect().top + window.scrollY;
        inEl.style.minHeight = `${Math.max(0, lock + 20 + h - inTop)}px`;
      }
      const minTop = Math.min(10, window.innerHeight - h - 10);
      el.style.top = `${Math.max(minTop, 10 - Math.max(0, window.scrollY - lock))}px`;
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    window.addEventListener("scroll", set, { passive: true });
    window.addEventListener("resize", set);
    return () => { ro.disconnect(); window.removeEventListener("scroll", set); window.removeEventListener("resize", set); };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, ...sans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap');
        input[type=range]{height:4px}
        button:focus-visible{outline:2px solid ${T.ink};outline-offset:2px}
        @media (prefers-reduced-motion: reduce){*{transition:none!important}}
        .lab-cols{display:flex;flex-direction:column}
        @media (min-width:1240px){
          .lab-cols{display:grid;grid-template-columns:minmax(400px,470px) minmax(0,1fr);gap:14px;align-items:start}
          .lab-out{position:sticky;top:10px}
        }
        table.cmp{border-collapse:collapse;width:100%}
        table.cmp th,table.cmp td{border:1px solid ${T.line};padding:4px 7px;font-size:10.5px;text-align:right}
        table.cmp th{background:#fff;color:${T.inkSoft};font-weight:600;text-align:right}
        table.cmp td:first-child,table.cmp th:first-child{text-align:left}
        table.cmp td,table.cmp th{font-variant-numeric:tabular-nums}
        table.cmp td:last-child,table.cmp th:last-child{min-width:76px}
        table.cmp td:nth-child(8),table.cmp th:nth-child(8){min-width:44px}
      `}</style>
      <div style={{ backgroundImage: `linear-gradient(${T.grid} 1px, transparent 1px), linear-gradient(90deg, ${T.grid} 1px, transparent 1px)`, backgroundSize: "28px 28px" }}>
        <div style={{ padding: "26px 20px 60px" }}>

          {/* title block */}
          <div style={{ border: `2px solid ${T.ink}`, background: T.film, borderRadius: 4, padding: "12px 20px", marginBottom: 18 }}>
            <h1 style={{ margin: "0 0 4px", fontSize: 25, fontWeight: 700, lineHeight: 1.15 }}>ACO Quality Reporting Calculator</h1>
            <p style={{ margin: 0, fontSize: 13, color: T.inkSoft, lineHeight: 1.5 }}>
              Medicare Shared Savings Program ACOs report five quality measures and choose a reporting method for
              each. The same care scores differently — and pays differently — depending on the method's benchmark
              table and bonuses. Everything here uses CMS's actual <b>2026</b> tables (care year 2026, reported
              early 2027). Pick an example ACO, choose methods, adjust inputs.
            </p>
          </div>

          {/* wide screens: inputs (steps + measure cards) left, outputs (score + dollars) right */}
          <div className="lab-cols">
          <div className="lab-in" ref={inRef}>

          {/* scenario + master switch */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 12, marginBottom: 12 }}>
            <Panel title="Step 1 · Pick an example ACO" tag={`$${benchmarkM}M cost benchmark · ${TRACKS[track].label}${isCustom ? " · custom" : ""}`}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                {Object.values(SCENARIOS).map((s) => {
                  const active = scenario === s.key && !isCustom;
                  return (
                    <button key={s.key} onClick={() => load(s.key)} style={{
                      padding: "5px 11px", borderRadius: 3, cursor: "pointer", fontSize: 12, fontWeight: 600, ...sans,
                      border: `1.5px solid ${active ? T.ink : T.line}`,
                      background: active ? T.ink : "#fff", color: active ? "#fff" : T.inkSoft,
                    }}>{s.name}</button>
                  );
                })}
                {isCustom && (
                  <span title="one or more Step 3 inputs deviate from the preset" style={{
                    padding: "5px 11px", borderRadius: 3, fontSize: 12, fontWeight: 600, ...sans,
                    border: `1.5px dashed ${T.money}`, background: "#fff", color: T.money,
                  }}>Custom</span>
                )}
              </div>
              <p style={{ fontSize: 12, color: T.inkSoft, margin: 0, lineHeight: 1.5 }}>
                {isCustom
                  ? `Custom inputs — started from "${scen.name}"; click a preset to reset.`
                  : scen.story}
              </p>
            </Panel>

            <div ref={step2Ref}>
            <Panel title="Step 2 · Choose a reporting method for all five measures" tag={allSame ? CT[allSame].label : isBestApplied ? "highest-$ mix applied" : "mixed (set per measure below)"}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {PATHWAYS.map((k) => (
                  <button key={k} onClick={() => routeAll(k)} style={{
                    display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-start",
                    padding: "8px 12px", borderRadius: 3, cursor: "pointer", fontSize: 11, fontWeight: 600, ...sans,
                    border: `2px solid ${allSame === k ? CT[k].color : T.line}`,
                    background: allSame === k ? CT[k].color : "#fff", color: allSame === k ? "#fff" : CT[k].color,
                  }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, width: 48, flexShrink: 0 }}>
                      <PopGlyph full={CT[k].fullPop} color={allSame === k ? "#fff" : CT[k].color} size={14} />
                      <PipeGlyph electronic={CT[k].electronic} color={allSame === k ? "#fff" : CT[k].color} width={24} />
                    </span>
                    <span style={{ textAlign: "left" }}>{CT[k].label}{CT[k].proposed ? "*" : ""}{CT[k].sunset ? "†" : ""}</span>
                  </button>
                ))}
                <button onClick={() => { setRouting({ ...bestRouting }); setGates({ "001": true, "134": true, "236": true, "112": true, "113": true }); }}
                  title="Set every measure to the highest-value method mix found by the comparison search"
                  style={{
                    gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-start",
                    padding: "6px 12px", borderRadius: 3, cursor: "pointer", fontSize: 11, fontWeight: 600, ...sans,
                    border: `2px solid ${isBestApplied ? T.money : T.line}`,
                    background: isBestApplied ? T.money : "#fff", color: isBestApplied ? "#fff" : T.money,
                  }}>
                  <span style={{ width: 48, flexShrink: 0, display: "flex", justifyContent: "flex-start" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                      <circle cx="8" cy="8" r="6.5" fill="none" stroke={isBestApplied ? "#fff" : T.money} strokeWidth="1.6" />
                      <circle cx="8" cy="8" r="2.4" fill={isBestApplied ? "#fff" : T.money} />
                    </svg>
                  </span>
                  <span>Apply highest-$ mix</span>
                  <span style={{ display: "flex", gap: 6, marginLeft: 2 }}>
                    {MEASURES.map((m) => (
                      <span key={m.id} title={`${m.id} → ${CT[bestRouting[m.id]].label}`}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, lineHeight: 1 }}>
                        <span style={{ fontSize: 7, ...mono, color: isBestApplied ? "rgba(255,255,255,0.75)" : T.inkFaint }}>{m.id}</span>
                        <span style={{
                          width: 16, height: 15, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 9, fontWeight: 700, ...mono, color: "#fff",
                          background: isBestApplied ? "rgba(255,255,255,0.28)" : CT[bestRouting[m.id]].color,
                          border: isBestApplied ? "1px solid rgba(255,255,255,0.8)" : "none",
                        }}>
                          {SHORT[bestRouting[m.id]]}
                        </span>
                      </span>
                    ))}
                  </span>
                </button>
              </div>
              <p style={{ fontSize: 10.5, color: T.inkFaint, margin: "8px 0 0", lineHeight: 1.5 }}>
                These buttons set all five measures at once; each card below can override (mixing is allowed).
              </p>
              <Info summary="the four methods · the green button">
                eCQM = electronic from EHR data, all patients. MIPS CQM (†) = chart review / registry, all patients —
                PY2026 is its final year under current law (an extension is proposed, not final). Medicare CQM =
                chart review, Medicare patients only. Medicare eCQM (*) = electronic, Medicare patients only —
                proposed for 2027, not final. The green button applies the comparison table's highest-dollar mix — an
                exploration, not advice — and clears any simulated reporting failures.
              </Info>
            </Panel>
            </div>
          </div>

          {/* labeled inputs */}
          <Panel title="Step 3 · Adjust the inputs" style={{ marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
              <div>
                <div style={{ fontSize: 10.5, ...mono, color: T.inkSoft, marginBottom: 6, minHeight: 16 }}>eCQM DATA-CAPTURE EFFICIENCY: <b style={{ color: CT.ecqm.color }}>{(capture * 100).toFixed(0)}%</b></div>
                <input type="range" min={0.65} max={1} step={0.01} value={capture} onChange={(e) => setCapture(+e.target.value)} style={{ width: "100%", accentColor: CT.ecqm.color }} aria-label="capture efficiency" />
                <div style={{ margin: "2px 0 0" }}>
                  <PinRow pins={CAPTURE_PINS} cur={capture * 100} onPick={(v) => setCapture(v / 100)} fmt={(v) => `${v}%`} color={CT.ecqm.color} />
                </div>
                <p style={{ fontSize: 10.5, color: T.inkFaint, margin: "3px 0 0", lineHeight: 1.45 }}>
                  Share of truly-delivered care with conforming coded proof — uncoded care is reported as failure.
                </p>
                <Info summary="how capture works · what's not modeled">
                  eCQMs are computed over every eligible patient, all payers — no picking who to report. The slider
                  models the numerator: care counts only as coded proof, so uncoded care reports as failure (001
                  counts a missing result as poor control, so its rate rises). Not modeled: patients whose diagnoses
                  or encounters are never coded vanish from the measure entirely — that often flatters rates, since
                  invisible patients skew unscreened and uncontrolled. CMS's easier electronic benchmarks bake in
                  both effects. Pins are labeled assumptions ("top-rung" ≈ capture needed for the best eCQM deciles);
                  a collapse breaking the 75% completeness rule is the "reporting failure" checkbox below.
                </Info>
              </div>
              <div>
                <div style={{ fontSize: 10.5, ...mono, color: T.inkSoft, marginBottom: 6, minHeight: 16 }}>ORGANIZATION (this ACO)</div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, ...mono, color: T.inkSoft, marginBottom: 5 }}>
                  <span style={{ width: 100, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>beneficiaries</span>
                  <input type="range" min={5000} max={60000} step={250} value={benes} onChange={(e) => setBenes(+e.target.value)} style={{ flex: 1, accentColor: T.ink }} aria-label="assigned beneficiaries" />
                  <b style={{ width: 56, color: T.ink, whiteSpace: "nowrap", textAlign: "right" }}>{(benes / 1000).toFixed(1)}k</b>
                </label>
                <div style={{ margin: "0 0 3px" }}>
                  <PinRow pins={BENE_PINS} cur={benes} onPick={setBenes} fmt={(v) => `${(v / 1000).toFixed(1)}k`} />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, ...mono, color: T.inkSoft, margin: "7px 0 5px" }}>
                  <span style={{ width: 100, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>$ per beneficiary</span>
                  <input type="range" min={10000} max={17000} step={100} value={perCap} onChange={(e) => setPerCap(+e.target.value)} style={{ flex: 1, accentColor: T.ink }} aria-label="benchmark dollars per beneficiary" />
                  <b style={{ width: 56, color: T.ink, whiteSpace: "nowrap", textAlign: "right" }}>${(perCap / 1000).toFixed(1)}k</b>
                </label>
                <div style={{ margin: "0 0 3px" }}>
                  <PinRow pins={PERCAP_PINS} cur={perCap} onPick={setPerCap} fmt={(v) => `$${(v / 1000).toFixed(1)}k`} />
                </div>
                <div style={{ margin: "6px 0 3px", fontSize: 10, ...mono, color: T.inkSoft }}>
                  COST BENCHMARK: {(benes / 1000).toFixed(1)}k × ${(perCap / 1000).toFixed(1)}k = <b style={{ color: T.ink }}>${benchmarkM}M</b>
                </div>
                <div style={{ margin: "8px 0 3px", fontSize: 10, ...mono, color: T.inkSoft }}>TRACK</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {(Object.keys(TRACKS) as TrackKey[]).map((k) => (
                    <button key={k} onClick={() => setTrack(k)} style={{
                      border: `1px solid ${track === k ? T.ink : T.line}`, background: track === k ? T.ink : "#fff",
                      color: track === k ? "#fff" : T.inkSoft, borderRadius: 2, padding: "2px 6px",
                      fontSize: 9, ...mono, cursor: "pointer", whiteSpace: "nowrap",
                    }}>
                      {TRACKS[k].label.replace(" (one-sided)", "")}
                    </button>
                  ))}
                </div>
                <div style={{ margin: "6px 0 3px", fontSize: 10, ...mono, color: T.inkSoft, cursor: "help" }}
                  title="One-sided BASIC: a mandatory sliding scale by assigned beneficiaries (42 CFR 425.605(b)(1)). Two-sided BASIC and ENHANCED: the ACO elects at application/renewal, for the whole agreement period, from zero / 0.5-2.0% in 0.5% increments / the sliding scale (425.605(b)(2), 425.610(b)(1)). The election is SYMMETRICAL — the same number is the minimum loss rate (not modeled here).">
                  MIN SAVINGS RATE: <b style={{ color: T.ink }}>{msr.toFixed(1)}%</b>{oneSided ? " · sliding scale (set by size)" : " · elected (symmetrical, whole agreement):"}
                </div>
                {!oneSided && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {([0, 0.5, 1, 1.5, 2, "scale"] as (number | "scale")[]).map((o) => (
                      <button key={String(o)} onClick={() => setMsrElect(o)} style={{
                        border: `1px solid ${msrElect === o ? T.ink : T.line}`, background: msrElect === o ? T.ink : "#fff",
                        color: msrElect === o ? "#fff" : T.inkSoft, borderRadius: 2, padding: "2px 6px",
                        fontSize: 9, ...mono, cursor: "pointer", whiteSpace: "nowrap",
                      }}>
                        {o === "scale" ? `scale ${slidingMsr(benes).toFixed(1)}%` : `${o}%`}{o !== "scale" && o !== 0 ? "" : ""}
                      </button>
                    ))}
                  </div>
                )}
                <p style={{ fontSize: 10.5, color: T.inkFaint, margin: "3px 0 0", lineHeight: 1.45 }}>
                  Pins are real PY2024 percentiles (476 ACOs). Any change makes the ACO custom.
                </p>
                <Info summary="what track & minimum savings rate do">
                  Cost benchmark sizes the savings/loss pool. Track sets the sharing cap (40% BASIC A–B / 50% C–E /
                  75% ENHANCED) and the loss rail (none / flat 30% / quality-scaled). The minimum savings rate is set
                  by rule: one-sided BASIC ACOs get the mandatory sliding scale by assigned beneficiaries
                  (42 CFR 425.605(b)(1); interpolated here from real PY2024 values). Two-sided BASIC and ENHANCED
                  ACOs do elect theirs — at application or renewal, fixed for the whole agreement period, choosing
                  zero, a 0.5–2.0% value in 0.5% increments, or the same sliding scale (425.605(b)(2),
                  425.610(b)(1)). That election is <b>symmetrical</b>: the identical number becomes the minimum
                  loss rate. Both edges are gates, not deductibles: clear the band and you share (or owe) on the
                  full amount from the first dollar. So a higher election buys exactly one thing — a wider
                  no-man's-land where a random bad year costs nothing — at the price of forfeiting the small
                  wins. Electing 0% means sharing from the first dollar and owing from the first dollar. A Step 1
                  preset resets all of these.
                </Info>
              </div>
              <div>
                <div style={{ fontSize: 10.5, ...mono, color: T.inkSoft, marginBottom: 6, minHeight: 16 }}>GROSS SAVINGS RATE: <b style={{ color: grossPct >= 0 ? T.money : T.debt }}>{grossPct >= 0 ? "+" : ""}{grossPct.toFixed(1)}%</b> <span style={{ color: T.inkFaint }}>= spent {Math.abs(grossPct).toFixed(1)}% {grossPct >= 0 ? "UNDER" : "OVER"} its cost benchmark</span></div>
                <input type="range" min={-3} max={12} step={0.1} value={grossPct} onChange={(e) => setGrossPct(+e.target.value)} style={{ width: "100%", accentColor: grossPct >= 0 ? T.money : T.debt }} aria-label="gross result" />
                <div style={{ margin: "2px 0 4px" }}>
                  <PinRow pins={GROSS_PINS} cur={grossPct} onPick={setGrossPct} fmt={(v) => `${v >= 0 ? "+" : ""}${v}%`} color={T.money} />
                </div>
                <div style={{ margin: "8px 0 3px", fontSize: 10, ...mono, color: T.inkSoft }}>CMS-SCORED MEASURES (decile points)</div>
                {([
                  { k: "cahps" as const, label: "CAHPS survey" },
                  { k: "claims1" as const, label: "479 readmits" },
                  { k: "claims2" as const, label: "484 chronic" },
                ]).map((f) => (
                  <label key={f.k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, ...mono, color: T.inkSoft, marginBottom: 3 }}>
                    <span style={{ width: 100, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.label}</span>
                    <input type="range" min={0} max={10} value={fixedPts[f.k]} onChange={(e) => setFixedPts({ ...fixedPts, [f.k]: +e.target.value })} style={{ flex: 1, accentColor: T.fixed }} aria-label={f.label} />
                    <b style={{ width: 56, color: T.ink, whiteSpace: "nowrap", textAlign: "right" }}>{fixedPts[f.k]} pts</b>
                  </label>
                ))}
                <Info summary="why these matter more than they look">
                  CMS scores these three without any ACO submission, so the lab treats them as inputs. They are not
                  passengers: 479 and 484 are <b>outcome</b> measures for deeming, and any of the three at 5+ points
                  satisfies the 40th-percentile condition — so an ACO with strong survey and claims results can be
                  deemed even with poor clinical scores. Drag them below 5 (and below 2) to break that. Medicare-only
                  methods are separately assumed to score {POP_ADJ} points better on screening rates (older patients
                  get screened more).
                </Info>
                <label style={{ display: "flex", gap: 7, alignItems: "flex-start", marginTop: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={proposedFlat} onChange={(e) => setProposedFlat(e.target.checked)} style={{ marginTop: 2 }} />
                  <span style={{ fontSize: 10.5, color: T.inkSoft, lineHeight: 1.45 }}>
                    <b>Apply pending proposed rule (on by default, not final):</b> score all Medicare CQM measures on
                    flat 10-point bands instead of the tougher real-data 2026 benchmarks for 001/134/236 (CMS-1848-P;
                    final decision ~November 2026) — uncheck to see current law. CMS's own estimate: flat benchmarks
                    would raise average ACO quality scores by <b>11 percentage points</b> (91 FR 44042).
                  </span>
                </label>
                <label style={{ display: "flex", gap: 7, alignItems: "flex-start", marginTop: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={assumePerfBench} onChange={(e) => setAssumePerfBench(e.target.checked)} style={{ marginTop: 2 }} />
                  <span style={{ fontSize: 10.5, color: T.inkSoft, lineHeight: 1.45 }}>
                    <b>CMS builds a performance-period benchmark for 112/113 (on by default; decided in 2027):</b>{" "}
                    after submissions close CMS tries to build a benchmark from that year's own data — in PY2024 it
                    did so for every benchmark-less required measure. Then these score normally, out of 80. Uncheck
                    for the fallback: too few submissions, so they're excluded from both sides (out of 60) AND the
                    score is floored at 73.85 — which passes the standard outright.
                  </span>
                </label>
                <div style={{ marginTop: 8, fontSize: 10.5, color: T.inkSoft, lineHeight: 1.6 }}>
                  Simulate a reporting failure (below 75% completeness) on:
                  <span style={{ display: "inline-flex", gap: 9, marginLeft: 7, ...mono }}>
                    {MEASURES.map((m) => (
                      <label key={m.id} style={{ display: "inline-flex", gap: 3, alignItems: "center", cursor: "pointer" }}>
                        <input type="checkbox" checked={!gates[m.id]} onChange={() => setGates({ ...gates, [m.id]: !gates[m.id] })} />
                        {m.id}
                      </label>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </Panel>

          </div>
          <div className="lab-out" ref={outRef}>

          {/* stations */}
          <Panel style={{ marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(205px, 1fr))", gap: 8 }}>
              {mach.rows.map((r) => (
                <Station key={r.id} row={r} gate={gates[r.id]}
                  onRoute={(id, k) => setRouting({ ...routing, [id]: k })}
                  onRate={(id, v) => setRates({ ...rates, [id]: v })} />
              ))}
            </div>
            <Info summary="reading the cards · 2026 quirks">
              Each ladder is the method's real 2026 benchmark — hover a rung for its cutpoints; taller rung = wider
              scoring band; "measured" is the care slider after the Step 3 adjustments.{" "}
              Care-rate chips jump to registry-reported percentiles — real chart-review rates with no capture loss
              (001/134/236: CMS's 2026 Medicare CQM tables from actual ACO submissions; 112/113: the 2025 MIPS CQM
              file; 001's percentiles are of performance, so lower is better). Quirks: 112/113 have no published 2026
              benchmark under eCQM or MIPS CQM (dashed ladders; excluded from both earned points and the denominator
              per 42 CFR 414.1367(c)(1)(i)); 134 under MIPS CQM is capped at 7 points (dashed red line); 001 counts a
              bad outcome, so lower is better; the Medicare CQM ladders for 001/134/236 are built from real ACO
              submissions — far steeper than the flat bands the pending proposed rule (toggle in Step 3, on by
              default) restores. Simulate a reporting failure with the Step 3 checkboxes. One modeled judgment
              call: an excluded measure still earns its +1 electronic bonus here — CMS has never addressed
              whether the bonus survives exclusion (its conditions are data completeness and case minimum, neither
              mentioning benchmarks), and in that branch the 73.85 floor usually moots the difference anyway.
            </Info>
          </Panel>


          {/* waterfall + rails */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 12, marginBottom: 12, alignItems: "start" }}>
            <Panel title="How the points add up" tag={`score ${mach.qRaw.toFixed(1)}% = ${mach.total} of ${mach.available} pts${mach.floored ? ` → floored to ${QPS}` : ""}`}>
              <Waterfall steps={steps} total={mach.total} available={mach.available} />
              <p style={{ fontSize: 10, color: T.inkFaint, margin: "6px 0 0" }}>
                One bar per measure. COA = the electronic bonus. CAHPS (patient survey) and 479/484 (claims
                outcome measures) are scored by CMS with no ACO submission — grey because you can't route them,
                but they carry points and both deeming conditions. Total ÷ {mach.available} = the score.
              </p>
            </Panel>
            <Panel title="Does the ACO pass the quality standard?" tag="two routes — either one passes on its own">
              <div style={{ border: `1.5px solid ${mach.deemed ? T.pass : T.line}`, background: mach.deemed ? "rgba(22,163,74,0.06)" : "#fff", borderRadius: 4, padding: "6px 10px", marginBottom: 6, opacity: mach.status === "MET" ? 0.55 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 10, ...mono, marginBottom: 6 }}>
                  <span style={{ color: T.inkSoft }}>ROUTE A · DEEMED — the eCQM/MIPS CQM reporting incentive</span>
                  <b style={{ color: mach.status === "MET" ? T.inkFaint : mach.deemed ? T.pass : T.fail, whiteSpace: "nowrap" }}>{mach.deemed ? "ALL 4 MET ✓" : mach.status === "MET" ? `NOT NEEDED · ${deemLit}/4` : `${deemLit}/4 MET`}</b>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <StatusLamp on={mach.allFull} label="All five measures via an all-patient method (eCQM / MIPS CQM)" />
                  <StatusLamp on={mach.allGates} label="Every measure met reporting minimums" />
                  <StatusLamp on={mach.outcomeOK} label="An outcome measure (001, 236, or claims) beat the bottom 10%" />
                  <StatusLamp on={mach.otherOK} label="Another of the remaining seven (incl. CAHPS + claims) hit the 40th percentile" />
                </div>
                <Info summary="what these percentiles are measured against">
                  Both are percentiles <b>of the performance benchmark</b> (42 CFR 425.512(a)(5)(i)(B)(2)) — that is,
                  which decile your measured rate lands in: decile 2+ clears the 10th percentile, decile 5+ clears the
                  40th. What that means as an actual rate depends entirely on the cell, because the ladder does.
                  Measure 236 needs <b>≥45.3%</b> BP control to clear the 10th percentile under eCQM, where the ladder
                  is a real distribution of eCQM reporters — but only <b>≥10%</b> under MIPS CQM, whose flat ladder is
                  a policy-set percentage rather than a percentile of anyone. So the same condition is a genuine bar
                  in one cell and nearly free in another. CAHPS and the two claims measures arrive as decile points
                  already, so 2+ and 5+ apply to them directly.
                </Info>
              </div>
              <div style={{ border: `1.5px solid ${mach.deemed ? T.line : mach.q >= QPS ? T.pass : T.fail}`, background: "#fff", borderRadius: 4, padding: "6px 10px", opacity: mach.deemed ? 0.55 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 10, ...mono, marginBottom: 3 }}>
                  <span style={{ color: T.inkSoft }}>ROUTE B · PASS BY SCORE — beat the national 40th percentile</span>
                  <b style={{ color: mach.deemed ? T.inkFaint : mach.q >= QPS ? T.pass : T.fail, whiteSpace: "nowrap" }}>
                    {mach.deemed ? `NOT CONSULTED · ${mach.q.toFixed(1)} vs ${QPS}` : `${mach.q.toFixed(1)} ${mach.q >= QPS ? "≥" : "<"} ${QPS}`}
                  </b>
                </div>
                <ThresholdStrip value={mach.q} threshold={QPS} flagLabel="passing bar 73.85 (real '26)" dimmed={mach.deemed} />
                {mach.floored && (
                  <p style={{ fontSize: 9.5, color: "#D97706", margin: "3px 0 0", lineHeight: 1.4 }}>
                    Floored: score {mach.qRaw.toFixed(1)} lifted to 73.85 — a required measure had no benchmark
                    (42 CFR 425.512(a)(7)(ii)(B)), so the standard is met by score.
                  </p>
                )}
                {!mach.deemed && mach.q < QPS && (
                  <p style={{ fontSize: 9.5, color: T.inkFaint, margin: "4px 0 0", lineHeight: 1.4 }}>
                    Below the bar with no automatic pass: if an outcome measure still beat the bottom 10%, the ACO
                    lands on the alternative standard — PARTIAL, sharing rate scaled by the score. Otherwise it fails.
                  </p>
                )}
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <WireIcon binary color={statusColor} />
                <span style={{ fontSize: 13, fontWeight: 700, color: statusColor, ...mono }}>
                  {mach.status === "DEEMED" ? "DEEMED · full rate" : mach.status === "MET" ? "MET BY SCORE · full rate" : mach.status === "ALT" ? "PARTIAL · rate scaled by score" : "NOT MET"}
                </span>
                <span style={{ fontSize: 10, color: T.inkFaint }}>
                  {mach.status === "DEEMED" ? "all four Route A conditions met" : mach.status === "MET" ? "Route B — score above the bar" : mach.status === "ALT" ? "neither route; the outcome floor keeps scaled sharing" : "neither route, no outcome floor"}
                </span>
              </div>
            </Panel>
          </div>

          <Panel title="Settlement — quality unlocks the sharing rate" tag={TRACKS[track].label} style={{ marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18, alignItems: "start", ...mono, fontSize: 11, color: T.inkSoft }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 10, color: T.inkFaint }}>{fin.gross >= 0 ? "SAVINGS POOL" : "OVERSPEND"}</span>
                <b style={{ fontSize: 20, lineHeight: 1, color: fin.gross >= 0 ? T.money : T.debt }}>{fmt$(Math.abs(fin.gross))}</b>
                <span style={{ color: T.inkFaint }}>spent {Math.abs(grossPct).toFixed(1)}% {fin.gross >= 0 ? "under" : "over"} the ${benchmarkM}M benchmark</span>
                {fin.gross >= 0 && msr > 0 && (grossPct >= msr
                  ? <span style={{ color: T.inkFaint, cursor: "help" }} title="A hurdle, not a deductible: clear it and the ACO shares in ALL savings under the benchmark, from the first dollar (42 CFR 425.605(d)).">qualifies: {grossPct.toFixed(1)}% ≥ {msr.toFixed(1)}% minimum savings rate ✓</span>
                  : <span style={{ color: T.fail, fontWeight: 700, cursor: "help" }} title="Nothing is shared until savings beat this margin. For two-sided tracks the same elected number is also the minimum LOSS rate, so the band that costs you small wins also shields you from small losses.">does not qualify: under the {msr.toFixed(1)}% minimum savings rate · nothing shared</span>)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {fin.gross >= 0 ? (
                  <>
                    <RateMeter actual={fin.sharePct} max={TRACKS[track].maxShare} />
                    {mach.status === "ALT"
                      ? <span style={{ color: T.inkFaint }}>hatched = forfeited by the score: {TRACKS[track].maxShare}% max × {mach.q.toFixed(1)}% (standard missed, outcome floor met)</span>
                      : mach.status === "FAILED"
                        ? <span style={{ color: T.fail, fontWeight: 700 }}>quality standard not met · nothing shared</span>
                        : <span style={{ color: T.inkFaint }}>full rate — quality standard met {mach.status === "DEEMED" ? "(deemed)" : "(by score)"}</span>}
                  </>
                ) : TRACKS[track].loss !== "none" && msr > 0 && Math.abs(grossPct) < msr ? (
                  <>
                    <span style={{ fontSize: 10, color: T.inkFaint }}>LOSS RAIL</span>
                    <b style={{ fontSize: 20, lineHeight: 1, color: T.money }}>owes nothing</b>
                    <span style={{ color: T.money, cursor: "help" }} title="The elected MSR/MLR is symmetrical: the same number that gates savings also shields against losses. Inside the band nothing settles in either direction — this protection is the only reason to elect a higher number.">
                      inside the ±{msr.toFixed(1)}% deadband — the elected rate cuts both ways
                    </span>
                  </>
                ) : TRACKS[track].loss === "none" ? (
                  <>
                    <span style={{ fontSize: 10, color: T.inkFaint }}>LOSS RAIL</span>
                    <b style={{ fontSize: 20, lineHeight: 1, color: T.money }}>none</b>
                    <span style={{ color: T.inkFaint }}>one-sided track · no shared losses</span>
                  </>
                ) : TRACKS[track].loss === "flat30" ? (
                  <>
                    <LossMeter actual={30} max={30} fixed />
                    <span style={{ color: T.inkFaint }}>fixed rate — quality trims nothing in BASIC C–E</span>
                  </>
                ) : (
                  <>
                    <LossMeter actual={fin.lossPct} max={75} />
                    <span style={{ color: T.inkFaint }}>hatched = trimmed by quality: repays <b style={{ color: T.debt }}>{fmt$(Math.abs(fin.losses$))}</b> instead of <b style={{ color: T.debt }}>{fmt$(0.75 * Math.abs(fin.gross))}</b> — <b style={{ color: T.money }}>{fmt$((0.75 - fin.lossPct / 100) * Math.abs(fin.gross))}</b> avoided</span>
                  </>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 10, color: T.inkFaint }}>NET TO ACO</span>
                <b style={{ fontSize: 20, lineHeight: 1, color: fin.net$ >= 0 ? T.money : T.debt }}>{fmt$(fin.net$)}</b>
                <span style={{ color: T.inkFaint }}>one extra quality point is worth <b style={{ color: marginal >= 0 ? T.money : T.debt }}>{marginal >= 0 ? "+" : ""}${Math.abs(marginal) >= 1000 ? (marginal / 1000).toFixed(2) + "M" : marginal.toFixed(0) + "k"}</b></span>
              </div>
            </div>
          </Panel>

          {/* pathway comparison */}
          <Panel title="Compare: what each reporting method would yield for this ACO" tag="same clinical performance in every row">
            <div style={{ overflowX: "auto" }}>
              <table className="cmp" style={mono}>
                <thead>
                  <tr>
                    <th>Strategy</th>
                    {MEASURES.map((m) => <th key={m.id}>{m.id} pts</th>)}
                    <th>COA</th><th>Score</th><th>Standard</th><th>Net $</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.key} style={{ background: row.key === "cfg" ? "#FFFDEE" : row.key === "best" ? "#EFFAF6" : "transparent" }}>
                      <td style={{ color: row.labelColor, fontWeight: 700 }}>{row.label}</td>
                      {row.m.rows.map((r) => (
                        <td key={r.id}>
                          {r.pts}{r.capped ? "ᶜ" : ""}
                          {row.showMethods && <sup style={{ color: CT[r.pathway].color, fontWeight: 700 }}> {SHORT[r.pathway]}</sup>}
                        </td>
                      ))}
                      <td>{row.m.coa > 0 ? `+${row.m.coa}` : "—"}</td>
                      <td><b>{row.m.q.toFixed(1)}</b></td>
                      <td style={{ color: row.m.status === "FAILED" ? T.fail : row.m.status === "ALT" ? "#D97706" : T.pass, fontWeight: 700 }}>{statusLabel(row.m.status)}</td>
                      <td style={{ color: row.f.net$ >= 0 ? T.money : T.debt, fontWeight: 700 }}>{fmt$(row.f.net$)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 10.5, color: T.inkFaint, margin: "8px 0 0", lineHeight: 1.5 }}>
              Same ACO, same care in every row — only the reporting strategy changes (superscripts: E / R / C / X =
              eCQM / MIPS CQM / Medicare CQM / Medicare eCQM).
            </p>
            <Info summary="how the explored mix works · why dollars tie">
              "As configured above" mirrors your current choices and gate toggles; other rows assume every measure
              reports successfully. The explored mix is exact: the calculator evaluates all 243 assignments legal for
              2026 (Medicare eCQM is a preview row, excluded from the search). Dollar ties are broken by the higher
              score — above the minimum savings rate, every passing strategy pays the same because the sharing rate
              saturates at the track cap, so the explored mix is the highest-score route to that money; the score
              still matters for public reporting, as the fallback if the automatic pass breaks, and for ENHANCED loss
              scaling. Row differences come from benchmark tables, capture losses, the 134 cap (ᶜ), and which methods
              carry the automatic pass and the electronic bonus. That the row you pick moves the money is not an
              artifact of this model — CMS said so when it created collection-type benchmarks: "assigning separate
              benchmarks in this manner creates opportunities for clinicians to achieve higher quality scores by
              selectively choosing submission mechanisms; …we intend to monitor for such activity and to report
              back" (81 FR 77278, 2016). No such report-back appears in the nine subsequent rules searched.
            </Info>
          </Panel>

          </div>
          </div>

          <footer style={{ marginTop: 24, borderTop: `1px solid ${T.line}`, paddingTop: 12 }}>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "baseline", fontSize: 11, marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: T.ink }}>ACO Quality Reporting Calculator</span>
              <a href="https://github.com/jmandel/app-plus-quality-lab" style={{ color: T.inkSoft }}>source on GitHub</a>
              <a href="https://github.com/jmandel/app-plus-quality-lab/blob/main/research/findings.md" style={{ color: T.inkSoft }}>calibration findings</a>
              <a href="https://github.com/jmandel/app-plus-quality-lab/tree/main/research" style={{ color: T.inkSoft }}>research dataset</a>
              <span style={{ color: T.inkFaint }}>an educational simulator, not reporting advice</span>
            </div>
            <div style={{ maxWidth: 920 }}>
          <Info summary="Model scope — what's in, what's out">
            In scope: how the five reported measures are scored under each collection type
            against real 2026 benchmarks; the quality performance standard (met by score or by the reporting
            incentive); the shared-savings rate; and quality-scaled shared losses. That is a complete model of the
            ACO-level settlement — including why the score keeps mattering after the standard is met in a loss year,
            and why, in a savings year above the threshold, one more point is worth $0. Out of
            scope: clinician-level MIPS fee adjustments (the mechanism is real, but its boundaries depend on
            per-clinician QP status and billing arrangements with no public data source), fractional
            within-decile scoring, score uncertainty, and CAHPS/claims-measure variation.
          </Info>
          <Info summary="Sources and limitations">
            Benchmark tables are CMS's actual published 2026 quality benchmarks. Where CMS
            published no 2026 benchmark (measures 112 and 113 under eCQM/MIPS CQM — insufficient 2024 data), the real
            scoring will use a benchmark computed after everyone submits; 2025 tables are shown as estimates and marked
            with dashed ladders. The Medicare CQM tables for 001, 134, and 236 are the real 2026 historical benchmarks
            built from ACO submissions; the toggle applies the pending July 2026 proposed rule that would replace them
            with flat bands (final decision expected November 2026). The data-capture and Medicare-population
            adjustments are illustrative modeling assumptions. The Medicare eCQM method (*) does not exist until 2027
            and only if finalized. The passing threshold is CMS's real published PY2026 value (73.85); because the lab awards
            whole-decile points (real MIPS awards fractional 1.0–10.9 within a decile), its scores read a few points
            below CMS's scale — treat near-bar outcomes as borderline. Sharing and loss rates follow the statutory track rules (40% BASIC A–B, 50% C–E, 75% ENHANCED;
            losses none / flat 30% / quality-scaled respectively), and savings are shared only past the ACO's
            minimum savings rate (the low-revenue half-rate exception is not modeled). MIPS CQM (†) is available
            for PY2026 but sunsets afterward under current law; CMS-1848-P proposes an extension. Dollar figures are rough estimates for learning
            purposes, not financial projections. Example-ACO profiles are calibrated to CMS's actual PY2024 Shared
            Savings Program results and participant files (data.cms.gov, 476 ACOs): the median real ACO had 13,151
            assigned beneficiaries, a $177M updated benchmark ($13,278 per person), 19 participating practice groups,
            and +4.2% gross savings; the strong scenario uses 75th-percentile values and the safety-net scenario
            25th/10th-percentile values from the same file. (Practice-group counts in the stories are
            narrative color, not percentile-derived.)
          </Info>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
