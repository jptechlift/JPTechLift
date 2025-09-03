using System.Text.Json.Serialization;

namespace Backend.Services; 

// DTO để chứa phản hồi từ Google
public class RecaptchaResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("error-codes")]
    public List<string>? ErrorCodes { get; set; }
}

public class CaptchaService
{
    private readonly HttpClient _httpClient;
    private readonly string _secretKey;

    public CaptchaService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _secretKey = configuration["Recaptcha:SecretKey"] ?? 
                     Environment.GetEnvironmentVariable("RECAPTCHA_SECRET_KEY") ?? 
                     throw new InvalidOperationException("reCAPTCHA Secret Key not configured.");
    }

    public virtual async Task<bool> IsCaptchaValid(string? token)
    {
        if (string.IsNullOrEmpty(token))
        {
            return false;
        }

        try
        {
            var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                {"secret", _secretKey},
                {"response", token}
            });

            var response = await _httpClient.PostAsync("https://www.google.com/recaptcha/api/siteverify", content);
            response.EnsureSuccessStatusCode();

            var responseString = await response.Content.ReadAsStringAsync();
            var recaptchaResponse = System.Text.Json.JsonSerializer.Deserialize<RecaptchaResponse>(responseString);

            return recaptchaResponse?.Success ?? false;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error verifying reCAPTCHA: {ex.Message}");
            return false;
        }
    }
}