using System.Security.Claims;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;

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
             // --- VERIFICATION LOGGING ---
        _logger.LogInformation("[1/3] Backend: Endpoint 'generate-preview' received a request.");

        try
        {
            // --- VERIFICATION LOGGING ---
            var payloadJson = System.Text.Json.JsonSerializer.Serialize(request);
            _logger.LogInformation("[2/3] Backend: Deserialized payload: {Payload}", payloadJson);

          var baseTitle = request.BlogType == "product"
                ? request.ProductDetails?.ProductName
                : request.TopicDetails?.ArticleTitle;

            if (string.IsNullOrWhiteSpace(baseTitle))
            {
                _logger.LogWarning("Validation failed: Title is missing from the request.");
                return BadRequest(new { message = "Title or ArticleTitle is required." });
            }

            // --- VERIFICATION LOGGING ---
              _logger.LogInformation("[3/3] Backend: Calling AI service with extracted title: '{Title}'", baseTitle);

              var (title, content) = await _ai.GenerateContentAsync(request);
            var slug = Regex.Replace(title.ToLowerInvariant(), "[^a-z0-9]+", "-").Trim('-');

            _logger.LogInformation("Successfully generated content. Returning OK response.");
            return Ok(new { title, slug, generatedContent = content });
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
        var username = User.FindFirstValue(ClaimTypes.Name) ?? string.Empty;
        var title = request.BlogType == "product"
            ? request.ProductDetails!.ProductName
            : request.TopicDetails?.ArticleTitle ?? request.TopicDetails?.Topic ?? string.Empty;

        var blog = new Blog
        {
            Title = title,
            Username = username,
            Content = request.Content,
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
                     Topic = title,
                    Content = request.Content ?? string.Empty,
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
    public string TargetAudience { get; set; } = string.Empty;
    public string KeySellingPoints { get; set; } = string.Empty;
    public string SeoKeywords { get; set; } = string.Empty;
    public string ToneOfVoice { get; set; } = string.Empty;
}

public class TopicDetails
{
    [JsonPropertyName("articleTitle")]
    public string? ArticleTitle { get; set; }
    public string? Topic { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    public string MainPoints { get; set; } = string.Empty;
    public string SeoKeywords { get; set; } = string.Empty;
    public string ToneOfVoice { get; set; } = string.Empty;
}