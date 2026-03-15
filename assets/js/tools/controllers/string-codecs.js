import { el } from "../shared/dom.js";
import { copyText, downloadTextFile } from "../shared/download.js";
import { setStatus } from "../shared/messages.js";

const TOOL_CONFIG = {
  "base64-encode-decode": {
    encodeLabel: "Encode to Base64",
    decodeLabel: "Decode Base64",
    downloadName: "base64-result.txt",
    encode(value) {
      const bytes = new TextEncoder().encode(value);
      let binary = "";

      for (let index = 0; index < bytes.length; index += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
      }

      return btoa(binary);
    },
    decode(value) {
      const normalized = String(value || "")
        .trim()
        .replace(/\s+/g, "")
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const padding =
        normalized.length % 4 === 0
          ? ""
          : "=".repeat(4 - (normalized.length % 4));
      const binary = atob(normalized + padding);
      const bytes = new Uint8Array(binary.length);

      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }

      return new TextDecoder().decode(bytes);
    },
  },
  "url-encode-decode": {
    encodeLabel: "URL encode",
    decodeLabel: "URL decode",
    downloadName: "url-result.txt",
    encode(value) {
      return encodeURIComponent(value);
    },
    decode(value) {
      return decodeURIComponent(value);
    },
  },
};

export function mountTool(context) {
  const { root, statusEl, uiCopy, tool } = context;
  const config = TOOL_CONFIG[tool.id] || TOOL_CONFIG["base64-encode-decode"];

  const input = el("textarea", {
    className: "tool-textarea",
    attrs: {
      placeholder: "Paste text here...",
      "aria-label": "Input text",
    },
  });
  const output = el("textarea", {
    className: "tool-output",
    attrs: {
      readonly: "readonly",
      "aria-label": "Output text",
    },
  });

  function runTransform(action) {
    if (!input.value.trim()) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    try {
      output.value = config[action](input.value);
      setStatus(statusEl, "success", uiCopy.common.generated);
    } catch (error) {
      setStatus(
        statusEl,
        "error",
        error.message || "The input could not be converted with the selected action."
      );
    }
  }

  const encodeButton = el("button", {
    className: "tool-button",
    type: "button",
    text: config.encodeLabel,
  });
  const decodeButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: config.decodeLabel,
  });
  const swapButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: "Swap",
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

  encodeButton.addEventListener("click", () => runTransform("encode"));
  decodeButton.addEventListener("click", () => runTransform("decode"));
  swapButton.addEventListener("click", () => {
    const nextInput = output.value;
    output.value = input.value;
    input.value = nextInput;
    setStatus(statusEl, "info", "Input and output were swapped.");
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

    downloadTextFile(config.downloadName, output.value);
    setStatus(statusEl, "success", uiCopy.common.generated);
  });
  clearButton.addEventListener("click", () => {
    input.value = "";
    output.value = "";
    setStatus(statusEl, "info", uiCopy.common.ready);
  });

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      el("div", { className: "tool-action-row" }, [
        encodeButton,
        decodeButton,
        swapButton,
        copyButton,
        downloadButton,
        clearButton,
      ]),
      el("div", { className: "tool-form-grid" }, [input, output]),
    ])
  );
}
