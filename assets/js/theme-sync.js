// assets/js/theme-sync.js
(function () {
  const KEY = "theme";

  function applyTheme(theme) {
    const t = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", t);
  }

  // theme awal
  applyTheme(localStorage.getItem(KEY) || "light");

  // kalau theme berubah dari halaman lain
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    applyTheme(e.newValue || "light");
  });
})();
