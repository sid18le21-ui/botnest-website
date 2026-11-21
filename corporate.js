(() => {
  // Mark the page as animation-capable only when this script actually loads.
  // If JS is blocked or the file path is wrong, all content remains visible.
  document.documentElement.classList.add("js-ready");

  const init = () => {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    const menu = document.getElementById("menuToggle");
    const nav = document.getElementById("mainNav");
    if (menu && nav) {
      menu.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        menu.setAttribute("aria-expanded", String(open));
      });
    }

    const revealItems = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach(el => el.classList.add("visible"));
    } else {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.01, rootMargin: "0px 0px -5% 0px" });

      revealItems.forEach(el => observer.observe(el));

      // Ensure above-the-fold content never stays hidden if an observer
      // callback is delayed or a browser behaves unusually.
      requestAnimationFrame(() => {
        revealItems.forEach(el => {
          if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
            el.classList.add("visible");
            observer.unobserve(el);
          }
        });
      });
    }

    const form = document.getElementById("enquiry");
    if (form) {
      const params = new URLSearchParams(window.location.search);
      const interest = params.get("interest");
      const select = document.getElementById("interest");
      if (interest && select) {
        const option = [...select.options].find(o =>
          o.text.toLowerCase() === interest.toLowerCase()
        );
        if (option) {
          select.value = option.value;
        } else if (interest.length < 80) {
          const added = document.createElement("option");
          added.textContent = interest;
          added.value = interest;
          select.add(added);
          select.value = interest;
        }
      }

      form.addEventListener("submit", event => {
        event.preventDefault();
        const data = new FormData(form);
        const subject = encodeURIComponent(
          "BotNest project enquiry — " + (data.get("interest") || "General")
        );
        const body = encodeURIComponent(
          `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nInterest: ${data.get("interest")}\n\nRequirement:\n${data.get("message")}`
        );
        window.location.href =
          `mailto:botnest.officials@gmail.com?subject=${subject}&body=${body}`;
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
