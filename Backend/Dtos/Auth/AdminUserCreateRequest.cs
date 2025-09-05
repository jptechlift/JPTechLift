namespace Backend.Dtos.Auth;

public class AdminUserCreateRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; } = null;
    public string? CoverUrl { get; set; } = null;
    public string Role { get; set; } = "user";
    public bool IsActive { get; set; } = true;
}
