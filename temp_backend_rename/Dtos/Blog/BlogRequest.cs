using System.Text.Json.Serialization;

namespace Backend.Dtos.Blog;

/// <summary>
/// Request payload for creating or updating a blog entry.
/// </summary>
public class BlogRequest
{
    public string BlogType { get; set; } = string.Empty;
    public ProductDetails? ProductDetails { get; set; }
        = null;
    public TopicDetails? TopicDetails { get; set; }
        = null;
    public string? Content { get; set; }
        = null;
    public string? Author { get; set; }
        = null;
    public string? Slug { get; set; }
        = null;
}

/// <summary>
/// Product-specific details for a blog post.
/// </summary>
public class ProductDetails
{
    public string ProductName { get; set; } = string.Empty;
    public string ProductType { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    public string KeySellingPoints { get; set; } = string.Empty;
    public string SeoKeywords { get; set; } = string.Empty;
    public string ToneOfVoice { get; set; } = string.Empty;
}

/// <summary>
/// Topic blog details and SEO hints.
/// </summary>
public class TopicDetails
{
    [JsonPropertyName("articleTitle")]
    public string? ArticleTitle { get; set; }
    public string? Topic { get; set; } = string.Empty;
    [JsonPropertyName("targetAudience")]
    public string TargetAudience { get; set; } = string.Empty;
    [JsonPropertyName("mainPoints")]
    public string MainPoints { get; set; } = string.Empty;
    [JsonPropertyName("seoKeywords")]
    public string SeoKeywords { get; set; } = string.Empty;
    [JsonPropertyName("toneOfVoice")]
    public string ToneOfVoice { get; set; } = string.Empty;
}
