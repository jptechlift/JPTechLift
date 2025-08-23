## Database Context

Dự án sử dụng PostgreSQL kết hợp EF Core và gói `EFCore.NamingConventions` để chuyển đổi tự động giữa
PascalCase của C# và snake_case của PostgreSQL.

### Quy tắc ánh xạ tên
- C# `public class User` → PostgreSQL bảng `users`
- C# `public string PhoneNumber { get; set; }` → PostgreSQL cột `phone_number`
- Khi viết LINQ (EF Core): dùng **PascalCase**.
- Khi viết SQL thuần hoặc Dapper: dùng **snake_case**.

### Cấu trúc các bảng chính
| Bảng | Khóa chính | Các cột quan trọng | Quan hệ |
|------|------------|--------------------|---------|
| **users** | `username` | `password_hash`, `email`, `phone_number`, `created_date`, `role`, `is_active`, `avatar_url`, `cover_url` | — |
| **blogs** | `id` (serial) | `title`, `created_date`, `updated_date`, `is_published` | `username` → `users.username` |
| **product_blogs** | `blog_id` | `product_name`, `product_type`, `description`, `size`, `volume`, `feature`, `target_audience`,`key_selling_points`,`seo_keywords` | `blog_id` → `blogs.id` |
| **topic_blogs** | `blog_id` | `topic`, `content`, `target_audience`,`key_selling_points`,`seo_keywords` | `blog_id` → `blogs.id` |

> Mọi đoạn code liên quan đến database cần tuân thủ các quy tắc trên.
