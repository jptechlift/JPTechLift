using System;
using System.ComponentModel.DataAnnotations.Schema;

public class Blog
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Slug { get; set; }

    public int ViewCount { get; set; } = 0; // Bắt đầu từ 0
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
    public bool? IsPublished { get; set; }
    public string Username { get; set; }

    [ForeignKey(nameof(Username))]
    public User User { get; set; }

    public ProductBlog? ProductBlog { get; set; }
    public TopicBlog? TopicBlog { get; set; }
}