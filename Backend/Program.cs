using System.IO;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using System.Threading.Tasks;
using Backend.Constants;
using Backend.Middleware;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Tải các biến môi trường từ file .env nếu file tồn tại
DotNetEnv.Env.Load();

// === ĐĂNG KÝ CÁC SERVICES VÀO CONTAINER ===

// 1. Thêm các dịch vụ nền tảng
builder.Services.AddHttpContextAccessor();
builder.Services.AddMemoryCache();
var keyDir = Path.Combine(builder.Environment.ContentRootPath, "keys");
Directory.CreateDirectory(keyDir);
builder.Services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo(keyDir));

// 2. Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:5173",
                    "https://localhost:5173",
                    "https://thangmaysaigonjptechlift.com",
                    "https://www.thangmaysaigonjptechlift.com",
                    "https://jptechlift.vercel.app"
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .WithExposedHeaders("X-CSRF-TOKEN-FROM-SERVER");
        }
    );
});

// 3. Cấu hình Database Context
var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString).UseSnakeCaseNamingConvention()
);

// 4. Đăng ký các Services và Repositories của ứng dụng

builder.Services.AddHttpClient<AiBlogService>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<BlogRepository>();

builder.Services.AddScoped<BlogService>(provider =>
    new BlogService(
        provider.GetRequiredService<BlogRepository>(),
        provider.GetRequiredService<UserRepository>(),
        provider.GetRequiredService<AiBlogService>(),
        provider.GetRequiredService<ApplicationDbContext>(),
        provider.GetRequiredService<ILogger<BlogService>>()
    )
);

builder.Services.AddScoped<EmailService>();
builder.Services.AddHttpClient<CaptchaService>();
builder.Services.AddScoped<CaptchaService>();
builder.Services.AddScoped<GoogleAuthService>();

builder.Services.AddLogging(configure =>
{
    configure.AddConsole();
    configure.AddDebug();
});


// 5. Cấu hình Rate Limiter
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy(
        "login",
        httpContext =>
            RateLimitPartition.GetFixedWindowLimiter(
                httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 5,
                    Window = TimeSpan.FromMinutes(1),
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = 0,
                }
            )
    );
    options.OnRejected = (context, _) =>
    {
        context.HttpContext.Response.Headers["Retry-After"] = "60";
        return ValueTask.CompletedTask;
    };
});

// 6. Cấu hình Authentication và Authorization TRƯỚC Controllers

var jwtSecret = Environment.GetEnvironmentVariable("Jwt__Secret");
if (string.IsNullOrEmpty(jwtSecret))
{
    throw new InvalidOperationException(
        "Jwt:Secret is missing. Check your .env file or environment variables."
    );
}

builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ClockSkew = TimeSpan.Zero,
            RoleClaimType = ClaimTypes.Role,
        };
    });
builder.Services.AddAuthorization();

// 7. Cấu hình Antiforgery và MVC
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = "XSRF-TOKEN";
    options.Cookie.HttpOnly = false;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});
builder
    .Services.AddControllersWithViews(options =>
    {
        // options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = System
            .Text
            .Json
            .JsonNamingPolicy
            .CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = System
            .Text
            .Json
            .JsonNamingPolicy
            .CamelCase;
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// === XÂY DỰNG ỨNG DỤNG ===
var app = builder.Build();

// === LOGIC KHỞI TẠO (Áp dụng Migrations và tạo Admin/Author mặc định) ===
using (var scope = app.Services.CreateScope())
{
    var serviceProvider = scope.ServiceProvider;
    var logger = serviceProvider.GetRequiredService<ILogger<Program>>();

    // Kiểm tra và thực hiện Migrations
    // Khai báo db ở phạm vi ngoài khối try để có thể sử dụng bên dưới
    ApplicationDbContext? db = null; // Khởi tạo là null

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        logger.LogError(
            "Connection string 'DefaultConnection' is missing or empty. Migration aborted."
        );
        // Có thể thoát sớm nếu không có chuỗi kết nối
        // Environment.Exit(1); // Thoát ứng dụng
    }
    else
    {
        try
        {
            db = serviceProvider.GetRequiredService<ApplicationDbContext>();
            db.Database.Migrate();
            logger.LogInformation("Database migration successful.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating the database.");
            // Ném lại ngoại lệ để ứng dụng không khởi động với database bị lỗi
            // throw;
        }
    }


    // Tạo người dùng Admin và Author mặc định nếu chưa tồn tại
    // Chỉ tiếp tục nếu db không null (tức là migration có thể thực hiện)
    if (db != null) // <-- Thêm kiểm tra null cho db
    {
        var users = serviceProvider.GetRequiredService<UserRepository>();
        var adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL");
        var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD");

        if (!string.IsNullOrEmpty(adminEmail) && !string.IsNullOrEmpty(adminPassword))
        {
            var admin = await users.GetByEmailAsync(adminEmail);
            if (admin == null)
            {
                var adminUser = new User
                {
                    Username = Environment.GetEnvironmentVariable("ADMIN_USERNAME") ?? "admin",
                    Email = adminEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
                    Role = Roles.Admin,
                    IsActive = true,
                    CreatedDate = DateTime.UtcNow,
                };
                await users.AddAsync(adminUser);
                logger.LogInformation("Default Admin user created.");
            }
        }
        else
        {
            logger.LogWarning("ADMIN_EMAIL or ADMIN_PASSWORD environment variables are missing. Default Admin user not created.");
        }


        var authorEmail = Environment.GetEnvironmentVariable("AUTHOR_EMAIL");
        var authorPassword = Environment.GetEnvironmentVariable("AUTHOR_PASSWORD");

        if (!string.IsNullOrEmpty(authorEmail) && !string.IsNullOrEmpty(authorPassword))
        {
            var author = await users.GetByEmailAsync(authorEmail);
            if (author == null)
            {
                var authorUser = new User
                {
                    Username = Environment.GetEnvironmentVariable("AUTHOR_USERNAME") ?? "author",
                    Email = authorEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(authorPassword),
                    Role = Roles.Author,
                    IsActive = true,
                    CreatedDate = DateTime.UtcNow,
                };
                await users.AddAsync(authorUser);
                logger.LogInformation("Default Author user created.");
            }
        }
        else if (!await db.Users.AnyAsync(u => u.Role == Roles.Author))
        {
            var authorUser = new User
            {
                Username = "author",
                Email = "author@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Author@123!"),
                Role = Roles.Author,
                IsActive = true,
                CreatedDate = DateTime.UtcNow,
            };
            await users.AddAsync(authorUser);
            logger.LogInformation("Fallback default Author user created.");
        }
        else
        {
            logger.LogWarning("AUTHOR_EMAIL or AUTHOR_PASSWORD environment variables are missing. Default Author user not created. (or already exists)");
        }
    }
    else
    {
        logger.LogError("ApplicationDbContext was not successfully initialized. Skipping default user creation.");
    }
}


// === CẤU HÌNH HTTP REQUEST PIPELINE ===
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseRouting();
app.Use( // <-- ĐÃ SỬA: Chỉ cần 'app.Use'
    async (context, next) =>
    {
        context.Response.Headers["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups";
        await next();
    }
);
app.UseCors("AllowFrontend");
app.UseForwardedHeaders(
    new ForwardedHeadersOptions { ForwardedHeaders = ForwardedHeaders.XForwardedProto }
);
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseRateLimiter();

app.MapControllers();

app.Run();