document.addEventListener("DOMContentLoaded", () => {
  const data = Array.isArray(window.BOTNEST_CATALOGUE) ? window.BOTNEST_CATALOGUE : [];
  const search = document.getElementById("productSearch");
  const filter = document.getElementById("categoryFilter");
  const grid = document.getElementById("productCatalogue");
  const count = document.getElementById("resultCount");
  if (!grid) return;

  if (!data.length) {
    grid.innerHTML = '<p class="micro-note">The product catalogue is temporarily unavailable. Please contact BotNest for the current product list.</p>';
    if (count) count.textContent = "Catalogue enquiry";
    return;
  }

  if (filter) {
    data.forEach(category => {
      const option = document.createElement("option");
      option.value = category.category;
      option.textContent = category.category;
      filter.appendChild(option);
    });
  }

  function render() {
    const query = (search?.value || "").trim().toLowerCase();
    const selected = filter?.value || "all";
    const found = data.map(category => ({
      ...category,
      items: (category.items || []).filter(product =>
        (selected === "all" || selected === category.category) &&
        (!query || product.toLowerCase().includes(query) ||
          category.category.toLowerCase().includes(query))
      )
    })).filter(category => category.items.length);

    grid.innerHTML = found.map(category => `
      <article class="category-card">
        <div class="category-head"><h3>${category.category}</h3><span>${category.items.length} LISTED</span></div>
        <div class="product-list">${category.items.map(product => `<span class="product-chip">${product}</span>`).join("")}</div>
        <a class="category-enquire" href="contact.html?interest=${encodeURIComponent(category.category)}">Enquire about this category ↗</a>
      </article>`).join("");

    const total = found.reduce((sum, category) => sum + category.items.length, 0);
    if (count) count.textContent = `${total} product type${total === 1 ? "" : "s"} shown`;
    if (!found.length) {
      grid.innerHTML = '<p class="micro-note">No matching product types. Try another search.</p>';
    }
  }

  search?.addEventListener("input", render);
  filter?.addEventListener("change", render);
  render();
});
