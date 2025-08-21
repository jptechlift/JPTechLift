using Backend.Controllers;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Linq;
using Xunit;

namespace backend.Tests;

public class BlogControllerTests
{
    private BlogController CreateController(out ApplicationDbContext ctx)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        ctx = new ApplicationDbContext(options);
        var config = new ConfigurationBuilder().AddInMemoryCollection(
        new Dictionary<string, string> { { "GEMINI_API_KEY", "test" } }).Build();
        var ai = new AiBlogService(new HttpClient(), config, NullLogger<AiBlogService>.Instance);
        var controller = new BlogController(ctx, ai, NullLogger<BlogController>.Instance);
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, "user1") }, "test"));
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };
        return controller;
    }

    [Fact]
    public async Task GeneratePreview_ReturnsContent()
    {
        var controller = CreateController(out _);
        var result = await controller.GeneratePreview(new BlogRequest
        {
            BlogType = "topic",
              TopicDetails = new TopicDetails { ArticleTitle = "Hello" }
        }) as OkObjectResult;
        Assert.NotNull(result);
    }

    [Fact]
    public async Task Publish_SavesBlog()
    {
        var controller = CreateController(out var ctx);
        var request = new BlogRequest
        {
            BlogType = "topic",
            TopicDetails = new TopicDetails { ArticleTitle = "T" },
             Content = "C"
        };
        var result = await controller.Publish(request) as OkObjectResult;
        Assert.Equal(1, ctx.Blogs.Count());
    }

    [Fact]
    public async Task Recent_ReturnsBlogs()
    {
        var controller = CreateController(out var ctx);
        ctx.Blogs.Add(new Blog { Title = "A", Username = "user1", UpdatedDate = DateTime.UtcNow });
        ctx.SaveChanges();
        var result = await controller.Recent() as OkObjectResult;
        Assert.NotNull(result);
    }
}