import { el } from "../shared/dom.js";
import { copyText, downloadTextFile } from "../shared/download.js";
import { setStatus } from "../shared/messages.js";

function createUuid() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (value) =>
    value.toString(16).padStart(2, "0")
  );

  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

export function mountTool(context) {
  const { root, statusEl, uiCopy } = context;
  const countInput = el("input", {
    className: "tool-input",
    type: "number",
    value: "5",
    attrs: { min: "1", max: "50" },
  });
  const output = el("textarea", {
    className: "tool-output",
    attrs: { readonly: "readonly", "aria-label": "UUID output" },
  });

  function generate() {
    const count = Math.max(1, Math.min(50, Number(countInput.value) || 5));
    output.value = Array.from({ length: count }, () => createUuid()).join("\n");
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

  generateButton.addEventListener("click", generate);
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

    downloadTextFile("uuid-list.txt", output.value);
    setStatus(statusEl, "success", uiCopy.common.generated);
  });

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      el("div", { className: "tool-form-grid" }, [
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: "How many UUIDs" }),
          countInput,
        ]),
      ]),
      el("div", { className: "tool-action-row" }, [
        generateButton,
        copyButton,
        downloadButton,
      ]),
      output,
    ])
  );

  generate();
}
