using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class TopicBlog
{
    [Key, ForeignKey("Blog")]
    public int BlogId { get; set; }
    public string Topic { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;

        public string Keywords { get; set; } = string.Empty;
    public virtual Blog Blog { get; set; } = null!;

}