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

/**
 * Gửi form liên hệ qua Web3Forms bằng AJAX (không rời trang), hiện thông báo kết quả.
 * Đăng ký access key miễn phí tại https://web3forms.com rồi điền vào src/_data/site.json (web3formsKey).
 */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const statusBox = document.getElementById("cf-status");
  const submitBtn = form.querySelector('button[type="submit"]');

  function showStatus(message, isError) {
    statusBox.hidden = false;
    statusBox.textContent = message;
    statusBox.className = "form-status " + (isError ? "form-status-error" : "form-status-success");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (form.querySelector('input[name="botcheck"]').checked) return; // spam bot

    const accessKey = form.querySelector('input[name="access_key"]').value;
    if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
      showStatus("Form chưa được cấu hình access key. Vui lòng liên hệ qua hotline/email bên trên.", true);
      return;
    }

    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Đang gửi...";

    // Web3Forms không giải mã đúng tên field (key) chứa dấu tiếng Việt (bị lỗi font
    // trong email nhận được), nên gộp toàn bộ thông tin thành 1 khối văn bản có nhãn
    // tiếng Việt rõ ràng, gửi qua field "message" (tên field bằng tiếng Anh, an toàn).
    const val = (name) => (form.elements[name] ? form.elements[name].value.trim() : "");
    const messageBlock = [
      `Họ và tên: ${val("full_name")}`,
      `Số điện thoại: ${val("phone")}`,
      `Email: ${val("email") || "(không cung cấp)"}`,
      `Công ty / Đơn vị: ${val("company") || "(không cung cấp)"}`,
      `Sản phẩm quan tâm: ${val("product") || "(chưa chọn)"}`,
      "",
      "Nội dung cần tư vấn:",
      val("detail") || "(không có)",
    ].join("\n");

    const payload = new FormData();
    payload.append("access_key", form.querySelector('input[name="access_key"]').value);
    payload.append("subject", form.querySelector('input[name="subject"]').value);
    payload.append("from_name", form.querySelector('input[name="from_name"]').value);
    payload.append("name", val("full_name"));
    payload.append("email", val("email"));
    payload.append("message", messageBlock);

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });
      const data = await res.json();

      if (data.success) {
        showStatus("Cảm ơn bạn! Yêu cầu đã được gửi, đội ngũ tư vấn sẽ liên hệ lại sớm nhất.", false);
        form.reset();
      } else {
        showStatus("Gửi yêu cầu chưa thành công, vui lòng thử lại hoặc gọi hotline.", true);
      }
    } catch (err) {
      showStatus("Không thể kết nối, vui lòng kiểm tra mạng và thử lại hoặc gọi hotline.", true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initProductFilters();
  initSmoothAnchors();
  initContactForm();
});
