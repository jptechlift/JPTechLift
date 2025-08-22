using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace backend.Tests;

public class UserCrudTests
{
    [Fact]
    public async Task User_Crud_Works_With_New_Columns()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        await using var ctx = new ApplicationDbContext(options);

        var user = new User
        {
            Username = "tester",
            PasswordHash = "hash",
            Email = "tester@example.com",
            PhoneNumber = "123",
            AvatarUrl = "http://example.com/avatar.png",
            CoverUrl = "http://example.com/cover.png"
        };

        // Create
        ctx.Users.Add(user);
        await ctx.SaveChangesAsync();

        // Read
        var saved = await ctx.Users.SingleAsync(u => u.Id == user.Id);
        Assert.Equal("http://example.com/avatar.png", saved.AvatarUrl);
        Assert.Equal("http://example.com/cover.png", saved.CoverUrl);

        // Update
        saved.CoverUrl = "http://example.com/new-cover.png";
        await ctx.SaveChangesAsync();
        var updated = await ctx.Users.SingleAsync(u => u.Id == user.Id);
        Assert.Equal("http://example.com/new-cover.png", updated.CoverUrl);

        // Delete
        ctx.Users.Remove(updated);
        await ctx.SaveChangesAsync();
        Assert.Empty(ctx.Users);
    }
}
