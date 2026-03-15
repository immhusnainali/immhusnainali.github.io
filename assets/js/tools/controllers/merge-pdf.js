import { el } from "../shared/dom.js";
import { downloadBlob } from "../shared/download.js";
import { createFileDropzone } from "../shared/file-dropzone.js";
import {
  formatBytes,
  hasExtension,
  readAsArrayBuffer,
  sanitizeFileName,
  toFileArray,
} from "../shared/files.js";
import { setStatus } from "../shared/messages.js";
import { loadVendorLib } from "../shared/vendor-loader.js";

function isPdfFile(file) {
  return file.type === "application/pdf" || hasExtension(file.name, [".pdf"]);
}

function getFileKey(file) {
  return [file.name, file.size, file.lastModified].join(":");
}

export async function mountTool(context) {
  const { root, uiCopy, statusEl } = context;
  const fileInput = el("input", {
    type: "file",
    attrs: { accept: "application/pdf,.pdf", multiple: "multiple", hidden: "hidden" },
  });
  const list = el("div", { className: "tool-file-list" });
  const state = { files: [] };

  function renderFiles() {
    list.innerHTML = "";

    state.files.forEach((file, index) => {
      const moveUp = el("button", {
        className: "tool-mini-button",
        type: "button",
        text: uiCopy.common.moveUp,
      });
      const moveDown = el("button", {
        className: "tool-mini-button",
        type: "button",
        text: uiCopy.common.moveDown,
      });
      const remove = el("button", {
        className: "tool-mini-button",
        type: "button",
        text: uiCopy.common.remove,
      });

      moveUp.addEventListener("click", () => {
        if (index === 0) return;
        const current = state.files[index];
        state.files[index] = state.files[index - 1];
        state.files[index - 1] = current;
        renderFiles();
      });
      moveDown.addEventListener("click", () => {
        if (index === state.files.length - 1) return;
        const current = state.files[index];
        state.files[index] = state.files[index + 1];
        state.files[index + 1] = current;
        renderFiles();
      });
      remove.addEventListener("click", () => {
        state.files.splice(index, 1);
        renderFiles();
      });

      list.appendChild(
        el("article", { className: "tool-list-card" }, [
          el("div", { className: "tool-list-card__row" }, [
            el("div", {}, [
              el("div", { className: "tool-file-name", text: file.name }),
              el("div", { className: "tool-meta", text: formatBytes(file.size) }),
            ]),
            el("div", { className: "tool-button-row" }, [moveUp, moveDown, remove]),
          ]),
        ])
      );
    });
  }

  function addFiles(fileList) {
    const existing = new Set(state.files.map(getFileKey));
    const files = toFileArray(fileList);
    const acceptedFiles = [];
    let skippedCount = 0;

    files.forEach((file) => {
      if (!isPdfFile(file)) {
        skippedCount += 1;
        return;
      }

      const key = getFileKey(file);
      if (existing.has(key)) {
        skippedCount += 1;
        return;
      }

      existing.add(key);
      acceptedFiles.push(file);
    });

    if (!acceptedFiles.length) {
      setStatus(statusEl, "warning", "Add PDF files that have not already been added to the merge queue.");
      return;
    }

    state.files.push(...acceptedFiles);
    renderFiles();
    setStatus(
      statusEl,
      skippedCount ? "warning" : "success",
      skippedCount
        ? "Supported PDF files were added. Some files were skipped because they were unsupported or duplicates."
        : uiCopy.common.filesAdded
    );
  }

  const mergeButton = el("button", {
    className: "tool-button",
    type: "button",
    text: uiCopy.common.mergePdfAction,
  });

  mergeButton.addEventListener("click", async () => {
    if (state.files.length < 2) {
      setStatus(statusEl, "warning", "Add at least two PDF files to merge.");
      return;
    }

    setStatus(statusEl, "info", uiCopy.common.processing);

    try {
      const PDFLib = await loadVendorLib("pdf-lib");
      const mergedPdf = await PDFLib.PDFDocument.create();

      for (const file of state.files) {
        const sourceBytes = await readAsArrayBuffer(file);
        const sourcePdf = await PDFLib.PDFDocument.load(sourceBytes);
        const copiedPages = await mergedPdf.copyPages(
          sourcePdf,
          sourcePdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const mergedName =
        sanitizeFileName(state.files[0].name, "merged-pdf") + "-merged.pdf";
      downloadBlob(
        mergedName,
        new Blob([mergedBytes], { type: "application/pdf" })
      );
      setStatus(statusEl, "success", uiCopy.common.generated);
    } catch (error) {
      setStatus(statusEl, "error", error.message || "Unable to merge the selected PDF files.");
    }
  });

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      createFileDropzone({
        input: fileInput,
        iconClass: "bx-cloud-upload",
        title: uiCopy.common.uploadPdf,
        hint: "Add multiple PDF files, then reorder them before merging.",
        buttonText: uiCopy.common.chooseFiles,
        onFilesSelected: addFiles,
      }),
      list,
      el("div", { className: "tool-action-row" }, [mergeButton]),
    ])
  );
}
