import { useState, useMemo, type CSSProperties, type ReactNode } from "react";

/* ============================================================
   APP PLUS SCORING — A VISUAL LANGUAGE
   Sheet 1: Lexicon (the elements)
   Sheet 2: The Machine (elements assembled, interactive)
   Scenarios preset the machine state.
   ============================================================ */

const T = {
  bg: "#EDF0F2",
  film: "#F7F9FA",
  line: "#C9D2D8",
  grid: "#DEE4E8",
  ink: "#1F2A33",
  inkSoft: "#5B6B77",
  inkFaint: "#8C9AA5",
  pass: "#16A34A",
  fail: "#DC2626",
  bypass: "#16A34A",
  grayed: "#AEB9C1",
  fixed: "#9AA7B0",
};

type CollectionTypeKey = "ecqm" | "medecqm" | "mipscqm" | "medcqm";

interface CollectionType {
  label: string;
  short: string;
  color: string;
  bench: "historical" | "flat";
  row: "electronic" | "registry";
  col: "all-payer" | "attributed";
  proposed?: boolean;
}

const CT: Record<CollectionTypeKey, CollectionType> = {
  ecqm:    { label: "eCQM",          short: "eCQM",  color: "#2563EB", bench: "historical", row: "electronic", col: "all-payer" },
  medecqm: { label: "Medicare eCQM", short: "M-eCQM", color: "#0D9488", bench: "flat",       row: "electronic", col: "attributed", proposed: true },
  mipscqm: { label: "MIPS CQM",      short: "CQM",   color: "#D97706", bench: "historical", row: "registry",   col: "all-payer" },
  medcqm:  { label: "Medicare CQM",  short: "M-CQM", color: "#A21CAF", bench: "flat",       row: "registry",   col: "attributed" },
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
  { id: "321", name: "CAHPS for MIPS", pts: 6 },
  { id: "479", name: "HWR readmission", pts: 5 },
  { id: "484", name: "Chronic admissions", pts: 7 },
];

const AVAILABLE = 80;
const QPS_THRESHOLD = 55; // illustrative 40th-percentile-equivalent
const MAX_SHARE = 75;     // ENHANCED, illustrative

type ScenarioKey = "stacked" | "gatefail" | "fhir";
type Routing = Record<MeasureId, CollectionTypeKey>;
type DecileMap = Record<MeasureId, number>;
type GateMap = Record<MeasureId, boolean>;

interface Scenario {
  key: ScenarioKey;
  name: string;
  note: string;
  routing: Routing;
  decile: DecileMap;
  gate: GateMap;
}

const SCENARIOS: Record<ScenarioKey, Scenario> = {
  stacked: {
    key: "stacked",
    name: "Stacked eCQM shop",
    note: "All five measures routed electronic + all-payer. Bypass live; COA points stack on top. The score comparator is bypassed — the raw score works quietly on losses and clinician adjustments.",
    routing: { "001": "ecqm", "134": "ecqm", "236": "ecqm", "112": "ecqm", "113": "ecqm" },
    decile:  { "001": 7, "134": 8, "236": 10, "112": 6, "113": 9 },
    gate:    { "001": true, "134": true, "236": true, "112": true, "113": true },
  },
  gatefail: {
    key: "gatefail",
    name: "One gate failure",
    note: "Same shop, but #134 misses 75% completeness. One gate flip: the measure zeroes, its COA point dies, and the bypass wire breaks — the comparator wakes up and the raw score now carries the sharing decision.",
    routing: { "001": "ecqm", "134": "ecqm", "236": "ecqm", "112": "ecqm", "113": "ecqm" },
    decile:  { "001": 7, "134": 8, "236": 10, "112": 6, "113": 9 },
    gate:    { "001": true, "134": false, "236": true, "112": true, "113": true },
  },
  fhir: {
    key: "fhir",
    name: "FHIR-forward CQM shop",
    note: "Registry-row pipelines, flat benchmarks on the Medicare CQMs. Strong deciles — but no COA and a dead bypass, because attributed-column routing breaks the all-payer condition. Everything rides the comparator.",
    routing: { "001": "medcqm", "134": "medcqm", "236": "medcqm", "112": "mipscqm", "113": "mipscqm" },
    decile:  { "001": 9, "134": 9, "236": 10, "112": 6, "113": 7 },
    gate:    { "001": true, "134": true, "236": true, "112": true, "113": true },
  },
};

