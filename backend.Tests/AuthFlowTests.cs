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
using System;
using System.Collections.Generic;

namespace backend.Tests;

public class AuthFlowTests
{
    private AuthController CreateController(out ApplicationDbContext context)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddAntiforgery();
        services.AddMemoryCache();
        services.AddScoped<EmailService>();
        var provider = services.BuildServiceProvider();
        var antiforgery = provider.GetRequiredService<IAntiforgery>();
        var cache = provider.GetRequiredService<IMemoryCache>();
        var email = provider.GetRequiredService<EmailService>();

        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string> { { "Jwt:Secret", "01234567890123456789012345678901" } })
            .Build();

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        context = new ApplicationDbContext(options);
        var repo = new UserRepository(context);

        var controller = new AuthController(repo, config, email, cache, antiforgery)
        {
            ControllerContext = { HttpContext = new DefaultHttpContext() }
        };

        return controller;
    }

    [Fact]
    public async Task Registration_Verification_Login_Flow()
    {
        var controller = CreateController(out var context);

        var registerResult = await controller.Register(new RegisterRequest
        {
            Username = "john",
            Password = "Password123!",
            Email = "john@example.com"
        });
        Assert.IsType<CreatedAtActionResult>(registerResult);

        var token = context.Users.Single().EmailVerificationToken!;
        var verifyResult = await controller.VerifyEmail(token);
        Assert.IsType<OkResult>(verifyResult);

        // simulate failed attempts
        for (int i = 0; i < 3; i++)
        {
            controller.ControllerContext.HttpContext = new DefaultHttpContext();
            await controller.Login(new LoginRequest { Username = "john", Password = "wrong" });
        }

        controller.ControllerContext.HttpContext = new DefaultHttpContext();
        var blocked = await controller.Login(new LoginRequest { Username = "john", Password = "Password123!" });
        Assert.IsType<BadRequestObjectResult>(blocked);

        controller.ControllerContext.HttpContext = new DefaultHttpContext();
        var login = await controller.Login(new LoginRequest { Username = "john", Password = "Password123!", CaptchaToken = "captcha" });
        Assert.IsType<OkObjectResult>(login);
    }
}