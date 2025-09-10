// Trong file Backend.Services/AiBlogService.cs

using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Backend.Dtos.Blog;

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

/// <summary>
/// Service responsible for communicating with the Gemini API to
/// generate blog content. The service hides HTTP details and ensures
/// returned data matches the expected schema.
/// </summary>
public class AiBlogService
{
    private readonly HttpClient _httpClient;
    private readonly string? _apiKey;
    private readonly ILogger<AiBlogService> _logger;

    public AiBlogService(HttpClient httpClient, IConfiguration configuration, ILogger<AiBlogService> logger)
    {
        _httpClient = httpClient;
        // ĐỌC TRỰC TIẾP BIẾN MÔI TRƯỜNG "GEMINI_API_KEY"
        _apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");
        // Hoặc cách khác vẫn dùng IConfiguration nhưng theo tên biến môi trường:
        // _apiKey = configuration["GEMINI_API_KEY"];
        _logger = logger;
    }

    // ... (phần còn lại của code GenerateContentAsync và BuildPrompt giữ nguyên)
    public async Task<(string Title, string Content, string MetaDescription)> GenerateContentAsync(BlogRequest request)
    {
        if (string.IsNullOrWhiteSpace(_apiKey))
        {
            _logger.LogWarning("GEMINI_API_KEY is not configured. Returning placeholder content.");
            var placeholderTitle = request.BlogType == "product" ? request.ProductDetails?.ProductName : request.TopicDetails?.ArticleTitle;
            // Thêm placeholder cho metaDescription
            return (placeholderTitle ?? "Lỗi Tiêu đề", $"Đây là nội dung placeholder cho chủ đề: {placeholderTitle}", "Meta description placeholder.");
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

            try
            {
                var cleanJsonText = StripCodeFences(generatedText);
                var jsonDoc = JsonDocument.Parse(cleanJsonText);
                var title = jsonDoc.RootElement.GetProperty("title").GetString() ?? "Tiêu đề mặc định (lỗi parsing)";
                var body = jsonDoc.RootElement.GetProperty("body").GetString() ?? "Nội dung mặc định (lỗi parsing).";
                // Trích xuất metaDescription
                var metaDescription = jsonDoc.RootElement.GetProperty("metaDescription").GetString() ?? "Meta description mặc định (lỗi parsing).";

                return (title, body, metaDescription); // Trả về metaDescription
            }
            catch (JsonException jsonEx)
            {
                _logger.LogError(jsonEx,
                "Failed to parse JSON response from Gemini. Raw text was: {GeneratedText}",
                generatedText);
                throw;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An exception occurred while generating content with Gemini.");
            var placeholderTitle = request.BlogType == "product" ? request.ProductDetails?.ProductName : request.TopicDetails?.ArticleTitle;
            // Thêm placeholder cho metaDescription trong trường hợp lỗi
            return (placeholderTitle ?? "Lỗi Tiêu đề", $"Lỗi xảy ra khi tạo nội dung bằng AI. Vui lòng thử lại. Nội dung placeholder cho: {placeholderTitle}", "Lỗi tạo meta description.");
        }
    }

    private static string StripCodeFences(string text)
    {
        var clean = text.Trim();
        if (clean.StartsWith("```json"))
        {
            clean = clean.Substring(7).Trim();
        }
        if (clean.EndsWith("```"))
        {
            clean = clean.Substring(0, clean.Length - 3).Trim();
        }
        return clean;
    }

    private string BuildPrompt(BlogRequest request)
    {
        var promptBuilder = new System.Text.StringBuilder();
        // Thay đổi lời mở đầu để chuyên nghiệp hơn
        promptBuilder.AppendLine("Bạn là một chuyên gia content marketing giàu kinh nghiệm của công ty thang máy JP TechLift, người có khả năng viết các bài blog chuyên nghiệp, hấp dẫn và tối ưu hóa SEO vượt trội.");
        promptBuilder.AppendLine("Mục tiêu là tạo ra một bài blog chất lượng cao, cung cấp giá trị cho người đọc, khuyến khích tương tác và tăng cường thứ hạng trên các công cụ tìm kiếm.");
        promptBuilder.AppendLine("Bài viết phải có cấu trúc rõ ràng, dễ đọc, sử dụng các thẻ HTML (`<p>`, `<h2>`, `<h3>`, `<ul>`, `<li>`) một cách hợp lý để định dạng.");
        promptBuilder.AppendLine("Tích hợp tự nhiên các `Từ khóa SEO` đã cung cấp vào tiêu đề, các tiêu đề phụ và nội dung.");
        promptBuilder.AppendLine("Văn phong phải nhất quán với `ToneOfVoice` đã chỉ định.");

        if (request.BlogType == "product" && request.ProductDetails != null)
        {
            var p = request.ProductDetails;
            promptBuilder.AppendLine("\n- Loại bài viết: Giới thiệu sản phẩm");
            promptBuilder.AppendLine($"- Tên sản phẩm: \"{p.ProductName}\"");
            promptBuilder.AppendLine($"- Loại sản phẩm: {p.ProductType}");
            promptBuilder.AppendLine($"- Chi tiết sản phẩm: {p.Detail}");
            promptBuilder.AppendLine($"- Đối tượng khách hàng: {p.TargetAudience}");
            promptBuilder.AppendLine($"- Lợi ích chính: {p.KeySellingPoints}");
            promptBuilder.AppendLine($"- Từ khóa SEO: {p.SeoKeywords}");
            promptBuilder.AppendLine($"- Văn phong: {p.ToneOfVoice}");
            promptBuilder.AppendLine("\nCấu trúc bài viết cần bao gồm:");
            promptBuilder.AppendLine("  -   **Mở đầu (`<h2>`):** Giới thiệu vấn đề khách hàng thường gặp và cách sản phẩm thang máy của JP TechLift là giải pháp hoàn hảo.");
            promptBuilder.AppendLine("  -   **Điểm nổi bật của sản phẩm (`<h2>`):** Trình bày chi tiết các tính năng và công nghệ vượt trội của sản phẩm dựa trên `Chi tiết sản phẩm` và `Lợi ích chính`. Sử dụng `<ul>` hoặc `<li>` khi liệt kê.");
            promptBuilder.AppendLine("  -   **Lợi ích cho `Đối tượng khách hàng` của bạn (`<h2>`):** Giải thích cụ thể sản phẩm mang lại giá trị gì cho đối tượng mục tiêu.");
            promptBuilder.AppendLine("  -   **Tại sao chọn JP TechLift? (`<h2>`):** Nêu bật uy tín, chất lượng dịch vụ và cam kết của công ty.");
            promptBuilder.AppendLine("  -   **Lời kêu gọi hành động (`<h2>`):** Khuyến khích độc giả tìm hiểu thêm, liên hệ tư vấn hoặc yêu cầu báo giá.");
        }
        else if (request.BlogType == "topic" && request.TopicDetails != null)
        {
            var t = request.TopicDetails;
            promptBuilder.AppendLine("\n- Loại bài viết: Phân tích chủ đề");
            promptBuilder.AppendLine($"- Tiêu đề mong muốn: \"{t.ArticleTitle}\"");
            promptBuilder.AppendLine($"- Đối tượng độc giả: {t.TargetAudience}");
            promptBuilder.AppendLine($"- Các ý chính cần triển khai: {t.MainPoints}");
            promptBuilder.AppendLine($"- Từ khóa SEO: {t.SeoKeywords}");
            promptBuilder.AppendLine($"- Văn phong: {t.ToneOfVoice}");
            promptBuilder.AppendLine("\nCấu trúc bài viết cần bao gồm:");
            promptBuilder.AppendLine("  -   **Mở đầu (`<h2>`):** Giới thiệu chủ đề, tạo sự hấp dẫn và nêu rõ mục tiêu của bài viết.");
            promptBuilder.AppendLine("  -   **Phân tích các ý chính (`<h2>`):** Phát triển các `Các ý chính cần triển khai` thành các phần rõ ràng, mỗi phần có thể dùng `<h3>` làm tiêu đề phụ. Cung cấp thông tin chuyên sâu và đáng tin cậy.");
            promptBuilder.AppendLine("  -   **Giải quyết vấn đề của `Đối tượng độc giả` (`<h2>`):** Liên hệ chủ đề với các mối quan tâm và câu hỏi của đối tượng mục tiêu.");
            promptBuilder.AppendLine("  -   **Kết luận (`<h2>`):** Tóm tắt các điểm chính và đưa ra cái nhìn tổng quan hoặc dự đoán.");
            promptBuilder.AppendLine("  -   **Lời kêu gọi hành động (`<h2>`):** Khuyến khích độc giả chia sẻ, bình luận hoặc khám phá các dịch vụ liên quan của JP TechLift.");
        }

        promptBuilder.AppendLine("\nYÊU CẦU ĐẦU RA: Vui lòng trả lời bằng một chuỗi JSON hợp lệ và CHỈ JSON mà thôi, không có giải thích hay ký tự ``` nào. Cấu trúc JSON phải như sau:");
        promptBuilder.AppendLine("{");
        promptBuilder.AppendLine("  \"title\": \"Một tiêu đề cuối cùng, hấp dẫn, chuẩn SEO (khoảng 50-60 ký tự) cho bài viết\",");
        promptBuilder.AppendLine("  \"body\": \"Nội dung đầy đủ của bài viết ở đây. Sử dụng các thẻ HTML cơ bản như <p>, <h2>, <ul>, <li> để định dạng văn bản cho dễ đọc.\",");
        promptBuilder.AppendLine("  \"metaDescription\": \"Một mô tả ngắn gọn, hấp dẫn, chứa từ khóa chính (khoảng 150-160 ký tự) cho mục đích SEO.\""); // Thêm metaDescription
        promptBuilder.AppendLine("}");

        return promptBuilder.ToString();
    }
}