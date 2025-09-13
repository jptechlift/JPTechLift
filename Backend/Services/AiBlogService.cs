using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Linq;
using Backend.Dtos.Blog;
using Backend.Helpers;
using DocumentFormat.OpenXml.Packaging;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenXmlPowerTools;
using UglyToad.PdfPig;
using System.Net; 

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


   #region === PHẦN MÃ ĐƯỢC CẬP NHẬT CHO VIỆC TRÍCH XUẤT TỪ DOCUMENT ===

/// <summary>
/// Trích xuất nội dung từ một tài liệu được tải lên (.docx, .pdf, .txt)
/// một cách CHÍNH XÁC, không sử dụng AI để sáng tạo nội dung.
/// </summary>
public async Task<(string Title, string Slug, string Content, string MetaDescription)> GenerateFromDocumentAsync(IFormFile file)
{
    if (file == null || file.Length == 0)
    {
        throw new ArgumentException("Không có file nào được tải lên.", nameof(file));
    }

    string title;
    string contentHtml;
    var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

    await using var memoryStream = new MemoryStream();
    await file.CopyToAsync(memoryStream);
    memoryStream.Position = 0;

    try
    {
        switch (fileExtension)
        {
            case ".docx":
                string rawHtml = ExtractHtmlFromDocx(memoryStream);
                (title, contentHtml) = ProcessDocxHtml(rawHtml); // Sử dụng phương thức xử lý DOCX chuyên dụng
                break;
            case ".pdf":
            case ".txt":
                string plainText = fileExtension == ".pdf" 
                    ? ExtractTextFromPdf(memoryStream) 
                    : await new StreamReader(memoryStream).ReadToEndAsync();
                (title, contentHtml) = ExtractTitleAndContentFromPlainText(plainText); // Sử dụng phương thức xử lý text
                break;
            default:
                throw new NotSupportedException("Định dạng file không được hỗ trợ. Vui lòng sử dụng .docx, .pdf, hoặc .txt.");
        }
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Lỗi xảy ra trong quá trình trích xuất nội dung từ file {FileName}", file.FileName);
        throw new InvalidOperationException("Không thể xử lý file. File có thể bị hỏng hoặc không đúng định dạng.", ex);
    }

    if (string.IsNullOrWhiteSpace(contentHtml))
    {
        throw new InvalidOperationException("Không thể trích xuất nội dung từ file. File có thể trống.");
    }

    var slug = SlugHelper.GenerateSlug(title);
    var metaDescription = CreateMetaDescription(contentHtml, 160);

    return (title, slug, contentHtml, metaDescription);
}

/// <summary>
/// Chuyển đổi một file DOCX trong stream thành một chuỗi HTML thô.
/// </summary>
private string ExtractHtmlFromDocx(Stream docxStream)
{
    byte[] byteArray = new byte[docxStream.Length];
    docxStream.Read(byteArray, 0, byteArray.Length);

    using (MemoryStream memStream = new MemoryStream())
    {
        memStream.Write(byteArray, 0, byteArray.Length);
        using (WordprocessingDocument wDoc = WordprocessingDocument.Open(memStream, true))
        {
            var settings = new HtmlConverterSettings();
            XElement html = HtmlConverter.ConvertToHtml(wDoc, settings);
            return html.ToString();
        }
    }
}

