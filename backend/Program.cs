using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Dapper;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using Backend.Models;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNameCaseInsensitive = true;
    options.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// PostgreSQL
builder.Services.AddSingleton<NpgsqlDataSource>(sp =>
{
    var cs = builder.Configuration.GetConnectionString("DefaultConnection");
    return new NpgsqlDataSourceBuilder(cs).Build();
});

// JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers();

var app = builder.Build();

app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

string GenerateJwt(int userId, string username)
{
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var token = new JwtSecurityToken(
        claims: new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, username)
        },
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: creds);
    return new JwtSecurityTokenHandler().WriteToken(token);
}

app.MapPost("/register", async (RegisterRequest request, NpgsqlDataSource dataSource) =>
{
    using var conn = dataSource.OpenConnection();

    var exists = await conn.ExecuteScalarAsync<int?>
    (
        "SELECT 1 FROM users WHERE username = @Username",
        new { request.Username }
    );

    if (exists.HasValue)
    {
        return Results.BadRequest(new { message = "Username already exists" });
    }

    var hash = BCrypt.Net.BCrypt.HashPassword(request.Password);

     const string sql = @"INSERT INTO users (username, passwordhash, email, phonenumber, role, isactive, avatar, coverurl) VALUES (@Username, @Hash, @Email, @PhoneNumber, COALESCE(@Role, 'user'), COALESCE(@IsActive, true), @AvatarUrl, @CoverUrl) RETURNING id;";

    var id = await conn.ExecuteScalarAsync<int>(sql, new
    {
        request.Username,
        Hash = hash,
        request.Email,
        request.PhoneNumber,
        request.Role,
        request.IsActive,
          request.AvatarUrl,
        request.CoverUrl
    });

    return Results.Ok(new { id });
});


app.MapPost("/login", async (LoginRequest request, NpgsqlDataSource dataSource) =>
{
    using var conn = dataSource.OpenConnection();
    var user = await conn.QuerySingleOrDefaultAsync<(int Id, string PasswordHash)>(
         "SELECT id, passwordhash FROM users WHERE username = @Username",
        new { request.Username });

    if (user == default || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
    {
        return Results.Unauthorized();
    }

    var token = GenerateJwt(user.Id, request.Username);
    return Results.Ok(new { token });
});

app.MapPost("/login/google", async (GoogleLoginRequest request, NpgsqlDataSource dataSource) =>
{
 GoogleJsonWebSignature.Payload payload;
    try
    {
        payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken);
    }
    catch
    {
        return Results.Unauthorized();
    }

    using var conn = dataSource.OpenConnection();
  var existing = await conn.QuerySingleOrDefaultAsync<(int Id, string Username)>(
        "SELECT id, username FROM users WHERE email = @Email",
        new { Email = payload.Email });

     int userId;
    string username;
    if (existing != default)
    {
        userId = existing.Id;
        username = existing.Username;
    }
    else
    {
        username = payload.Email.Split('@')[0];
        userId = await conn.ExecuteScalarAsync<int>(
         @"INSERT INTO users (username, email, avatar, coverurl) VALUES (@Username, @Email, @AvatarUrl, @CoverUrl) RETURNING id",
            new { Username = username, Email = payload.Email, AvatarUrl = payload.Picture, CoverUrl = (string?)null });
    }

    var token = GenerateJwt(userId, username);
    return Results.Ok(new { token });
});

app.MapPut("/profile", [Authorize] async (ProfileUpdateRequest request, ClaimsPrincipal user, NpgsqlDataSource dataSource) =>
{
    var userId = int.Parse(user.FindFirstValue(JwtRegisteredClaimNames.Sub)!);
    using var conn = dataSource.OpenConnection();
    const string sql = "UPDATE users SET email = COALESCE(@Email, email), phonenumber = COALESCE(@PhoneNumber, phonenumber), avatar = COALESCE(@AvatarUrl, avatar), coverurl = COALESCE(@CoverUrl, coverurl) WHERE id = @Id";
    await conn.ExecuteAsync(sql, new { request.Email, request.PhoneNumber, request.AvatarUrl, request.CoverUrl, Id = userId });
    return Results.Ok();
});

app.MapGet("/profile", [Authorize] (ClaimsPrincipal user) =>
{
    var name = user.Identity?.Name;
    return Results.Ok(new { username = name });
});

app.Run("http://0.0.0.0:5000");
