import { useState, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";

/* ============================================================
   APP PLUS SCORING — VISUAL LANGUAGE, REV 3
   Rev 3 adds the downstream back-end:
   - SETTLEMENT VALVES: the savings/loss dollar pools flowing
     through apertures set by the rails (sharing %, loss %)
   - TIN ROSTER: one APM-entity score fanning out to every
     participant TIN's non-QP clinicians as a Part B fee delta
   - MARGINAL VALUE READOUT: what +1 achievement point is
     worth in dollars, in the current machine state
   - PROJECTION STRIP: the same quality configuration settled
     under a savings year vs a loss year
   ============================================================ */

const T = {
  bg: "#EDF0F2", film: "#F7F9FA", line: "#C9D2D8", grid: "#DEE4E8",
  ink: "#1F2A33", inkSoft: "#5B6B77", inkFaint: "#8C9AA5",
  pass: "#16A34A", fail: "#DC2626", grayed: "#AEB9C1", fixed: "#9AA7B0",
  money: "#0F766E", debt: "#B91C1C",
};
type CTKey = "ecqm" | "medecqm" | "mipscqm" | "medcqm";
interface CollectionType {
  label: string;
  color: string;
  flat: boolean;
  electronic: boolean;
  fullPop: boolean;
  proposed?: boolean;
}
const CT: Record<CTKey, CollectionType> = {
  ecqm:    { label: "eCQM",          color: "#2563EB", flat: false, electronic: true,  fullPop: true  },
  medecqm: { label: "Medicare eCQM", color: "#0D9488", flat: true,  electronic: true,  fullPop: false, proposed: true },
  mipscqm: { label: "MIPS CQM",      color: "#D97706", flat: false, electronic: false, fullPop: true  },
  medcqm:  { label: "Medicare CQM",  color: "#A21CAF", flat: true,  electronic: false, fullPop: false },
};
type MeasureId = "001" | "134" | "236" | "112" | "113";
interface Measure {
  id: MeasureId;
  name: string;
  outcome: boolean;
}
const MEASURES: Measure[] = [
  { id: "001", name: "Diabetes: glycemic >9%", outcome: true },
  { id: "134", name: "Depression screening",   outcome: false },
  { id: "236", name: "Controlling high BP",    outcome: true },
  { id: "112", name: "Breast cancer screening",outcome: false },
  { id: "113", name: "Colorectal screening",   outcome: false },
];
const FIXED = [
  { id: "321", pts: 6 }, { id: "479", pts: 5 }, { id: "484", pts: 7 },
];
const AVAILABLE = 80, QPS = 55, MAX_SHARE = 75;
const HIST_WEIGHTS = [1.4, 0.7, 1.2, 0.8, 1.5, 0.9, 1.6, 0.8, 1.1, 1.8];
const BENCHMARK_M = 120; // $120M illustrative ACO benchmark
const N_TINS = 12;

type Routing = Record<MeasureId, CTKey>;
type DecileMap = Record<MeasureId, number>;
type GateMap = Record<MeasureId, boolean>;
type ScenarioKey = "stacked" | "gatefail" | "fhir";
interface Scenario {
  key: ScenarioKey;
  name: string;
  note: string;
  routing: Routing;
  decile: DecileMap;
  gate: GateMap;
  grossPct: number;
}
const SCENARIOS: Record<ScenarioKey, Scenario> = {
  stacked: {
    key: "stacked", name: "Stacked eCQM shop",
    note: "Bypass live: the savings valve opens to its full 75% aperture regardless of score. But slide the result into loss territory and watch the loss valve — its aperture is quality-scaled even while deemed. That narrowing is the COA layer earning its keep in dollars.",
    routing: { "001": "ecqm", "134": "ecqm", "236": "ecqm", "112": "ecqm", "113": "ecqm" },
    decile:  { "001": 7, "134": 8, "236": 10, "112": 6, "113": 9 },
    gate:    { "001": true, "134": true, "236": true, "112": true, "113": true },
    grossPct: 2.5,
  },
  gatefail: {
    key: "gatefail", name: "One gate failure",
    note: "Chip 134's gate fails and the bypass cuts. The savings valve now takes its orders from the threshold strip — and every TIN in the roster inherits a lower clinician score at once. One diamond, twelve TINs, two payment years later.",
    routing: { "001": "ecqm", "134": "ecqm", "236": "ecqm", "112": "ecqm", "113": "ecqm" },
    decile:  { "001": 7, "134": 8, "236": 10, "112": 6, "113": 9 },
    gate:    { "001": true, "134": false, "236": true, "112": true, "113": true },
    grossPct: 2.5,
  },
  fhir: {
    key: "fhir", name: "FHIR-forward CQM shop",
    note: "No bypass, no COA: identical gross savings, but the valve aperture rides entirely on where the marker sits against the flag. Check the marginal-value readout — a point is worth the most in exactly this configuration, which is the penalty structure your comment letter is about.",
    routing: { "001": "medcqm", "134": "medcqm", "236": "medcqm", "112": "mipscqm", "113": "mipscqm" },
    decile:  { "001": 9, "134": 9, "236": 10, "112": 6, "113": 7 },
    gate:    { "001": true, "134": true, "236": true, "112": true, "113": true },
    grossPct: 2.5,
  },
};

const mono: CSSProperties = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };
const sans: CSSProperties = { fontFamily: "'Instrument Sans', system-ui, sans-serif" };
const stripe = (c: string): CSSProperties => ({ backgroundImage: `repeating-linear-gradient(135deg, ${c} 0 4px, #fff 4px 7px)` });
const fmt$ = (m: number) => `${m < 0 ? "−" : ""}$${Math.abs(m).toFixed(2)}M`;