/// <summary>
/// Xử lý HTML thô từ DOCX: Tách tiêu đề, dọn dẹp và tái cấu trúc nội dung.
/// </summary>
/// <summary>
/// Xử lý HTML thô từ DOCX: Tách tiêu đề, dọn dẹp và tái cấu trúc nội dung.
/// Phiên bản nâng cấp để nhận diện heading và list thông minh hơn.
/// </summary>
/// <summary>
/// Xử lý HTML thô từ DOCX: Tách tiêu đề, dọn dẹp và tái cấu trúc nội dung.
/// PHIÊN BẢN NÂNG CẤP TOÀN DIỆN để tạo ra HTML có cấu trúc (h2, h3, ul, strong).
/// </summary>
/// <summary>
/// Xử lý HTML thô từ DOCX: Tách tiêu đề, dọn dẹp và tái cấu trúc nội dung.
/// PHIÊN BẢN HOÀN CHỈNH: Có khả năng loại bỏ các ký tự điều khiển vô hình.
/// </summary>
/// <summary>
/// Xử lý HTML thô từ DOCX: Tách tiêu đề, dọn dẹp và tái cấu trúc nội dung.
/// PHIÊN BẢN CUỐI CÙNG: Sử dụng quy tắc nhận diện heading dựa trên bookmark (thẻ <a> rỗng).
/// </summary>
/// <summary>
/// Xử lý HTML thô từ DOCX: Tách tiêu đề, dọn dẹp và tái cấu trúc nội dung.
/// PHIÊN BẢN CUỐI CÙNG (ĐÃ SỬA LỖI CS1061): Sử dụng cú pháp chính xác của HtmlAgilityPack.
/// </summary>
private (string Title, string ContentHtml) ProcessDocxHtml(string rawHtml)
{
    var doc = new HtmlDocument();
    doc.LoadHtml(rawHtml);

    // 1. Tách tiêu đề chính
    var titleNode = doc.DocumentNode.SelectSingleNode("//h1|//p[string-length(normalize-space(.)) > 0]");
    string title = titleNode != null ? CleanAndDecodeText(titleNode.InnerText) : "Tiêu đề không xác định";
    titleNode?.Remove();

    // 2. Lấy body và dọn dẹp thuộc tính không cần thiết
    var bodyNode = doc.DocumentNode.SelectSingleNode("//body");
    if (bodyNode == null) return (title, string.Empty);

    foreach (var node in bodyNode.SelectNodes("//*[@style or @class or @dir or @lang]"))
    {
        node.Attributes.Remove("style");
        node.Attributes.Remove("class");
        node.Attributes.Remove("dir");
        node.Attributes.Remove("lang");
    }

    var newContent = new StringBuilder();
    var nodes = bodyNode.SelectNodes("./*")?.ToList() ?? new List<HtmlNode>();

    for (int i = 0; i < nodes.Count; i++)
    {
        var node = nodes[i];
        if (node.Name != "p")
        {
            newContent.AppendLine(node.OuterHtml);
            continue;
        }

        string cleanInnerText = CleanAndDecodeText(node.InnerText);
        if (string.IsNullOrWhiteSpace(cleanInnerText)) continue;

        // QUY TẮC 1: NHẬN DIỆN HEADING (H2) DỰA VÀO THẺ <a> RỖNG (BOOKMARK)
        var anchorNode = node.SelectSingleNode("./a");

        // DÒNG CODE ĐÃ ĐƯỢC SỬA LỖI TẠI ĐÂY
        if (anchorNode != null && string.IsNullOrWhiteSpace(anchorNode.InnerText) && anchorNode.Attributes["href"] == null)
        {
            newContent.AppendLine($"<h2>{WebUtility.HtmlEncode(cleanInnerText)}</h2>");
            continue;
        }

        // QUY TẮC 2: NHẬN DIỆN DANH SÁCH (UL/OL)
        if (IsListItem(node, cleanInnerText, out string listType, out string cleanHtml))
        {
            newContent.AppendLine($"<{listType}>");
            newContent.AppendLine($"  <li>{cleanHtml}</li>");

            // Gom các mục danh sách liền kề
            while (i + 1 < nodes.Count)
            {
                var nextNode = nodes[i + 1];
                string nextCleanInnerText = CleanAndDecodeText(nextNode.InnerText);
                if (IsListItem(nextNode, nextCleanInnerText, out string nextListType, out string nextCleanHtml) && nextListType == listType)
                {
                    i++;
                    newContent.AppendLine($"  <li>{nextCleanHtml}</li>");
                }
                else
                {
                    break;
                }
            }
            newContent.AppendLine($"</{listType}>");
            continue;
        }

        // MẶC ĐỊNH: Là đoạn văn bản <p> bình thường
        // Loại bỏ thẻ <a> rỗng không cần thiết
        if (anchorNode != null && string.IsNullOrWhiteSpace(anchorNode.InnerText) && anchorNode.Attributes["href"] == null)
        {
             anchorNode.Remove();
        }
        newContent.AppendLine(node.OuterHtml);
    }

    return (title, newContent.ToString());
}

