using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Dtos.Auth
{
    public class LoginRequest
    {
        [Required]
        [JsonPropertyName("email")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;

        [JsonPropertyName("mfaCode")]
        public string? MfaCode { get; set; }

        [JsonPropertyName("captchaToken")]
        public string? CaptchaToken { get; set; }
    }
}
