import { pdfTools } from "./data/pdf-tools.js";
import { imageTools } from "./data/image-tools.js";
import { developerTools } from "./data/developer-tools.js";
import { textTools } from "./data/text-tools.js";
import { utilityTools } from "./data/utility-tools.js";
export { CATEGORY_ORDER, CATEGORY_META, createTool } from "./data/catalog.js";
export const SITE_URL = "https://immhusnainali.github.io";

export const TOOL_REGISTRY = [
  ...pdfTools,
  ...imageTools,
  ...developerTools,
  ...textTools,
  ...utilityTools,
];

export const TOOL_MAP = TOOL_REGISTRY.reduce((accumulator, tool) => {
  accumulator[tool.id] = tool;
  return accumulator;
}, {});

export function getTool(toolId) {
  return TOOL_MAP[toolId] || null;
}

export function getToolsByCategory(categoryId) {
  return TOOL_REGISTRY.filter((tool) => tool.category === categoryId);
}

export function getFeaturedTools() {
  return TOOL_REGISTRY.filter((tool) => tool.featured);
}

export function getLiveTools() {
  return TOOL_REGISTRY.filter((tool) => tool.live);
}

export function getRelatedTools(tool) {
  return (tool.relatedTools || [])
    .map((toolId) => getTool(toolId))
    .filter(Boolean);
}
