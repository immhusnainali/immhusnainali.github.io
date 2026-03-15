import {
  CATEGORY_ORDER,
  CATEGORY_META,
  TOOL_REGISTRY,
  getFeaturedTools,
  getRelatedTools,
  getTool,
  getToolsByCategory,
} from "./registry.js";
import { getCategoryCopy, getToolCopy, getUiCopy } from "./i18n.js";
import { clearElement, el } from "./shared/dom.js";
import { mountTool as mountMergePdf } from "./controllers/merge-pdf.js";
import { mountTool as mountSplitPdf } from "./controllers/split-pdf.js";
import { mountTool as mountWatermarkPdf } from "./controllers/watermark-pdf.js";
import { mountTool as mountImageCompressor } from "./controllers/image-compressor.js";
import { mountTool as mountImageResizer } from "./controllers/image-resizer.js";
import { mountTool as mountJsonFormatter } from "./controllers/json-formatter.js";
import { mountTool as mountPasswordGenerator } from "./controllers/password-generator.js";
import { mountTool as mountQrGenerator } from "./controllers/qr-generator.js";
import { mountTool as mountWordCounter } from "./controllers/word-counter.js";
import { mountTool as mountPlannedTool } from "./controllers/planned-tool.js";

const CONTROLLERS = {
  "merge-pdf": mountMergePdf,
  "split-pdf": mountSplitPdf,
  "watermark-pdf": mountWatermarkPdf,
  "image-compressor": mountImageCompressor,
  "image-resizer": mountImageResizer,
  "json-formatter": mountJsonFormatter,
  "password-generator": mountPasswordGenerator,
  "qr-generator": mountQrGenerator,
  "word-counter": mountWordCounter,
  "planned-tool": mountPlannedTool,
};

function getLanguage() {
  return window.siteShell ? window.siteShell.getLanguage() : "en";
}

function getStatusLabel(tool, uiCopy) {
  return tool.live ? uiCopy.common.liveLabel || "Live" : uiCopy.common.plannedLabel || "Planned";
}

function setMeta(title, description) {
  document.title = title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.setAttribute("content", description);
  }
}

function createBadge(text, modifier) {
  return el("span", { className: "badge badge--" + modifier, text });
}

function renderToolCard(tool, uiCopy, language) {
  const toolCopy = getToolCopy(tool, language);
  const categoryCopy = getCategoryCopy(tool.category, language);
  return el("article", { className: "tool-card" }, [
    el("span", { className: "tool-card__icon bx " + tool.icon }),
    el("div", { className: "tool-card__meta" }, [
      createBadge(categoryCopy.name, "category"),
      createBadge(getStatusLabel(tool, uiCopy), tool.live ? "live" : "planned"),
    ]),
    el("h3", { className: "tool-card__title", text: toolCopy.title }),
    el("p", { className: "tool-card__text", text: toolCopy.shortDescription }),
    el(
      "a",
      {
        className: "tool-link-button" + (tool.live ? "" : " tool-link-button--ghost"),
        attrs: { href: tool.path },
      },
      [tool.live ? uiCopy.common.openTool : uiCopy.common.viewDetails]
    ),
  ]);
}

function renderEmptyState(uiCopy) {
  return el("article", { className: "empty-state" }, [
    el("h3", { text: uiCopy.common.noResultsTitle }),
    el("p", { text: uiCopy.common.noResultsText }),
  ]);
}

function renderTrustSection(uiCopy) {
  return el("section", { className: "tools-panel tools-stack" }, [
    el("div", { className: "section-header" }, [
      el("div", {}, [
        el("span", { className: "section-kicker", text: uiCopy.common.localProcessingShort }),
        el("h2", { className: "section-title", text: uiCopy.landing.trustTitle }),
      ]),
    ]),
    el(
      "div",
      { className: "trust-grid" },
      uiCopy.landing.trustCards.map((card) =>
        el("article", { className: "trust-card" }, [
          el("i", { className: "bx bx-shield-quarter" }),
          el("h3", { text: card.title }),
          el("p", { text: card.text }),
        ])
      )
    ),
  ]);
}