/* ---------- shared bits ---------- */

const mono: CSSProperties = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };
const sans: CSSProperties = { fontFamily: "'Instrument Sans', system-ui, sans-serif" };

function stripeBg(color: string): CSSProperties {
  return {
    backgroundImage: `repeating-linear-gradient(135deg, ${color} 0 4px, #ffffff 4px 7px)`,
  };
}

interface TokenProps {
  ct: CollectionTypeKey;
  id: string;
  dead?: boolean;
  size?: number;
}

function Token({ ct, id, dead, size = 34 }: TokenProps) {
  const c = CT[ct];
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: dead ? "#fff" : c.color,
        border: `2.5px solid ${dead ? T.fail : c.color}`,
        color: dead ? T.fail : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.32, fontWeight: 600, ...mono,
        textDecoration: dead ? "line-through" : "none",
        flexShrink: 0,
      }}
      title={c.label}
    >
      {id}
    </div>
  );
}

interface GateGlyphProps {
  pass: boolean;
  label?: string;
}

function GateGlyph({ pass, label }: GateGlyphProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <div style={{
        width: 30, height: 30, border: `2px solid ${pass ? T.pass : T.fail}`,
        background: pass ? "#EAF7EE" : "#FBEAEA",
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: "rotate(45deg)",
      }}>
        <span style={{ transform: "rotate(-45deg)", color: pass ? T.pass : T.fail, fontSize: 14, fontWeight: 700 }}>
          {pass ? "✓" : "✕"}
        </span>
      </div>
      {label && <span style={{ fontSize: 9, color: T.inkSoft, ...mono }}>{label}</span>}
    </div>
  );
}

interface LadderProps {
  decile: number;
  color: string;
  flat: boolean;
  height?: number;
}

function Ladder({ decile, color, flat, height = 72 }: LadderProps) {
  const rungs = Array.from({ length: 10 }, (_, i) => 10 - i);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1, height }} title={flat ? "flat benchmark" : "historical benchmark"}>
      {rungs.map((r) => (
        <div key={r} style={{
          flex: 1, width: 22,
          background: r <= decile ? color : "#fff",
          border: `1px ${flat ? "dashed" : "solid"} ${r <= decile ? color : T.line}`,
          opacity: r <= decile ? 0.55 + 0.045 * r : 1,
        }} />
      ))}
    </div>
  );
}

interface StatusLampProps {
  on: boolean;
  label: string;
}

