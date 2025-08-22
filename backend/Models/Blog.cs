using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class Blog
{
    [Key]
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; };
    public DateTime CreatedDate { get; set; }
        = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; }
        = DateTime.UtcNow;
    public bool IsPublished { get; set; } = false;
    public string? Content { get; set; }
        = null;

    public string Username { get; set; } = string.Empty;
    public virtual User User { get; set; } = null!;

    public virtual ProductBlog? ProductBlog { get; set; }
        = null;
    public virtual TopicBlog? TopicBlog { get; set; }
        = null;
}