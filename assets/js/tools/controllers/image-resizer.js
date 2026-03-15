import { el } from "../shared/dom.js";
import { createCanvas, canvasToBlob } from "../shared/canvas.js";
import { downloadBlob } from "../shared/download.js";
import { createFileDropzone } from "../shared/file-dropzone.js";
import {
  formatBytes,
  loadImageFromFile,
  sanitizeFileName,
  toFileArray,
} from "../shared/files.js";
import { setStatus } from "../shared/messages.js";
import { downloadZip } from "../shared/zip.js";

const PRESETS = {
  original: { width: 0, height: 0 },
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
  thumbnail: { width: 400, height: 225 },
  custom: { width: 0, height: 0 },
};

function isSupportedImage(file) {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
}

function getFileKey(file) {
  return [file.name, file.size, file.lastModified].join(":");
}

function getOutputMime(file, format) {
  if (format === "original") return file.type || "image/png";
  if (format === "png") return "image/png";
  if (format === "webp") return "image/webp";
  return "image/jpeg";
}

function revokeResults(results) {
  results.forEach((item) => {
    if (item && item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }
  });
}

export function mountTool(context) {
  const { root, uiCopy, statusEl } = context;
  const state = {
    files: [],
    results: [],
  };

  const fileInput = el("input", {
    type: "file",
    attrs: { accept: "image/jpeg,image/png,image/webp", multiple: "multiple", hidden: "hidden" },
  });
  const presetSelect = el("select", { className: "tool-select" });
  [
    ["original", "Original"],
    ["square", "1080 x 1080"],
    ["story", "1080 x 1920"],
    ["thumbnail", "400 x 225"],
    ["custom", "Custom"],
  ].forEach(([value, text]) => {
    presetSelect.appendChild(el("option", { value, text }));
  });
  presetSelect.value = "custom";

  const widthInput = el("input", {
    className: "tool-input",
    type: "number",
    value: "1200",
    attrs: { min: "1" },
  });
  const heightInput = el("input", {
    className: "tool-input",
    type: "number",
    value: "800",
    attrs: { min: "1" },
  });
  const formatSelect = el("select", { className: "tool-select" });
  [
    ["original", uiCopy.common.originalFormat],
    ["jpg", uiCopy.common.jpg],
    ["png", uiCopy.common.png],
    ["webp", uiCopy.common.webp],
  ].forEach(([value, text]) => {
    formatSelect.appendChild(el("option", { value, text }));
  });
  const lockRatio = el("input", { type: "checkbox", checked: true });
  const list = el("div", { className: "tool-file-list" });
  const results = el("div", { className: "tool-result-list" });

  function resetResults() {
    revokeResults(state.results);
    state.results = [];
    renderResults();
  }

  function syncResultActions() {
    zipButton.disabled = !state.results.length;
  }

  function renderFiles() {
    list.innerHTML = "";
    state.files.forEach((file, index) => {
      list.appendChild(
        el("article", { className: "tool-list-card" }, [
          el("div", { className: "tool-list-card__row" }, [
            el("div", {}, [
              el("div", { className: "tool-file-name", text: file.name }),
              el("div", { className: "tool-meta", text: formatBytes(file.size) }),
            ]),
            el("button", {
              className: "tool-mini-button",
              type: "button",
              text: uiCopy.common.remove,
              attrs: { "data-index": String(index) },
            }),
          ]),
        ])
      );
    });

    list.querySelectorAll("[data-index]").forEach((button) => {
      button.addEventListener("click", () => {
        state.files.splice(Number(button.dataset.index), 1);
        resetResults();
        renderFiles();
      });
    });
  }

  function getTargetSize(image) {
    const preset = PRESETS[presetSelect.value] || PRESETS.custom;
    let targetWidth = preset.width || Number(widthInput.value) || image.naturalWidth;
    let targetHeight = preset.height || Number(heightInput.value) || image.naturalHeight;

    if (presetSelect.value === "original") {
      targetWidth = image.naturalWidth;
      targetHeight = image.naturalHeight;
    } else if (lockRatio.checked) {
      const ratio = image.naturalWidth / image.naturalHeight;
      if (targetWidth && (!PRESETS[presetSelect.value].height || presetSelect.value === "custom")) {
        targetHeight = Math.round(targetWidth / ratio);
      } else if (targetHeight) {
        targetWidth = Math.round(targetHeight * ratio);
      }
    }

    return {
      width: Math.max(1, Math.round(targetWidth)),
      height: Math.max(1, Math.round(targetHeight)),
    };
  }

  function renderResults() {
    results.innerHTML = "";
    syncResultActions();
    state.results.forEach((item) => {
      const image = el("img", { attrs: { src: item.previewUrl, alt: item.outputName } });
      const button = el("button", {
        className: "tool-button tool-button--ghost",
        type: "button",
        text: uiCopy.common.download,
      });
      button.addEventListener("click", () => downloadBlob(item.outputName, item.blob));

      results.appendChild(
        el("article", { className: "tool-result-card" }, [
          el("div", { className: "tool-result-card__row" }, [
            el("div", {}, [
              el("div", { className: "tool-file-name", text: item.outputName }),
              el("div", {
                className: "tool-meta",
                text:
                  item.width +
                  " x " +
                  item.height +
                  " | " +
                  uiCopy.common.output +
                  ": " +
                  formatBytes(item.blob.size),
              }),
            ]),
            button,
          ]),
          el("div", { className: "tool-preview-frame" }, [image]),
        ])
      );
    });
  }

  function addFiles(fileList) {
    const files = toFileArray(fileList);
    const existing = new Set(state.files.map(getFileKey));
    const supportedFiles = [];
    let skippedCount = 0;

    files.forEach((file) => {
      if (!isSupportedImage(file)) {
        skippedCount += 1;
        return;
      }

      const key = getFileKey(file);
      if (existing.has(key)) {
        skippedCount += 1;
        return;
      }

      existing.add(key);
      supportedFiles.push(file);
    });

    if (!supportedFiles.length) {
      setStatus(
        statusEl,
        "warning",
        "Add JPG, PNG, or WebP files that have not already been added to the queue."
      );
      return;
    }

    state.files.push(...supportedFiles);
    resetResults();
    renderFiles();
    setStatus(
      statusEl,
      skippedCount ? "warning" : "success",
      skippedCount
        ? "Supported images were added. Some files were skipped because they were unsupported or duplicates."
        : uiCopy.common.filesAdded
    );
  }

  async function resizeImages() {
    if (!state.files.length) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    setStatus(statusEl, "info", uiCopy.common.processing);
    resetResults();
    const failedFiles = [];

    for (const file of state.files) {
      try {
        const image = await loadImageFromFile(file);
        const { width, height } = getTargetSize(image);
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Unable to prepare the image for resizing.");
        }
        ctx.drawImage(image, 0, 0, width, height);
        const mime = getOutputMime(file, formatSelect.value);
        const blob = await canvasToBlob(canvas, mime, mime === "image/png" ? undefined : 0.9);
        const extension = mime === "image/png" ? ".png" : mime === "image/webp" ? ".webp" : ".jpg";
        state.results.push({
          outputName: sanitizeFileName(file.name) + "-resized" + extension,
          blob,
          width,
          height,
          previewUrl: URL.createObjectURL(blob),
        });
      } catch (error) {
        failedFiles.push(file.name);
      }
    }

    renderResults();
    if (!state.results.length) {
      setStatus(statusEl, "error", "We could not resize the selected images.");
      return;
    }

    setStatus(
      statusEl,
      failedFiles.length ? "warning" : "success",
      failedFiles.length
        ? "Some images could not be resized, but the rest are ready."
        : uiCopy.common.generated
    );
  }

  const resizeButton = el("button", {
    className: "tool-button",
    type: "button",
    text: uiCopy.common.resizeImagesAction,
  });
  const zipButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.downloadZip,
    disabled: true,
  });

  resizeButton.addEventListener("click", resizeImages);
  zipButton.addEventListener("click", async () => {
    if (!state.results.length) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    try {
      await downloadZip(
        state.results.map((item) => ({ name: item.outputName, data: item.blob })),
        "resized-images.zip"
      );
      setStatus(statusEl, "success", "ZIP download is ready.");
    } catch (error) {
      setStatus(statusEl, "error", error.message || "Unable to build the ZIP archive right now.");
    }
  });

  presetSelect.addEventListener("change", () => {
    const preset = PRESETS[presetSelect.value];
    if (preset && preset.width && preset.height) {
      widthInput.value = String(preset.width);
      heightInput.value = String(preset.height);
    }
    if (state.results.length) {
      setStatus(statusEl, "info", "Preset updated. Run resizing again to refresh the results.");
    }
  });

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      createFileDropzone({
        input: fileInput,
        iconClass: "bx-image-add",
        title: uiCopy.common.uploadImages,
        hint: "Resize JPG, PNG, and WebP files locally.",
        buttonText: uiCopy.common.chooseFiles,
        onFilesSelected: addFiles,
      }),
      el("div", { className: "tool-form-grid" }, [
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: uiCopy.common.presetLabel }),
          presetSelect,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: uiCopy.common.width }),
          widthInput,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: uiCopy.common.height }),
          heightInput,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: uiCopy.common.formatLabel }),
          formatSelect,
        ]),
      ]),
      el("label", { className: "tool-checkbox" }, [lockRatio, uiCopy.common.lockRatio]),
      el("div", { className: "tool-action-row" }, [resizeButton, zipButton]),
      list,
      results,
    ])
  );

  syncResultActions();
}
