import { el } from "../shared/dom.js";
import { downloadBlob } from "../shared/download.js";
import { createFileDropzone } from "../shared/file-dropzone.js";
import {
  formatBytes,
  hasExtension,
  readAsArrayBuffer,
  sanitizeFileName,
} from "../shared/files.js";
import { setStatus } from "../shared/messages.js";
import { loadVendorLib } from "../shared/vendor-loader.js";

function isPdfFile(file) {
  return file && (file.type === "application/pdf" || hasExtension(file.name, [".pdf"]));
}

export function mountTool(context) {
  const { root, uiCopy, statusEl } = context;
  let activeFile = null;
  const fileInput = el("input", {
    type: "file",
    attrs: { accept: "application/pdf,.pdf", hidden: "hidden" },
  });
  const fileCard = el("div", { className: "tool-file-list" });
  const textInput = el("input", {
    className: "tool-input",
    value: "Confidential",
  });
  const sizeInput = el("input", {
    className: "tool-input",
    type: "number",
    value: "42",
    attrs: { min: "12", max: "96" },
  });
  const opacityInput = el("input", {
    className: "tool-input",
    type: "range",
    value: "0.22",
    attrs: { min: "0.08", max: "0.9", step: "0.02" },
  });
  const rotationInput = el("input", {
    className: "tool-input",
    type: "number",
    value: "-45",
    attrs: { min: "-180", max: "180" },
  });
  const placementSelect = el("select", { className: "tool-select" });
  [
    ["diagonal", uiCopy.common.diagonal],
    ["center", uiCopy.common.center],
    ["header", uiCopy.common.header],
    ["footer", uiCopy.common.footer],
  ].forEach(([value, text]) => placementSelect.appendChild(el("option", { value, text })));

  function renderFileCard() {
    fileCard.innerHTML = "";
    if (!activeFile) {
      return;
    }

    fileCard.appendChild(
      el("article", { className: "tool-list-card" }, [
        el("div", { className: "tool-file-name", text: activeFile.name }),
        el("div", { className: "tool-meta", text: formatBytes(activeFile.size) }),
      ])
    );
  }

  function resetActiveFile() {
    activeFile = null;
    fileCard.innerHTML = "";
  }

  function handleFileSelection(fileList) {
    const file = fileList && fileList[0];
    if (!isPdfFile(file)) {
      resetActiveFile();
      setStatus(statusEl, "warning", uiCopy.common.invalidFile);
      return;
    }
    activeFile = file;
    renderFileCard();
    setStatus(statusEl, "success", uiCopy.common.filesAdded);
  }

  const applyButton = el("button", {
    className: "tool-button",
    type: "button",
    text: uiCopy.common.watermarkAction,
  });

  applyButton.addEventListener("click", async () => {
    if (!activeFile) {
      setStatus(statusEl, "warning", uiCopy.common.invalidFile);
      return;
    }

    const watermarkText = textInput.value.trim();
    if (!watermarkText) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    setStatus(statusEl, "info", uiCopy.common.processing);

    try {
      const PDFLib = await loadVendorLib("pdf-lib");
      const { PDFDocument, StandardFonts, degrees, rgb } = PDFLib;
      const bytes = await readAsArrayBuffer(activeFile);
      const pdfDoc = await PDFDocument.load(bytes);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const size = Number(sizeInput.value) || 42;
      const opacity = Number(opacityInput.value) || 0.2;
      const rotation = Number(rotationInput.value) || 0;

      pdfDoc.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, size);
        let x = (width - textWidth) / 2;
        let y = height / 2;

        if (placementSelect.value === "header") {
          y = height - size * 1.8;
        } else if (placementSelect.value === "footer") {
          y = size * 1.4;
        } else if (placementSelect.value === "diagonal") {
          x = width * 0.16;
          y = height * 0.52;
        }

        page.drawText(watermarkText, {
          x,
          y,
          size,
          font,
          color: rgb(0.55, 0.62, 0.72),
          opacity,
          rotate: degrees(rotation),
        });
      });

      const outputBytes = await pdfDoc.save();
      downloadBlob(
        sanitizeFileName(activeFile.name, "watermarked-pdf") + "-watermarked.pdf",
        new Blob([outputBytes], { type: "application/pdf" })
      );
      setStatus(statusEl, "success", uiCopy.common.generated);
    } catch (error) {
      setStatus(statusEl, "error", error.message || "Unable to watermark this PDF.");
    }
  });

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      createFileDropzone({
        input: fileInput,
        iconClass: "bx-file",
        title: uiCopy.common.uploadOnePdf,
        hint: "Choose one PDF and add a text watermark without uploading it anywhere.",
        buttonText: uiCopy.common.chooseFile,
        onFilesSelected: handleFileSelection,
      }),
      fileCard,
      el("div", { className: "tool-form-grid" }, [
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: uiCopy.common.watermarkText }),
          textInput,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: uiCopy.common.size }),
          sizeInput,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: uiCopy.common.opacity }),
          opacityInput,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: uiCopy.common.rotation }),
          rotationInput,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: uiCopy.common.placement }),
          placementSelect,
        ]),
      ]),
      el("div", { className: "tool-action-row" }, [applyButton]),
    ])
  );
}
