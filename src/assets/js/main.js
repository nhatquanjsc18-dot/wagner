/**
 * Bộ lọc sản phẩm theo chip (subCat) trong từng khối .filter-row + .product-grid liền sau.
 */
function initProductFilters() {
  document.querySelectorAll(".filter-row").forEach((row) => {
    const grid = row.nextElementSibling;
    if (!grid || !grid.classList.contains("product-grid")) return;

    row.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;

      row.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const filter = chip.dataset.filter || "all";
      grid.querySelectorAll(".product-card").forEach((card) => {
        const match = filter === "all" || card.dataset.subcat === filter;
        card.hidden = !match;
      });
    });
  });
}

/**
 * Cuộn mượt tới các anchor nội bộ (#powder, #liquid, #solutions, #contact...)
 */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"], a[href*="/#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname) return;
      const id = url.hash.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initProductFilters();
  initSmoothAnchors();
});
