using System;
using System.ComponentModel.DataAnnotations.Schema;

public class Blog
{
    public int Id { get; set; }
    public string Title { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
    public bool? IsPublished { get; set; }
    public string Username { get; set; }  // Thuộc tính Username trong Blog

    [ForeignKey(nameof(Username))]
    public User User { get; set; }  // Quan hệ với User

    public ProductBlog? ProductBlog { get; set; }
    public TopicBlog? TopicBlog { get; set; }
}