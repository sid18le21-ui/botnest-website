(() => {
  const init = () => {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    const menu = document.getElementById("menuToggle");
    const nav = document.getElementById("mainNav");
    if (menu && nav) {
      menu.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        menu.setAttribute("aria-expanded", String(isOpen));
      });
    }

    // Add reveal styling only as a non-blocking enhancement.
    const items = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      items.forEach(item => observer.observe(item));
    } else {
      items.forEach(item => item.classList.add("visible"));
    }

    const form = document.getElementById("enquiry");
    if (form) {
      const params = new URLSearchParams(window.location.search);
      const interest = params.get("interest");
      const select = document.getElementById("interest");
      if (interest && select && interest.length < 80) {
        let option = [...select.options].find(item =>
          item.text.toLowerCase() === interest.toLowerCase()
        );
        if (!option) {
          option = document.createElement("option");
          option.value = interest;
          option.textContent = interest;
          select.add(option);
        }
        select.value = option.value;
      }

      form.addEventListener("submit", event => {
        event.preventDefault();
        const values = new FormData(form);
        const subject = encodeURIComponent(
          "BotNest project enquiry — " + (values.get("interest") || "General")
        );
        const body = encodeURIComponent(
          `Name: ${values.get("name")}\nEmail: ${values.get("email")}\nInterest: ${values.get("interest")}\n\nRequirement:\n${values.get("message")}`
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
