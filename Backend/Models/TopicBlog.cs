using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

/// <summary>
/// Stores topic-centric details for a <see cref="Blog"/> entry.
/// </summary>
public class TopicBlog
{
    /// <summary>Primary key and foreign key to the parent <see cref="Blog"/>.</summary>
    [Key, ForeignKey("Blog")]
    public int BlogId { get; set; }

    public string Topic { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    public string MainPoints { get; set; } = string.Empty;
    public string SeoKeywords { get; set; } = string.Empty;
    
    public virtual Blog Blog { get; set; } = null!;
}
