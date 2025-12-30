// assets/js/main.js
// Dark/Light mode + localStorage + auto inject toggle + iframe sync
(function () {
  if (window.__PPD_MAIN_INIT__) return;
  window.__PPD_MAIN_INIT__ = true;

  const STORAGE_KEY = "theme"; // "light" | "dark"

  /* ===============================
     SET THEME (GLOBAL)
     - set ke <html>
     - kirim ke iframe
  ================================ */
  function setTheme(theme) {
    // set di halaman utama
    document.documentElement.setAttribute("data-theme", theme);

    // animasi transisi halus
    document.documentElement.classList.add("theme-transition");
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 250);

    // 🔥 KIRIM THEME KE SEMUA IFRAME
    document.querySelectorAll(".page-frame").forEach((iframe) => {
      try {
        iframe.contentWindow.postMessage(
          { type: "THEME_CHANGE", theme },
          "*"
        );
      } catch (e) {
        // aman, abaikan jika iframe belum siap
      }
    });
  }

  /* ===============================
     GET PREFERRED THEME
  ================================ */
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  /* ===============================
     TOGGLE THEME
  ================================ */
  function toggleTheme() {
    const current =
      document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";

    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);

    const btn = document.querySelector("#theme-toggle");
    if (btn) {
      btn.classList.add("rotate");
      setTimeout(() => btn.classList.remove("rotate"), 350);
    }
  }

  /* ===============================
     ENSURE variables.css LOADED
  ================================ */
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

  /* ===============================
     INJECT TOGGLE BUTTON (IF MISSING)
  ================================ */
  function injectThemeToggleIfMissing() {
    if (document.querySelector("#theme-toggle")) return;

    const header =
      document.querySelector("header.navbar") ||
      document.querySelector("header");
    if (!header) return;

    const btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.type = "button";
    btn.textContent = "🌙";
    btn.title = "Toggle Theme";
    btn.setAttribute("aria-label", "Toggle Theme");

    btn.addEventListener("click", toggleTheme);

    // taruh di header (bukan di nav)
    header.appendChild(btn);
  }

  /* ===============================
     SYNC ICON
  ================================ */
  function syncToggleIcon() {
    const btn = document.querySelector("#theme-toggle");
    if (!btn) return;

    const theme =
      document.documentElement.getAttribute("data-theme") || "light";
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  /* ===============================
     LISTEN OS THEME CHANGE
  ================================ */
  function listenOsThemeChange() {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return;

      const next = mq.matches ? "dark" : "light";
      setTheme(next);
      syncToggleIcon();
    });
  }

  /* ===============================
     INIT
  ================================ */
  document.addEventListener("DOMContentLoaded", () => {
    ensureVariablesCssLoaded();

    const initialTheme = getPreferredTheme();
    setTheme(initialTheme);

    injectThemeToggleIfMissing();
    syncToggleIcon();

    // update icon setelah toggle
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("#theme-toggle");
      if (!btn) return;
      setTimeout(syncToggleIcon, 0);
    });

    listenOsThemeChange();
  });
})();

/* =========================================================
   WELCOME SCREEN (sekali per TAB)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const welcome = document.getElementById("welcome-screen");
  if (!welcome) return;

  const shown = sessionStorage.getItem("welcomeShown");

  if (shown) {
    welcome.style.display = "none";
    return;
  }

  sessionStorage.setItem("welcomeShown", "true");

  const DURATION = 1800; // 1.8 detik
  setTimeout(() => {
    welcome.classList.add("hide");
    setTimeout(() => {
      welcome.style.display = "none";
    }, 400);
  }, DURATION);
});
