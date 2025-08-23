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
        IsPublished = blog.IsPublished
    };
}