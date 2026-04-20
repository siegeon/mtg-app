using Microsoft.Extensions.Options;
using OpenAI.Chat;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using System.Diagnostics;
using System.Text.Json;

namespace MtgApp.ImageProcessing.Services;

public class ImageAnalysisService : IImageAnalysisService
{
    private readonly OpenAIOptions _openAiOptions;
    private readonly AzureVisionOptions _azureVisionOptions;
    private readonly ILogger<ImageAnalysisService> _logger;

    public ImageAnalysisService(
        IOptions<OpenAIOptions> openAiOptions,
        IOptions<AzureVisionOptions> azureVisionOptions,
        ILogger<ImageAnalysisService> logger)
    {
        _openAiOptions = openAiOptions.Value;
        _azureVisionOptions = azureVisionOptions.Value;
        _logger = logger;
    }

    public async Task<ImageAnalysisResult> AnalyzeImageAsync(Stream imageStream, string fileName, AiProvider provider = AiProvider.Auto)
    {
        var stopwatch = Stopwatch.StartNew();
        var result = new ImageAnalysisResult();

        try
        {
            // Get image metadata
            result.Metadata = await GetImageMetadataAsync(imageStream);

            // Choose provider
            var selectedProvider = provider == AiProvider.Auto ? AiProvider.OpenAI : provider;
            result.Provider = selectedProvider;

            // Reset stream position
            imageStream.Seek(0, SeekOrigin.Begin);

            // Analyze with selected provider
            result.DetectedCards = selectedProvider switch
            {
                AiProvider.OpenAI => await AnalyzeWithOpenAIAsync(imageStream, fileName),
                AiProvider.AzureVision => await AnalyzeWithAzureVisionAsync(imageStream, fileName),
                _ => throw new ArgumentOutOfRangeException(nameof(provider))
            };

            result.Success = true;
            _logger.LogInformation("Successfully analyzed image {FileName} with {Provider}, found {CardCount} cards",
                fileName, selectedProvider, result.DetectedCards.Count);
        }
        catch (Exception ex)
        {
            result.Success = false;
            result.ErrorMessage = ex.Message;
            _logger.LogError(ex, "Failed to analyze image {FileName} with provider {Provider}", fileName, provider);
        }
        finally
        {
            stopwatch.Stop();
            result.ProcessingDuration = stopwatch.Elapsed;
        }

        return result;
    }

    public async Task<List<CardDetection>> DetectCardsInImageAsync(Stream imageStream, string fileName, AiProvider provider = AiProvider.Auto)
    {
        var result = await AnalyzeImageAsync(imageStream, fileName, provider);
        return result.DetectedCards;
    }

    private async Task<List<CardDetection>> AnalyzeWithOpenAIAsync(Stream imageStream, string fileName)
    {
        if (string.IsNullOrEmpty(_openAiOptions.ApiKey))
        {
            throw new InvalidOperationException("OpenAI API key is not configured");
        }

        var detections = new List<CardDetection>();

        try
        {
            // Convert image to base64
            var imageBytes = new byte[imageStream.Length];
            await imageStream.ReadExactlyAsync(imageBytes);
            var base64Image = Convert.ToBase64String(imageBytes);

            // Create OpenAI client
            var client = new OpenAI.OpenAIClient(_openAiOptions.ApiKey);
            var chatClient = client.GetChatClient(_openAiOptions.Model);

            // Prepare the prompt
            var prompt = @"
You are an expert Magic: The Gathering card identifier. Analyze this binder page image and identify all visible MTG cards.

For each card you can identify, provide:
1. Card name (exact spelling)
2. Set code or set name (if visible)
3. Confidence level (0.0 to 1.0)
4. Bounding box coordinates (x, y, width, height as percentages of image dimensions)

Return the results as a JSON array with this structure:
[
  {
    ""name"": ""Lightning Bolt"",
    ""set"": ""M21"",
    ""confidence"": 0.95,
    ""boundingBox"": {
      ""x"": 0.1,
      ""y"": 0.2,
      ""width"": 0.25,
      ""height"": 0.35
    }
  }
]

Only include cards you can confidently identify. If you cannot see any cards clearly, return an empty array.
";

            var messages = new List<ChatMessage>
            {
                new UserChatMessage(
                    ChatMessageContentPart.CreateTextPart(prompt),
                    ChatMessageContentPart.CreateImagePart(
                        BinaryData.FromBytes(imageBytes),
                        "image/jpeg") // Assume JPEG for now, could detect format
                )
            };

            var options = new ChatCompletionOptions
            {
                MaxOutputTokenCount = _openAiOptions.MaxTokens,
                Temperature = (float)_openAiOptions.Temperature
            };

            var response = await chatClient.CompleteChatAsync(messages, options);
            var content = response.Value.Content[0].Text;

            // Parse JSON response
            if (!string.IsNullOrEmpty(content))
            {
                // Extract JSON from response (in case there's extra text)
                var jsonStart = content.IndexOf('[');
                var jsonEnd = content.LastIndexOf(']');

                if (jsonStart >= 0 && jsonEnd > jsonStart)
                {
                    var json = content.Substring(jsonStart, jsonEnd - jsonStart + 1);
                    var parsedDetections = JsonSerializer.Deserialize<List<OpenAICardDetection>>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (parsedDetections != null)
                    {
                        detections.AddRange(parsedDetections.Select(d => new CardDetection
                        {
                            Name = d.Name,
                            Set = d.Set,
                            ConfidenceScore = d.Confidence,
                            BoundingBox = new BoundingBox
                            {
                                X = d.BoundingBox.X,
                                Y = d.BoundingBox.Y,
                                Width = d.BoundingBox.Width,
                                Height = d.BoundingBox.Height
                            },
                            RawData = new Dictionary<string, object> { { "openai_response", content } }
                        }));
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OpenAI analysis failed for image {FileName}", fileName);
            throw;
        }

        return detections;
    }

    private async Task<List<CardDetection>> AnalyzeWithAzureVisionAsync(Stream imageStream, string fileName)
    {
        // TODO: Implement Azure Computer Vision analysis
        // This would use Azure.AI.Vision.ImageAnalysis package
        await Task.Delay(100); // Placeholder

        _logger.LogWarning("Azure Vision analysis not yet implemented for {FileName}", fileName);
        return [];
    }

    private async Task<ImageMetadata> GetImageMetadataAsync(Stream imageStream)
    {
        imageStream.Seek(0, SeekOrigin.Begin);

        using var image = await Image.LoadAsync(imageStream);
        var format = image.Metadata.DecodedImageFormat;

        return new ImageMetadata
        {
            Width = image.Width,
            Height = image.Height,
            Format = format?.Name ?? "Unknown",
            SizeBytes = imageStream.Length,
            ColorSpace = image.PixelType.ToString()
        };
    }

    // Helper classes for JSON deserialization
    private class OpenAICardDetection
    {
        public string Name { get; set; } = string.Empty;
        public string? Set { get; set; }
        public double Confidence { get; set; }
        public OpenAIBoundingBox BoundingBox { get; set; } = new();
    }

    private class OpenAIBoundingBox
    {
        public double X { get; set; }
        public double Y { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
    }
}