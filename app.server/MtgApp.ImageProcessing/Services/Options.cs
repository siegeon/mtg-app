namespace MtgApp.ImageProcessing.Services;

public class OpenAIOptions
{
    public const string SectionName = "OpenAI";

    public string ApiKey { get; set; } = string.Empty;
    public string Model { get; set; } = "gpt-4-vision-preview";
    public string OrganizationId { get; set; } = string.Empty;
    public int MaxTokens { get; set; } = 4096;
    public double Temperature { get; set; } = 0.1;
}

public class AzureVisionOptions
{
    public const string SectionName = "AzureVision";

    public string Endpoint { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string ApiVersion { get; set; } = "2023-02-01-preview";
    public int TimeoutSeconds { get; set; } = 30;
}

public class ScryfallOptions
{
    public const string SectionName = "Scryfall";

    public string BaseUrl { get; set; } = "https://api.scryfall.com/";
    public int RateLimitDelayMs { get; set; } = 100; // Scryfall recommends 50-100ms between requests
    public int MaxRetries { get; set; } = 3;
    public string UserAgent { get; set; } = "MTG-App-ImageProcessing/1.0";
}