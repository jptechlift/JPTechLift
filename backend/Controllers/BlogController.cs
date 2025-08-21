using System.Security.Claims;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/blog")]
public class BlogController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly AiBlogService _ai;

    public BlogController(ApplicationDbContext context, AiBlogService ai)
    {
        _context = context;
        _ai = ai;
    }

    [HttpPost("generate-preview")]
    [Authorize]
    public async Task<IActionResult> GeneratePreview([FromBody] BlogRequest request)
    {
        var title = request.BlogType == "product"
            ? request.ProductDetails?.ProductName
            : request.TopicDetails?.Topic;
        if (title == null)
            return BadRequest();

        var generated = await _ai.GenerateContentAsync(title);
        return Ok(new { generatedContent = generated });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Publish([FromBody] BlogRequest request)
    {
        var username = User.FindFirstValue(ClaimTypes.Name) ?? string.Empty;
        var blog = new Blog
        {
            Title = request.BlogType == "product" ? request.ProductDetails!.ProductName : request.TopicDetails!.Topic,
            Username = username,
            Content = request.Content,
            IsPublished = true,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
        };

        await using var tx = await _context.Database.BeginTransactionAsync();
        try
        {
            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            if (request.BlogType == "product" && request.ProductDetails != null)
            {
                _context.ProductBlogs.Add(new ProductBlog
                {
                    BlogId = blog.Id,
                    ProductName = request.ProductDetails.ProductName,
                    ProductType = request.ProductDetails.ProductType,
                    Description = request.ProductDetails.Description ?? string.Empty,
                    Size = request.ProductDetails.Size ?? string.Empty,
                    Volumn = request.ProductDetails.Volumn ?? string.Empty,
                    Feature = request.ProductDetails.Feature ?? string.Empty,
                    Keyword = request.ProductDetails.Keyword ?? string.Empty,
                });
            }
            else if (request.BlogType == "topic" && request.TopicDetails != null)
            {
                _context.TopicBlogs.Add(new TopicBlog
                {
                    BlogId = blog.Id,
                    Topic = request.TopicDetails.Topic,
                    Content = request.TopicDetails.Content,
                });
            }

            await _context.SaveChangesAsync();
            await tx.CommitAsync();
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }

        return Ok(new { blog.Id });
    }

    [HttpGet("recent")]
    [Authorize]
    public async Task<IActionResult> Recent()
    {
        var username = User.FindFirstValue(ClaimTypes.Name);
        var recentBlogs = await _context.Blogs
            .Where(b => b.Username == username)
            .OrderByDescending(b => b.UpdatedDate)
            .Take(5)
            .Select(b => new { b.Id, b.Title })
            .ToListAsync();
        return Ok(recentBlogs);
    }
}

public class BlogRequest
{
    public string BlogType { get; set; } = string.Empty;
    public ProductDetails? ProductDetails { get; set; }
        = null;
    public TopicDetails? TopicDetails { get; set; }
        = null;
    public string? Content { get; set; }
        = null;
}

public class ProductDetails
{
    public string ProductName { get; set; } = string.Empty;
    public string ProductType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Volumn { get; set; } = string.Empty;
    public string Feature { get; set; } = string.Empty;
    public string Keyword { get; set; } = string.Empty;
}

public class TopicDetails
{
    public string Topic { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}