using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Backend.Dtos.Auth;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using OtpNet;

namespace Backend.Controllers;

/// <summary>
/// Handles authentication operations such as registration and login.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserRepository _users;
    private readonly string _jwtSecret;
    private readonly EmailService _email;
    private readonly IMemoryCache _cache;
    private readonly IAntiforgery _antiforgery;
    private readonly CaptchaService _captchaService;

    public AuthController(
        UserRepository users,
        IConfiguration config,
        EmailService email,
        IMemoryCache cache,
        IAntiforgery antiforgery,
        CaptchaService captchaService
    )
    {
        _users = users;
        _jwtSecret =
            config["Jwt:Secret"]
            ?? throw new InvalidOperationException("JWT secret not configured");
        _email = email;
        _cache = cache;
        _antiforgery = antiforgery;
        _captchaService = captchaService;
    }

    /// <summary>
    /// Registers a new user.
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var existing = await _users.GetByEmailAsync(request.Email);
        if (existing != null)
        {
            return Conflict(new { message = "Email already registered" });
        }

        if (!IsPasswordValid(request.Password))
        {
            return BadRequest(new { message = "Password does not meet requirements" });
        }

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            AvatarUrl = request.AvatarUrl,
            CoverUrl = request.CoverUrl,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "user",
            IsActive = true,
            EmailVerified = false,
            EmailVerificationToken = Guid.NewGuid().ToString(),
        };
        await _users.AddAsync(user);
        await _email.SendAsync(user.Email, "Verify your account", user.EmailVerificationToken!);
        return CreatedAtAction(nameof(Register), new { id = user.Id });
    }

    /// <summary>
    /// Validates credentials and returns a JWT token on success.
    /// </summary>
    [HttpPost("login")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var cacheKey = $"login_{request.Email}";
        _cache.TryGetValue<int>(cacheKey, out var attempts);

        var user = await _users.GetByEmailAsync(request.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            _cache.Set(cacheKey, attempts + 1, TimeSpan.FromMinutes(15));
            return Unauthorized(new { message = "Invalid credentials" });
        }

        if (!user.IsActive)
        {
            return Unauthorized(new { message = "Account inactive" });
        }

        if (!user.EmailVerified)
        {
            return Unauthorized(new { message = "Email not verified" });
        }

        if (attempts >= 3)
        {
            if (string.IsNullOrEmpty(request.CaptchaToken))
            {
                return BadRequest(new { message = "CAPTCHA token required" });
            }
            var isCaptchaValid = await _captchaService.IsCaptchaValid(request.CaptchaToken);
            if (!isCaptchaValid)
            {
                return BadRequest(new { message = "Invalid CAPTCHA. Please try again." });
            }
        }

        if (user.MfaEnabled)
        {
            if (string.IsNullOrEmpty(request.MfaCode))
            {
                return Unauthorized(new { message = "MFA code required" });
            }
            var totp = new Totp(Base32Encoding.ToBytes(user.MfaSecret!));
            if (!totp.VerifyTotp(request.MfaCode, out _))
            {
                return Unauthorized(new { message = "Invalid MFA code" });
            }
        }

        _cache.Remove(cacheKey);

        var token = GenerateJwtToken(user);
        Response.Cookies.Append(
            "session",
            token,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddMinutes(15),
            }
        );
        return Ok(new { token });
    }

    [HttpGet("csrf-token")]
    public IActionResult GetCsrfToken()
    {
        var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
        Response.Cookies.Append(
            "XSRF-TOKEN",
            tokens.RequestToken!,
            new CookieOptions { SameSite = SameSiteMode.Strict, Secure = true }
        );
        HttpContext.Response.Headers.Append("X-CSRF-TOKEN-FROM-SERVER", tokens.RequestToken!);
        return NoContent();
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromQuery] string token)
    {
        var user = await _users.GetByVerificationTokenAsync(token);
        if (user == null)
        {
            return NotFound();
        }
        user.EmailVerified = true;
        user.EmailVerificationToken = null;
        await _users.UpdateAsync(user);
        return Ok();
    }

    [HttpPost("resend-verification")]
    public async Task<IActionResult> ResendVerification(
        [FromBody] ResendVerificationRequest request
    )
    {
        var user = await _users.GetByEmailAsync(request.Email);
        if (user == null)
        {
            return NotFound();
        }
        if (user.EmailVerified)
        {
            return BadRequest(new { message = "Email already verified" });
        }
        user.EmailVerificationToken = Guid.NewGuid().ToString();
        await _users.UpdateAsync(user);
        await _email.SendAsync(user.Email, "Verify your account", user.EmailVerificationToken!);
        return Ok();
    }

    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSecret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
                new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role),
                }
            ),
            Expires = DateTime.UtcNow.AddMinutes(15),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            ),
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private static bool IsPasswordValid(string password)
    {
        bool hasUpper = password.Any(char.IsUpper);
        bool hasLower = password.Any(char.IsLower);
        bool hasDigit = password.Any(char.IsDigit);
        bool hasSpecial = password.Any(c => !char.IsLetterOrDigit(c));
        return password.Length >= 8 && hasUpper && hasLower && hasDigit && hasSpecial;
    }
}
