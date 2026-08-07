import { useState, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";

/* ============================================================
   APP PLUS SCORING — VISUAL LANGUAGE, REV 2
   Feedback applied:
   - "token" → measure CHIP
   - "switchyard" → ROUTING MATRIX, cells now have internal
     anatomy: population disc (full vs wedge) + pipeline trace
     (circuit vs batch)
   - benchmark ladders: historical = irregular rung heights,
     flat = uniform rung heights (geometry carries the meaning)
   - accumulator fixtures explained (CMS computes them)
   - THRESHOLD STRIP added: the 40th-percentile standard as a
     distribution with a flag — reused for the clinician 75-line
   - meters rebuilt as glyphs with visible rail wiring
   - WATERFALL: the full story of how points stack to a score
   ============================================================ */

const T = {
  bg: "#EDF0F2", film: "#F7F9FA", line: "#C9D2D8", grid: "#DEE4E8",
  ink: "#1F2A33", inkSoft: "#5B6B77", inkFaint: "#8C9AA5",
  pass: "#16A34A", fail: "#DC2626", grayed: "#AEB9C1", fixed: "#9AA7B0",
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
interface Measure { id: string; name: string; outcome: boolean }
const MEASURES: Measure[] = [
  { id: "001", name: "Diabetes: glycemic >9%", outcome: true },
  { id: "134", name: "Depression screening",   outcome: false },
  { id: "236", name: "Controlling high BP",    outcome: true },
  { id: "112", name: "Breast cancer screening",outcome: false },
  { id: "113", name: "Colorectal screening",   outcome: false },
];
const FIXED = [
  { id: "321", name: "CAHPS survey", pts: 6 },
  { id: "479", name: "Readmission (claims)", pts: 5 },
  { id: "484", name: "Chronic admissions (claims)", pts: 7 },
];
const AVAILABLE = 80, QPS = 55, MAX_SHARE = 75;
// historical benchmark cutpoints are data-derived and lumpy:
const HIST_WEIGHTS = [1.4, 0.7, 1.2, 0.8, 1.5, 0.9, 1.6, 0.8, 1.1, 1.8];

type ScenarioKey = "stacked" | "gatefail" | "fhir";
interface Scenario {
  key: ScenarioKey;
  name: string;
  note: string;
  routing: Record<string, CTKey>;
  decile: Record<string, number>;
  gate: Record<string, boolean>;
}
const SCENARIOS: Record<ScenarioKey, Scenario> = {
  stacked: {
    key: "stacked", name: "Stacked eCQM shop",
    note: "All five chips routed electronic + full population. The bypass is live, so the threshold strip grays out — but watch the waterfall: the striped COA step still lifts the score that feeds the loss meter and the clinician strip.",
    routing: { "001": "ecqm", "134": "ecqm", "236": "ecqm", "112": "ecqm", "113": "ecqm" },
    decile:  { "001": 7, "134": 8, "236": 10, "112": 6, "113": 9 },
    gate:    { "001": true, "134": true, "236": true, "112": true, "113": true },
  },
  gatefail: {
    key: "gatefail", name: "One gate failure",
    note: "Chip 134 fails its gate. Three simultaneous hits: its waterfall step collapses to zero, its COA increment dies, and the bypass lamp for gates goes dark — the threshold strip wakes up and the score marker's position against the flag suddenly decides sharing.",
    routing: { "001": "ecqm", "134": "ecqm", "236": "ecqm", "112": "ecqm", "113": "ecqm" },
    decile:  { "001": 7, "134": 8, "236": 10, "112": 6, "113": 9 },
    gate:    { "001": true, "134": false, "236": true, "112": true, "113": true },
  },
  fhir: {
    key: "fhir", name: "FHIR-forward CQM shop",
    note: "Registry-row chips on uniform (flat) ladders climb high — but no COA step appears in the waterfall and the bypass is dead (wedge-population routing breaks the full-population lamp). The whole outcome rides the threshold strip.",
    routing: { "001": "medcqm", "134": "medcqm", "236": "medcqm", "112": "mipscqm", "113": "mipscqm" },
    decile:  { "001": 9, "134": 9, "236": 10, "112": 6, "113": 7 },
    gate:    { "001": true, "134": true, "236": true, "112": true, "113": true },
  },
};

const mono: CSSProperties = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };
const sans: CSSProperties = { fontFamily: "'Instrument Sans', system-ui, sans-serif" };
const stripe = (c: string): CSSProperties => ({ backgroundImage: `repeating-linear-gradient(135deg, ${c} 0 4px, #fff 4px 7px)` });

/* ---------------- primitive glyphs ---------------- */

// Population disc: full population = solid disc; attributed = wedge of the disc.
function PopGlyph({ full, color, size = 18 }: { full: boolean; color: string; size?: number }) {
  const r = size / 2 - 1.5;
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={c} cy={c} r={r} fill={full ? color : "none"} stroke={color} strokeWidth="1.5" />
      {!full && <path d={`M ${c} ${c} L ${c} ${c - r} A ${r} ${r} 0 0 1 ${c + r * 0.95} ${c + r * 0.31} Z`} fill={color} />}
    </svg>
  );
}

