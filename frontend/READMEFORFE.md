
# JPTechLift Frontend

![alt text](https://img.shields.io/badge/React-18-blue)
![alt text](https://img.shields.io/badge/Vite-5-purple)
![alt text](https://img.shields.io/badge/TypeScript-5-orange)
![alt text](https://img.shields.io/badge/TailwindCSS-3-cyan)

Ứng dụng React SPA phục vụ giao diện cho khách hàng, trang quản trị và blog của dự án JPTechLift.

## 🚀 Cài đặt & Chạy (Setup & Run)
### ✅ Yêu cầu

Node.js 18+

npm 9+

## 🔥 Chạy ứng dụng
```bash
Clone repository

git clone <repository-url>
cd JPTechLift/frontend
```
### Cài đặt các phụ thuộc
```bash
npm install
```
### Cấu hình biến môi trường
Sao chép file .env.example thành .env và điền các giá trị cần thiết.
```bash
cp .env.example .env
```
### Chạy ở chế độ development
```bash
npm run dev
```
## ⚙️ Biến môi trường (Environment Variables)

Các biến sau cần được định nghĩa trong file .env của bạn:

```bash
# URL của backend API
VITE_API_URL=

# URL của trang frontend
VITE_SITE_URL=

# Khóa reCAPTCHA của Google
VITE_RECAPTCHA_SITE_KEY=

# Client ID cho việc đăng nhập bằng Google
VITE_GOOGLE_CLIENT_ID=
```
## 🛠️ Các lệnh có sẵn (Available Scripts)
Lệnh	Mô tả
```bash
npm run dev	//Chạy ứng dụng ở chế độ development với hot-reload.
npm run build	//Build ứng dụng cho môi trường production.
npm run preview	//Xem trước bản build production trên máy local.
npm run prerender	//Chạy script prerender sitemap và file redirects.
npm test	//Chạy ESLint để kiểm tra code và Vitest để chạy unit tests.
npm run lint	//Chỉ chạy ESLint để kiểm tra chất lượng code.
npm run generate-sitemap	//Tạo file sitemap.xml.
```
📁 Cấu trúc thư mục (Folder Structure)
```bash
frontend/
├── index.html                  # HTML entry point
├── src/
│   ├── main.tsx                # App entry point
│   ├── App.tsx                 # Main app component
│   ├── components/             # Các UI component tái sử dụng
│   ├── pages/                  # Các trang chính của ứng dụng
│   ├── routes/                 # Cấu hình định tuyến
│   ├── services/               # Logic gọi API
│   ├── hooks/                  # Các custom React hooks
│   ├── utils/                  # Các hàm tiện ích
│   └── styles/                 # Files CSS/SCSS
├── public/                     # Chứa các file tĩnh (favicon, images)
├── scripts/                    # Các script tự động (prerender, sitemap)
├── tailwind.config.js          # Cấu hình TailwindCSS
├── vite.config.ts              # Cấu hình Vite
└── eslint.config.js            # Cấu hình ESLint
<br>
```
<details>
<summary><strong>📦 Xem danh sách các phụ thuộc chính...</strong></summary>

- Production Dependencies	Dev Dependencies
- React 18 & React Router DOM	Vite & Vitest
- Axios	Testing Library (react, user-event)
- React Hook Form & Zod	TypeScript
- TailwindCSS & Framer Motion	ESLint (với các plugin)
- Swiper & AOS	TailwindCSS CLI & PostCSS
- Lucide React & EmailJS	Sass Embedded & tsx
- DomPurify & React Helmet Async	gh-pages & jsdom
- react-intersection-observer	
- react-markdown & react-responsive	
- react-google-recaptcha	
- react-countup & @react-oauth/google	

</details>

<br>

<details>
<summary><strong>🎨 Quy ước mã hóa (Coding Style)</strong></summary>


- Module System: Sử dụng TypeScript module với cú pháp ESM (import/export).

- Naming Convention: Tên biến và hàm dùng camelCase.

- Code Quality: Tuân thủ các quy tắc được định nghĩa trong eslint.config.js.

- Commit Messages: Sử dụng chuẩn Conventional Commits (ví dụ: feat: add login page, fix: button alignment).

</details>

## 📄 Phục vụ tài liệu PDF tĩnh

- Sao chép các file `.pdf` của bạn vào thư mục `frontend/public/docs/`. Mỗi file đặt tên không chứa dấu cách để URL gọn và ổn định.
- Khi build, Vite giữ nguyên mọi file trong `public`, do đó tài liệu sẽ được phát trực tiếp tại đường dẫn `/docs/<ten-file>.pdf` sau khi deploy.
- Trong HTML tĩnh, đặt liên kết như sau để trình duyệt mở trình đọc PDF có sẵn:

  ```html
  <a href="/docs/bao-cao-tai-chinh.pdf" target="_blank" rel="noopener noreferrer">
    Xem báo cáo PDF
  </a>
  ```

- Trong component React, dùng cùng URL tuyệt đối từ gốc để tránh lỗi bundler:

  ```tsx
  export function DocumentButton() {
    return (
      <a
        href="/docs/bao-cao-tai-chinh.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded bg-primary px-4 py-2 text-white"
      >
        Xem tài liệu
      </a>
    );
  }
  ```

- Kiểm tra sau deploy bằng cách truy cập trực tiếp URL (ví dụ `https://ten-mien/docs/bao-cao-tai-chinh.pdf`). Nếu tài liệu hiển thị, mọi nút/link trỏ tới nó cũng hoạt động.