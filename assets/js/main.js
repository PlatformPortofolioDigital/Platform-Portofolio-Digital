// assets/js/main.js
// Dark/Light mode + localStorage + auto inject toggle (tanpa ubah HTML)
(function () {
  const STORAGE_KEY = "theme"; // "light" | "dark"

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    document.documentElement.classList.add("theme-transition");
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 250);
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";

    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);

    const btn = document.querySelector("#theme-toggle");
    if (btn) {
      btn.classList.add("rotate");
      setTimeout(() => btn.classList.remove("rotate"), 350);
    }
  }

  function ensureVariablesCssLoaded() {
    const already = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .some(l => (l.getAttribute("href") || "").includes("assets/css/variables.css"));
    if (already) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = location.pathname.includes("/pages/")
      ? "../assets/css/variables.css"
      : "assets/css/variables.css";

    document.head.appendChild(link);
  }

  function injectThemeToggleIfMissing() {
    if (document.querySelector("#theme-toggle")) return;

    const header = document.querySelector("header.navbar") || document.querySelector("header");
    if (!header) return;

    const btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.type = "button";
    btn.textContent = "🌙";
    btn.title = "Toggle Theme";
    btn.setAttribute("aria-label", "Toggle Theme");

    btn.addEventListener("click", toggleTheme);

    // taruh di dalam header (bukan nav), supaya mobile rapi
    header.appendChild(btn);
  }

  function syncToggleIcon() {
    const btn = document.querySelector("#theme-toggle");
    if (!btn) return;
    const theme = document.documentElement.getAttribute("data-theme") || "light";
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  function listenOsThemeChange() {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return; // user choose manual
      setTheme(mq.matches ? "dark" : "light");
      syncToggleIcon();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureVariablesCssLoaded();
    setTheme(getPreferredTheme());
    injectThemeToggleIfMissing();
    syncToggleIcon();

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("#theme-toggle");
      if (!btn) return;
      // icon update setelah toggle
      setTimeout(syncToggleIcon, 0);
    });

    listenOsThemeChange();
  });
})();
