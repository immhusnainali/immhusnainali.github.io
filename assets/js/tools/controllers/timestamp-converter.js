import { el } from "../shared/dom.js";
import { copyText } from "../shared/download.js";
import { setStatus } from "../shared/messages.js";

function pad(value) {
  return String(value).padStart(2, "0");
}

function toLocalDateTimeInputValue(date) {
  return (
    String(date.getFullYear()) +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

function parseTimestamp(value) {
  const trimmed = String(value || "").trim();
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
    throw new Error("Enter a valid Unix timestamp in seconds or milliseconds.");
  }

  const numericValue = Number(trimmed);
  const milliseconds =
    Math.abs(numericValue) >= 100000000000 ? numericValue : numericValue * 1000;
  const date = new Date(milliseconds);

  if (Number.isNaN(date.getTime())) {
    throw new Error("The timestamp could not be converted.");
  }

  return date;
}

function buildSummary(date) {
  return [
    "Unix seconds: " + Math.floor(date.getTime() / 1000),
    "Unix milliseconds: " + date.getTime(),
    "ISO 8601: " + date.toISOString(),
    "UTC: " + date.toUTCString(),
    "Local: " + date.toString(),
  ].join("\n");
}

export function mountTool(context) {
  const { root, statusEl, uiCopy } = context;
  const timestampInput = el("input", {
    className: "tool-input",
    value: String(Math.floor(Date.now() / 1000)),
    attrs: {
      placeholder: "1710576000",
      "aria-label": "Unix timestamp",
    },
  });
  const dateInput = el("input", {
    className: "tool-input",
    type: "datetime-local",
    value: toLocalDateTimeInputValue(new Date()),
  });
  const output = el("textarea", {
    className: "tool-output",
    attrs: {
      readonly: "readonly",
      "aria-label": "Timestamp conversion output",
    },
  });

  function renderFromDate(date) {
    timestampInput.value = String(Math.floor(date.getTime() / 1000));
    dateInput.value = toLocalDateTimeInputValue(date);
    output.value = buildSummary(date);
    setStatus(statusEl, "success", uiCopy.common.generated);
  }

  const convertTimestampButton = el("button", {
    className: "tool-button",
    type: "button",
    text: "Convert timestamp",
  });
  const convertDateButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: "Convert date",
  });
  const nowButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: "Use current time",
  });
  const copyButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.copy,
  });

  convertTimestampButton.addEventListener("click", () => {
    try {
      renderFromDate(parseTimestamp(timestampInput.value));
    } catch (error) {
      setStatus(statusEl, "error", error.message || "Timestamp conversion failed.");
    }
  });
  convertDateButton.addEventListener("click", () => {
    const value = dateInput.value;
    if (!value) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      setStatus(statusEl, "error", "Enter a valid local date and time.");
      return;
    }

    renderFromDate(date);
  });
  nowButton.addEventListener("click", () => renderFromDate(new Date()));
  copyButton.addEventListener("click", async () => {
    if (!output.value) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    await copyText(output.value);
    setStatus(statusEl, "success", uiCopy.common.copied);
  });

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      el("div", { className: "tool-form-grid" }, [
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: "Unix timestamp" }),
          timestampInput,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: "Readable date and time" }),
          dateInput,
        ]),
      ]),
      el("div", { className: "tool-action-row" }, [
        convertTimestampButton,
        convertDateButton,
        nowButton,
        copyButton,
      ]),
      output,
    ])
  );

  renderFromDate(new Date());
}
