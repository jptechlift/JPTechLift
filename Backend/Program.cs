using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using System.Threading.Tasks;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// Tải các biến môi trường từ file .env
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// === ĐĂNG KÝ CÁC SERVICES VÀO CONTAINER ===

// 1. Thêm các dịch vụ nền tảng
builder.Services.AddHttpContextAccessor();
builder.Services.AddMemoryCache();

// 2. Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173", "https://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .WithExposedHeaders("X-CSRF-TOKEN-FROM-SERVER");
        }
    );
});

// 3. Cấu hình Database Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options
        .UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
        .UseSnakeCaseNamingConvention()
);

// 4. Đăng ký các Services và Repositories của ứng dụng
builder.Services.AddHttpClient<AiBlogService>();
builder.Services.AddScoped<AiBlogService>();
builder.Services.AddScoped<BlogService>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<BlogRepository>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddHttpClient<CaptchaService>();
builder.Services.AddScoped<CaptchaService>();

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
builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)
            ),
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
    options.Cookie.SameSite = SameSiteMode.Lax;
});
builder
    .Services.AddControllersWithViews(options =>
    {
        // Tự động bảo vệ các endpoint khỏi tấn công CSRF
        // options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
    })
    .AddJsonOptions(options =>
    {
        // Cấu hình cách JSON được serialize
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

// === LOGIC KHỞI TẠO ===
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();

    var users = scope.ServiceProvider.GetRequiredService<UserRepository>();
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
                Role = "admin",
                IsActive = true,
                CreatedDate = DateTime.UtcNow,
            };
            await users.AddAsync(adminUser);
        }
    }
}

// === CẤU HÌNH HTTP REQUEST PIPELINE ===
app.UseRouting();

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseRateLimiter();

app.MapControllers();

app.Run();
