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
        if (string.IsNullOrWhiteSpace(_apiKey))
        {
            _logger.LogWarning("GEMINI_API_KEY is not configured. Returning placeholder content for document upload.");
            return ("Tiêu đề Placeholder từ tài liệu", Helpers.SlugHelper.GenerateSlug("Tiêu đề Placeholder từ tài liệu"), "Đây là nội dung placeholder từ tài liệu được tải lên.", "Meta description placeholder từ tài liệu.");
        }

        // Bước 1: Trích xuất Toàn bộ văn bản gốc (thô) từ file PDF/DOCX
        var (_, documentText) = await ExtractTitleAndTextFromFile(file);

        if (string.IsNullOrWhiteSpace(documentText))
        {
            _logger.LogWarning("Extracted text from document was empty.");
            throw new InvalidOperationException("Không thể trích xuất văn bản từ tài liệu hoặc tài liệu trống.");
        }

        string finalTitleFromDocument = "Tiêu đề tài liệu không xác định"; // Tiêu đề lấy từ dòng đầu tiên của tài liệu
        string rawDocumentContentExcludingTitle = string.Empty; // Phần còn lại của tài liệu sau khi lấy tiêu đề

        // Phân tích documentText dòng theo dòng để tìm dòng không rỗng đầu tiên
        var rawLines = documentText.Split(new[] { '\r', '\n' }, StringSplitOptions.None);

        int firstNonEmptyLineIndex = -1;
        for (int i = 0; i < rawLines.Length; i++)
        {
            if (!string.IsNullOrWhiteSpace(rawLines[i]))
            {
                firstNonEmptyLineIndex = i;
                break;
            }
        }

        if (firstNonEmptyLineIndex != -1)
        {
            // Lấy dòng không rỗng đầu tiên làm tiêu đề, chỉ trim khoảng trắng ở đầu/cuối
            finalTitleFromDocument = rawLines[firstNonEmptyLineIndex].Trim();

            // Lấy phần còn lại của documentText để làm nội dung body, giữ nguyên cấu trúc dòng gốc
            StringBuilder bodyContentRawBuilder = new StringBuilder();
            for (int i = 0; i < rawLines.Length; i++)
            {
                if (i != firstNonEmptyLineIndex) // Bỏ qua dòng đã được dùng làm tiêu đề gốc
                {
                    bodyContentRawBuilder.AppendLine(rawLines[i]);
                }
            }
            rawDocumentContentExcludingTitle = bodyContentRawBuilder.ToString().Trim(); // Trim toàn bộ phần body sau khi ghép
        }
        else
        {
            // Trường hợp tài liệu chỉ chứa khoảng trắng hoặc rỗng
            finalTitleFromDocument = "Tài liệu trống hoặc không có tiêu đề rõ ràng.";
            rawDocumentContentExcludingTitle = documentText.Trim(); // Nếu không tìm thấy tiêu đề, toàn bộ là nội dung
        }

        // --- XÂY DỰNG PROMPT CHO AI ĐỂ TẠO CẢ TIÊU ĐỀ, NỘI DUNG CÓ CẤU TRÚC VÀ META DESCRIPTION ---
        var promptBuilder = new StringBuilder();
        promptBuilder.AppendLine("Bạn là một chuyên gia content marketing giàu kinh nghiệm của công ty thang máy JP TechLift, người có khả năng viết các bài blog chuyên nghiệp, hấp dẫn và tối ưu hóa SEO vượt trội.");
        promptBuilder.AppendLine("Mục tiêu là tạo ra một bài blog chất lượng cao, cung cấp giá trị cho người đọc, khuyến khích tương tác và tăng cường thứ hạng trên các công cụ tìm kiếm.");
        promptBuilder.AppendLine("Sử dụng nội dung được cung cấp dưới đây làm nguồn thông tin chính để triển khai bài viết. KHÔNG thêm thông tin nào nằm ngoài nội dung được cung cấp, trừ khi đó là các yếu tố cấu trúc blog chung như lời mở đầu, kết luận, lời kêu gọi hành động hoặc câu chuyển tiếp.");
        promptBuilder.AppendLine("Bài viết phải có cấu trúc rõ ràng, dễ đọc, sử dụng các thẻ HTML (`<p>`, `<h2>`, `<h3>`, `<ul>`, `<li>`) một cách hợp lý để định dạng.");
        promptBuilder.AppendLine("Văn phong phải chuyên nghiệp, tin cậy, và hấp dẫn.");
        promptBuilder.AppendLine("Giữ độ dài tiêu đề từ 50-60 ký tự, và meta description từ 150-160 ký tự.");

        if (!string.IsNullOrWhiteSpace(finalTitleFromDocument) && finalTitleFromDocument != "Tài liệu trống hoặc không có tiêu đề rõ ràng.")
        {
            promptBuilder.AppendLine($"\nChủ đề chính ban đầu (từ dòng đầu tiên của tài liệu): \"{finalTitleFromDocument}\"");
        }
        else
        {
            promptBuilder.AppendLine("\nChủ đề bài viết sẽ được AI tự xác định từ nội dung tài liệu.");
        }


        promptBuilder.AppendLine("\nCấu trúc bài viết cần bao gồm:");
        promptBuilder.AppendLine("  -   **Mở đầu (`<h2>`):** Giới thiệu chủ đề dựa trên thông tin được cung cấp trong tài liệu. Tạo sự hấp dẫn và nêu rõ mục tiêu của bài viết.");
        promptBuilder.AppendLine("  -   **Phân tích các ý chính (`<h2>`):** Phát triển các nội dung quan trọng từ tài liệu thành các phần rõ ràng, mỗi phần có thể dùng `<h3>` làm tiêu đề phụ. Cung cấp thông tin chuyên sâu và đáng tin cậy DỰA TRÊN TÀI LIỆU.");
        promptBuilder.AppendLine("  -   **Giải quyết vấn đề hoặc Lợi ích liên quan (`<h2>`):** Liên hệ nội dung tài liệu với các mối quan tâm, câu hỏi, hoặc lợi ích mà người đọc có thể nhận được (nếu phù hợp với ngữ cảnh của tài liệu).");
        promptBuilder.AppendLine("  -   **Kết luận (`<h2>`):** Tóm tắt các điểm chính và đưa ra cái nhìn tổng quan hoặc dự đoán dựa trên tài liệu.");
        promptBuilder.AppendLine("  -   **Lời kêu gọi hành động (`<h2>`):** Khuyến khích độc giả tìm hiểu thêm, liên hệ tư vấn hoặc khám phá các dịch vụ liên quan của JP TechLift (nếu phù hợp với nội dung tài liệu).");

        promptBuilder.AppendLine("\nNỘI DUNG TỪ TÀI LIỆU ĐỂ BẠN PHÂN TÍCH VÀ PHÁT TRIỂN (Sử dụng đây làm nguồn thông tin chi tiết):");
        promptBuilder.AppendLine(rawDocumentContentExcludingTitle); // Gửi phần còn lại của tài liệu cho AI

        promptBuilder.AppendLine("\nYÊU CẦU ĐẦU RA: Vui lòng trả lời bằng một chuỗi JSON hợp lệ và CHỈ JSON mà thôi, không có giải thích hay ký tự ``` nào. Cấu trúc JSON phải như sau:");
        promptBuilder.AppendLine("{");
        promptBuilder.AppendLine("  \"title\": \"Một tiêu đề cuối cùng, hấp dẫn, chuẩn SEO (khoảng 50-60 ký tự) cho bài viết dựa trên tài liệu\",");
        promptBuilder.AppendLine("  \"body\": \"Nội dung đầy đủ của bài viết ở đây, được định dạng bằng các thẻ HTML như <p>, <h2>, <ul>, <li> và được phát triển từ nội dung tài liệu.\",");
        promptBuilder.AppendLine("  \"metaDescription\": \"Một mô tả ngắn gọn, hấp dẫn, chứa từ khóa chính và TUÂN THỦ NGHIÊM NGẶT độ dài 150-160 ký tự cho mục đích SEO.\"");
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

        string aiGeneratedTitle = string.Empty;
        string aiGeneratedBodyHtml = string.Empty;
        string aiGeneratedMetaDescription = string.Empty;

        try
        {
            _logger.LogInformation("Sending document-based prompt to Gemini API for full blog generation. Prompt length: {Length}", promptBuilder.Length);
            var response = await _httpClient.PostAsJsonAsync(url, payload);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                _logger.LogError("Gemini API (document-full-gen) request failed with status {StatusCode}. Response: {ErrorBody}", response.StatusCode, errorBody);
                // Handle gracefully, potentially returning placeholder or re-throwing a specific exception
            }
            else
            {
                var geminiResponse = await response.Content.ReadFromJsonAsync<GeminiResponse>();
                var generatedText = geminiResponse?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text;

                if (!string.IsNullOrWhiteSpace(generatedText))
                {
                    _logger.LogInformation("Successfully received and parsed content from Gemini API for document blog.");
                    try
                    {
                        var cleanJsonText = StripCodeFences(generatedText);
                        var jsonDoc = JsonDocument.Parse(cleanJsonText);

                        if (jsonDoc.RootElement.TryGetProperty("title", out JsonElement titleElement) && titleElement.ValueKind == JsonValueKind.String)
                        {
                            aiGeneratedTitle = titleElement.GetString() ?? string.Empty;
                        }
                        if (jsonDoc.RootElement.TryGetProperty("body", out JsonElement bodyElement) && bodyElement.ValueKind == JsonValueKind.String)
                        {
                            aiGeneratedBodyHtml = bodyElement.GetString() ?? string.Empty;
                        }
                        if (jsonDoc.RootElement.TryGetProperty("metaDescription", out JsonElement metaElement) && metaElement.ValueKind == JsonValueKind.String)
                        {
                            aiGeneratedMetaDescription = metaElement.GetString() ?? string.Empty;
                        }
                    }
                    catch (JsonException jsonEx)
                    {
                        _logger.LogError(jsonEx, "Failed to parse JSON response for document blog generation from Gemini. Raw text was: {GeneratedText}", generatedText);
                    }
                }
                else
                {
                    _logger.LogWarning("Gemini API (document-full-gen) returned a successful response, but the generated text was empty.");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An exception occurred while calling Gemini API for document blog generation.");
        }

        // --- FINALIZATION AND FALLBACK LOGIC ---
        string finalTitle = string.IsNullOrWhiteSpace(aiGeneratedTitle) ? finalTitleFromDocument : aiGeneratedTitle;
        string finalBodyHtml = string.IsNullOrWhiteSpace(aiGeneratedBodyHtml)
                               ? Markdig.Markdown.ToHtml($"# {finalTitleFromDocument}\n\n{rawDocumentContentExcludingTitle}") // Fallback to old behavior (Markdown to HTML) if AI body is empty
                               : aiGeneratedBodyHtml;
        string finalMetaDescription = aiGeneratedMetaDescription;

        // Ensure finalTitle is not empty for slug generation
        if (string.IsNullOrWhiteSpace(finalTitle))
        {
            finalTitle = "Tiêu đề Blog Từ Tài liệu";
        }

        string slug = Helpers.SlugHelper.GenerateSlug(finalTitle);


        // --- Robust fallback and length enforcement for Meta Description (Yêu cầu 2) ---
        string processedMetaDescription = finalMetaDescription;

        // If AI didn't provide a good meta description, generate from the (potentially AI-generated) body
        if (string.IsNullOrWhiteSpace(processedMetaDescription) || processedMetaDescription.Length < 150)
        {
            _logger.LogWarning("AI-generated meta description is too short or empty (length: {Length}). Attempting to generate/extend from document content.", processedMetaDescription.Length);

            // Use the *finalBodyHtml* as the source for meta description extension
            string sourceContentForExtension = finalBodyHtml; // Now using HTML body for context

            // Strip HTML tags for cleaner text for meta description generation
            string plainTextBody = System.Text.RegularExpressions.Regex.Replace(sourceContentForExtension, "<.*?>", String.Empty);
            plainTextBody = plainTextBody.Replace("&nbsp;", " ").Trim(); // Clean up common HTML entities

            StringBuilder tempBuilder = new StringBuilder(processedMetaDescription.Trim());

            if (!string.IsNullOrWhiteSpace(plainTextBody))
            {
                string snippet = plainTextBody;
                if (snippet.Length > 300)
                { // Take a larger snippet for better context
                    snippet = snippet.Substring(0, 300);
                }

                string[] sentences = snippet.Split(new[] { '.', '!', '?' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (string sentence in sentences)
                {
                    string trimmedSentence = sentence.Trim();
                    if (!string.IsNullOrWhiteSpace(trimmedSentence))
                    {
                        if (tempBuilder.Length + trimmedSentence.Length + 2 <= 160) // +2 for period and space
                        {
                            if (tempBuilder.Length > 0 && !tempBuilder.ToString().EndsWith(".")) tempBuilder.Append(".");
                            tempBuilder.Append(" ").Append(trimmedSentence);
                        }
                        else
                        {
                            break;
                        }
                    }
                }

                if (tempBuilder.Length < 150)
                {
                    string[] words = plainTextBody.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    foreach (string word in words)
                    {
                        if (tempBuilder.Length + word.Length + 1 <= 160) // +1 for space
                        {
                            if (tempBuilder.Length > 0) tempBuilder.Append(" ");
                            tempBuilder.Append(word);
                        }
                        else
                        {
                            break;
                        }
                    }
                }
            }
            processedMetaDescription = tempBuilder.ToString().Trim();

            // Fallback if still too short
            if (string.IsNullOrWhiteSpace(processedMetaDescription) || processedMetaDescription.Length < 50)
            {
                processedMetaDescription = finalTitle + ". Thông tin chi tiết về chủ đề này.";
            }
            else if (!processedMetaDescription.Contains(finalTitle, StringComparison.OrdinalIgnoreCase) && processedMetaDescription.Length < 120)
            {
                processedMetaDescription = finalTitle + ": " + processedMetaDescription;
            }
        }

        // Strictly enforce maximum length (160 chars)
        if (processedMetaDescription.Length > 160)
        {
            processedMetaDescription = processedMetaDescription.Substring(0, 160).Trim();
            int lastSpace = processedMetaDescription.LastIndexOf(' ');
            if (lastSpace > 0 && processedMetaDescription.Length > 150)
            {
                processedMetaDescription = processedMetaDescription.Substring(0, lastSpace).Trim() + "...";
            }
            else
            {
                processedMetaDescription = processedMetaDescription.Substring(0, Math.Min(processedMetaDescription.Length, 157)).Trim() + "...";
            }
        }

        // Final sanity check for minimum length and ending punctuation
        if (processedMetaDescription.Length < 150)
        {
            if (!processedMetaDescription.EndsWith(".") && !processedMetaDescription.EndsWith("!") && !processedMetaDescription.EndsWith("..."))
            {
                processedMetaDescription += ".";
            }
        }

        finalMetaDescription = processedMetaDescription;

        // Final comprehensive null/empty checks before returning
        if (string.IsNullOrWhiteSpace(finalTitle)) finalTitle = "Tiêu đề không xác định từ tài liệu";
        if (string.IsNullOrWhiteSpace(slug)) slug = Helpers.SlugHelper.GenerateSlug(finalTitle);
        if (string.IsNullOrWhiteSpace(finalBodyHtml)) finalBodyHtml = "Nội dung bài viết không có sẵn từ AI. Vui lòng kiểm tra lại tài liệu hoặc cấu hình AI.";
        if (string.IsNullOrWhiteSpace(finalMetaDescription))
        {
            finalMetaDescription = "Mô tả bài viết chi tiết về nội dung được cung cấp.";
            if (finalMetaDescription.Length < 80 && !string.IsNullOrWhiteSpace(finalTitle) && !finalMetaDescription.Contains(finalTitle, StringComparison.OrdinalIgnoreCase))
            {
                finalMetaDescription = finalTitle + ": " + finalMetaDescription;
            }
        }
        if (finalMetaDescription.Length > 160)
        {
            finalMetaDescription = finalMetaDescription.Substring(0, 157).Trim() + "...";
        }


        return (finalTitle, slug, finalBodyHtml, finalMetaDescription);
    }


    /// <summary>
    /// Extracts the full raw text from a document. The definitive title will be derived
    /// in GenerateFromDocumentAsync from the first non-empty line of this fullText.
    /// This method is now even more robust about preserving raw line structure.
    /// </summary>
    /// <param name="file">The uploaded document file.</param>
    /// <returns>A tuple containing a guess for title (no longer used) and the full document text.</returns>
    private async Task<(string title, string fullText)> ExtractTitleAndTextFromFile(IFormFile file)
    {
        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);
        memoryStream.Position = 0; // Reset stream position

        string fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        string fullText = string.Empty;
        string titleGuess = "Tiêu đề tài liệu không xác định (tạm thời)"; // Giá trị này không còn được dùng làm finalTitle

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
                        // RẤT QUAN TRỌNG: KHÔNG TRIM TOÀN BỘ CHUỖI ở đây để giữ nguyên tất cả các dòng gốc và khoảng trắng
                        fullText = textBuilder.ToString();
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
                        // RẤT QUAN TRỌNG: Lấy toàn bộ văn bản thô, KHÔNG TRIM
                        fullText = doc.Text;
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
        // Trả về fullText thô nhất có thể. titleGuess chỉ là placeholder.
        return (titleGuess, fullText);
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