using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;

namespace Backend.Services;

public record GoogleUserInfo(string Email, string Name, string Subject, bool EmailVerified);

/// <summary>
/// Validates Google ID tokens and extracts basic profile information.
/// </summary>
public class GoogleAuthService
{
    private readonly string _clientId;

    public GoogleAuthService(IConfiguration configuration)
    {
        _clientId =
            configuration["Google:ClientId"]
            ?? throw new InvalidOperationException("Google client ID not configured");
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
