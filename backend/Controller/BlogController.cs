using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BlogController(AppDbContext context)
        {
            _context = context;
        }
        // POST api/blog
        [HttpPost]
        public async Task<IActionResult> CreateBlog([FromBody] BlogRequest blogRequest)
        {
            if (blogRequest == null)
            {
                return BadRequest("Invalid data.");
            }

            var blog = new Blog
            {
                BlogType = blogRequest.BlogType,
                BlogTopic = blogRequest.BlogTopic,
                BlogPurpose = blogRequest.BlogPurpose,
                SeoKeywords = blogRequest.SeoKeywords,
                ProductName = blogRequest.ProductName,
                ProductType = blogRequest.ProductType,
                ShortDescription = blogRequest.ShortDescription,
                TechnicalSpecs = blogRequest.TechnicalSpecs,
                Features = blogRequest.Features
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();
              return Ok(new { message = "Blog đã được tạo thành công!", blog.Id });
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
    }
}
