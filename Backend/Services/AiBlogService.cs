using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Backend.Dtos.Blog; // Đảm bảo đường dẫn này đúng cho các DTO của bạn
using Microsoft.AspNetCore.Http; // Cho IFormFile
using System.IO; // Cho MemoryStream, Path
using System.Threading.Tasks;
using UglyToad.PdfPig; // Cho PDF
using Xceed.Words.NET; // Cho DOCX
using Backend.Helpers; // Để sử dụng SlugHelper
using System;
using System.Collections.Generic;
using System.Text;
using Markdig; // Dòng này RẤT QUAN TRỌNG để chuyển đổi Markdown sang HTML
using System.Text.RegularExpressions;

namespace Backend.Services;

// --- DTOs for structured communication with Gemini API ---
// GIỮ NGUYÊN - KHÔNG THAY ĐỔI
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
        _apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");
        _logger = logger;
    }

    /// <summary>
    /// Generates AI-assisted blog content based on structured request data.
    /// Phương thức này được giữ nguyên như ban đầu (tạo blog từ các tham số có cấu trúc)
    /// để tránh làm mất sự hoàn hảo vốn có của nó.
    /// </summary>
    /// <param name="request">The structured data for blog generation.</param>
    /// <returns>A tuple containing the generated Title, Content, and MetaDescription.</returns>
    public async Task<(string Title, string Content, string MetaDescription)> GenerateContentAsync(BlogRequest request)
    {
        if (string.IsNullOrWhiteSpace(_apiKey))
        {
            _logger.LogWarning("GEMINI_API_KEY is not configured. Returning placeholder content.");
            var placeholderTitle = request.BlogType == "product" ? request.ProductDetails?.ProductName : request.TopicDetails?.ArticleTitle;
            return (placeholderTitle ?? "Lỗi Tiêu đề", $"Đây là nội dung placeholder cho chủ đề: {placeholderTitle}", "Meta description placeholder.");
        }

        var model = "gemini-1.5-flash-latest";
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={_apiKey}";

        var prompt = BuildPrompt(request); // Sử dụng BuildPrompt hiện có cho BlogRequest
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
                throw new HttpRequestException($"Gemini API request failed. Status: {response.StatusCode}. Details: {errorBody}");
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
                var metaDescription = jsonDoc.RootElement.GetProperty("metaDescription").GetString() ?? "Meta description mặc định (lỗi parsing).";

                return (title, body, metaDescription);
            }
            catch (JsonException jsonEx)
            {
                _logger.LogError(jsonEx, "Failed to parse JSON response from Gemini. Raw text was: {GeneratedText}", generatedText);
                throw new InvalidOperationException("Failed to parse AI-generated JSON content. It may not be in the expected format.", jsonEx);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An exception occurred while generating content with Gemini.");
            var placeholderTitle = request.BlogType == "product" ? request.ProductDetails?.ProductName : request.TopicDetails?.ArticleTitle;
            return (placeholderTitle ?? "Lỗi Tiêu đề", $"Lỗi xảy ra khi tạo nội dung bằng AI. Vui lòng thử lại. Nội dung placeholder cho: {placeholderTitle}", "Lỗi tạo meta description.");
        }
    }


    /// <summary>
    /// Generates AI-assisted blog content based on an uploaded document (PDF/DOCX).
    /// This method is specifically designed to:
    /// 1. Extract the first non-empty line from the document as the initial title guess.
    /// 2. Use AI to generate a structured blog post (Title, HTML Body, Meta Description)
    ///    based on the extracted document content as source material.
    /// 3. Implement robust fallback and length enforcement for the Meta Description.
    /// 4. Generate a slug from the final title.
    /// </summary>
    /// <param name="file">The uploaded document file.</param>
    /// <returns>A tuple containing the generated Title, Slug, Content (formatted as HTML), and MetaDescription.</returns>
    public async Task<(string Title, string Slug, string Content, string MetaDescription)> GenerateFromDocumentAsync(IFormFile file)
    {
        var (extractedTitle, body) = await ExtractTitleAndTextFromFile(file);
        if (string.IsNullOrWhiteSpace(extractedTitle) && string.IsNullOrWhiteSpace(body))
        {
            _logger.LogWarning("Extracted text from document was empty.");
            throw new InvalidOperationException("Không thể trích xuất văn bản từ tài liệu hoặc tài liệu trống.");
        }

string title = string.IsNullOrWhiteSpace(extractedTitle)
            ? "Tài liệu trống hoặc không có tiêu đề rõ ràng."
            : extractedTitle.Trim();
        string slug = Helpers.SlugHelper.GenerateSlug(title);

        if (string.IsNullOrWhiteSpace(_apiKey))
        {
            string encodedBody = System.Net.WebUtility.HtmlEncode(body);
            string finalBodyHtmlFallback = encodedBody.Replace("\r\n", "<br/>").Replace("\n", "<br/>");
            string metaDescriptionFallback = body.Replace('\r', ' ').Replace('\n', ' ').Trim();
            return (title, slug, finalBodyHtmlFallback, metaDescriptionFallback);
        }

        var promptBuilder = new StringBuilder();
        promptBuilder.AppendLine("Bạn là một chuyên gia content marketing của công ty thang máy JP TechLift.");
        promptBuilder.AppendLine("Hãy sử dụng 100% nội dung dưới đây để soạn thành một bài blog HTML giữ nguyên thiết kế và cấu trúc của văn bản gốc.");
        promptBuilder.AppendLine("Không được thêm hoặc bớt bất kỳ thông tin nào ngoài việc định dạng lại.");
        promptBuilder.AppendLine("Tạo thêm một meta description hấp dẫn, chuyên nghiệp để thu hút người đọc.");
        promptBuilder.AppendLine("Nội dung gốc:");
        promptBuilder.AppendLine(body);
        promptBuilder.AppendLine("\nYÊU CẦU ĐẦU RA: Chỉ trả về chuỗi JSON với cấu trúc sau và không có ký tự thừa:");
        promptBuilder.AppendLine("{");
        promptBuilder.AppendLine("  \"body\": \"Nội dung bài viết dạng HTML\",");
        promptBuilder.AppendLine("  \"metaDescription\": \"Mô tả ngắn gọn hấp dẫn\"");
        promptBuilder.AppendLine("}");

        var model = "gemini-1.5-flash-latest";
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={_apiKey}";

        var payload = new GeminiRequest
        {
            Contents = new List<Content>
            {
                new Content { Parts = new List<Part> { new Part { Text = promptBuilder.ToString() } } }
            }
        };

        string aiBodyHtml = string.Empty;
        string aiMetaDescription = string.Empty;

        try
        {
 _logger.LogInformation("Sending document prompt to Gemini API. Prompt length: {Length}", promptBuilder.Length);
            var response = await _httpClient.PostAsJsonAsync(url, payload);

            if (response.IsSuccessStatusCode)
            {
                var geminiResponse = await response.Content.ReadFromJsonAsync<GeminiResponse>();
                var generatedText = geminiResponse?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text;

                if (!string.IsNullOrWhiteSpace(generatedText))
                {
                    try
                    {
                        var cleanJsonText = StripCodeFences(generatedText);
                        var jsonDoc = JsonDocument.Parse(cleanJsonText);
                        if (jsonDoc.RootElement.TryGetProperty("body", out JsonElement bodyEl) && bodyEl.ValueKind == JsonValueKind.String)
                        {
                            aiBodyHtml = bodyEl.GetString() ?? string.Empty;
                        }
                        if (jsonDoc.RootElement.TryGetProperty("metaDescription", out JsonElement metaEl) && metaEl.ValueKind == JsonValueKind.String)
                        {
                            aiMetaDescription = metaEl.GetString() ?? string.Empty;
                        }
                    }
                    catch (JsonException jsonEx)
                    {
                        _logger.LogError(jsonEx, "Failed to parse JSON response from Gemini. Raw text was: {GeneratedText}", generatedText);
                    }
                }
                else
                {
                    _logger.LogWarning("Gemini API returned empty text for document generation.");
                }
            }
            else
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                _logger.LogError("Gemini API request failed with status {StatusCode}. Response: {ErrorBody}", response.StatusCode, errorBody);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred while calling Gemini API for document generation.");
        }

        string finalBodyHtml = string.IsNullOrWhiteSpace(aiBodyHtml)
            ? System.Net.WebUtility.HtmlEncode(body).Replace("\r\n", "<br/>").Replace("\n", "<br/>")
            : aiBodyHtml;
        string finalMetaDescription = string.IsNullOrWhiteSpace(aiMetaDescription)
            ? body.Replace('\r', ' ').Replace('\n', ' ').Trim()
            : aiMetaDescription;

        return (title, slug, finalBodyHtml, finalMetaDescription);
    }


    /// <summary>
    /// Extracts the full raw text from a document. The definitive title will be derived
    /// in GenerateFromDocumentAsync from the first non-empty line of this fullText.
    /// This method is now even more robust about preserving raw line structure.
    /// </summary>
    /// <param name="file">The uploaded document file.</param>
    /// <returns>A tuple containing a guess for title (no longer used) and the full document text.</returns>
    private async Task<(string title, string body)> ExtractTitleAndTextFromFile(IFormFile file)
    {
        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);
        memoryStream.Position = 0; // Reset stream position

        string fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        string rawFullText = string.Empty;
        switch (fileExtension)
        {
            case ".pdf":
                try
                {
                    using (var pdfDocument = PdfDocument.Open(memoryStream))
                    {
                        var textBuilder = new StringBuilder();
                        foreach (var page in pdfDocument.GetPages())
                        {
                            textBuilder.AppendLine(page.Text);
                        }
                        // KHÔNG TRIM để giữ nguyên cấu trúc dòng và khoảng trắng
                        rawFullText = textBuilder.ToString();
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to extract text from PDF file.");
                    throw new InvalidOperationException("Failed to extract text from PDF file. Please ensure it's a valid PDF.");
                }
                break;

            case ".docx":
                try
                {
                    using (var doc = DocX.Load(memoryStream))
                    {
                        // Lấy toàn bộ văn bản thô, KHÔNG TRIM
                        rawFullText = doc.Text;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to extract text from DOCX file.");
                    throw new InvalidOperationException("Failed to extract text from DOCX file. Please ensure it's a valid DOCX.");
                }
                break;

            default:
                throw new InvalidOperationException("Unsupported file type for text extraction.");
        }
        if (string.IsNullOrWhiteSpace(rawFullText))
        {
            return (string.Empty, string.Empty);
        }

       rawFullText = rawFullText.TrimStart('\r', '\n');
        var match = Regex.Match(rawFullText, @"\r?\n\s*\r?\n");
        string title;
        string body;

        if (match.Success)
        {
             title = rawFullText.Substring(0, match.Index).Trim();
            int bodyStart = match.Index + match.Length;
            body = rawFullText.Substring(bodyStart);
        }
        else
        {
            title = rawFullText.Trim();
            body = string.Empty;
        }
        return (title, body);
    }


    private static string StripCodeFences(string text)
    {
        var clean = text.Trim();
        if (clean.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
        {
            clean = clean.Substring(7).Trim();
        }
        if (clean.EndsWith("```", StringComparison.OrdinalIgnoreCase))
        {
            clean = clean.Substring(0, clean.Length - 3).Trim();
        }
        return clean;
    }

    // PHƯƠNG THỨC BuildPrompt ĐƯỢC GIỮ NGUYÊN - Dành cho BlogRequest có cấu trúc
    private string BuildPrompt(BlogRequest request)
    {
        var promptBuilder = new System.Text.StringBuilder();
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
        promptBuilder.AppendLine("  \"metaDescription\": \"Một mô tả ngắn gọn, hấp dẫn, chứa từ khóa chính (khoảng 150-160 ký tự) cho mục đích SEO.\"");
        promptBuilder.AppendLine("}");

        return promptBuilder.ToString();
    }
}