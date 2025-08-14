using System.ComponentModel.DataAnnotations;

public class ProductBlog
{
    [Key]
    public int BlogId { get; set; } // Chỉ định BlogId là khóa chính
    public string ProductName { get; set; }
    public string ProductType { get; set; }
    public string Description { get; set; }
    public string Size { get; set; }
    public string Volumn { get; set; }
    public string Feature { get; set; }
    public string Keyword { get; set; }

    // Quan hệ với bảng Blog
    public Blog Blog { get; set; }
}