// Pipeline trace: electronic = continuous circuit pulse; registry = batched records on a dashed carry line.
function PipeGlyph({ electronic, color, width = 34 }: { electronic: boolean; color: string; width?: number }) {
  return (
    <svg width={width} height={14} viewBox="0 0 34 14" aria-hidden>
      {electronic ? (
        <path d="M1 7 H8 L11 2 L15 12 L18 7 H33" fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      ) : (
        <g>
          <path d="M1 7 H33" stroke={color} strokeWidth="1.4" strokeDasharray="3 3" fill="none" />
          {[8, 17, 26].map((x) => <rect key={x} x={x - 2.5} y={4.5} width={5} height={5} fill={color} rx={1} />)}
        </g>
      )}
    </svg>
  );
}

// Measure chip (was "token"): a routed measure. Ring + fill = collection type; hollow red = gate-dead.
function Chip({ ct, id, dead, size = 32 }: { ct: CTKey; id: string; dead?: boolean; size?: number }) {
  const c = CT[ct];
  return (
    <div title={c.label} style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: dead ? "#fff" : c.color,
      border: `2.5px solid ${dead ? T.fail : c.color}`,
      color: dead ? T.fail : "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.31, fontWeight: 600, ...mono,
      textDecoration: dead ? "line-through" : "none",
    }}>{id}</div>
  );
}

function GateGlyph({ pass, label }: { pass: boolean; label?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <div style={{
        width: 28, height: 28, transform: "rotate(45deg)",
        border: `2px solid ${pass ? T.pass : T.fail}`,
        background: pass ? "#EAF7EE" : "#FBEAEA",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ transform: "rotate(-45deg)", color: pass ? T.pass : T.fail, fontSize: 13, fontWeight: 700 }}>{pass ? "✓" : "✕"}</span>
      </div>
      {label && <span style={{ fontSize: 9, color: T.inkSoft, ...mono }}>{label}</span>}
    </div>
  );
}

// Benchmark ladder. Historical: irregular rung heights (data-derived cutpoints).
// Flat: uniform rung heights (fixed even bands). Geometry = benchmark kind.
function Ladder({ decile, color, flat, height = 66, width = 22 }: { decile: number; color: string; flat: boolean; height?: number; width?: number }) {
  const rungs = Array.from({ length: 10 }, (_, i) => 10 - i);
  return (
    <div title={flat ? "flat benchmark: uniform bands" : "historical benchmark: irregular cutpoints"}
      style={{ display: "flex", flexDirection: "column", gap: 1, height }}>
      {rungs.map((r) => (
        <div key={r} style={{
          flexGrow: flat ? 1 : HIST_WEIGHTS[r - 1], flexBasis: 0, width,
          background: r <= decile ? color : "#fff",
          border: `1px solid ${r <= decile ? color : T.line}`,
          opacity: r <= decile ? 0.5 + 0.05 * r : 1,
        }} />
      ))}
    </div>
  );
}

