using System;
using System.Threading.Tasks;
using Google.Apis.Auth;

namespace Backend.Services;

public record GoogleUserInfo(string Email, string Name, string Subject, bool EmailVerified);

public class GoogleAuthService
{
    private readonly string _clientId;

    public GoogleAuthService()
    {
        // Đọc trực tiếp biến môi trường lúc khởi tạo
        _clientId =
            Environment.GetEnvironmentVariable("Google__ClientId")
            ?? throw new InvalidOperationException(
                "Google__ClientId is missing. Check your .env file."
            );
    }

    public async Task<GoogleUserInfo> ValidateAsync(string idToken)
    {
        var payload = await GoogleJsonWebSignature.ValidateAsync(
            idToken,
            new GoogleJsonWebSignature.ValidationSettings { Audience = new[] { _clientId } }
        );

        return new GoogleUserInfo(
            payload.Email,
            payload.Name ?? payload.Email,
            payload.Subject,
            payload.EmailVerified
        );
    }
}
