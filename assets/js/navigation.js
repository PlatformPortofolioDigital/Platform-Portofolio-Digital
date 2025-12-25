// assets/js/navigation.js
(function () {
  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }

  function getNavContainer() {
    return qs("header nav") || qs("nav") || qs(".navbar") || qs("header");
  }

  function getNavLinks() {
    const nav = getNavContainer();
    if (!nav) return [];
    // ambil semua link dalam navbar
    return qsa("a", nav);
  }

  function normalizeFile(p) {
    const parts = (p || "").split("/");
    return parts[parts.length - 1] || "";
  }

  function setActiveByPage() {
    const currentFile = normalizeFile(location.pathname);
    const links = getNavLinks();

    links.forEach(a => {
      a.classList.add("nav-link");
      a.classList.remove("active");

      const href = a.getAttribute("href") || "";
      if (!href || href.startsWith("#")) return;

      const hrefFile = normalizeFile(href);

      // cocokkan halaman
      if (hrefFile && hrefFile === currentFile) a.classList.add("active");

      // handle index kosong / index.html
      if ((currentFile === "" || currentFile === "index.html") &&
          (hrefFile === "" || hrefFile === "index.html")) {
        a.classList.add("active");
      }
    });
  }

  function enableSmoothScroll(closeMobileMenu) {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#")) {
        const target = qs(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, "", href);
          if (typeof closeMobileMenu === "function") closeMobileMenu();
        }
      }
    });
  }

  function enableActiveOnScroll() {
    const links = getNavLinks().filter(a => (a.getAttribute("href") || "").startsWith("#"));
    if (links.length === 0) return;

    const sections = links.map(a => qs(a.getAttribute("href"))).filter(Boolean);
    if (sections.length === 0) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        if (!id) return;

        links.forEach(a => a.classList.remove("active"));
        const active = links.find(a => a.getAttribute("href") === `#${id}`);
        if (active) active.classList.add("active");
      });
    }, { threshold: 0.55 });

    sections.forEach(s => obs.observe(s));
  }

  // ===== MOBILE MENU INJECT =====
  let mobileBtn = null;
  let mobilePanel = null;

  function closeMobileMenu() {
    if (mobilePanel) mobilePanel.classList.remove("open");
  }

  function toggleMobileMenu() {
    if (!mobilePanel) return;
    mobilePanel.classList.toggle("open");
  }

  function injectMobileMenuIfMissing() {
    const nav = getNavContainer();
    if (!nav) return;

    // kalau sudah ada, pakai itu
    mobileBtn = qs("#mobile-menu-btn");
    mobilePanel = qs("#mobile-menu-panel");
    if (mobileBtn && mobilePanel) return;

    // buat tombol hamburger
    mobileBtn = document.createElement("button");
    mobileBtn.id = "mobile-menu-btn";
    mobileBtn.type = "button";
    mobileBtn.textContent = "☰";
    mobileBtn.title = "Menu";
    mobileBtn.setAttribute("aria-label", "Open Menu");
    mobileBtn.style.marginLeft = "10px";
    mobileBtn.style.verticalAlign = "middle";

    // buat panel
    mobilePanel = document.createElement("div");
    mobilePanel.id = "mobile-menu-panel";

    // clone semua link navbar ke panel
    const links = getNavLinks();
    links.forEach((a) => {
      const clone = a.cloneNode(true);
      clone.classList.add("nav-link");
      mobilePanel.appendChild(clone);
    });

    // pastikan nav relative supaya panel absolute aman
    const pos = window.getComputedStyle(nav).position;
    if (pos === "static") nav.style.position = "relative";

    nav.appendChild(mobileBtn);
    nav.appendChild(mobilePanel);

    mobileBtn.addEventListener("click", toggleMobileMenu);

    // klik di luar nutup
    document.addEventListener("click", (e) => {
      if (!mobilePanel || !mobileBtn) return;
      if (nav.contains(e.target)) return;
      closeMobileMenu();
    });

    // resize besar nutup
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) closeMobileMenu();
    });
  }

  // INIT
  document.addEventListener("DOMContentLoaded", () => {
    setActiveByPage();
    injectMobileMenuIfMissing();
    enableSmoothScroll(closeMobileMenu);
    enableActiveOnScroll();
  });
})();
