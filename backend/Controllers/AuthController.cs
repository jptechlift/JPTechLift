using Backend.Models;  // Thêm phần này để sử dụng User model
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;

namespace Backend.Controllers


{
    [Route("api/[controller]")]
    [ApiController]
    // Handles user authentication and JWT token generation.
    public class AuthController : ControllerBase
    {
        private readonly NpgsqlDataSource _dataSource;
        private readonly string _jwtSecret;

        public AuthController(NpgsqlDataSource dataSource, IConfiguration config)
        {
            _dataSource = dataSource;
            _jwtSecret = config["Jwt:Secret"] ?? throw new InvalidOperationException("JWT secret not configured");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await ValidateUserAsync(request.Username, request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        // Validate the user credentials against the database.
        private async Task<User?> ValidateUserAsync(string username, string password)
        {
            await using var conn = await _dataSource.OpenConnectionAsync();
            await using var command = new NpgsqlCommand("SELECT id, username, password_hash FROM users WHERE username = @username LIMIT 1", conn);
            command.Parameters.AddWithValue("username", username);

            await using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                var storedHash = reader.GetString(reader.GetOrdinal("password_hash"));
                if (BCrypt.Net.BCrypt.Verify(password, storedHash))
                {
                    return new User
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("id")),
                        Username = reader.GetString(reader.GetOrdinal("username"))
                    };
                }
            }
            return null;
        }

        // Generate a JWT token for the authenticated user.
        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}