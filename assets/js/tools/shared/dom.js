export function qs(root, selector) {
  return (root || document).querySelector(selector);
}

export function qsa(root, selector) {
  return Array.from((root || document).querySelectorAll(selector));
}

export function clearElement(element) {
  if (element) {
    element.innerHTML = "";
  }

  return element;
}

export function el(tagName, options = {}, children = []) {
  const node = document.createElement(tagName);
  const {
    className,
    text,
    html,
    attrs,
    dataset,
    value,
    type,
    id,
    checked,
    disabled,
  } = options;

  if (className) {
    node.className = className;
  }

  if (typeof text !== "undefined") {
    node.textContent = text;
  }

  if (typeof html !== "undefined") {
    node.innerHTML = html;
  }

  if (attrs) {
    Object.entries(attrs).forEach(([key, val]) => {
      if (typeof val !== "undefined" && val !== null) {
        node.setAttribute(key, String(val));
      }
    });
  }

  if (dataset) {
    Object.entries(dataset).forEach(([key, val]) => {
      if (typeof val !== "undefined" && val !== null) {
        node.dataset[key] = String(val);
      }
    });
  }

  if (typeof value !== "undefined") {
    node.value = value;
  }

  if (typeof type !== "undefined") {
    node.type = type;
  }

  if (typeof id !== "undefined") {
    node.id = id;
  }

  if (typeof checked !== "undefined") {
    node.checked = checked;
  }

  if (typeof disabled !== "undefined") {
    node.disabled = disabled;
  }

  const childItems = Array.isArray(children) ? children : [children];
  childItems.filter(Boolean).forEach((child) => {
    node.appendChild(
      child instanceof Node ? child : document.createTextNode(String(child))
    );
  });

  return node;
}

export function formatNumber(value) {
  return new Intl.NumberFormat().format(Number(value || 0));
}