/* ---------------- core scoring (pure) ---------------- */

type QpsStatus = "DEEMED" | "MET" | "ALT" | "FAILED";
interface WaterfallStep {
  key: string;
  label: string;
  pts: number;
  color: string;
  pattern?: "stripe";
  kind?: "fixed";
}
interface ScoreResult {
  steps: WaterfallStep[];
  total: number;
  q: number;
  coa: number;
  allFull: boolean;
  allGates: boolean;
  outcomeOK: boolean;
  deemed: boolean;
  status: QpsStatus;
}

function score(routing: Routing, decile: DecileMap, gate: GateMap): ScoreResult {
  const steps: WaterfallStep[] = [];
  let earned = 0, coa = 0;
  MEASURES.forEach((m) => {
    const p = gate[m.id] ? decile[m.id] : 0;
    earned += p;
    steps.push({ key: m.id, label: m.id, pts: p, color: CT[routing[m.id]].color });
    if (routing[m.id] === "ecqm" && gate[m.id] && decile[m.id] < 10) coa += 1;
  });
  coa = Math.min(coa, AVAILABLE * 0.1);
  if (coa > 0) steps.push({ key: "coa", label: "COA", pts: coa, color: CT.ecqm.color, pattern: "stripe" });
  const fixedPts = FIXED.reduce((s, f) => s + f.pts, 0);
  steps.push({ key: "fixt", label: "FIXT", pts: fixedPts, color: T.fixed, kind: "fixed" });
  const total = Math.min(earned + coa + fixedPts, AVAILABLE);
  const q = (total / AVAILABLE) * 100;
  const allFull = MEASURES.every((m) => CT[routing[m.id]].fullPop);
  const allGates = MEASURES.every((m) => gate[m.id]);
  const outcomeOK = MEASURES.some((m) => m.outcome && gate[m.id] && decile[m.id] >= 2);
  const deemed = allFull && allGates && outcomeOK;
  const status = deemed ? "DEEMED" : q >= QPS ? "MET" : outcomeOK ? "ALT" : "FAILED";
  return { steps, total, q, coa, allFull, allGates, outcomeOK, deemed, status };
}

interface Settlement {
  q: number;
  status: QpsStatus;
  sharePct: number;
  lossPct: number;
  savings$: number;
  losses$: number;
  clin: number;
  adjPct: number;
}

function settle(sc: ScoreResult, grossPct: number, extraPts = 0): Settlement {
  const total = Math.min(sc.total + extraPts, AVAILABLE);
  const q = (total / AVAILABLE) * 100;
  const status = sc.deemed ? "DEEMED" : q >= QPS ? "MET" : sc.outcomeOK ? "ALT" : "FAILED";
  const sharePct = status === "DEEMED" || status === "MET" ? MAX_SHARE : status === "ALT" ? MAX_SHARE * (q / 100) : 0;
  const lossPct = status === "FAILED" ? 75 : Math.min(75, Math.max(40, 75 - 0.45 * q));
  const gross = (grossPct / 100) * BENCHMARK_M;
  const savings$ = gross > 0 ? (sharePct / 100) * gross : 0;
  const losses$ = gross < 0 ? (lossPct / 100) * gross : 0; // negative
  const clin = 0.5 * q + 0.3 * 82 + 0.2 * 100;
  const adjPct = clin >= 75 ? ((clin - 75) / 25) * 2.0 : -(9 * (75 - clin)) / 75;
  return { q, status, sharePct, lossPct, savings$, losses$, clin, adjPct };
}

/* ---------------- primitive glyphs (rev 2 carryover) ---------------- */

