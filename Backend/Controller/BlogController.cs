using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly IDbContextFactory<ApplicationDbContext> _contextFactory;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        // Nâng cấp Constructor để nhận các dịch vụ cần thiết cho việc gọi API
        public BlogController(
            IDbContextFactory<ApplicationDbContext> contextFactory,
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration)
        {
            _contextFactory = contextFactory;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        // Endpoint chính để tạo blog tự động bằng AI
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateBlog([FromBody] BlogRequest blogRequest)
        {
            // 1. Validation dữ liệu đầu vào
            if (blogRequest == null || string.IsNullOrEmpty(blogRequest.Username))
            {
                return BadRequest("Dữ liệu không hợp lệ hoặc thiếu tên người dùng.");
            }

            // 2. Tạo Prompt chi tiết cho Gemini
            string prompt = CreatePromptForGemini(blogRequest);

            try
            {
                // 3. Gọi Gemini API để lấy nội dung blog
                string generatedContent = await CallGeminiApi(prompt);
                if (string.IsNullOrWhiteSpace(generatedContent))
                {
                    return StatusCode(500, "Gemini API không trả về nội dung.");
                }

                // 4. Xử lý và lưu kết quả vào CSDL
                var contentLines = generatedContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                var title = contentLines.FirstOrDefault()?.Replace("#", "").Trim() ?? "Bài viết mới";
                var body = string.Join(Environment.NewLine, contentLines.Skip(1)).Trim();

                var slug = await GenerateUniqueSlug(title);

                await using var context = await _contextFactory.CreateDbContextAsync();
                var user = await context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Username == blogRequest.Username);
                if (user == null) return NotFound("Người dùng không tồn tại.");

                var blog = new Blog
                {
                    Username = user.Username,
                    Title = title,
                    Slug = slug
                };

                if (blogRequest.BlogType == "product")
                {
                    var productBlog = new ProductBlog
                    {
                        Blog = blog,
                        Description = body,
                        ProductName = blogRequest.ProductName,
                        ProductType = blogRequest.ProductType,
                        Keyword = blogRequest.SeoKeywords
                    };
                    context.ProductBlogs.Add(productBlog);
                }
                else // topic
                {
                    var topicBlog = new TopicBlog
                    {
                        Blog = blog,
                        Content = body,
                        Topic = blogRequest.BlogTopic,
                        Keywords = blogRequest.SeoKeywords
                    };
                    context.TopicBlogs.Add(topicBlog);
                }

                await context.SaveChangesAsync();

                // 5. Trả về slug để frontend có thể chuyển hướng
                return Ok(new { message = "Blog đã được tạo thành công!", slug });
            }
            catch (Exception ex)
            {
                // Ghi lại lỗi chi tiết để debug
                Console.WriteLine($"ERROR: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, $"Đã xảy ra lỗi hệ thống: {ex.Message}");
            }
        }

        // Endpoint để lấy chi tiết bài blog bằng slug (cho trang hiển thị)
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBlogBySlug(string slug)
        {
            await using var context = await _contextFactory.CreateDbContextAsync();
            var blog = await context.Blogs
                .Include(b => b.ProductBlog)
                .Include(b => b.TopicBlog)
                .FirstOrDefaultAsync(b => b.Slug == slug);

            if (blog == null)
            {
                return NotFound("Không tìm thấy bài viết.");
            }
            blog.ViewCount++; //đếm view nhá 
            await context.SaveChangesAsync(); // ++view trong db
            var content = blog.ProductBlog?.Description ?? blog.TopicBlog?.Content;
            return Ok(new
            {
                Title = blog.Title,
                Content = content,
                CreatedDate = blog.CreatedDate,
                Author = blog.Username,
                ViewCount = blog.ViewCount 
            });
        }

        // --- CÁC PHƯƠNG THỨC HỖ TRỢ ---

        private string CreatePromptForGemini(BlogRequest request)
        {
            var promptBuilder = new StringBuilder();
            promptBuilder.AppendLine("Bạn là một chuyên gia viết content SEO chuyên nghiệp cho một công ty thang máy hàng đầu Việt Nam có tên JP Techlift.");
            promptBuilder.AppendLine("Dựa trên các thông tin dưới đây, hãy viết một bài blog hoàn chỉnh theo đúng chuẩn SEO.");
            promptBuilder.AppendLine("Yêu cầu bài viết phải có định dạng Markdown, bao gồm:");
            promptBuilder.AppendLine("- Dòng đầu tiên và duy nhất là Tiêu đề chính của bài viết (Thẻ H1), không dùng dấu #.");
            promptBuilder.AppendLine("- Một đoạn giới thiệu (sapo) hấp dẫn.");
            promptBuilder.AppendLine("- Ít nhất 3-4 mục con với tiêu đề rõ ràng (Thẻ H2, bắt đầu bằng ##).");
            promptBuilder.AppendLine("- Nội dung trong các mục phải chi tiết, hữu ích.");
            promptBuilder.AppendLine("- Một đoạn kết luận và kêu gọi hành động (Call To Action).");
            promptBuilder.AppendLine("- Giọng văn chuyên nghiệp, thuyết phục nhưng dễ hiểu.");
            promptBuilder.AppendLine("---");
            promptBuilder.AppendLine("THÔNG TIN ĐẦU VÀO:");

            if (request.BlogType == "product")
            {
                promptBuilder.AppendLine($"- Tên sản phẩm: {request.ProductName}");
                promptBuilder.AppendLine($"- Loại sản phẩm: {request.ProductType}");
                promptBuilder.AppendLine($"- Mô tả ngắn: {request.ShortDescription}");
                promptBuilder.AppendLine($"- Thông số (Kích thước, Tải trọng): {request.TechnicalSpecs}, {request.Load}");
                promptBuilder.AppendLine($"- Các tính năng chính: {request.Features}");
                promptBuilder.AppendLine($"- Từ khóa SEO cần tập trung: {request.SeoKeywords}");
            }
            else // topic
            {
                promptBuilder.AppendLine($"- Chủ đề chính: {request.BlogTopic}");
                promptBuilder.AppendLine($"- Mục đích bài viết: {request.BlogPurpose}");
                promptBuilder.AppendLine($"- Từ khóa SEO cần tập trung: {request.SeoKeywords}");
            }
            promptBuilder.AppendLine("---");
            promptBuilder.AppendLine("Bắt đầu viết bài:");

            return promptBuilder.ToString();
        }

        private async Task<string> CallGeminiApi(string prompt)
        {
            var apiKey = _configuration["Gemini:ApiKey"];
            var client = _httpClientFactory.CreateClient();
            var requestUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={apiKey}";

            var requestBody = new { contents = new[] { new { parts = new[] { new { text = prompt } } } } };

            var response = await client.PostAsJsonAsync(requestUrl, requestBody);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Lỗi gọi Gemini API: {response.StatusCode} - {errorContent}");
            }

            var jsonResponse = await response.Content.ReadFromJsonAsync<JsonElement>();
            return jsonResponse.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();
        }

        private async Task<string> GenerateUniqueSlug(string title)
        {
            if (string.IsNullOrWhiteSpace(title)) return Guid.NewGuid().ToString("N");

            string slug = title.ToLower().Trim();
            slug = Regex.Replace(slug, @"[\s\.]+", "-"); // Thay khoảng trắng, dấu chấm bằng gạch nối
            slug = Regex.Replace(slug, @"[^a-z0-9\-]", ""); // Bỏ ký tự đặc biệt
            // Bỏ các ký tự tiếng Việt có dấu
            slug = Regex.Replace(slug, "[àáạảãâầấậẩẫăằắặẳẵ]", "a");
            slug = Regex.Replace(slug, "[èéẹẻẽêềếệểễ]", "e");
            slug = Regex.Replace(slug, "[ìíịỉĩ]", "i");
            slug = Regex.Replace(slug, "[òóọỏõôồốộổỗơờớợởỡ]", "o");
            slug = Regex.Replace(slug, "[ùúụủũưừứựửữ]", "u");
            slug = Regex.Replace(slug, "[ỳýỵỷỹ]", "y");
            slug = Regex.Replace(slug, "đ", "d");
            slug = Regex.Replace(slug, @"-+", "-"); // Thay nhiều gạch nối thành 1

            await using var context = await _contextFactory.CreateDbContextAsync();

            var originalSlug = slug;
            int counter = 1;
            while (await context.Blogs.AnyAsync(b => b.Slug == slug))
            {
                slug = $"{originalSlug}-{counter++}";
            }
            return slug;
        }

        // DTO để nhận dữ liệu từ frontend (giữ nguyên)
    }

    public class BlogRequest
    {
        // ... (Giữ nguyên lớp BlogRequest với các thuộc tính nullable `string?` như đã sửa)
        public string BlogType { get; set; }
        public string Username { get; set; }
        public string? BlogTopic { get; set; }
        public string? BlogPurpose { get; set; }
        public string? ProductName { get; set; }
        public string? ProductType { get; set; }
        public string? ShortDescription { get; set; }
        public string? TechnicalSpecs { get; set; }
        public string? Load { get; set; }
        public string? Features { get; set; }
        public string? SeoKeywords { get; set; }
    }
}