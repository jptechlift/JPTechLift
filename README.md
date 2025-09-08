## JPTechLift
<!-- Thêm các huy hiệu (badges) ở đây để trông chuyên nghiệp hơn. Bạn có thể tạo chúng tại shields.io -->
![alt text](https://img.shields.io/badge/.NET-8-blueviolet)
![alt text](https://img.shields.io/badge/React-18-blue)
![alt text](https://img.shields.io/badge/TypeScript-5-orange)
![alt text](https://img.shields.io/badge/PostgreSQL-14-blue)
![alt text](https://img.shields.io/badge/license-MIT-green)
Ứng dụng full-stack giới thiệu sản phẩm thang máy, quản lý blog và người dùng, bao gồm Backend API (.NET 8) và Frontend SPA (React).
<!-- Gợi ý: Thêm một ảnh chụp màn hình ứng dụng của bạn ở đây để README hấp dẫn hơn! -->
<!-- ![App Screenshot](link-to-your-screenshot.png) -->
📜 Mục lục (Table of Contents)
🚀 Bắt đầu nhanh (Quick Start)
🏛️ Kiến trúc & Cấu trúc mã nguồn
🔧 Cài đặt chi tiết
✨ Công nghệ sử dụng
🤝 Quy trình đóng góp
❓ FAQ & Troubleshooting
🚀 Bắt đầu nhanh (Quick Start)
Làm theo các bước sau để chạy dự án trên máy của bạn.
## Yêu cầu
.NET 8 SDK
Node.js 18+
PostgreSQL
🔥 Chạy ứng dụng
code
Bash
# 1. Clone repository
git clone <your-repository-url>
cd <repository-folder>

# 2. Chạy Backend API
cd Backend
# (Thực hiện cấu hình trong appsettings.Development.json trước)
dotnet run

# 3. Mở một terminal mới và chạy Frontend
cd frontend
npm install
npm run dev
Sau các bước trên, Frontend sẽ chạy tại http://localhost:5173 và Backend tại http://localhost:5000 (hoặc cổng tương tự).
🏛️ Kiến trúc & Cấu trúc mã nguồn
Dự án được chia thành hai phần chính: Backend (ASP.NET Core API) và frontend (React SPA).
Backend
Backend tuân theo mô hình MVC cổ điển, được tổ chức như sau:
Backend/Controllers: Chịu trách nhiệm expose các HTTP endpoints.
Backend/Services: Chứa các logic nghiệp vụ chính (ví dụ: BlogService, AiBlogService).
Backend/Repositories: Đóng gói logic truy cập dữ liệu sử dụng ApplicationDbContext.
Backend/Dtos: Chứa các model cho request và response, được nhóm theo từng tính năng.
Backend/Helpers: Cung cấp các lớp tiện ích nhỏ như SlugHelper.
Frontend
Ứng dụng React được đặt trong thư mục frontend/src với cấu trúc như sau:
components/: Chứa các thành phần UI có thể tái sử dụng.
pages/: Chứa các trang có thể định tuyến (routeable pages).
services/: Chứa các client để gọi API và các bài test liên quan (services/__tests__).
hooks/, utils/, styles/, assets/: Chứa các mã nguồn và tài nguyên hỗ trợ khác.
<details>
<summary><strong>🔬 Xem chi tiết toàn bộ cấu trúc thư mục...</strong></summary>
code
Code
/
├── Backend/              # Mã nguồn ASP.NET Core API
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   └── Dtos/
├── backend.Tests/        # Các bài test xUnit cho backend
├── frontend/             # Mã nguồn React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
├── dist-script/          # Script hỗ trợ triển khai
└── Test.sln              # Solution file của .NET
</details>
🔧 Cài đặt chi tiết
Backend Configuration
Di chuyển vào thư mục Backend.
Sao chép appsettings.Development.json.example thành appsettings.Development.json.
Mở file vừa tạo và cập nhật chuỗi kết nối PostgreSQL (ConnectionStrings) và chuỗi bí mật JWT (Jwt__Secret).
Lưu ý: Dự án cũng hỗ trợ tải biến môi trường từ file .env.
Frontend Configuration
Di chuyển vào thư mục frontend.
(Tùy chọn) Sao chép .env.example thành .env để định nghĩa các biến môi trường cần thiết như VITE_API_URL.
<details>
<summary><strong>✨ Công nghệ sử dụng (Tech Stack)</strong></summary>
Backend	Frontend
C# (.NET 8)	TypeScript
ASP.NET Core MVC	React 18+
Entity Framework Core	Vite
PostgreSQL	TailwindCSS
JWT Bearer Authentication	Axios
xUnit (Testing)	Vitest & Testing Library (Testing)
</details>
<details>
<summary><strong>🤝 Quy trình đóng góp (Contribution Workflow)</strong></summary>
Tạo một nhánh mới từ nhánh main.
Thực hiện các thay đổi và đảm bảo pass tất cả các bài test:
code
Bash
# Chạy test backend
dotnet test

# Chạy test frontend (ESLint + Vitest)
npm test
Mở một Pull Request (PR) vào nhánh main.
Yêu cầu ít nhất một thành viên review và pass tất cả các kiểm tra tự động trước khi merge.
Commit Message: Vui lòng sử dụng chuẩn Conventional Commits.
</details>
<details>
<summary><strong>❓ FAQ & Troubleshooting</strong></summary>
Lỗi CORS error?
Giải pháp: Mở file Backend/Program.cs, tìm chính sách CORS tên AllowFrontend và thêm URL của frontend vào danh sách WithOrigins.
Lỗi kết nối database?
Giải pháp: Kiểm tra lại giá trị của ConnectionStrings__DefaultConnection trong file appsettings.Development.json hoặc trong biến môi trường của bạn.
Lỗi JWT secret missing?
Giải pháp: Đảm bảo biến môi trường Jwt__Secret đã được thiết lập.
</details>