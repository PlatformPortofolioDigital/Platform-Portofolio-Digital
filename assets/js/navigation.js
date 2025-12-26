// assets/js/navigation.js
// NAV: Hamburger mobile + active indicator + smooth scroll (tanpa ubah HTML)
(function () {
  const NAV_STYLE_ID = "nav-runtime-overrides";

  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }

  function normalizeFile(path) {
    const p = (path || "").split("/");
    return p[p.length - 1];
  }

  function injectNavOverrides() {
    if (document.getElementById(NAV_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = NAV_STYLE_ID;
    style.textContent = `
      /* ===== NAV OVERRIDES (MENANG dari responsive.css) ===== */

      /* TAMPILKAN HAMBURGER DI <= 1024px (tablet + mobile) */
      @media (max-width: 1024px) {
        header.navbar nav { display: none !important; }
        #mobile-menu-btn { display: inline-flex !important; }
      }

      /* posisi button biar gak "kejauhan" */
      header.navbar { position: relative; }
      #mobile-menu-btn { margin-left: auto; }

      /* Hamburger garis 3 */
      #mobile-menu-btn {
        display: none;
        align-items: center;
        justify-content: center;
        width: 46px;
        height: 46px;
        border-radius: 999px;
        border: 1px solid var(--nav-border);
        background: var(--card);
        box-shadow: var(--shadow-soft);
        cursor: pointer;
        position: relative;
      }
      #mobile-menu-btn .hb,
      #mobile-menu-btn .hb::before,
      #mobile-menu-btn .hb::after {
        content: "";
        display: block;
        width: 20px;
        height: 2px;
        background: var(--nav-text);
        border-radius: 99px;
        position: relative;
      }
      #mobile-menu-btn .hb::before { position: absolute; top: -6px; left: 0; }
      #mobile-menu-btn .hb::after  { position: absolute; top:  6px; left: 0; }

      /* panel dropdown */
      #mobile-menu-panel {
        display: none;
        position: absolute;
        top: calc(100% + 10px);
        right: 16px;
        min-width: 240px;
        background: var(--card-solid);
        border: 1px solid var(--border);
        border-radius: 16px;
        box-shadow: var(--shadow-strong);
        padding: 10px;
        z-index: 9999;
      }
      #mobile-menu-panel.open { display: block; }

      #mobile-menu-panel a {
        display: block;
        padding: 10px 12px;
        border-radius: 12px;
        text-decoration: none;
        color: var(--text);
      }
      #mobile-menu-panel a:hover {
        background: var(--nav-hover);
      }
    `;
    document.head.appendChild(style);
  }

  function ensureMobileMenu() {
    const header = qs("header.navbar");
    const nav = qs("header.navbar nav");
    if (!header || !nav) return;

    injectNavOverrides();

    // jangan dobel
    if (qs("#mobile-menu-btn") && qs("#mobile-menu-panel")) return;

    header.style.position = header.style.position || "relative";

    const btn = document.createElement("button");
    btn.id = "mobile-menu-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Open Menu");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = `<span class="hb" aria-hidden="true"></span>`;

    const panel = document.createElement("div");
    panel.id = "mobile-menu-panel";

    // clone link dari nav desktop
    qsa("a", nav).forEach((a) => {
      const clone = a.cloneNode(true);
      clone.classList.add("nav-link");
      panel.appendChild(clone);
    });

    header.appendChild(btn);
    header.appendChild(panel);

    function closePanel() {
      panel.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
    function togglePanel() {
      const isOpen = panel.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePanel();
    });

    panel.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      closePanel();
    });

    document.addEventListener("click", (e) => {
      const inside = panel.contains(e.target) || btn.contains(e.target);
      if (!inside) closePanel();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePanel();
    });
  }

  function setActiveByPage() {
    const currentFile = normalizeFile(location.pathname) || "index.html";
    const links = qsa("header.navbar nav a, #mobile-menu-panel a");

    links.forEach((link) => {
      link.classList.add("nav-link");
      link.classList.remove("active");

      const href = link.getAttribute("href") || "";
      const hrefFile = normalizeFile(href.split("#")[0]);
      if (!hrefFile) return;

      if (hrefFile === currentFile) link.classList.add("active");
    });
  }

  function enableSmoothScroll() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      const href = a.getAttribute("href") || "";
      if (!href.includes("#")) return;

      const [filePart, hash] = href.split("#");
      if (!hash) return;

      const currentFile = normalizeFile(location.pathname) || "index.html";
      const hrefFile = normalizeFile(filePart);
      if (filePart && hrefFile !== currentFile) return;

      const target = document.getElementById(hash);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", "#" + hash);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureMobileMenu();
    setActiveByPage();
    enableSmoothScroll();
  });
})();
