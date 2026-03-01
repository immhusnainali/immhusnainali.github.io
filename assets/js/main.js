/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader() {
  const header = document.getElementById("header");
  // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
  if (this.scrollY >= 50) header.classList.add("scroll-header");
  else header.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/*=============== SERVICES MODAL ===============*/
// Get the modal
const modalViews = document.querySelectorAll(".services__modal"),
  modalBtns = document.querySelectorAll(".services__button"),
  modalClose = document.querySelectorAll(".services__modal-close");

// When the user clicks on the button, open the modal
let modal = function (modalClick) {
  modalViews[modalClick].classList.add("active-modal");
};

modalBtns.forEach((mb, i) => {
  mb.addEventListener("click", () => {
    modal(i);
  });
});

modalClose.forEach((mc) => {
  mc.addEventListener("click", () => {
    modalViews.forEach((mv) => {
      mv.classList.remove("active-modal");
    });
  });
});

/*=============== MIXITUP FILTER PORTFOLIO ===============*/

let mixer = mixitup(".work__container", {
  selectors: {
    target: ".work__card",
  },
  animation: {
    duration: 300,
  },
});

/* Link active work */
const workLinks = document.querySelectorAll(".work__item");

function activeWork(workLink) {
  workLinks.forEach((wl) => {
    wl.classList.remove("active-work");
  });
  workLink.classList.add("active-work");
}

workLinks.forEach((wl) => {
  wl.addEventListener("click", () => {
    activeWork(wl);
  });
});

/*=============== SWIPER TESTIMONIAL ===============*/

let swiperTestimonial = new Swiper(".testimonial__container", {
  spaceBetween: 24,
  loop: true,
  grabCursor: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 48,
    },
  },
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/

const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);

/*=============== LIGHT DARK THEME ===============*/
const themeButton = document.getElementById("theme-button");
const lightTheme = "light-theme";
const iconTheme = "bx-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// We obtain the current theme that the interface has by validating the light-theme class
const getCurrentTheme = () =>
  document.body.classList.contains(lightTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "bx bx-moon" : "bx bx-sun";

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the light
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    lightTheme
  );
  themeButton.classList[selectedIcon === "bx bx-moon" ? "add" : "remove"](
    iconTheme
  );
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the light / icon theme
  document.body.classList.toggle(lightTheme);
  themeButton.classList.toggle(iconTheme);
  // We save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});

/*=============== MULTI LANGUAGE ===============*/
const languageSelect = document.getElementById("language-select");
const defaultLanguage = "en";
const languageStorageKey = "selected-language";

const languageTargets = [
  { key: "documentTitle", apply: (value) => (document.title = value) },
  { key: "homeGreeting", selector: ".home__greeting" },
  { key: "homeRole", selector: ".home__education" },
  { key: "homeDownloadCv", selector: ".home__button .button--ghost" },
  { key: "homeAbout", selector: ".home__button .button:not(.button--ghost)" },
  { key: "homeScrollDown", selector: ".home__scroll-name" },
  { key: "aboutSubtitle", selector: "#about .section__subtitle" },
  { key: "aboutTitle", selector: "#about .section__title" },
  {
    key: "aboutExperienceTitle",
    selector: "#about .about__box:nth-child(1) .about__title",
  },
  {
    key: "aboutExperienceSubtitle",
    selector: "#about .about__box:nth-child(1) .about__subtitle",
  },
  {
    key: "aboutCompletedTitle",
    selector: "#about .about__box:nth-child(2) .about__title",
  },
  {
    key: "aboutCompletedSubtitle",
    selector: "#about .about__box:nth-child(2) .about__subtitle",
  },
  { key: "aboutSupportTitle", selector: "#about .about__box:nth-child(3) .about__title" },
  {
    key: "aboutSupportSubtitle",
    selector: "#about .about__box:nth-child(3) .about__subtitle",
  },
  { key: "aboutDescription", selector: "#about .about__description" },
  { key: "aboutContactBtn", selector: "#about .about__button-contact" },
  { key: "skillsSubtitle", selector: "#skills .section__subtitle" },
  { key: "skillsTitle", selector: "#skills .section__title" },
  { key: "skillsFrontendTitle", selector: "#skills .skills__content:nth-child(1) .skills__title" },
  { key: "skillsBackendTitle", selector: "#skills .skills__content:nth-child(2) .skills__title" },
  { key: "servicesSubtitle", selector: ".services.section .section__subtitle" },
  { key: "servicesTitle", selector: ".services.section .section__title" },
  { key: "servicesCard1Title", selector: ".services__card:nth-child(1) .services__title", property: "innerHTML" },
  { key: "servicesCard2Title", selector: ".services__card:nth-child(2) > .services__title", property: "innerHTML" },
  { key: "servicesCard3Title", selector: ".services__card:nth-child(3) > .services__title", property: "innerHTML" },
  { key: "servicesSeeMore", selector: ".services__button", property: "innerHTML" },
  { key: "servicesModal1Title", selector: ".services__card:nth-child(1) .services__modal-title" },
  { key: "servicesModal1Description", selector: ".services__card:nth-child(1) .services__modal-description" },
  { key: "servicesModal2Title", selector: ".services__card:nth-child(2) .services__modal-title" },
  { key: "servicesModal2Description", selector: ".services__card:nth-child(2) .services__modal-description" },
  { key: "servicesModal3Title", selector: ".services__card:nth-child(3) .services__modal-title" },
  { key: "servicesModal3Description", selector: ".services__card:nth-child(3) .services__modal-description" },
  { key: "workSubtitle", selector: "#work .section__subtitle" },
  { key: "workTitle", selector: "#work .section__title" },
  { key: "workFilterAll", selector: ".work__filters .work__item:nth-child(1)" },
  { key: "workFilterWeb", selector: ".work__filters .work__item:nth-child(2)" },
  { key: "workFilterDesktop", selector: ".work__filters .work__item:nth-child(3)" },
  { key: "workFilterDesign", selector: ".work__filters .work__item:nth-child(4)" },
  { key: "workCard1Title", selector: ".work__card:nth-child(1) .work__title" },
  { key: "workCard2Title", selector: ".work__card:nth-child(2) .work__title" },
  { key: "workCard3Title", selector: ".work__card:nth-child(3) .work__title" },
  { key: "workCard4Title", selector: ".work__card:nth-child(4) .work__title" },
  { key: "workDemoButton", selector: ".work__button", property: "innerHTML" },
  { key: "testimonialSubtitle", selector: ".testimonial.section .section__subtitle" },
  { key: "testimonialTitle", selector: ".testimonial.section .section__title" },
  { key: "contactSubtitle", selector: "#contact .section__subtitle" },
  { key: "contactTitle", selector: "#contact .section__title" },
  { key: "contactTalkToMe", selector: "#contact .contact__title-info" },
  { key: "contactCardEmail", selector: "#contact .contact__card:nth-child(1) .contact__card-title" },
  { key: "contactCardWhatsapp", selector: "#contact .contact__card:nth-child(2) .contact__card-title" },
  { key: "contactCardTwitter", selector: "#contact .contact__card:nth-child(3) .contact__card-title" },
  { key: "contactWriteMe", selector: ".contact__button", property: "innerHTML" },
  { key: "contactFormTitle", selector: "#contact .contact__title-form" },
  { key: "contactFullNameLabel", selector: "label[for='full-name']" },
  { key: "contactFullNamePlaceholder", selector: "#full-name", property: "placeholder" },
  { key: "contactMailLabel", selector: "label[for='email-address']" },
  { key: "contactMailPlaceholder", selector: "#email-address", property: "placeholder" },
  { key: "contactMessageLabel", selector: "label[for='message']" },
  { key: "contactMessagePlaceholder", selector: "#message", property: "placeholder" },
  { key: "contactSendMessage", selector: "#contact .contact__form button.button" },
  { key: "footerHome", selector: ".footer__item:nth-child(1) .footer__link" },
  { key: "footerAbout", selector: ".footer__item:nth-child(2) .footer__link" },
  { key: "footerSkills", selector: ".footer__item:nth-child(3) .footer__link" },
  { key: "footerWork", selector: ".footer__item:nth-child(4) .footer__link" },
  { key: "footerContact", selector: ".footer__item:nth-child(5) .footer__link" },
  { key: "shareModalTitle", selector: "#share-modal-title" },
  { key: "shareModalDescription", selector: "#share-modal-description" },
  { key: "shareModalLinkLabel", selector: "#share-modal-link-label" },
];

