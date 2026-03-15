export function toFileArray(fileList) {
  return Array.from(fileList || []);
}

export function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (value < 1024) {
    return value + " B";
  }

  const units = ["KB", "MB", "GB"];
  let size = value / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return size.toFixed(size >= 10 ? 1 : 2) + " " + units[unitIndex];
}

export function sanitizeFileName(name, fallback = "download") {
  const baseName = String(name || fallback)
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return baseName || fallback;
}

export function hasExtension(fileName, allowedExtensions) {
  const lowerName = String(fileName || "").toLowerCase();
  return allowedExtensions.some((extension) => lowerName.endsWith(extension));
}

export function readAsArrayBuffer(file) {
  return file.arrayBuffer();
}

export function readAsText(file) {
  return file.text();
}

export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = (error) => {
      URL.revokeObjectURL(objectUrl);
      reject(error);
    };
    image.src = objectUrl;
  });
}

export function parseRangeTokens(input, maxPages) {
  const cleanValue = String(input || "").trim();

  if (!cleanValue) {
    return { groups: [], error: "Enter one or more page ranges." };
  }

  const tokens = cleanValue.split(",").map((token) => token.trim()).filter(Boolean);
  const groups = [];

  for (const token of tokens) {
    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/);

    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);

      if (start < 1 || end < 1 || start > end || end > maxPages) {
        return {
          groups: [],
          error: "Use page numbers between 1 and " + maxPages + ".",
        };
      }

      const pages = [];
      for (let page = start; page <= end; page += 1) {
        pages.push(page);
      }
      groups.push({ label: "pages-" + start + "-" + end, pages });
      continue;
    }

    const singlePage = Number(token);
    if (!Number.isInteger(singlePage) || singlePage < 1 || singlePage > maxPages) {
      return {
        groups: [],
        error: "Use page numbers between 1 and " + maxPages + ".",
      };
    }

    groups.push({ label: "page-" + singlePage, pages: [singlePage] });
  }

  return { groups, error: "" };
}
