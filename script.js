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
(function () {
  const tech = document.querySelector(".tech");
  const marquee = tech?.querySelector(".marquee-content");
  if (!tech || !marquee) return;

  let scrollX = 0;
  let isLocking = false;
  let isMarqueeDone = false;
  let isAutoScrolling = false;
  const tolerance = 100; // szerokość okna blokady w px

  function getScrollLength() {
    return marquee.scrollWidth - tech.clientWidth;
  }

  function lockScroll() {
    if (!isLocking) {
      document.body.style.overflow = "hidden";
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKeyDown, { passive: false });
      isLocking = true;
      console.log("Scroll pionowy zablokowany!");
    }
  }

  function unlockScroll() {
    if (isLocking) {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", onWheel, { passive: false });
      window.removeEventListener("keydown", onKeyDown, { passive: false });
      isLocking = false;
    }
  }

  function onWheel(e) {
    if (!isLocking) return;
    const delta = e.deltaY || e.deltaX;
    const maxScroll = getScrollLength();

    scrollX += delta;
    scrollX = Math.max(0, Math.min(scrollX, maxScroll));
    marquee.style.transform = `translateX(-${scrollX}px)`;

    if (scrollX >= maxScroll && delta > 0) {
      isMarqueeDone = true;
      unlockScroll();
      window.scrollTo({ top: window.scrollY + 2, behavior: "auto" });
    } else if (scrollX < maxScroll) {
      isMarqueeDone = false;
    }

    if (scrollX <= 0 && delta < 0) {
      unlockScroll();
      window.scrollTo({ top: window.scrollY - 2, behavior: "auto" });
    }

    e.preventDefault();
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      onWheel({ deltaY: 40 });
      e.preventDefault();
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      onWheel({ deltaY: -40 });
      e.preventDefault();
    }
  }

  function onScroll() {
    if (isAutoScrolling) return;
    const rect = tech.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // BLOKUJEMY scroll GDY DÓŁ .tech JEST W ZAKRESIE tolerance px OD DOŁU OKNA
    if (
      rect.bottom <= windowHeight + tolerance &&
      rect.bottom >= windowHeight - tolerance &&
      !isMarqueeDone
    ) {
      isAutoScrolling = true;
      window.scrollTo({
        top: window.scrollY + rect.bottom - windowHeight,
        behavior: "auto",
      });
      setTimeout(() => {
        lockScroll();
        isAutoScrolling = false;
      }, 10);
    } else {
      unlockScroll();
      if (rect.top > windowHeight) {
        scrollX = 0;
        marquee.style.transform = `translateX(0)`;
        isMarqueeDone = false;
      }
      if (rect.bottom < 0) {
        scrollX = getScrollLength();
        marquee.style.transform = `translateX(-${scrollX}px)`;
      }
    }
  }

  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", () => {
    scrollX = Math.max(0, Math.min(scrollX, getScrollLength()));
    marquee.style.transform = `translateX(-${scrollX}px)`;
  });

  marquee.style.transform = "translateX(0)";
})();

const modal = document.getElementById("modal");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");

openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  requestAnimationFrame(() => {
    modal.classList.add("show");
  });
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 800);
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 800);
  }
});
fetch("gallery.json")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("gallery-container");

    data.forEach((item) => {
      const card = document.createElement("section");
      card.className = "card";

      card.innerHTML = `
        <div class="media">
          <img src="${item.url}" alt="${item.title}">
          <button class="btn bottom-right" type="button" onclick="alert('Klik!')">Kup teraz</button>
        </div>
        <p class="label">${item.title} – ${item.description}</p>
      `;

      container.appendChild(card);
    });
  })
  .catch((error) => console.error("Błąd wczytywania JSON:", error));
