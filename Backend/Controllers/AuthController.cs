using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Backend.Constants;
using Backend.Dtos.Auth;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
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
    private readonly GoogleAuthService _googleAuth;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserRepository users,
        IConfiguration config,
        EmailService email,
        IMemoryCache cache,
        IAntiforgery antiforgery,
        CaptchaService captchaService,
        GoogleAuthService googleAuth,
        ILogger<AuthController> logger
    )
    {
        _users = users;
        _jwtSecret =
            Environment.GetEnvironmentVariable("Jwt__Secret")
            ?? throw new InvalidOperationException(
                "Jwt__Secret not configured. Check your .env file or environment variables."
            );
        _email = email;
        _cache = cache;
        _antiforgery = antiforgery;
        _captchaService = captchaService;
        _googleAuth = googleAuth;
        _logger = logger;
    }

    /// <summary>
    /// Registers a new user.
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            if (!IsPasswordValid(request.Password))
            {
                ModelState.AddModelError(nameof(request.Password), "Password does not meet requirements");
                return ValidationProblem(ModelState);
            }

            var existingEmail = await _users.GetByEmailAsync(request.Email);
            var existingUsername = await _users.GetByUsernameAsync(request.Username);
            if (existingEmail != null || existingUsername != null)
            {
                return Conflict(new { message = "Email hoặc tên đăng nhập đã được sử dụng." });
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                AvatarUrl = request.AvatarUrl,
                CoverUrl = request.CoverUrl,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = Roles.User,
                IsActive = true,
                EmailVerified = false,
                EmailVerificationToken = Guid.NewGuid().ToString(),
            };
            await _users.AddAsync(user);
            await _email.SendAsync(user.Email, "Verify your account", user.EmailVerificationToken!);
            return CreatedAtAction(nameof(Register), new { id = user.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new { message = "Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau." });
        }
    }

    /// <summary>
    /// Validates credentials and returns a JWT token on success.
    /// </summary>
    [HttpPost("login")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        const string authError = "Tên đăng nhập hoặc mật khẩu không chính xác.";
        try
        {
            var cacheKey = $"login_{request.Email}";
            _cache.TryGetValue<int>(cacheKey, out var attempts);

            var user = await _users.GetByEmailAsync(request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                _cache.Set(cacheKey, attempts + 1, TimeSpan.FromMinutes(15));
                return Unauthorized(new { message = authError });
            }

            if (!user.IsActive || !user.EmailVerified)
            {
                return Unauthorized(new { message = authError });
            }

            if (attempts >= 3)
            {
                if (string.IsNullOrEmpty(request.CaptchaToken))
                {
                    return Unauthorized(new { message = authError });
                }
                var isCaptchaValid = await _captchaService.IsCaptchaValid(request.CaptchaToken);
                if (!isCaptchaValid)
                {
                    return Unauthorized(new { message = authError });
                }
            }

            if (user.MfaEnabled)
            {
                if (string.IsNullOrEmpty(request.MfaCode))
                {
                    return Unauthorized(new { message = authError });
                }
                var totp = new Totp(Base32Encoding.ToBytes(user.MfaSecret!));
                if (!totp.VerifyTotp(request.MfaCode, out _))
                {
                    return Unauthorized(new { message = authError });
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
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddMinutes(15),
                }
            );
            return Ok(new { token });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { message = "Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau." });
        }
    }

    [HttpGet("csrf-token")]
    public IActionResult GetCsrfToken()
    {
        var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
        Response.Cookies.Append(
            "XSRF-TOKEN",
            tokens.RequestToken!,
            new CookieOptions { SameSite = SameSiteMode.None, Secure = true }
        );
        HttpContext.Response.Headers.Append("X-CSRF-TOKEN-FROM-SERVER", tokens.RequestToken!);
        return NoContent();
    }

    [HttpPost("login/google")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginRequest request)
    {
        if (string.IsNullOrEmpty(request.IdToken))
        {
            return BadRequest(new { message = "Google ID token is missing." });
        }
        GoogleUserInfo info;
        try
        {
            info = await _googleAuth.ValidateAsync(request.IdToken);
        }
        catch (Exception ex)
        {
            // Trả về lỗi cho client
            return Unauthorized(
                new { message = "Invalid Google token or server validation error." }
            );
        }

        var user = await _users.GetByProviderAsync("google", info.Subject);
        if (user == null)
        {
            user = await _users.GetByEmailAsync(info.Email);
            if (user == null)
            {
                user = new User
                {
                    Username = info.Name,
                    Email = info.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()),
                    Role = Roles.User,
                    IsActive = true,
                    EmailVerified = true,
                    AuthProvider = "google",
                    ProviderSubject = info.Subject,
                };
                await _users.AddAsync(user);
            }
            else
            {
                user.AuthProvider ??= "google";
                user.ProviderSubject ??= info.Subject;
                if (!user.EmailVerified)
                {
                    user.EmailVerified = true;
                }
                await _users.UpdateAsync(user);
            }
        }

        var token = GenerateJwtToken(user);
        Response.Cookies.Append(
            "session",
            token,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddMinutes(15),
            }
        );
        return Ok(new { token });
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
