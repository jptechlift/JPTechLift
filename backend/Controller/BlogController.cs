using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        // POST api/blog
        [HttpPost]
        public async Task<IActionResult> CreateBlog([FromBody] BlogRequest blogRequest)
        {
            if (blogRequest == null)
            {
                return BadRequest("Invalid data.");
            }

            // Giả sử bạn lưu blog vào cơ sở dữ liệu hoặc xử lý dữ liệu ở đây
            // Ví dụ:
            // _blogService.Save(blogRequest);

            return Ok(new { message = "Blog đã được tạo thành công!" });
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
