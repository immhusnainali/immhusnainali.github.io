export function setStatus(target, type, message) {
  if (!target) {
    return;
  }

  target.className = "tool-status tool-status--" + (type || "info");
  target.textContent = message || "";
}

export function clearStatus(target) {
  setStatus(target, "info", "");
}
