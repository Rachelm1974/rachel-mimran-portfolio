(() => {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector("#site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  const portfolioItems = [...document.querySelectorAll(".portfolio-item")];
  const form = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");
  const year = document.querySelector("#year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  /* Sticky header state */
  const onScrollHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* Mobile nav */
  const setNavOpen = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setNavOpen(open);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNavOpen(false);
  });

  /* Active section highlight */
  const setActiveLink = () => {
    const offset = window.scrollY + 120;
    let currentId = sections[0]?.id;

    for (const section of sections) {
      if (section.offsetTop <= offset) {
        currentId = section.id;
      }
    }

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("is-active", isActive);
    });
  };

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* Portfolio filters */
  const applyFilter = (filter) => {
    portfolioItems.forEach((item) => {
      const match = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("is-hidden", !match);
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      filterButtons.forEach((btn) => {
        const active = btn === button;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
      });

      applyFilter(filter);
    });
  });

  /* Scroll reveal */
  const revealEls = [...document.querySelectorAll(".reveal")];

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach((el, index) => {
      el.style.transitionDelay = `${Math.min(index % 6, 5) * 60}ms`;
      observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* Contact form (front-end validation + success feedback) */
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!formStatus) return;

    const fields = {
      name: form.elements.namedItem("name"),
      phone: form.elements.namedItem("phone"),
      email: form.elements.namedItem("email"),
      message: form.elements.namedItem("message"),
    };

    let valid = true;

    Object.values(fields).forEach((field) => {
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
      const empty = !field.value.trim();
      const emailInvalid =
        field.name === "email" && field.value.trim() && !validateEmail(field.value.trim());
      const isInvalid = empty || emailInvalid;
      field.classList.toggle("is-invalid", isInvalid);
      if (isInvalid) valid = false;
    });

    formStatus.classList.remove("is-success", "is-error");

    if (!valid) {
      formStatus.textContent = "נא למלא את כל השדות כראוי.";
      formStatus.classList.add("is-error");
      return;
    }

    form.reset();
    Object.values(fields).forEach((field) => {
      if (field instanceof HTMLElement) field.classList.remove("is-invalid");
    });

    formStatus.textContent = "תודה! ההודעה נשלחה — אחזור אליכם בהקדם.";
    formStatus.classList.add("is-success");
  });
})();
