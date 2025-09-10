using Backend.Constants;
using Backend.Dtos.Blog;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

/// <summary>
/// Exposes CRUD operations for blogs.
/// </summary>
[ApiController]
public class BlogController : ControllerBase
{
    private readonly BlogService _blogService;

    public BlogController(BlogService blogService)
    {
        _blogService = blogService;
    }

    /// <summary>
    /// Retrieves all published blogs.
    /// </summary>
    [HttpGet("/api/blogs")]
    public async Task<IActionResult> GetAll()
    {
        var blogs = await _blogService.GetAllAsync();
        return Ok(blogs);
    }

    /// <summary>
    /// Retrieves a blog post by its slug.
    /// </summary>
    [HttpGet("/api/blog/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var blog = await _blogService.GetBySlugAsync(slug);
        if (blog == null)
            return NotFound();
        return Ok(blog);
    }

    /// <summary>
    /// Retrieves a list of the most recent blog posts.
    /// </summary>
    /// <param name="count">Optional maximum number of posts to return.</param>
    [HttpGet("/api/blog/recent")]
    public async Task<IActionResult> GetRecent([FromQuery] int? count)
    {
        var blogs = await _blogService.GetRecentAsync(count ?? 5);
        return Ok(blogs);
    }

    /// <summary>
    /// Generates a preview using AI based on the provided request.
    /// </summary>
    [HttpPost("/api/blog/generate-preview")]
    [Authorize]
    public async Task<IActionResult> GeneratePreview([FromBody] BlogRequest request)
    {
        // Thêm 'metaDescription' vào phần giải cấu trúc
        var (title, slug, content, metaDescription) = await _blogService.GeneratePreviewAsync(request);
        return Ok(
            new
            {
                title,
                slug,
                generatedContent = content,
                previewUrl = $"/blogs/{slug}",
                metaDescription // Bạn có thể thêm metaDescription vào phản hồi nếu frontend cần
            }
        );
    }

    /// <summary>
    /// Publishes a new blog post.
    /// </summary>
    [HttpPost("/api/blog/publish")]
    [Authorize(Roles = Roles.Admin + "," + Roles.Author)]
    public async Task<IActionResult> Publish([FromBody] BlogRequest request)
    {
        var username = User.Identity?.Name ?? string.Empty;
        var blog = await _blogService.PublishAsync(request, username);
        var blogDto = blog.ToDto();
        return CreatedAtAction(nameof(Publish), new { id = blogDto.Id }, blogDto);
    }

    /// <summary>
    /// Updates an existing blog post.
    /// </summary>
    [HttpPut("/api/blog/{id}")]
    [Authorize(Roles = Roles.Admin + "," + Roles.Author)]
    public async Task<IActionResult> Update(int id, [FromBody] BlogRequest request)
    {
        var username = User.Identity?.Name ?? string.Empty;
        var blog = await _blogService.UpdateAsync(id, request, username);
        if (blog == null)
            return NotFound();
        return Ok(blog);
    }

    /// <summary>
    /// Deletes a blog post.
    /// </summary>
    [HttpDelete("/api/blog/{id}")]
    [Authorize(Roles = Roles.Admin + "," + Roles.Author)]
    public async Task<IActionResult> Delete(int id)
    {
        await _blogService.DeleteAsync(id);
        return NoContent();
    }
}
