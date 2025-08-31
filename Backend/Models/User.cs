using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

/// <summary>
/// Represents an application user capable of owning many blogs.
/// </summary>
public class User
{
    [Key]
    public int Id { get; set; }

    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public string Role { get; set; } = "user";
    public bool IsActive { get; set; } = true;

    public string? AvatarUrl { get; set; }
        = null;
    public string? CoverUrl { get; set; }
        = null;

    public bool EmailVerified { get; set; } = false;
    public string? EmailVerificationToken { get; set; }
        = null;

    public bool MfaEnabled { get; set; } = false;
    public string? MfaSecret { get; set; }
        = null;

    public virtual ICollection<Blog> Blogs { get; set; } = new List<Blog>();
}