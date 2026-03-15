import { el } from "../shared/dom.js";
import { copyText } from "../shared/download.js";
import { setStatus } from "../shared/messages.js";

const KEYS = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "(", ")"],
  ["C", "Back", "%", "+"],
];

function evaluateExpression(expression) {
  const value = String(expression || "").trim();
  if (!value) {
    throw new Error("Enter an expression first.");
  }

  if (!/^[0-9+\-*/%.()\s]+$/.test(value)) {
    throw new Error("Only numbers, spaces, parentheses, and + - * / % are supported.");
  }

  const result = Function('"use strict"; return (' + value + ");")();
  if (!Number.isFinite(result)) {
    throw new Error("The result is not a finite number.");
  }

  return result;
}

export function mountTool(context) {
  const { root, statusEl, uiCopy } = context;
  const expressionInput = el("input", {
    className: "tool-input calculator-display",
    attrs: {
      autocomplete: "off",
      inputmode: "decimal",
      placeholder: "12 + (5 * 3) / 2",
      "aria-label": "Calculator expression",
    },
  });
  const resultOutput = el("input", {
    className: "tool-input calculator-display calculator-display--result",
    attrs: {
      readonly: "readonly",
      "aria-label": "Calculator result",
      placeholder: "Result",
    },
  });
  const historyList = el("div", { className: "history-list" });

  function pushHistory(expression, result) {
    const item = el("button", {
      className: "history-item",
      type: "button",
      text: expression + " = " + result,
    });
    item.addEventListener("click", () => {
      expressionInput.value = expression;
      resultOutput.value = String(result);
    });
    historyList.prepend(item);

    while (historyList.children.length > 6) {
      historyList.removeChild(historyList.lastChild);
    }
  }

  function runCalculation() {
    try {
      const result = evaluateExpression(expressionInput.value);
      resultOutput.value = String(result);
      pushHistory(expressionInput.value, result);
      setStatus(statusEl, "success", uiCopy.common.generated);
    } catch (error) {
      setStatus(statusEl, "error", error.message || "Calculation failed.");
    }
  }

  const keypad = el("div", { className: "calculator-grid" });
  KEYS.flat().concat(["="]).forEach((key) => {
    const button = el("button", {
      className:
        "tool-button tool-button--ghost" +
        (key === "=" ? " calculator-key--accent" : ""),
      type: "button",
      text: key,
    });

    button.addEventListener("click", () => {
      switch (key) {
        case "C":
          expressionInput.value = "";
          resultOutput.value = "";
          setStatus(statusEl, "info", uiCopy.common.ready);
          break;
        case "Back":
          expressionInput.value = expressionInput.value.slice(0, -1);
          break;
        case "=":
          runCalculation();
          break;
        default:
          expressionInput.value += key;
          expressionInput.focus();
      }
    });

    keypad.appendChild(button);
  });

  const calculateButton = el("button", {
    className: "tool-button",
    type: "button",
    text: "Calculate",
  });
  const copyButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.copy,
  });
  const clearButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.clear,
  });

  expressionInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runCalculation();
    }
  });
  calculateButton.addEventListener("click", runCalculation);
  copyButton.addEventListener("click", async () => {
    if (!resultOutput.value) {
      setStatus(statusEl, "warning", uiCopy.common.emptyInput);
      return;
    }

    await copyText(resultOutput.value);
    setStatus(statusEl, "success", uiCopy.common.copied);
  });
  clearButton.addEventListener("click", () => {
    expressionInput.value = "";
    resultOutput.value = "";
    setStatus(statusEl, "info", uiCopy.common.ready);
  });

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      el("div", { className: "tool-form-grid" }, [
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: "Expression" }),
          expressionInput,
        ]),
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: "Result" }),
          resultOutput,
        ]),
      ]),
      el("div", { className: "tool-action-row" }, [
        calculateButton,
        copyButton,
        clearButton,
      ]),
      keypad,
      el("article", { className: "tool-sidebar-card" }, [
        el("h2", { text: "Recent calculations" }),
        historyList,
      ]),
    ])
  );
}
