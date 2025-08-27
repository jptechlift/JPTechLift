using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

/// <summary>
/// Data access operations for <see cref="User"/> entities.
/// </summary>
public class UserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves a user by username.
    /// </summary>
    public Task<User?> GetByUsernameAsync(string username) =>
        _context.Users.SingleOrDefaultAsync(u => u.Username == username);

    /// <summary>
    /// Retrieves a user by email.
    /// </summary>
    public Task<User?> GetByEmailAsync(string email) =>
        _context.Users.SingleOrDefaultAsync(u => u.Email == email);

    /// <summary>
    /// Persists a new user to the database.
    /// </summary>
    public async Task AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Updates an existing user entity.
    /// </summary>
    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
}