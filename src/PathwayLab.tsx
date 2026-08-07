import { useState, useMemo } from "react";
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
const AVAILABLE = 80, QPS = 55, POP_ADJ = 3;

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
  benchmarkM: number;
  grossPct: number;
  track: TrackKey;
  msr: number;
}

const SCENARIOS: Record<ScenarioKey, Scenario> = {
  strong: {
    key: "strong", name: "Integrated high performer",
    story: "An integrated health system ACO: 24,000 assigned Medicare patients (75th percentile of real 2024 ACOs), a few large consolidated practice groups, an experienced quality team, and spending 7.0% under its cost benchmark — a 75th-percentile 2024 financial result. It's in the ENHANCED track: two-sided risk, savings shared at up to 75%, and loss repayment scaled by the quality score. Its clinical performance is strong on every measure; the open question is which reporting method turns that performance into the most points and dollars.",
    rates: { "001": 17, "134": 76, "236": 79, "112": 77, "113": 73 },
    fixedPts: { cahps: 7, claims1: 6, claims2: 7 },
    benchmarkM: 330, grossPct: 7.0, track: "enhanced", msr: 0,
  },
  middle: {
    key: "middle", name: "Middle-of-the-road regional",
    story: "A regional ACO built to match the median real 2024 ACO: 13,000 assigned patients, 19 practice groups on four different electronic health records, spending 4.2% under benchmark. It's in BASIC Level B: one-sided (no loss repayment), savings shared at up to 40% once it beats its ~2.8% minimum savings rate. Average clinical performance. Note how measure 134 (depression screening) scores very differently by method — a 64% rate lands low on the MIPS CQM ladder (practices reporting that way average 86%) but mid-to-high on the electronic ladder — while measure 236 (blood pressure) runs the opposite direction.",
    rates: { "001": 24, "134": 64, "236": 72, "112": 69, "113": 66 },
    fixedPts: { cahps: 6, claims1: 5, claims2: 6 },
    benchmarkM: 177, grossPct: 4.2, track: "basicB", msr: 2.8,
  },
  safetynet: {
    key: "safetynet", name: "Safety-net / rural network",
    story: "A safety-net ACO: 8,000 assigned patients (25th percentile) across 24 small independent practices, and it spent 0.5% more than its cost benchmark — a bottom-decile 2024 financial result. Its one-sided BASIC Level A track means it repays nothing back — but it also shares nothing until savings beat its ~3.2% minimum savings rate, so the quality standard gates only potential upside here. (A two-sided track would repay: a flat 30% in BASIC C–E regardless of quality; quality-scaled in ENHANCED.)",
    rates: { "001": 33, "134": 52, "236": 63, "112": 56, "113": 49 },
    fixedPts: { cahps: 5, claims1: 4, claims2: 5 },
    benchmarkM: 95, grossPct: -0.5, track: "basicA", msr: 3.2,
  },
};

const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };
const sans: React.CSSProperties = { fontFamily: "'Instrument Sans', system-ui, sans-serif" };
const stripe = (c: string): React.CSSProperties => ({ backgroundImage: `repeating-linear-gradient(135deg, ${c} 0 4px, #fff 4px 7px)` });
const fmt$ = (m: number) => `${m < 0 ? "−" : ""}$${Math.abs(m).toFixed(2)}M`;
const SHORT: Record<PathwayId, string> = { ecqm: "E", mipscqm: "R", medcqm: "C", medecqm: "X" };
type Status = "DEEMED" | "MET" | "ALT" | "FAILED";
const statusLabel = (s: Status) => s === "DEEMED" ? "PASS (auto)" : s === "MET" ? "PASS" : s === "ALT" ? "PARTIAL" : "FAIL";

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
  available: number;
  allFull: boolean;
  allGates: boolean;
  outcomeOK: boolean;
  otherOK: boolean;
  deemed: boolean;
  status: Status;
}

