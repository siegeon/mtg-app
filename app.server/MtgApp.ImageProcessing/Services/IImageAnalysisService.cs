using MtgApp.Domain.Entities;

namespace MtgApp.ImageProcessing.Services;

public interface IImageAnalysisService
{
    Task<ImageAnalysisResult> AnalyzeImageAsync(Stream imageStream, string fileName, AiProvider provider = AiProvider.Auto);
    Task<List<CardDetection>> DetectCardsInImageAsync(Stream imageStream, string fileName, AiProvider provider = AiProvider.Auto);
}

public class ImageAnalysisResult
{
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public AiProvider Provider { get; set; }
    public string? Model { get; set; }
    public TimeSpan ProcessingDuration { get; set; }
    public List<CardDetection> DetectedCards { get; set; } = [];
    public ImageMetadata? Metadata { get; set; }
}

public class CardDetection
{
    public string Name { get; set; } = string.Empty;
    public string? Set { get; set; }
    public double ConfidenceScore { get; set; }
    public BoundingBox BoundingBox { get; set; } = new();
    public Dictionary<string, object> RawData { get; set; } = [];
}

public class BoundingBox
{
    public double X { get; set; }
    public double Y { get; set; }
    public double Width { get; set; }
    public double Height { get; set; }
}

public class ImageMetadata
{
    public int Width { get; set; }
    public int Height { get; set; }
    public string Format { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
    public string? ColorSpace { get; set; }
}

public enum AiProvider
{
    Auto,
    OpenAI,
    AzureVision
}