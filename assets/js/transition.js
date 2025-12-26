// SCROLL ANIMATION (INTERSECTION OBSERVER)
const animatedElements = document.querySelectorAll(".animate");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // animasi hanya sekali
      }
    });
  },
  {
    threshold: 0.15, // muncul saat 15% elemen terlihat
  }
);

animatedElements.forEach((el) => observer.observe(el));