function StatusLamp({ on, label }: StatusLampProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 10, height: 10, borderRadius: "50%",
        background: on ? T.pass : "#fff",
        border: `2px solid ${on ? T.pass : T.fail}`,
        boxShadow: on ? `0 0 6px ${T.pass}` : "none",
      }} />
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
    <div style={{
      background: T.film, border: `1px solid ${T.line}`, borderRadius: 4,
      padding: 14, ...style,
    }}>
      {title && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.12em", color: T.inkSoft, textTransform: "uppercase", ...mono }}>{title}</span>
          {tag && <span style={{ fontSize: 10, color: T.inkFaint, ...mono }}>{tag}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------- Sheet 1: lexicon ---------- */

function Lexicon() {
  const items = [
    {
      name: "Token",
      spec: "One reportable measure. Fill color = collection type, and the color never changes downstream — routing is destiny. A dead token (gate failure) hollows out.",
      demo: (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Token ct="ecqm" id="236" />
          <Token ct="mipscqm" id="134" />
          <Token ct="medcqm" id="001" />
          <Token ct="medecqm" id="112" />
          <Token ct="ecqm" id="113" dead />
        </div>
      ),
    },
    {
      name: "Switchyard",
      spec: "The 2×2 routing grid. Rows = pipeline (electronic / registry). Columns = population (all-payer / attributed). A token parks in exactly one cell per year.",
      demo: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, width: 170 }}>
          {(["ecqm", "medecqm", "mipscqm", "medcqm"] as const).map((k) => (
            <div key={k} style={{
              border: `1.5px solid ${CT[k].color}`, borderRadius: 3, padding: "5px 6px",
              fontSize: 10, color: CT[k].color, ...mono, textAlign: "center",
              background: "#fff",
            }}>
              {CT[k].short}{CT[k].proposed ? "*" : ""}
            </div>
          ))}
        </div>
      ),
    },
    {
      name: "Gate",
      spec: "A pass/fail diamond: 75% data completeness + 20-case minimum. A failed gate does three things at once — zeroes the token, kills its bonus, and cuts the bypass wire.",
      demo: <div style={{ display: "flex", gap: 16 }}><GateGlyph pass label="pass" /><GateGlyph pass={false} label="fail" /></div>,
    },
    {
      name: "Decile ladder",
      spec: "The benchmark. A token climbs its own collection type's ladder — same measure, different ladder per cell. Solid rungs = historical benchmark; dashed rungs = flat.",
      demo: (
        <div style={{ display: "flex", gap: 14, alignItems: "flex-end" }}>
          <Ladder decile={7} color={CT.ecqm.color} flat={false} />
          <Ladder decile={9} color={CT.medcqm.color} flat />
        </div>
      ),
    },
    {
      name: "Accumulator",
      spec: "The continuous rail's register: achievement points filling a fixed 80-point frame. COA points arrive striped, so the bonus layer is always visually separable from earned points.",
      demo: (
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", height: 20, border: `1px solid ${T.line}`, borderRadius: 3, overflow: "hidden", background: "#fff" }}>
            <div style={{ width: "45%", background: CT.ecqm.color, opacity: 0.85 }} />
            <div style={{ width: "6%", ...stripeBg(CT.ecqm.color) }} />
            <div style={{ width: "20%", background: T.fixed }} />
          </div>
          <div style={{ fontSize: 9, color: T.inkSoft, marginTop: 4, ...mono }}>earned · striped = COA · gray = CMS-scored</div>
        </div>
      ),
    },
    {
      name: "Bypass wire + AND-gate",
      spec: "The binary rail's deeming logic. Three lamps feed an AND-gate; if all light, a wire routes around the comparator and the score stops mattering for sharing status.",
      demo: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <StatusLamp on label="all-payer routing ×5" />
          <StatusLamp on label="all gates pass" />
          <StatusLamp on={false} label="outcome ≥ 10th pctile" />
        </div>
      ),
    },
    {
      name: "Comparator",
      spec: "Score ≥ threshold? The standard QPS test. When the bypass is live the comparator grays out — the visual for “your raw score is not being consulted here.”",
      demo: (
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ border: `2px solid ${T.ink}`, borderRadius: 3, padding: "4px 10px", fontSize: 12, ...mono }}>Q ≥ 55?</div>
          <div style={{ border: `2px dashed ${T.grayed}`, color: T.grayed, borderRadius: 3, padding: "4px 10px", fontSize: 12, ...mono }}>bypassed</div>
        </div>
      ),
    },
    {
      name: "Consumer meters",
      spec: "Downstream readouts, each wired to a rail: sharing rate (binary), loss rate (both), clinician MIPS adjustment (continuous), public score (continuous). Wiring is the lesson.",
      demo: (
        <div style={{ display: "flex", gap: 6 }}>
          {["75%", "41%", "83.4", "77.5"].map((v, i) => (
            <div key={i} style={{ border: `1px solid ${T.line}`, background: "#fff", borderRadius: 3, padding: "4px 7px", fontSize: 11, ...mono }}>{v}</div>
          ))}
        </div>
      ),
    },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
      {items.map((it, i) => (
        <Panel key={it.name} title={`E${i + 1} · ${it.name}`}>
          <div style={{ minHeight: 86, display: "flex", alignItems: "center", marginBottom: 8 }}>{it.demo}</div>
          <p style={{ fontSize: 12, lineHeight: 1.5, color: T.inkSoft, margin: 0 }}>{it.spec}</p>
        </Panel>
      ))}
    </div>
  );
}

