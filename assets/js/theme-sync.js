// assets/js/theme-sync.js
// Sinkron tema untuk halaman iframe (about/blog/contact, dll)
// - Ambil theme awal dari localStorage / parent
// - Dengerin perubahan via postMessage dari parent (THEME_CHANGE)
// - Dengerin storage event (kalau beda tab)
(function () {
  const KEY = "theme";

  function normalizeTheme(t) {
    return t === "dark" ? "dark" : "light";
  }

  function applyTheme(theme) {
    const t = normalizeTheme(theme);
    document.documentElement.setAttribute("data-theme", t);
  }

  // 1) Theme awal: coba ambil dari parent dulu (kalau iframe)
  try {
    const parentTheme = window.parent?.document?.documentElement?.getAttribute("data-theme");
    if (parentTheme) applyTheme(parentTheme);
  } catch (e) {
    // ignore cross access
  }

  // 2) Fallback: localStorage
  applyTheme(localStorage.getItem(KEY) || "light");

  // 3) Dengerin dari parent (ini yang bikin toggle langsung ngaruh ke iframe)
  window.addEventListener("message", (event) => {
    if (!event.data || event.data.type !== "THEME_CHANGE") return;
    applyTheme(event.data.theme);
  });

  // 4) Kalau berubah dari tab lain
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    applyTheme(e.newValue || "light");
  });
})();
