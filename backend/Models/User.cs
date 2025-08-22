using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Role { get; set; } = "user";
        public bool IsActive { get; set; } = true;
        [Column("avatar_url")]
        public string? AvatarUrl { get; set; }
        [Column("cover_url")]
        public string? CoverUrl { get; set; }        
        public virtual ICollection<Blog> Blogs { get; set; } = new List<Blog>();
    }
}