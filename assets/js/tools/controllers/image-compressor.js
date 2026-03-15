import { el } from "../shared/dom.js";
import { createCanvas, canvasToBlob, detectTransparency } from "../shared/canvas.js";
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

const MAX_IMAGE_SIZE = 25 * 1024 * 1024;

function isSupportedImage(file) {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
}

function getFileKey(file) {
  return [file.name, file.size, file.lastModified].join(":");
}

function getOriginalExtension(file) {
  const type = file.type || "";
  if (type === "image/png") return ".png";
  if (type === "image/webp") return ".webp";
  return ".jpg";
}

function getOutputType(file, canvas) {
  if (file.type === "image/png" && detectTransparency(canvas)) {
    return "image/png";
  }
  if (file.type === "image/webp") {
    return "image/webp";
  }
  return "image/jpeg";
}

function getExtension(type) {
  if (type === "image/png") return ".png";
  if (type === "image/webp") return ".webp";
  return ".jpg";
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
  const qualityInput = el("input", {
    className: "tool-input",
    type: "range",
    value: "82",
    attrs: { min: "40", max: "95", step: "1" },
  });
  const qualityValue = el("span", { className: "tool-help", text: "82%" });
  const list = el("div", { className: "tool-file-list" });
  const results = el("div", { className: "tool-result-list" });

  function resetResults() {
    revokeResults(state.results);
    state.results = [];
    renderResults();
  }

  function syncResultActions() {
    downloadZipButton.disabled = !state.results.length;
  }

  function renderFiles() {
    list.innerHTML = "";
    state.files.forEach((file, index) => {
      list.appendChild(
        el("article", { className: "tool-list-card" }, [
          el("div", { className: "tool-list-card__row" }, [
            el("div", {}, [
              el("div", { className: "tool-file-name", text: file.name }),
              el("div", {
                className: "tool-meta",
                text: formatBytes(file.size),
              }),
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
        setStatus(
          statusEl,
          state.files.length ? "info" : "warning",
          state.files.length ? "Re-run the tool after changing the file list." : uiCopy.common.emptyInput
        );
      });
    });
  }

  function renderResults() {
    results.innerHTML = "";
    syncResultActions();

    state.results.forEach((item) => {
      const previewImage = el("img", {
        attrs: { src: item.previewUrl, alt: item.name },
      });

      const downloadButton = el("button", {
        className: "tool-button tool-button--ghost",
        type: "button",
        text: uiCopy.common.download,
      });
      downloadButton.addEventListener("click", () => {
        downloadBlob(item.outputName, item.blob);
      });

      results.appendChild(
        el("article", { className: "tool-result-card" }, [
          el("div", { className: "tool-result-card__row" }, [
            el("div", {}, [
              el("div", { className: "tool-file-name", text: item.outputName }),
              el("div", {
                className: "tool-meta",
                text:
                  uiCopy.common.original +
                  ": " +
                  formatBytes(item.originalSize) +
                  " | " +
                  uiCopy.common.output +
                  ": " +
                  formatBytes(item.blob.size) +
                  " | " +
                  item.savingsLabel,
              }),
            ]),
            downloadButton,
          ]),
          el("div", { className: "tool-preview-frame" }, [previewImage]),
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
      if (!isSupportedImage(file) || file.size > MAX_IMAGE_SIZE) {
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
        ? "Supported images were added. Some files were skipped because they were unsupported, duplicates, or too large."
        : uiCopy.common.filesAdded
    );
  }

  async function compressFile(file, quality) {
    const image = await loadImageFromFile(file);
    const canvas = createCanvas(image.naturalWidth, image.naturalHeight);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Unable to prepare the image for compression.");
    }

    ctx.drawImage(image, 0, 0);

    const outputType = getOutputType(file, canvas);
    const candidateBlob = await canvasToBlob(
      canvas,
      outputType,
      outputType === "image/png" ? undefined : quality
    );
    const blob = candidateBlob.size > file.size ? file : candidateBlob;
    const finalType = blob.type || outputType || file.type;
    const outputName =
      blob === file
        ? sanitizeFileName(file.name) + getOriginalExtension(file)
        : sanitizeFileName(file.name) + "-compressed" + getExtension(finalType);
    const savings = Math.max(0, file.size - blob.size);
    const savingsLabel =
      savings > 0
        ? formatBytes(savings) + " saved"
        : "Already near the smallest practical size";

    return {
      name: file.name,
      originalSize: file.size,
      outputName,
      blob,
      savingsLabel,
      previewUrl: URL.createObjectURL(blob),
    };
  }

  async function processImages() {
    if (!state.files.length) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    setStatus(statusEl, "info", uiCopy.common.processing);
    resetResults();
    const failedFiles = [];
    const quality = Number(qualityInput.value) / 100;

    for (const file of state.files) {
      try {
        state.results.push(await compressFile(file, quality));
      } catch (error) {
        failedFiles.push(file.name);
      }
    }

    renderResults();
    if (!state.results.length) {
      setStatus(statusEl, "error", "We could not compress the selected images. Try smaller or different files.");
      return;
    }

    setStatus(
      statusEl,
      failedFiles.length ? "warning" : "success",
      failedFiles.length
        ? "Some images could not be compressed, but the working files are ready to download."
        : uiCopy.common.generated
    );
  }

  const processButton = el("button", {
    className: "tool-button",
    type: "button",
    text: uiCopy.common.compressImagesAction,
  });
  const downloadZipButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.downloadZip,
    disabled: true,
  });

  processButton.addEventListener("click", processImages);
  downloadZipButton.addEventListener("click", async () => {
    if (!state.results.length) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    try {
      await downloadZip(
        state.results.map((item) => ({
          name: item.outputName,
          data: item.blob,
        })),
        "compressed-images.zip"
      );
      setStatus(statusEl, "success", "ZIP download is ready.");
    } catch (error) {
      setStatus(statusEl, "error", error.message || "Unable to build the ZIP archive right now.");
    }
  });

  qualityInput.addEventListener("input", () => {
    qualityValue.textContent = qualityInput.value + "%";
    if (state.results.length) {
      setStatus(statusEl, "info", "Quality updated. Run compression again to refresh the results.");
    }
  });

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      createFileDropzone({
        input: fileInput,
        iconClass: "bx-cloud-upload",
        title: uiCopy.common.uploadImages,
        hint: "Supports JPG, PNG, and WebP up to 25 MB each.",
        buttonText: uiCopy.common.chooseFiles,
        onFilesSelected: addFiles,
      }),
      el("label", { className: "tool-field-group" }, [
        el("span", { className: "tool-label", text: uiCopy.common.quality }),
        qualityInput,
        qualityValue,
      ]),
      el("div", { className: "tool-action-row" }, [processButton, downloadZipButton]),
      list,
      results,
    ])
  );

  syncResultActions();
}
