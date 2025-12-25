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

      if (hrefFile && hrefFile === currentFile) a.classList.add("active");

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

    mobileBtn = qs("#mobile-menu-btn");
    mobilePanel = qs("#mobile-menu-panel");
    if (mobileBtn && mobilePanel) return;

    mobileBtn = document.createElement("button");
    mobileBtn.id = "mobile-menu-btn";
    mobileBtn.type = "button";
    mobileBtn.textContent = "☰";
    mobileBtn.title = "Menu";
    mobileBtn.setAttribute("aria-label", "Open Menu");
    mobileBtn.style.marginLeft = "10px";
    mobileBtn.style.verticalAlign = "middle";

    mobilePanel = document.createElement("div");
    mobilePanel.id = "mobile-menu-panel";

    const links = getNavLinks();
    links.forEach((a) => {
      const clone = a.cloneNode(true);
      clone.classList.add("nav-link");
      mobilePanel.appendChild(clone);
    });

    const pos = window.getComputedStyle(nav).position;
    if (pos === "static") nav.style.position = "relative";

    nav.appendChild(mobileBtn);
    nav.appendChild(mobilePanel);

    mobileBtn.addEventListener("click", toggleMobileMenu);

    // click outside closes
    document.addEventListener("click", (e) => {
      if (!mobilePanel || !mobileBtn) return;
      if (nav.contains(e.target)) return;
      closeMobileMenu();
    });

    // resize closes
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) closeMobileMenu();
    });
  }

  // ===== NAVBAR SCROLL EFFECT =====
  function enableNavbarScrollEffect() {
    const navWrap = qs("header") || qs("nav");
    if (!navWrap) return;

    const onScroll = () => {
      if (window.scrollY > 20) navWrap.classList.add("nav-scrolled");
      else navWrap.classList.remove("nav-scrolled");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ===== SCROLL PROGRESS BAR =====
  function enableScrollProgress() {
    if (qs("#scroll-progress")) return;

    const bar = document.createElement("div");
    bar.id = "scroll-progress";
    document.body.appendChild(bar);

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = percent.toFixed(2) + "%";
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  // INIT
  document.addEventListener("DOMContentLoaded", () => {
    setActiveByPage();
    injectMobileMenuIfMissing();
    enableSmoothScroll(closeMobileMenu);
    enableActiveOnScroll();

    enableNavbarScrollEffect();
    enableScrollProgress();
  });
})();