// Rail wires: continuous rail = smooth curve; binary rail = square wave.
function WireIcon({ binary, color = T.ink, width = 30 }: { binary: boolean; color?: string; width?: number }) {
  return (
    <svg width={width} height={12} viewBox="0 0 30 12" aria-hidden>
      {binary
        ? <path d="M1 10 H8 V2 H16 V10 H23 V2 H29" fill="none" stroke={color} strokeWidth="1.8" />
        : <path d="M1 8 C 7 2, 12 12, 17 6 S 26 2, 29 5" fill="none" stroke={color} strokeWidth="1.8" />}
    </svg>
  );
}

// Threshold strip: a score distribution with a flag planted at the threshold
// and a marker for "you". Used for the 40th-pctile QPS and the 75-pt MIPS line.
function ThresholdStrip({ value, threshold, flagLabel, markerColor = T.ink, dimmed = false, height = 54 }: { value: number; threshold: number; flagLabel: string; markerColor?: string; dimmed?: boolean; height?: number }) {
  const w = 260, h = height;
  const x = (v: number) => 8 + (v / 100) * (w - 16);
  const ink = dimmed ? T.grayed : T.ink;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: 340, height: "auto", display: "block" }}>
      <path d={`M8 ${h - 12} C ${w * 0.25} ${h - 13}, ${w * 0.32} ${8}, ${w * 0.5} ${10} S ${w * 0.75} ${h - 16}, ${w - 8} ${h - 12} Z`}
        fill={dimmed ? "#EDF0F2" : "#E3EAEF"} stroke={dimmed ? T.grayed : T.line} strokeWidth="1" />
      <line x1={8} y1={h - 12} x2={w - 8} y2={h - 12} stroke={ink} strokeWidth="1.2" />
      <line x1={x(threshold)} y1={4} x2={x(threshold)} y2={h - 12} stroke={dimmed ? T.grayed : T.fail} strokeWidth="1.6" strokeDasharray="4 3" />
      <path d={`M ${x(threshold)} 4 l 12 4 l -12 4 Z`} fill={dimmed ? T.grayed : T.fail} />
      <text x={Math.min(x(threshold) + 15, w - 78)} y={11} fontSize="8.5" fontFamily="IBM Plex Mono, monospace" fill={dimmed ? T.grayed : T.inkSoft}>{flagLabel}</text>
      <path d={`M ${x(value)} ${h - 11} l -5 8 h 10 Z`} fill={dimmed ? T.grayed : markerColor} />
      <text x={x(value)} y={h - 0.5} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={dimmed ? T.grayed : markerColor}>{value.toFixed(0)}</text>
    </svg>
  );
}

// Routing matrix: 2×2 with axis rulers and internal cell anatomy.
function RoutingMatrix({ selected, onSelect, compact = false }: { selected?: CTKey; onSelect?: (k: CTKey) => void; compact?: boolean }) {
  const cell = (k: CTKey) => {
    const c = CT[k];
    const sel = selected === k;
    return (
      <button key={k} onClick={onSelect ? () => onSelect(k) : undefined}
        style={{
          border: `1.5px solid ${sel ? c.color : T.line}`,
          background: sel ? "#fff" : "#fff",
          boxShadow: sel ? `inset 0 0 0 2px ${c.color}` : "none",
          borderRadius: 3, padding: compact ? "4px 5px" : "7px 8px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          cursor: onSelect ? "pointer" : "default",
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
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 4, alignItems: "stretch" }}>
      <div />
      <div style={{ fontSize: 8.5, color: T.inkSoft, textAlign: "center", ...mono }}>FULL POPULATION ●</div>
      <div style={{ fontSize: 8.5, color: T.inkSoft, textAlign: "center", ...mono }}>ATTRIBUTED ◔</div>
      <div style={{ fontSize: 8.5, color: T.inkSoft, writingMode: "vertical-rl", transform: "rotate(180deg)", textAlign: "center", ...mono }}>ELECTRONIC ⌁</div>
      {cell("ecqm")}{cell("medecqm")}
      <div style={{ fontSize: 8.5, color: T.inkSoft, writingMode: "vertical-rl", transform: "rotate(180deg)", textAlign: "center", ...mono }}>REGISTRY ▪▪▪</div>
      {cell("mipscqm")}{cell("medcqm")}
    </div>
  );
}

function StatusLamp({ on, label }: { on: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
        background: on ? T.pass : "#fff", border: `2px solid ${on ? T.pass : T.fail}`,
        boxShadow: on ? `0 0 6px ${T.pass}` : "none",
      }} />
      <span style={{ fontSize: 11, color: T.ink }}>{label}</span>
    </div>
  );
}

