// assets/js/navigation.js

(function () {
  // ==========
  // Helpers
  // ==========
  function qs(selector, root = document) {
    return root.querySelector(selector);
  }
  function qsa(selector, root = document) {
    return [...root.querySelectorAll(selector)];
  }

  // Cari container navbar yang paling mungkin ada
  function getNavContainer() {
    return qs("nav") || qs(".navbar") || qs("header");
  }

  // Ambil semua link navigasi (sesuaikan selector ini kalau perlu)
  function getNavLinks() {
    // ini aman karena biasanya link navbar ada di nav/header
    const nav = getNavContainer();
    if (!nav) return [];
    return qsa("a", nav);
  }

  // ==========
  // ACTIVE NAV (multi page)
  // ==========
  function normalizePath(path) {
    // ambil nama file terakhir: /pages/about.html => about.html
    const parts = (path || "").split("/");
    return parts[parts.length - 1] || "";
  }

  function setActiveByPage() {
    const currentFile = normalizePath(location.pathname);
    const links = getNavLinks();

    links.forEach((a) => {
      a.classList.add("nav-link");
      a.classList.remove("active");

      const href = a.getAttribute("href") || "";
      if (!href || href.startsWith("#")) return;

      const hrefFile = normalizePath(href);
      if (hrefFile && hrefFile === currentFile) {
        a.classList.add("active");
      }

      // handle home variations
      if ((currentFile === "" || currentFile === "index.html") &&
          (hrefFile === "" || hrefFile === "index.html")) {
        a.classList.add("active");
      }
    });
  }

  // ==========
  // SMOOTH SCROLL (anchors)
  // ==========
  function enableSmoothScroll() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href) return;

      // only for in-page anchor
      if (href.startsWith("#")) {
        const target = qs(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, "", href);

          // tutup menu mobile kalau terbuka
          closeMobileMenu();
        }
      }
    });
  }

  // ==========
  // ACTIVE NAV ON SCROLL (for anchors)
  // ==========
  function enableActiveOnScroll() {
    const links = getNavLinks().filter(a => (a.getAttribute("href") || "").startsWith("#"));
    if (links.length === 0) return;

    const sections = links
      .map(a => qs(a.getAttribute("href")))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute("id");
        if (!id) return;

        links.forEach(a => a.classList.remove("active"));
        const activeLink = links.find(a => a.getAttribute("href") === `#${id}`);
        if (activeLink) activeLink.classList.add("active");
      });
    }, { root: null, threshold: 0.55 });

    sections.forEach(sec => observer.observe(sec));
  }

  // ==========
  // MOBILE MENU (hamburger + panel) - injected if missing
  // ==========
  let mobileBtn, mobilePanel;

  function injectMobileMenuIfMissing() {
    const nav = getNavContainer();
    if (!nav) return;

    // kalau sudah ada, skip
    if (qs("#mobile-menu-btn") && qs("#mobile-menu-panel")) {
      mobileBtn = qs("#mobile-menu-btn");
      mobilePanel = qs("#mobile-menu-panel");
      return;
    }

    // buat tombol hamburger
    mobileBtn = document.createElement("button");
    mobileBtn.id = "mobile-menu-btn";
    mobileBtn.type = "button";
    mobileBtn.textContent = "☰";
    mobileBtn.title = "Menu";
    mobileBtn.setAttribute("aria-label", "Open menu");
    mobileBtn.style.marginLeft = "12px";

    // panel menu
    mobilePanel = document.createElement("div");
    mobilePanel.id = "mobile-menu-panel";

    // copy links dari navbar ke panel mobile
    // ambil link dari nav container
    const links = getNavLinks();
    links.forEach((a) => {
      const clone = a.cloneNode(true);
      clone.classList.add("nav-link");
      mobilePanel.appendChild(clone);
    });

    // pastiin nav pos relative supaya panel bisa absolute
    const navStyle = window.getComputedStyle(nav);
    if (navStyle.position === "static") {
      nav.style.position = "relative";
    }

    // taruh tombol & panel di nav
    nav.appendChild(mobileBtn);
    nav.appendChild(mobilePanel);

    mobileBtn.addEventListener("click", toggleMobileMenu);
  }

  function openMobileMenu() {
    if (!mobilePanel) return;
    mobilePanel.classList.add("open");
  }

  function closeMobileMenu() {
    if (!mobilePanel) return;
    mobilePanel.classList.remove("open");
  }

  function toggleMobileMenu() {
    if (!mobilePanel) return;
    mobilePanel.classList.toggle("open");
  }

  function closeOnOutsideClick() {
    document.addEventListener("click", (e) => {
      if (!mobilePanel || !mobileBtn) return;

      const nav = getNavContainer();
      const clickedInsideNav = nav && nav.contains(e.target);
      if (!clickedInsideNav) closeMobileMenu();
    });
  }

  function closeOnResizeToDesktop() {
    window.addEventListener("resize", () => {
      // kalau layar besar, tutup panel
      if (window.innerWidth >= 768) closeMobileMenu();
    });
  }

  // ==========
  // INIT
  // ==========
  document.addEventListener("DOMContentLoaded", () => {
    setActiveByPage();
    enableSmoothScroll();
    enableActiveOnScroll();

    injectMobileMenuIfMissing();
    closeOnOutsideClick();
    closeOnResizeToDesktop();
  });
})();
