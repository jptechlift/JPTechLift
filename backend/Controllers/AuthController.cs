using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    /// <summary>
    /// Provides authentication endpoints.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        /// <summary>
        /// Authenticates a user and returns a simple token.
        /// This is a demonstration-only implementation with a hard-coded user.
        /// </summary>
        /// <param name="request">The provided login credentials.</param>
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Basic credential check. Replace with a real authentication mechanism in production.
            if (request.Username == "admin" && request.Password == "password")
            {
                // Return a simple token for the frontend to store.
                return Ok(new { token = "fake-jwt-token" });
            }

            return Unauthorized(new { message = "Invalid credentials" });
        }
    }

    /// <summary>
    /// Represents the login credentials sent from the client.
    /// </summary>
    public record LoginRequest
    {
        /// <summary>Username supplied by the user.</summary>
        public string Username { get; init; } = string.Empty;

        /// <summary>Password supplied by the user.</summary>
        public string Password { get; init; } = string.Empty;
    }
}