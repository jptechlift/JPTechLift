using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

/// <summary>
/// Stores product-specific details for a <see cref="Blog"/> entry.
/// </summary>
public class ProductBlog
{
    /// <summary>Primary key and foreign key to the owning <see cref="Blog"/>.</summary>
    [Key, ForeignKey("Blog")]
    public int BlogId { get; set; }

    public string ProductName { get; set; } = string.Empty;
    public string ProductType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Volume { get; set; } = string.Empty;
    public string Feature { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    public string KeySellingPoints { get; set; } = string.Empty;
    public string SeoKeywords { get; set; } = string.Empty;

    public virtual Blog Blog { get; set; } = null!;
}

