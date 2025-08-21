namespace Backend.Services;

public class AiBlogService
{
    public Task<string> GenerateContentAsync(string title)
    {
        // Placeholder AI generation
        return Task.FromResult($"Generated content for {title}");
    }
}
