// assets/js/main.js
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

    // small delight: rotate icon
    const btn = document.querySelector("#theme-toggle");
    if (btn) {
      btn.classList.add("rotate");
      setTimeout(() => btn.classList.remove("rotate"), 400);
    }
  }

  function ensureVariablesCssLoaded() {
    const links = [...document.querySelectorAll('link[rel="stylesheet"]')];
    const already = links.some(l => (l.getAttribute("href") || "").includes("assets/css/variables.css"));
    if (already) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";

    const isPages = location.pathname.includes("/pages/");
    link.href = isPages ? "../assets/css/variables.css" : "assets/css/variables.css";

    document.head.appendChild(link);
  }

  function injectThemeToggleIfMissing() {
    if (document.querySelector("#theme-toggle")) return;

    const nav =
      document.querySelector("header nav") ||
      document.querySelector("nav") ||
      document.querySelector(".navbar") ||
      document.querySelector("header");

    if (!nav) return;

    const btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.type = "button";
    btn.textContent = "🌓";
    btn.title = "Toggle Theme";
    btn.setAttribute("aria-label", "Toggle Theme");
    btn.style.marginLeft = "10px";
    btn.style.verticalAlign = "middle";

    btn.addEventListener("click", toggleTheme);
    nav.appendChild(btn);
  }

  function listenOsThemeChange() {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return;
      setTheme(mq.matches ? "dark" : "light");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureVariablesCssLoaded();
    setTheme(getPreferredTheme());
    injectThemeToggleIfMissing();
    listenOsThemeChange();
  });
})();
