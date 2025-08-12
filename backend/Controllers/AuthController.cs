// Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            if (model.Username == "admin" && model.Password == "password")
            {
                return Ok(new { message = "Login successful" });
            }
            return Unauthorized(new { message = "Invalid credentials" });
        }
    }

    public class LoginModel
    {
    public string Username { get; set; } = string.Empty; // Gán giá trị mặc định
    public string Password { get; set; } = string.Empty; // Gán giá trị mặc định
    }
}
