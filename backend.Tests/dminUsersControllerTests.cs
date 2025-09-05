using System;
using System.Linq;
using System.Security.Claims;
using Backend.Controllers;
using Backend.Dtos.Auth;
using Backend.Models;
using Backend.Repositories;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace backend.Tests;

public class AdminUsersControllerTests
{
    private (
        AdminUsersController controller,
        ApplicationDbContext context,
        IAntiforgery antiforgery,
        ServiceProvider provider
    ) CreateController()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddAntiforgery();
        var provider = services.BuildServiceProvider();
        var antiforgery = provider.GetRequiredService<IAntiforgery>();

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var context = new ApplicationDbContext(options);
        var repo = new UserRepository(context);

        var controller = new AdminUsersController(repo)
        {
            ControllerContext =
            {
                HttpContext = new DefaultHttpContext { RequestServices = provider },
            },
        };

        return (controller, context, antiforgery, provider);
    }

    [Fact]
    public async Task UpdateUser_Succeeds_WithAdminRole_AndCsrf()
    {
        var (controller, context, antiforgery, provider) = CreateController();

        var admin = new User
        {
            Username = "admin",
            Email = "admin@example.com",
            PasswordHash = "hash",
            Role = "admin",
            IsActive = true,
            EmailVerified = true,
        };
        var user = new User
        {
            Username = "user",
            Email = "user@example.com",
            PasswordHash = "hash",
            Role = "user",
            IsActive = true,
            EmailVerified = true,
        };
        context.Users.AddRange(admin, user);
        context.SaveChanges();

        controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),
                    new Claim(ClaimTypes.Role, "admin"),
                },
                "test"
            )
        );

        var httpContext = controller.ControllerContext.HttpContext;
        var tokens = antiforgery.GetAndStoreTokens(httpContext);
        httpContext.Request.Headers["X-CSRF-TOKEN"] = tokens.RequestToken!;

        var result = await controller.UpdateUser(
            user.Id,
            new AdminUserUpdateRequest { Username = "updated" }
        );
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("updated", context.Users.Single(u => u.Id == user.Id).Username);
    }

    [Fact]
    public async Task DeleteUser_Succeeds_WithAdminRole_AndCsrf()
    {
        var (controller, context, antiforgery, provider) = CreateController();

        var admin = new User
        {
            Username = "admin",
            Email = "admin@example.com",
            PasswordHash = "hash",
            Role = "admin",
            IsActive = true,
            EmailVerified = true,
        };
        var user = new User
        {
            Username = "user",
            Email = "user@example.com",
            PasswordHash = "hash",
            Role = "user",
            IsActive = true,
            EmailVerified = true,
        };
        context.Users.AddRange(admin, user);
        context.SaveChanges();

        controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),
                    new Claim(ClaimTypes.Role, "admin"),
                },
                "test"
            )
        );

        var httpContext = controller.ControllerContext.HttpContext;
        var tokens = antiforgery.GetAndStoreTokens(httpContext);
        httpContext.Request.Headers["X-CSRF-TOKEN"] = tokens.RequestToken!;

        var result = await controller.DeleteUser(user.Id);
        Assert.IsType<OkObjectResult>(result);
        Assert.Null(context.Users.Find(user.Id));
    }
}