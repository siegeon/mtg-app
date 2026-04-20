namespace MtgApp.Domain.Entities;

/// <summary>
/// Represents a binder scanning session where a user uploads multiple page images
/// for bulk card detection and collection import
/// </summary>
public class BinderScan
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public ScanStatus Status { get; set; } = ScanStatus.Uploaded;
    public int TotalImages { get; set; }
    public int ProcessedImages { get; set; }
    public int TotalDetectedCards { get; set; }
    public int ConfirmedCards { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    public List<ScanImage> Images { get; set; } = [];
    public List<DetectedCard> DetectedCards { get; set; } = [];
}

/// <summary>
/// Individual binder page image uploaded for processing
/// </summary>
public class ScanImage
{
    public int Id { get; set; }
    public int BinderScanId { get; set; }
    public required string FileName { get; set; }
    public required string StoragePath { get; set; }
    public string? OriginalFileName { get; set; }
    public long FileSizeBytes { get; set; }
    public string? MimeType { get; set; }
    public ImageStatus Status { get; set; } = ImageStatus.Uploaded;
    public int DetectedCardCount { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ProcessedAt { get; set; }
    public string? ProcessingError { get; set; }

    // AI/ML metadata
    public string? AiProvider { get; set; } // "AzureCognitive", "OpenAI", etc.
    public string? ProcessingModel { get; set; }
    public TimeSpan? ProcessingDuration { get; set; }

    public BinderScan BinderScan { get; set; } = null!;
    public List<DetectedCard> DetectedCards { get; set; } = [];
}

/// <summary>
/// Individual card detected within a binder page image with confidence metrics
/// </summary>
public class DetectedCard
{
    public int Id { get; set; }
    public int BinderScanId { get; set; }
    public int ScanImageId { get; set; }
    public Guid? CardId { get; set; } // Null if card couldn't be identified
    public required string DetectedName { get; set; }
    public string? DetectedSet { get; set; }
    public double ConfidenceScore { get; set; } // 0.0 to 1.0
    public DetectionStatus Status { get; set; } = DetectionStatus.Detected;
    public int Quantity { get; set; } = 1;

    // Bounding box coordinates in the image
    public double BoundingBoxX { get; set; }
    public double BoundingBoxY { get; set; }
    public double BoundingBoxWidth { get; set; }
    public double BoundingBoxHeight { get; set; }

    // Manual correction tracking
    public string? CorrectedName { get; set; }
    public string? CorrectedSet { get; set; }
    public Guid? CorrectedCardId { get; set; }
    public DateTime? CorrectedAt { get; set; }
    public bool IsManuallyVerified { get; set; }

    // Training data
    public bool UseForTraining { get; set; } = true;
    public string? TrainingNotes { get; set; }

    public BinderScan BinderScan { get; set; } = null!;
    public ScanImage ScanImage { get; set; } = null!;
    public Card? Card { get; set; } // The matched MTG card
    public Card? CorrectedCard { get; set; } // Manually corrected card
}

public enum ScanStatus
{
    Uploaded,
    Processing,
    Completed,
    Failed,
    Cancelled
}

public enum ImageStatus
{
    Uploaded,
    Processing,
    Processed,
    Failed,
    Skipped
}

public enum DetectionStatus
{
    Detected,      // AI detected a card
    Confirmed,     // User confirmed the detection
    Corrected,     // User manually corrected the detection
    Rejected,      // User rejected the detection
    Imported       // Card was imported to collection
}