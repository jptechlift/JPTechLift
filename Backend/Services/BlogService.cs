using Backend.Dtos.Blog;
using Backend.Helpers;
using Backend.Models;
using Backend.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore; // Cần thiết cho các thao tác với DbContext
using Microsoft.Extensions.Logging; // THÊM: Cần cho logging nếu bạn muốn

namespace Backend.Services;

/// <summary>
/// Encapsulates blog-related business logic.
/// </summary>
public class BlogService
{
    private readonly BlogRepository _blogRepository;
    private readonly UserRepository _userRepository;
    private readonly AiBlogService _aiBlogService;
    // THÊM: Inject ApplicationDbContext nếu bạn cần nó để xóa các thực thể con
    private readonly ApplicationDbContext _context;
    // THÊM: Inject ILogger nếu bạn cần logging trong service này
    private readonly ILogger<BlogService> _logger;


    public BlogService(
        BlogRepository blogRepository,
        UserRepository userRepository,
        AiBlogService aiBlogService,
        ApplicationDbContext context, // THÊM: ApplicationDbContext vào constructor
        ILogger<BlogService> logger) // THÊM: ILogger vào constructor
    {
        _blogRepository = blogRepository;
        _userRepository = userRepository;
        _aiBlogService = aiBlogService;
        _context = context; // Khởi tạo _context
        _logger = logger; // Khởi tạo _logger
    }

    /// <summary>
    /// Generates AI-assisted preview content and slug.
    /// </summary>
    public async Task<(string title, string slug, string content, string metaDescription)> GeneratePreviewAsync(BlogRequest request)
    {
        var (title, content, metaDescription) = await _aiBlogService.GenerateContentAsync(request);
        var slug = SlugHelper.GenerateSlug(title);
        return (title, slug, content, metaDescription);
    }

