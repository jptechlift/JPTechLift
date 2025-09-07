using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Backend.Services;

public class EmailService
{
    private readonly ILogger<EmailService> _logger;
    private readonly IConfiguration _config;

    public EmailService(ILogger<EmailService> logger, IConfiguration config)
    {
        _logger = logger;
        _config = config;
    }

    public async Task SendAsync(string to, string subject, string token)
    {
        var host = _config["Smtp:Host"];
        var user = _config["Smtp:User"];
        var pass = _config["Smtp:Pass"];
        var from = _config["Smtp:From"] ?? user;
        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(pass))
        {
            _logger.LogWarning("SMTP configuration missing. Email not sent.");
            return;
        }

        var port = int.TryParse(_config["Smtp:Port"], out var p) ? p : 25;
        var appUrl = _config["Application:Url"] ?? string.Empty;
        var link = $"{appUrl}/api/auth/verify-email?token={token}";

        using var client = new SmtpClient(host, port)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(user, pass),
        };

        var message = new MailMessage(from, to, subject, $"Verify your email: {link}");
        await client.SendMailAsync(message);
    }
}