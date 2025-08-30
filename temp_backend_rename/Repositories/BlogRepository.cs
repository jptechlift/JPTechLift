
using Backend.Models;
using Microsoft.EntityFrameworkCore;

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
            await _context.SaveChangesAsync();
        }

        return blog;
    }
}
