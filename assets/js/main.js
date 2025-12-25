// assets/js/main.js

(function () {
  const STORAGE_KEY = "theme"; // "light" | "dark"

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    // smooth transition
    document.documentElement.classList.add("theme-transition");
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 300);
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;

    // follow OS if no saved preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";

    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);

    const btn = document.querySelector("#theme-toggle");
    if (btn) btn.setAttribute("aria-label", `Switch to ${current} mode`);
  }

  // inject variables.css if HTML doesn't include it
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

    const nav = document.querySelector("nav") || document.querySelector(".navbar") || document.querySelector("header");
    if (!nav) return;

    const btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.type = "button";
    btn.textContent = "🌓";
    btn.title = "Toggle theme";
    btn.setAttribute("aria-label", "Toggle theme");

    btn.addEventListener("click", toggleTheme);

    // place it at end of navbar
    nav.appendChild(btn);
  }

  // OPTIONAL: if user changes OS theme & user hasn't saved preference
  function listenOsThemeChange() {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return; // user already chose
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