function renderLanding(root, language) {
  const uiCopy = getUiCopy(language);
  const featuredTools = getFeaturedTools();
  const toolGrid = el("div", { className: "tool-grid" });
  const categoryRow = el("div", { className: "chip-row" });
  const searchInput = el("input", {
    attrs: { placeholder: uiCopy.landing.searchPlaceholder, "aria-label": uiCopy.landing.searchLabel },
  });
  let activeCategory = "all";
  let activeSearch = "";

  function filteredTools() {
    return TOOL_REGISTRY.filter((tool) => {
      if (activeCategory !== "all" && tool.category !== activeCategory) {
        return false;
      }

      if (!activeSearch) {
        return true;
      }

      const toolCopy = getToolCopy(tool, language);
      const categoryCopy = getCategoryCopy(tool.category, language);
      const haystack = [
        toolCopy.title,
        toolCopy.shortDescription,
        toolCopy.description,
        categoryCopy.name,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(activeSearch);
    });
  }

  function renderGrid() {
    toolGrid.innerHTML = "";
    const tools = filteredTools();
    if (!tools.length) {
      toolGrid.appendChild(renderEmptyState(uiCopy));
      return;
    }

    tools.forEach((tool) => toolGrid.appendChild(renderToolCard(tool, uiCopy, language)));
  }

  const allButton = el("button", {
    className: "chip-button chip-button--active",
    type: "button",
    text: uiCopy.common.allCategories,
  });
  allButton.addEventListener("click", () => {
    activeCategory = "all";
    categoryRow.querySelectorAll(".chip-button").forEach((button) =>
      button.classList.remove("chip-button--active")
    );
    allButton.classList.add("chip-button--active");
    renderGrid();
  });
  categoryRow.appendChild(allButton);

  CATEGORY_ORDER.forEach((categoryId) => {
    const categoryCopy = getCategoryCopy(categoryId, language);
    const button = el("button", {
      className: "chip-button",
      type: "button",
      text: categoryCopy.name,
    });
    button.addEventListener("click", () => {
      activeCategory = categoryId;
      categoryRow.querySelectorAll(".chip-button").forEach((item) =>
        item.classList.remove("chip-button--active")
      );
      button.classList.add("chip-button--active");
      renderGrid();
    });
    categoryRow.appendChild(button);
  });

  searchInput.addEventListener("input", () => {
    activeSearch = searchInput.value.trim().toLowerCase();
    renderGrid();
  });

  root.appendChild(
    el("div", { className: "tools-page tools-stack" }, [
      el("section", { className: "tools-hero" }, [
        el("div", { className: "hero-grid" }, [
          el("div", {}, [
            el("span", { className: "hero-kicker", text: uiCopy.landing.eyebrow }),
            el("h1", { className: "tools-hero__title", text: uiCopy.landing.title }),
            el("p", { className: "tools-hero__text", text: uiCopy.landing.subtitle }),
          ]),
          el("aside", { className: "hero-card" }, [
            el("div", { className: "kpi-list" }, [
              el("div", { className: "kpi-item" }, [
                el("strong", { text: String(TOOL_REGISTRY.length) }),
                el("span", { text: "Dedicated tool pages" }),
              ]),
              el("div", { className: "kpi-item" }, [
                el("strong", { text: String(featuredTools.length) }),
                el("span", { text: "Featured live tools" }),
              ]),
              el("div", { className: "kpi-item" }, [
                el("strong", { text: "100%" }),
                el("span", { text: "Static-hosting compatible" }),
              ]),
            ]),
          ]),
        ]),
      ]),
      el("section", { className: "tools-panel tools-stack" }, [
        el("div", { className: "section-header" }, [
          el("div", {}, [
            el("span", { className: "section-kicker", text: uiCopy.common.searchTools }),
            el("h2", { className: "section-title", text: uiCopy.landing.allToolsTitle }),
            el("p", { className: "section-text", text: uiCopy.landing.allToolsText }),
          ]),
        ]),
        el("label", { className: "tools-search" }, [
          el("i", { className: "bx bx-search" }),
          searchInput,
        ]),
        categoryRow,
        toolGrid,
      ]),
      el("section", { className: "tools-panel tools-stack" }, [
        el("div", { className: "section-header" }, [
          el("div", {}, [
            el("span", { className: "section-kicker", text: uiCopy.common.featured }),
            el("h2", { className: "section-title", text: uiCopy.landing.featuredTitle }),
            el("p", { className: "section-text", text: uiCopy.landing.featuredText }),
          ]),
        ]),
        el(
          "div",
          { className: "tool-grid" },
          featuredTools.map((tool) => renderToolCard(tool, uiCopy, language))
        ),
      ]),
      renderTrustSection(uiCopy),
    ])
  );

  renderGrid();
  setMeta("Browser Tools Hub | Muhammad Husnain Ali", uiCopy.landing.subtitle);
}

function renderCategoryPage(root, categoryId, language) {
  const uiCopy = getUiCopy(language);
  const categoryCopy = getCategoryCopy(categoryId, language);
  const searchInput = el("input", {
    attrs: {
      placeholder: uiCopy.categoryPage.searchPlaceholder,
      "aria-label": uiCopy.categoryPage.searchLabel,
    },
  });
  const toolGrid = el("div", { className: "tool-grid" });
  let activeStatus = "all";
  let activeSearch = "";

  function filteredTools() {
    return getToolsByCategory(categoryId).filter((tool) => {
      if (activeStatus === "live" && !tool.live) return false;
      if (activeStatus === "planned" && tool.live) return false;
      if (!activeSearch) return true;

      const toolCopy = getToolCopy(tool, language);
      return [toolCopy.title, toolCopy.shortDescription, toolCopy.description]
        .join(" ")
        .toLowerCase()
        .includes(activeSearch);
    });
  }

  function renderGrid() {
    toolGrid.innerHTML = "";
    const tools = filteredTools();
    if (!tools.length) {
      toolGrid.appendChild(renderEmptyState(uiCopy));
      return;
    }

    tools.forEach((tool) => toolGrid.appendChild(renderToolCard(tool, uiCopy, language)));
  }

  const statusRow = el("div", { className: "chip-row" });
  [
    ["all", uiCopy.categoryPage.statusAll],
    ["live", uiCopy.categoryPage.statusLive],
    ["planned", uiCopy.categoryPage.statusPlanned],
  ].forEach(([value, label], index) => {
    const button = el("button", {
      className: "chip-button" + (index === 0 ? " chip-button--active" : ""),
      type: "button",
      text: label,
    });
    button.addEventListener("click", () => {
      activeStatus = value;
      statusRow.querySelectorAll(".chip-button").forEach((item) =>
        item.classList.remove("chip-button--active")
      );
      button.classList.add("chip-button--active");
      renderGrid();
    });
    statusRow.appendChild(button);
  });

  searchInput.addEventListener("input", () => {
    activeSearch = searchInput.value.trim().toLowerCase();
    renderGrid();
  });

  root.appendChild(
    el("div", { className: "tools-page tools-stack" }, [
      el("section", { className: "tools-hero" }, [
        el("span", { className: "hero-kicker", text: uiCopy.categoryPage.eyebrow }),
        el("h1", { className: "tools-hero__title", text: categoryCopy.name }),
        el("p", { className: "tools-hero__text", text: categoryCopy.description }),
      ]),
      el("section", { className: "tools-panel tools-stack" }, [
        el("div", { className: "section-header" }, [
          el("div", {}, [
            el("h2", { className: "section-title", text: uiCopy.categoryPage.sectionTitle }),
            el("p", { className: "section-text", text: categoryCopy.description }),
          ]),
        ]),
        el("label", { className: "tools-search" }, [
          el("i", { className: "bx bx-search" }),
          searchInput,
        ]),
        statusRow,
        toolGrid,
      ]),
    ])
  );

  renderGrid();
  setMeta(
    categoryCopy.name + " | Browser Tools Hub",
    categoryCopy.description
  );
}

function renderToolPage(root, toolId, language) {
  const tool = getTool(toolId);
  if (!tool) {
    root.appendChild(
      el("article", { className: "empty-state" }, [
        el("h2", { text: "Tool not found" }),
        el("p", { text: "This tool page could not be loaded from the registry." }),
      ])
    );
    return;
  }

  const uiCopy = getUiCopy(language);
  const toolCopy = getToolCopy(tool, language);
  const categoryCopy = getCategoryCopy(tool.category, language);
  const statusEl = el("div", { className: "tool-status", text: uiCopy.common.ready });
  const workspaceRoot = el("div", { className: "tools-stack" });

  root.appendChild(
    el("div", { className: "tools-page tools-stack" }, [
      el("section", { className: "tools-hero tools-stack" }, [
        el("div", { className: "breadcrumbs" }, [
          el("a", { attrs: { href: "/tools/" }, text: uiCopy.toolPage.breadcrumbHome }),
          el("span", { text: "/" }),
          el("a", { attrs: { href: categoryCopy.path || CATEGORY_META[tool.category].path }, text: categoryCopy.name }),
          el("span", { text: "/" }),
          el("span", { text: toolCopy.title }),
        ]),
        el("div", { className: "tool-title-row" }, [
          el("div", {}, [
            el("span", { className: "hero-kicker", text: categoryCopy.name }),
            el("h1", { className: "tools-hero__title", text: toolCopy.title }),
            el("p", { className: "tools-hero__text", text: toolCopy.description }),
          ]),
          createBadge(getStatusLabel(tool, uiCopy), tool.live ? "live" : "planned"),
        ]),
        tool.supportsLocalProcessingNote
          ? el("div", { className: "tool-trust-note", text: uiCopy.toolPage.localNote })
          : null,
      ]),
      el("div", { className: "tool-page-grid" }, [
        el("section", { className: "tool-workspace" }, [statusEl, workspaceRoot]),
        el("aside", { className: "tool-sidebar" }, [
          el("article", { className: "tool-sidebar-card" }, [
            el("h2", { text: uiCopy.toolPage.usageTitle }),
            el(
              "ul",
              { className: "tool-sidebar-list" },
              toolCopy.usage.map((item) => el("li", { text: item }))
            ),
          ]),
          el("article", { className: "tool-sidebar-card" }, [
            el("h2", { text: uiCopy.toolPage.relatedTitle }),
            el(
              "div",
              { className: "tool-grid" },
              getRelatedTools(tool).slice(0, 3).map((relatedTool) =>
                renderToolCard(relatedTool, uiCopy, language)
              )
            ),
          ]),
        ]),
      ]),
    ])
  );

  const controller = CONTROLLERS[tool.controller] || mountPlannedTool;
  controller({
    root: workspaceRoot,
    statusEl,
    tool: toolCopy,
    uiCopy,
    language,
  });

  setMeta(toolCopy.seo.title, toolCopy.seo.description);
}

function renderPage() {
  const root = clearElement(document.querySelector("[data-tools-app]"));
  if (!root) {
    return;
  }

  const body = document.body;
  const language = getLanguage();
  const pageType = body.dataset.toolsPage;

  if (pageType === "landing") {
    renderLanding(root, language);
    return;
  }

  if (pageType === "category") {
    renderCategoryPage(root, body.dataset.categoryId, language);
    return;
  }

  if (pageType === "tool") {
    renderToolPage(root, body.dataset.toolId, language);
    return;
  }

  root.appendChild(
    el("article", { className: "empty-state" }, [
      el("h2", { text: "Unknown tools page" }),
      el("p", { text: "Check the page dataset configuration for this route." }),
    ])
  );
}

renderPage();
window.addEventListener("language-changed", renderPage);
