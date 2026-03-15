import { el } from "../shared/dom.js";
import { copyText, downloadTextFile } from "../shared/download.js";
import { setStatus } from "../shared/messages.js";

const TOKEN_SETS = {
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  hex: "0123456789abcdef",
  numeric: "0123456789",
  base64url: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
};

function randomString(length, alphabet) {
  const charset = Array.from(new Set(String(alphabet || "").split("")));
  if (!charset.length) {
    throw new Error("Add at least one unique character to build a token.");
  }

  const result = [];
  const limit = 256 - (256 % charset.length);

  while (result.length < length) {
    const buffer = new Uint8Array(Math.max(16, length * 2));
    crypto.getRandomValues(buffer);

    buffer.forEach((value) => {
      if (result.length >= length || value >= limit) {
        return;
      }

      result.push(charset[value % charset.length]);
    });
  }

  return result.join("");
}

export function mountTool(context) {
  const { root, statusEl, uiCopy } = context;
  const modeSelect = el("select", { className: "tool-select" });
  const lengthInput = el("input", {
    className: "tool-input",
    type: "number",
    value: "32",
    attrs: { min: "4", max: "256" },
  });
  const countInput = el("input", {
    className: "tool-input",
    type: "number",
    value: "5",
    attrs: { min: "1", max: "20" },
  });
  const customCharset = el("input", {
    className: "tool-input",
    value: "ABCDEF0123456789",
    attrs: {
      placeholder: "Custom characters",
      "aria-label": "Custom character set",
    },
  });
  const output = el("textarea", {
    className: "tool-output",
    attrs: {
      readonly: "readonly",
      "aria-label": "Generated token output",
    },
  });

  [
    ["alphanumeric", "Alphanumeric"],
    ["hex", "Hex"],
    ["base64url", "Base64 URL-safe"],
    ["numeric", "Numbers only"],
    ["custom", "Custom character set"],
  ].forEach(([value, text]) => {
    modeSelect.appendChild(el("option", { value, text }));
  });

  function getAlphabet() {
    return modeSelect.value === "custom"
      ? customCharset.value
      : TOKEN_SETS[modeSelect.value];
  }

  function generateTokens() {
    const length = Math.max(4, Math.min(256, Number(lengthInput.value) || 32));
    const count = Math.max(1, Math.min(20, Number(countInput.value) || 5));
    const alphabet = getAlphabet();

    output.value = Array.from({ length: count }, () =>
      randomString(length, alphabet)
    ).join("\n");
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

  modeSelect.addEventListener("change", () => {
    customCharset.disabled = modeSelect.value !== "custom";
  });
  generateButton.addEventListener("click", () => {
    try {
      generateTokens();
    } catch (error) {
      setStatus(statusEl, "error", error.message || "Token generation failed.");
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

    downloadTextFile("random-tokens.txt", output.value);
    setStatus(statusEl, "success", uiCopy.common.generated);
  });
  clearButton.addEventListener("click", () => {
    output.value = "";
    setStatus(statusEl, "info", uiCopy.common.ready);
  });

  customCharset.disabled = true;

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      el("div", { className: "tool-form-grid" }, [
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: "Mode" }),
          modeSelect,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: "Token length" }),
          lengthInput,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: "How many tokens" }),
          countInput,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: "Custom character set" }),
          customCharset,
        ]),
      ]),
      el("div", { className: "tool-action-row" }, [
        generateButton,
        copyButton,
        downloadButton,
        clearButton,
      ]),
      output,
    ])
  );

  generateTokens();
}
