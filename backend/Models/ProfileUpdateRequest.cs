namespace Backend.Models
{
    public class ProfileUpdateRequest
    {
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
         public string? AvatarUrl { get; set; }
        public string? CoverUrl { get; set; }
    }
}