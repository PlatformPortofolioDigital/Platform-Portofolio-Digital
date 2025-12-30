// assets/js/navigation.js
// Global Navigation: active indicator + smooth scroll + scrollspy + REAL mobile hamburger
// Tanpa ubah HTML (dibuat via JS). Aman walau file ini kepanggil 2x (guard).

(function () {
  if (window.__PPD_NAV_INIT__) return;
  window.__PPD_NAV_INIT__ = true;

  const MOBILE_MAX = 992; // samain dengan variables.css (max-width: 992px)

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const getHeader = () => qs("header.navbar") || qs("header.navbar, .navbar") || qs(".navbar");
  const getNav = () => {
    const header = getHeader();
    return header ? qs("nav", header) : null;
  };

  function normalizeFile(path) {
    const parts = String(path || "").split("/");
    return parts[parts.length - 1] || "";
  }

  /* ===============================
     1) ACTIVE NAV (MULTI PAGE)
  ================================ */
  function setActiveByPage() {
    const currentFile = normalizeFile(location.pathname) || "index.html";
    const links = qsa("header.navbar nav a, .navbar nav a");

    links.forEach((link) => {
      link.classList.add("nav-link");
      link.classList.remove("active");

      const href = link.getAttribute("href") || "";
      if (href.startsWith("#")) return;

      const hrefFile = normalizeFile(href);
      if (hrefFile && hrefFile === currentFile) {
        link.classList.add("active");
      }
    });
  }

  /* ===============================
     2) NAVBAR SCROLL EFFECT
  ================================ */
  function enableNavbarScrollEffect() {
    const header = getHeader();
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 20) header.classList.add("nav-scrolled");
      else header.classList.remove("nav-scrolled");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ===============================
     3) SMOOTH SCROLL (ANCHOR LINKS)
  ================================ */
  function enableSmoothScroll() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;

      const id = a.getAttribute("href");
      if (!id || id === "#") return;

      const target = qs(id);
      if (!target) return;

      e.preventDefault();

      const header = getHeader();
      const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 0;

      const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }

  /* ===============================
     4) SCROLLSPY (ACTIVE BY SECTION)
     - jalan kalau nav punya anchor #...
  ================================ */
  function enableScrollSpy() {
    const header = getHeader();
    const navLinks = qsa('header.navbar nav a[href^="#"], .navbar nav a[href^="#"]');
    if (!header || navLinks.length === 0) return;

    const sections = navLinks
      .map((a) => qs(a.getAttribute("href")))
      .filter(Boolean);

    if (sections.length === 0) return;

    const linkById = new Map();
    navLinks.forEach((a) => {
      const id = (a.getAttribute("href") || "").replace("#", "");
      if (id) linkById.set(id, a);
    });

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const id = visible.target.id;
        navLinks.forEach((a) => a.classList.remove("active"));
        const hit = linkById.get(id);
        if (hit) hit.classList.add("active");
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5],
        rootMargin: `-${Math.ceil(header.getBoundingClientRect().height)}px 0px -60% 0px`,
      }
    );

    sections.forEach((s) => obs.observe(s));
  }

  /* ===============================
     5) MOBILE HAMBURGER (REAL)
     - bikin tombol + panel
     - clone link dari nav asli
  ================================ */
  function ensureMobileMenu() {
    const header = getHeader();
    const nav = getNav();
    if (!header || !nav) return;

    // bikin tombol hanya sekali
    let btn = qs("#mobile-menu-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "mobile-menu-btn";
      btn.type = "button";
      btn.setAttribute("aria-label", "Open Menu");
      btn.setAttribute("aria-expanded", "false");
      btn.innerHTML = '<span aria-hidden="true">☰</span>';
      header.appendChild(btn);
    }

    // bikin panel hanya sekali
    let panel = qs("#mobile-menu-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "mobile-menu-panel";
      panel.setAttribute("role", "menu");
      panel.setAttribute("aria-label", "Mobile Navigation");
      header.appendChild(panel);
    }

    // isi panel (clone links) - refresh tiap load biar update kalau nav berubah
    panel.innerHTML = "";
    const links = qsa("a", nav).filter((a) => (a.getAttribute("href") || "").trim() !== "");
    links.forEach((a) => {
      const clone = a.cloneNode(true);
      clone.classList.add("nav-link");
      clone.setAttribute("role", "menuitem");
      panel.appendChild(clone);
    });

    const closePanel = () => {
      panel.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    };

    const openPanel = () => {
      panel.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    };

    const toggle = () => {
      if (panel.classList.contains("open")) closePanel();
      else openPanel();
    };

    // click tombol
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle();
    });

    // klik link dalam panel -> tutup
    panel.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      closePanel();
    });

    // klik luar -> tutup
    document.addEventListener("click", (e) => {
      if (!panel.classList.contains("open")) return;
      if (panel.contains(e.target) || btn.contains(e.target)) return;
      closePanel();
    });

    // esc -> tutup
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      closePanel();
    });
  }

  /* ===============================
     6) NAVBAR STICKY DI MOBILE
     - user minta: navbar + hamburger tetap ada saat scroll
     - kita paksa fixed di mobile biar pasti.
  ================================ */
  function keepNavbarVisibleOnMobile() {
    const header = getHeader();
    if (!header) return;

    const apply = () => {
      const isMobile = window.innerWidth <= MOBILE_MAX;

      if (isMobile) {
        header.style.position = "fixed";
        header.style.top = "0";
        header.style.left = "0";
        header.style.right = "0";
        header.style.zIndex = "9999";

        // kasih ruang supaya konten gak ketutup navbar
        const h = Math.ceil(header.getBoundingClientRect().height);
        document.body.style.paddingTop = h + "px";
      } else {
        header.style.position = "";
        header.style.top = "";
        header.style.left = "";
        header.style.right = "";
        header.style.zIndex = "";
        document.body.style.paddingTop = "";
      }
    };

    window.addEventListener("resize", apply);
    apply();
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
    keepNavbarVisibleOnMobile();
  });
})();