const skillLevelTranslations = {
  en: { advanced: "Advanced", intermediate: "Intermediate", medium: "Medium" },
  ur: { advanced: "Mahir", intermediate: "Darmiyani", medium: "Darmiyani" },
  es: { advanced: "Avanzado", intermediate: "Intermedio", medium: "Medio" },
  fr: { advanced: "Avance", intermediate: "Intermediaire", medium: "Moyen" },
  ar: { advanced: "متقدم", intermediate: "متوسط", medium: "متوسط" },
};

const translations = {
  en: {
    documentTitle: "Muhammad Husnain Ali | Portfolio",
    homeGreeting: "Hello, I'm",
    homeRole: "Software Engineer",
    homeDownloadCv: "Download CV",
    homeAbout: "About",
    homeScrollDown: "Scroll Down",
    aboutSubtitle: "My Intro",
    aboutTitle: "About Me",
    aboutExperienceTitle: "Experience",
    aboutExperienceSubtitle: "2 Years Working",
    aboutCompletedTitle: "Completed",
    aboutCompletedSubtitle: "10+ Projects",
    aboutSupportTitle: "Support",
    aboutSupportSubtitle: "Online 24/7",
    aboutDescription:
      "As a Software Engineer, I specialize in building web pages with modern UI/UX, as well as developing robust desktop applications. With years of experience, I have successfully completed numerous projects and earned the satisfaction of many clients.",
    aboutContactBtn: "Contact Me",
    skillsSubtitle: "My Abilities",
    skillsTitle: "My Experience",
    skillsFrontendTitle: "Frontend Development",
    skillsBackendTitle: "Backend Development",
    servicesSubtitle: "My Services",
    servicesTitle: "What I Offer",
    servicesCard1Title: "Web <br> Development",
    servicesCard2Title: "UI/UX <br> Designing",
    servicesCard3Title: "Desktop Application <br> Development",
    servicesSeeMore: "See More <i class='bx bx-right-arrow services__icon'></i>",
    servicesModal1Title: "Web Development",
    servicesModal1Description:
      "I design and develop modern, responsive websites tailored to meet both customer and market needs, using a creative and hands-on approach.",
    servicesModal2Title: "UI/UX Designing",
    servicesModal2Description:
      "I design and develop consumer products with a creative and hands-on approach, ensuring they meet both customer and market needs and trends.",
    servicesModal3Title: "Desktop Application",
    servicesModal3Description:
      "I design and develop desktop applications with a creative and hands-on approach, ensuring they meet both customer and market needs.",
    workSubtitle: "My Portfolio",
    workTitle: "Recent Works",
    workFilterAll: "All",
    workFilterWeb: "Web",
    workFilterDesktop: "Desktop",
    workFilterDesign: "UI/UX Design",
    workCard1Title: "Web Application",
    workCard2Title: "Desktop Application",
    workCard3Title: "Web Design",
    workCard4Title: "App Design",
    workDemoButton: "Demo <i class='bx bx-right-arrow work__icon'></i>",
    testimonialSubtitle: "My clients say",
    testimonialTitle: "Testimonials",
    contactSubtitle: "Get in touch",
    contactTitle: "Contact Me",
    contactTalkToMe: "Talk to me",
    contactCardEmail: "Email",
    contactCardWhatsapp: "Whatsapp",
    contactCardTwitter: "Twitter",
    contactWriteMe: "Write Me <i class='bx bx-right-arrow contact__button-icon'></i>",
    contactFormTitle: "Write Me your Message",
    contactFullNameLabel: "Full Name",
    contactFullNamePlaceholder: "Enter name",
    contactMailLabel: "Mail",
    contactMailPlaceholder: "Enter email",
    contactMessageLabel: "Message",
    contactMessagePlaceholder: "Write your Message",
    contactSendMessage: "Send Message",
    footerHome: "Home",
    footerAbout: "About",
    footerSkills: "Skills",
    footerWork: "Work",
    footerContact: "Contact",
    shareModalTitle: "Share Portfolio",
    shareModalDescription: "Scan this QR code on another device.",
    shareModalLinkLabel: "Direct link",
  },
  ur: {
    documentTitle: "Muhammad Husnain Ali | Portfolio",
    homeGreeting: "Assalam o Alaikum, Main hoon",
    homeRole: "Software Engineer",
    homeDownloadCv: "CV Download karein",
    homeAbout: "Mere bare mein",
    homeScrollDown: "Neeche scroll karein",
    aboutSubtitle: "Mera Intro",
    aboutTitle: "Mere bare mein",
    aboutExperienceTitle: "Tajurba",
    aboutExperienceSubtitle: "2 saal kaam ka tajurba",
    aboutCompletedTitle: "Mukammal",
    aboutCompletedSubtitle: "10+ Projects",
    aboutSupportTitle: "Support",
    aboutSupportSubtitle: "Online 24/7",
    aboutDescription:
      "Main Software Engineer hoon aur modern UI/UX wali web pages aur mazboot desktop applications banata hoon. Kai saalon ke tajurbe ke sath main ne bohat se projects kamyabi se mukammal kiye hain.",
    aboutContactBtn: "Rabta karein",
    skillsSubtitle: "Meri Salahiyatein",
    skillsTitle: "Mera Tajurba",
    skillsFrontendTitle: "Frontend Development",
    skillsBackendTitle: "Backend Development",
    servicesSubtitle: "Meri Khidmaat",
    servicesTitle: "Main Kya Offer Karta Hoon",
    servicesCard1Title: "Web <br> Development",
    servicesCard2Title: "UI/UX <br> Designing",
    servicesCard3Title: "Desktop Application <br> Development",
    servicesSeeMore: "Mazeed dekhein <i class='bx bx-right-arrow services__icon'></i>",
    servicesModal1Title: "Web Development",
    servicesModal1Description:
      "Main modern aur responsive websites design aur develop karta hoon jo customer aur market ki zarooriyat ko poora karti hain.",
    servicesModal2Title: "UI/UX Designing",
    servicesModal2Description:
      "Main creative approach ke sath user friendly products design aur develop karta hoon jo market trends se match karte hain.",
    servicesModal3Title: "Desktop Application",
    servicesModal3Description:
      "Main desktop applications design aur develop karta hoon jo customer aur market ki zarooriyat ke mutabiq hoti hain.",
    workSubtitle: "Mera Portfolio",
    workTitle: "Halia Kaam",
    workFilterAll: "Sab",
    workFilterWeb: "Web",
    workFilterDesktop: "Desktop",
    workFilterDesign: "UI/UX Design",
    workCard1Title: "Web Application",
    workCard2Title: "Desktop Application",
    workCard3Title: "Web Design",
    workCard4Title: "App Design",
    workDemoButton: "Demo dekhein <i class='bx bx-right-arrow work__icon'></i>",
    testimonialSubtitle: "Clients kya kehte hain",
    testimonialTitle: "Reviews",
    contactSubtitle: "Rabta karein",
    contactTitle: "Mujh se Rabta Karein",
    contactTalkToMe: "Mujh se baat karein",
    contactCardEmail: "Email",
    contactCardWhatsapp: "Whatsapp",
    contactCardTwitter: "Twitter",
    contactWriteMe: "Mujhe likhein <i class='bx bx-right-arrow contact__button-icon'></i>",
    contactFormTitle: "Apna Paigham Likhein",
    contactFullNameLabel: "Pura Naam",
    contactFullNamePlaceholder: "Naam likhein",
    contactMailLabel: "Email",
    contactMailPlaceholder: "Email likhein",
    contactMessageLabel: "Paigham",
    contactMessagePlaceholder: "Apna paigham likhein",
    contactSendMessage: "Paigham bhejein",
    footerHome: "Home",
    footerAbout: "About",
    footerSkills: "Skills",
    footerWork: "Work",
    footerContact: "Contact",
    shareModalTitle: "Portfolio Share Karein",
    shareModalDescription: "Is QR code ko dusri device par scan karein.",
    shareModalLinkLabel: "Direct link",
  },
  es: {
    documentTitle: "Muhammad Husnain Ali | Portafolio",
    homeGreeting: "Hola, soy",
    homeRole: "Ingeniero de Software",
    homeDownloadCv: "Descargar CV",
    homeAbout: "Sobre mi",
    homeScrollDown: "Desplazar abajo",
    aboutSubtitle: "Mi introduccion",
    aboutTitle: "Sobre mi",
    aboutExperienceTitle: "Experiencia",
    aboutExperienceSubtitle: "2 anos trabajando",
    aboutCompletedTitle: "Completado",
    aboutCompletedSubtitle: "10+ Proyectos",
    aboutSupportTitle: "Soporte",
    aboutSupportSubtitle: "En linea 24/7",
    aboutDescription:
      "Como Ingeniero de Software, me especializo en construir paginas web con UI/UX moderna y en desarrollar aplicaciones de escritorio robustas. Con anos de experiencia, complete muchos proyectos con clientes satisfechos.",
    aboutContactBtn: "Contactame",
    skillsSubtitle: "Mis habilidades",
    skillsTitle: "Mi experiencia",
    skillsFrontendTitle: "Desarrollo Frontend",
    skillsBackendTitle: "Desarrollo Backend",
    servicesSubtitle: "Mis servicios",
    servicesTitle: "Lo que ofrezco",
    servicesCard1Title: "Desarrollo <br> Web",
    servicesCard2Title: "Diseno <br> UI/UX",
    servicesCard3Title: "Desarrollo de <br> App de Escritorio",
    servicesSeeMore: "Ver mas <i class='bx bx-right-arrow services__icon'></i>",
    servicesModal1Title: "Desarrollo Web",
    servicesModal1Description:
      "Diseno y desarrollo sitios web modernos y responsivos, adaptados a las necesidades del cliente y del mercado.",
    servicesModal2Title: "Diseno UI/UX",
    servicesModal2Description:
      "Diseno y desarrollo productos para usuarios con un enfoque practico y creativo, alineado con tendencias del mercado.",
    servicesModal3Title: "Aplicacion de Escritorio",
    servicesModal3Description:
      "Diseno y desarrollo aplicaciones de escritorio con un enfoque practico y creativo para necesidades reales.",
    workSubtitle: "Mi portafolio",
    workTitle: "Trabajos recientes",
    workFilterAll: "Todo",
    workFilterWeb: "Web",
    workFilterDesktop: "Escritorio",
    workFilterDesign: "Diseno UI/UX",
    workCard1Title: "Aplicacion Web",
    workCard2Title: "Aplicacion de Escritorio",
    workCard3Title: "Diseno Web",
    workCard4Title: "Diseno de App",
    workDemoButton: "Demo <i class='bx bx-right-arrow work__icon'></i>",
    testimonialSubtitle: "Lo que dicen mis clientes",
    testimonialTitle: "Testimonios",
    contactSubtitle: "Ponte en contacto",
    contactTitle: "Contactame",
    contactTalkToMe: "Habla conmigo",
    contactCardEmail: "Correo",
    contactCardWhatsapp: "Whatsapp",
    contactCardTwitter: "Twitter",
    contactWriteMe: "Escribeme <i class='bx bx-right-arrow contact__button-icon'></i>",
    contactFormTitle: "Escribe tu mensaje",
    contactFullNameLabel: "Nombre completo",
    contactFullNamePlaceholder: "Ingresa nombre",
    contactMailLabel: "Correo",
    contactMailPlaceholder: "Ingresa correo",
    contactMessageLabel: "Mensaje",
    contactMessagePlaceholder: "Escribe tu mensaje",
    contactSendMessage: "Enviar mensaje",
    footerHome: "Inicio",
    footerAbout: "Sobre mi",
    footerSkills: "Habilidades",
    footerWork: "Trabajo",
    footerContact: "Contacto",
    shareModalTitle: "Compartir Portafolio",
    shareModalDescription: "Escanea este codigo QR en otro dispositivo.",
    shareModalLinkLabel: "Enlace directo",
  },
  fr: {
    documentTitle: "Muhammad Husnain Ali | Portfolio",
    homeGreeting: "Bonjour, je suis",
    homeRole: "Ingenieur Logiciel",
    homeDownloadCv: "Telecharger CV",
    homeAbout: "A propos",
    homeScrollDown: "Defiler vers le bas",
    aboutSubtitle: "Mon intro",
    aboutTitle: "A propos de moi",
    aboutExperienceTitle: "Experience",
    aboutExperienceSubtitle: "2 ans de travail",
    aboutCompletedTitle: "Termine",
    aboutCompletedSubtitle: "10+ Projets",
    aboutSupportTitle: "Support",
    aboutSupportSubtitle: "En ligne 24/7",
    aboutDescription:
      "En tant qu'Ingenieur Logiciel, je cree des pages web avec une UI/UX moderne et des applications desktop robustes. Avec des annees d'experience, j'ai livre de nombreux projets avec satisfaction client.",
    aboutContactBtn: "Contactez-moi",
    skillsSubtitle: "Mes competences",
    skillsTitle: "Mon experience",
    skillsFrontendTitle: "Developpement Frontend",
    skillsBackendTitle: "Developpement Backend",
    servicesSubtitle: "Mes services",
    servicesTitle: "Ce que je propose",
    servicesCard1Title: "Developpement <br> Web",
    servicesCard2Title: "Design <br> UI/UX",
    servicesCard3Title: "Developpement <br> d'application Desktop",
    servicesSeeMore: "Voir plus <i class='bx bx-right-arrow services__icon'></i>",
    servicesModal1Title: "Developpement Web",
    servicesModal1Description:
      "Je concois et developpe des sites web modernes et responsives adaptes aux besoins du client et du marche.",
    servicesModal2Title: "Design UI/UX",
    servicesModal2Description:
      "Je concois et developpe des produits avec une approche pratique et creative adaptee aux besoins et tendances du marche.",
    servicesModal3Title: "Application Desktop",
    servicesModal3Description:
      "Je concois et developpe des applications desktop avec une approche pratique et creative pour des besoins reels.",
    workSubtitle: "Mon portfolio",
    workTitle: "Travaux recents",
    workFilterAll: "Tous",
    workFilterWeb: "Web",
    workFilterDesktop: "Desktop",
    workFilterDesign: "Design UI/UX",
    workCard1Title: "Application Web",
    workCard2Title: "Application Desktop",
    workCard3Title: "Design Web",
    workCard4Title: "Design App",
    workDemoButton: "Demo <i class='bx bx-right-arrow work__icon'></i>",
    testimonialSubtitle: "Ce que disent mes clients",
    testimonialTitle: "Temoignages",
    contactSubtitle: "Entrer en contact",
    contactTitle: "Contactez-moi",
    contactTalkToMe: "Parlez-moi",
    contactCardEmail: "Email",
    contactCardWhatsapp: "Whatsapp",
    contactCardTwitter: "Twitter",
    contactWriteMe: "Ecrivez-moi <i class='bx bx-right-arrow contact__button-icon'></i>",
    contactFormTitle: "Ecrivez votre message",
    contactFullNameLabel: "Nom complet",
    contactFullNamePlaceholder: "Entrez le nom",
    contactMailLabel: "Email",
    contactMailPlaceholder: "Entrez l'email",
    contactMessageLabel: "Message",
    contactMessagePlaceholder: "Ecrivez votre message",
    contactSendMessage: "Envoyer le message",
    footerHome: "Accueil",
    footerAbout: "A propos",
    footerSkills: "Competences",
    footerWork: "Travail",
    footerContact: "Contact",
    shareModalTitle: "Partager Portfolio",
    shareModalDescription: "Scannez ce code QR sur un autre appareil.",
    shareModalLinkLabel: "Lien direct",
  },
  ar: {
    documentTitle: "محمد حسنين علي | ملف الاعمال",
    homeGreeting: "مرحبا، انا",
    homeRole: "مهندس برمجيات",
    homeDownloadCv: "تحميل السيرة الذاتية",
    homeAbout: "نبذة عني",
    homeScrollDown: "مرر للاسفل",
    aboutSubtitle: "مقدمتي",
    aboutTitle: "نبذة عني",
    aboutExperienceTitle: "الخبرة",
    aboutExperienceSubtitle: "سنتان من العمل",
    aboutCompletedTitle: "المشاريع المنجزة",
    aboutCompletedSubtitle: "10+ مشاريع",
    aboutSupportTitle: "الدعم",
    aboutSupportSubtitle: "متاح 24/7",
    aboutDescription:
      "بصفتي مهندس برمجيات، اتخصص في بناء صفحات ويب بواجهة حديثة وتطوير تطبيقات سطح مكتب قوية. مع سنوات من الخبرة، انجزت العديد من المشاريع بنجاح ونلت رضا العملاء.",
    aboutContactBtn: "تواصل معي",
    skillsSubtitle: "مهاراتي",
    skillsTitle: "خبرتي",
    skillsFrontendTitle: "تطوير الواجهة الامامية",
    skillsBackendTitle: "تطوير الواجهة الخلفية",
    servicesSubtitle: "خدماتي",
    servicesTitle: "ما الذي اقدمه",
    servicesCard1Title: "تطوير <br> الويب",
    servicesCard2Title: "تصميم <br> UI/UX",
    servicesCard3Title: "تطوير تطبيقات <br> سطح المكتب",
    servicesSeeMore: "عرض المزيد <i class='bx bx-right-arrow services__icon'></i>",
    servicesModal1Title: "تطوير الويب",
    servicesModal1Description:
      "اصمم واطور مواقع ويب حديثة ومتجاوبة تلبي احتياجات العميل والسوق باستخدام اسلوب عملي ومبدع.",
    servicesModal2Title: "تصميم UI/UX",
    servicesModal2Description:
      "اصمم واطور منتجات المستخدمين بطريقة عملية ومبدعة لضمان توافقها مع احتياجات السوق واتجاهاته.",
    servicesModal3Title: "تطبيق سطح المكتب",
    servicesModal3Description:
      "اصمم واطور تطبيقات سطح المكتب بطريقة عملية ومبدعة لتلبية احتياجات العملاء والسوق.",
    workSubtitle: "اعمالي",
    workTitle: "احدث الاعمال",
    workFilterAll: "الكل",
    workFilterWeb: "ويب",
    workFilterDesktop: "سطح المكتب",
    workFilterDesign: "تصميم UI/UX",
    workCard1Title: "تطبيق ويب",
    workCard2Title: "تطبيق سطح المكتب",
    workCard3Title: "تصميم ويب",
    workCard4Title: "تصميم تطبيق",
    workDemoButton: "عرض تجريبي <i class='bx bx-right-arrow work__icon'></i>",
    testimonialSubtitle: "ماذا يقول عملائي",
    testimonialTitle: "آراء العملاء",
    contactSubtitle: "ابق على تواصل",
    contactTitle: "تواصل معي",
    contactTalkToMe: "تحدث معي",
    contactCardEmail: "البريد الالكتروني",
    contactCardWhatsapp: "واتساب",
    contactCardTwitter: "تويتر",
    contactWriteMe: "اكتب لي <i class='bx bx-right-arrow contact__button-icon'></i>",
    contactFormTitle: "اكتب رسالتك",
    contactFullNameLabel: "الاسم الكامل",
    contactFullNamePlaceholder: "ادخل الاسم",
    contactMailLabel: "البريد",
    contactMailPlaceholder: "ادخل البريد",
    contactMessageLabel: "الرسالة",
    contactMessagePlaceholder: "اكتب رسالتك",
    contactSendMessage: "ارسال الرسالة",
    footerHome: "الرئيسية",
    footerAbout: "نبذة",
    footerSkills: "المهارات",
    footerWork: "الاعمال",
    footerContact: "التواصل",
  },
};