/* ---------- Sheet 2: the machine ---------- */

interface MeasureStationProps {
  m: Measure;
  routing: CollectionTypeKey;
  decile: number;
  gate: boolean;
  onRoute: (id: MeasureId, k: CollectionTypeKey) => void;
  onDecile: (id: MeasureId, v: number) => void;
  onGate: (id: MeasureId) => void;
}

function MeasureStation({ m, routing, decile, gate, onRoute, onDecile, onGate }: MeasureStationProps) {
  const ct = CT[routing];
  const pts = gate ? decile : 0;
  const coaEligible = routing === "ecqm" && gate;
  const coaWasted = coaEligible && decile === 10;
  return (
    <div style={{
      border: `1px solid ${T.line}`, borderTop: `3px solid ${ct.color}`,
      background: "#fff", borderRadius: 4, padding: 10,
      display: "flex", flexDirection: "column", gap: 8, minWidth: 0,
    }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Token ct={routing} id={m.id} dead={!gate} size={30} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
          <div style={{ fontSize: 9, color: T.inkFaint, ...mono }}>{m.outcome ? "OUTCOME" : "process"} · {ct.bench} bench</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
        {(Object.keys(CT) as CollectionTypeKey[]).map((k) => (
          <button key={k} onClick={() => onRoute(m.id, k)} style={{
            fontSize: 9, ...mono, padding: "3px 2px", borderRadius: 2, cursor: "pointer",
            border: `1.5px solid ${routing === k ? CT[k].color : T.line}`,
            background: routing === k ? CT[k].color : "#fff",
            color: routing === k ? "#fff" : T.inkSoft,
          }}>
            {CT[k].short}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Ladder decile={gate ? decile : 0} color={ct.color} flat={ct.bench === "flat"} height={60} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <input type="range" min={1} max={10} value={decile} onChange={(e) => onDecile(m.id, +e.target.value)} style={{ width: "100%", accentColor: ct.color }} aria-label={`decile for measure ${m.id}`} />
          <button onClick={() => onGate(m.id)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", alignSelf: "flex-start" }} aria-label={`toggle gates for ${m.id}`}>
            <GateGlyph pass={gate} label="gates" />
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, alignItems: "center", ...mono, fontSize: 10 }}>
        <span style={{ border: `1px solid ${ct.color}`, color: gate ? ct.color : T.fail, borderRadius: 2, padding: "1px 5px" }}>
          {pts} pt{pts === 1 ? "" : "s"}
        </span>
        {coaEligible && (
          <span style={{ borderRadius: 2, padding: "1px 5px", border: `1px solid ${ct.color}`, color: coaWasted ? T.inkFaint : ct.color, ...(!coaWasted ? stripeBg("#DBEAFE") : {}), textDecoration: coaWasted ? "line-through" : "none" }}>
            +1 COA{coaWasted ? " (capped)" : ""}
          </span>
        )}
      </div>
    </div>
  );
}

interface Seg {
  id: string;
  pts: number;
  color: string;
  kind: "earned" | "coa" | "fixed";
}

interface MachineProps {
  routing: Routing;
  decile: DecileMap;
  gate: GateMap;
  setRouting: (next: Routing) => void;
  setDecile: (next: DecileMap) => void;
  setGate: (next: GateMap) => void;
}

function Machine({ routing, decile, gate, setRouting, setDecile, setGate }: MachineProps) {
  const calc = useMemo(() => {
    let earned = 0, coa = 0;
    const segs: Seg[] = [];
    MEASURES.forEach((m) => {
      const p = gate[m.id] ? decile[m.id] : 0;
      earned += p;
      segs.push({ id: m.id, pts: p, color: CT[routing[m.id]].color, kind: "earned" });
      if (routing[m.id] === "ecqm" && gate[m.id] && decile[m.id] < 10) {
        coa += 1;
        segs.push({ id: m.id + "c", pts: 1, color: CT.ecqm.color, kind: "coa" });
      }
    });
    coa = Math.min(coa, AVAILABLE * 0.1);
    const fixedPts = FIXED.reduce((s, f) => s + f.pts, 0);
    earned += fixedPts;
    segs.push({ id: "fixed", pts: fixedPts, color: T.fixed, kind: "fixed" });
    const total = Math.min(earned + coa, AVAILABLE);
    const q = (total / AVAILABLE) * 100;

    const allAllPayer = MEASURES.every((m) => CT[routing[m.id]].col === "all-payer");
    const allGates = MEASURES.every((m) => gate[m.id]);
    const outcomeOK = MEASURES.some((m) => m.outcome && gate[m.id] && decile[m.id] >= 2);
    const deemed = allAllPayer && allGates && outcomeOK;
    const stdMet = q >= QPS_THRESHOLD;
    const altMet = outcomeOK;
    const status = deemed ? "DEEMED" : stdMet ? "MET" : altMet ? "ALT" : "FAILED";

    const share = status === "DEEMED" || status === "MET" ? MAX_SHARE : status === "ALT" ? Math.round(MAX_SHARE * (q / 100)) : 0;
    const loss = status === "FAILED" ? 75 : Math.round(Math.min(75, Math.max(40, 75 - 0.45 * q)));
    const clinician = (0.5 * q + 0.3 * 82 + 0.2 * 100).toFixed(1);

    return { segs, coa, total, q, deemed, stdMet, allAllPayer, allGates, outcomeOK, status, share, loss, clinician };
  }, [routing, decile, gate]);

  const statusColor = calc.status === "FAILED" ? T.fail : calc.status === "ALT" ? "#D97706" : T.pass;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* stations */}
      <Panel title="Stage A–C · Routing, gates, ladders" tag="one station per reportable measure">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
          {MEASURES.map((m) => (
            <MeasureStation key={m.id} m={m}
              routing={routing[m.id]} decile={decile[m.id]} gate={gate[m.id]}
              onRoute={(id, k) => setRouting({ ...routing, [id]: k })}
              onDecile={(id, v) => setDecile({ ...decile, [id]: v })}
              onGate={(id) => setGate({ ...gate, [id]: !gate[id] })}
            />
          ))}
        </div>
      </Panel>

      {/* two rails */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
        <Panel title="Stage D · Continuous rail — accumulator" tag={`${calc.total.toFixed(0)} / ${AVAILABLE} pts`}>
          <div style={{ display: "flex", height: 30, border: `1px solid ${T.line}`, borderRadius: 3, overflow: "hidden", background: "#fff" }}>
            {calc.segs.map((s) => (
              <div key={s.id}
                title={`${s.id}: ${s.pts} pts (${s.kind})`}
                style={{
                  width: `${(s.pts / AVAILABLE) * 100}%`,
                  transition: "width .3s",
                  ...(s.kind === "coa" ? stripeBg(s.color) : { background: s.color, opacity: s.kind === "fixed" ? 0.6 : 0.85 }),
                  borderRight: "1px solid #fff",
                }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, ...mono }}>
            <span style={{ fontSize: 11, color: T.inkSoft }}>COA injected: +{calc.coa}</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: T.ink }}>{calc.q.toFixed(1)}%</span>
          </div>
          <p style={{ fontSize: 11, color: T.inkFaint, margin: "6px 0 0" }}>
            Gray = CMS-scored fixtures (CAHPS + 2 admin claims). Striped = Complex Organization Adjustment — visible as a separate layer so its marginal value is never confused with earned points.
          </p>
        </Panel>

        <Panel title="Stage E · Binary rail — deeming + comparator" tag="QPS determination">
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
            <StatusLamp on={calc.allAllPayer} label="All five routed all-payer (eCQM / MIPS CQM)" />
            <StatusLamp on={calc.allGates} label="Every reportable measure clears its gates" />
            <StatusLamp on={calc.outcomeOK} label="≥1 outcome measure at ≥10th percentile" />
          </div>
          <svg viewBox="0 0 300 70" style={{ width: "100%", height: 70 }} aria-hidden>
            <path d="M10 35 H70" stroke={T.ink} strokeWidth="2" fill="none" />
            <path d="M70 35 C 110 -5, 200 -5, 250 30" fill="none"
              stroke={calc.deemed ? T.bypass : T.grayed} strokeWidth="3"
              strokeDasharray={calc.deemed ? "none" : "6 5"} />
            <rect x="95" y="22" width="86" height="28" rx="3"
              fill="#fff" stroke={calc.deemed ? T.grayed : T.ink} strokeWidth="2"
              strokeDasharray={calc.deemed ? "5 4" : "none"} />
            <text x="138" y="40" textAnchor="middle" fontSize="11" fontFamily="IBM Plex Mono, monospace"
              fill={calc.deemed ? T.grayed : T.ink}>
              Q ≥ {QPS_THRESHOLD}?
            </text>
            <path d="M181 36 H250" stroke={calc.deemed ? T.grayed : calc.stdMet ? T.pass : T.fail} strokeWidth="2" fill="none" />
            <circle cx="262" cy="34" r="11" fill={statusColor} />
          </svg>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: statusColor, ...mono }}>
              QPS: {calc.status === "ALT" ? "ALTERNATIVE" : calc.status}
            </span>
            <span style={{ fontSize: 11, color: T.inkFaint }}>
              {calc.deemed ? "bypass live — comparator not consulted" : "comparator live — the raw score decides"}
            </span>
          </div>
        </Panel>
      </div>

      {/* consumers */}
      <Panel title="Stage F · Consumer meters" tag="what reads which rail">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
          {[
            { label: "Sharing rate", value: `${calc.share}%`, rail: "binary rail", ok: calc.share === MAX_SHARE },
            { label: "Shared-loss rate", value: `${calc.loss}%`, rail: "both rails", ok: calc.loss <= 50 },
            { label: "Non-QP clinician score", value: calc.clinician, rail: "continuous rail", ok: +calc.clinician >= 75 },
            { label: "Public score", value: `${calc.q.toFixed(1)}`, rail: "continuous rail", ok: true },
          ].map((mtr) => (
            <div key={mtr.label} style={{ border: `1px solid ${T.line}`, borderRadius: 3, background: "#fff", padding: 10 }}>
              <div style={{ fontSize: 10, color: T.inkSoft }}>{mtr.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: mtr.ok ? T.ink : T.fail, ...mono }}>{mtr.value}</div>
              <div style={{ fontSize: 9, color: T.inkFaint, ...mono }}>← {mtr.rail}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: T.inkFaint, margin: "8px 0 0" }}>
          Clinician score = 50% quality + 30% PI (assumed 82) + 20% IA (auto-credit), vs the 75-point MIPS threshold. Loss-rate scaling and the {QPS_THRESHOLD}-point QPS threshold are illustrative stand-ins for annually published values.
        </p>
      </Panel>
    </div>
  );
}

