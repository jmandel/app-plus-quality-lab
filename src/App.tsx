import { useState } from "react";
import AppPlusPathwayLab from "./PathwayLab";
import AppPlusVizLanguage from "./VizLanguage";
import AppPlusVizLanguageV2 from "./VizLanguageV2";
import AppPlusVizLanguageV3 from "./VizLanguageV3";

const TABS = [
  { id: "lab", label: "Pathway Lab", Component: AppPlusPathwayLab },
  { id: "v1", label: "Visual Language v1", Component: AppPlusVizLanguage },
  { id: "v2", label: "Visual Language v2", Component: AppPlusVizLanguageV2 },
  { id: "v3", label: "Visual Language v3", Component: AppPlusVizLanguageV3 },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function App() {
  const [tab, setTab] = useState<TabId>("lab");
  const active = TABS.find((t) => t.id === tab) ?? TABS[0];
  return (
    <div style={{ minHeight: "100vh", background: "#EDF0F2" }}>
      <nav
        style={{
          display: "flex",
          gap: 8,
          alignItems: "baseline",
          flexWrap: "wrap",
          padding: "10px 16px",
          borderBottom: "1px solid #C9D2D8",
          background: "#F7F9FA",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span style={{ fontWeight: 700, color: "#1F2A33", marginRight: 8, fontSize: 14 }}>
          APP Plus Quality Reporting
        </span>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              border: `1px solid ${t.id === tab ? "#1F2A33" : "#C9D2D8"}`,
              background: t.id === tab ? "#1F2A33" : "transparent",
              color: t.id === tab ? "#F7F9FA" : "#5B6B77",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <active.Component />
    </div>
  );
}
