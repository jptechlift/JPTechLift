using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Backend.Controllers;

namespace Backend.Services;

// --- DTOs for structured communication with Gemini API ---
public class GeminiRequest
{
    [JsonPropertyName("contents")]
    public List<Content> Contents { get; set; } = new();
}
public class Content
{
    [JsonPropertyName("parts")]
    public List<Part> Parts { get; set; } = new();
}
public class Part
{
    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;
}
public class GeminiResponse
{
    [JsonPropertyName("candidates")]
    public List<Candidate> Candidates { get; set; } = new();
}
public class Candidate
{
    [JsonPropertyName("content")]
    public Content Content { get; set; } = new();
}
// -----------------------------------------------------------

public class AiBlogService
{
    private readonly HttpClient _httpClient;
    private readonly string? _apiKey;
    private readonly ILogger<AiBlogService> _logger;

    public AiBlogService(HttpClient httpClient, IConfiguration configuration, ILogger<AiBlogService> logger)
    {
        _httpClient = httpClient;
        _apiKey = configuration["GEMINI_API_KEY"];
        _logger = logger;
    }

    public async Task<(string Title, string Content)> GenerateContentAsync(BlogRequest request)
    {
        if (string.IsNullOrWhiteSpace(_apiKey))
        {
            _logger.LogWarning("GEMINI_API_KEY is not configured. Returning placeholder content.");
            var placeholderTitle = request.BlogType == "product" ? request.ProductDetails?.ProductName : request.TopicDetails?.ArticleTitle;
            return (placeholderTitle ?? "Lỗi Tiêu đề", $"Đây là nội dung placeholder cho chủ đề: {placeholderTitle}");
        }

        var model = "gemini-1.5-flash-latest";
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={_apiKey}";

        var prompt = BuildPrompt(request);
        var payload = new GeminiRequest
        {
            Contents = new List<Content>
            {
                new Content { Parts = new List<Part> { new Part { Text = prompt } } }
            }
        };

        try
        {
            _logger.LogInformation("Sending prompt to Gemini API. Prompt length: {Length}", prompt.Length);
            var response = await _httpClient.PostAsJsonAsync(url, payload);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                _logger.LogError("Gemini API request failed with status {StatusCode}. Response: {ErrorBody}", response.StatusCode, errorBody);
                throw new HttpRequestException($"Gemini API request failed. Status: {response.StatusCode}");
            }

            var geminiResponse = await response.Content.ReadFromJsonAsync<GeminiResponse>();

            var generatedText = geminiResponse?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text;

            if (string.IsNullOrWhiteSpace(generatedText))
            {
                _logger.LogWarning("Gemini API returned a successful response, but the generated text was empty.");
                throw new InvalidOperationException("Generated content was empty.");
            }

            _logger.LogInformation("Successfully received and parsed content from Gemini API.");

var cleanJsonText = generatedText.Trim();
if (cleanJsonText.StartsWith("```json"))
{
    cleanJsonText = cleanJsonText.Substring(7).Trim(); // Xóa "```json" và khoảng trắng
}
if (cleanJsonText.EndsWith("```"))
{
    cleanJsonText = cleanJsonText.Substring(0, cleanJsonText.Length - 3).Trim(); // Xóa "```" và khoảng trắng
}
        try
{
    // Parse chuỗi đã được dọn dẹp
    var jsonDoc = JsonDocument.Parse(cleanJsonText);
    var title = jsonDoc.RootElement.GetProperty("title").GetString() ?? "Tiêu đề mặc định (lỗi parsing)";
    var body = jsonDoc.RootElement.GetProperty("body").GetString() ?? "Nội dung mặc định (lỗi parsing).";

    return (title, body);
}
catch (JsonException jsonEx)
{
    // Log lỗi cùng với nội dung thô để dễ dàng debug
    _logger.LogError(jsonEx, "Failed to parse JSON response from Gemini. Raw text was: {GeneratedText}", generatedText);
    
    // Ném lại lỗi để khối catch bên ngoài có thể xử lý và trả về placeholder
    throw; 
}
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An exception occurred while generating content with Gemini.");
            var placeholderTitle = request.BlogType == "product" ? request.ProductDetails?.ProductName : request.TopicDetails?.ArticleTitle;
            return (placeholderTitle ?? "Lỗi Tiêu đề", $"Lỗi xảy ra khi tạo nội dung bằng AI. Vui lòng thử lại. Nội dung placeholder cho: {placeholderTitle}");
        }
    }

    private string BuildPrompt(BlogRequest request)
    {
        var promptBuilder = new System.Text.StringBuilder();
        promptBuilder.AppendLine("Bạn là một chuyên gia content marketing của công ty thang máy JP TechLift.");
        promptBuilder.AppendLine("Dựa trên các thông tin sau, hãy viết một bài blog chi tiết, chuyên nghiệp, và chuẩn SEO.");

        if (request.BlogType == "product" && request.ProductDetails != null)
        {
            var p = request.ProductDetails;
            promptBuilder.AppendLine("- Loại bài viết: Giới thiệu sản phẩm");
            promptBuilder.AppendLine($"- Tên sản phẩm: \"{p.ProductName}\"");
            promptBuilder.AppendLine($"- Loại sản phẩm: {p.ProductType}");
            promptBuilder.AppendLine($"- Đối tượng khách hàng: {p.TargetAudience}");
            promptBuilder.AppendLine($"- Lợi ích chính: {p.KeySellingPoints}");
            promptBuilder.AppendLine($"- Từ khóa SEO: {p.SeoKeywords}");
            promptBuilder.AppendLine($"- Văn phong: {p.ToneOfVoice}");
        }
        else if (request.BlogType == "topic" && request.TopicDetails != null)
        {
            var t = request.TopicDetails;
            promptBuilder.AppendLine("- Loại bài viết: Phân tích chủ đề");
            promptBuilder.AppendLine($"- Tiêu đề mong muốn: \"{t.ArticleTitle}\"");
            promptBuilder.AppendLine($"- Đối tượng độc giả: {t.TargetAudience}");
            promptBuilder.AppendLine($"- Các ý chính cần triển khai: {t.MainPoints}");
            promptBuilder.AppendLine($"- Từ khóa SEO: {t.SeoKeywords}");
            promptBuilder.AppendLine($"- Văn phong: {t.ToneOfVoice}");
        }

        promptBuilder.AppendLine("\nYÊU CẦU ĐẦU RA: Vui lòng trả lời bằng một chuỗi JSON hợp lệ và chỉ JSON mà thôi, không có giải thích hay ký tự ``` nào. Cấu trúc JSON phải như sau:");
        promptBuilder.AppendLine("{");
        promptBuilder.AppendLine("  \"title\": \"Một tiêu đề cuối cùng, hấp dẫn và chuẩn SEO cho bài viết\",");
        promptBuilder.AppendLine("  \"body\": \"Nội dung đầy đủ của bài viết ở đây. Sử dụng các thẻ HTML cơ bản như <p>, <h2>, <ul>, <li> để định dạng văn bản cho dễ đọc.\",");
        promptBuilder.AppendLine("}");

        return promptBuilder.ToString();
    }
}