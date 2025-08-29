using Backend.Dtos.Blog;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

/// <summary>
/// Exposes CRUD operations for blogs.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly BlogService _blogService;

    public BlogController(BlogService blogService)
    {
        _blogService = blogService;
    }

    /// <summary>
    /// Generates a preview using AI based on the provided request.
    /// </summary>
    [HttpPost("generate-preview")]
    [Authorize]
    public async Task<IActionResult> GeneratePreview([FromBody] BlogRequest request)
    {
        var (title, slug, content) = await _blogService.GeneratePreviewAsync(request);
        return Ok(new { title, slug, generatedContent = content, previewUrl = $"/blogs/{slug}" });
    }

    /// <summary>
    /// Publishes a new blog post.
    /// </summary>
    [HttpPost]
    [Authorize]
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
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] BlogRequest request)
    {
        var username = User.Identity?.Name ?? string.Empty;
        var blog = await _blogService.UpdateAsync(id, request, username);
        if (blog == null)
            return NotFound();
        return Ok(blog);
    }
}

