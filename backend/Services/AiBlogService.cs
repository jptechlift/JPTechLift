// backend/Services/AiBlogService.cs

using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration; // Thêm using này
using Microsoft.Extensions.Logging;       // Thêm using này để log lỗi

namespace Backend.Services;

public class AiBlogService
{
    // BƯỚC 1: Khai báo các phụ thuộc dưới dạng readonly fields
    private readonly HttpClient _httpClient;
    private readonly string? _apiKey;
    private readonly ILogger<AiBlogService> _logger;

    // BƯỚC 2: Sử dụng constructor để nhận các phụ thuộc (Dependency Injection)
    public AiBlogService(HttpClient httpClient, IConfiguration configuration, ILogger<AiBlogService> logger)
    {
        _httpClient = httpClient;
        // Đọc key từ hệ thống configuration, không phải trực tiếp từ biến môi trường
        _apiKey = configuration["GEMINI_API_KEY"]; 
        _logger = logger;
    }

    public async Task<string> GenerateContentAsync(string title)
    {
        if (string.IsNullOrWhiteSpace(_apiKey))
        {
            _logger.LogWarning("GEMINI_API_KEY is not configured. Returning placeholder content.");
            return $"Đây là nội dung placeholder cho chủ đề: {title}";
        }

        var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={_apiKey}";
        var body = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = $"Hãy viết một bài blog chi tiết và chuyên nghiệp về chủ đề sau: {title}" } } }
            }
        };

        try
        {
            var response = await _httpClient.PostAsJsonAsync(url, body);
            
            // Log chi tiết hơn khi có lỗi
            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                _logger.LogError("Gemini API request failed with status {StatusCode}. Response: {ErrorBody}", response.StatusCode, errorBody);
                // Ném ra một exception cụ thể hơn nếu muốn
                response.EnsureSuccessStatusCode(); 
            }

            using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
            var text = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return text ?? $"Nội dung placeholder (lỗi parsing) cho: {title}";
        }
        catch (Exception ex)
        {
            // BƯỚC 3: Ghi log lỗi để dễ dàng debug
            _logger.LogError(ex, "An exception occurred while calling Gemini API for title: {Title}", title);
            return $"Nội dung placeholder (lỗi hệ thống) cho: {title}";
        }
    }
}