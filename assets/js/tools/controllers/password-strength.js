import { el } from "../shared/dom.js";
import { setStatus } from "../shared/messages.js";

function estimateStrength(password) {
  const value = String(password || "");
  const checks = [
    {
      label: "At least 12 characters",
      passed: value.length >= 12,
    },
    {
      label: "Contains uppercase letters",
      passed: /[A-Z]/.test(value),
    },
    {
      label: "Contains lowercase letters",
      passed: /[a-z]/.test(value),
    },
    {
      label: "Contains numbers",
      passed: /\d/.test(value),
    },
    {
      label: "Contains symbols",
      passed: /[^A-Za-z0-9]/.test(value),
    },
  ];

  const repeatedPenalty = /(.)\1{2,}/.test(value) ? 1 : 0;
  const commonPenalty =
    /(password|123456|qwerty|admin|letmein|welcome|iloveyou)/i.test(value) ? 2 : 0;
  const categories = checks.slice(1).filter((item) => item.passed).length;
  const characterPool =
    (/[a-z]/.test(value) ? 26 : 0) +
    (/[A-Z]/.test(value) ? 26 : 0) +
    (/\d/.test(value) ? 10 : 0) +
    (/[^A-Za-z0-9]/.test(value) ? 33 : 0);

  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (value.length >= 16) score += 1;
  score += Math.min(categories, 4);
  score -= repeatedPenalty + commonPenalty;
  score = Math.max(0, Math.min(6, score));

  const entropy =
    value.length && characterPool
      ? Math.round(value.length * Math.log2(characterPool))
      : 0;

  let label = "Very weak";
  if (score >= 5) {
    label = "Strong";
  } else if (score >= 4) {
    label = "Good";
  } else if (score >= 3) {
    label = "Fair";
  } else if (score >= 2) {
    label = "Weak";
  }

  return {
    score,
    entropy,
    label,
    checks,
    suggestions: checks.filter((item) => !item.passed).map((item) => item.label),
  };
}

export function mountTool(context) {
  const { root, statusEl, uiCopy } = context;
  const passwordInput = el("input", {
    className: "tool-input",
    type: "password",
    attrs: {
      autocomplete: "off",
      placeholder: "Type or paste a password to analyze",
      "aria-label": "Password to analyze",
    },
  });
  const toggleButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: "Show",
  });
  const clearButton = el("button", {
    className: "tool-button tool-button--ghost",
    type: "button",
    text: uiCopy.common.clear,
  });
  const metricsGrid = el("div", { className: "metrics-grid" });
  const scoreValue = el("strong", { text: "0 / 6" });
  const strengthValue = el("strong", { text: "Very weak" });
  const entropyValue = el("strong", { text: "0 bits" });
  const checksList = el("ul", { className: "tool-sidebar-list" });
  const suggestionsList = el("ul", { className: "tool-sidebar-list" });

  [
    ["Score", scoreValue],
    ["Strength", strengthValue],
    ["Estimated entropy", entropyValue],
  ].forEach(([label, node]) => {
    metricsGrid.appendChild(
      el("article", { className: "metric-card" }, [
        el("span", { className: "tool-meta", text: label }),
        node,
      ])
    );
  });

  function renderAnalysis() {
    const analysis = estimateStrength(passwordInput.value);
    scoreValue.textContent = String(analysis.score) + " / 6";
    strengthValue.textContent = analysis.label;
    entropyValue.textContent = String(analysis.entropy) + " bits";

    checksList.innerHTML = "";
    analysis.checks.forEach((item) => {
      checksList.appendChild(
        el("li", {
          text: (item.passed ? "Pass: " : "Missing: ") + item.label,
        })
      );
    });

    suggestionsList.innerHTML = "";
    if (!analysis.suggestions.length) {
      suggestionsList.appendChild(
        el("li", { text: "This password already meets the main strength checks." })
      );
    } else {
      analysis.suggestions.forEach((item) => {
        suggestionsList.appendChild(el("li", { text: item }));
      });
    }

    if (!passwordInput.value) {
      setStatus(statusEl, "info", uiCopy.common.ready);
      return;
    }

    setStatus(
      statusEl,
      analysis.score >= 4 ? "success" : analysis.score >= 2 ? "warning" : "error",
      "Password strength updated locally in your browser."
    );
  }

  passwordInput.addEventListener("input", renderAnalysis);
  toggleButton.addEventListener("click", () => {
    const nextType = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = nextType;
    toggleButton.textContent = nextType === "password" ? "Show" : "Hide";
  });
  clearButton.addEventListener("click", () => {
    passwordInput.value = "";
    passwordInput.type = "password";
    toggleButton.textContent = "Show";
    renderAnalysis();
  });

  root.appendChild(
    el("section", { className: "tools-stack" }, [
      el("div", { className: "tool-form-grid" }, [
        el("label", { className: "tool-field-group" }, [
          el("span", { className: "tool-label", text: "Password" }),
          passwordInput,
        ]),
      ]),
      el("div", { className: "tool-action-row" }, [toggleButton, clearButton]),
      metricsGrid,
      el("div", { className: "tool-form-grid" }, [
        el("article", { className: "tool-sidebar-card" }, [
          el("h2", { text: "Checklist" }),
          checksList,
        ]),
        el("article", { className: "tool-sidebar-card" }, [
          el("h2", { text: "Suggestions" }),
          suggestionsList,
        ]),
      ]),
    ])
  );

  renderAnalysis();
}
