# WAGNER Việt Nam — Website sản phẩm (Nhất Quán)

Website giới thiệu thiết bị sơn công nghiệp WAGNER, do Công ty CP Công nghiệp Nhất Quán phân phối tại Việt Nam.

Dựng bằng **[Eleventy (11ty)](https://www.11ty.dev/)** — static site generator chạy trên Node.js. Toàn bộ nội dung sản phẩm nằm trong file dữ liệu `src/_data/products.json`, trang chi tiết từng sản phẩm được **sinh tự động** từ file này (không cần tạo tay từng file HTML).

## Cấu trúc thư mục

```
├── src/
│   ├── _data/
│   │   ├── site.json         # Thông tin công ty, liên hệ
│   │   ├── solutions.json    # 6 giải pháp theo ngành
│   │   └── products.json     # Danh mục sản phẩm (data-driven)
│   ├── _includes/
│   │   ├── layouts/base.njk  # Khung trang dùng chung
│   │   └── partials/         # header, footer, head (meta/SEO), macro product-section
│   ├── assets/
│   │   ├── css/main.css      # CSS toàn site
│   │   └── js/main.js        # Lọc sản phẩm theo chip, cuộn mượt
│   ├── san-pham/product.njk  # Template 1 trang, tự sinh 1 URL/sản phẩm (pagination)
│   └── index.njk             # Trang chủ
├── dist/                     # Output sau khi build — KHÔNG commit, KHÔNG sửa tay
├── .eleventy.js               # Cấu hình Eleventy
└── package.json
```

## Thêm / sửa sản phẩm

Chỉ cần sửa `src/_data/products.json`. Mỗi sản phẩm là 1 object:

```json
{
  "slug": "gm-4100ac",
  "sku": "GM 4100AC",
  "name": "WAGNER® GM 4100AC",
  "category": "liquid",            // "powder" hoặc "liquid"
  "categoryLabel": "Sơn tĩnh điện ướt",
  "subCat": "manual-gun",          // khoá lọc chip
  "subCatLabel": "Súng phun cầm tay",
  "img": "https://...",
  "shortDesc": "Mô tả ngắn hiển thị trên card",

  // Các field dưới đây KHÔNG bắt buộc — có thì trang chi tiết hiện đủ mục,
  // thiếu thì tự động ẩn mục đó (không lỗi).
  "lead": "Đoạn mở bài trang chi tiết...",
  "features": [["💨", "Tên đặc điểm", "Mô tả đặc điểm"]],
  "specs": { "Tên thông số": "Giá trị" },
  "applications": ["Ứng dụng 1", "Ứng dụng 2"],
  "why": "Đoạn vì sao nên chọn sản phẩm này...",
  "metaDescription": "Mô tả SEO (thẻ meta description)",
  "metaKeywords": "từ khoá, mã sản phẩm, ..."
}
```

Thêm object mới vào mảng → chạy lại `npm run dev`/`npm run build` → Eleventy tự sinh trang `/san-pham/<slug>/` kèm SEO, breadcrumb, sản phẩm liên quan.

## Chạy thử (development)

Yêu cầu: [Node.js](https://nodejs.org/) ≥ 18.

```bash
npm install       # cài dependency (chỉ cần chạy 1 lần)
npm run dev       # chạy server local tại http://localhost:8090, tự reload khi sửa file
```

## Build ra file tĩnh (production)

```bash
npm run build
```

Kết quả nằm trong thư mục `dist/` — đây là bộ file HTML/CSS/JS thuần, có thể deploy lên **bất kỳ static hosting nào** (không cần Node.js chạy trên server).

## Quản lý bằng Git / đẩy lên GitHub

```bash
git init
git add .
git commit -m "Initial commit: Wagner x Nhat Quan website"

# Tạo repo trống trên GitHub trước, sau đó:
git remote add origin https://github.com/<tài-khoản>/<tên-repo>.git
git branch -M main
git push -u origin main
```

Từ lần sau, mỗi khi sửa nội dung/thiết kế:

```bash
git add .
git commit -m "Mô tả thay đổi"
git push
```

`dist/` và `node_modules/` đã được khai báo trong `.gitignore` — không commit các thư mục này (chúng sinh ra tự động từ `src/`).

## Deploy lên Hostinger

Site dùng **Hostinger Git Deployment** (hPanel tự `git pull` từ GitHub) thay vì upload FTP tay. Vì tính năng này chỉ kéo code thô — **không** tự chạy `npm run build` — nên repo có sẵn 1 GitHub Action tự build rồi đẩy kết quả sang nhánh riêng tên **`deploy`** (nhánh này chỉ chứa file HTML/CSS/JS tĩnh sẵn sàng phục vụ, không có mã nguồn `src/`).

### Cách hoạt động

1. Push code lên nhánh `main` → GitHub Action (`.github/workflows/deploy.yml`) tự `npm run build` rồi ghi đè toàn bộ nhánh `deploy` bằng nội dung `dist/` mới nhất.
2. Hostinger Git Deployment theo dõi nhánh `deploy` → tự kéo về mỗi khi có commit mới.

### Thiết lập trên Hostinger (làm 1 lần)

1. Đăng nhập **hPanel** → chọn website → **Advanced → Git**.
2. Kết nối repository: `https://github.com/nhatquanjsc18-dot/wagner.git`
3. **Branch to deploy**: chọn `deploy` (không phải `main`).
4. **Directory**: trỏ vào `public_html` (thư mục gốc web của domain).
5. Lưu — Hostinger sẽ tự đồng bộ mỗi khi nhánh `deploy` có commit mới (một số gói có nút "Deploy now" để đồng bộ thủ công lần đầu).

### Deploy tay khi cần (không qua GitHub Actions)

```bash
npm run build
git worktree add -B deploy ../wagner-deploy-wt HEAD
cd ../wagner-deploy-wt && git rm -rf . && cp -r ../"Web Wagner"/dist/. .
git add -A && git commit -m "Deploy: static build output"
git push origin deploy
cd ../"Web Wagner" && git worktree remove ../wagner-deploy-wt --force
```

## SEO

- Mỗi trang sản phẩm tự có `<title>`, `meta description`, `meta keywords` (chứa mã sản phẩm), `og:title/description/image`, `canonical`.
- Sửa domain thật trong `src/_data/site.json` (`baseUrl`) để `canonical`/`og:image` ra đúng đường dẫn khi deploy.

## Bản quyền nội dung

Thông số kỹ thuật và hình ảnh sản phẩm tham khảo từ [wagner-group.com](https://www.wagner-group.com). Nội dung mô tả được viết lại bằng tiếng Việt, không sao chép nguyên văn.
