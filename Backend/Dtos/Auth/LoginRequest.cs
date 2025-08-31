using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos.Auth
{
    public class LoginRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        public string? MfaCode { get; set; }

        public string? CaptchaToken { get; set; }
    }
}