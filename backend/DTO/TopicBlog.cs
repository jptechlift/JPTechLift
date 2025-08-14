using System.ComponentModel.DataAnnotations;

public class TopicBlog
{
    [Key]
    public int BlogId { get; set; } // Chỉ định BlogId là khóa chính
    public string Topic { get; set; }
    public string Content { get; set; }
    public string Keywords { get; set; }

    // Quan hệ với bảng Blog
    public Blog Blog { get; set; }
}
