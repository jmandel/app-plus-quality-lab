import { createRoot } from "react-dom/client";
import AppPlusPathwayLab from "./PathwayLab";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("missing #root element");
createRoot(rootEl).render(<AppPlusPathwayLab />);