document.querySelectorAll("#skills .skills__level").forEach((level) => {
  const token = level.textContent.trim().toLowerCase();
  if (skillLevelTranslations.en[token]) {
    level.dataset.levelToken = token;
  }
});

function applySkillLevelTranslations(language) {
  const levelPack = skillLevelTranslations[language] || skillLevelTranslations[defaultLanguage];

  document.querySelectorAll("#skills .skills__level[data-level-token]").forEach((level) => {
    const token = level.dataset.levelToken;
    if (levelPack[token]) {
      level.textContent = levelPack[token];
    }
  });
}

function applyLanguage(language) {
  const languagePack = translations[language] || translations[defaultLanguage];

  languageTargets.forEach((target) => {
    const value = languagePack[target.key];
    if (typeof value === "undefined") return;

    if (typeof target.apply === "function") {
      target.apply(value);
      return;
    }

    const elements = document.querySelectorAll(target.selector);
    if (!elements.length) return;

    elements.forEach((element) => {
      const property = target.property || "textContent";
      element[property] = value;
    });
  });

  applySkillLevelTranslations(language);
  document.documentElement.setAttribute("lang", language);
  document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");

  if (swiperTestimonial && typeof swiperTestimonial.update === "function") {
    swiperTestimonial.update();
  }

  window.dispatchEvent(
    new CustomEvent("language-changed", {
      detail: { language },
    })
  );
}

