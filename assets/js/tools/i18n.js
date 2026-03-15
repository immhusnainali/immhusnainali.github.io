import { CATEGORY_META } from "./registry.js";

const ENGLISH_COPY = {
  landing: {
    eyebrow: "Static, local-first browser utilities",
    title: "Browser Tools Hub",
    subtitle:
      "A polished collection of frontend-only tools designed for GitHub Pages deployment, fast local processing, and trustworthy browser workflows.",
    searchLabel: "Search tools",
    searchPlaceholder: "Search by tool name, category, or use case",
    featuredTitle: "Live tools",
    featuredText:
      "These are the browser-only tools currently available and working in the hub.",
    allToolsTitle: "Browse every tool",
    allToolsText:
      "Use category filters and search to jump directly to the workflow you need.",
    trustTitle: "Runs locally in your browser",
    trustCards: [
      {
        title: "No backend required",
        text: "Everything here is built for static hosting and GitHub Pages deployment.",
      },
      {
        title: "Private by default",
        text: "Supported file tools keep processing on your device instead of uploading data.",
      },
      {
        title: "Easy to extend",
        text: "The registry-driven structure makes new tools and categories straightforward to add.",
      },
    ],
  },
  categoryPage: {
    eyebrow: "Category view",
    searchLabel: "Search in category",
    searchPlaceholder: "Filter tools in this category",
    statusAll: "All statuses",
    statusLive: "Live tools",
    statusPlanned: "Planned tools",
    sectionTitle: "Tools in this category",
  },
  toolPage: {
    breadcrumbHome: "Tools",
    breadcrumbCategory: "Category",
    usageTitle: "How to use",
    relatedTitle: "Related tools",
    localNote:
      "Processed locally in your browser. Your files and text stay on this device while you use supported live tools.",
    plannedTitle: "Planned browser-only workflow",
    plannedText:
      "This route is ready, but the interactive experience is still intentionally marked as planned until the browser-only workflow is fully shipped.",
    plannedHint:
      "Use the related live tools below while this page stays in the roadmap queue.",
  },
  common: {
    allCategories: "All categories",
    featured: "Featured",
    openTool: "Open tool",
    viewDetails: "View details",
    noResultsTitle: "No tools matched your filters",
    noResultsText: "Try a different keyword or reset the category and status filters.",
    localProcessingShort: "Processed locally in your browser",
    chooseFiles: "Choose files",
    chooseFile: "Choose file",
    clear: "Clear",
    copy: "Copy",
    download: "Download",
    downloadZip: "Download ZIP",
    processing: "Processing...",
    runTool: "Run tool",
    generate: "Generate",
    validate: "Validate",
    format: "Format",
    minify: "Minify",
    remove: "Remove",
    moveUp: "Move up",
    moveDown: "Move down",
    quality: "Quality",
    formatLabel: "Format",
    width: "Width",
    height: "Height",
    lockRatio: "Lock aspect ratio",
    ranges: "Custom ranges",
    perPage: "One file per page",
    watermarkText: "Watermark text",
    size: "Size",
    opacity: "Opacity",
    rotation: "Rotation",
    placement: "Placement",
    output: "Output",
    result: "Result",
    original: "Original",
    copied: "Copied to clipboard.",
    invalidJson: "Invalid JSON. Please check the input and try again.",
    uploadPdf: "Drop PDF files here or choose them manually.",
    uploadOnePdf: "Drop one PDF file here or choose it manually.",
    uploadImages: "Drop images here or choose them manually.",
    words: "Words",
    characters: "Characters",
    charactersNoSpaces: "Characters without spaces",
    sentences: "Sentences",
    paragraphs: "Paragraphs",
    readingTime: "Reading time",
    strong: "Strong",
    good: "Good",
    fair: "Fair",
    weak: "Weak",
    emptyInput: "Add content first to continue.",
    unsupportedFiles: "Some files were skipped because their type is not supported.",
    invalidFile: "Please upload a supported file.",
    ready: "Ready when you are.",
    searchTools: "Search tools",
    filesAdded: "Files added successfully.",
    generated: "Your output is ready to download.",
    liveLabel: "Live",
    plannedLabel: "Planned",
    mergePdfAction: "Merge PDF",
    splitPdfAction: "Split PDF",
    watermarkAction: "Apply watermark",
    compressImagesAction: "Compress images",
    resizeImagesAction: "Resize images",
    lengthLabel: "Length",
    generatedPasswordLabel: "Generated password",
    strengthLabel: "Strength",
    modeLabel: "Mode",
    presetLabel: "Preset",
    darkColorLabel: "Dark color",
    lightColorLabel: "Light color",
    png: "PNG",
    jpg: "JPG",
    webp: "WebP",
    originalFormat: "Original format",
    center: "Center",
    header: "Header",
    footer: "Footer",
    diagonal: "Diagonal",
  },
  categories: Object.fromEntries(
    Object.entries(CATEGORY_META).map(([key, value]) => [
      key,
      { name: value.name, description: value.description },
    ])
  ),
};

