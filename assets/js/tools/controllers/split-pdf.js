import { el } from "../shared/dom.js";
import { downloadBlob } from "../shared/download.js";
import { createFileDropzone } from "../shared/file-dropzone.js";
import {
  hasExtension,
  parseRangeTokens,
  readAsArrayBuffer,
  sanitizeFileName,
} from "../shared/files.js";
import { setStatus } from "../shared/messages.js";
import { loadVendorLibs } from "../shared/vendor-loader.js";
import { downloadZip } from "../shared/zip.js";

function isPdfFile(file) {
  return file && (file.type === "application/pdf" || hasExtension(file.name, [".pdf"]));
}

export function mountTool(context) {
  const { root, uiCopy, statusEl } = context;
  const fileInput = el("input", {
    type: "file",
    attrs: { accept: "application/pdf,.pdf", hidden: "hidden" },
  });
  const rangeInput = el("input", {
    className: "tool-input",
    value: "1-2",
    attrs: { placeholder: "1-3, 5, 7-8" },
  });
  const modeSelect = el("select", { className: "tool-select" });
  [
    ["ranges", uiCopy.common.ranges],
    ["per-page", uiCopy.common.perPage],
  ].forEach(([value, text]) => modeSelect.appendChild(el("option", { value, text })));
  const fileCard = el("div", { className: "tool-file-list" });
  const thumbs = el("div", { className: "tool-thumbs-grid" });
  const state = {
    file: null,
    bytes: null,
    pageCount: 0,
  };

  function resetSelectedFile() {
    state.file = null;
    state.bytes = null;
    state.pageCount = 0;
    fileCard.innerHTML = "";
    thumbs.innerHTML = "";
  }

  async function renderThumbs() {
    thumbs.innerHTML = "";
    if (!state.bytes) {
      return;
    }

    const { pdfjs } = await loadVendorLibs(["pdfjs"]);
    const documentTask = pdfjs.getDocument({ data: state.bytes.slice(0) });
    const pdf = await documentTask.promise;
    const previewLimit = Math.min(pdf.numPages, 18);

    for (let index = 1; index <= previewLimit; index += 1) {
      const page = await pdf.getPage(index);
      const viewport = page.getViewport({ scale: 0.35 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      thumbs.appendChild(
        el("article", { className: "tool-thumb" }, [
          el("div", { className: "tool-thumb__canvas" }, [canvas]),
          el("div", { className: "tool-meta", text: "Page " + index }),
        ])
      );
    }
  }

  function renderFileCard() {
    fileCard.innerHTML = "";
    if (!state.file) {
      return;
    }

    fileCard.appendChild(
      el("article", { className: "tool-list-card" }, [
        el("div", { className: "tool-file-name", text: state.file.name }),
        el("div", { className: "tool-meta", text: state.pageCount + " pages detected" }),
      ])
    );
  }

  async function handleFileSelection(fileList) {
    const file = fileList && fileList[0];
    if (!isPdfFile(file)) {
      resetSelectedFile();
      setStatus(statusEl, "warning", uiCopy.common.invalidFile);
      return;
    }

    try {
      const { "pdf-lib": PDFLib } = await loadVendorLibs(["pdf-lib"]);
      state.file = file;
      state.bytes = await readAsArrayBuffer(file);
      const doc = await PDFLib.PDFDocument.load(state.bytes);
      state.pageCount = doc.getPageCount();
      renderFileCard();
      await renderThumbs();
      setStatus(statusEl, "success", uiCopy.common.filesAdded);
    } catch (error) {
      resetSelectedFile();
      setStatus(statusEl, "error", error.message || "Unable to open this PDF.");
    }
  }

  const splitButton = el("button", {
    className: "tool-button",
    type: "button",
    text: uiCopy.common.splitPdfAction,
  });

  splitButton.addEventListener("click", async () => {
    if (!state.file || !state.bytes) {
      setStatus(statusEl, "warning", uiCopy.common.invalidFile);
      return;
    }

    setStatus(statusEl, "info", uiCopy.common.processing);

    try {
      const { "pdf-lib": PDFLib } = await loadVendorLibs(["pdf-lib"]);
      const sourcePdf = await PDFLib.PDFDocument.load(state.bytes.slice(0));
      const groups =
        modeSelect.value === "per-page"
          ? Array.from({ length: state.pageCount }, (_, index) => ({
              label: "page-" + (index + 1),
              pages: [index + 1],
            }))
          : parseRangeTokens(rangeInput.value, state.pageCount).groups;

      if (!groups.length) {
        const parsed = parseRangeTokens(rangeInput.value, state.pageCount);
        setStatus(statusEl, "warning", parsed.error || uiCopy.common.emptyInput);
        return;
      }

      const outputs = [];
      for (const group of groups) {
        const pdfDoc = await PDFLib.PDFDocument.create();
        const copiedPages = await pdfDoc.copyPages(
          sourcePdf,
          group.pages.map((page) => page - 1)
        );
        copiedPages.forEach((page) => pdfDoc.addPage(page));
        const bytes = await pdfDoc.save();
        outputs.push({
          name:
            sanitizeFileName(state.file.name, "split-pdf") +
            "-" +
            group.label +
            ".pdf",
          data: bytes,
        });
      }

      if (outputs.length === 1) {
        downloadBlob(outputs[0].name, new Blob([outputs[0].data], { type: "application/pdf" }));
      } else {
        await downloadZip(outputs, sanitizeFileName(state.file.name, "split-pdf") + "-split.zip");
      }

      setStatus(statusEl, "success", uiCopy.common.generated);
    } catch (error) {
      setStatus(statusEl, "error", error.message || "Unable to split this PDF.");
    }
  });

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      createFileDropzone({
        input: fileInput,
        iconClass: "bx-file",
        title: uiCopy.common.uploadOnePdf,
        hint: "Choose a PDF, preview its pages, then split by range or one page per file.",
        buttonText: uiCopy.common.chooseFile,
        onFilesSelected: handleFileSelection,
      }),
      fileCard,
      el("div", { className: "tool-form-grid" }, [
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: uiCopy.common.modeLabel }),
          modeSelect,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: uiCopy.common.ranges }),
          rangeInput,
        ]),
      ]),
      el("div", { className: "tool-action-row" }, [splitButton]),
      thumbs,
    ])
  );
}
