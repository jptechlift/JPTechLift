using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos;

public class BlogDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public bool IsPublished { get; set; }
    [Required]
    public string Author { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int ViewCount { get; set; }
    public ProductBlogDto? ProductBlog { get; set; }
    public TopicBlogDto? TopicBlog { get; set; }
}

public class ProductBlogDto
{
    public string ProductName { get; set; } = string.Empty;
    public string ProductType { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    public string KeySellingPoints { get; set; } = string.Empty;
    public string SeoKeywords { get; set; } = string.Empty;
}

public class TopicBlogDto
{
    public string Topic { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    public string MainPoints { get; set; } = string.Empty;
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
        Author = blog.Author,
        Content = blog.Content,
        ViewCount = blog.ViewCount,
        ProductBlog = blog.ProductBlog == null ? null : new ProductBlogDto
        {
            ProductName = blog.ProductBlog.ProductName,
            ProductType = blog.ProductBlog.ProductType,
            Detail = blog.ProductBlog.Detail,
            TargetAudience = blog.ProductBlog.TargetAudience,
            KeySellingPoints = blog.ProductBlog.KeySellingPoints,
            SeoKeywords = blog.ProductBlog.SeoKeywords,
            },
        TopicBlog = blog.TopicBlog == null ? null : new TopicBlogDto
        {
            Topic = blog.TopicBlog.Topic,
            Content = blog.TopicBlog.Content,
            TargetAudience = blog.TopicBlog.TargetAudience,
            MainPoints = blog.TopicBlog.MainPoints,
            SeoKeywords = blog.TopicBlog.SeoKeywords,
        }
    };
}