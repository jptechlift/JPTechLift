using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Dtos.Auth;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace backend.Tests;

public class AuthControllerTests
{
    private (
        AuthController controller,
        ApplicationDbContext context,
        IAntiforgery antiforgery,
        ServiceProvider provider
    ) CreateController()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddAntiforgery();
        services.AddMemoryCache();
        services.AddScoped<EmailService>();
        services.AddSingleton<CaptchaService, FakeCaptchaService>();
        var provider = services.BuildServiceProvider();
        var antiforgery = provider.GetRequiredService<IAntiforgery>();
        var cache = provider.GetRequiredService<IMemoryCache>();
        var email = provider.GetRequiredService<EmailService>();
        var captcha = provider.GetRequiredService<CaptchaService>();

        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(
                new Dictionary<string, string>
                {
                    { "Jwt:Secret", "01234567890123456789012345678901" },
                    { "Recaptcha:SecretKey", "dummy" },
                }
            )
            .Build();

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var context = new ApplicationDbContext(options);
        var repo = new UserRepository(context);

        var controller = new AuthController(repo, config, email, cache, antiforgery, captcha)
        {
            ControllerContext =
            {
                HttpContext = new DefaultHttpContext { RequestServices = provider },
            },
        };

        return (controller, context, antiforgery, provider);
    }

    [Fact]
    public async Task Login_Succeeds_WithValidCredentials()
    {
        var (controller, context, antiforgery, provider) = CreateController();
        context.Users.Add(
            new User
            {
                Username = "john",
                Email = "john@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                IsActive = true,
                EmailVerified = true,
                Role = "user",
            }
        );
        context.SaveChanges();

        var httpContext = controller.ControllerContext.HttpContext;
        var tokens = antiforgery.GetAndStoreTokens(httpContext);
        httpContext.Request.Headers["X-CSRF-TOKEN"] = tokens.RequestToken!;

        var result = await controller.Login(
            new LoginRequest { Email = "john@example.com", Password = "Password123!" }
        );
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task Login_Unverified_ReturnsUnauthorized()
    {
        var (controller, context, antiforgery, provider) = CreateController();
        context.Users.Add(
            new User
            {
                Username = "jane",
                Email = "jane@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                IsActive = true,
                EmailVerified = false,
                Role = "user",
            }
        );
        context.SaveChanges();

        var httpContext = controller.ControllerContext.HttpContext;
        var tokens = antiforgery.GetAndStoreTokens(httpContext);
        httpContext.Request.Headers["X-CSRF-TOKEN"] = tokens.RequestToken!;

        var result = await controller.Login(
            new LoginRequest { Email = "jane@example.com", Password = "Password123!" }
        );
        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
        var msg =
            unauthorized.Value?.GetType().GetProperty("message")?.GetValue(unauthorized.Value)
            as string;
        Assert.Equal("Email not verified", msg);
    }

    [Fact]
    public async Task Login_Inactive_ReturnsUnauthorized()
    {
        var (controller, context, antiforgery, provider) = CreateController();
        context.Users.Add(
            new User
            {
                Username = "mark",
                Email = "mark@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                IsActive = false,
                EmailVerified = true,
                Role = "user",
            }
        );
        context.SaveChanges();

        var httpContext = controller.ControllerContext.HttpContext;
        var tokens = antiforgery.GetAndStoreTokens(httpContext);
        httpContext.Request.Headers["X-CSRF-TOKEN"] = tokens.RequestToken!;

        var result = await controller.Login(
            new LoginRequest { Email = "mark@example.com", Password = "Password123!" }
        );
        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
        var msg =
            unauthorized.Value?.GetType().GetProperty("message")?.GetValue(unauthorized.Value)
            as string;
        Assert.Equal("Account inactive", msg);
    }

    [Fact]
    public async Task Login_InvalidCredentials_ReturnsUnauthorized()
    {
        var (controller, context, antiforgery, provider) = CreateController();
        context.Users.Add(
            new User
            {
                Username = "lucas",
                Email = "lucas@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                IsActive = true,
                EmailVerified = true,
                Role = "user",
            }
        );
        context.SaveChanges();

        var httpContext = controller.ControllerContext.HttpContext;
        var tokens = antiforgery.GetAndStoreTokens(httpContext);
        httpContext.Request.Headers["X-CSRF-TOKEN"] = tokens.RequestToken!;

        var result = await controller.Login(
            new LoginRequest { Email = "lucas@example.com", Password = "WrongPass1!" }
        );
        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
        var msg =
            unauthorized.Value?.GetType().GetProperty("message")?.GetValue(unauthorized.Value)
            as string;
        Assert.Equal("Invalid credentials", msg);
    }

    [Fact]
    public async Task Login_RequiresCsrfToken()
    {
        var (controller, context, antiforgery, provider) = CreateController();
        context.Users.Add(
            new User
            {
                Username = "kate",
                Email = "kate@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                IsActive = true,
                EmailVerified = true,
                Role = "user",
            }
        );
        context.SaveChanges();

        var httpContext = controller.ControllerContext.HttpContext;

        await Assert.ThrowsAsync<AntiforgeryValidationException>(() =>
            antiforgery.ValidateRequestAsync(httpContext)
        );
    }
}
