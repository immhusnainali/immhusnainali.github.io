import { el } from "../shared/dom.js";
import { downloadBlob } from "../shared/download.js";
import { setStatus } from "../shared/messages.js";
import { loadVendorLib } from "../shared/vendor-loader.js";

function getQrCanvas(container) {
  return container.querySelector("canvas");
}

export function mountTool(context) {
  const { root, uiCopy, statusEl } = context;

  const textInput = el("textarea", {
    className: "tool-textarea",
    attrs: {
      placeholder: "https://immhusnainali.github.io/tools/",
      "aria-label": "QR content",
    },
  });
  textInput.style.minHeight = "10rem";

  const sizeInput = el("input", {
    className: "tool-input",
    type: "number",
    value: "240",
    attrs: { min: "120", max: "512", step: "10" },
  });
  const darkColor = el("input", {
    className: "tool-input",
    type: "color",
    value: "#111827",
  });
  const lightColor = el("input", {
    className: "tool-input",
    type: "color",
    value: "#ffffff",
  });
  const preview = el("div", { className: "tool-preview-frame" });

  async function renderQr() {
    const value = textInput.value.trim();
    if (!value) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    const QRCode = await loadVendorLib("qrcode");
    preview.innerHTML = "";

    new QRCode(preview, {
      text: value,
      width: Number(sizeInput.value) || 240,
      height: Number(sizeInput.value) || 240,
      colorDark: darkColor.value,
      colorLight: lightColor.value,
      correctLevel: QRCode.CorrectLevel.M,
    });

    setStatus(statusEl, "success", uiCopy.common.generated);
  }

  const generateButton = el("button", {
    className: "tool-button",
    type: "button",
    text: uiCopy.common.generate,
  });
  const downloadButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.download,
  });

  generateButton.addEventListener("click", renderQr);
  downloadButton.addEventListener("click", async () => {
    const canvas = getQrCanvas(preview);
    if (!canvas) {
      setStatus(statusEl, "warning", "Generate a QR code before downloading.");
      return;
    }

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) {
      setStatus(statusEl, "error", "Unable to export the QR code as an image.");
      return;
    }
    downloadBlob("qr-code.png", blob);
    setStatus(statusEl, "success", uiCopy.common.generated);
  });

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      textInput,
      el("div", { className: "tool-form-grid" }, [
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: uiCopy.common.size }),
          sizeInput,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", {
            className: "tool-label",
            text: uiCopy.common.darkColorLabel,
          }),
          darkColor,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", {
            className: "tool-label",
            text: uiCopy.common.lightColorLabel,
          }),
          lightColor,
        ]),
      ]),
      el("div", { className: "tool-action-row" }, [generateButton, downloadButton]),
      preview,
    ])
  );
}
