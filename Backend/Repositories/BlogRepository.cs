using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic; // Đảm bảo import này nếu cần cho List<Blog>
using System.Linq; // Cần thiết cho các phương thức LINQ như AnyAsync

namespace Backend.Repositories;

/// <summary>
/// Provides CRUD operations for <see cref="Blog"/> entities.
/// </summary>
public class BlogRepository
{
    private readonly ApplicationDbContext _context;

    public BlogRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Finds a blog by identifier including related entities.
    /// </summary>
    public Task<Blog?> GetByIdAsync(int id) =>
        _context.Blogs
            .Include(b => b.ProductBlog)
            .Include(b => b.TopicBlog)
            .SingleOrDefaultAsync(b => b.Id == id);

    /// <summary>
    /// Adds a new blog entry.
    /// </summary>
    public async Task AddAsync(Blog blog)
    {
        _context.Blogs.Add(blog);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Deletes a blog entry.
    /// </summary>
    public async Task DeleteAsync(int id)
    {
        var blog = await _context.Blogs.FindAsync(id);
        if (blog != null)
        {
            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Persists modifications to an existing blog.
    /// </summary>
    public async Task UpdateAsync(Blog blog)
    {
        // Khi cập nhật một blog, các đối tượng con (ProductBlog/TopicBlog)
        // có thể cần được xử lý riêng nếu chúng được thêm/xóa/thay đổi
        // Entity Framework Core thường sẽ tự động theo dõi các thay đổi nếu blog
        // được lấy từ context và các thuộc tính của nó được sửa đổi.
        // Tuy nhiên, nếu bạn gán một đối tượng con hoàn toàn mới,
        // hãy đảm bảo EF Core biết mối quan hệ.
        _context.Blogs.Update(blog);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Retrieves all published blogs ordered by descending
    /// <see cref="Blog.CreatedDate"/>.
    /// </summary>
    public Task<List<Blog>> GetAllAsync() =>
        _context.Blogs
            .Include(b => b.ProductBlog)
            .Include(b => b.TopicBlog)
            .Where(b => b.IsPublished)
            .OrderByDescending(b => b.CreatedDate)
            .ToListAsync();

    /// <summary>
    /// Retrieves the most recently created blogs ordered by descending
    /// <see cref="Blog.CreatedDate"/>.
    /// </summary>
    /// <param name="count">Maximum number of blogs to return.</param>
    public Task<List<Blog>> GetRecentAsync(int count) =>
        _context.Blogs
            .Include(b => b.ProductBlog)
            .Include(b => b.TopicBlog)
            .Where(b => b.IsPublished) // Chỉ hiển thị các bài đã xuất bản
            .OrderByDescending(b => b.CreatedDate)
            .Take(count)
            .ToListAsync();

    /// <summary>
    /// Retrieves a blog by its slug, incrementing the view count when found.
    /// </summary>
    public async Task<Blog?> GetBySlugAsync(string slug)
    {
        var blog = await _context.Blogs
            .Include(b => b.ProductBlog)
            .Include(b => b.TopicBlog)
            .SingleOrDefaultAsync(b => b.Slug == slug && b.IsPublished);

        if (blog != null)
        {
            blog.ViewCount++;
            await _context.SaveChangesAsync(); // Lưu thay đổi view count
        }

        return blog;
    }

    /// <summary>
    /// Checks if a slug already exists in the database.
    /// Optionally excludes a blog by its ID (useful for updates).
    /// </summary>
    /// <param name="slug">The slug to check.</param>
    /// <param name="excludeBlogId">Optional ID of a blog to exclude from the check (e.g., when updating an existing blog).</param>
    /// <returns>True if the slug is unique, false otherwise.</returns>
    public async Task<bool> IsSlugUniqueAsync(string slug, int? excludeBlogId = null)
    {
        if (excludeBlogId.HasValue)
        {
            return !await _context.Blogs.AnyAsync(b => b.Slug == slug && b.Id != excludeBlogId.Value);
        }
        return !await _context.Blogs.AnyAsync(b => b.Slug == slug);
    }

    /// <summary>
    /// Removes a specific ProductBlog entry from the database.
    /// </summary>
    /// <param name="productBlog">The ProductBlog entity to remove.</param>
    public async Task RemoveProductBlogAsync(ProductBlog productBlog)
    {
        _context.ProductBlogs.Remove(productBlog);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Removes a specific TopicBlog entry from the database.
    /// </summary>
    /// <param name="topicBlog">The TopicBlog entity to remove.</param>
    public async Task RemoveTopicBlogAsync(TopicBlog topicBlog)
    {
        _context.TopicBlogs.Remove(topicBlog);
        await _context.SaveChangesAsync();
    }
}