function PopGlyph({ full, color, size = 18 }: { full: boolean; color: string; size?: number }) {
  const r = size / 2 - 1.5, c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={c} cy={c} r={r} fill={full ? color : "none"} stroke={color} strokeWidth="1.5" />
      {!full && <path d={`M ${c} ${c} L ${c} ${c - r} A ${r} ${r} 0 0 1 ${c + r * 0.95} ${c + r * 0.31} Z`} fill={color} />}
    </svg>
  );
}
function PipeGlyph({ electronic, color, width = 34 }: { electronic: boolean; color: string; width?: number }) {
  return (
    <svg width={width} height={14} viewBox="0 0 34 14" aria-hidden>
      {electronic
        ? <path d="M1 7 H8 L11 2 L15 12 L18 7 H33" fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        : <g><path d="M1 7 H33" stroke={color} strokeWidth="1.4" strokeDasharray="3 3" fill="none" />{[8, 17, 26].map((x) => <rect key={x} x={x - 2.5} y={4.5} width={5} height={5} fill={color} rx={1} />)}</g>}
    </svg>
  );
}
function Chip({ ct, id, dead, size = 32 }: { ct: CTKey; id: string; dead?: boolean; size?: number }) {
  const c = CT[ct];
  return (
    <div title={c.label} style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: dead ? "#fff" : c.color, border: `2.5px solid ${dead ? T.fail : c.color}`,
      color: dead ? T.fail : "#fff", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.31, fontWeight: 600, ...mono, textDecoration: dead ? "line-through" : "none",
    }}>{id}</div>
  );
}
function GateGlyph({ pass, label }: { pass: boolean; label?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <div style={{
        width: 28, height: 28, transform: "rotate(45deg)",
        border: `2px solid ${pass ? T.pass : T.fail}`, background: pass ? "#EAF7EE" : "#FBEAEA",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ transform: "rotate(-45deg)", color: pass ? T.pass : T.fail, fontSize: 13, fontWeight: 700 }}>{pass ? "✓" : "✕"}</span>
      </div>
      {label && <span style={{ fontSize: 9, color: T.inkSoft, ...mono }}>{label}</span>}
    </div>
  );
}
function Ladder({ decile, color, flat, height = 58, width = 18 }: { decile: number; color: string; flat: boolean; height?: number; width?: number }) {
  const rungs = Array.from({ length: 10 }, (_, i) => 10 - i);
  return (
    <div title={flat ? "flat benchmark: uniform bands" : "historical benchmark: irregular cutpoints"} style={{ display: "flex", flexDirection: "column", gap: 1, height }}>
      {rungs.map((r) => (
        <div key={r} style={{
          flexGrow: flat ? 1 : HIST_WEIGHTS[r - 1], flexBasis: 0, width,
          background: r <= decile ? color : "#fff", border: `1px solid ${r <= decile ? color : T.line}`,
          opacity: r <= decile ? 0.5 + 0.05 * r : 1,
        }} />
      ))}
    </div>
  );
}
function WireIcon({ binary, color = T.ink, width = 30 }: { binary: boolean; color?: string; width?: number }) {
  return (
    <svg width={width} height={12} viewBox="0 0 30 12" aria-hidden>
      {binary
        ? <path d="M1 10 H8 V2 H16 V10 H23 V2 H29" fill="none" stroke={color} strokeWidth="1.8" />
        : <path d="M1 8 C 7 2, 12 12, 17 6 S 26 2, 29 5" fill="none" stroke={color} strokeWidth="1.8" />}
    </svg>
  );
}
interface ThresholdStripProps {
  value: number;
  threshold: number;
  flagLabel: string;
  markerColor?: string;
  dimmed?: boolean;
  height?: number;
}
function ThresholdStrip({ value, threshold, flagLabel, markerColor = T.ink, dimmed = false, height = 54 }: ThresholdStripProps) {
  const w = 260, h = height;
  const x = (v: number) => 8 + (Math.max(0, Math.min(100, v)) / 100) * (w - 16);
  const ink = dimmed ? T.grayed : T.ink;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: 340, height: "auto", display: "block" }}>
      <path d={`M8 ${h - 12} C ${w * 0.25} ${h - 13}, ${w * 0.32} 8, ${w * 0.5} 10 S ${w * 0.75} ${h - 16}, ${w - 8} ${h - 12} Z`}
        fill={dimmed ? "#EDF0F2" : "#E3EAEF"} stroke={dimmed ? T.grayed : T.line} strokeWidth="1" />
      <line x1={8} y1={h - 12} x2={w - 8} y2={h - 12} stroke={ink} strokeWidth="1.2" />
      <line x1={x(threshold)} y1={4} x2={x(threshold)} y2={h - 12} stroke={dimmed ? T.grayed : T.fail} strokeWidth="1.6" strokeDasharray="4 3" />
      <path d={`M ${x(threshold)} 4 l 12 4 l -12 4 Z`} fill={dimmed ? T.grayed : T.fail} />
      <text x={Math.min(x(threshold) + 15, w - 82)} y={11} fontSize="8.5" fontFamily="IBM Plex Mono, monospace" fill={dimmed ? T.grayed : T.inkSoft}>{flagLabel}</text>
      <path d={`M ${x(value)} ${h - 11} l -5 8 h 10 Z`} fill={dimmed ? T.grayed : markerColor} />
      <text x={x(value)} y={h - 0.5} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={dimmed ? T.grayed : markerColor}>{value.toFixed(0)}</text>
    </svg>
  );
}
interface RoutingMatrixProps {
  selected: CTKey;
  onSelect?: (k: CTKey) => void;
  compact?: boolean;
}
function RoutingMatrix({ selected, onSelect, compact = false }: RoutingMatrixProps) {
  const cell = (k: CTKey) => {
    const c = CT[k], sel = selected === k;
    return (
      <button key={k} onClick={onSelect ? () => onSelect(k) : undefined} style={{
        border: `1.5px solid ${sel ? c.color : T.line}`, background: "#fff",
        boxShadow: sel ? `inset 0 0 0 2px ${c.color}` : "none", borderRadius: 3,
        padding: compact ? "4px 5px" : "7px 8px", display: "flex", flexDirection: "column",
        alignItems: "center", gap: 3, cursor: onSelect ? "pointer" : "default",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <PopGlyph full={c.fullPop} color={c.color} size={compact ? 15 : 18} />
          <PipeGlyph electronic={c.electronic} color={c.color} width={compact ? 26 : 34} />
        </div>
        <span style={{ fontSize: compact ? 8.5 : 10, color: c.color, ...mono }}>{c.label}{c.proposed ? "*" : ""}</span>
      </button>
    );
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 4 }}>
      <div />
      <div style={{ fontSize: 8.5, color: T.inkSoft, textAlign: "center", ...mono }}>FULL POP ●</div>
      <div style={{ fontSize: 8.5, color: T.inkSoft, textAlign: "center", ...mono }}>ATTRIB ◔</div>
      <div style={{ fontSize: 8.5, color: T.inkSoft, writingMode: "vertical-rl", transform: "rotate(180deg)", textAlign: "center", ...mono }}>ELEC ⌁</div>
      {cell("ecqm")}{cell("medecqm")}
      <div style={{ fontSize: 8.5, color: T.inkSoft, writingMode: "vertical-rl", transform: "rotate(180deg)", textAlign: "center", ...mono }}>REG ▪▪▪</div>
      {cell("mipscqm")}{cell("medcqm")}
    </div>
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
interface PanelProps {
  children: ReactNode;
  title?: string;
  tag?: string;
  style?: CSSProperties;
}
function Panel({ children, title, tag, style }: PanelProps) {
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

/* ---------------- NEW downstream elements ---------------- */

// Settlement valve: a dollar pool flows through an aperture set by a rail.
// Aperture angle ∝ rate. Output block width ∝ payout share of pool.
interface ValveProps {
  pool: number;
  rate: number;
  out: number;
  label: string;
  color: string;
  wireBinary?: boolean;
  wireBoth?: boolean;
  dimmed?: boolean;
}
function Valve({ pool, rate, out, label, color, wireBinary, wireBoth, dimmed }: ValveProps) {
  const w = 300, h = 64;
  const poolW = 84, outMaxW = 120;
  const gap = 4 + (rate / 100) * 26; // aperture opening
  const cy = h / 2;
  const outW = pool > 0 ? Math.max(4, (Math.abs(out) / Math.abs(pool)) * outMaxW) : 4;
  const c = dimmed ? T.grayed : color;
  return (
    <div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
        <WireIcon binary width={20} color={dimmed ? T.grayed : T.ink} />
        {wireBoth && <WireIcon binary={false} width={20} color={dimmed ? T.grayed : T.ink} />}
        <span style={{ fontSize: 10, ...mono, color: dimmed ? T.grayed : T.inkSoft }}>{label}</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: 360, height: "auto", display: "block" }}>
        <rect x={2} y={10} width={poolW} height={h - 20} fill={c} opacity={0.28} stroke={c} strokeWidth="1.2" />
        <text x={2 + poolW / 2} y={cy + 3} fontSize="9.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={dimmed ? T.grayed : T.ink}>{fmt$(pool)}</text>
        <path d={`M ${poolW + 6} 12 L ${poolW + 42} ${cy - gap / 2} L ${poolW + 6} ${cy - gap / 2}`} fill="none" stroke={c} strokeWidth="2" />
        <path d={`M ${poolW + 6} ${h - 12} L ${poolW + 42} ${cy + gap / 2} L ${poolW + 6} ${cy + gap / 2}`} fill="none" stroke={c} strokeWidth="2" />
        <line x1={poolW + 42} y1={cy - gap / 2} x2={poolW + 42} y2={cy + gap / 2} stroke={c} strokeWidth="2.4" />
        <text x={poolW + 26} y={h - 2} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={dimmed ? T.grayed : T.inkSoft}>{rate.toFixed(0)}%</text>
        <line x1={poolW + 44} y1={cy} x2={poolW + 70} y2={cy} stroke={c} strokeWidth="2" />
        <rect x={poolW + 72} y={cy - 12} width={outW} height={24} fill={c} opacity={0.85} />
        <text x={poolW + 78 + outW} y={cy + 3.5} fontSize="10.5" fontWeight="700" fontFamily="IBM Plex Mono, monospace" fill={dimmed ? T.grayed : c}>{fmt$(out)}</text>
      </svg>
    </div>
  );
}

// TIN roster: one entity score fans out to every participant TIN.
function TinRoster({ adjPct, dimmedNone }: { adjPct: number; dimmedNone?: boolean }) {
  const good = adjPct >= 0;
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
        {Array.from({ length: N_TINS }, (_, i) => (
          <div key={i} style={{
            width: 40, height: 30, borderRadius: 3, background: "#fff",
            border: `1.5px solid ${good ? T.pass : T.fail}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 7.5, color: T.inkFaint, ...mono }}>TIN{String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: good ? T.pass : T.fail, ...mono }}>
              {adjPct >= 0 ? "+" : ""}{adjPct.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 10, color: T.inkFaint, margin: 0 }}>
        One APM-entity score → every participant TIN's non-QP clinicians receive the same Part B fee
        adjustment, two payment years later. No TIN escapes the entity score; that fan-out is the roster's whole message.
      </p>
    </div>
  );
}

/* ---------------- waterfall (rev 2 carryover) ---------------- */

function Waterfall({ steps, total }: { steps: WaterfallStep[]; total: number }) {
  const w = 640, h = 180, pad = { l: 34, r: 8, t: 14, b: 26 };
  const plotW = w - pad.l - pad.r, plotH = h - pad.t - pad.b;
  const n = steps.length + 1, colW = plotW / n, barW = Math.min(colW * 0.62, 52);
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
              <defs>
                <pattern id={`p3-${c.key}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="6" height="6" fill="#fff" /><rect width="3.2" height="6" fill={c.color} />
                </pattern>
              </defs>
              <rect x={c.x} y={c.yTop} width={barW} height={c.hgt} fill={`url(#p3-${c.key})`} stroke={c.color} strokeWidth="1" />
            </>
          ) : (
            <rect x={c.x} y={c.yTop} width={barW} height={c.hgt}
              fill={c.pts === 0 ? "#fff" : c.color} opacity={c.kind === "fixed" ? 0.65 : 0.9}
              stroke={c.pts === 0 ? T.fail : c.color} strokeWidth={c.pts === 0 ? 1.5 : 1}
              strokeDasharray={c.pts === 0 ? "3 2" : "none"} />
          )}
          <line x1={c.x + barW} x2={c.x + colW} y1={c.connY} y2={c.connY} stroke={T.inkFaint} strokeWidth="1" strokeDasharray="2 2" />
          <text x={c.x + barW / 2} y={c.yTop - 3} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={c.pts === 0 ? T.fail : T.inkSoft}>{c.pts === 0 ? "0!" : `+${c.pts}`}</text>
          <text x={c.x + barW / 2} y={h - 14} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={T.inkSoft}>{c.label}</text>
        </g>
      ))}
      <g>
        <rect x={pad.l + steps.length * colW + (colW - barW) / 2} y={y(total)} width={barW} height={y(0) - y(total)} fill={T.ink} opacity="0.88" />
        <text x={pad.l + steps.length * colW + colW / 2} y={y(total) - 4} fontSize="9.5" fontWeight="700" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={T.ink}>{total}/80</text>
        <text x={pad.l + steps.length * colW + colW / 2} y={h - 14} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={T.ink}>TOTAL</text>
      </g>
    </svg>
  );
}

