using System.Security.Claims;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using Backend.Dtos;
using System.Linq;
using System.Text.RegularExpressions;
using System.Globalization;
using System.Text;

namespace Backend.Controllers;

[ApiController]
[Route("api/blog")]
public class BlogController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly AiBlogService _ai;
    private readonly ILogger<BlogController> _logger;

    public BlogController(ApplicationDbContext context, AiBlogService ai, ILogger<BlogController> logger)
    {
        _context = context;
        _ai = ai;
        _logger = logger;
    }

    [HttpPost("generate-preview")]
    [Authorize]
    public async Task<IActionResult> GeneratePreview([FromBody] BlogRequest request)
    {
        try
        {
            var baseTitle = request.BlogType == "product"
                ? request.ProductDetails?.ProductName
                : request.TopicDetails?.ArticleTitle;

            if (string.IsNullOrWhiteSpace(baseTitle))
            {
                _logger.LogWarning("Validation failed: Title is missing from the request.");
                return BadRequest(new { message = "Title or ArticleTitle is required." });
            }

            var (title, content) = await _ai.GenerateContentAsync(request);
            var slug = ToFriendlyUrl(title);

            _logger.LogInformation("Generated preview for {Title}", baseTitle);
            return Ok(new { title, slug, generatedContent = content, previewUrl = $"/blogs/{slug}" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred in GeneratePreview endpoint.");
            return StatusCode(500, new { message = "An internal server error occurred." });
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Publish([FromBody] BlogRequest request)
    {
          if (request.BlogType != "product" && request.BlogType != "topic")
        {
            _logger.LogWarning("Invalid blog type: {BlogType}", request.BlogType);
            return BadRequest(new { message = "BlogType must be 'product' or 'topic'." });
        }

        var username = User.FindFirstValue(ClaimTypes.Name) ?? string.Empty;

        var user = await _context.Users
            .SingleOrDefaultAsync(u => u.Username == username);
        if (user == null)
        {
            _logger.LogWarning("Publish attempted with unknown user {Username}", username);
            return NotFound(new { message = "User not found." });
        }

        var title = request.BlogType == "product"
            ? request.ProductDetails!.ProductName
            : request.TopicDetails?.ArticleTitle ?? request.TopicDetails?.Topic ?? string.Empty;

        var baseSlug = string.IsNullOrWhiteSpace(request.Slug)
            ? ToFriendlyUrl(title)
            : request.Slug!;
        var slug = baseSlug;
        var suffix = 1;
        while (await _context.Blogs.AnyAsync(b => b.Slug == slug))
        {
            slug = $"{baseSlug}-{suffix++}";
        }

        var author = string.IsNullOrWhiteSpace(request.Author) ? username : request.Author;

        var blog = new Blog
        {
            Title = title,
            Slug = slug,
            Username = username,
            User = user,
            Author = author,
            Content = request.Content ?? string.Empty,
            IsPublished = true,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
        };

        await using var tx = _context.Database.ProviderName?.Contains("InMemory") == true
            ? null
            : await _context.Database.BeginTransactionAsync();
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
                    Detail = request.ProductDetails.Detail,
                    TargetAudience = request.ProductDetails.TargetAudience ?? string.Empty,
                    KeySellingPoints = request.ProductDetails.KeySellingPoints ?? string.Empty,
                    SeoKeywords = request.ProductDetails.SeoKeywords ?? string.Empty,
                });
            }
            else if (request.BlogType == "topic" && request.TopicDetails != null)
            {
                _context.TopicBlogs.Add(new TopicBlog
                {
                    BlogId = blog.Id,
                    Topic = title,
                    Content = request.Content ?? string.Empty,
                    TargetAudience = request.TopicDetails.TargetAudience ?? string.Empty,
                    MainPoints = request.TopicDetails.MainPoints ?? string.Empty,
                    SeoKeywords = request.TopicDetails.SeoKeywords ?? string.Empty,
                });
            }

            await _context.SaveChangesAsync();
            if (tx != null)
            {
                await tx.CommitAsync();
            }
        }
        catch
        {
            if (tx != null)
            {
                await tx.RollbackAsync();
            }
            throw;
        }

        return Ok(blog.ToDto());
    }

[HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var blog = await _context.Blogs
            .Include(b => b.User)
            .Include(b => b.ProductBlog)
            .Include(b => b.TopicBlog)
            .SingleOrDefaultAsync(b => b.Slug == slug && b.IsPublished);
        if (blog == null)
        {
            return NotFound();
        }
blog.ViewCount++;
        await _context.SaveChangesAsync();
        return Ok(blog.ToDto());
    }

    [HttpGet("/api/blogs")]
    public async Task<IActionResult> ListPublished()
    {
        var blogs = await _context.Blogs
            .Where(b => b.IsPublished)
            .OrderByDescending(b => b.CreatedDate)
            .Include(b => b.User)
            .Include(b => b.ProductBlog)
            .Include(b => b.TopicBlog)
            .ToListAsync();
        return Ok(blogs.Select(b => b.ToDto()));

    }

    [HttpGet("recent")]
    [Authorize]
    public async Task<IActionResult> Recent()
    {
        var username = User.FindFirstValue(ClaimTypes.Name);
        var recentBlogs = await _context.Blogs
            .Where(b => b.Username == username)
            .OrderByDescending(b => b.UpdatedDate)
            .Include(b => b.ProductBlog)
            .Include(b => b.TopicBlog)
            .Take(5)
            .ToListAsync();
        return Ok(recentBlogs.Select(b => b.ToDto()));
    }
    
[HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] BlogRequest request)
    {
          if (request.BlogType != "product" && request.BlogType != "topic")
        {
            _logger.LogWarning("Invalid blog type: {BlogType}", request.BlogType);
            return BadRequest(new { message = "BlogType must be 'product' or 'topic'." });
        }

        var username = User.FindFirstValue(ClaimTypes.Name) ?? string.Empty;
        var blog = await _context.Blogs
            .Include(b => b.ProductBlog)
            .Include(b => b.TopicBlog)
            .SingleOrDefaultAsync(b => b.Id == id && b.Username == username);
        if (blog == null)
        {
            return NotFound(new { message = "Blog not found." });
        }

        var title = request.BlogType == "product"
            ? request.ProductDetails!.ProductName
            : request.TopicDetails?.ArticleTitle ?? request.TopicDetails?.Topic ?? blog.Title;
        blog.Title = title;
        blog.Slug = string.IsNullOrWhiteSpace(request.Slug) ? ToFriendlyUrl(title) : request.Slug!;
        blog.UpdatedDate = DateTime.UtcNow;
        var author = string.IsNullOrWhiteSpace(request.Author) ? (string.IsNullOrWhiteSpace(blog.Author) ? username : blog.Author) : request.Author;
        blog.Author = author;
        blog.Content = request.Content ?? blog.Content;
        if (request.BlogType == "product" && request.ProductDetails != null)
        {
            if (blog.ProductBlog == null)
            {
                blog.ProductBlog = new ProductBlog { BlogId = blog.Id };
            }

            blog.ProductBlog.ProductName = request.ProductDetails.ProductName;
            blog.ProductBlog.ProductType = request.ProductDetails.ProductType;
            blog.ProductBlog.Detail = request.ProductDetails.Detail;
            blog.ProductBlog.TargetAudience = request.ProductDetails.TargetAudience ?? string.Empty;
            blog.ProductBlog.KeySellingPoints = request.ProductDetails.KeySellingPoints ?? string.Empty;
            blog.ProductBlog.SeoKeywords = request.ProductDetails.SeoKeywords ?? string.Empty;

            if (blog.TopicBlog != null)
            {
                _context.TopicBlogs.Remove(blog.TopicBlog);
            }
        }
        else if (request.BlogType == "topic" && request.TopicDetails != null)
        {
            if (blog.TopicBlog == null)
            {
                blog.TopicBlog = new TopicBlog { BlogId = blog.Id };
            }
            blog.TopicBlog.Topic = title;
            blog.TopicBlog.Content = request.Content ?? string.Empty;
            blog.TopicBlog.TargetAudience = request.TopicDetails.TargetAudience ?? string.Empty;
            blog.TopicBlog.MainPoints = request.TopicDetails.MainPoints ?? string.Empty;
            blog.TopicBlog.SeoKeywords = request.TopicDetails.SeoKeywords ?? string.Empty;

            if (blog.ProductBlog != null)
            {
                _context.ProductBlogs.Remove(blog.ProductBlog);
            }
        }


        await _context.SaveChangesAsync();
        return Ok(blog.ToDto());
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var username = User.FindFirstValue(ClaimTypes.Name) ?? string.Empty;
        var blog = await _context.Blogs
            .Include(b => b.ProductBlog)
            .Include(b => b.TopicBlog)
            .SingleOrDefaultAsync(b => b.Id == id && b.Username == username);
        if (blog == null)
        {
            return NotFound(new { message = "Blog not found." });
        }

        _context.Blogs.Remove(blog);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static string ToFriendlyUrl(string title)
    {
        var normalized = title.ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();
        foreach (var c in normalized)
        {
            var uc = CharUnicodeInfo.GetUnicodeCategory(c);
            if (uc != UnicodeCategory.NonSpacingMark)
            {
                sb.Append(c);
            }
        }
        var result = sb.ToString().Normalize(NormalizationForm.FormC);
          result = Regex.Replace(result, @"[^a-z0-9\s-]", "");
        result = Regex.Replace(result, @"\s+", " ").Trim();
        result = Regex.Replace(result, @"\s", "-");
        return result;
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
    public string? Author { get; set; }
        = null;
    public string? Slug { get; set; }
        = null;
}

public class ProductDetails
{
    public string ProductName { get; set; } = string.Empty;
    public string ProductType { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    public string KeySellingPoints { get; set; } = string.Empty;
    public string SeoKeywords { get; set; } = string.Empty;
    public string ToneOfVoice { get; set; } = string.Empty;
}

public class TopicDetails
{
    [JsonPropertyName("article_title")]
    public string? ArticleTitle { get; set; }
    public string? Topic { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    [JsonPropertyName("main_points")]
    public string MainPoints { get; set; } = string.Empty;
    public string SeoKeywords { get; set; } = string.Empty;
    public string ToneOfVoice { get; set; } = string.Empty;
}