function runMachine(routing: Routing, rates: Rates, gates: Gates, capture: number, fixedPts: FixedPts, proposedFlat: boolean): Machine {
  const rows = MEASURES.map((m) => {
    const meas = measuredRate(m.id, routing[m.id], rates[m.id], capture);
    const b = getBench(m.id, routing[m.id], proposedFlat);
    const dec = decileWith(b, BENCH[m.id].inverse, meas);
    // A submitted measure with no benchmark is excluded from BOTH earned points and the
    // available-points denominator (42 CFR 414.1367(c)(1)(i)); its estimate ladder stays
    // visible for context but scores nothing.
    const excluded = !!b.est;
    const pts = !excluded && gates[m.id] ? Math.min(dec, b.cap || 10) : 0;
    const coa = routing[m.id] === "ecqm" && gates[m.id] && pts < 10 ? 1 : 0;
    return { ...m, pathway: routing[m.id], underlying: rates[m.id], measured: meas, decile: dec, pts, coa, capped: !!b.cap && dec > b.cap, excluded, bench: b, inverse: BENCH[m.id].inverse };
  });
  const available = AVAILABLE - 10 * rows.filter((r) => r.excluded).length;
  const earned = rows.reduce((s, r) => s + r.pts, 0);
  const coa = Math.min(rows.reduce((s, r) => s + r.coa, 0), available * 0.1);
  const fixed = fixedPts.cahps + fixedPts.claims1 + fixedPts.claims2;
  const total = Math.min(earned + coa + fixed, available);
  const q = (total / available) * 100;
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
  return { rows, earned, coa, fixed, total, q, available, allFull, allGates, outcomeOK, otherOK, deemed, status };
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
  // Shared savings require beating the ACO's minimum savings rate (42 CFR 425.605(a)(6)).
  const savings$ = gross > 0 && fin.grossPct >= fin.msr ? (sharePct / 100) * gross : 0;
  const losses$ = gross < 0 ? (lossPct / 100) * gross : 0;
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
function ThresholdStrip({ value, threshold, flagLabel, markerColor = T.ink, dimmed = false, height = 50 }: { value: number; threshold: number; flagLabel: string; markerColor?: string; dimmed?: boolean; height?: number }) {
  const w = 260, h = height;
  const x = (v: number) => 8 + (Math.max(0, Math.min(100, v)) / 100) * (w - 16);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: 330, height: "auto", display: "block" }}>
      <path d={`M8 ${h - 12} C ${w * 0.25} ${h - 13}, ${w * 0.32} 8, ${w * 0.5} 10 S ${w * 0.75} ${h - 16}, ${w - 8} ${h - 12} Z`}
        fill={dimmed ? "#EDF0F2" : "#E3EAEF"} stroke={dimmed ? T.grayed : T.line} strokeWidth="1" />
      <line x1={8} y1={h - 12} x2={w - 8} y2={h - 12} stroke={dimmed ? T.grayed : T.ink} strokeWidth="1.2" />
      <line x1={x(threshold)} y1={4} x2={x(threshold)} y2={h - 12} stroke={dimmed ? T.grayed : T.fail} strokeWidth="1.6" strokeDasharray="4 3" />
      <path d={`M ${x(threshold)} 4 l 12 4 l -12 4 Z`} fill={dimmed ? T.grayed : T.fail} />
      <text x={Math.min(x(threshold) + 15, w - 82)} y={11} fontSize="8.5" fontFamily="IBM Plex Mono, monospace" fill={dimmed ? T.grayed : T.inkSoft}>{flagLabel}</text>
      <path d={`M ${x(value)} ${h - 11} l -5 8 h 10 Z`} fill={dimmed ? T.grayed : markerColor} />
      <text x={x(value)} y={h - 0.5} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={dimmed ? T.grayed : markerColor}>{value.toFixed(0)}</text>
    </svg>
  );
}

