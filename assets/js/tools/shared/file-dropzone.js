import { el } from "./dom.js";

export function createFileDropzone({
  input,
  iconClass,
  title,
  hint,
  buttonText,
  onFilesSelected,
}) {
  function openPicker() {
    if (input) {
      input.click();
    }
  }

  function handleFileSelection(fileList) {
    if (typeof onFilesSelected !== "function") {
      return;
    }

    const files = Array.from(fileList || []);
    if (files.length) {
      onFilesSelected(files);
    }
  }

  const button = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: buttonText,
  });

  const dropzone = el("div", {
    className: "tool-dropzone",
    attrs: {
      role: "button",
      tabindex: "0",
      "aria-label": title,
    },
  });

  dropzone.appendChild(el("i", { className: "bx " + iconClass }));
  dropzone.appendChild(el("strong", { text: title }));
  if (hint) {
    dropzone.appendChild(el("span", { className: "tool-help", text: hint }));
  }
  dropzone.appendChild(button);
  dropzone.appendChild(input);

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openPicker();
  });

  dropzone.addEventListener("click", (event) => {
    if (event.target === input) {
      return;
    }

    openPicker();
  });

  dropzone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add("tool-dropzone--active");
    });
  });

  ["dragleave", "dragend", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      if (
        eventName !== "drop" &&
        event.relatedTarget instanceof Node &&
        dropzone.contains(event.relatedTarget)
      ) {
        return;
      }
      dropzone.classList.remove("tool-dropzone--active");
    });
  });

  dropzone.addEventListener("drop", (event) => {
    handleFileSelection(event.dataTransfer && event.dataTransfer.files);
  });

  input.addEventListener("change", () => {
    handleFileSelection(input.files);
    input.value = "";
  });

  return dropzone;
}
