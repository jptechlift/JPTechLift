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

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

// Ensure database and tables exist
using (var scope = app.Services.CreateScope())
{
    var dataSource = scope.ServiceProvider.GetRequiredService<NpgsqlDataSource>();
    using var conn = dataSource.OpenConnection();
    conn.Execute(@"
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255),
            passwordhash TEXT,
            email VARCHAR(255),
            phonenumber VARCHAR(15),
            createddate TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            role VARCHAR(50) DEFAULT 'user',
            isactive BOOLEAN DEFAULT TRUE,
            avatar TEXT
        );
        CREATE TABLE IF NOT EXISTS blogs (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            title TEXT,
            content TEXT
        );
        CREATE TABLE IF NOT EXISTS productblogs (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            title TEXT,
            content TEXT
        );
        CREATE TABLE IF NOT EXISTS topicblogs (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            title TEXT,
            content TEXT
        );
    ");
}

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
    var hash = BCrypt.Net.BCrypt.HashPassword(request.Password);
     const string sql = @"INSERT INTO users (username, passwordhash, email, phonenumber, role, isactive, avatar)
                         VALUES (@Username, @Hash, @Email, @PhoneNumber, COALESCE(@Role, 'user'), COALESCE(@IsActive, true), @Avatar)
                         RETURNING id;";
    try
    {
         var id = await conn.ExecuteScalarAsync<int>(sql, new
        {
            request.Username,
            Hash = hash,
            request.Email,
            request.PhoneNumber,
            request.Role,
            request.IsActive,
            request.Avatar
        });
        return Results.Ok(new { id });
    }
    catch
    {
        return Results.BadRequest(new { message = "User exists" });
    }
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
            @"INSERT INTO users (username, email, avatar) VALUES (@Username, @Email, @Avatar) RETURNING id",
            new { Username = username, Email = payload.Email, Avatar = payload.Picture });
    }

    var token = GenerateJwt(userId, username);
    return Results.Ok(new { token });
});

app.MapPut("/profile", [Authorize] async (ProfileUpdateRequest request, ClaimsPrincipal user, NpgsqlDataSource dataSource) =>
{
    var userId = int.Parse(user.FindFirstValue(JwtRegisteredClaimNames.Sub)!);
    using var conn = dataSource.OpenConnection();
    const string sql = "UPDATE users SET email = COALESCE(@Email, email), phonenumber = COALESCE(@PhoneNumber, phonenumber), avatar = COALESCE(@Avatar, avatar) WHERE id = @Id";
    await conn.ExecuteAsync(sql, new { request.Email, request.PhoneNumber, request.Avatar, Id = userId });
    return Results.Ok();
});

app.MapGet("/profile", [Authorize] (ClaimsPrincipal user) =>
{
    var name = user.Identity?.Name;
    return Results.Ok(new { username = name });
});

app.Run("http://0.0.0.0:5000");