/* Real-cutpoint ladder: rung heights ∝ actual band widths; dashed outline = estimated bench. */
function RealLadder({ bench, inverse, color, measured, height = 92 }: { bench: Bench; inverse: boolean; color: string; measured: number; height?: number }) {
  const bounds = (inverse ? bench.caps : bench.floors)!;
  const dec = decileWith(bench, inverse, measured);
  const bands: { d: number; wdt: number }[] = [];
  for (let i = 0; i < 10; i++) {
    if (bounds[i] === null) continue;
    let wdt: number;
    if (inverse) { const hi = bounds[i]!, lo = i < 9 && bounds[i + 1] !== null ? bounds[i + 1]! : 0; wdt = hi - lo; }
    else { const lo = bounds[i]!; let hi = 100; for (let j = i + 1; j < 10; j++) if (bounds[j] !== null) { hi = bounds[j]!; break; } wdt = i === 9 ? Math.max(100 - lo, 2) : hi - lo; }
    bands.push({ d: i + 1, wdt: Math.max(wdt, 1.5) });
  }
  return (
    <div style={{ display: "flex", flexDirection: "column-reverse", gap: 1, height, opacity: bench.est ? 0.75 : 1 }}
      title={`${bench.kind}${bench.topped ? " · topped out, 7-pt cap" : ""}`}>
      {bands.map((band) => (
        <div key={band.d} style={{
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

function Station({ row, gate, onRoute }: { row: MeasureRow; gate: boolean; onRoute: (id: MeasureId, k: PathwayId) => void }) {
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
          <span style={line}>care rate: <b style={{ color: T.ink }}>{row.underlying}%</b></span>
          <span style={line}>measured ({ct.label.replace("Medicare ", "M-")}): <b style={{ color: ct.color }}>{row.measured.toFixed(1)}%</b></span>
          <span style={line}>ladder: {row.bench.est ? "2025 est. — no '26 bench" : row.bench.kind}{row.bench.topped ? " · TOPPED" : ""}</span>
          <span style={line}>{row.excluded
            ? <>est. decile <b style={{ color: T.ink }}>{row.decile}</b> — <b style={{ color: T.fail }}>excluded from score</b></>
            : <>decile <b style={{ color: T.ink }}>{row.decile}</b>{row.capped ? ` → capped @7` : ""} = <b style={{ color: gate ? T.ink : T.fail }}>{row.pts} pts</b></>}</span>
          {!gate && <span style={{ ...line, color: T.fail, fontWeight: 700 }}>REPORTING FAILURE — scored 0</span>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, ...mono, fontSize: 9.5, height: 20, alignItems: "center" }}>
        {row.coa > 0 && (
          <span style={{
            borderRadius: 2, padding: "1px 6px", border: `1px solid ${CT.ecqm.color}`, color: CT.ecqm.color, fontWeight: 600,
            backgroundImage: "repeating-linear-gradient(135deg, #F1F6FE 0 5px, #ffffff 5px 10px)",
          }}>+1 COA</span>
        )}
        {row.pathway === "ecqm" && row.pts === 10 && gate && <span style={{ borderRadius: 2, padding: "1px 6px", border: `1px solid ${T.line}`, color: T.inkFaint, textDecoration: "line-through" }}>COA capped</span>}
      </div>
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
}

function Waterfall({ steps, total }: { steps: WaterfallStep[]; total: number }) {
  const w = 640, h = 170, pad = { l: 34, r: 8, t: 14, b: 24 };
  const plotW = w - pad.l - pad.r, plotH = h - pad.t - pad.b;
  const n = steps.length + 1, colW = plotW / n, barW = Math.min(colW * 0.62, 50);
  const y = (v: number) => pad.t + plotH - (v / AVAILABLE) * plotH;
  let cum = 0;
  const cols = steps.map((s, i) => {
    const y0 = y(cum), y1 = y(cum + s.pts);
    const col = { ...s, i, x: pad.l + i * colW + (colW - barW) / 2, yTop: Math.min(y0, y1), hgt: Math.max(Math.abs(y0 - y1), s.pts > 0 ? 2 : 0), connY: y(cum + s.pts) };
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
          ) : (
            <rect x={c.x} y={c.yTop} width={barW} height={c.hgt}
              fill={c.pts === 0 ? "#fff" : c.color} opacity={c.kind === "fixed" ? 0.65 : 0.9}
              stroke={c.pts === 0 ? T.fail : c.color} strokeWidth={c.pts === 0 ? 1.5 : 1} strokeDasharray={c.pts === 0 ? "3 2" : "none"} />
          )}
          <line x1={c.x + barW} x2={c.x + colW} y1={c.connY} y2={c.connY} stroke={T.inkFaint} strokeWidth="1" strokeDasharray="2 2" />
          <text x={c.x + barW / 2} y={c.yTop - 3} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={c.pts === 0 ? T.fail : T.inkSoft}>{c.pts === 0 ? "0!" : `+${c.pts}`}</text>
          <text x={c.x + barW / 2} y={h - 12} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={T.inkSoft}>{c.label}</text>
        </g>
      ))}
      <g>
        <rect x={pad.l + steps.length * colW + (colW - barW) / 2} y={y(total)} width={barW} height={y(0) - y(total)} fill={T.ink} opacity="0.88" />
        <text x={pad.l + steps.length * colW + colW / 2} y={y(total) - 4} fontSize="9.5" fontWeight="700" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={T.ink}>{total}/80</text>
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
  const [grossPct, setGrossPct] = useState(s0.grossPct);
  const [proposedFlat, setProposedFlat] = useState(false);
  const [benchmarkM, setBenchmarkM] = useState(s0.benchmarkM);

  const scen = SCENARIOS[scenario];
  const load = (key: ScenarioKey) => {
    const s = SCENARIOS[key];
    setScenario(key); setRates({ ...s.rates }); setGrossPct(s.grossPct);
    setBenchmarkM(s.benchmarkM);
    setGates({ "001": true, "134": true, "236": true, "112": true, "113": true });
  };
  const routeAll = (k: PathwayId) => setRouting({ "001": k, "134": k, "236": k, "112": k, "113": k });
  const allSame = PATHWAYS.find((k) => MEASURES.every((m) => routing[m.id] === k));

  const mach = useMemo(() => runMachine(routing, rates, gates, capture, scen.fixedPts, proposedFlat), [routing, rates, gates, capture, scen, proposedFlat]);
  const fin = useMemo(() => settle(mach, { grossPct, benchmarkM, track: scen.track, msr: scen.msr }), [mach, grossPct, benchmarkM, scen]);
  const marginal = useMemo(() => {
    const plus = { ...mach, total: Math.min(mach.total + 1, mach.available), q: (Math.min(mach.total + 1, mach.available) / mach.available) * 100 };
    plus.status = plus.deemed ? "DEEMED" : plus.q >= QPS ? "MET" : plus.outcomeOK ? "ALT" : "FAILED";
    const base$ = settle(mach, { grossPct, benchmarkM, track: scen.track, msr: scen.msr }).net$;
    const plus$ = settle(plus, { grossPct, benchmarkM, track: scen.track, msr: scen.msr }).net$;
    return (plus$ - base$) * 1000;
  }, [mach, grossPct, benchmarkM, scen]);

  // Comparison rows: four uniform strategies, the current configuration, and the exact best
  // mixed assignment. Among eCQM/MIPS CQM only, per-measure greedy is provably optimal
  // (scoring is separable there — the automatic-pass condition holds for every such mix and
  // COA is per-measure). Attributed-column methods break separability only through the
  // automatic-pass AND-condition, so we simply check every legal assignment exactly.
  // Medicare eCQM is excluded from the search — it does not exist for PY2026 (proposed for
  // 2027) — leaving 3^5 = 243 assignments; its uniform row stays visible as a preview.
  const comparison = useMemo(() => {
    const ALLPASS: Gates = { "001": true, "134": true, "236": true, "112": true, "113": true };
    const finP = { grossPct, benchmarkM, track: scen.track, msr: scen.msr };
    const evalR = (r: Routing, g: Gates) => { const m = runMachine(r, rates, g, capture, scen.fixedPts, proposedFlat); return { m, f: settle(m, finP) }; };
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
    rows.push({ key: "best", label: "Best mix (all 243 PY26-legal checked)", labelColor: T.money, showMethods: true, ...best! });
    return rows;
  }, [rates, capture, grossPct, benchmarkM, scen, proposedFlat, routing, gates]);

  // Routing behind the "Best mix" row, reconstructed from its per-measure results,
  // so Step 2 can offer a one-click apply.
  const bestRouting = useMemo(() => {
    const bestRow = comparison[comparison.length - 1];
    return Object.fromEntries(bestRow.m.rows.map((r): [MeasureId, PathwayId] => [r.id, r.pathway])) as Routing;
  }, [comparison]);
  const isBestApplied = MEASURES.every((m) => routing[m.id] === bestRouting[m.id]);

  const steps: WaterfallStep[] = [
    ...mach.rows.map((r) => ({ key: r.id, label: r.id, pts: r.pts, color: CT[r.pathway].color })),
    ...(mach.coa > 0 ? [{ key: "coa", label: "COA", pts: mach.coa, color: CT.ecqm.color, pattern: "stripe" }] : []),
    { key: "fixt", label: "FIXT", pts: mach.fixed, color: T.fixed, kind: "fixed" },
  ];
  const statusColor = mach.status === "FAILED" ? T.fail : mach.status === "ALT" ? "#D97706" : T.pass;

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
          .lab-out{position:sticky;top:10px;max-height:calc(100vh - 20px);overflow-y:auto;padding-right:2px}
        }
        table.cmp{border-collapse:collapse;width:100%}
        table.cmp th,table.cmp td{border:1px solid ${T.line};padding:4px 7px;font-size:10.5px;text-align:right}
        table.cmp th{background:#fff;color:${T.inkSoft};font-weight:600;text-align:right}
        table.cmp td:first-child,table.cmp th:first-child{text-align:left}
      `}</style>
      <div style={{ backgroundImage: `linear-gradient(${T.grid} 1px, transparent 1px), linear-gradient(90deg, ${T.grid} 1px, transparent 1px)`, backgroundSize: "28px 28px" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto", padding: "26px 16px 60px" }}>

          {/* title block */}
          <div style={{ border: `2px solid ${T.ink}`, background: T.film, borderRadius: 4, display: "flex", flexWrap: "wrap", marginBottom: 18 }}>
            <div style={{ padding: "14px 20px", flex: "1 1 380px", borderRight: `1px solid ${T.line}` }}>
              <h1 style={{ margin: "0 0 6px", fontSize: 25, fontWeight: 700, lineHeight: 1.15 }}>ACO Quality Reporting Calculator</h1>
              <p style={{ margin: 0, fontSize: 13, color: T.inkSoft, maxWidth: 640, lineHeight: 1.55 }}>
                Medicare Shared Savings Program ACOs must report five quality measures to CMS each year, and can choose
                among several reporting methods (called "collection types") for each measure. Each method scores the
                same measure against a different benchmark table, and some methods come with bonuses that others don't.
                Everything here is for the <b>2026 performance year</b>: care delivered January–December 2026, reported
                to CMS in early 2027, using the benchmark tables CMS published in January 2026.
                This calculator uses CMS's actual published 2026 benchmark tables (the ones governing the current
                reporting year) to show how the same clinical performance earns different scores — and different
                shared-savings dollars — depending on the reporting method chosen. Pick an example ACO, choose
                reporting methods, and adjust any input to see its effect.
              </p>
            </div>
            <div style={{ padding: "14px 20px", ...mono, fontSize: 10, color: T.inkSoft, display: "flex", flexDirection: "column", gap: 3, justifyContent: "center" }}>
              <span>BENCHMARK TABLES: CMS 2026 (ACTUAL, WHERE PUBLISHED)</span>
              <span>DATA-CAPTURE MODEL: ADJUSTABLE ASSUMPTIONS</span>
              <span>DOLLAR FIGURES: SIMPLIFIED ESTIMATES</span>
            </div>
          </div>

          {/* wide screens: inputs (steps + measure cards) left, outputs (score + dollars) right */}
          <div className="lab-cols">
          <div className="lab-in">

          {/* scenario + master switch */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 12, marginBottom: 12 }}>
            <Panel title="Step 1 · Pick an example ACO" tag={`$${benchmarkM}M cost benchmark · ${TRACKS[scen.track].label}`}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                {Object.values(SCENARIOS).map((s) => (
                  <button key={s.key} onClick={() => load(s.key)} style={{
                    padding: "5px 11px", borderRadius: 3, cursor: "pointer", fontSize: 12, fontWeight: 600, ...sans,
                    border: `1.5px solid ${scenario === s.key ? T.ink : T.line}`,
                    background: scenario === s.key ? T.ink : "#fff", color: scenario === s.key ? "#fff" : T.inkSoft,
                  }}>{s.name}</button>
                ))}
              </div>
              <p style={{ fontSize: 12, color: T.inkSoft, margin: 0, lineHeight: 1.5 }}>{scen.story}</p>
            </Panel>

            <Panel title="Step 2 · Choose a reporting method for all five measures" tag={allSame ? CT[allSame].label : isBestApplied ? "best mix applied" : "mixed (set per measure below)"}>
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
                    <span style={{ textAlign: "left" }}>All {CT[k].label}{CT[k].proposed ? "*" : ""}{CT[k].sunset ? "†" : ""}</span>
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
                  <span>Apply best mix</span>
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
                These buttons set all five measures to one method. You can also choose a method for each measure
                individually on its card below — mixing methods across measures is allowed under CMS rules, and the
                green button applies the highest-value mix from the comparison table at the bottom (it also clears any
                simulated reporting failures, since the search assumes all measures report successfully). eCQM =
                calculated electronically from EHR data, all patients. MIPS CQM (†) = chart review / registry, all
                patients — PY2026 is its final year under current law (CMS-1848-P proposes an extension, not final).
                Medicare CQM = chart review, Medicare patients only. Medicare eCQM (*) = electronic, Medicare patients
                only — proposed to begin in 2027, not yet final.
              </p>
            </Panel>
          </div>

          {/* labeled inputs */}
          <Panel title="Step 3 · Adjust the inputs (every assumption is shown)" style={{ marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
              <div>
                <div style={{ fontSize: 10.5, ...mono, color: T.inkSoft, marginBottom: 6, minHeight: 16 }}>UNDERLYING CARE RATES (%)</div>
                {MEASURES.map((m) => (
                  <label key={m.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, ...mono, color: T.inkSoft, marginBottom: 3 }}>
                    <span style={{ width: 26 }}>{m.id}</span>
                    <input type="range" min={5} max={95} value={rates[m.id]} onChange={(e) => setRates({ ...rates, [m.id]: +e.target.value })} style={{ flex: 1, accentColor: T.ink }} aria-label={`underlying rate ${m.id}`} />
                    <b style={{ width: 30, color: T.ink }}>{rates[m.id]}%</b>
                  </label>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10.5, ...mono, color: T.inkSoft, marginBottom: 6, minHeight: 16 }}>eCQM DATA-CAPTURE EFFICIENCY: <b style={{ color: CT.ecqm.color }}>{(capture * 100).toFixed(0)}%</b></div>
                <input type="range" min={0.65} max={1} step={0.01} value={capture} onChange={(e) => setCapture(+e.target.value)} style={{ width: "100%", accentColor: CT.ecqm.color }} aria-label="capture efficiency" />
                <p style={{ fontSize: 10.5, color: T.inkFaint, margin: "3px 0 0", lineHeight: 1.45 }}>
                  Electronic (eCQM) reporting can only count care that was recorded as structured data in the EHR.
                  The slider sets what share of care that actually happened is captured that way, so electronic
                  measured rates come out lower than the true rate. (For measure 001, which counts a bad outcome,
                  missing data makes the rate look worse,
                  i.e., higher.) CMS's benchmarks reflect this too — electronic reporters nationally score lower — which
                  is why the electronic benchmark tables are easier.
                </p>
              </div>
              <div>
                <div style={{ fontSize: 10.5, ...mono, color: T.inkSoft, marginBottom: 6, minHeight: 16 }}>ORGANIZATION (this ACO)</div>
                {[
                  { label: "cost benchmark", val: benchmarkM, set: setBenchmarkM, min: 40, max: 650, step: 5, fmt: (v: number) => `$${v}M` },
                ].map((s) => (
                  <label key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, ...mono, color: T.inkSoft, marginBottom: 5 }}>
                    <span style={{ width: 100, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</span>
                    <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={(e) => s.set(+e.target.value)} style={{ flex: 1, accentColor: T.ink }} aria-label={s.label} />
                    <b style={{ width: 56, color: T.ink, whiteSpace: "nowrap", textAlign: "right" }}>{s.fmt(s.val)}</b>
                  </label>
                ))}
                <p style={{ fontSize: 10.5, color: T.inkFaint, margin: "3px 0 0", lineHeight: 1.45 }}>
                  Cost benchmark sizes the savings/loss pool. Selecting a scenario in
                  Step 1 resets these to that ACO's profile.
                </p>
              </div>
              <div>
                <div style={{ fontSize: 10.5, ...mono, color: T.inkSoft, marginBottom: 6, minHeight: 16 }}>SPENDING VS COST BENCHMARK: <b style={{ color: grossPct >= 0 ? T.money : T.debt }}>{grossPct >= 0 ? "+" : ""}{grossPct.toFixed(1)}%</b></div>
                <input type="range" min={-3} max={12} step={0.1} value={grossPct} onChange={(e) => setGrossPct(+e.target.value)} style={{ width: "100%", accentColor: grossPct >= 0 ? T.money : T.debt }} aria-label="gross result" />
                <p style={{ fontSize: 10.5, color: T.inkFaint, margin: "3px 0 0", lineHeight: 1.45 }}>
                  Methods that report only Medicare patients are assumed to score {POP_ADJ} points better on screening
                  rates (older patients get screened more). Three additional measures are scored by CMS without any ACO
                  submission — a patient survey (CAHPS) and two measures computed from claims — fixed here at
                  {" "}{scen.fixedPts.cahps}, {scen.fixedPts.claims1}, and {scen.fixedPts.claims2} points for this example.
                </p>
                <label style={{ display: "flex", gap: 7, alignItems: "flex-start", marginTop: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={proposedFlat} onChange={(e) => setProposedFlat(e.target.checked)} style={{ marginTop: 2 }} />
                  <span style={{ fontSize: 10.5, color: T.inkSoft, lineHeight: 1.45 }}>
                    <b>Apply pending proposed rule (not final):</b> score ALL Medicare CQM measures on flat 10-point
                    bands, replacing the much tougher real-data benchmarks CMS published for measures 001, 134, and
                    236 for 2026 (final decision expected November 2026). <b>This only affects Medicare CQM cells</b> —
                    if no measure above is routed to Medicare CQM, the cards won't change, but the "All Medicare CQM"
                    and "Best mix" rows in the comparison table will. Route a measure to M-CQM to see its ladder swap.
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

          {/* stations */}
          <Panel title="The five reported measures — each scored against its method's real benchmark" tag="taller rung = wider scoring band" style={{ marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(205px, 1fr))", gap: 8 }}>
              {mach.rows.map((r) => (
                <Station key={r.id} row={r} gate={gates[r.id]}
                  onRoute={(id, k) => setRouting({ ...routing, [id]: k })} />
              ))}
            </div>
            <p style={{ fontSize: 10.5, color: T.inkFaint, margin: "8px 0 0", lineHeight: 1.5 }}>
              How to read a card: the ladder is the benchmark for the chosen method — ten bands worth 1 to 10 points,
              drawn to scale from CMS's real 2026 tables. The "measured" rate is where this ACO lands after the
              data-capture and population adjustments above. (To simulate a measure failing CMS's minimum reporting
              requirements, use the checkboxes in Step 3.) 2026 quirks worth noticing: measures
              112 and 113 have NO published 2026 benchmark under eCQM or MIPS CQM (dashed ladders — CMS will set the
              benchmark after submission; 2025 values shown as estimates, and the lab excludes these measures from
              both earned points and the denominator per 42 CFR 414.1367(c)(1)(i)), measure 134 under MIPS CQM is capped at 7
              points (dashed red line), measure 001 counts a bad outcome so lower rates score higher, and the Medicare
              CQM ladders for 001, 134, and 236 are now built from real ACO submissions — far steeper in the middle
              than the old flat bands, unless the pending proposed rule (toggle above) restores flat scoring.
            </p>
          </Panel>

          </div>
          <div className="lab-out">

          {/* waterfall + rails */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 12, marginBottom: 12 }}>
            <Panel title="How the points add up" tag={`quality score: ${mach.q.toFixed(1)} / 100`}>
              <Waterfall steps={steps} total={mach.total} />
              <p style={{ fontSize: 10, color: T.inkFaint, margin: "6px 0 0" }}>
                Each bar adds one measure's points. "COA" (striped) is a bonus point per electronically-reported
                measure. "FIXT" (gray) is the survey and claims measures CMS scores itself. Total ÷ {mach.available} = the score.
              </p>
            </Panel>
            <Panel title="Does the ACO pass the quality standard?" tag="determines shared savings eligibility">
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 8 }}>
                <StatusLamp on={mach.allFull} label="All five measures reported via an all-patient method (eCQM or MIPS CQM)" />
                <StatusLamp on={mach.allGates} label="Every measure met the minimum reporting requirements" />
                <StatusLamp on={mach.outcomeOK} label="At least one outcome measure (001, 236, or a claims outcome measure) beat the bottom 10%" />
                <StatusLamp on={mach.otherOK} label="At least one of the remaining seven measures (incl. CAHPS + claims) reached the 40th percentile" />
              </div>
              <ThresholdStrip value={mach.q} threshold={QPS} flagLabel="40th pctile (illus. 55)" dimmed={mach.deemed} />
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <WireIcon binary color={statusColor} />
                <span style={{ fontSize: 13, fontWeight: 700, color: statusColor, ...mono }}>
                  {mach.status === "DEEMED" ? "PASSES (automatic)" : mach.status === "MET" ? "PASSES (by score)" : mach.status === "ALT" ? "PARTIAL (reduced savings)" : "FAILS"}
                </span>
                <span style={{ fontSize: 10, color: T.inkFaint }}>
                  {mach.deemed
                    ? "All four lights are on, so CMS counts the standard as met automatically — the score itself isn't consulted for this decision (the chart is grayed out)."
                    : "The score must beat the flag on the chart above (the 40th percentile of all quality scores nationally)."}
                </span>
              </div>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5, fontSize: 11, ...mono, color: T.inkSoft }}>
                <span>{TRACKS[scen.track].label} track — sharing capped at {TRACKS[scen.track].maxShare}%{scen.msr > 0 ? `, savings shared only past the ${scen.msr.toFixed(1)}% minimum savings rate` : ""}</span>
                <span>ACO keeps <b style={{ color: T.money }}>{fin.sharePct.toFixed(0)}%</b> of any savings → <b style={{ color: T.money }}>{fmt$(fin.savings$)}</b>{grossPct > 0 && grossPct < scen.msr ? " — under the minimum savings rate, nothing is shared" : ""}</span>
                {TRACKS[scen.track].loss === "none"
                  ? <span>one-sided track: <b style={{ color: T.money }}>no shared losses</b></span>
                  : TRACKS[scen.track].loss === "flat30"
                    ? <span>ACO repays a flat <b style={{ color: T.debt }}>30%</b> of any overspend → <b style={{ color: T.debt }}>{fmt$(fin.losses$)}</b> (fixed — does not move with quality)</span>
                    : <span>ACO repays <b style={{ color: T.debt }}>{fin.lossPct.toFixed(0)}%</b> of any overspend → <b style={{ color: T.debt }}>{fmt$(fin.losses$)}</b> (higher quality score = smaller repayment)</span>}
                <span style={{ borderTop: `1px solid ${T.line}`, paddingTop: 5 }}>combined result: <b style={{ color: fin.net$ >= 0 ? T.money : T.debt, fontSize: 14 }}>{fmt$(fin.net$)}</b> · one extra quality point is currently worth <b style={{ color: marginal >= 0 ? T.money : T.debt }}>{marginal >= 0 ? "+" : ""}${Math.abs(marginal) >= 1000 ? (marginal / 1000).toFixed(2) + "M" : marginal.toFixed(0) + "k"}</b></span>
              </div>
            </Panel>
          </div>

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
              Every row is the same ACO delivering the same care in the 2026 performance year — only the reporting
              strategy changes. Superscript letters mark each measure's method in mixed rows: E = eCQM, R = MIPS CQM
              (registry), C = Medicare CQM, X = Medicare eCQM (proposed). "As configured above" mirrors your current
              per-measure choices and gate toggles; all other rows assume every measure meets the minimum reporting
              requirements. "Best mix" is exact, not heuristic: when mixing only the two all-patient methods, the best
              choice can be made measure-by-measure (the automatic-pass rule survives any such mix and the electronic
              bonus is per-measure), but Medicare-only methods make the automatic-pass rule an all-or-nothing question
              across measures — so the calculator simply evaluates all 243 assignments available for 2026 and shows
              the one with the highest combined dollars (Medicare eCQM appears as a preview row but is excluded from
              the search — it doesn't exist until 2027, and only if finalized). Differences across rows come from the benchmark tables, electronic
              data-capture losses, the 7-point cap on measure 134 under MIPS CQM (marked ᶜ), and which methods carry
              the automatic-pass rule and the electronic reporting bonus.
            </p>
          </Panel>

          </div>
          </div>

          <p style={{ fontSize: 11, color: T.inkSoft, marginTop: 16, maxWidth: 920, lineHeight: 1.5 }}>
            <b>Model scope.</b> In scope: how the five reported measures are scored under each collection type
            against real 2026 benchmarks; the quality performance standard (met by score or by the reporting
            incentive); the shared-savings rate; and quality-scaled shared losses. That is a complete model of the
            ACO-level settlement — including why the score keeps mattering after the standard is met in a loss year,
            and why, in a savings year above the threshold, one more point is honestly worth $0. Out of
            scope: clinician-level MIPS fee adjustments (the mechanism is real, but its boundaries depend on
            per-clinician QP status and billing arrangements with no public data source), fractional
            within-decile scoring, score uncertainty, and CAHPS/claims-measure variation.
          </p>
          <p style={{ fontSize: 11, color: T.inkFaint, marginTop: 10, maxWidth: 920, lineHeight: 1.5 }}>
            Sources and limitations: benchmark tables are CMS's actual published 2026 quality benchmarks. Where CMS
            published no 2026 benchmark (measures 112 and 113 under eCQM/MIPS CQM — insufficient 2024 data), the real
            scoring will use a benchmark computed after everyone submits; 2025 tables are shown as estimates and marked
            with dashed ladders. The Medicare CQM tables for 001, 134, and 236 are the real 2026 historical benchmarks
            built from ACO submissions; the toggle applies the pending July 2026 proposed rule that would replace them
            with flat bands (final decision expected November 2026). The data-capture and Medicare-population
            adjustments are illustrative modeling assumptions. The Medicare eCQM method (*) does not exist until 2027
            and only if finalized. The passing threshold is a simplified stand-in for the annually published 40th-percentile
            value; sharing and loss rates follow the statutory track rules (40% BASIC A–B, 50% C–E, 75% ENHANCED;
            losses none / flat 30% / quality-scaled respectively), and savings are shared only past the ACO's
            minimum savings rate (the low-revenue half-rate exception is not modeled). MIPS CQM (†) is available
            for PY2026 but sunsets afterward under current law; CMS-1848-P proposes an extension. Dollar figures are rough estimates for learning
            purposes, not financial projections. Example-ACO profiles are calibrated to CMS's actual PY2024 Shared
            Savings Program results and participant files (data.cms.gov, 476 ACOs): the median real ACO had 13,151
            assigned beneficiaries, a $177M updated benchmark ($13,278 per person), 19 participating practice groups,
            and +4.2% gross savings; the strong scenario uses 75th-percentile values and the safety-net scenario
            25th/10th-percentile values from the same file. (Practice-group counts in the stories are
            narrative color, not percentile-derived.)
          </p>
        </div>
      </div>
    </div>
  );
}