const storedLanguage = localStorage.getItem(languageStorageKey);
const initialLanguage = translations[storedLanguage] ? storedLanguage : defaultLanguage;

if (languageSelect) {
  languageSelect.value = initialLanguage;
  languageSelect.addEventListener("change", (event) => {
    const nextLanguage = event.target.value;
    applyLanguage(nextLanguage);
    localStorage.setItem(languageStorageKey, nextLanguage);
  });
}

applyLanguage(initialLanguage);

/*=============== REVIEWS ===============*/
const reviewStorageKey = "portfolio-reviews-v1";
const reviewsFilePath = "reviews.txt";

const reviewForm = document.getElementById("review-form");
const reviewNameInput = document.getElementById("review-name");
const reviewRatingInput = document.getElementById("review-rating");
const reviewMessageInput = document.getElementById("review-message");
const reviewStatus = document.getElementById("review-status");
const openReviewModalBtn = document.getElementById("open-review-modal");
const closeReviewModalBtn = document.getElementById("close-review-modal");
const reviewModal = document.getElementById("review-modal");
const openShareModalBtn = document.getElementById("open-share-modal");
const closeShareModalBtn = document.getElementById("close-share-modal");
const shareModal = document.getElementById("share-modal");
const shareQrCode = document.getElementById("share-qr-code");
const sharePortfolioLink = document.getElementById("share-portfolio-link");
const qrCodeScriptUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";