/* ---------------- lexicon (rev 3: downstream elements only shown here
     alongside a compact recap of rev 2's) ---------------- */

function Lexicon() {
  const items = [
    {
      name: "Measure chip · matrix · gate · ladder", demo: (
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <Chip ct="ecqm" id="236" size={28} />
          <PopGlyph full color={CT.ecqm.color} /><PopGlyph full={false} color={CT.medcqm.color} />
          <PipeGlyph electronic color={CT.ecqm.color} /><PipeGlyph electronic={false} color={CT.mipscqm.color} />
          <GateGlyph pass /><Ladder decile={6} color={CT.ecqm.color} flat={false} height={44} width={13} />
          <Ladder decile={6} color={CT.medcqm.color} flat height={44} width={13} />
        </div>
      ),
      spec: "Rev 2 recap: a routed measure (color = cell), population disc (● full / ◔ attributed), pipeline trace (⌁ electronic / ▪▪▪ registry), the completeness+case gate, and benchmark ladders (irregular rungs = historical, uniform = flat).",
    },
    {
      name: "Rails · bypass · threshold strip", demo: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          <div style={{ display: "flex", gap: 10 }}><WireIcon binary={false} /><WireIcon binary /></div>
          <ThresholdStrip value={66} threshold={QPS} flagLabel="40th pctile flag" height={44} />
        </div>
      ),
      spec: "Rev 2 recap: smooth wire = magnitude (the score), square wave = verdict (QPS status). The strip is the standard test — a national score distribution, a flag at its 40th percentile, and your marker. The deeming bypass, when live, dims the strip.",
    },
    {
      name: "Settlement valve", demo: (
        <Valve pool={3.0} rate={75} out={2.25} label="SAVINGS VALVE" color={T.money} />
      ),
      spec: "NEW. Where rates become dollars. The left block is the pool — gross savings (benchmark minus actual spend) or gross losses. The aperture is the valve, opened by a rail: the savings valve takes the square wave (met/deemed = full 75% aperture; alternative = score-scaled; failed = shut), the loss valve takes both wires (quality-scaled 40–75% even while deemed). The right block is what actually flows to — or from — the ACO.",
    },
    {
      name: "TIN roster", demo: <TinRoster adjPct={0.7} />,
      spec: "NEW. The fan-out. The APM entity earns one final score; the roster shows it landing identically on every participant TIN as the Part B fee adjustment their non-QP clinicians will see two payment years later. Green border = positive adjustment, red = penalty. The visual point: a single gate diamond upstream can flip twelve TINs' borders at once.",
    },
    {
      name: "Marginal value readout", demo: (
        <div style={{ border: `1.5px solid ${T.money}`, borderRadius: 3, padding: "8px 12px", background: "#fff", display: "inline-flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 9, ...mono, color: T.inkSoft }}>VALUE OF +1 ACHIEVEMENT PT, HERE</span>
          <span style={{ fontSize: 20, fontWeight: 700, ...mono, color: T.money }}>+$41k / pt</span>
        </div>
      ),
      spec: "NEW. A finite-difference gauge: the machine is re-run with one extra achievement point and the total dollar delta (savings + losses + roster) is displayed. Its value swings wildly with state — near zero when deemed in a savings year, large when riding the comparator or near the 75-point clinician line. It is the instrument that makes the incentive geometry tangible.",
    },
    {
      name: "Projection strip", demo: (
        <div style={{ display: "flex", gap: 6, width: "100%" }}>
          {[{ l: "SAVINGS YR (+2.5%)", v: "+$2.25M", c: T.money }, { l: "LOSS YR (−2.5%)", v: "−$1.29M", c: T.debt }].map((p) => (
            <div key={p.l} style={{ flex: 1, border: `1px solid ${T.line}`, borderRadius: 3, background: "#fff", padding: 8 }}>
              <div style={{ fontSize: 8.5, ...mono, color: T.inkSoft }}>{p.l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, ...mono, color: p.c }}>{p.v}</div>
            </div>
          ))}
        </div>
      ),
      spec: "NEW. The same quality configuration settled under two futures — a savings year and a loss year — side by side. Quality choices are made before the financial year resolves, so a configuration's worth is really this pair, not either number alone. Downside asymmetry (a config that looks fine in the left box and ugly in the right) is exactly what the strip exists to surface.",
    },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
      {items.map((it, i) => (
        <Panel key={it.name} title={`E${i + 1} · ${it.name}`}>
          <div style={{ minHeight: 90, display: "flex", alignItems: "center", marginBottom: 8 }}>{it.demo}</div>
          <p style={{ fontSize: 12, lineHeight: 1.5, color: T.inkSoft, margin: 0 }}>{it.spec}</p>
        </Panel>
      ))}
    </div>
  );
}

