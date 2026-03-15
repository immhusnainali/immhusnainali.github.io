import { el } from "../shared/dom.js";
import { copyText } from "../shared/download.js";
import { setStatus } from "../shared/messages.js";

function getMetrics(text) {
  const value = String(text || "");
  const trimmed = value.trim();

  return {
    characters: value.length,
    charactersNoSpaces: value.replace(/\s/g, "").length,
    words: trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0,
    lines: value ? value.split(/\r?\n/).length : 0,
    bytes: new TextEncoder().encode(value).length,
  };
}

export function mountTool(context) {
  const { root, statusEl, uiCopy } = context;
  const textarea = el("textarea", {
    className: "tool-textarea",
    attrs: {
      placeholder: "Paste or type text here...",
      "aria-label": "Text input",
    },
  });

  const metricsGrid = el("div", { className: "metrics-grid" });
  const metricNodes = {};
  [
    ["characters", uiCopy.common.characters],
    ["charactersNoSpaces", uiCopy.common.charactersNoSpaces],
    ["words", uiCopy.common.words],
    ["lines", "Lines"],
    ["bytes", "Bytes"],
  ].forEach(([key, label]) => {
    const valueNode = el("strong", { text: "0" });
    metricNodes[key] = valueNode;
    metricsGrid.appendChild(
      el("article", { className: "metric-card" }, [
        el("span", { className: "tool-meta", text: label }),
        valueNode,
      ])
    );
  });

  function renderMetrics() {
    const metrics = getMetrics(textarea.value);
    Object.entries(metricNodes).forEach(([key, node]) => {
      node.textContent = String(metrics[key]);
    });
  }

  const copyButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.copy,
  });
  const clearButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.clear,
  });

  textarea.addEventListener("input", renderMetrics);
  copyButton.addEventListener("click", async () => {
    if (!textarea.value) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    await copyText(textarea.value);
    setStatus(statusEl, "success", uiCopy.common.copied);
  });
  clearButton.addEventListener("click", () => {
    textarea.value = "";
    renderMetrics();
    setStatus(statusEl, "info", uiCopy.common.ready);
  });

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      el("div", { className: "tool-action-row" }, [copyButton, clearButton]),
      textarea,
      metricsGrid,
    ])
  );

  renderMetrics();
}