const ratingStarsEl = document.getElementById("home-rating-stars");
const ratingValueEl = document.getElementById("home-rating-value");
const ratingCountEl = document.getElementById("home-rating-count");
const ratingLabelEl = document.getElementById("home-rating-label");

const reviewTextByLang = {
  en: {
    reviewsLabel: "reviews",
    emptyStatus: "Published reviews are loaded from reviews.txt.",
    savedStatus: "Review submitted successfully on this device.",
    invalidRating: "Please select a valid rating.",
  },
  ur: {
    reviewsLabel: "reviews",
    emptyStatus: "Published reviews reviews.txt se load hoti hain.",
    savedStatus: "Review is device par submit ho gaya.",
    invalidRating: "Valid rating select karein.",
  },
  es: {
    reviewsLabel: "resenas",
    emptyStatus: "Las resenas publicadas se cargan desde reviews.txt.",
    savedStatus: "Resena enviada en este dispositivo.",
    invalidRating: "Selecciona una calificacion valida.",
  },
  fr: {
    reviewsLabel: "avis",
    emptyStatus: "Les avis publies sont charges depuis reviews.txt.",
    savedStatus: "Avis envoye sur cet appareil.",
    invalidRating: "Veuillez selectionner une note valide.",
  },
  ar: {
    reviewsLabel: "\u0645\u0631\u0627\u062c\u0639\u0627\u062a",
    emptyStatus:
      "\u064a\u062a\u0645 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0627\u062a \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0629 \u0645\u0646 reviews.txt.",
    savedStatus:
      "\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629 \u0639\u0644\u0649 \u0647\u0630\u0627 \u0627\u0644\u062c\u0647\u0627\u0632.",
    invalidRating:
      "\u064a\u0631\u062c\u0649 \u0627\u062e\u062a\u064a\u0627\u0631 \u062a\u0642\u064a\u064a\u0645 \u0635\u0627\u0644\u062d.",
  },
};