const UI_TRANSLATIONS = {
  ur: {
    landing: {
      eyebrow: "Static aur local-first browser utilities",
      subtitle:
        "Frontend-only tools ka ek polished collection jo GitHub Pages, local processing aur trustworthy browser workflows ke liye banaya gaya hai.",
      searchLabel: "Tools search karein",
      searchPlaceholder: "Tool name, category ya use case se search karein",
      featuredTitle: "Live tools",
      featuredText: "Yeh is hub ke woh browser-only tools hain jo abhi live aur working hain.",
      allToolsTitle: "Har tool browse karein",
      allToolsText:
        "Category filters aur search ke zariye seedha apne workflow tak pohanchein.",
      trustTitle: "Aap ke browser mein locally chalta hai",
    },
    categoryPage: {
      eyebrow: "Category view",
      searchLabel: "Category mein search karein",
      searchPlaceholder: "Is category ke tools filter karein",
      statusAll: "Sab statuses",
      statusLive: "Live tools",
      statusPlanned: "Planned tools",
      sectionTitle: "Is category ke tools",
    },
    toolPage: {
      breadcrumbHome: "Tools",
      breadcrumbCategory: "Category",
      usageTitle: "Istemaal ka tareeqa",
      relatedTitle: "Related tools",
      localNote:
        "Processing aap ke browser mein locally hoti hai. Supported live tools aap ka data device se bahar nahi bhejte.",
      plannedTitle: "Planned browser-only workflow",
      plannedText:
        "Yeh route ready hai, lekin interactive workflow abhi planned status mein hai jab tak browser-only version poori tarah ship na ho.",
      plannedHint:
        "Jab tak yeh page roadmap mein hai tab tak neeche diye gaye live tools use karein.",
    },
    common: {
      allCategories: "Sab categories",
      openTool: "Tool kholein",
      viewDetails: "Details dekhein",
      noResultsTitle: "Koi tool match nahi hua",
      noResultsText: "Dusra keyword use karein ya filters reset karein.",
      localProcessingShort: "Browser mein locally process hota hai",
      chooseFiles: "Files choose karein",
      chooseFile: "File choose karein",
      clear: "Clear",
      copy: "Copy",
      download: "Download",
      downloadZip: "ZIP download",
      processing: "Processing...",
      runTool: "Tool chalayein",
      generate: "Generate",
      validate: "Validate",
      format: "Format",
      minify: "Minify",
      remove: "Remove",
      moveUp: "Upar",
      moveDown: "Neeche",
      lockRatio: "Aspect ratio lock karein",
      copied: "Clipboard par copy ho gaya.",
      emptyInput: "Aage barhne ke liye pehle content add karein.",
      invalidFile: "Meherbani karke supported file upload karein.",
      ready: "Jab aap ready hon.",
      searchTools: "Tools search karein",
      liveLabel: "Live",
      plannedLabel: "Planned",
      mergePdfAction: "Merge PDF",
      splitPdfAction: "Split PDF",
      watermarkAction: "Watermark lagayein",
      compressImagesAction: "Images compress karein",
      resizeImagesAction: "Images resize karein",
      lengthLabel: "Length",
      generatedPasswordLabel: "Generated password",
      strengthLabel: "Strength",
      modeLabel: "Mode",
      presetLabel: "Preset",
      darkColorLabel: "Dark color",
      lightColorLabel: "Light color",
      png: "PNG",
      jpg: "JPG",
      webp: "WebP",
      originalFormat: "Original format",
      center: "Center",
      header: "Header",
      footer: "Footer",
      diagonal: "Diagonal",
    },
    categories: {
      image: { name: "Image Tools" },
      developer: { name: "Developer Tools" },
      text: { name: "Text Tools" },
      utility: { name: "Utility Tools" },
    },
  },
  es: {
    landing: {
      eyebrow: "Utilidades estaticas y locales",
      subtitle:
        "Una coleccion cuidada de herramientas frontend-only para GitHub Pages, procesamiento local y flujos de trabajo confiables.",
      searchLabel: "Buscar herramientas",
      searchPlaceholder: "Busca por nombre, categoria o caso de uso",
      featuredTitle: "Herramientas activas",
      allToolsTitle: "Explorar todas las herramientas",
      trustTitle: "Se ejecuta localmente en tu navegador",
    },
    categoryPage: {
      searchLabel: "Buscar en la categoria",
      searchPlaceholder: "Filtrar herramientas en esta categoria",
      statusAll: "Todos los estados",
      statusLive: "Herramientas activas",
      statusPlanned: "Herramientas planeadas",
    },
    toolPage: {
      usageTitle: "Como usarla",
      relatedTitle: "Herramientas relacionadas",
      localNote:
        "Procesado localmente en tu navegador. Los archivos y textos compatibles permanecen en este dispositivo.",
      plannedTitle: "Flujo planeado para el navegador",
      plannedText:
        "La ruta ya existe, pero la experiencia interactiva sigue marcada como planeada hasta que el flujo local este terminado.",
      plannedHint:
        "Mientras tanto, usa las herramientas activas relacionadas que aparecen abajo.",
    },
    common: {
      allCategories: "Todas las categorias",
      openTool: "Abrir herramienta",
      viewDetails: "Ver detalles",
      noResultsTitle: "No hubo coincidencias",
      noResultsText: "Prueba otra palabra o reinicia los filtros.",
      localProcessingShort: "Procesado localmente en tu navegador",
      chooseFiles: "Elegir archivos",
      chooseFile: "Elegir archivo",
      download: "Descargar",
      downloadZip: "Descargar ZIP",
      copy: "Copiar",
      clear: "Limpiar",
      generate: "Generar",
      validate: "Validar",
      format: "Formatear",
      minify: "Minificar",
      moveUp: "Subir",
      moveDown: "Bajar",
      copied: "Copiado al portapapeles.",
      emptyInput: "Agrega contenido antes de continuar.",
      ready: "Listo cuando quieras.",
      searchTools: "Buscar herramientas",
      liveLabel: "Activa",
      plannedLabel: "Planeada",
      mergePdfAction: "Unir PDF",
      splitPdfAction: "Dividir PDF",
      watermarkAction: "Aplicar marca",
      compressImagesAction: "Comprimir imagenes",
      resizeImagesAction: "Redimensionar imagenes",
      lengthLabel: "Longitud",
      generatedPasswordLabel: "Contrasena generada",
      strengthLabel: "Fortaleza",
      modeLabel: "Modo",
      presetLabel: "Preajuste",
      darkColorLabel: "Color oscuro",
      lightColorLabel: "Color claro",
    },
  },
  fr: {
    landing: {
      eyebrow: "Utilitaires statiques et locaux",
      subtitle:
        "Une collection soignee d'outils frontend-only pour GitHub Pages, le traitement local et des flux fiables.",
      searchLabel: "Rechercher des outils",
      searchPlaceholder: "Rechercher par nom, categorie ou usage",
      featuredTitle: "Outils actifs",
      allToolsTitle: "Parcourir tous les outils",
      trustTitle: "Fonctionne localement dans votre navigateur",
    },
    categoryPage: {
      searchLabel: "Rechercher dans la categorie",
      searchPlaceholder: "Filtrer les outils de cette categorie",
      statusAll: "Tous les statuts",
      statusLive: "Outils actifs",
      statusPlanned: "Outils planifies",
    },
    toolPage: {
      usageTitle: "Mode d'emploi",
      relatedTitle: "Outils lies",
      localNote:
        "Traite localement dans votre navigateur. Les fichiers et textes pris en charge restent sur cet appareil.",
      plannedTitle: "Flux navigateur planifie",
      plannedText:
        "La page existe deja, mais l'experience interactive reste volontairement en statut planifie.",
      plannedHint:
        "Utilisez les outils actifs associes ci-dessous pendant la preparation de ce flux.",
    },
    common: {
      allCategories: "Toutes les categories",
      openTool: "Ouvrir l'outil",
      viewDetails: "Voir les details",
      noResultsTitle: "Aucun outil ne correspond",
      noResultsText: "Essayez un autre mot-cle ou reinitialisez les filtres.",
      localProcessingShort: "Traite localement dans votre navigateur",
      chooseFiles: "Choisir des fichiers",
      chooseFile: "Choisir un fichier",
      download: "Telecharger",
      downloadZip: "Telecharger ZIP",
      copy: "Copier",
      clear: "Effacer",
      generate: "Generer",
      validate: "Valider",
      format: "Formatter",
      minify: "Minifier",
      copied: "Copie dans le presse-papiers.",
      emptyInput: "Ajoutez du contenu avant de continuer.",
      ready: "Pret quand vous voulez.",
      searchTools: "Rechercher des outils",
      liveLabel: "Actif",
      plannedLabel: "Planifie",
      mergePdfAction: "Fusionner PDF",
      splitPdfAction: "Decouper PDF",
      watermarkAction: "Appliquer le filigrane",
      compressImagesAction: "Compresser les images",
      resizeImagesAction: "Redimensionner les images",
      lengthLabel: "Longueur",
      generatedPasswordLabel: "Mot de passe genere",
      strengthLabel: "Force",
      modeLabel: "Mode",
      presetLabel: "Preset",
      darkColorLabel: "Couleur sombre",
      lightColorLabel: "Couleur claire",
    },
  },
  ar: {
    landing: {
      eyebrow:
        "\u0627\u062f\u0648\u0627\u062a \u062b\u0627\u0628\u062a\u0629 \u0648\u0645\u062d\u0644\u064a\u0629",
      subtitle:
        "\u0645\u062c\u0645\u0648\u0639\u0629 \u0627\u062f\u0648\u0627\u062a frontend-only \u0645\u0635\u0645\u0645\u0629 \u0644\u0640 GitHub Pages \u0648\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629 \u0627\u0644\u0645\u062d\u0644\u064a\u0629 \u0648\u0627\u0644\u0648\u062b\u0648\u0642.",
      searchLabel:
        "\u0627\u0628\u062d\u062b \u0639\u0646 \u0627\u0644\u0627\u062f\u0648\u0627\u062a",
      searchPlaceholder:
        "\u0627\u0628\u062d\u062b \u0628\u0627\u0633\u0645 \u0627\u0644\u0627\u062f\u0627\u0629 \u0627\u0648 \u0627\u0644\u0641\u0626\u0629 \u0627\u0648 \u062d\u0627\u0644\u0629 \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645",
      featuredTitle:
        "\u0627\u0644\u0627\u062f\u0648\u0627\u062a \u0627\u0644\u062c\u0627\u0647\u0632\u0629",
      allToolsTitle:
        "\u062a\u0635\u0641\u062d \u062c\u0645\u064a\u0639 \u0627\u0644\u0627\u062f\u0648\u0627\u062a",
      trustTitle:
        "\u064a\u0639\u0645\u0644 \u0645\u062d\u0644\u064a\u0627 \u0641\u064a \u0645\u062a\u0635\u0641\u062d\u0643",
    },
    categoryPage: {
      searchLabel:
        "\u0627\u0628\u062d\u062b \u062f\u0627\u062e\u0644 \u0627\u0644\u0641\u0626\u0629",
      searchPlaceholder:
        "\u0642\u0645 \u0628\u062a\u0635\u0641\u064a\u0629 \u0627\u062f\u0648\u0627\u062a \u0647\u0630\u0647 \u0627\u0644\u0641\u0626\u0629",
      statusAll:
        "\u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0627\u0644\u0627\u062a",
      statusLive:
        "\u0627\u062f\u0648\u0627\u062a \u062c\u0627\u0647\u0632\u0629",
      statusPlanned:
        "\u0627\u062f\u0648\u0627\u062a \u0645\u062e\u0637\u0637 \u0644\u0647\u0627",
    },
    toolPage: {
      usageTitle:
        "\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645",
      relatedTitle:
        "\u0627\u062f\u0648\u0627\u062a \u0630\u0627\u062a \u0635\u0644\u0629",
      localNote:
        "\u062a\u062a\u0645 \u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629 \u0645\u062d\u0644\u064a\u0627 \u0641\u064a \u0645\u062a\u0635\u0641\u062d\u0643. \u062a\u0628\u0642\u0649 \u0627\u0644\u0645\u0644\u0641\u0627\u062a \u0648\u0627\u0644\u0646\u0635\u0648\u0635 \u0639\u0644\u0649 \u0647\u0630\u0627 \u0627\u0644\u062c\u0647\u0627\u0632.",
      plannedTitle:
        "\u0633\u064a\u0631 \u0639\u0645\u0644 \u0645\u062e\u0637\u0637 \u0644\u0644\u0645\u062a\u0635\u0641\u062d",
      plannedText:
        "\u0647\u0630\u0647 \u0627\u0644\u0635\u0641\u062d\u0629 \u062c\u0627\u0647\u0632\u0629 \u0648\u0644\u0643\u0646 \u0627\u0644\u0623\u062f\u0627\u0629 \u0627\u0644\u062a\u0641\u0627\u0639\u0644\u064a\u0629 \u0644\u0627 \u062a\u0632\u0627\u0644 \u0645\u062e\u0637\u0637\u0629.",
      plannedHint:
        "\u0627\u0633\u062a\u062e\u062f\u0645 \u0627\u0644\u0627\u062f\u0648\u0627\u062a \u0627\u0644\u062d\u064a\u0629 \u0627\u0644\u0645\u0631\u062a\u0628\u0637\u0629 \u0627\u062f\u0646\u0627\u0647 \u0627\u0644\u0649 \u0627\u0646 \u064a\u062a\u0645 \u0625\u0637\u0644\u0627\u0642 \u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u0627\u0631.",
    },
    common: {
      allCategories:
        "\u062c\u0645\u064a\u0639 \u0627\u0644\u0641\u0626\u0627\u062a",
      openTool:
        "\u0627\u0641\u062a\u062d \u0627\u0644\u0627\u062f\u0627\u0629",
      viewDetails:
        "\u0639\u0631\u0636 \u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644",
      noResultsTitle:
        "\u0644\u0627 \u062a\u0648\u062c\u062f \u0627\u062f\u0648\u0627\u062a \u0645\u0637\u0627\u0628\u0642\u0629",
      noResultsText:
        "\u062c\u0631\u0628 \u0643\u0644\u0645\u0629 \u0627\u062e\u0631\u0649 \u0627\u0648 \u0627\u0639\u062f \u0636\u0628\u0637 \u0627\u0644\u0641\u0644\u0627\u062a\u0631.",
      localProcessingShort:
        "\u0645\u0639\u0627\u0644\u062c\u0629 \u0645\u062d\u0644\u064a\u0629 \u0641\u064a \u0645\u062a\u0635\u0641\u062d\u0643",
      chooseFiles:
        "\u0627\u062e\u062a\u0631 \u0645\u0644\u0641\u0627\u062a",
      chooseFile:
        "\u0627\u062e\u062a\u0631 \u0645\u0644\u0641\u0627",
      download:
        "\u062a\u062d\u0645\u064a\u0644",
      downloadZip:
        "\u062a\u062d\u0645\u064a\u0644 ZIP",
      copy:
        "\u0646\u0633\u062e",
      clear:
        "\u0645\u0633\u062d",
      generate:
        "\u0627\u0646\u0634\u0627\u0621",
      copied:
        "\u062a\u0645 \u0627\u0644\u0646\u0633\u062e \u0627\u0644\u0649 \u0627\u0644\u062d\u0627\u0641\u0638\u0629.",
      emptyInput:
        "\u0627\u0636\u0641 \u0645\u062d\u062a\u0648\u0649 \u0627\u0648\u0644\u0627.",
      ready:
        "\u062c\u0627\u0647\u0632 \u0639\u0646\u062f\u0645\u0627 \u062a\u0631\u064a\u062f.",
      searchTools:
        "\u0627\u0628\u062d\u062b \u0639\u0646 \u0627\u0644\u0627\u062f\u0648\u0627\u062a",
      liveLabel:
        "\u062c\u0627\u0647\u0632",
      plannedLabel:
        "\u0645\u062e\u0637\u0637",
      mergePdfAction:
        "\u062f\u0645\u062c PDF",
      splitPdfAction:
        "\u062a\u0642\u0633\u064a\u0645 PDF",
      watermarkAction:
        "\u062a\u0637\u0628\u064a\u0642 \u0627\u0644\u0639\u0644\u0627\u0645\u0629",
      compressImagesAction:
        "\u0636\u063a\u0637 \u0627\u0644\u0635\u0648\u0631",
      resizeImagesAction:
        "\u062a\u063a\u064a\u064a\u0631 \u062d\u062c\u0645 \u0627\u0644\u0635\u0648\u0631",
      lengthLabel:
        "\u0627\u0644\u0637\u0648\u0644",
      generatedPasswordLabel:
        "\u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u0645\u0648\u0644\u062f\u0629",
      strengthLabel:
        "\u0627\u0644\u0642\u0648\u0629",
      modeLabel:
        "\u0627\u0644\u0648\u0636\u0639",
      presetLabel:
        "\u0627\u0639\u062f\u0627\u062f \u0645\u0633\u0628\u0642",
      darkColorLabel:
        "\u0644\u0648\u0646 \u062f\u0627\u0643\u0646",
      lightColorLabel:
        "\u0644\u0648\u0646 \u0641\u0627\u062a\u062d",
    },
  },
};

