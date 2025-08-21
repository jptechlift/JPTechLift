using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class ProductBlog
{
    [Key, ForeignKey("Blog")]
    public int BlogId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Volumn { get; set; } = string.Empty;
    public string Feature { get; set; } = string.Empty;
    public string Keyword { get; set; } = string.Empty;

    public virtual Blog Blog { get; set; } = null!;
}