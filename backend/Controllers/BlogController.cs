// SỬA LỖI: Không có thư mục Data, ApplicationDbContext nằm trong Models
using Backend.Models; 
using Backend.Dtos.Blog;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly BlogService _blogService;

        // Constructor này giờ đã khớp với Program.cs
        public BlogController(BlogService blogService)
        {
            _blogService = blogService;
        }

        [HttpGet("/api/blogs")]
        public async Task<IActionResult> GetAll()
        {
            var blogs = await _blogService.GetAllAsync();
            return Ok(blogs);
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var blog = await _blogService.GetBySlugAsync(slug);
            if (blog == null)
                return NotFound();
            return Ok(blog);
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecent([FromQuery] int? count)
        {
            var blogs = await _blogService.GetRecentAsync(count ?? 5);
            return Ok(blogs);
        }

        [HttpPost("generate-preview")]
        [Authorize]
        public async Task<IActionResult> GeneratePreview([FromBody] BlogRequest request)
        {
            var (title, slug, content) = await _blogService.GeneratePreviewAsync(request);
            return Ok(new { title, slug, generatedContent = content, previewUrl = $"/blogs/{slug}" });
        }

        [HttpPost("publish")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Publish([FromBody] BlogRequest request)
        {
            var username = User.Identity?.Name ?? string.Empty;
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var blog = await _blogService.PublishAsync(request, username);
            return CreatedAtAction(nameof(GetBySlug), new { slug = blog.Slug }, blog.ToDto());
        }
        
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromBody] BlogRequest request)
        {
            var username = User.Identity?.Name ?? string.Empty;
            var blog = await _blogService.UpdateAsync(id, request, username);
            if (blog == null)
                return NotFound();
            return Ok(blog.ToDto());
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _blogService.DeleteAsync(id);
            return NoContent();
        }
    }
}