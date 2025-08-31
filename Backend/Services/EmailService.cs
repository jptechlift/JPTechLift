using Microsoft.Extensions.Logging;

namespace Backend.Services;

public class EmailService
{
    private readonly ILogger<EmailService> _logger;

    public EmailService(ILogger<EmailService> logger)
    {
        _logger = logger;
    }

    public Task SendAsync(string to, string subject, string body)
    {
        _logger.LogInformation("Sending email to {To} with subject {Subject}", to, subject);
        return Task.CompletedTask;
    }
}