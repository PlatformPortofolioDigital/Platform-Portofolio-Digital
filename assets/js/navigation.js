// assets/js/navigation.js
// Navbar global: active indicator + smooth scroll + mobile hamburger menu (tanpa ubah HTML)

(function () {

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }

  function qsa(sel, root = document) {
    return [...root.querySelectorAll(sel)];
  }

  function normalizeFile(path) {
    const parts = (path || "").split("/");
    return parts[parts.length - 1];
  }

  /* ===============================
     ACTIVE NAV BY PAGE (multi page)
  ================================ */
  function setActiveByPage() {
    const currentFile = normalizeFile(location.pathname) || "index.html";
    const links = qsa("header.navbar nav a");

    links.forEach(link => {
      link.classList.add("nav-link");
      link.classList.remove("active");

      const href = link.getAttribute("href") || "";
      // kalau anchor (#section) skip di page-mode
      if (href.startsWith("#")) return;

      const hrefFile = normalizeFile(href);
      if (hrefFile === currentFile) {
        link.classList.add("active");
      }
    });
  }

  /* ===============================
     NAVBAR SCROLL EFFECT
  ================================ */
  function enableNavbarScrollEffect() {
    const header = qs("header.navbar");
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 20) header.classList.add("nav-scrolled");
      else header.classList.remove("nav-scrolled");
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ===============================
     SMOOTH SCROLL (anchor links)
  ================================ */
  function enableSmoothScroll() {
    const header = qs("header.navbar");
    const headerOffset = () => (header ? header.getBoundingClientRect().height : 0);

    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;

      const id = a.getAttribute("href");
      if (!id || id === "#") return;

      const target = qs(id);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset() - 12;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }

  /* ===============================
     SCROLLSPY (active by section) - hanya kalau ada anchor menu
  ================================ */
  function enableScrollSpy() {
    const header = qs("header.navbar");
    const navLinks = qsa('header.navbar nav a[href^="#"]');
    if (!header || navLinks.length === 0) return;

    const sections = navLinks
      .map(a => qs(a.getAttribute("href")))
      .filter(Boolean);

    if (sections.length === 0) return;

    const linkById = new Map();
    navLinks.forEach(a => {
      a.classList.add("nav-link");
      linkById.set(a.getAttribute("href").slice(1), a);
    });

    const obs = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(en => en.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const id = visible.target.id;
      navLinks.forEach(a => a.classList.remove("active"));
      const hit = linkById.get(id);
      if (hit) hit.classList.add("active");
    }, {
      root: null,
      threshold: [0.2, 0.35, 0.5],
      rootMargin: `-${Math.ceil(header.getBoundingClientRect().height)}px 0px -60% 0px`
    });

    sections.forEach(s => obs.observe(s));
  }

  /* ===============================
     MOBILE MENU
     - tombol & panel ditempel ke header (bukan ke nav)
     - nav desktop disembunyikan oleh CSS media query
  ================================ */
  function ensureMobileMenu() {
    const header = qs("header.navbar");
    const nav = qs("header.navbar nav");
    if (!header || !nav) return;

    // bikin hanya sekali
    if (!qs("#mobile-menu-btn")) {
      const btn = document.createElement("button");
      btn.id = "mobile-menu-btn";
      btn.type = "button";
      btn.textContent = "☰";
      btn.setAttribute("aria-label", "Open Menu");
      header.appendChild(btn);
    }

    if (!qs("#mobile-menu-panel")) {
      const panel = document.createElement("div");
      panel.id = "mobile-menu-panel";

      // clone link dari nav desktop
      qsa("a", nav).forEach(a => {
        const clone = a.cloneNode(true);
        clone.classList.add("nav-link");
        panel.appendChild(clone);
      });

      header.appendChild(panel);
    }

    const btn = qs("#mobile-menu-btn");
    const panel = qs("#mobile-menu-panel");

    // toggle open
    btn.addEventListener("click", () => {
      panel.classList.toggle("open");
    });

    // close on outside click
    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.remove("open");
      }
    });

    // close when click link
    panel.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      panel.classList.remove("open");
    });
  }

  /* ===============================
     INIT
  ================================ */
  document.addEventListener("DOMContentLoaded", () => {
    setActiveByPage();
    enableNavbarScrollEffect();
    enableSmoothScroll();
    enableScrollSpy();
    ensureMobileMenu();
  });

})();
