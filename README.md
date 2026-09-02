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

Hostinger hosting thường (shared hosting) chỉ phục vụ file tĩnh — **không cần cài Node.js trên server**, vì Eleventy đã build sẵn ra HTML/CSS/JS.

### Cách 1 — Tải tay qua File Manager / FTP (đơn giản nhất)

1. Chạy `npm run build` trên máy để tạo thư mục `dist/`.
2. Đăng nhập **hPanel Hostinger** → **File Manager** (hoặc dùng FileZilla với thông tin FTP trong hPanel → Advanced → FTP Accounts).
3. Vào thư mục `public_html` của domain, xoá/backup nội dung cũ nếu có.
4. Upload **toàn bộ nội dung bên trong** `dist/` (không upload thư mục `dist` lồng thêm 1 cấp — các file `index.html`, `assets/`, `san-pham/`... phải nằm trực tiếp trong `public_html`).
5. Truy cập domain để kiểm tra.

### Cách 2 — Tự động deploy khi push GitHub (GitHub Actions)

Repo đã có sẵn workflow mẫu tại `.github/workflows/deploy.yml`, dùng FTP để đẩy thư mục `dist/` lên Hostinger mỗi khi push nhánh `main`. Cần khai báo 3 secret trong **GitHub repo → Settings → Secrets and variables → Actions**:

| Secret | Giá trị lấy từ |
|---|---|
| `FTP_SERVER` | hPanel → Files → FTP Accounts (thường là `ftp.tenmien.com` hoặc IP server) |
| `FTP_USERNAME` | Tài khoản FTP trong hPanel |
| `FTP_PASSWORD` | Mật khẩu FTP trong hPanel |

Sau khi khai báo secret, mỗi lần `git push origin main`, GitHub Actions sẽ tự build và đẩy `dist/` lên `public_html` trên Hostinger.

## SEO

- Mỗi trang sản phẩm tự có `<title>`, `meta description`, `meta keywords` (chứa mã sản phẩm), `og:title/description/image`, `canonical`.
- Sửa domain thật trong `src/_data/site.json` (`baseUrl`) để `canonical`/`og:image` ra đúng đường dẫn khi deploy.

## Bản quyền nội dung

Thông số kỹ thuật và hình ảnh sản phẩm tham khảo từ [wagner-group.com](https://www.wagner-group.com). Nội dung mô tả được viết lại bằng tiếng Việt, không sao chép nguyên văn.