let activeReviewLanguage = initialLanguage;
let qrCodeLoaderPromise = null;

function getReviewTexts() {
  return reviewTextByLang[activeReviewLanguage] || reviewTextByLang.en;
}

function readStoredReviews() {
  try {
    const raw = localStorage.getItem(reviewStorageKey);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => {
      if (!item || typeof item !== "object") return false;
      const rating = Number(item.rating);
      return Number.isFinite(rating) && rating >= 1 && rating <= 5;
    });
  } catch (error) {
    return [];
  }
}

function writeStoredReviews(reviews) {
  localStorage.setItem(reviewStorageKey, JSON.stringify(reviews));
}

function getReviewKey(review) {
  const safeName = String(review.name || "").trim().toLowerCase();
  const safeDate = String(review.date || "").trim().toLowerCase();
  const safeMessage = String(review.message || "").trim().toLowerCase();
  const safeRating = String(review.rating || "");
  return [safeDate, safeName, safeRating, safeMessage].join("|");
}

function mergeReviewLists(primary, secondary) {
  const merged = [];
  const seen = new Set();

  [...primary, ...secondary].forEach((review) => {
    if (!review || typeof review !== "object") return;
    const rating = Number(review.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) return;

    const key = getReviewKey(review);
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(review);
  });

  return merged;
}

function parseReviewsFromText(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .map((line) => {
      const normalized = line.replace(/^\d+\.\s*/, "");
      const parts = normalized.split("|").map((part) => part.trim());
      if (parts.length < 3) return null;

      const date = parts[0] || "";
      const name = parts[1] || "Anonymous";
      const ratingMatch = parts[2].match(/rating:\s*([1-5])\s*\/\s*5/i);
      if (!ratingMatch) return null;

      const message = parts.slice(3).join(" | ");

      return {
        date,
        name,
        rating: Number(ratingMatch[1]),
        message,
        createdAt: "",
      };
    })
    .filter(Boolean);
}

async function loadPublishedReviews() {
  try {
    const response = await fetch(reviewsFilePath);
    if (!response.ok) return;

    const text = await response.text();
    const publishedReviews = parseReviewsFromText(text);
    if (!publishedReviews.length) return;

    const storedReviews = readStoredReviews();
    const mergedReviews = mergeReviewLists(publishedReviews, storedReviews);
    writeStoredReviews(mergedReviews);
    updateReviewSummary();
  } catch (error) {
    // Keep local review behavior if file cannot be fetched.
  }
}

function updateReviewSummary() {
  if (!ratingStarsEl || !ratingValueEl || !ratingCountEl || !ratingLabelEl) return;

  const reviews = readStoredReviews();
  const count = reviews.length;
  const average =
    count > 0
      ? reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / count
      : 0;

  const rounded = Math.round(average);
  const filledStar = String.fromCharCode(9733);
  const emptyStar = String.fromCharCode(9734);
  ratingStarsEl.textContent =
    filledStar.repeat(rounded) + emptyStar.repeat(5 - rounded);
  ratingValueEl.textContent = average.toFixed(1);
  ratingCountEl.textContent = String(count);
  ratingLabelEl.textContent = getReviewTexts().reviewsLabel;
}

function setReviewStatus(message) {
  if (reviewStatus) {
    reviewStatus.textContent = message;
  }
}

