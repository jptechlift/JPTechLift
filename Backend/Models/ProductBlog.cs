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
    /// <summary>Detailed content for the product blog.</summary>
    public string Detail { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    public string KeySellingPoints { get; set; } = string.Empty;
    public string SeoKeywords { get; set; } = string.Empty;

    public virtual Blog Blog { get; set; } = null!;
}

