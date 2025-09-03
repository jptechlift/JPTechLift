using System;
using System.Collections.Generic;
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

public class AuthFlowTests
{
    private AuthController CreateController(
        out ApplicationDbContext context,
        out IAntiforgery antiforgery,
        out ServiceProvider provider
    )
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddAntiforgery();
        services.AddMemoryCache();
        services.AddScoped<EmailService>();
        services.AddSingleton<CaptchaService, FakeCaptchaService>();
        provider = services.BuildServiceProvider();
        antiforgery = provider.GetRequiredService<IAntiforgery>();
        var cache = provider.GetRequiredService<IMemoryCache>();
        var email = provider.GetRequiredService<EmailService>();

        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(
                new Dictionary<string, string>
                {
                    { "Jwt:Secret", "01234567890123456789012345678901" },
                }
            )
            .Build();

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        context = new ApplicationDbContext(options);
        var repo = new UserRepository(context);

        var captcha = provider.GetRequiredService<CaptchaService>();
        var controller = new AuthController(repo, config, email, cache, antiforgery, captcha)
        {
            ControllerContext =
            {
                HttpContext = new DefaultHttpContext { RequestServices = provider },
            },
        };

        return controller;
    }

    [Fact]
    public async Task Registration_Verification_Login_Flow()
    {
        var controller = CreateController(out var context, out var antiforgery, out var provider);

        var registerResult = await controller.Register(
            new RegisterRequest
            {
                Username = "john",
                Password = "Password123!",
                Email = "john@example.com",
            }
        );
        Assert.IsType<CreatedAtActionResult>(registerResult);

        var token = context.Users.Single().EmailVerificationToken!;
        var verifyResult = await controller.VerifyEmail(token);
        Assert.IsType<OkResult>(verifyResult);

        // simulate failed attempts
        for (int i = 0; i < 3; i++)
        {
            controller.ControllerContext.HttpContext = new DefaultHttpContext
            {
                RequestServices = provider,
            };
            var tokens = antiforgery.GetAndStoreTokens(controller.ControllerContext.HttpContext);
            controller.ControllerContext.HttpContext.Request.Headers["X-CSRF-TOKEN"] =
                tokens.RequestToken!;
            await controller.Login(
                new LoginRequest { Email = "john@example.com", Password = "wrong" }
            );
        }

        controller.ControllerContext.HttpContext = new DefaultHttpContext
        {
            RequestServices = provider,
        };
        var tokens2 = antiforgery.GetAndStoreTokens(controller.ControllerContext.HttpContext);
        controller.ControllerContext.HttpContext.Request.Headers["X-CSRF-TOKEN"] =
            tokens2.RequestToken!;
        var blocked = await controller.Login(
            new LoginRequest { Email = "john@example.com", Password = "Password123!" }
        );
        Assert.IsType<BadRequestObjectResult>(blocked);

        controller.ControllerContext.HttpContext = new DefaultHttpContext
        {
            RequestServices = provider,
        };
        var tokens3 = antiforgery.GetAndStoreTokens(controller.ControllerContext.HttpContext);
        controller.ControllerContext.HttpContext.Request.Headers["X-CSRF-TOKEN"] =
            tokens3.RequestToken!;
        var login = await controller.Login(
            new LoginRequest
            {
                Email = "john@example.com",
                Password = "Password123!",
                CaptchaToken = "captcha",
            }
        );
        Assert.IsType<OkObjectResult>(login);
    }
}
