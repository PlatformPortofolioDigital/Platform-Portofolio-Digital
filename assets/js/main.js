// assets/js/main.js
// THEME: Dark/Light mode + localStorage + override global UI (tanpa ubah HTML)
(function () {
  const STORAGE_KEY = "theme"; // "light" | "dark"
  const THEMES = ["light", "dark"];
  const STYLE_ID = "theme-runtime-overrides";

  function setTheme(theme) {
    const t = THEMES.includes(theme) ? theme : "light";
    document.documentElement.setAttribute("data-theme", t);

    // smooth transition
    document.documentElement.classList.add("theme-transition");
    setTimeout(() => document.documentElement.classList.remove("theme-transition"), 250);

    localStorage.setItem(STORAGE_KEY, t);
    updateToggleUI(t);
    injectThemeOverrides(); // penting: override hardcode CSS kamu
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (THEMES.includes(saved)) return saved;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  function updateToggleUI(theme) {
    const btn = document.querySelector("#theme-toggle");
    if (!btn) return;

    const isDark = theme === "dark";
    btn.setAttribute("aria-pressed", String(isDark));
    btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    btn.title = isDark ? "Light Mode" : "Dark Mode";
    btn.textContent = isDark ? "☀️" : "🌙";
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current === "dark" ? "light" : "dark");

    const btn = document.querySelector("#theme-toggle");
    if (btn) {
      btn.classList.add("rotate");
      setTimeout(() => btn.classList.remove("rotate"), 400);
    }
  }

  function injectThemeToggleIfMissing() {
    if (document.querySelector("#theme-toggle")) return;

    const header = document.querySelector("header.navbar") || document.querySelector("header");
    if (!header) return;

    const btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.type = "button";
    btn.textContent = "🌙";
    btn.setAttribute("aria-label", "Toggle Theme");
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", toggleTheme);

    // taruh paling kanan navbar
    header.appendChild(btn);
  }

  // INI KUNCI: override style hardcode (background/text) biar ikut theme
  function injectThemeOverrides() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
      /* ===== THEME OVERRIDES (runtime, menang dari style.css + responsive.css) ===== */

      /* Umum: paksa body ikut variable */
      html, body {
        background: var(--bg) !important;
        color: var(--text) !important;
      }

      /* Banyak section kamu pakai background hardcode: kita netralin */
      main, section, article, footer {
        color: inherit;
      }

      /* About page di style.css kamu HARD CODE warna + background + text */
      body.about-page {
        background: var(--bg) !important;
        color: var(--text) !important;
      }
      body.about-page .hero h2 { color: var(--text) !important; }
      body.about-page .hero p  { color: var(--muted) !important; }

      /* Card/box yang putih di light mode biar aman di dark */
      .card, .box, .project-card, .blog-card, .contact-card, .team-card {
        background: var(--card) !important;
        border: 1px solid var(--border) !important;
        color: var(--text) !important;
      }

      /* Link */
      a { color: var(--text) !important; }
      a:hover { color: var(--primary) !important; }

      /* Text muted umum */
      p, span, small { color: inherit; }
    `;
  }

  document.addEventListener("DOMContentLoaded", () => {
    injectThemeToggleIfMissing();
    setTheme(getPreferredTheme());

    // kalau user belum set manual, ikuti OS (opsional)
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (THEMES.includes(saved)) return;
      setTheme(mq.matches ? "dark" : "light");
    });
  });
})();
