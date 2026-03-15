import { el } from "../shared/dom.js";
import { copyText, downloadTextFile } from "../shared/download.js";
import { setStatus } from "../shared/messages.js";

function toTitleCase(value) {
  return String(value || "").replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

function toSentenceCase(value) {
  const lower = String(value || "").toLowerCase();
  return lower.replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) =>
    match.toUpperCase()
  );
}

function toAlternatingCase(value) {
  let useUpper = true;
  return Array.from(String(value || ""))
    .map((char) => {
      if (!/[a-z]/i.test(char)) {
        return char;
      }

      const nextChar = useUpper ? char.toUpperCase() : char.toLowerCase();
      useUpper = !useUpper;
      return nextChar;
    })
    .join("");
}

function toSeparatedCase(value, separator) {
  return String(value || "")
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join(separator)
    .toLowerCase();
}

function buildToolConfig(toolId, controls) {
  switch (toolId) {
    case "text-case-converter":
      return {
        actionLabel: "Convert text",
        fileName: "text-case-converted.txt",
        controlNodes: [
          el("label", { className: "tool-field-group" }, [
            el("span", { className: "tool-label", text: "Convert to" }),
            controls.caseSelect,
          ]),
        ],
        transform(input) {
          switch (controls.caseSelect.value) {
            case "uppercase":
              return input.toUpperCase();
            case "lowercase":
              return input.toLowerCase();
            case "title":
              return toTitleCase(input);
            case "sentence":
              return toSentenceCase(input);
            case "alternating":
              return toAlternatingCase(input);
            case "snake":
              return toSeparatedCase(input, "_");
            case "kebab":
              return toSeparatedCase(input, "-");
            default:
              return input;
          }
        },
      };
    case "remove-duplicate-lines":
      return {
        actionLabel: "Remove duplicates",
        fileName: "unique-lines.txt",
        controlNodes: [
          el("label", { className: "tool-checkbox" }, [
            controls.trimLines,
            "Trim each line before comparing",
          ]),
          el("label", { className: "tool-checkbox" }, [
            controls.caseSensitive,
            "Case-sensitive comparison",
          ]),
          el("label", { className: "tool-checkbox" }, [
            controls.keepEmpty,
            "Keep empty lines",
          ]),
        ],
        transform(input) {
          const seen = new Set();
          const lines = String(input || "").split(/\r?\n/);
          const result = [];

          lines.forEach((line) => {
            const prepared = controls.trimLines.checked ? line.trim() : line;
            if (!controls.keepEmpty.checked && !prepared) {
              return;
            }

            const key = controls.caseSensitive.checked
              ? prepared
              : prepared.toLowerCase();

            if (seen.has(key)) {
              return;
            }

            seen.add(key);
            result.push(prepared);
          });

          return result.join("\n");
        },
      };
    case "text-sorter":
      return {
        actionLabel: "Sort text",
        fileName: "sorted-text.txt",
        controlNodes: [
          el("label", { className: "tool-field-group" }, [
            el("span", { className: "tool-label", text: "Sort order" }),
            controls.sortOrder,
          ]),
          el("label", { className: "tool-checkbox" }, [
            controls.caseSensitive,
            "Case-sensitive sort",
          ]),
          el("label", { className: "tool-checkbox" }, [
            controls.uniqueOnly,
            "Remove duplicates while sorting",
          ]),
        ],
        transform(input) {
          let lines = String(input || "")
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);

          if (controls.uniqueOnly.checked) {
            lines = Array.from(new Set(lines));
          }

          lines.sort((left, right) => {
            const a = controls.caseSensitive.checked ? left : left.toLowerCase();
            const b = controls.caseSensitive.checked ? right : right.toLowerCase();
            return a.localeCompare(b, undefined, { numeric: true });
          });

          if (controls.sortOrder.value === "desc") {
            lines.reverse();
          }

          return lines.join("\n");
        },
      };
    case "line-number-generator":
      return {
        actionLabel: "Add line numbers",
        fileName: "line-numbered-text.txt",
        controlNodes: [
          el("label", { className: "tool-field-group" }, [
            el("span", { className: "tool-label", text: "Start at" }),
            controls.startAt,
          ]),
          el("label", { className: "tool-field-group" }, [
            el("span", { className: "tool-label", text: "Separator" }),
            controls.separator,
          ]),
        ],
        transform(input) {
          const startAt = Math.max(1, Number(controls.startAt.value) || 1);
          const separator = controls.separator.value || ". ";
          return String(input || "")
            .split(/\r?\n/)
            .map((line, index) => String(startAt + index) + separator + line)
            .join("\n");
        },
      };
    default:
      return {
        actionLabel: "Run tool",
        fileName: "tool-output.txt",
        controlNodes: [],
        transform(input) {
          return input;
        },
      };
  }
}

export function mountTool(context) {
  const { root, statusEl, uiCopy, tool } = context;
  const controls = {
    caseSelect: el("select", { className: "tool-select" }),
    trimLines: el("input", { type: "checkbox", checked: true }),
    caseSensitive: el("input", { type: "checkbox" }),
    keepEmpty: el("input", { type: "checkbox" }),
    sortOrder: el("select", { className: "tool-select" }),
    uniqueOnly: el("input", { type: "checkbox" }),
    startAt: el("input", {
      className: "tool-input",
      type: "number",
      value: "1",
      attrs: { min: "1" },
    }),
    separator: el("input", {
      className: "tool-input",
      value: ". ",
    }),
  };

  [
    ["sentence", "Sentence case"],
    ["title", "Title Case"],
    ["uppercase", "UPPERCASE"],
    ["lowercase", "lowercase"],
    ["alternating", "AlTeRnAtInG"],
    ["snake", "snake_case"],
    ["kebab", "kebab-case"],
  ].forEach(([value, text]) => {
    controls.caseSelect.appendChild(el("option", { value, text }));
  });
  controls.caseSelect.value = "title";

  [
    ["asc", "Ascending"],
    ["desc", "Descending"],
  ].forEach(([value, text]) => {
    controls.sortOrder.appendChild(el("option", { value, text }));
  });

  const config = buildToolConfig(tool.id, controls);
  const input = el("textarea", {
    className: "tool-textarea",
    attrs: {
      placeholder: "Paste or type text here...",
      "aria-label": "Input text",
    },
  });
  const output = el("textarea", {
    className: "tool-output",
    attrs: {
      readonly: "readonly",
      "aria-label": "Output text",
    },
  });

  function runTool() {
    if (!input.value.trim()) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    output.value = config.transform(input.value);
    setStatus(statusEl, "success", uiCopy.common.generated);
  }

  const runButton = el("button", {
    className: "tool-button",
    type: "button",
    text: config.actionLabel,
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
  const clearButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.clear,
  });

  runButton.addEventListener("click", runTool);
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

    downloadTextFile(config.fileName, output.value);
    setStatus(statusEl, "success", uiCopy.common.generated);
  });
  clearButton.addEventListener("click", () => {
    input.value = "";
    output.value = "";
    setStatus(statusEl, "info", uiCopy.common.ready);
  });

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      config.controlNodes.length
        ? el("div", { className: "tool-form-grid" }, config.controlNodes)
        : null,
      el("div", { className: "tool-action-row" }, [
        runButton,
        copyButton,
        downloadButton,
        clearButton,
      ]),
      el("div", { className: "tool-form-grid" }, [input, output]),
    ])
  );
}
