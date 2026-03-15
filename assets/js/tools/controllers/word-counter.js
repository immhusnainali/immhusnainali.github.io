import { el } from "../shared/dom.js";
import { copyText } from "../shared/download.js";
import { setStatus } from "../shared/messages.js";

function getMetrics(text) {
  const value = String(text || "");
  const trimmed = value.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const characters = value.length;
  const charactersNoSpaces = value.replace(/\s/g, "").length;
  const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;
  const readingMinutes = words > 0 ? Math.max(1, Math.ceil(words / 200)) : 0;

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingMinutes,
  };
}

export function mountTool(context) {
  const { root, uiCopy, statusEl } = context;

  const textarea = el("textarea", {
    className: "tool-textarea",
    attrs: {
      placeholder: "Paste or type text here...",
      "aria-label": "Text input",
    },
  });
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

  const metricsGrid = el("div", { className: "metrics-grid" });
  const metricNodes = {};

  [
    ["words", uiCopy.common.words],
    ["characters", uiCopy.common.characters],
    ["charactersNoSpaces", uiCopy.common.charactersNoSpaces],
    ["sentences", uiCopy.common.sentences],
    ["paragraphs", uiCopy.common.paragraphs],
    ["readingMinutes", uiCopy.common.readingTime],
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
    metricNodes.words.textContent = String(metrics.words);
    metricNodes.characters.textContent = String(metrics.characters);
    metricNodes.charactersNoSpaces.textContent = String(metrics.charactersNoSpaces);
    metricNodes.sentences.textContent = String(metrics.sentences);
    metricNodes.paragraphs.textContent = String(metrics.paragraphs);
    metricNodes.readingMinutes.textContent =
      metrics.readingMinutes > 0 ? metrics.readingMinutes + " min" : "0 min";
  }

  textarea.addEventListener("input", renderMetrics);
  clearButton.addEventListener("click", () => {
    textarea.value = "";
    renderMetrics();
    setStatus(statusEl, "info", uiCopy.common.ready);
  });
  copyButton.addEventListener("click", async () => {
    if (!textarea.value.trim()) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    await copyText(textarea.value);
    setStatus(statusEl, "success", uiCopy.common.copied);
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