function updateReviewLanguage(language) {
  activeReviewLanguage = reviewTextByLang[language] ? language : "en";
  setReviewStatus(getReviewTexts().emptyStatus);
  updateReviewSummary();
}

function openReviewModal() {
  if (!reviewModal) return;
  reviewModal.classList.add("active-review-modal");
  reviewModal.setAttribute("aria-hidden", "false");
}

function closeReviewModal() {
  if (!reviewModal) return;
  reviewModal.classList.remove("active-review-modal");
  reviewModal.setAttribute("aria-hidden", "true");
}

function getShareUrl() {
  const shareUrl = new URL(window.location.href);
  shareUrl.hash = "";
  shareUrl.search = "";
  return shareUrl.toString();
}

function loadQrCodeScript() {
  if (typeof QRCode !== "undefined") {
    return Promise.resolve();
  }

  if (qrCodeLoaderPromise) {
    return qrCodeLoaderPromise;
  }

  qrCodeLoaderPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${qrCodeScriptUrl}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load QR script.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = qrCodeScriptUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load QR script."));
    document.body.appendChild(script);
  }).catch((error) => {
    qrCodeLoaderPromise = null;
    throw error;
  });

  return qrCodeLoaderPromise;
}

function renderShareQrCode() {
  if (!shareQrCode) return;

  const shareUrl = getShareUrl();
  shareQrCode.innerHTML = "";

  if (sharePortfolioLink) {
    sharePortfolioLink.href = shareUrl;
    sharePortfolioLink.textContent = shareUrl;
  }

  if (typeof QRCode === "undefined") {
    shareQrCode.textContent = shareUrl;
    return;
  }

  new QRCode(shareQrCode, {
    text: shareUrl,
    width: 180,
    height: 180,
    colorDark: "#111827",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

async function openShareModal() {
  if (!shareModal) return;

  renderShareQrCode();
  shareModal.classList.add("active-share-modal");
  shareModal.setAttribute("aria-hidden", "false");

  try {
    await loadQrCodeScript();
    renderShareQrCode();
  } catch (error) {
    // Keep the direct link visible if the QR library cannot be loaded.
  }
}

function closeShareModal() {
  if (!shareModal) return;
  shareModal.classList.remove("active-share-modal");
  shareModal.setAttribute("aria-hidden", "true");
}

if (reviewForm) {
  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const rating = Number(reviewRatingInput ? reviewRatingInput.value : 0);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      setReviewStatus(getReviewTexts().invalidRating);
      return;
    }

    const reviewerName =
      (reviewNameInput && reviewNameInput.value.trim()) || "Anonymous";
    const reviewerMessage = reviewMessageInput
      ? reviewMessageInput.value.trim().slice(0, 240)
      : "";

    const reviews = readStoredReviews();
    reviews.unshift({
      name: reviewerName,
      rating,
      message: reviewerMessage,
      date: new Date().toLocaleDateString(),
      createdAt: new Date().toISOString(),
    });

    writeStoredReviews(reviews);
    updateReviewSummary();
    setReviewStatus(getReviewTexts().savedStatus);

    reviewForm.reset();
    if (reviewRatingInput) {
      reviewRatingInput.value = "5";
    }

    closeReviewModal();
  });
}

if (openReviewModalBtn) {
  openReviewModalBtn.addEventListener("click", () => {
    setReviewStatus(getReviewTexts().emptyStatus);
    openReviewModal();
  });
}

if (closeReviewModalBtn) {
  closeReviewModalBtn.addEventListener("click", closeReviewModal);
}

if (reviewModal) {
  reviewModal.addEventListener("click", (event) => {
    if (event.target === reviewModal) {
      closeReviewModal();
    }
  });
}

if (openShareModalBtn) {
  openShareModalBtn.addEventListener("click", openShareModal);
}

if (closeShareModalBtn) {
  closeShareModalBtn.addEventListener("click", closeShareModal);
}

if (shareModal) {
  shareModal.addEventListener("click", (event) => {
    if (event.target === shareModal) {
      closeShareModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeReviewModal();
    closeShareModal();
  }
});

window.addEventListener("language-changed", (event) => {
  const language =
    event && event.detail && event.detail.language ? event.detail.language : "en";
  updateReviewLanguage(language);
});

updateReviewLanguage(initialLanguage);
loadPublishedReviews();

/*=============== INTERACTION FX ===============*/
const codeEffectSymbols = ["</>", "{}", "[]", "()", "=>", "const"];

function spawnFloatingCodeParticles(x, y, count = 4) {
  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    particle.className = "tap-code-particle";
    particle.textContent =
      codeEffectSymbols[Math.floor(Math.random() * codeEffectSymbols.length)];
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty(
      "--move-x",
      `${Math.round((Math.random() - 0.5) * 120)}px`
    );
    particle.style.setProperty(
      "--move-y",
      `${Math.round(-46 - Math.random() * 56)}px`
    );

    document.body.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), {
      once: true,
    });
  }
}

function initTapInteractions() {
  const rippleSelector = [
    ".button",
    ".services__card",
    ".work__card",
    ".about__box",
    ".contact__card",
    ".home__social-link",
    ".footer__social-link",
    ".nav__link",
    ".work__item",
    ".share-float",
  ].join(", ");

  document.querySelectorAll(rippleSelector).forEach((element) => {
    element.classList.add("ripple-surface");
  });

  document.addEventListener("pointerdown", (event) => {
    const target = event.target.closest(rippleSelector);
    if (!target) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);

    ripple.className = "tap-ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    ripple.style.setProperty(
      "--ripple-scale",
      `${Math.max(6, Math.ceil(size / 12))}`
    );

    target.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), {
      once: true,
    });

    if (event.pointerType && event.pointerType !== "mouse") {
      spawnFloatingCodeParticles(event.clientX, event.clientY, 3);
    }
  });
}