function Panel({ children, title, tag, style }: { children: ReactNode; title?: string; tag?: string; style?: CSSProperties }) {
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

/* ---------------- waterfall: the full story ---------------- */

interface WaterfallStep {
  key: string;
  label: string;
  pts: number;
  color: string;
  pattern?: "stripe";
  kind?: "fixed";
}

function Waterfall({ steps, total }: { steps: WaterfallStep[]; total: number }) {
  const w = 640, h = 190, pad = { l: 34, r: 8, t: 14, b: 30 };
  const plotW = w - pad.l - pad.r, plotH = h - pad.t - pad.b;
  const n = steps.length + 1; // + total column
  const colW = plotW / n, barW = Math.min(colW * 0.62, 52);
  const y = (v: number) => pad.t + plotH - (v / AVAILABLE) * plotH;
  let cum = 0;
  const cols = steps.map((s, i) => {
    const y0 = y(cum), y1 = y(cum + s.pts);
    const col = { ...s, i, x: pad.l + i * colW + (colW - barW) / 2, yTop: Math.min(y0, y1), hgt: Math.max(Math.abs(y0 - y1), s.pts > 0 ? 2 : 0), connY: y(cum + s.pts), cumAfter: cum + s.pts };
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
                <pattern id={`p-${c.key}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="6" height="6" fill="#fff" />
                  <rect width="3.2" height="6" fill={c.color} />
                </pattern>
              </defs>
              <rect x={c.x} y={c.yTop} width={barW} height={c.hgt} fill={`url(#p-${c.key})`} stroke={c.color} strokeWidth="1" />
            </>
          ) : (
            <rect x={c.x} y={c.yTop} width={barW} height={c.hgt}
              fill={c.pts === 0 ? "#fff" : c.color} opacity={c.kind === "fixed" ? 0.65 : 0.9}
              stroke={c.pts === 0 ? T.fail : c.color} strokeWidth={c.pts === 0 ? 1.5 : 1}
              strokeDasharray={c.pts === 0 ? "3 2" : "none"} />
          )}
          {c.i < cols.length - 0 && (
            <line x1={c.x + barW} x2={c.x + colW} y1={c.connY} y2={c.connY} stroke={T.inkFaint} strokeWidth="1" strokeDasharray="2 2" />
          )}
          <text x={c.x + barW / 2} y={c.yTop - 3} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={c.pts === 0 ? T.fail : T.inkSoft}>
            {c.pts === 0 ? "0!" : `+${c.pts}`}
          </text>
          <text x={c.x + barW / 2} y={h - 18} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={T.inkSoft}>{c.label}</text>
        </g>
      ))}
      {/* total column */}
      <g>
        <rect x={pad.l + steps.length * colW + (colW - barW) / 2} y={y(total)} width={barW} height={y(0) - y(total)} fill={T.ink} opacity="0.88" />
        <text x={pad.l + steps.length * colW + colW / 2} y={y(total) - 4} fontSize="9.5" fontWeight="700" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={T.ink}>{total}/80</text>
        <text x={pad.l + steps.length * colW + colW / 2} y={h - 18} fontSize="8.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fill={T.ink}>TOTAL</text>
      </g>
      <text x={pad.l} y={h - 4} fontSize="8" fontFamily="IBM Plex Mono, monospace" fill={T.inkFaint}>
        gray = fixtures CMS computes for you (CAHPS survey vendor + 2 claims measures) · striped = COA bonus layer · dashed-red = gate-zeroed
      </text>
    </svg>
  );
}

