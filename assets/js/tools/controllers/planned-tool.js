import { el } from "../shared/dom.js";

export function mountTool(context) {
  const { root, uiCopy } = context;
  const panel = el("section", { className: "planned-panel" }, [
    el("span", {
      className: "badge badge--planned",
      text: uiCopy.common.plannedLabel || "Planned",
    }),
    el("h2", { text: uiCopy.toolPage.plannedTitle }),
    el("p", { text: uiCopy.toolPage.plannedText }),
    el("p", { text: uiCopy.toolPage.plannedHint }),
  ]);

  root.appendChild(panel);
}