function initHomeTerminal() {
  const terminalText = document.getElementById("home-terminal-text");
  const homeRole = document.querySelector(".home__education");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!terminalText || !homeRole) {
    return;
  }

  let typingRunId = 0;

  function renderTerminal() {
    const roleText = homeRole.textContent.trim() || "Software Engineer";
    const terminalLine = `const role = "${roleText}";`;

    typingRunId += 1;
    const currentRun = typingRunId;
    terminalText.textContent = "";

    if (prefersReducedMotion) {
      terminalText.textContent = terminalLine;
      return;
    }

    let index = 1;

    function typeNext() {
      if (currentRun !== typingRunId) return;

      terminalText.textContent = terminalLine.slice(0, index);
      if (index < terminalLine.length) {
        index += 1;
        window.setTimeout(typeNext, 34);
      }
    }

    typeNext();
  }

  renderTerminal();
  window.addEventListener("language-changed", renderTerminal);
}

function initSocialMagnetism() {
  if (!window.matchMedia("(pointer: fine)").matches) {
    return;
  }

  document
    .querySelectorAll(".home__social-link, .footer__social-link")
    .forEach((link) => {
      link.addEventListener("pointermove", (event) => {
        const rect = link.getBoundingClientRect();
        const moveX = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
        const moveY = ((event.clientY - rect.top) / rect.height - 0.5) * 12;

        link.style.transform = `translate(${moveX}px, ${moveY}px)`;
        link.classList.add("is-magnetic");
      });

      link.addEventListener("pointerleave", () => {
        link.style.transform = "";
        link.classList.remove("is-magnetic");
      });
    });
}

function initScrollGlow() {
  const targets = document.querySelectorAll(
    ".about__box, .skills__content, .services__card, .work__card, .testimonial__card, .contact__card"
  );

  if (!targets.length) {
    return;
  }

  targets.forEach((target) => target.classList.add("scroll-glow-item"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-glow-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.22,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  targets.forEach((target) => observer.observe(target));
}

initTapInteractions();
initHomeTerminal();
initSocialMagnetism();
initScrollGlow();

/*=============== CODE CURSOR ===============*/

function initCodeCursor() {
  const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!supportsFinePointer || prefersReducedMotion) {
    return;
  }

  const cursor = document.createElement("div");
  cursor.className = "code-cursor";
  cursor.innerHTML = `
    <span class="code-cursor__ring"></span>
    <span class="code-cursor__dot"></span>
    <span class="code-cursor__label">&lt;/&gt;</span>
  `;

  document.body.appendChild(cursor);
  document.body.classList.add("has-code-cursor");

  const dot = cursor.querySelector(".code-cursor__dot");
  const ring = cursor.querySelector(".code-cursor__ring");
  const label = cursor.querySelector(".code-cursor__label");
  const interactiveSelector =
    "a, button, .services__button, .work__item, .nav__link, .home__social-link, .footer__link";
  const nativeCursorSelector = "input, textarea, select";

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  function positionElement(element, x, y) {
    if (!element) return;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  }

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    positionElement(dot, mouseX, mouseY);
    positionElement(ring, ringX, ringY);
    positionElement(label, ringX + 18, ringY - 16);

    window.requestAnimationFrame(renderCursor);
  }

  function spawnCursorParticles(x, y) {
    for (let index = 0; index < 4; index += 1) {
      const particle = document.createElement("span");
      particle.className = "code-cursor__particle";
      particle.textContent =
        codeEffectSymbols[
          Math.floor(Math.random() * codeEffectSymbols.length)
        ];
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty(
        "--move-x",
        `${Math.round((Math.random() - 0.5) * 110)}px`
      );
      particle.style.setProperty(
        "--move-y",
        `${Math.round(-42 - Math.random() * 54)}px`
      );

      cursor.appendChild(particle);
      particle.addEventListener("animationend", () => particle.remove(), {
        once: true,
      });
    }
  }

  document.addEventListener("mousemove", (event) => {
    const usesNativeCursor = event.target.closest(nativeCursorSelector);

    mouseX = event.clientX;
    mouseY = event.clientY;

    if (usesNativeCursor) {
      cursor.classList.remove("is-visible", "is-active");
      return;
    }

    cursor.classList.add("is-visible");
    cursor.classList.toggle(
      "is-active",
      Boolean(event.target.closest(interactiveSelector))
    );
  });

  document.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-visible", "is-active");
  });

  window.addEventListener("blur", () => {
    cursor.classList.remove("is-visible", "is-active");
  });

  document.addEventListener("mousedown", (event) => {
    if (event.target.closest(nativeCursorSelector)) {
      return;
    }

    spawnCursorParticles(event.clientX, event.clientY);
  });

  renderCursor();
}

initCodeCursor();

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2500,
  delay: 400,
  reset: true,
});

sr.reveal(`.nav__menu`, {
  delay: 100,
  scale: 0.1,
  origin: "bottom",
  distance: "300px",
});

sr.reveal(`.home__data`);
sr.reveal(`.home__handle`, {
  delay: 100,
});

sr.reveal(`.home__social, .home__scroll`, {
  delay: 100,
  origin: "bottom",
});

sr.reveal(`.about__img`, {
  delay: 100,
  origin: "left",
  scale: 0.9,
  distance: "30px",
});

sr.reveal(`.about__data, .about__description, .about__button-contact`, {
  delay: 100,
  scale: 0.9,
  origin: "right",
  distance: "30px",
});

sr.reveal(`.skills__content`, {
  delay: 100,
  scale: 0.9,
  origin: "bottom",
  distance: "30px",
});

sr.reveal(`.services__title, .services__button`, {
  delay: 100,
  scale: 0.9,
  origin: "top",
  distance: "30px",
});

sr.reveal(`.work__card`, {
  delay: 100,
  scale: 0.9,
  origin: "bottom",
  distance: "30px",
});

sr.reveal(`.testimonial__container`, {
  delay: 100,
  scale: 0.9,
  origin: "bottom",
  distance: "30px",
});

sr.reveal(`.contact__info, .contact__title-info`, {
  delay: 100,
  scale: 0.9,
  origin: "left",
  distance: "30px",
});

sr.reveal(`.contact__form, .contact__title-form`, {
  delay: 100,
  scale: 0.9,
  origin: "right",
  distance: "30px",
});

sr.reveal(`.footer, .footer__container`, {
  delay: 100,
  scale: 0.9,
  origin: "bottom",
  distance: "30px",
});
