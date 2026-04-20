using MtgApp.Domain.Entities;

namespace MtgApp.ImageProcessing.Services;

public interface ICardDetectionService
{
    Task<CardDetectionResult> ProcessImageAsync(int scanImageId, Stream imageStream, string fileName);
    Task<List<DetectedCard>> SaveDetectedCardsAsync(int binderScanId, int scanImageId, List<CardDetection> detections);
    Task<DetectedCard?> CorrectCardDetectionAsync(int detectedCardId, string correctedName, string? correctedSet = null);
    Task<List<DetectedCard>> GetDetectedCardsAsync(int binderScanId);
}

public class CardDetectionResult
{
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public AiProvider Provider { get; set; }
    public string? Model { get; set; }
    public TimeSpan ProcessingDuration { get; set; }
    public int DetectedCardCount { get; set; }
    public List<DetectedCard> DetectedCards { get; set; } = [];
    public ImageMetadata? ImageMetadata { get; set; }
}