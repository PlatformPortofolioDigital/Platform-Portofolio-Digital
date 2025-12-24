document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  /* =====================
     MOBILE NAVIGATION
  ====================== */
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  /* =====================
     SMOOTH SCROLL
  ====================== */
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = link.getAttribute("href");

      if (target.startsWith("#")) {
        e.preventDefault();
        const section = document.querySelector(target);

        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }

      // Tutup menu mobile
      if (navMenu?.classList.contains("active")) {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      }
    });
  });

  /* =====================
     ACTIVE NAV INDICATOR
  ====================== */
  const currentPage = location.pathname.split("/").pop();

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});
