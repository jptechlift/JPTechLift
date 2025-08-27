
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
    /// Persists modifications to an existing blog.
    /// </summary>
    public async Task UpdateAsync(Blog blog)
    {
        _context.Blogs.Update(blog);
        await _context.SaveChangesAsync();
    }
}
