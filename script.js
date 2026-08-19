(() => {
  const navToggle = document.querySelector(".nav-toggle");
  const siteMenu = document.querySelector(".site-menu");
  const navLinks = [...document.querySelectorAll('.site-menu a[href^="#"]')];

  const closeMenu = () => {
    if (!navToggle || !siteMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    siteMenu.classList.remove("is-open");
  };

  if (navToggle && siteMenu) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      siteMenu.classList.toggle("is-open", !expanded);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  const publicationItems = [...document.querySelectorAll(".publication-item")];
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const publicationStatus = document.querySelector(".publication-status");

  const applyPublicationFilter = (filter) => {
    let visibleCount = 0;

    publicationItems.forEach((item) => {
      const year = Number(item.dataset.year);
      const visible =
        filter === "all" ||
        (filter === "featured" && item.dataset.featured === "true") ||
        (filter === "earlier" && year < 2025) ||
        item.dataset.year === filter;

      item.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (publicationStatus) {
      publicationStatus.textContent = `${visibleCount} publication${visibleCount === 1 ? "" : "s"} shown`;
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => applyPublicationFilter(button.dataset.filter));
  });

  if (publicationItems.length) applyPublicationFilter("featured");

  const observedSections = [...document.querySelectorAll("main section[id]")];
  const linkBySection = new Map(
    navLinks.map((link) => [link.getAttribute("href").slice(1), link])
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) return;
        navLinks.forEach((link) => link.classList.remove("is-active"));
        const activeLink = linkBySection.get(visibleEntries[0].target.id);
        if (activeLink) activeLink.classList.add("is-active");
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: [0, 0.15, 0.45] }
    );

    observedSections.forEach((section) => observer.observe(section));
  }

  const currentYear = document.querySelector("#current-year");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
})();
