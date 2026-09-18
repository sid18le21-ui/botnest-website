const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const scrollProgress = document.getElementById("scrollProgress");

menuBtn?.addEventListener("click", () => {
  nav?.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => nav?.classList.remove("open"));
});

// Reveal sections and cards as they enter the viewport.
const revealItems = document.querySelectorAll(
  ".section, .stats-strip, .program-card, .why-item, .journey-step, .project-card, .cta-section, .contact-card"
);
revealItems.forEach((el, index) => {
  el.classList.add("reveal");
  if (index % 4 !== 0) el.classList.add(`reveal-delay-${(index % 4)}`);
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealItems.forEach(el => observer.observe(el));
} else {
  revealItems.forEach(el => el.classList.add("is-visible"));
}

function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollProgress) scrollProgress.style.width = `${maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0}%`;

  const x = (window.innerWidth / 2 - window.scrollX * 0.02) / 30;
  document.querySelectorAll(".orb").forEach((orb, i) => {
    const speed = i === 0 ? 0.12 : -0.08;
    orb.style.transform = `translate3d(${x * speed}px, ${-scrollTop * speed}px, 0)`;
  });
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollEffects();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
updateScrollEffects();

document.getElementById("year").textContent = new Date().getFullYear();
