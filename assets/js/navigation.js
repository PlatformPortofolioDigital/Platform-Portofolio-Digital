// assets/js/navigation.js
// FINAL FIXED VERSION
// Aman untuk desktop & mobile, tidak bikin navbar dobel

(function () {

  /* ===============================
     HELPER
  ================================ */
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
     ACTIVE NAV BY PAGE
  ================================ */
  function setActiveByPage() {
    const currentFile = normalizeFile(location.pathname) || "index.html";

    const links = qsa("header.navbar nav a");
    links.forEach(link => {
      link.classList.add("nav-link");
      link.classList.remove("active");

      const hrefFile = normalizeFile(link.getAttribute("href"));
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
      if (window.scrollY > 20) {
        header.classList.add("nav-scrolled");
      } else {
        header.classList.remove("nav-scrolled");
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ===============================
     MOBILE MENU (ONLY < 768px)
  ================================ */
  function injectMobileMenu() {
    if (window.innerWidth >= 768) return; // ⬅️ PENTING: desktop stop di sini

    const nav = qs("header.navbar nav");
    if (!nav) return;

    if (qs("#mobile-menu-btn") || qs("#mobile-menu-panel")) return;

    // button
    const btn = document.createElement("button");
    btn.id = "mobile-menu-btn";
    btn.type = "button";
    btn.textContent = "☰";
    btn.setAttribute("aria-label", "Open Menu");

    // panel
    const panel = document.createElement("div");
    panel.id = "mobile-menu-panel";

    qsa("a", nav).forEach(a => {
      const clone = a.cloneNode(true);
      clone.classList.add("nav-link");
      panel.appendChild(clone);
    });

    nav.appendChild(btn);
    nav.appendChild(panel);

    btn.addEventListener("click", () => {
      panel.classList.toggle("open");
    });

    // close on outside click
    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.remove("open");
      }
    });
  }

  /* ===============================
     INIT
  ================================ */
  document.addEventListener("DOMContentLoaded", () => {
    setActiveByPage();
    enableNavbarScrollEffect();
    injectMobileMenu();
  });

})();
