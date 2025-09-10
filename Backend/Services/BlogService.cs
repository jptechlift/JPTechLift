using Backend.Dtos.Blog;
using Backend.Helpers;
using Backend.Models;
using Backend.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

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
    public async Task<(string title, string slug, string content, string metaDescription)> GeneratePreviewAsync(BlogRequest request)
{
    var (title, content, metaDescription) = await _aiBlogService.GenerateContentAsync(request); // Nhận metaDescription
    var slug = SlugHelper.GenerateSlug(title);
    return (title, slug, content, metaDescription); // Trả về metaDescription
}

    /// <summary>
    /// Creates a new blog owned by the specified user using AI-generated content.
    /// </summary>
    public async Task<Blog> PublishAsync(BlogRequest request, string username)
{
    var user = await _userRepository.GetByUsernameAsync(username)
        ?? throw new InvalidOperationException($"User '{username}' not found");

    var (aiTitle, aiContent, aiMetaDescription) = await _aiBlogService.GenerateContentAsync(request); // Nhận metaDescription
    var slug = SlugHelper.GenerateSlug(aiTitle);
    // Cần implement EnsureUniqueSlugAsync trong BlogRepository nếu muốn đảm bảo slug không bao giờ trùng
    // slug = await _blogRepository.EnsureUniqueSlugAsync(slug);

    var blog = new Blog
    {
        Title = aiTitle,
        Slug = slug,
        Content = aiContent,
        Author = username,
        Username = user.Username,
        IsPublished = true,
        CreatedDate = DateTime.UtcNow,
        UpdatedDate = DateTime.UtcNow,
        // Nếu bạn muốn lưu metaDescription vào model Blog, hãy thêm thuộc tính MetaDescription vào lớp Blog
        // và gán giá trị ở đây:
        // MetaDescription = aiMetaDescription
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
            Topic = request.TopicDetails.ArticleTitle ?? string.Empty,
            TargetAudience = request.TopicDetails.TargetAudience,
            MainPoints = request.TopicDetails.MainPoints,
            SeoKeywords = request.TopicDetails.SeoKeywords
        };
    }

    await _blogRepository.AddAsync(blog);
    return blog;
}
    
    // =======================================================
    // HOÀN THIỆN CÁC PHƯƠNG THỨC CÒN THIẾU TẠI ĐÂY
    // =======================================================

    /// <summary>
    /// Retrieves all published blogs.
    /// </summary>
    public async Task<IEnumerable<BlogDto>> GetAllAsync()
    {
        var blogs = await _blogRepository.GetAllAsync();
        // Chuyển đổi từ List<Blog> sang List<BlogDto>
        return blogs.Select(b => b.ToDto());
    }

    /// <summary>
    /// Retrieves a published blog by its slug and increments view count.
    /// </summary>
    public async Task<BlogDto?> GetBySlugAsync(string slug)
    {
        var blog = await _blogRepository.GetBySlugAsync(slug);
        if (blog != null)
        {
            // Tăng lượt xem và cập nhật
            blog.ViewCount++; 
            await _blogRepository.UpdateAsync(blog);
            return blog.ToDto();
        }
        return null;
    }

    /// <summary>
    /// Retrieves the most recent published blogs.
    /// </summary>
    public async Task<IEnumerable<BlogDto>> GetRecentAsync(int count)
    {
        var blogs = await _blogRepository.GetRecentAsync(count);
        return blogs.Select(b => b.ToDto());
    }

    /// <summary>
    /// Updates an existing blog.
    /// </summary>
    public async Task<Blog?> UpdateAsync(int id, BlogRequest request, string username)
{
    var blog = await _blogRepository.GetByIdAsync(id);
    if (blog == null)
    {
        return null; // Không tìm thấy blog để cập nhật
    }

    // Chỉ cho phép chủ sở hữu hoặc admin cập nhật (ví dụ)
    // var user = await _userRepository.GetByUsernameAsync(username);
    // if (blog.Username != username && !(user?.Roles.Contains(Roles.Admin) ?? false)) return null;

    // Cập nhật các trường cần thiết từ request
    if (!string.IsNullOrWhiteSpace(request.Content))
    {
        blog.Content = request.Content;
    }
    // Nếu bạn cho phép cập nhật tiêu đề từ preview, bạn cần thêm logic này
    // if (!string.IsNullOrWhiteSpace(request.Title))
    // {
    //     blog.Title = request.Title;
    //     blog.Slug = SlugHelper.GenerateSlug(request.Title); // Cập nhật slug nếu tiêu đề thay đổi
    // }
    // Nếu bạn có thuộc tính MetaDescription trong model Blog và muốn cập nhật
    // if (!string.IsNullOrWhiteSpace(request.MetaDescription))
    // {
    //     blog.MetaDescription = request.MetaDescription;
    // }

    blog.UpdatedDate = DateTime.UtcNow;

    await _blogRepository.UpdateAsync(blog);
    return blog;
}

    /// <summary>
    /// Deletes a blog post.
    /// </summary>
    public async Task DeleteAsync(int id)
    {
        // Chỉ cần gọi phương thức tương ứng của repository
        await _blogRepository.DeleteAsync(id);
    }
}