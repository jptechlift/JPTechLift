using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly string _connectionString = "Host=localhost;Username=postgres;Password=1;Database=auth_db";

        [HttpGet]
        public IActionResult Get()
        {
            var idValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (idValue == null)
            {
                return Unauthorized();
            }

            using var conn = new NpgsqlConnection(_connectionString);
            conn.Open();
            var cmd = new NpgsqlCommand("SELECT username, phonenumber, email, avatar FROM users WHERE id = @id", conn);
            cmd.Parameters.AddWithValue("id", int.Parse(idValue));
            using var reader = cmd.ExecuteReader();
            if (!reader.Read())
            {
                return NotFound();
            }

            var result = new
            {
                name = reader.GetString(reader.GetOrdinal("username")),
                phone = reader.IsDBNull(reader.GetOrdinal("phonenumber")) ? null : reader.GetString(reader.GetOrdinal("phonenumber")),
                email = reader.GetString(reader.GetOrdinal("email")),
                avatar = reader.IsDBNull(reader.GetOrdinal("avatar")) ? null : reader.GetString(reader.GetOrdinal("avatar"))
            };
            return Ok(result);
        }

        public class ProfilePayload
        {
            public string? Name { get; set; }
            public string? Phone { get; set; }
            public string? Email { get; set; }
            public string? Avatar { get; set; }
        }

        [HttpPut]
        public IActionResult Put([FromBody] ProfilePayload payload)
        {
            var idValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (idValue == null)
            {
                return Unauthorized();
            }

            using var conn = new NpgsqlConnection(_connectionString);
            conn.Open();
            var cmd = new NpgsqlCommand(@"UPDATE users SET 
                                        username = COALESCE(@Name, username),
                                        phonenumber = COALESCE(@Phone, phonenumber),
                                        email = COALESCE(@Email, email),
                                        avatar = COALESCE(@Avatar, avatar)
                                        WHERE id = @Id", conn);
            cmd.Parameters.AddWithValue("Name", (object?)payload.Name ?? DBNull.Value);
            cmd.Parameters.AddWithValue("Phone", (object?)payload.Phone ?? DBNull.Value);
            cmd.Parameters.AddWithValue("Email", (object?)payload.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("Avatar", (object?)payload.Avatar ?? DBNull.Value);
            cmd.Parameters.AddWithValue("Id", int.Parse(idValue));
            cmd.ExecuteNonQuery();
            return Ok();
        }
    }
}
