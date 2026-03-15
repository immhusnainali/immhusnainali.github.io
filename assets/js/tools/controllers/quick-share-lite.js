import { el } from "../shared/dom.js";
import { copyText, downloadBlob, downloadTextFile } from "../shared/download.js";
import { createFileDropzone } from "../shared/file-dropzone.js";
import { formatBytes, hasExtension } from "../shared/files.js";
import { setStatus } from "../shared/messages.js";
import { loadVendorLib } from "../shared/vendor-loader.js";

const PORTFOLIO_URL = "https://immhusnainali.github.io/";
const TOOLS_URL = "https://immhusnainali.github.io/tools/";
const CONTACT_URL = "https://immhusnainali.github.io/#contact";
const DEFAULT_SHARE_TITLE = "Muhammad Husnain Ali Portfolio";
const FILE_EXTENSIONS = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp"];
const FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function hasNativeShare() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

function isSupportedFile(file) {
  if (!file) {
    return false;
  }

  return (
    String(file.type || "").startsWith("image/") ||
    FILE_TYPES.includes(file.type) ||
    hasExtension(file.name, FILE_EXTENSIONS)
  );
}

function normalizeUrl(value) {
  const input = String(value || "").trim();
  if (!input) {
    throw new Error("Add a URL first to continue.");
  }

  try {
    return new URL(input).toString();
  } catch (error) {
    throw new Error("Enter a full valid URL starting with http:// or https://.");
  }
}

function getFileIcon(file) {
  const type = String(file.type || "").toLowerCase();
  const name = String(file.name || "").toLowerCase();

  if (type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(name)) {
    return "bx-image-alt";
  }

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    return "bx-file";
  }

  return "bx-file-doc";
}

function canShareFiles(file) {
  if (!hasNativeShare() || !file || typeof navigator.canShare !== "function") {
    return false;
  }

  try {
    return navigator.canShare({ files: [file] });
  } catch (error) {
    return false;
  }
}

function getQrCanvas(container) {
  return container.querySelector("canvas");
}

function buildPreviewCard(iconClass, title, text) {
  return el("div", { className: "share-preview-content" }, [
    el("i", { className: "bx " + iconClass }),
    el("strong", { text: title }),
    el("span", { className: "tool-help", text }),
  ]);
}