/* ---------------- lexicon ---------------- */

function Lexicon() {
  const items = [
    {
      name: "Measure chip", demo: (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Chip ct="ecqm" id="236" /><Chip ct="mipscqm" id="134" /><Chip ct="medcqm" id="001" /><Chip ct="ecqm" id="113" dead />
        </div>
      ),
      spec: "One reportable measure, routed. Fill = collection type, and the color persists through every later element — routing is destiny. A gate-dead chip hollows out red.",
    },
    {
      name: "Routing matrix", demo: <RoutingMatrix compact />,
      spec: "Where a chip parks. Each cell's anatomy encodes both axes: the disc is the population (● full disc = all patients, ◔ wedge = attributed subset) and the trace is the pipeline (⌁ continuous circuit = electronic end-to-end, ▪▪▪ batched records = registry/abstraction).",
    },
    {
      name: "Gate", demo: <div style={{ display: "flex", gap: 16 }}><GateGlyph pass label="pass" /><GateGlyph pass={false} label="fail" /></div>,
      spec: "75% completeness + 20-case minimum, as one diamond. A failure fires three ways at once: the chip's points zero, its bonus dies, and the bypass loses a lamp.",
    },
    {
      name: "Benchmark ladder", demo: (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
          <div style={{ textAlign: "center" }}><Ladder decile={7} color={CT.ecqm.color} flat={false} /><div style={{ fontSize: 8.5, ...mono, color: T.inkSoft, marginTop: 3 }}>historical</div></div>
          <div style={{ textAlign: "center" }}><Ladder decile={7} color={CT.medcqm.color} flat /><div style={{ fontSize: 8.5, ...mono, color: T.inkSoft, marginTop: 3 }}>flat</div></div>
        </div>
      ),
      spec: "Ten rungs = deciles = 1–10 points. Rung geometry is the benchmark kind: irregular heights = historical cutpoints derived from past submissions (you can't predict the rungs); uniform heights = flat fixed bands (90%+ = top rung — attainable points are knowable in advance).",
    },
    {
      name: "Rails & wires", demo: (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}><WireIcon binary={false} /><span style={{ fontSize: 11 }}>continuous rail — carries a score (0–100)</span></div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}><WireIcon binary /><span style={{ fontSize: 11 }}>binary rail — carries a status (met / not)</span></div>
        </div>
      ),
      spec: "Two wire styles, one rule: smooth wire = a magnitude, square wave = a yes/no. Every downstream meter is tagged with the wire(s) that feed it, so you can always trace which rail a consequence rides on.",
    },
    {
      name: "Waterfall", demo: (
        <div style={{ width: "100%" }}>
          <Waterfall total={62} steps={[
            { key: "a", label: "001", pts: 7, color: CT.ecqm.color },
            { key: "b", label: "236", pts: 10, color: CT.ecqm.color },
            { key: "c", label: "COA", pts: 2, color: CT.ecqm.color, pattern: "stripe" },
            { key: "d", label: "FIXT", pts: 18, color: T.fixed, kind: "fixed" },
          ]} />
        </div>
      ),
      spec: "The full accumulation story: each chip's earned points step the running total upward, then the striped COA layer, then the gray fixtures — the three measures the ACO never submits because CMS computes them (CAHPS via the survey vendor; the two admin-claims measures straight from claims). Total ÷ 80 = the score the smooth wire carries.",
    },
    {
      name: "Bypass + AND-gate", demo: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <StatusLamp on label="all chips full-population (●)" />
          <StatusLamp on label="all gates pass" />
          <StatusLamp on={false} label="an outcome chip ≥ 10th pctile" />
        </div>
      ),
      spec: "The deeming logic. Three lamps AND together; all lit = a live wire around the threshold strip, and sharing status stops consulting the score. One dark lamp = the wire cuts and the strip below is suddenly in charge.",
    },
    {
      name: "Threshold strip", demo: <ThresholdStrip value={66} threshold={QPS} flagLabel="40th pctile flag" />,
      spec: "The standard quality performance test, drawn honestly: a distribution of all MIPS quality scores nationally, a flag planted at its 40th percentile (CMS publishes the equivalent score each year; 55 here is illustrative), and a marker for your score. Marker past the flag = QPS met on the standard route. The same strip, re-flagged at 75, is the clinicians' MIPS threshold.",
    },
    {
      name: "Consumer meters", demo: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <WireIcon binary width={24} />
            <div style={{ flex: 1, height: 12, border: `1px solid ${T.line}`, borderRadius: 2, background: "#fff", position: "relative" }}>
              <div style={{ width: "100%", height: "100%", background: T.pass, opacity: 0.8 }} />
              <div style={{ position: "absolute", right: 0, top: -3, bottom: -3, width: 2, background: T.ink }} />
            </div>
            <span style={{ fontSize: 10, ...mono }}>share 75/75</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <WireIcon binary={false} width={24} />
            <ThresholdStrip value={83} threshold={75} flagLabel="75-pt MIPS" height={40} />
          </div>
        </div>
      ),
      spec: "Each meter reuses a primitive and wears its wire tag. Sharing rate: a fill-bar against the track maximum, fed by square wave only. Loss rate: an inverted red bar bounded 40–75, fed by both wires. Clinician adjustment: a threshold strip flagged at 75, smooth wire only. Public score: the smooth wire's raw value, published.",
    },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 10 }}>
      {items.map((it, i) => (
        <Panel key={it.name} title={`E${i + 1} · ${it.name}`}>
          <div style={{ minHeight: 92, display: "flex", alignItems: "center", marginBottom: 8 }}>{it.demo}</div>
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
  onRoute: (id: string, k: CTKey) => void;
  onDecile: (id: string, v: number) => void;
  onGate: (id: string) => void;
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
        <Ladder decile={gate ? decile : 0} color={ct.color} flat={ct.flat} height={58} width={18} />
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

interface MachineProps {
  routing: Record<string, CTKey>;
  decile: Record<string, number>;
  gate: Record<string, boolean>;
  setRouting: (r: Record<string, CTKey>) => void;
  setDecile: (d: Record<string, number>) => void;
  setGate: (g: Record<string, boolean>) => void;
}

function Machine({ routing, decile, gate, setRouting, setDecile, setGate }: MachineProps) {
  const calc = useMemo(() => {
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
    const stdMet = q >= QPS;
    const status: "DEEMED" | "MET" | "ALT" | "FAILED" = deemed ? "DEEMED" : stdMet ? "MET" : outcomeOK ? "ALT" : "FAILED";
    const share = status === "DEEMED" || status === "MET" ? MAX_SHARE : status === "ALT" ? Math.round(MAX_SHARE * (q / 100)) : 0;
    const loss = status === "FAILED" ? 75 : Math.round(Math.min(75, Math.max(40, 75 - 0.45 * q)));
    const clin = 0.5 * q + 0.3 * 82 + 0.2 * 100;
    return { steps, total, q, coa, allFull, allGates, outcomeOK, deemed, stdMet, status, share, loss, clin };
  }, [routing, decile, gate]);

  const statusColor = calc.status === "FAILED" ? T.fail : calc.status === "ALT" ? "#D97706" : T.pass;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Panel title="Stations · route, gate, climb" tag="one station per reportable chip">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
          {MEASURES.map((m) => (
            <Station key={m.id} m={m} routing={routing[m.id]} decile={decile[m.id]} gate={gate[m.id]}
              onRoute={(id, k) => setRouting({ ...routing, [id]: k })}
              onDecile={(id, v) => setDecile({ ...decile, [id]: v })}
              onGate={(id) => setGate({ ...gate, [id]: !gate[id] })} />
          ))}
        </div>
      </Panel>

      <Panel title="Waterfall · the full accumulation story" tag={`smooth wire out: ${calc.q.toFixed(1)}`}>
        <Waterfall steps={calc.steps} total={calc.total} />
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
        <Panel title="Binary rail · deeming bypass" tag="square wave out">
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 8 }}>
            <StatusLamp on={calc.allFull} label="all five chips full-population (●)" />
            <StatusLamp on={calc.allGates} label="every gate passes" />
            <StatusLamp on={calc.outcomeOK} label="an outcome chip (001/236) at ≥10th pctile" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <svg width="46" height="20" viewBox="0 0 46 20" aria-hidden>
              <path d="M2 16 C 14 -4, 32 -4, 44 12" fill="none"
                stroke={calc.deemed ? T.pass : T.grayed} strokeWidth="3"
                strokeDasharray={calc.deemed ? "none" : "5 4"} />
            </svg>
            <span style={{ fontSize: 11, color: calc.deemed ? T.pass : T.inkFaint }}>
              {calc.deemed ? "bypass LIVE — strip below not consulted for sharing" : "bypass cut — the strip below decides"}
            </span>
          </div>
          <ThresholdStrip value={calc.q} threshold={QPS} flagLabel="40th pctile (illus. 55)" dimmed={calc.deemed} />
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <WireIcon binary color={statusColor} />
            <span style={{ fontSize: 13, fontWeight: 700, color: statusColor, ...mono }}>QPS: {calc.status === "ALT" ? "ALTERNATIVE" : calc.status}</span>
          </div>
        </Panel>

        <Panel title="Consumer meters · who reads which wire" tag="stage F">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, ...mono, color: T.inkSoft }}>
                <span style={{ display: "flex", gap: 5, alignItems: "center" }}><WireIcon binary width={22} /> SHARING RATE</span><span>{calc.share}% of {MAX_SHARE}%</span>
              </div>
              <div style={{ height: 14, border: `1px solid ${T.line}`, borderRadius: 2, background: "#fff", position: "relative", marginTop: 3 }}>
                <div style={{ width: `${(calc.share / MAX_SHARE) * 100}%`, height: "100%", background: T.pass, opacity: 0.8, transition: "width .3s" }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, ...mono, color: T.inkSoft }}>
                <span style={{ display: "flex", gap: 5, alignItems: "center" }}><WireIcon binary width={22} /><WireIcon binary={false} width={22} /> LOSS RATE (ENHANCED)</span><span>{calc.loss}%</span>
              </div>
              <div style={{ height: 14, border: `1px solid ${T.line}`, borderRadius: 2, background: "#fff", position: "relative", marginTop: 3 }}>
                <div style={{ position: "absolute", left: `${(40 / 75) * 100}%`, right: 0, top: 0, bottom: 0, background: "#FBEAEA" }} />
                <div style={{ width: `${(calc.loss / 75) * 100}%`, height: "100%", background: T.fail, opacity: 0.75, transition: "width .3s" }} />
              </div>
              <div style={{ fontSize: 8.5, ...mono, color: T.inkFaint, marginTop: 2 }}>bounded 40–75 · quality-scaled even when deemed — this is COA's quiet payoff</div>
            </div>
            <div>
              <div style={{ fontSize: 10, ...mono, color: T.inkSoft, display: "flex", gap: 5, alignItems: "center", marginBottom: 2 }}>
                <WireIcon binary={false} width={22} /> NON-QP CLINICIAN MIPS ({calc.clin.toFixed(1)})
              </div>
              <ThresholdStrip value={calc.clin} threshold={75} flagLabel="75-pt MIPS threshold" markerColor={calc.clin >= 75 ? T.pass : T.fail} height={44} />
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <WireIcon binary={false} width={22} />
              <span style={{ fontSize: 10, ...mono, color: T.inkSoft }}>PUBLIC SCORE</span>
              <span style={{ fontSize: 18, fontWeight: 700, ...mono, color: T.ink, border: `1.5px solid ${T.ink}`, borderRadius: 3, padding: "1px 9px" }}>{calc.q.toFixed(1)}</span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ---------------- app ---------------- */