// Các hàm phụ trợ CleanAndDecodeText và IsListItem giữ nguyên như phiên bản trước.
// Bạn không cần thay đổi chúng.
/// <summary>
/// Hàm phụ quan trọng: Giải mã HTML entities và loại bỏ tất cả các ký tự điều khiển Unicode.
/// </summary>
private string CleanAndDecodeText(string inputText)
{
    if (string.IsNullOrEmpty(inputText)) return "";
    // 1. Giải mã các ký tự HTML như &amp;
    string decodedText = WebUtility.HtmlDecode(inputText);
    // 2. Sử dụng Regex để loại bỏ tất cả các ký tự trong danh mục "Control" (C) của Unicode
    return Regex.Replace(decodedText, @"\p{C}", "").Trim();
}

/// <summary>
/// Hàm phụ kiểm tra node <p> có phải là một mục trong danh sách không.
/// Sử dụng văn bản đã được làm sạch để kiểm tra.
/// </summary>
private bool IsListItem(HtmlNode node, string cleanInnerText, out string listType, out string cleanedInnerHtml)
{
    listType = null;
    cleanedInnerHtml = node.InnerHtml; 

    if (node.Name != "p") return false;

    var ulMatch = Regex.Match(cleanInnerText, @"^[●○\-*]\s*");
    if (ulMatch.Success)
    {
        listType = "ul";
        cleanedInnerHtml = Regex.Replace(node.InnerHtml, @"^\s*[●○\-*]\s*", "").Trim();
        return true;
    }
    
    // Xử lý cho danh sách con như "○ Máy tính: FPT"
    var olSubMatch = Regex.Match(cleanInnerText, @"^[○]\s*");
    if (olSubMatch.Success)
    {
        listType = "ul"; // Coi danh sách con cũng là <ul>
        cleanedInnerHtml = Regex.Replace(node.InnerHtml, @"^\s*[○]\s*", "").Trim();
        return true;
    }

    return false;
}

/// <summary>
/// Trích xuất toàn bộ văn bản thô từ một file PDF trong stream.
/// </summary>
private string ExtractTextFromPdf(Stream pdfStream)
{
    var textBuilder = new StringBuilder();
    using (var pdfDocument = PdfDocument.Open(pdfStream))
    {
        foreach (var page in pdfDocument.GetPages())
        {
            textBuilder.AppendLine(page.Text);
        }
    }
    return textBuilder.ToString();
}

/// <summary>
/// Xử lý văn bản thô (từ PDF/TXT) để tách tiêu đề và nội dung.
/// </summary>
private (string Title, string ContentHtml) ExtractTitleAndContentFromPlainText(string plainText)
{
    var lines = plainText.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None)
                          .SkipWhile(string.IsNullOrWhiteSpace).ToList();
    if (!lines.Any()) return ("Tiêu đề không xác định", "");

    string title = lines.First().Trim();
    var bodyLines = lines.Skip(1);
    var contentBuilder = new StringBuilder();
    foreach (var line in bodyLines)
    {
        if (string.IsNullOrWhiteSpace(line)) continue;
        contentBuilder.Append($"<p>{WebUtility.HtmlEncode(line.Trim())}</p>\n");
    }
    return (title, contentBuilder.ToString());
}

/// <summary>
/// Tạo một meta description ngắn gọn từ nội dung HTML.
/// </summary>
private string CreateMetaDescription(string htmlContent, int maxLength)
{
    if (string.IsNullOrEmpty(htmlContent)) return "";
    var plainText = Regex.Replace(htmlContent, "<.*?>", string.Empty);
    plainText = WebUtility.HtmlDecode(plainText);
    plainText = Regex.Replace(plainText.Trim(), @"\s+", " ");
    if (plainText.Length <= maxLength) return plainText;
    int lastSpace = plainText.LastIndexOf(' ', maxLength);
    if (lastSpace > 0) return plainText.Substring(0, lastSpace) + "...";
    return plainText.Substring(0, maxLength) + "...";
}

#endregion


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