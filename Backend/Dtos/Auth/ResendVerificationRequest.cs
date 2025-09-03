using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Dtos.Auth;

public class ResendVerificationRequest
{
    [Required]
    [EmailAddress]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;
}