export function mountTool(context) {
  const { root, statusEl, uiCopy } = context;
  const state = {
    mode: "url",
    file: null,
    previewUrl: "",
    qrValue: "",
  };

  const modeButtons = {};
  const shareTitleInput = el("input", {
    className: "tool-input",
    value: DEFAULT_SHARE_TITLE,
    attrs: {
      maxlength: "80",
      placeholder: "Optional share title",
      "aria-label": "Share title",
    },
  });
  const textInput = el("textarea", {
    className: "tool-textarea",
    attrs: {
      placeholder: "Write a short portfolio message, intro, or note to share",
      "aria-label": "Text to share",
    },
  });
  textInput.style.minHeight = "10rem";

  const urlInput = el("input", {
    className: "tool-input",
    value: PORTFOLIO_URL,
    attrs: {
      type: "url",
      placeholder: PORTFOLIO_URL,
      "aria-label": "URL to share",
    },
  });

  const fileInput = el("input", {
    type: "file",
    attrs: {
      accept:
        ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*",
      hidden: "hidden",
    },
  });

  const fileList = el("div", { className: "tool-file-list" });
  const supportList = el("ul", { className: "tool-sidebar-list" });
  const previewFrame = el("div", { className: "tool-preview-frame" });
  const limitsList = el("ul", { className: "tool-sidebar-list" });

  const presetRow = el("div", { className: "chip-row" });
  [
    ["Portfolio Home", PORTFOLIO_URL],
    ["Tools Hub", TOOLS_URL],
    ["Contact", CONTACT_URL],
  ].forEach(([label, value]) => {
    const button = el("button", {
      className: "chip-button chip-button--ghost",
      type: "button",
      text: label,
    });
    button.addEventListener("click", () => {
      urlInput.value = value;
      clearQrPreview();
      renderActivePanel();
      setStatus(statusEl, "success", "Portfolio link preset applied.");
    });
    presetRow.appendChild(button);
  });

  const textPanel = el("div", { className: "tools-stack", attrs: { hidden: "hidden" } }, [
    el("label", { className: "tool-field-group" }, [
      el("span", { className: "tool-label", text: "Message" }),
      textInput,
    ]),
  ]);
  const urlPanel = el("div", { className: "tools-stack" }, [
    el("label", { className: "tool-field-group" }, [
      el("span", { className: "tool-label", text: "Portfolio link" }),
      urlInput,
      el("span", {
        className: "tool-help",
        text: "Share your main portfolio, tools hub, or contact page with copy, QR, download, or native share.",
      }),
    ]),
    presetRow,
  ]);
  const filePanel = el("div", { className: "tools-stack", attrs: { hidden: "hidden" } }, [
    createFileDropzone({
      input: fileInput,
      iconClass: "bx-share-alt",
      title: "Drop one file here or choose it manually.",
      hint: "Honest check only: images and PDFs work best. DOCX support depends on browser and OS.",
      buttonText: uiCopy.common.chooseFile,
      onFilesSelected: handleSelectedFiles,
    }),
    fileList,
  ]);

  const shareButton = el("button", {
    className: "tool-button",
    type: "button",
    text: "Open share sheet",
  });
  const copyButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.copy,
  });
  const qrButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: "Generate QR",
  });
  const downloadButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.download,
  });
  const downloadQrButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: "Download QR",
    disabled: true,
  });
  const clearButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.clear,
  });

  function revokePreview() {
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
      state.previewUrl = "";
    }
  }

  function clearQrPreview() {
    state.qrValue = "";
    downloadQrButton.disabled = true;
  }

  function renderPreviewCard(iconClass, title, text) {
    revokePreview();
    previewFrame.innerHTML = "";
    previewFrame.appendChild(buildPreviewCard(iconClass, title, text));
  }

  function renderFileList() {
    fileList.innerHTML = "";
    if (!state.file) {
      return;
    }

    fileList.appendChild(
      el("article", { className: "tool-list-card" }, [
        el("div", { className: "tool-list-card__row" }, [
          el("div", { className: "share-selected-file" }, [
            el("strong", { className: "tool-file-name", text: state.file.name }),
            el("span", {
              className: "tool-meta",
              text: (state.file.type || "Unknown type") + " - " + formatBytes(state.file.size),
            }),
          ]),
        ]),
      ])
    );
  }

  function renderFilePreview() {
    previewFrame.innerHTML = "";
    revokePreview();

    if (!state.file) {
      renderPreviewCard(
        "bx-share-alt",
        "Portfolio file check",
        "Choose a PDF, DOCX, or image to test whether this browser can open a native share sheet for it."
      );
      return;
    }

    if (String(state.file.type || "").startsWith("image/")) {
      state.previewUrl = URL.createObjectURL(state.file);
      previewFrame.appendChild(
        el("img", {
          attrs: {
            src: state.previewUrl,
            alt: state.file.name,
          },
        })
      );
      return;
    }

    previewFrame.appendChild(
      buildPreviewCard(
        getFileIcon(state.file),
        state.file.name,
        "This page can check native file-share support, but it cannot create a public download link for uploaded files on static hosting."
      )
    );
  }

  function renderTextPreview() {
    const value = textInput.value.trim();
    renderPreviewCard(
      "bx-message-square-detail",
      "Portfolio message",
      value || "Write a message here, then share it, copy it, download it, or turn it into a QR code."
    );
  }

  function renderUrlPreview() {
    const value = urlInput.value.trim();
    renderPreviewCard("bx-link-alt", "Portfolio link ready", value || PORTFOLIO_URL);
  }

  function renderSupport() {
    const nativeShareAvailable = hasNativeShare();
    const fileShareAvailable =
      state.mode === "file" && state.file ? canShareFiles(state.file) : nativeShareAvailable;

    supportList.innerHTML = "";
    [
      "Static-only mode: this tool works best for portfolio links, text sharing, and QR handoff.",
      "Native share sheet: " +
        (nativeShareAvailable ? "Available in this browser" : "Not available in this browser"),
      state.mode === "file"
        ? "Current file support: " +
          (state.file
            ? fileShareAvailable
              ? "This file can be handed to the native share sheet here"
              : "This file cannot be shared natively in the current browser"
            : "Choose a file to test native support")
        : "Current mode support: URL and message sharing usually work best on supported mobile browsers.",
      "Best file support: images and PDFs. DOCX support is still inconsistent across browsers and operating systems.",
    ].forEach((item) => {
      supportList.appendChild(el("li", { text: item }));
    });

    limitsList.innerHTML = "";
    [
      "This page cannot create a public download link for an uploaded file because GitHub Pages is static-only.",
      "A ToffeeShare-style cross-device file link would need backend storage or WebRTC signaling, which this project does not use.",
      "For uploaded files, this tool only performs honest browser support checks and native share handoff where available.",
      "For cross-device access right now, the reliable static-only path is sharing links or QR codes that point to public pages on your site.",
    ].forEach((item) => {
      limitsList.appendChild(el("li", { text: item }));
    });
  }

  function updateActionState() {
    const isFileMode = state.mode === "file";
    copyButton.disabled = isFileMode;
    qrButton.disabled = isFileMode;
    downloadButton.disabled = isFileMode;
    if (isFileMode) {
      downloadQrButton.disabled = true;
    } else if (state.qrValue) {
      downloadQrButton.disabled = false;
    }
  }

  function getShareTitle() {
    return shareTitleInput.value.trim() || DEFAULT_SHARE_TITLE;
  }

  function getCurrentTextValue() {
    return textInput.value.trim();
  }

  function getCurrentUrlValue() {
    return normalizeUrl(urlInput.value);
  }

  function getSharePayload() {
    if (state.mode === "text") {
      const value = getCurrentTextValue();
      if (!value) {
        throw new Error(uiCopy.common.emptyInput);
      }

      return {
        title: getShareTitle(),
        text: value,
      };
    }

    if (state.mode === "url") {
      return {
        title: getShareTitle(),
        url: getCurrentUrlValue(),
      };
    }

    if (!state.file) {
      throw new Error("Choose a file before checking native sharing.");
    }

    if (!canShareFiles(state.file)) {
      throw new Error(
        "This browser cannot share the selected file natively. Try a supported mobile browser for images or PDFs."
      );
    }

    return {
      title: getShareTitle(),
      files: [state.file],
    };
  }

  async function shareCurrent() {
    if (!hasNativeShare()) {
      setStatus(
        statusEl,
        "warning",
        "Native sharing is not available in this browser. Use copy, download, or QR for your links and messages."
      );
      return;
    }

    try {
      await navigator.share(getSharePayload());
      setStatus(statusEl, "success", "Your portfolio share sheet was opened successfully.");
    } catch (error) {
      if (error && error.name === "AbortError") {
        setStatus(statusEl, "info", "Sharing was canceled.");
        return;
      }

      setStatus(statusEl, "error", error.message || "Unable to open the native share sheet.");
    }
  }

  async function copyCurrent() {
    try {
      const value = state.mode === "url" ? getCurrentUrlValue() : getCurrentTextValue();
      if (!value) {
        setStatus(statusEl, "warning", uiCopy.common.emptyInput);
        return;
      }

      await copyText(value);
      setStatus(statusEl, "success", uiCopy.common.copied);
    } catch (error) {
      setStatus(statusEl, "error", error.message || "Unable to copy the current value.");
    }
  }

  async function generateQr() {
    try {
      const value = state.mode === "url" ? getCurrentUrlValue() : getCurrentTextValue();
      if (!value) {
        setStatus(statusEl, "warning", uiCopy.common.emptyInput);
        return;
      }

      const QRCode = await loadVendorLib("qrcode");
      previewFrame.innerHTML = "";
      new QRCode(previewFrame, {
        text: value,
        width: 220,
        height: 220,
        colorDark: "#111827",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M,
      });
      state.qrValue = value;
      downloadQrButton.disabled = false;
      setStatus(statusEl, "success", "QR code generated for your portfolio share.");
    } catch (error) {
      setStatus(statusEl, "error", error.message || "Unable to generate a QR code.");
    }
  }

  function downloadCurrent() {
    try {
      const value = state.mode === "url" ? getCurrentUrlValue() : getCurrentTextValue();
      if (!value) {
        setStatus(statusEl, "warning", uiCopy.common.emptyInput);
        return;
      }

      downloadTextFile(
        state.mode === "url" ? "portfolio-link.txt" : "portfolio-message.txt",
        value
      );
      setStatus(statusEl, "success", uiCopy.common.generated);
    } catch (error) {
      setStatus(statusEl, "error", error.message || "Unable to prepare the download.");
    }
  }

  async function downloadQr() {
    const canvas = getQrCanvas(previewFrame);
    if (!canvas || !state.qrValue) {
      setStatus(statusEl, "warning", "Generate a QR code before downloading it.");
      return;
    }

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) {
      setStatus(statusEl, "error", "Unable to export the QR code as an image.");
      return;
    }

    downloadBlob("portfolio-share-qr.png", blob);
    setStatus(statusEl, "success", "QR code downloaded.");
  }

  function clearAll() {
    shareTitleInput.value = DEFAULT_SHARE_TITLE;
    textInput.value = "";
    urlInput.value = PORTFOLIO_URL;
    state.file = null;
    clearQrPreview();
    renderFileList();
    renderSupport();
    renderActivePanel();
    setStatus(statusEl, "info", uiCopy.common.ready);
  }

  function markContentChanged() {
    if (state.qrValue) {
      clearQrPreview();
    }
    updateActionState();
    renderActivePanel();
  }

  function renderActivePanel() {
    textPanel.hidden = state.mode !== "text";
    urlPanel.hidden = state.mode !== "url";
    filePanel.hidden = state.mode !== "file";

    if (state.mode === "file") {
      renderFilePreview();
      return;
    }

    if (state.qrValue) {
      return;
    }

    if (state.mode === "text") {
      renderTextPreview();
      return;
    }

    renderUrlPreview();
  }

  function setMode(nextMode) {
    if (state.mode !== nextMode) {
      clearQrPreview();
    }
    state.mode = nextMode;
    Object.entries(modeButtons).forEach(([key, button]) => {
      button.classList.toggle("chip-button--active", key === nextMode);
    });
    updateActionState();
    renderSupport();
    renderActivePanel();
  }

  function handleSelectedFiles(files) {
    const [firstFile] = files || [];
    if (!firstFile) {
      return;
    }

    if (!isSupportedFile(firstFile)) {
      setStatus(
        statusEl,
        "error",
        "Use a JPG, PNG, WebP, PDF, DOC, or DOCX file in Portfolio Share."
      );
      return;
    }

    state.file = firstFile;
    clearQrPreview();
    renderFileList();
    renderSupport();
    updateActionState();
    if (state.mode === "file") {
      renderFilePreview();
    }
    setStatus(
      statusEl,
      "success",
      files.length > 1
        ? "Using the first selected file for support checks from your portfolio page."
        : "File selected and ready for native share support checks."
    );
  }

  const modeRow = el("div", { className: "chip-row" });
  [
    ["url", "Portfolio URL"],
    ["text", "Message"],
    ["file", "File check"],
  ].forEach(([mode, label], index) => {
    const button = el("button", {
      className: "chip-button" + (index === 0 ? " chip-button--active" : ""),
      type: "button",
      text: label,
    });
    button.addEventListener("click", () => setMode(mode));
    modeButtons[mode] = button;
    modeRow.appendChild(button);
  });

  shareButton.addEventListener("click", shareCurrent);
  copyButton.addEventListener("click", copyCurrent);
  qrButton.addEventListener("click", generateQr);
  downloadButton.addEventListener("click", downloadCurrent);
  downloadQrButton.addEventListener("click", downloadQr);
  clearButton.addEventListener("click", clearAll);

  textInput.addEventListener("input", markContentChanged);
  urlInput.addEventListener("input", markContentChanged);

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      el("label", { className: "tool-field-group" }, [
        el("span", { className: "tool-label", text: "Portfolio share mode" }),
        modeRow,
      ]),
      el("label", { className: "tool-field-group" }, [
        el("span", { className: "tool-label", text: "Share title" }),
        shareTitleInput,
        el("span", {
          className: "tool-help",
          text: "This branded title is used when the native share sheet supports titles.",
        }),
      ]),
      urlPanel,
      textPanel,
      filePanel,
      el("div", { className: "tool-action-row" }, [
        shareButton,
        copyButton,
        qrButton,
        downloadButton,
        downloadQrButton,
        clearButton,
      ]),
      el("div", { className: "tool-form-grid" }, [
        el("article", { className: "tool-sidebar-card" }, [
          el("h2", { text: "What works here" }),
          supportList,
        ]),
        el("article", { className: "tool-sidebar-card" }, [
          el("h2", { text: "Static-only limits" }),
          limitsList,
        ]),
        el("article", { className: "tool-sidebar-card tools-stack" }, [
          el("h2", { text: "Preview" }),
          previewFrame,
        ]),
      ]),
    ])
  );

  updateActionState();
  renderSupport();
  renderActivePanel();
  setStatus(statusEl, "info", uiCopy.common.ready);
}