export default function AppPlusVizLanguageV2() {
  const s0 = SCENARIOS.stacked;
  const [scenario, setScenario] = useState<ScenarioKey>("stacked");
  const [routing, setRouting] = useState({ ...s0.routing });
  const [decile, setDecile] = useState({ ...s0.decile });
  const [gate, setGate] = useState({ ...s0.gate });
  const load = (key: ScenarioKey) => {
    const s = SCENARIOS[key];
    setScenario(key); setRouting({ ...s.routing }); setDecile({ ...s.decile }); setGate({ ...s.gate });
  };

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
              <div style={{ fontSize: 11, letterSpacing: "0.18em", color: T.inkSoft, ...mono }}>DRAWING NO. APP-PLUS-VL-02</div>
              <h1 style={{ margin: "4px 0 6px", fontSize: 26, fontWeight: 700, lineHeight: 1.15 }}>APP Plus scoring — a visual language, rev 2</h1>
              <p style={{ margin: 0, fontSize: 13, color: T.inkSoft, maxWidth: 580 }}>
                Chips route through a matrix, climb ladders, stack a waterfall into one score — while a bypass decides
                whether the threshold strip gets consulted at all. Smooth wires carry magnitudes; square waves carry verdicts.
              </p>
            </div>
            <div style={{ padding: "16px 20px", ...mono, fontSize: 10, color: T.inkSoft, display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }}>
              <span>REV 2: CHIP · MATRIX ANATOMY · RUNG</span>
              <span>GEOMETRY · STRIP · WIRED METERS ·</span>
              <span>WATERFALL — THRESHOLDS ILLUSTRATIVE</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "0 0 10px" }}>
            <span style={{ fontSize: 12, ...mono, color: T.inkSoft }}>SHEET 1</span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>The elements</h2>
          </div>
          <Lexicon />

          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "26px 0 10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, ...mono, color: T.inkSoft }}>SHEET 2</span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>The machine</h2>
            <span style={{ fontSize: 12, color: T.inkFaint }}>— re-route chips, drag deciles, flip gates.</span>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {Object.values(SCENARIOS).map((s) => (
              <button key={s.key} onClick={() => load(s.key)} style={{
                padding: "6px 12px", borderRadius: 3, cursor: "pointer", fontSize: 12, fontWeight: 600, ...sans,
                border: `1.5px solid ${scenario === s.key ? T.ink : T.line}`,
                background: scenario === s.key ? T.ink : "#fff",
                color: scenario === s.key ? "#fff" : T.inkSoft,
              }}>{s.name}</button>
            ))}
          </div>
          <p style={{ fontSize: 12.5, color: T.inkSoft, margin: "0 0 12px", maxWidth: 880, lineHeight: 1.5 }}>{SCENARIOS[scenario].note}</p>

          <Machine routing={routing} decile={decile} gate={gate} setRouting={setRouting} setDecile={setDecile} setGate={setGate} />

          <p style={{ fontSize: 11, color: T.inkFaint, marginTop: 18, maxWidth: 880 }}>
            * Medicare eCQM is a CY 2027 proposed collection type. The 40th-percentile flag, loss scaling, and clinician PI
            assumption are illustrative stand-ins for annually published values — consult the year's APP Scoring Guide and
            §425.605/610 before wiring real numbers.
          </p>
        </div>
      </div>
    </div>
  );
}
