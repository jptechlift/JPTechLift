using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos.Auth
{
    public class RegisterRequest
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;

        [Url]
        public string? AvatarUrl { get; set; }

        [Url]
        public string? CoverUrl { get; set; }
    }
}