/* ---------- app ---------- */

export default function AppPlusVizLanguage() {
  const s0 = SCENARIOS.stacked;
  const [scenario, setScenario] = useState<ScenarioKey>("stacked");
  const [routing, setRouting] = useState({ ...s0.routing });
  const [decile, setDecile] = useState({ ...s0.decile });
  const [gate, setGate] = useState({ ...s0.gate });

  const loadScenario = (key: ScenarioKey) => {
    const s = SCENARIOS[key];
    setScenario(key);
    setRouting({ ...s.routing });
    setDecile({ ...s.decile });
    setGate({ ...s.gate });
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, ...sans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap');
        input[type=range]{height:4px}
        button:focus-visible{outline:2px solid ${T.ink};outline-offset:2px}
        @media (prefers-reduced-motion: reduce){*{transition:none!important}}
      `}</style>
      <div style={{
        backgroundImage: `linear-gradient(${T.grid} 1px, transparent 1px), linear-gradient(90deg, ${T.grid} 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "28px 16px 60px" }}>

          {/* title block */}
          <div style={{ border: `2px solid ${T.ink}`, background: T.film, borderRadius: 4, display: "flex", flexWrap: "wrap", marginBottom: 22 }}>
            <div style={{ padding: "16px 20px", flex: "1 1 380px", borderRight: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", color: T.inkSoft, ...mono }}>DRAWING NO. APP-PLUS-VL-01</div>
              <h1 style={{ margin: "4px 0 6px", fontSize: 26, fontWeight: 700, lineHeight: 1.15 }}>
                A visual language for APP Plus scoring pipelines
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: T.inkSoft, maxWidth: 560 }}>
                Two rails share one set of measures. The continuous rail turns deciles into a score; the binary rail turns
                routing and gates into a status — and a deeming bypass can make the score irrelevant, until it can't.
              </p>
            </div>
            <div style={{ padding: "16px 20px", ...mono, fontSize: 10, color: T.inkSoft, display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }}>
              <span>REV: CY 2027 PFS (CMS-1848-P, PROPOSED)</span>
              <span>SHEET 1: LEXICON · SHEET 2: MACHINE</span>
              <span>THRESHOLDS ILLUSTRATIVE — NOT ADVICE</span>
            </div>
          </div>

          {/* sheet 1 */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "0 0 10px" }}>
            <span style={{ fontSize: 12, ...mono, color: T.inkSoft }}>SHEET 1</span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>The elements</h2>
          </div>
          <Lexicon />

          {/* sheet 2 */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "26px 0 10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, ...mono, color: T.inkSoft }}>SHEET 2</span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>The machine</h2>
            <span style={{ fontSize: 12, color: T.inkFaint }}>— re-route tokens, drag deciles, flip gates; watch both rails.</span>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {Object.values(SCENARIOS).map((s) => (
              <button key={s.key} onClick={() => loadScenario(s.key)} style={{
                padding: "6px 12px", borderRadius: 3, cursor: "pointer", fontSize: 12, fontWeight: 600, ...sans,
                border: `1.5px solid ${scenario === s.key ? T.ink : T.line}`,
                background: scenario === s.key ? T.ink : "#fff",
                color: scenario === s.key ? "#fff" : T.inkSoft,
              }}>
                {s.name}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12.5, color: T.inkSoft, margin: "0 0 12px", maxWidth: 860, lineHeight: 1.5 }}>
            {SCENARIOS[scenario].note}
          </p>

          <Machine
            routing={routing} decile={decile} gate={gate}
            setRouting={setRouting} setDecile={setDecile} setGate={setGate}
          />

          <p style={{ fontSize: 11, color: T.inkFaint, marginTop: 18, maxWidth: 860 }}>
            * Medicare eCQM is a CY 2027 proposed collection type. Deeming requires all-payer routing on all five measures;
            COA accrues only to eCQM-routed measures below decile 10. Benchmark thresholds, loss scaling, and the QPS
            percentile are simplified illustrative values — consult the year's APP Scoring Guide and §425.605/610 before
            wiring real numbers.
          </p>
        </div>
      </div>
    </div>
  );
}
