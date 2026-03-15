export const CATEGORY_ORDER = ["pdf", "image", "developer", "text", "utility"];

export const CATEGORY_META = {
  pdf: {
    id: "pdf",
    name: "PDF Tools",
    path: "/tools/pdf/",
    description:
      "Fast browser-only utilities for merging, splitting, watermarking, and preparing PDF files without uploads.",
    icon: "bx-file",
  },
  image: {
    id: "image",
    name: "Image Tools",
    path: "/tools/image/",
    description:
      "Resize, compress, convert, and prepare images entirely on-device with lightweight browser workflows.",
    icon: "bx-image-alt",
  },
  developer: {
    id: "developer",
    name: "Developer Tools",
    path: "/tools/developer/",
    description:
      "Useful frontend-ready helpers for JSON, URLs, Base64, UUIDs, regex experiments, and markup cleanup.",
    icon: "bx-code-curly",
  },
  text: {
    id: "text",
    name: "Text Tools",
    path: "/tools/text/",
    description:
      "Clean, analyze, compare, and reformat text blocks quickly in a responsive browser workspace.",
    icon: "bx-text",
  },
  utility: {
    id: "utility",
    name: "Utility Tools",
    path: "/tools/utility/",
    description:
      "Everyday browser tools for passwords, QR codes, hashes, converters, timestamps, units, and calculations.",
    icon: "bx-shield-quarter",
  },
};

export function createTool(definition) {
  const categoryMeta = CATEGORY_META[definition.category];
  return {
    ...definition,
    path: "/tools/" + definition.category + "/" + definition.slug + "/",
    categoryPath: categoryMeta.path,
  };
}
