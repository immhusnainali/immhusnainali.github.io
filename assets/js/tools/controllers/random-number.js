import { el } from "../shared/dom.js";
import { copyText, downloadTextFile } from "../shared/download.js";
import { setStatus } from "../shared/messages.js";

function getRandomUint32() {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0];
}

function randomInt(min, max) {
  const range = max - min + 1;
  if (range <= 0) {
    throw new Error("The maximum value must be greater than the minimum value.");
  }

  const limit = 0xffffffff - ((0xffffffff + 1) % range);
  let value = getRandomUint32();
  while (value > limit) {
    value = getRandomUint32();
  }

  return min + (value % range);
}

function randomFloat(min, max, decimals) {
  const fraction = getRandomUint32() / 0x100000000;
  return (min + (max - min) * fraction).toFixed(decimals);
}

export function mountTool(context) {
  const { root, statusEl, uiCopy } = context;
  const minInput = el("input", {
    className: "tool-input",
    type: "number",
    value: "1",
  });
  const maxInput = el("input", {
    className: "tool-input",
    type: "number",
    value: "100",
  });
  const countInput = el("input", {
    className: "tool-input",
    type: "number",
    value: "10",
    attrs: { min: "1", max: "100" },
  });
  const decimalsInput = el("input", {
    className: "tool-input",
    type: "number",
    value: "0",
    attrs: { min: "0", max: "6" },
  });
  const integerOnly = el("input", {
    type: "checkbox",
    checked: true,
  });
  const uniqueOnly = el("input", {
    type: "checkbox",
  });
  const output = el("textarea", {
    className: "tool-output",
    attrs: {
      readonly: "readonly",
      "aria-label": "Random number output",
    },
  });

  const metricsGrid = el("div", { className: "metrics-grid" });
  const generatedCount = el("strong", { text: "0" });
  const minGenerated = el("strong", { text: "0" });
  const maxGenerated = el("strong", { text: "0" });

  [
    ["Generated", generatedCount],
    ["Lowest result", minGenerated],
    ["Highest result", maxGenerated],
  ].forEach(([label, node]) => {
    metricsGrid.appendChild(
      el("article", { className: "metric-card" }, [
        el("span", { className: "tool-meta", text: label }),
        node,
      ])
    );
  });

  function updateSummary(values) {
    generatedCount.textContent = String(values.length);
    minGenerated.textContent = values.length ? String(Math.min(...values)) : "0";
    maxGenerated.textContent = values.length ? String(Math.max(...values)) : "0";
  }

  function generateValues() {
    const min = Number(minInput.value);
    const max = Number(maxInput.value);
    const count = Math.max(1, Math.min(100, Number(countInput.value) || 10));
    const decimals = Math.max(0, Math.min(6, Number(decimalsInput.value) || 0));

    if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
      throw new Error("Use a valid minimum and maximum range.");
    }

    if (!integerOnly.checked && uniqueOnly.checked) {
      throw new Error("Unique decimal generation is not supported.");
    }

    const integerMin = Math.ceil(min);
    const integerMax = Math.floor(max);
    if (
      integerOnly.checked &&
      uniqueOnly.checked &&
      count > integerMax - integerMin + 1
    ) {
      throw new Error("The selected range is too small for unique integer results.");
    }

    const values = [];
    const seen = new Set();

    while (values.length < count) {
      const nextValue = integerOnly.checked
        ? randomInt(integerMin, integerMax)
        : Number(randomFloat(min, max, decimals));
      const key = integerOnly.checked ? String(nextValue) : String(nextValue);

      if (uniqueOnly.checked && seen.has(key)) {
        continue;
      }

      seen.add(key);
      values.push(nextValue);
    }

    output.value = values.join("\n");
    updateSummary(values);
    setStatus(statusEl, "success", uiCopy.common.generated);
  }

  const generateButton = el("button", {
    className: "tool-button",
    type: "button",
    text: uiCopy.common.generate,
  });
  const copyButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.copy,
  });
  const downloadButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.download,
  });
  const clearButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.clear,
  });

  integerOnly.addEventListener("change", () => {
    decimalsInput.disabled = integerOnly.checked;
    if (!integerOnly.checked) {
      uniqueOnly.checked = false;
    }
    uniqueOnly.disabled = !integerOnly.checked;
  });
  generateButton.addEventListener("click", () => {
    try {
      generateValues();
    } catch (error) {
      setStatus(statusEl, "error", error.message || "Random number generation failed.");
    }
  });
  copyButton.addEventListener("click", async () => {
    if (!output.value) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    await copyText(output.value);
    setStatus(statusEl, "success", uiCopy.common.copied);
  });
  downloadButton.addEventListener("click", () => {
    if (!output.value) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    downloadTextFile("random-numbers.txt", output.value);
    setStatus(statusEl, "success", uiCopy.common.generated);
  });
  clearButton.addEventListener("click", () => {
    output.value = "";
    updateSummary([]);
    setStatus(statusEl, "info", uiCopy.common.ready);
  });

  decimalsInput.disabled = true;
  uniqueOnly.disabled = false;

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      el("div", { className: "tool-form-grid" }, [
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: "Minimum" }),
          minInput,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: "Maximum" }),
          maxInput,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: "How many values" }),
          countInput,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: "Decimal places" }),
          decimalsInput,
        ]),
      ]),
      el("div", { className: "tool-form-grid" }, [
        el("label", { className: "tool-checkbox" }, [
          integerOnly,
          "Integers only",
        ]),
        el("label", { className: "tool-checkbox" }, [
          uniqueOnly,
          "Unique values",
        ]),
      ]),
      el("div", { className: "tool-action-row" }, [
        generateButton,
        copyButton,
        downloadButton,
        clearButton,
      ]),
      output,
      metricsGrid,
    ])
  );

  generateValues();
}
