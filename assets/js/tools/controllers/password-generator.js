import { el } from "../shared/dom.js";
import { copyText } from "../shared/download.js";
import { setStatus } from "../shared/messages.js";

const CHARSETS = {
  uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  lowercase: "abcdefghijkmnopqrstuvwxyz",
  numbers: "23456789",
  symbols: "!@#$%^&*()-_=+[]{}",
  ambiguous: "Il1O0",
};

function scorePassword(password) {
  let score = 0;
  if (password.length >= 16) score += 3;
  else if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;

  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score >= 6) return "strong";
  if (score >= 4) return "good";
  if (score >= 3) return "fair";
  return "weak";
}

function makePassword(length, options) {
  let charset = "";
  if (options.uppercase) charset += CHARSETS.uppercase;
  if (options.lowercase) charset += CHARSETS.lowercase;
  if (options.numbers) charset += CHARSETS.numbers;
  if (options.symbols) charset += CHARSETS.symbols;
  if (options.ambiguous) charset += CHARSETS.ambiguous;

  if (!charset) {
    return "";
  }

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  return Array.from(randomValues)
    .map((value) => charset[value % charset.length])
    .join("");
}

export function mountTool(context) {
  const { root, uiCopy, statusEl } = context;

  const lengthInput = el("input", {
    className: "tool-input",
    type: "number",
    value: "18",
    attrs: { min: "8", max: "64" },
  });
  const output = el("input", {
    className: "tool-input",
    attrs: { readonly: "readonly", "aria-label": "Generated password" },
  });
  const strengthNode = el("strong", { text: uiCopy.common.good });

  const toggles = {
    uppercase: el("input", { type: "checkbox", checked: true }),
    lowercase: el("input", { type: "checkbox", checked: true }),
    numbers: el("input", { type: "checkbox", checked: true }),
    symbols: el("input", { type: "checkbox", checked: true }),
    ambiguous: el("input", { type: "checkbox", checked: false }),
  };

  function renderStrength(password) {
    const score = scorePassword(password);
    strengthNode.textContent = uiCopy.common[score];
  }

  function generate() {
    const length = Math.min(64, Math.max(8, Number(lengthInput.value) || 18));
    const password = makePassword(length, {
      uppercase: toggles.uppercase.checked,
      lowercase: toggles.lowercase.checked,
      numbers: toggles.numbers.checked,
      symbols: toggles.symbols.checked,
      ambiguous: toggles.ambiguous.checked,
    });

    if (!password) {
      setStatus(statusEl, "warning", "Select at least one character set.");
      return;
    }

    output.value = password;
    renderStrength(password);
    setStatus(statusEl, "success", uiCopy.common.generated);
  }

  const generateButton = el("button", {
    className: "tool-button",
    type: "button",
    text: uiCopy.common.generate,
  });
  const copyButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.copy,
  });

  generateButton.addEventListener("click", generate);
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
          el("span", { className: "tool-label", text: uiCopy.common.lengthLabel }),
          lengthInput,
        ]),
      ]),
      el("div", { className: "tool-checkbox-grid" }, [
        ...Object.entries(toggles).map(([key, input]) =>
          el("label", { className: "tool-checkbox" }, [
            input,
            key.charAt(0).toUpperCase() + key.slice(1),
          ])
        ),
      ]),
      el("div", { className: "tool-field-group" }, [
        el("span", {
          className: "tool-label",
          text: uiCopy.common.generatedPasswordLabel,
        }),
        output,
      ]),
      el("article", { className: "metric-card" }, [
        el("span", { className: "tool-meta", text: uiCopy.common.strengthLabel }),
        strengthNode,
      ]),
      el("div", { className: "tool-action-row" }, [generateButton, copyButton]),
    ])
  );

  generate();
}
