(()=> {
  const $ = selector => document.querySelector(selector);
  document.addEventListener("DOMContentLoaded", () => {
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
    const menuButton = $("#menuToggle");
    const nav = $("#mainNav");
    if (menuButton && nav) {
      menuButton.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", String(open));
      });
    }
    const form = $("#enquiry");
    if (form) {
      form.addEventListener("submit", event => {
        event.preventDefault();
        const data = new FormData(form);
        const subject = encodeURIComponent("BotNest website enquiry — " + data.get("interest"));
        const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\nInterest: ${data.get("interest")}\n\nRequirement:\n${data.get("message")}`);
        window.location.href = `mailto:botnest.officials@gmail.com?subject=${subject}&body=${body}`;
      });
    }
  });
})();
