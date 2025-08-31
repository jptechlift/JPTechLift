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

    public Task<User?> GetByVerificationTokenAsync(string token) =>
        _context.Users.SingleOrDefaultAsync(u => u.EmailVerificationToken == token);
        
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
    
    /// <summary>
    /// Retrieves a user by id.
    /// </summary>
    public Task<User?> GetByIdAsync(int id) =>
        _context.Users.SingleOrDefaultAsync(u => u.Id == id);

    /// <summary>
    /// Returns all users.
    /// </summary>
    public Task<List<User>> GetAllAsync() =>
        _context.Users.ToListAsync();

    /// <summary>
    /// Deletes a user by id.
    /// </summary>
    public async Task DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Updates a user's role and active status.
    /// </summary>
    public async Task UpdateRoleAndStatusAsync(int id, string role, bool isActive)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            user.Role = role;
            user.IsActive = isActive;
            await _context.SaveChangesAsync();
        }
    }
}