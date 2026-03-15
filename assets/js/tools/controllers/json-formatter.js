import { el } from "../shared/dom.js";
import { copyText, downloadBlob } from "../shared/download.js";
import { readAsText } from "../shared/files.js";
import { setStatus } from "../shared/messages.js";

function stringifyJson(input, indent) {
  return JSON.stringify(JSON.parse(input), null, indent);
}

export function mountTool(context) {
  const { root, uiCopy, statusEl } = context;

  const input = el("textarea", {
    className: "tool-textarea",
    attrs: {
      placeholder: '{\n  "name": "Browser Tools Hub"\n}',
      "aria-label": "JSON input",
    },
  });
  const output = el("textarea", {
    className: "tool-output",
    attrs: {
      readonly: "readonly",
      "aria-label": "JSON output",
    },
  });
  const fileInput = el("input", {
    type: "file",
    attrs: { accept: ".json,application/json", hidden: "hidden" },
  });

  function updateOutput(nextValue, message) {
    output.value = nextValue;
    if (message) {
      setStatus(statusEl, "success", message);
    }
  }

  const formatButton = el("button", {
    className: "tool-button",
    type: "button",
    text: uiCopy.common.format,
  });
  const minifyButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.minify,
  });
  const validateButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.validate,
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
  const uploadButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.chooseFile,
  });

  formatButton.addEventListener("click", () => {
    try {
      updateOutput(stringifyJson(input.value, 2), uiCopy.common.generated);
    } catch (error) {
      setStatus(statusEl, "error", error.message || uiCopy.common.invalidJson);
    }
  });
  minifyButton.addEventListener("click", () => {
    try {
      updateOutput(stringifyJson(input.value, 0), uiCopy.common.generated);
    } catch (error) {
      setStatus(statusEl, "error", error.message || uiCopy.common.invalidJson);
    }
  });
  validateButton.addEventListener("click", () => {
    try {
      JSON.parse(input.value);
      setStatus(statusEl, "success", "JSON is valid.");
    } catch (error) {
      setStatus(statusEl, "error", error.message || uiCopy.common.invalidJson);
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

    downloadBlob(
      "formatted.json",
      new Blob([output.value], { type: "application/json;charset=utf-8" })
    );
    setStatus(statusEl, "success", uiCopy.common.generated);
  });
  uploadButton.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      return;
    }

    try {
      input.value = await readAsText(file);
      setStatus(statusEl, "success", uiCopy.common.filesAdded);
    } catch (error) {
      setStatus(statusEl, "error", error.message || uiCopy.common.invalidFile);
    } finally {
      fileInput.value = "";
    }
  });

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      fileInput,
      el("div", { className: "tool-action-row" }, [
        uploadButton,
        validateButton,
        formatButton,
        minifyButton,
        copyButton,
        downloadButton,
      ]),
      el("div", { className: "tool-form-grid" }, [input, output]),
    ])
  );
}
