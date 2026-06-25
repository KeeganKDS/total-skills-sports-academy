document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const revealItems = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // =========================
  // Header scroll effect
  // =========================
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

  // =========================
  // Reveal animations
  // =========================
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

  // =========================
  // Facebook widget reparse
  // =========================
  const tryParseFacebookWidget = () => {
    if (window.FB && typeof window.FB.XFBML !== "undefined") {
      try {
        window.FB.XFBML.parse();
      } catch (error) {
        console.warn("Facebook widget parse error:", error);
      }
    }
  };

  // Try once shortly after load
  setTimeout(tryParseFacebookWidget, 800);

  // Try again a moment later in case SDK is slow
  setTimeout(tryParseFacebookWidget, 2000);
});