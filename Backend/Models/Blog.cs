using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

/// <summary>
/// Core blog entity. A blog can represent either a product review or a
/// topic article and may have specialized child entities attached.
/// </summary>
public class Blog
{
    [Key]
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    /// <summary>Unique slug used as URL identifier.</summary>
    [Required]
    [MaxLength(500)]
    public string Slug { get; set; } = string.Empty;
    
    [MaxLength(500)] // Độ dài phù hợp cho meta description
    public string MetaDescription { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;

    /// <summary>Flag indicating whether the blog is publicly visible.</summary>
    public bool IsPublished { get; set; }
        = false;

    public int ViewCount { get; set; }
        = 0;

    /// <summary>User name of the author. Foreign key to <see cref="User" />.</summary>
    public string Username { get; set; } = string.Empty;

    public virtual User User { get; set; } = null!;

    [Required]
    public string Author { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;


    public virtual ProductBlog? ProductBlog { get; set; }
        = null;

    public virtual TopicBlog? TopicBlog { get; set; }
        = null;
}

