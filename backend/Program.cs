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
            username TEXT UNIQUE,
            password_hash TEXT,
            provider TEXT,
            provider_id TEXT,
            picture TEXT,
            refresh_token TEXT
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
    const string sql = "INSERT INTO users (username, password_hash) VALUES (@Username, @Hash) RETURNING id;";
    try
    {
        var id = await conn.ExecuteScalarAsync<int>(sql, new { request.Username, Hash = hash });
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
        "SELECT id, password_hash FROM users WHERE username = @Username",
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
    var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken);
    using var conn = dataSource.OpenConnection();
    var existing = await conn.QuerySingleOrDefaultAsync<int?>(
        "SELECT id FROM users WHERE provider = 'google' AND provider_id = @Sub",
        new { Sub = payload.Subject });
    int userId;
    if (existing.HasValue)
    {
        userId = existing.Value;
    }
    else
    {
        userId = await conn.ExecuteScalarAsync<int>(
            @"INSERT INTO users (username, provider, provider_id, picture) VALUES (@Email, 'google', @Sub, @Picture) RETURNING id",
            new { payload.Email, Sub = payload.Subject, Picture = payload.Picture });
    }

    var token = GenerateJwt(userId, payload.Email);
    return Results.Ok(new { token });
});

app.MapGet("/profile", [Authorize] (ClaimsPrincipal user) =>
{
    var name = user.Identity?.Name;
    return Results.Ok(new { username = name });
});

app.Run("http://0.0.0.0:5000");

record RegisterRequest(string Username, string Password);
record LoginRequest(string Username, string Password);
record GoogleLoginRequest(string IdToken);
