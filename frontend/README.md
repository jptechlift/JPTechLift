🚀 Tổng quan dự án

Giới thiệu sản phẩm: Trưng bày và quản lý danh mục thang máy.

Quản lý Blog: Hệ thống CRUD cho các bài viết, tin tức kỹ thuật.

Quản lý Người dùng: Đăng ký, đăng nhập, phân quyền (Admin, Author, User).

Kiến trúc: Backend và Frontend tách biệt, giao tiếp qua REST API. Sử dụng PostgreSQL làm cơ sở dữ liệu với ánh xạ PascalCase ↔ snake_case tự động.

🛠️ Công nghệ sử dụng (Tech Stack)
Lĩnh vực	Công nghệ
Backend	C# (.NET 8), ASP.NET Core, Entity Framework Core, PostgreSQL, JWT, xUnit
Frontend	TypeScript, React 18+, Vite, TailwindCSS, Axios, Vitest
⚙️ Cài đặt môi trường
Yêu cầu tiên quyết

.NET 8 SDK

Node.js v18+

PostgreSQL: Cài đặt và tạo một database trống có tên jptechlift.

Các bước cài đặt

Clone repository

code
Bash
download
content_copy
expand_less

git clone <your-repository-url>
cd JPTechLift

Cấu hình Backend

code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
cd Backend
cp appsettings.Development.json.example appsettings.Development.json

Mở file appsettings.Development.json vừa tạo và điền các biến môi trường sau:

ConnectionStrings__DefaultConnection: Chuỗi kết nối đến database jptechlift.

Jwt__Secret: Chuỗi bí mật để ký JWT.

ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD: Dùng để khởi tạo tài khoản admin đầu tiên.

(Tùy chọn) Cấu hình SMTP để gửi email xác thực.

Cấu hình Frontend

code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
cd frontend
cp .env.example .env

Mở file .env vừa tạo và điền các biến môi trường cần thiết:

VITE_API_URL: URL của backend API (ví dụ: https://localhost:7174).

VITE_GOOGLE_CLIENT_ID: Client ID cho việc đăng nhập bằng Google.

(Tùy chọn) VITE_RECAPTCHA_SITE_KEY

⚡ Các lệnh thường dùng
Backend (/Backend directory)
code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
# Khôi phục các packages
dotnet restore

# Chạy API ở chế độ development
dotnet run

# Chạy unit tests
dotnet test
Frontend (/frontend directory)
code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
# Cài đặt các packages
npm install

# Chạy ứng dụng ở chế độ development với hot-reload
npm run dev

# Build ứng dụng cho môi trường production
npm run build

# Chạy unit tests
npm test
📂 Cấu trúc thư mục
code
Code
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
/
├── Backend/              # Mã nguồn ASP.NET Core API
│   ├── Controllers/
│   ├── Services/
│   └── Repositories/
├── backend.Tests/        # Các bài test xUnit cho backend
├── frontend/             # Mã nguồn React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
└── Test.sln              # Solution file của .NET

Entry point Backend: Backend/Program.cs

Entry point Frontend: frontend/src/main.tsx

📜 Quy ước và Quy trình

Coding Style:

Backend (C#): PascalCase

PostgreSQL: snake_case

Frontend (TS): camelCase, tuân thủ ESLint.

Commit Messages: Theo chuẩn Conventional Commits.

Workflow:

Tạo nhánh mới từ main.

Thực hiện thay đổi, đảm bảo dotnet test và npm test đều pass.

Mở Pull Request vào main, yêu cầu ít nhất một review.

❓ FAQ & Troubleshooting

Lỗi CORS?

Thêm URL của frontend vào chính sách AllowFrontend trong Backend/Program.cs.

Lỗi kết nối database?

Kiểm tra lại chuỗi ConnectionStrings__DefaultConnection trong file cấu hình hoặc biến môi trường.

Lỗi JWT secret missing?

Đảm bảo biến Jwt__Secret đã được thiết lập trước khi chạy backend.

Không khởi tạo được database?

Đảm bảo database jptechlift đã tồn tại và user trong chuỗi kết nối có đủ quyền.