/* ---------------- machine ---------------- */

interface StationProps {
  m: Measure;
  routing: CTKey;
  decile: number;
  gate: boolean;
  onRoute: (id: MeasureId, k: CTKey) => void;
  onDecile: (id: MeasureId, v: number) => void;
  onGate: (id: MeasureId) => void;
}
function Station({ m, routing, decile, gate, onRoute, onDecile, onGate }: StationProps) {
  const ct = CT[routing];
  const pts = gate ? decile : 0;
  const coa = routing === "ecqm" && gate;
  const coaWasted = coa && decile === 10;
  return (
    <div style={{ border: `1px solid ${T.line}`, borderTop: `3px solid ${ct.color}`, background: "#fff", borderRadius: 4, padding: 10, display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Chip ct={routing} id={m.id} dead={!gate} size={30} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
          <div style={{ fontSize: 9, color: T.inkFaint, ...mono }}>{m.outcome ? "OUTCOME" : "process"}</div>
        </div>
      </div>
      <RoutingMatrix compact selected={routing} onSelect={(k) => onRoute(m.id, k)} />
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Ladder decile={gate ? decile : 0} color={ct.color} flat={ct.flat} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <input type="range" min={1} max={10} value={decile} onChange={(e) => onDecile(m.id, +e.target.value)} style={{ width: "100%", accentColor: ct.color }} aria-label={`decile for ${m.id}`} />
          <button onClick={() => onGate(m.id)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", alignSelf: "flex-start" }} aria-label={`toggle gate for ${m.id}`}>
            <GateGlyph pass={gate} label="gate" />
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, ...mono, fontSize: 10, flexWrap: "wrap" }}>
        <span style={{ border: `1px solid ${ct.color}`, color: gate ? ct.color : T.fail, borderRadius: 2, padding: "1px 5px" }}>{pts} pts</span>
        {coa && <span style={{ borderRadius: 2, padding: "1px 5px", border: `1px solid ${ct.color}`, color: coaWasted ? T.inkFaint : ct.color, ...(!coaWasted ? stripe("#DBEAFE") : {}), textDecoration: coaWasted ? "line-through" : "none" }}>+1 COA{coaWasted ? " capped" : ""}</span>}
      </div>
    </div>
  );
}

export default function AppPlusVizLanguageV3() {
  const s0 = SCENARIOS.stacked;
  const [scenario, setScenario] = useState<ScenarioKey>("stacked");
  const [routing, setRouting] = useState({ ...s0.routing });
  const [decile, setDecile] = useState({ ...s0.decile });
  const [gate, setGate] = useState({ ...s0.gate });
  const [grossPct, setGrossPct] = useState(s0.grossPct);
  const load = (key: ScenarioKey) => {
    const s = SCENARIOS[key];
    setScenario(key); setRouting({ ...s.routing }); setDecile({ ...s.decile }); setGate({ ...s.gate }); setGrossPct(s.grossPct);
  };

  const sc = useMemo(() => score(routing, decile, gate), [routing, decile, gate]);
  const fin = useMemo(() => settle(sc, grossPct), [sc, grossPct]);
  const marginal = useMemo(() => {
    const base = settle(sc, grossPct), plus = settle(sc, grossPct, 1);
    const partB = 60; // $60M non-QP Part B revenue, illustrative
    const d = (plus.savings$ + plus.losses$ + (plus.adjPct / 100) * partB) - (base.savings$ + base.losses$ + (base.adjPct / 100) * partB);
    return d * 1000; // $k
  }, [sc, grossPct]);
  const projSave = useMemo(() => settle(sc, 2.5), [sc]);
  const projLoss = useMemo(() => settle(sc, -2.5), [sc]);
  const statusColor = fin.status === "FAILED" ? T.fail : fin.status === "ALT" ? "#D97706" : T.pass;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, ...sans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap');
        input[type=range]{height:4px}
        button:focus-visible{outline:2px solid ${T.ink};outline-offset:2px}
        @media (prefers-reduced-motion: reduce){*{transition:none!important}}
      `}</style>
      <div style={{ backgroundImage: `linear-gradient(${T.grid} 1px, transparent 1px), linear-gradient(90deg, ${T.grid} 1px, transparent 1px)`, backgroundSize: "28px 28px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "28px 16px 60px" }}>

          <div style={{ border: `2px solid ${T.ink}`, background: T.film, borderRadius: 4, display: "flex", flexWrap: "wrap", marginBottom: 22 }}>
            <div style={{ padding: "16px 20px", flex: "1 1 380px", borderRight: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", color: T.inkSoft, ...mono }}>DRAWING NO. APP-PLUS-VL-03</div>
              <h1 style={{ margin: "4px 0 6px", fontSize: 26, fontWeight: 700, lineHeight: 1.15 }}>APP Plus scoring — visual language, rev 3</h1>
              <p style={{ margin: 0, fontSize: 13, color: T.inkSoft, maxWidth: 580 }}>
                Rev 3 wires the score into consequences: dollar pools through settlement valves, one entity score
                fanning out across the TIN roster, a live readout of what a point is worth, and both futures side by side.
              </p>
            </div>
            <div style={{ padding: "16px 20px", ...mono, fontSize: 10, color: T.inkSoft, display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }}>
              <span>NEW: VALVES · ROSTER · MARGINAL</span>
              <span>VALUE · PROJECTION STRIP</span>
              <span>$120M BENCHMARK — ILLUSTRATIVE</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "0 0 10px" }}>
            <span style={{ fontSize: 12, ...mono, color: T.inkSoft }}>SHEET 1</span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>The elements</h2>
          </div>
          <Lexicon />

          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "26px 0 10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, ...mono, color: T.inkSoft }}>SHEET 2</span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>The machine, end to end</h2>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {Object.values(SCENARIOS).map((s) => (
              <button key={s.key} onClick={() => load(s.key)} style={{
                padding: "6px 12px", borderRadius: 3, cursor: "pointer", fontSize: 12, fontWeight: 600, ...sans,
                border: `1.5px solid ${scenario === s.key ? T.ink : T.line}`,
                background: scenario === s.key ? T.ink : "#fff", color: scenario === s.key ? "#fff" : T.inkSoft,
              }}>{s.name}</button>
            ))}
          </div>
          <p style={{ fontSize: 12.5, color: T.inkSoft, margin: "0 0 12px", maxWidth: 880, lineHeight: 1.5 }}>{SCENARIOS[scenario].note}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Panel title="Stations" tag="route · gate · climb">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                {MEASURES.map((m) => (
                  <Station key={m.id} m={m} routing={routing[m.id]} decile={decile[m.id]} gate={gate[m.id]}
                    onRoute={(id, k) => setRouting({ ...routing, [id]: k })}
                    onDecile={(id, v) => setDecile({ ...decile, [id]: v })}
                    onGate={(id) => setGate({ ...gate, [id]: !gate[id] })} />
                ))}
              </div>
            </Panel>

            <Panel title="Waterfall → score" tag={`smooth wire: ${fin.q.toFixed(1)}`}>
              <Waterfall steps={sc.steps} total={sc.total} />
            </Panel>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
              <Panel title="Binary rail · deeming + strip" tag="square wave">
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 8 }}>
                  <StatusLamp on={sc.allFull} label="all five chips full-population (●)" />
                  <StatusLamp on={sc.allGates} label="every gate passes" />
                  <StatusLamp on={sc.outcomeOK} label="an outcome chip at ≥10th pctile" />
                </div>
                <ThresholdStrip value={fin.q} threshold={QPS} flagLabel="40th pctile (illus. 55)" dimmed={sc.deemed} />
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <WireIcon binary color={statusColor} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: statusColor, ...mono }}>QPS: {fin.status === "ALT" ? "ALTERNATIVE" : fin.status}</span>
                  <span style={{ fontSize: 10, color: T.inkFaint }}>{sc.deemed ? "(bypass live)" : "(comparator live)"}</span>
                </div>
              </Panel>

              <Panel title="Financial year input" tag={`benchmark $${BENCHMARK_M}M`}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11, color: T.inkSoft }}>
                    Gross result vs benchmark: <b style={{ ...mono, color: grossPct >= 0 ? T.money : T.debt }}>{grossPct >= 0 ? "+" : ""}{grossPct.toFixed(1)}%</b>
                  </label>
                  <input type="range" min={-3} max={5} step={0.1} value={grossPct} onChange={(e) => setGrossPct(+e.target.value)} style={{ accentColor: grossPct >= 0 ? T.money : T.debt }} aria-label="gross financial result" />
                  <p style={{ fontSize: 10.5, color: T.inkFaint, margin: 0 }}>
                    Slide across zero to move between a savings year and a loss year. Quality was locked in before this
                    slider resolved — which is why the projection strip below shows both futures at once. (MSR and other
                    reconciliation mechanics simplified away.)
                  </p>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    {[{ l: "SAVINGS YR (+2.5%)", v: projSave.savings$ + projSave.losses$, c: T.money }, { l: "LOSS YR (−2.5%)", v: projLoss.savings$ + projLoss.losses$, c: T.debt }].map((p) => (
                      <div key={p.l} style={{ flex: 1, border: `1px solid ${T.line}`, borderRadius: 3, background: "#fff", padding: 8 }}>
                        <div style={{ fontSize: 8.5, ...mono, color: T.inkSoft }}>{p.l}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, ...mono, color: p.v >= 0 ? T.money : T.debt }}>{fmt$(p.v)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
              <Panel title="Settlement valves" tag="rates → dollars">
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Valve pool={Math.max(0, (grossPct / 100) * BENCHMARK_M)} rate={fin.sharePct} out={fin.savings$} label="SAVINGS VALVE — square wave sets aperture" color={T.money} dimmed={grossPct <= 0} />
                  <Valve pool={Math.min(0, (grossPct / 100) * BENCHMARK_M)} rate={fin.lossPct} out={fin.losses$} label="LOSS VALVE — both wires; quality narrows it" color={T.debt} wireBoth dimmed={grossPct >= 0} />
                  <p style={{ fontSize: 10, color: T.inkFaint, margin: 0 }}>
                    The asymmetry to internalize: deeming can hold the savings valve fully open, but the loss valve's
                    aperture always reads the smooth wire — the score keeps working on the downside even when the
                    upside has stopped consulting it.
                  </p>
                </div>
              </Panel>

              <Panel title="TIN roster + marginal value" tag="fan-out · sensitivity">
                <TinRoster adjPct={fin.adjPct} />
                <div style={{ marginTop: 12, border: `1.5px solid ${marginal >= 0 ? T.money : T.debt}`, borderRadius: 3, padding: "8px 12px", background: "#fff", display: "inline-flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 9, ...mono, color: T.inkSoft }}>VALUE OF +1 ACHIEVEMENT PT, IN THIS STATE</span>
                  <span style={{ fontSize: 20, fontWeight: 700, ...mono, color: marginal >= 0 ? T.money : T.debt }}>
                    {marginal >= 0 ? "+" : ""}{marginal >= 1000 ? `$${(marginal / 1000).toFixed(2)}M` : `$${marginal.toFixed(0)}k`} / pt
                  </span>
                  <span style={{ fontSize: 9, color: T.inkFaint }}>savings Δ + loss Δ + roster Part B Δ ($60M non-QP revenue assumed)</span>
                </div>
              </Panel>
            </div>
          </div>

          <p style={{ fontSize: 11, color: T.inkFaint, marginTop: 18, maxWidth: 880 }}>
            All dollar mechanics are deliberately simplified — no MSR/MLR, no benchmark rebasing, prior-savings or regional
            adjustments, no sequestration; clinician adjustment curve is illustrative. The language shows *structure*
            (what reads which wire, where deeming does and doesn't reach); reconciliation-grade numbers belong to
            §425.605/610 and the year's published factors. * Medicare eCQM is a CY 2027 proposed collection type.
          </p>
        </div>
      </div>
    </div>
  );
}
