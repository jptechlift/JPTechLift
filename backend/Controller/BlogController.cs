using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;  // Đảm bảo thêm namespace DbContext

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IDbContextFactory<ApplicationDbContext> _contextFactory;
        public BlogController(IDbContextFactory<ApplicationDbContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        // POST api/blog
        [HttpPost]
        public async Task<IActionResult> CreateBlog([FromBody] BlogRequest blogRequest)
        {
            if (blogRequest == null)
            {
                return BadRequest("Invalid data.");
            }
            await using var context = await _contextFactory.CreateDbContextAsync();

            var userExists = await context.Users
                .AnyAsync(u => u.Username == blogRequest.Username);
            if (!userExists)
            {
                return NotFound("User not found.");
            }


            var blog = new Blog
            {
                Title = blogRequest.BlogType == "product" ? blogRequest.ProductName : blogRequest.BlogTopic,
                Username = blogRequest.Username
            };

            Console.WriteLine($"--- Attempting to save blog for user: '[{blog.Username}]' ---");

            context.Blogs.Add(blog);
            await context.SaveChangesAsync();

            // Xử lý theo BlogType
            if (blogRequest.BlogType == "product")
            {
                var product = new ProductBlog
                {
                    BlogId = blog.Id,
                    ProductName = blogRequest.ProductName,
                    ProductType = blogRequest.ProductType,
                    Description = blogRequest.ShortDescription,
                    Size = blogRequest.TechnicalSpecs,
                    Volumn = blogRequest.TechnicalSpecs,
                    Feature = blogRequest.Features,
                    Keyword = blogRequest.SeoKeywords
                };
                context.ProductBlogs.Add(product);
            }
            else if (blogRequest.BlogType == "topic")
            {
                var topic = new TopicBlog
                {
                    BlogId = blog.Id,
                    Topic = blogRequest.BlogTopic,
                    Content = blogRequest.BlogPurpose,
                    Keywords = blogRequest.SeoKeywords
                };
                context.TopicBlogs.Add(topic);
            }

            await context.SaveChangesAsync();

            return Ok(new { message = "Blog đã được tạo thành công!", blogId = blog.Id });
        }

        // =================================================================
        // DÁN PHƯƠNG THỨC "THÁM TỬ" NÀY VÀO
        // =================================================================
        [HttpGet("diagnose-user/{username}")]
        public async Task<IActionResult> DiagnoseUser(string username)
        {
            var report = new System.Text.StringBuilder();
            report.AppendLine($"--- DIAGNOSTIC REPORT FOR USER: '{username}' ---");
            report.AppendLine();

            await using var context = await _contextFactory.CreateDbContextAsync();

            try
            {
                // TEST 1: CHẠY LẠI CHÍNH XÁC CÂU LỆNH GÂY LỖI
                report.AppendLine("TEST 1: Running the failing AnyAsync query...");
                bool userExists = await context.Users.AnyAsync(u => u.Username == username);
                report.AppendLine($" -> Result: {userExists}");
                report.AppendLine("--------------------------------------------------");

                // TEST 2: LẤY TOÀN BỘ DANH SÁCH USERS VÀ SO SÁNH TRONG C#
                report.AppendLine("TEST 2: Fetching ALL users and comparing in C# code...");
                var allUsers = await context.Users.ToListAsync();
                report.AppendLine($" -> Found {allUsers.Count} user(s) in the database.");

                bool manualMatchFound = false;
                foreach (var dbUser in allUsers)
                {
                    // So sánh từng byte để tìm ký tự ẩn
                    var inputBytes = System.Text.Encoding.UTF8.GetBytes(username);
                    var dbBytes = System.Text.Encoding.UTF8.GetBytes(dbUser.Username);

                    report.AppendLine();
                    report.AppendLine($"   - Comparing input '{username}' (Length: {username.Length}) with DB user '{dbUser.Username}' (Length: {dbUser.Username.Length})");
                    report.AppendLine($"     -> Case-Sensitive C# Match (string.Equals): {string.Equals(dbUser.Username, username, StringComparison.Ordinal)}");
                    report.AppendLine($"     -> Case-Insensitive C# Match (string.Equals): {string.Equals(dbUser.Username, username, StringComparison.OrdinalIgnoreCase)}");
                    report.AppendLine($"     -> Byte-level Match: {inputBytes.SequenceEqual(dbBytes)}");

                    if (string.Equals(dbUser.Username, username, StringComparison.Ordinal))
                    {
                        manualMatchFound = true;
                    }
                }
                report.AppendLine();
                report.AppendLine($" -> Overall Manual C# Match Found: {manualMatchFound}");
                report.AppendLine("--------------------------------------------------");

                // KẾT LUẬN
                report.AppendLine("CONCLUSION:");
                if (userExists && manualMatchFound)
                {
                    report.AppendLine("Everything appears correct. The error is extremely unusual.");
                }
                else if (!userExists && manualMatchFound)
                {
                    report.AppendLine("CRITICAL FINDING: C# can find the user, but EF Core's AnyAsync query cannot. This points to a potential issue in EF Core query translation or database collation settings.");
                }
                else
                {
                    report.AppendLine("CRITICAL FINDING: Neither C# nor EF Core can find a match. This indicates a hidden character or encoding mismatch between the input and the stored data.");
                }

                return Content(report.ToString(), "text/plain");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred during diagnosis: {ex.Message}\n{ex.StackTrace}");
            }
        }
    }

    // DTO để nhận dữ liệu blog từ frontend
    public class BlogRequest
    {
        public string BlogType { get; set; }
        public string BlogTopic { get; set; }
        public string BlogPurpose { get; set; }
        public string SeoKeywords { get; set; }
        public string ProductName { get; set; }
        public string ProductType { get; set; }
        public string ShortDescription { get; set; }
        public string TechnicalSpecs { get; set; }
        public string Features { get; set; }
        public string Username { get; set; }
    }
}