function mergeNested(baseSection, overrideSection) {
  return {
    ...baseSection,
    ...overrideSection,
  };
}

export function getUiCopy(language) {
  const override = UI_TRANSLATIONS[language] || {};
  return {
    landing: mergeNested(ENGLISH_COPY.landing, override.landing),
    categoryPage: mergeNested(ENGLISH_COPY.categoryPage, override.categoryPage),
    toolPage: mergeNested(ENGLISH_COPY.toolPage, override.toolPage),
    common: mergeNested(ENGLISH_COPY.common, override.common),
    categories: {
      ...ENGLISH_COPY.categories,
      ...(override.categories || {}),
    },
  };
}

export function getCategoryCopy(categoryId, language) {
  const copy = getUiCopy(language);
  const englishCategory = CATEGORY_META[categoryId];
  const override = copy.categories[categoryId] || {};
  return {
    ...englishCategory,
    ...override,
  };
}

export function getToolCopy(tool, language) {
  const overrides =
    (UI_TRANSLATIONS[language] &&
      UI_TRANSLATIONS[language].toolOverrides &&
      UI_TRANSLATIONS[language].toolOverrides[tool.id]) ||
    {};

  return {
    ...tool,
    ...overrides,
    usage: overrides.usage || tool.usage,
    seo: {
      ...tool.seo,
      ...(overrides.seo || {}),
    },
  };
}
