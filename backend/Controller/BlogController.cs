using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
         private readonly ApplicationDbContext _context;

        public BlogController(ApplicationDbContext context)
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
                Title = blogRequest.BlogType == "product" ? blogRequest.ProductName : blogRequest.BlogTopic,
                Username = blogRequest.Username
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

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
                _context.ProductBlogs.Add(product);
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
                _context.TopicBlogs.Add(topic);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Blog đã được tạo thành công!", blogId = blog.Id });
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
