using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public string Username { get; set; } // Chỉ định Username là khóa chính
    public string PasswordHash { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public string Role { get; set; } = "user";
    public bool IsActive { get; set; } = true;

    // Các quan hệ (nếu có)
    public ICollection<Blog> Blogs { get; set; } // Mối quan hệ với bảng Blogs
}
