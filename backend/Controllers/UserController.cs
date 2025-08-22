using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Backend.Dtos;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly NpgsqlDataSource _dataSource;

        public UserController(NpgsqlDataSource dataSource)
        {
            _dataSource = dataSource;
        }

        // Retrieve the profile of the currently authenticated user.
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var idValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (idValue == null)
            {
                return Unauthorized();
            }

            await using var conn = await _dataSource.OpenConnectionAsync();
            await using var cmd = new NpgsqlCommand("SELECT id, username, phone_number, email, avatar_url, cover_url FROM users WHERE id = @id", conn);
            cmd.Parameters.AddWithValue("id", int.Parse(idValue));
            await using var reader = await cmd.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
            {
                return NotFound();
            }

             var result = new UserDto
            {
              Id = reader.GetInt32(reader.GetOrdinal("id")),
                Username = reader.GetString(reader.GetOrdinal("username")),
                PhoneNumber = reader.IsDBNull(reader.GetOrdinal("phone_number")) ? string.Empty : reader.GetString(reader.GetOrdinal("phone_number")),
                Email = reader.GetString(reader.GetOrdinal("email")),
                AvatarUrl = reader.IsDBNull(reader.GetOrdinal("avatar_url")) ? null : reader.GetString(reader.GetOrdinal("avatar_url")),
                CoverUrl = reader.IsDBNull(reader.GetOrdinal("cover_url")) ? null : reader.GetString(reader.GetOrdinal("cover_url"))
            };
            return Ok(result);
        }

        // Payload used when updating the user's profile. All fields are optional.
        public class ProfilePayload
        {
            public string? Name { get; set; }
            public string? Phone { get; set; }
            public string? Email { get; set; }
            public string? Avatar { get; set; }
             public string? Cover { get; set; }
        }

        // Update the profile of the currently authenticated user.
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] ProfilePayload payload)
        {
            var idValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (idValue == null)
            {
                return Unauthorized();
            }

            await using var conn = await _dataSource.OpenConnectionAsync();
            await using var cmd = new NpgsqlCommand(@"UPDATE users SET
                                        username = COALESCE(@Name, username),
                                        phone_number = COALESCE(@Phone, phone_number),
                                        email = COALESCE(@Email, email),
                                        avatar_url = COALESCE(@Avatar, avatar_url),
                                        cover_url = COALESCE(@Cover, cover_url)
                                        WHERE id = @Id", conn);
            cmd.Parameters.AddWithValue("Name", (object?)payload.Name ?? DBNull.Value);
            cmd.Parameters.AddWithValue("Phone", (object?)payload.Phone ?? DBNull.Value);
            cmd.Parameters.AddWithValue("Email", (object?)payload.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("Avatar", (object?)payload.Avatar ?? DBNull.Value);
            cmd.Parameters.AddWithValue("Cover", (object?)payload.Cover ?? DBNull.Value);
            cmd.Parameters.AddWithValue("Id", int.Parse(idValue));
            await cmd.ExecuteNonQueryAsync();

            var selectCmd = new NpgsqlCommand("SELECT id, username, phone_number, email, avatar_url, cover_url FROM users WHERE id = @Id", conn);
            selectCmd.Parameters.AddWithValue("Id", int.Parse(idValue));
            using var reader = selectCmd.ExecuteReader();
            if (!reader.Read())
            {
                return NotFound();
            }

             var result = new UserDto
            {
              Id = reader.GetInt32(reader.GetOrdinal("id")),
                Username = reader.GetString(reader.GetOrdinal("username")),
                PhoneNumber = reader.IsDBNull(reader.GetOrdinal("phone_number")) ? string.Empty : reader.GetString(reader.GetOrdinal("phone_number")),
                Email = reader.GetString(reader.GetOrdinal("email")),
                AvatarUrl = reader.IsDBNull(reader.GetOrdinal("avatar_url")) ? null : reader.GetString(reader.GetOrdinal("avatar_url")),
                CoverUrl = reader.IsDBNull(reader.GetOrdinal("cover_url")) ? null : reader.GetString(reader.GetOrdinal("cover_url"))
            };
            return Ok(result);
        }
    }
}