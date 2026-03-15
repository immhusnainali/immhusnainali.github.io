(function () {
  const STORAGE_KEYS = {
    theme: "selected-theme",
    icon: "selected-icon",
    language: "selected-language",
  };

  const LIGHT_THEME_CLASS = "light-theme";
  const ICON_THEME_CLASS = "bx-sun";
  const DEFAULT_LANGUAGE = "en";
  const SUPPORTED_LANGUAGES = ["en", "ur", "es", "fr", "ar"];

  const SHELL_TRANSLATIONS = {
    en: {
      shellTitle: "Browser Tools Hub",
      backHome: "Portfolio",
      toolsHome: "All Tools",
      pdf: "PDF",
      image: "Image",
      developer: "Developer",
      text: "Text",
      utility: "Utility",
      footerTitle:
        "Browser-first utilities for PDFs, images, developer workflows, text cleanup, and daily productivity.",
      footerNote: "All supported tools run locally in your browser.",
      footerExplore: "Explore",
      footerConnect: "Connect",
      footerGithub: "GitHub",
      footerLinkedIn: "LinkedIn",
      footerEmail: "Email",
      footerCopy: "All rights reserved.",
    },
    ur: {
      shellTitle: "Browser Tools Hub",
      backHome: "Portfolio",
      toolsHome: "Tamam Tools",
      pdf: "PDF",
      image: "Image",
      developer: "Developer",
      text: "Text",
      utility: "Utility",
      footerTitle:
        "Browser ke andar chalne wale tools jo PDFs, images, developer workflows, text cleanup aur rozmarra productivity ko handle karte hain.",
      footerNote:
        "Jo tools support kiye gaye hain woh aap ke browser mein locally chalte hain.",
      footerExplore: "Explore",
      footerConnect: "Connect",
      footerGithub: "GitHub",
      footerLinkedIn: "LinkedIn",
      footerEmail: "Email",
      footerCopy: "Tamam huqooq mehfooz hain.",
    },
    es: {
      shellTitle: "Centro de Herramientas",
      backHome: "Portafolio",
      toolsHome: "Todas las herramientas",
      pdf: "PDF",
      image: "Imagen",
      developer: "Desarrollo",
      text: "Texto",
      utility: "Utilidad",
      footerTitle:
        "Utilidades que funcionan en el navegador para PDFs, imagenes, flujos de desarrollo, limpieza de texto y productividad.",
      footerNote:
        "Las herramientas compatibles se ejecutan localmente en tu navegador.",
      footerExplore: "Explorar",
      footerConnect: "Conectar",
      footerGithub: "GitHub",
      footerLinkedIn: "LinkedIn",
      footerEmail: "Correo",
      footerCopy: "Todos los derechos reservados.",
    },
    fr: {
      shellTitle: "Hub d'Outils",
      backHome: "Portfolio",
      toolsHome: "Tous les outils",
      pdf: "PDF",
      image: "Image",
      developer: "Developpeur",
      text: "Texte",
      utility: "Utilitaire",
      footerTitle:
        "Des utilitaires executes dans le navigateur pour les PDF, les images, les flux developpeur, le nettoyage de texte et la productivite.",
      footerNote:
        "Les outils compatibles s'executent localement dans votre navigateur.",
      footerExplore: "Explorer",
      footerConnect: "Contact",
      footerGithub: "GitHub",
      footerLinkedIn: "LinkedIn",
      footerEmail: "Email",
      footerCopy: "Tous droits reserves.",
    },
    ar: {
      shellTitle: "\u0645\u0631\u0643\u0632 \u0627\u0644\u0623\u062f\u0648\u0627\u062a",
      backHome: "\u0645\u0644\u0641 \u0627\u0644\u0627\u0639\u0645\u0627\u0644",
      toolsHome: "\u062c\u0645\u064a\u0639 \u0627\u0644\u0627\u062f\u0648\u0627\u062a",
      pdf: "PDF",
      image: "\u0635\u0648\u0631",
      developer: "\u0645\u0637\u0648\u0631",
      text: "\u0646\u0635",
      utility: "\u0627\u062f\u0648\u0627\u062a",
      footerTitle:
        "\u0627\u062f\u0648\u0627\u062a \u062a\u0639\u0645\u0644 \u062f\u0627\u062e\u0644 \u0627\u0644\u0645\u062a\u0635\u0641\u062d \u0644\u0644\u0645\u0644\u0641\u0627\u062a PDF \u0648\u0627\u0644\u0635\u0648\u0631 \u0648\u0645\u0647\u0627\u0645 \u0627\u0644\u0645\u0637\u0648\u0631 \u0648\u062a\u0646\u0638\u064a\u0641 \u0627\u0644\u0646\u0635 \u0648\u0627\u0644\u0627\u0646\u062a\u0627\u062c\u064a\u0629.",
      footerNote:
        "\u0627\u0644\u0627\u062f\u0648\u0627\u062a \u0627\u0644\u0645\u062f\u0639\u0648\u0645\u0629 \u062a\u0639\u0645\u0644 \u0645\u062d\u0644\u064a\u0627 \u0641\u064a \u0645\u062a\u0635\u0641\u062d\u0643.",
      footerExplore: "\u0627\u0633\u062a\u0643\u0634\u0627\u0641",
      footerConnect: "\u062a\u0648\u0627\u0635\u0644",
      footerGithub: "GitHub",
      footerLinkedIn: "LinkedIn",
      footerEmail: "Email",
      footerCopy:
        "\u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629.",
    },
  };

  const NAV_LINKS = [
    { id: "tools", href: "/tools/", key: "toolsHome", icon: "bx-grid-alt" },
    { id: "pdf", href: "/tools/pdf/", key: "pdf", icon: "bx-file" },
    { id: "image", href: "/tools/image/", key: "image", icon: "bx-image-alt" },
    {
      id: "developer",
      href: "/tools/developer/",
      key: "developer",
      icon: "bx-code-curly",
    },
    { id: "text", href: "/tools/text/", key: "text", icon: "bx-text" },
    {
      id: "utility",
      href: "/tools/utility/",
      key: "utility",
      icon: "bx-shield-quarter",
    },
  ];

  function getLanguagePack(language) {
    return SHELL_TRANSLATIONS[language] || SHELL_TRANSLATIONS[DEFAULT_LANGUAGE];
  }

  function getStoredLanguage() {
    const value = window.localStorage.getItem(STORAGE_KEYS.language);
    return SUPPORTED_LANGUAGES.includes(value) ? value : DEFAULT_LANGUAGE;
  }

  function applyDocumentLanguage(language) {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }

  function getThemeButton() {
    return document.getElementById("theme-button");
  }

  function getCurrentThemeValue() {
    return document.body.classList.contains(LIGHT_THEME_CLASS) ? "dark" : "light";
  }

  function getCurrentIconValue() {
    const themeButton = getThemeButton();
    if (!themeButton) {
      return "bx bx-moon";
    }

    return themeButton.classList.contains(ICON_THEME_CLASS)
      ? "bx bx-moon"
      : "bx bx-sun";
  }

  function syncThemeFromStorage() {
    const selectedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);
    const selectedIcon = window.localStorage.getItem(STORAGE_KEYS.icon);
    const themeButton = getThemeButton();

    if (!themeButton) {
      return;
    }

    if (selectedTheme) {
      document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
        LIGHT_THEME_CLASS
      );
      themeButton.classList[selectedIcon === "bx bx-moon" ? "add" : "remove"](
        ICON_THEME_CLASS
      );
    }
  }

  function bindThemeToggle() {
    const themeButton = getThemeButton();
    if (!themeButton || themeButton.dataset.bound === "true") {
      return;
    }

    themeButton.dataset.bound = "true";
    themeButton.addEventListener("click", function () {
      document.body.classList.toggle(LIGHT_THEME_CLASS);
      themeButton.classList.toggle(ICON_THEME_CLASS);
      window.localStorage.setItem(STORAGE_KEYS.theme, getCurrentThemeValue());
      window.localStorage.setItem(STORAGE_KEYS.icon, getCurrentIconValue());
    });
  }

  function syncLanguageSelectors(language) {
    document.querySelectorAll("[data-shell-language-select]").forEach(function (select) {
      select.value = language;
    });
  }

  function renderChromeTexts(language) {
    const pack = getLanguagePack(language);
    document.querySelectorAll("[data-shell-text]").forEach(function (node) {
      const key = node.getAttribute("data-shell-text");
      if (pack[key]) {
        node.textContent = pack[key];
      }
    });
  }

  function setLanguage(language) {
    const nextLanguage = SUPPORTED_LANGUAGES.includes(language)
      ? language
      : DEFAULT_LANGUAGE;

    applyDocumentLanguage(nextLanguage);
    window.localStorage.setItem(STORAGE_KEYS.language, nextLanguage);
    syncLanguageSelectors(nextLanguage);
    renderChromeTexts(nextLanguage);
    window.dispatchEvent(
      new CustomEvent("language-changed", {
        detail: { language: nextLanguage },
      })
    );
  }

  function bindLanguageSelectors() {
    document.querySelectorAll("[data-shell-language-select]").forEach(function (select) {
      if (select.dataset.bound === "true") {
        return;
      }

      select.dataset.bound = "true";
      select.addEventListener("change", function (event) {
        setLanguage(event.target.value);
      });
    });
  }

  function renderHeader(activeNav, language) {
    const headerSlot = document.querySelector('[data-site-shell="header"]');
    if (!headerSlot) {
      return;
    }

    const pack = getLanguagePack(language);
    const navLinks = NAV_LINKS.map(function (link) {
      const isActive = activeNav === link.id ? " tools-shell__nav-link--active" : "";
      return (
        '<a class="tools-shell__nav-link' +
        isActive +
        '" href="' +
        link.href +
        '">' +
        '<i class="bx ' +
        link.icon +
        '"></i>' +
        '<span data-shell-text="' +
        link.key +
        '">' +
        pack[link.key] +
        "</span>" +
        "</a>"
      );
    }).join("");

    headerSlot.innerHTML =
      '<header class="tools-shell__header">' +
      '<div class="tools-shell__header-inner">' +
      '<a class="tools-shell__brand" href="/tools/">' +
      '<span class="tools-shell__brand-kicker">immhusnainali.github.io</span>' +
      '<span class="tools-shell__brand-title" data-shell-text="shellTitle">' +
      pack.shellTitle +
      "</span>" +
      "</a>" +
      '<nav class="tools-shell__nav" aria-label="Tools navigation">' +
      navLinks +
      "</nav>" +
      '<div class="tools-shell__actions">' +
      '<a class="tools-shell__home-link" href="/">' +
      '<i class="bx bx-left-arrow-alt"></i>' +
      '<span data-shell-text="backHome">' +
      pack.backHome +
      "</span>" +
      "</a>" +
      '<label class="tools-shell__language-label" for="language-select">' +
      '<span class="sr-only">Language</span>' +
      '<select id="language-select" class="tools-shell__language" aria-label="Select language" data-shell-language-select>' +
      '<option value="en">EN</option>' +
      '<option value="ur">UR</option>' +
      '<option value="es">ES</option>' +
      '<option value="fr">FR</option>' +
      '<option value="ar">AR</option>' +
      "</select>" +
      "</label>" +
      '<button class="tools-shell__theme-button bx bx-moon" id="theme-button" type="button" aria-label="Toggle theme"></button>' +
      "</div>" +
      "</div>" +
      "</header>";
  }

  function renderFooter(language) {
    const footerSlot = document.querySelector('[data-site-shell="footer"]');
    if (!footerSlot) {
      return;
    }

    const pack = getLanguagePack(language);
    footerSlot.innerHTML =
      '<footer class="tools-shell__footer">' +
      '<div class="tools-shell__footer-grid">' +
      '<div class="tools-shell__footer-copy">' +
      '<h2 data-shell-text="shellTitle">' +
      pack.shellTitle +
      "</h2>" +
      '<p data-shell-text="footerTitle">' +
      pack.footerTitle +
      "</p>" +
      '<p class="tools-shell__footer-note" data-shell-text="footerNote">' +
      pack.footerNote +
      "</p>" +
      "</div>" +
      '<div class="tools-shell__footer-links">' +
      '<h3 data-shell-text="footerExplore">' +
      pack.footerExplore +
      "</h3>" +
      '<a href="/tools/" data-shell-text="toolsHome">' +
      pack.toolsHome +
      "</a>" +
      '<a href="/tools/pdf/" data-shell-text="pdf">' +
      pack.pdf +
      "</a>" +
      '<a href="/tools/image/" data-shell-text="image">' +
      pack.image +
      "</a>" +
      '<a href="/tools/developer/" data-shell-text="developer">' +
      pack.developer +
      "</a>" +
      '<a href="/tools/text/" data-shell-text="text">' +
      pack.text +
      "</a>" +
      '<a href="/tools/utility/" data-shell-text="utility">' +
      pack.utility +
      "</a>" +
      "</div>" +
      '<div class="tools-shell__footer-links">' +
      '<h3 data-shell-text="footerConnect">' +
      pack.footerConnect +
      "</h3>" +
      '<a href="https://github.com/immhusnainali/" target="_blank" rel="noreferrer noopener" data-shell-text="footerGithub">' +
      pack.footerGithub +
      "</a>" +
      '<a href="https://www.linkedin.com/in/immhusnainali/" target="_blank" rel="noreferrer noopener" data-shell-text="footerLinkedIn">' +
      pack.footerLinkedIn +
      "</a>" +
      '<a href="mailto:immhusnainali@gmail.com" data-shell-text="footerEmail">' +
      pack.footerEmail +
      "</a>" +
      "</div>" +
      "</div>" +
      '<div class="tools-shell__footer-bottom">' +
      '<span>&copy; <span id="current-year"></span> Muhammad Husnain Ali.</span>' +
      '<span data-shell-text="footerCopy">' +
      pack.footerCopy +
      "</span>" +
      "</div>" +
      "</footer>";
  }

  function syncYear() {
    const yearNode = document.getElementById("current-year");
    if (yearNode) {
      yearNode.textContent = String(new Date().getFullYear());
    }
  }

  function initToolsShell() {
    const body = document.body;
    const activeNav = body ? body.dataset.activeNav || "tools" : "tools";
    const language = getStoredLanguage();

    renderHeader(activeNav, language);
    renderFooter(language);
    syncThemeFromStorage();
    bindThemeToggle();
    bindLanguageSelectors();
    syncLanguageSelectors(language);
    applyDocumentLanguage(language);
    syncYear();
  }

  window.siteShell = {
    getLanguage: getStoredLanguage,
    setLanguage: setLanguage,
    initToolsShell: initToolsShell,
    getShellCopy: getLanguagePack,
  };

  document.addEventListener("DOMContentLoaded", initToolsShell);
})();
