const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});
(function () {
  const items = document.querySelectorAll("#about [data-ao]");
  if (!("IntersectionObserver" in window) || !items.length) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
})();
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll("#nav-links a");

  // Tworzymy tablicę docelowych elementów na podstawie href linków
  const targets = Array.from(navLinks)
    .map((link) => {
      const id = link.getAttribute("href").slice(1); // usuwa #
      return document.getElementById(id);
    })
    .filter((el) => el); // tylko istniejące elementy

  // Funkcja ScrollSpy
  function scrollSpy() {
    const scrollPos = window.scrollY + 120; // offset dla sticky navbar
    targets.forEach((target, index) => {
      if (
        scrollPos >= target.offsetTop &&
        scrollPos < target.offsetTop + target.offsetHeight
      ) {
        navLinks.forEach((link) => link.classList.remove("active"));
        navLinks[index].classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", scrollSpy);

  // Płynne przewijanie po kliknięciu linku
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // blokujemy standardowy skok
      const id = this.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      const offset = 100; // dopasuj do wysokości navbar
      const targetPos =
        target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: targetPos,
        behavior: "smooth",
      });

      // natychmiastowe podświetlenie linku po kliknięciu
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Wywołanie od razu po załadowaniu strony
  scrollSpy();
});
document.querySelectorAll(".faq").forEach((faq) => {
  const header = faq.querySelector(".faq-header");
  const content = faq.querySelector(".faq-content");
  const btn = faq.querySelector(".faq-btn");

  header.addEventListener("click", () => {
    const isOpen = faq.classList.contains("open");
    faq.classList.toggle("open");

    if (isOpen) {
      content.style.maxHeight = content.scrollHeight + "px"; // start height
      requestAnimationFrame(() => {
        content.style.maxHeight = "0"; // animacja do 0
      });
      btn.classList.remove("rotate");
    } else {
      content.style.maxHeight = "0"; // start height
      requestAnimationFrame(() => {
        content.style.maxHeight = content.scrollHeight + "px"; // animacja do pełnej wysokości
      });
      btn.classList.add("rotate");
    }
  });
});
