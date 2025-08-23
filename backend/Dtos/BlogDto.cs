using Backend.Models;

namespace Backend.Dtos;

public class BlogDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public bool IsPublished { get; set; }
    public string Author { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int ViewCount { get; set; }
    public ProductBlogDto? ProductBlog { get; set; }
}

public class ProductBlogDto
{
    public string ProductName { get; set; } = string.Empty;
    public string ProductType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Volume { get; set; } = string.Empty;
    public string Feature { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    public string KeySellingPoints { get; set; } = string.Empty;
    public string SeoKeywords { get; set; } = string.Empty;
}

public static class BlogMappings
{
    public static BlogDto ToDto(this Blog blog) => new BlogDto
    {
        Id = blog.Id,
        Title = blog.Title,
        Slug = blog.Slug,
        CreatedDate = blog.CreatedDate,
        UpdatedDate = blog.UpdatedDate,
        IsPublished = blog.IsPublished,
        Author = blog.Username,
        Content = blog.TopicBlog?.Content ?? blog.ProductBlog?.Description ?? string.Empty,
        ViewCount = blog.ViewCount,
        ProductBlog = blog.ProductBlog == null ? null : new ProductBlogDto
        {
            ProductName = blog.ProductBlog.ProductName,
            ProductType = blog.ProductBlog.ProductType,
            Description = blog.ProductBlog.Description,
            Size = blog.ProductBlog.Size,
            Volume = blog.ProductBlog.Volume,
            Feature = blog.ProductBlog.Feature,
            TargetAudience = blog.ProductBlog.TargetAudience,
            KeySellingPoints = blog.ProductBlog.KeySellingPoints,
            SeoKeywords = blog.ProductBlog.SeoKeywords,
        }
    };
}