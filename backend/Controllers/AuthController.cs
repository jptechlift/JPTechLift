using Backend.Models;  // Thêm phần này để sử dụng User model
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

namespace Backend.Controllers


{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly string _connectionString = "Host=your_host;Username=your_user;Password=your_password;Database=your_db";

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = ValidateUser(request.Username, request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        private User? ValidateUser(string username, string password)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                var command = new NpgsqlCommand("SELECT id, username, password_hash FROM users WHERE username = @username LIMIT 1", conn);
                command.Parameters.AddWithValue("username", username);

                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
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
                }
            }
            return null;
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("your-secret-key");
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
