document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");

  // Terapkan theme yang tersimpan
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  // Toggle theme
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";

      document.documentElement.setAttribute("data-theme", currentTheme);
      localStorage.setItem("theme", currentTheme);
    });
  }
});
