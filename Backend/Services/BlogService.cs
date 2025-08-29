using Backend.Dtos.Blog;
using Backend.Helpers;
using Backend.Models;
using Backend.Repositories;
using System.Linq;

namespace Backend.Services;

/// <summary>
/// Encapsulates blog-related business logic.
/// </summary>
public class BlogService
{
    private readonly BlogRepository _blogRepository;
    private readonly UserRepository _userRepository;
    private readonly AiBlogService _aiBlogService;

    public BlogService(BlogRepository blogRepository, UserRepository userRepository, AiBlogService aiBlogService)
    {
        _blogRepository = blogRepository;
        _userRepository = userRepository;
        _aiBlogService = aiBlogService;
    }

    /// <summary>
    /// Generates AI-assisted preview content and slug.
    /// </summary>
    public async Task<(string title, string slug, string content)> GeneratePreviewAsync(BlogRequest request)
    {
        var (title, content) = await _aiBlogService.GenerateContentAsync(request);
        var slug = SlugHelper.GenerateSlug(title);
        return (title, slug, content);
    }

    /// <summary>
    /// Retrieves the most recent published blogs.
    /// </summary>
    /// <param name="count">Maximum number of blogs to fetch.</param>
    public async Task<IEnumerable<BlogDto>> GetRecentAsync(int count)
    {
        var blogs = await _blogRepository.GetRecentAsync(count);
        return blogs.Select(b => b.ToDto());
    }

 /// <summary>
    /// Retrieves all published blogs.
    /// </summary>
    public async Task<IEnumerable<BlogDto>> GetAllAsync()
    {
        var blogs = await _blogRepository.GetAllAsync();
        return blogs.Select(b => b.ToDto());
    }

    /// <summary>
    /// Retrieves a published blog by its slug.
    /// </summary>
    public async Task<BlogDto?> GetBySlugAsync(string slug)
    {
        var blog = await _blogRepository.GetBySlugAsync(slug);
        return blog?.ToDto();
    }
    
    /// <summary>
    /// Creates a new blog owned by the specified user.
    /// </summary>
    public async Task<Blog> PublishAsync(BlogRequest request, string username)
    {
        var user = await _userRepository.GetByUsernameAsync(username)
            ?? throw new InvalidOperationException("User not found");

        var slug = request.Slug ?? SlugHelper.GenerateSlug(request.ProductDetails?.ProductName ?? request.TopicDetails?.ArticleTitle ?? string.Empty);

        var blog = new Blog
        {
            Title = request.ProductDetails?.ProductName ?? request.TopicDetails?.ArticleTitle ?? string.Empty,
            Slug = slug,
            Author = request.Author ?? username,
            Username = user.Username,
            Content = request.Content ?? string.Empty,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            IsPublished = true
        };

        if (request.BlogType == "product" && request.ProductDetails != null)
        {
            blog.ProductBlog = new ProductBlog
            {
                ProductName = request.ProductDetails.ProductName,
                ProductType = request.ProductDetails.ProductType,
                Detail = request.ProductDetails.Detail,
                TargetAudience = request.ProductDetails.TargetAudience,
                KeySellingPoints = request.ProductDetails.KeySellingPoints,
                SeoKeywords = request.ProductDetails.SeoKeywords
            };
        }
        else if (request.BlogType == "topic" && request.TopicDetails != null)
        {
            blog.TopicBlog = new TopicBlog
            {
                Topic = request.TopicDetails.Topic ?? string.Empty,
                Content = request.Content ?? string.Empty,
                TargetAudience = request.TopicDetails.TargetAudience,
                MainPoints = request.TopicDetails.MainPoints,
                SeoKeywords = request.TopicDetails.SeoKeywords
            };
        }

        await _blogRepository.AddAsync(blog);
        return blog;
    }

    /// <summary>
    /// Updates an existing blog if owned by the specified user.
    /// </summary>
    public async Task<Blog?> UpdateAsync(int id, BlogRequest request, string username)
    {
        var blog = await _blogRepository.GetByIdAsync(id);
        if (blog == null || blog.Username != username)
        {
            return null;
        }

        blog.Content = request.Content ?? blog.Content;
        blog.UpdatedDate = DateTime.UtcNow;

        await _blogRepository.UpdateAsync(blog);
        return blog;
    }
}