    /// <summary>
    /// Creates a new blog owned by the specified user using AI-generated content.
    /// </summary>
    public async Task<Blog> PublishAsync(BlogRequest request, string username)
    {
        var user = await _userRepository.GetByUsernameAsync(username)
            ?? throw new InvalidOperationException($"User '{username}' not found");

        var title = request.Title ?? throw new InvalidOperationException("Title is required");
        // Cắt ngắn Title nếu nó quá dài so với giới hạn database
        if (title.Length > 200) // Giả định MaxLength của Title là 200
        {
            _logger.LogWarning("Title was truncated during publishing: {OriginalTitle}", title);
            title = title.Substring(0, 200);
        }


        // Sử dụng Slug từ request nếu có, nếu không thì tạo từ title
        var baseSlug = !string.IsNullOrWhiteSpace(request.Slug)
            ? request.Slug!
            : SlugHelper.GenerateSlug(title);

        string uniqueSlug = baseSlug;
        int counter = 1;

        // --- Đảm bảo Slug là duy nhất trước khi thêm vào database ---
        // Cắt ngắn uniqueSlug nếu nó quá dài so với giới hạn database
        if (uniqueSlug.Length > 200) // Giả định MaxLength của Slug là 200
        {
            _logger.LogWarning("Base slug was truncated before uniqueness check: {OriginalSlug}", uniqueSlug);
            uniqueSlug = uniqueSlug.Substring(0, 200);
            baseSlug = uniqueSlug; // Cập nhật baseSlug để thêm hậu tố
        }

        // Kiểm tra xem slug đã tồn tại chưa. Nếu có, thêm hậu tố số.
        while (await _blogRepository.IsSlugUniqueAsync(uniqueSlug) == false)
        {
            uniqueSlug = $"{baseSlug}-{counter}";
            // Cắt ngắn lại nếu hậu tố làm cho slug quá dài
            if (uniqueSlug.Length > 200) {
                 uniqueSlug = uniqueSlug.Substring(0, 200); // Cắt để đảm bảo không vượt quá MaxLength
            }
            counter++;
        }
        // -------------------------------------------------------------

        var content = request.Content ?? string.Empty;
        var metaDescription = request.MetaDescription ?? string.Empty;

        // Cắt ngắn MetaDescription nếu nó quá dài
        if (metaDescription.Length > 500) // Giả định MaxLength của MetaDescription là 500
        {
            _logger.LogWarning("Meta description was truncated during publishing.");
            metaDescription = metaDescription.Substring(0, 500);
        }

        var blog = new Blog
        {
            Title = title,
            Slug = uniqueSlug, // <-- Gán uniqueSlug đã được điều chỉnh
            Content = content,
            Author = request.Author ?? username,
            Username = user.Username,
            MetaDescription = metaDescription,
            IsPublished = true, // Mặc định là true khi publish
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            ViewCount = 0 // Mới tạo nên view count là 0
        };

        // --- Xử lý ProductBlog và TopicBlog ---
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
                // BlogId sẽ được EF Core tự động thiết lập khi lưu Blog
            };
        }
        else if (request.BlogType == "topic" && request.TopicDetails != null)
        {
            blog.TopicBlog = new TopicBlog
            {
                Topic = request.TopicDetails.ArticleTitle ?? string.Empty, // Ánh xạ ArticleTitle từ frontend vào Topic
                TargetAudience = request.TopicDetails.TargetAudience,
                MainPoints = request.TopicDetails.MainPoints,
                SeoKeywords = request.TopicDetails.SeoKeywords
                // BlogId sẽ được EF Core tự động thiết lập khi lưu Blog
            };
        }
        // ------------------------------------

        await _blogRepository.AddAsync(blog);
        return blog;
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
    /// Retrieves a published blog by its slug and increments view count.
    /// </summary>
    public async Task<BlogDto?> GetBySlugAsync(string slug)
    {
        var blog = await _blogRepository.GetBySlugAsync(slug);
        if (blog != null)
        {
            // Tăng lượt xem đã được xử lý trong repository
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

        // --- Kiểm tra quyền của người dùng hiện tại (nếu cần) ---
        // var currentUser = await _userRepository.GetByUsernameAsync(username);
        // if (blog.Username != username && !(currentUser?.Roles.Contains(Roles.Admin) ?? false))
        // {
        //     _logger.LogWarning("User {Username} attempted to update blog {BlogId} without authorization.", username, id);
        //     throw new UnauthorizedAccessException("You are not authorized to update this blog.");
        // }
        // --------------------------------------------------------

        // --- Cập nhật các thuộc tính cơ bản của Blog ---
        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            blog.Title = request.Title;
            // Nếu tiêu đề được cập nhật và slug không được cung cấp rõ ràng, tạo lại slug
            if (string.IsNullOrWhiteSpace(request.Slug))
            {
                blog.Slug = SlugHelper.GenerateSlug(request.Title);
            }
            // Cắt ngắn Title nếu quá dài
            if (blog.Title.Length > 200) { // Giả định MaxLength của Title
                _logger.LogWarning("Title was truncated during update for blog {BlogId}: {OriginalTitle}", id, blog.Title);
                blog.Title = blog.Title.Substring(0, 200);
            }
        }

        if (!string.IsNullOrWhiteSpace(request.Slug))
        {
            // Kiểm tra tính duy nhất của slug mới khi cập nhật
            string newSlug = request.Slug;
            int counter = 1;

            // Cắt ngắn newSlug nếu nó quá dài so với giới hạn database
            if (newSlug.Length > 200) { // Giả định MaxLength của Slug
                 _logger.LogWarning("New slug was truncated before uniqueness check for blog {BlogId}: {OriginalSlug}", id, newSlug);
                newSlug = newSlug.Substring(0, 200);
            }
            string baseNewSlug = newSlug; // Để thêm hậu tố nếu cần

            // Bỏ qua blog hiện tại khi kiểm tra trùng lặp slug
            while (await _blogRepository.IsSlugUniqueAsync(newSlug, id) == false)
            {
                newSlug = $"{baseNewSlug}-{counter}";
                // Cắt ngắn lại nếu hậu tố làm cho slug quá dài
                if (newSlug.Length > 200) { // Giả định MaxLength của Slug
                    newSlug = newSlug.Substring(0, 200);
                }
                counter++;
            }
            blog.Slug = newSlug; // Gán slug duy nhất đã được điều chỉnh
        }
        else if (string.IsNullOrWhiteSpace(request.Slug) && !string.IsNullOrWhiteSpace(request.Title))
        {
            // Nếu request.Slug rỗng nhưng request.Title có, tạo slug mới từ title
            // và đảm bảo nó cũng là duy nhất
            string generatedSlug = SlugHelper.GenerateSlug(request.Title);
             if (generatedSlug.Length > 200) { // Giả định MaxLength của Slug
                 _logger.LogWarning("Generated slug was truncated during update for blog {BlogId}: {OriginalSlug}", id, generatedSlug);
                generatedSlug = generatedSlug.Substring(0, 200);
            }
            string baseGeneratedSlug = generatedSlug;
            int counter = 1;
            while (await _blogRepository.IsSlugUniqueAsync(generatedSlug, id) == false)
            {
                generatedSlug = $"{baseGeneratedSlug}-{counter}";
                 if (generatedSlug.Length > 200) { // Giả định MaxLength của Slug
                    generatedSlug = generatedSlug.Substring(0, 200);
                }
                counter++;
            }
            blog.Slug = generatedSlug;
        }


        if (!string.IsNullOrWhiteSpace(request.Content))
        {
            blog.Content = request.Content;
        }
        if (!string.IsNullOrWhiteSpace(request.MetaDescription))
        {
            blog.MetaDescription = request.MetaDescription;
             // Cắt ngắn MetaDescription nếu quá dài
            if (blog.MetaDescription.Length > 500) { // Giả định MaxLength của MetaDescription
                _logger.LogWarning("Meta description was truncated during update for blog {BlogId}.", id);
                blog.MetaDescription = blog.MetaDescription.Substring(0, 500);
            }
        }
        // Bạn có thể thêm cập nhật IsPublished nếu muốn chỉnh sửa trạng thái xuất bản
        // if (request.IsPublished.HasValue) blog.IsPublished = request.IsPublished.Value;


        blog.UpdatedDate = DateTime.UtcNow;

        // --- Xử lý cập nhật ProductBlog và TopicBlog dựa trên BlogType trong yêu cầu ---
        if (request.BlogType == "product" && request.ProductDetails != null)
        {
            // Nếu trước đây là TopicBlog, loại bỏ nó và tạo ProductBlog
            if (blog.TopicBlog != null)
            {
                await _blogRepository.RemoveTopicBlogAsync(blog.TopicBlog);
                blog.TopicBlog = null; // Ngắt mối quan hệ
            }

            // Nếu chưa có ProductBlog, tạo mới
            if (blog.ProductBlog == null)
            {
                blog.ProductBlog = new ProductBlog();
            }
            // Cập nhật các thuộc tính của ProductBlog
            blog.ProductBlog.ProductName = request.ProductDetails.ProductName;
            blog.ProductBlog.ProductType = request.ProductDetails.ProductType;
            blog.ProductBlog.Detail = request.ProductDetails.Detail;
            blog.ProductBlog.TargetAudience = request.ProductDetails.TargetAudience;
            blog.ProductBlog.KeySellingPoints = request.ProductDetails.KeySellingPoints;
            blog.ProductBlog.SeoKeywords = request.ProductDetails.SeoKeywords;
        }
        else if (request.BlogType == "topic" && request.TopicDetails != null)
        {
            // Nếu trước đây là ProductBlog, loại bỏ nó và tạo TopicBlog
            if (blog.ProductBlog != null)
            {
                await _blogRepository.RemoveProductBlogAsync(blog.ProductBlog);
                blog.ProductBlog = null; // Ngắt mối quan hệ
            }

            // Nếu chưa có TopicBlog, tạo mới
            if (blog.TopicBlog == null)
            {
                blog.TopicBlog = new TopicBlog();
            }
            // Cập nhật các thuộc tính của TopicBlog
            blog.TopicBlog.Topic = request.TopicDetails.ArticleTitle ?? string.Empty;
            blog.TopicBlog.TargetAudience = request.TopicDetails.TargetAudience;
            blog.TopicBlog.MainPoints = request.TopicDetails.MainPoints;
            blog.TopicBlog.SeoKeywords = request.TopicDetails.SeoKeywords;
        }
        else if (request.BlogType == "manual")
        {
            // Nếu thay đổi sang loại "manual" và không có chi tiết cụ thể (tức là không phải product/topic),
            // có thể xóa các chi tiết ProductBlog/TopicBlog hiện có
            if (blog.ProductBlog != null)
            {
                await _blogRepository.RemoveProductBlogAsync(blog.ProductBlog);
                blog.ProductBlog = null;
            }
            if (blog.TopicBlog != null)
            {
                await _blogRepository.RemoveTopicBlogAsync(blog.TopicBlog);
                blog.TopicBlog = null;
            }
        }
        // -------------------------------------------------------------

        await _blogRepository.UpdateAsync(blog);
        return blog;
    }

    /// <summary>
    /// Deletes a blog post.
    /// </summary>
    public async Task DeleteAsync(int id)
    {
        await _blogRepository.DeleteAsync(id);
    }
}