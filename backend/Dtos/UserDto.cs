using Backend.Models;

namespace Backend.Dtos;

public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? CoverUrl { get; set; }
}

public static class UserMappings
{
    public static UserDto ToDto(this User user) => new UserDto
    {
        Id = user.Id,
        Username = user.Username,
        Email = user.Email,
        PhoneNumber = user.PhoneNumber,
        AvatarUrl = user.AvatarUrl,
        CoverUrl = user.CoverUrl
    };
}
