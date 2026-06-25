document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const revealItems = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");
  const menuToggle = document.querySelector(".menu-toggle");
  const navShell = document.querySelector(".nav-shell");

  // Header scroll effect
  const updateHeaderState = () => {
    if (!header) return;

    if (window.scrollY > 18) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  // Mobile menu toggle
  if (menuToggle && navShell) {
    menuToggle.addEventListener("click", () => {
      const open = navShell.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navShell.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  // Reveal animations
  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    revealItems.forEach((item, index) => {
      const delay = Math.min(index * 60, 420);
      item.style.transitionDelay = `${delay}ms`;
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px"
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // Smooth anchor scrolling
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      const target = document.querySelector(href);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // Active nav highlight
  const sections = Array.from(document.querySelectorAll("section[id]"));

  const updateActiveNav = () => {
    const current = sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 140 && rect.bottom >= 140;
    });

    navLinks.forEach((link) => link.classList.remove("is-active"));

    if (current) {
      const active = document.querySelector(`.nav-link[href="#${current.id}"]`);
      if (active) active.classList.add("is-active");
    }
  };

  updateActiveNav();
  window.addEventListener("scroll", updateActiveNav, { passive: true });

  // Facebook widget reparse
  const tryParseFacebookWidget = () => {
    if (window.FB && typeof window.FB.XFBML !== "undefined") {
      try {
        window.FB.XFBML.parse();
      } catch (error) {
        console.warn("Facebook widget parse error:", error);
      }
    }
  };

  setTimeout(tryParseFacebookWidget, 900);
  setTimeout(tryParseFacebookWidget, 2200);
});