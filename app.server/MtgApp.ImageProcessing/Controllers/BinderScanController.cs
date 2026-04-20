using Microsoft.AspNetCore.Mvc;
using MtgApp.Domain.Entities;
using MtgApp.ImageProcessing.Services;

namespace MtgApp.ImageProcessing.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BinderScanController : ControllerBase
{
    private readonly IBinderScanService _binderScanService;
    private readonly ICardDetectionService _cardDetectionService;
    private readonly ILogger<BinderScanController> _logger;

    public BinderScanController(
        IBinderScanService binderScanService,
        ICardDetectionService cardDetectionService,
        ILogger<BinderScanController> logger)
    {
        _binderScanService = binderScanService;
        _cardDetectionService = cardDetectionService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<BinderScanDto>> CreateScan([FromBody] CreateScanRequest request)
    {
        try
        {
            var scan = await _binderScanService.CreateScanAsync(request.Name, request.Description);
            return Ok(MapToDto(scan));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create binder scan: {Name}", request.Name);
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<BinderScanDto>>> GetScans([FromQuery] int limit = 50)
    {
        try
        {
            var scans = await _binderScanService.GetScansAsync(limit);
            return Ok(scans.Select(MapToDto).ToList());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get binder scans");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{scanId}")]
    public async Task<ActionResult<BinderScanDto>> GetScan(int scanId)
    {
        try
        {
            var scan = await _binderScanService.GetScanAsync(scanId);
            if (scan == null)
            {
                return NotFound();
            }

            return Ok(MapToDto(scan));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get binder scan {ScanId}", scanId);
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("{scanId}/images")]
    public async Task<ActionResult<ScanImageDto>> UploadImage(int scanId, [FromForm] IFormFile image)
    {
        try
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest(new { error = "No image provided" });
            }

            // Validate file type
            var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/webp" };
            if (!allowedTypes.Contains(image.ContentType.ToLower()))
            {
                return BadRequest(new { error = "Invalid file type. Only JPEG, PNG, and WebP images are supported." });
            }

            // Validate file size (e.g., max 10MB)
            const long maxSize = 10 * 1024 * 1024;
            if (image.Length > maxSize)
            {
                return BadRequest(new { error = "File size too large. Maximum size is 10MB." });
            }

            using var stream = image.OpenReadStream();
            var scanImage = await _binderScanService.UploadImageAsync(
                scanId, stream, image.FileName, image.FileName);

            return Ok(MapToDto(scanImage));
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload image to scan {ScanId}", scanId);
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("{scanId}/process")]
    public async Task<ActionResult<BinderScanDto>> ProcessScan(int scanId)
    {
        try
        {
            var scan = await _binderScanService.ProcessScanAsync(scanId);
            if (scan == null)
            {
                return NotFound();
            }

            return Ok(MapToDto(scan));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to process scan {ScanId}", scanId);
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{scanId}/stats")]
    public async Task<ActionResult<BinderScanStats>> GetScanStats(int scanId)
    {
        try
        {
            var stats = await _binderScanService.GetScanStatsAsync(scanId);
            return Ok(stats);
        }
        catch (ArgumentException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get scan stats for {ScanId}", scanId);
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{scanId}/detected-cards")]
    public async Task<ActionResult<List<DetectedCardDto>>> GetDetectedCards(int scanId)
    {
        try
        {
            var detectedCards = await _cardDetectionService.GetDetectedCardsAsync(scanId);
            return Ok(detectedCards.Select(MapToDto).ToList());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get detected cards for scan {ScanId}", scanId);
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("detected-cards/{detectedCardId}/correct")]
    public async Task<ActionResult<DetectedCardDto>> CorrectDetection(
        int detectedCardId,
        [FromBody] CorrectDetectionRequest request)
    {
        try
        {
            var correctedCard = await _cardDetectionService.CorrectCardDetectionAsync(
                detectedCardId, request.CorrectedName, request.CorrectedSet);

            if (correctedCard == null)
            {
                return NotFound();
            }

            return Ok(MapToDto(correctedCard));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to correct detection {DetectedCardId}", detectedCardId);
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{scanId}")]
    public async Task<IActionResult> DeleteScan(int scanId)
    {
        try
        {
            var success = await _binderScanService.DeleteScanAsync(scanId);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete scan {ScanId}", scanId);
            return BadRequest(new { error = ex.Message });
        }
    }

    private static BinderScanDto MapToDto(BinderScan scan) => new()
    {
        Id = scan.Id,
        Name = scan.Name,
        Description = scan.Description,
        Status = scan.Status.ToString(),
        TotalImages = scan.TotalImages,
        ProcessedImages = scan.ProcessedImages,
        TotalDetectedCards = scan.TotalDetectedCards,
        ConfirmedCards = scan.ConfirmedCards,
        CreatedAt = scan.CreatedAt,
        UpdatedAt = scan.UpdatedAt,
        CompletedAt = scan.CompletedAt,
        Images = scan.Images?.Select(MapToDto).ToList() ?? [],
        DetectedCards = scan.DetectedCards?.Select(MapToDto).ToList() ?? []
    };

    private static ScanImageDto MapToDto(ScanImage image) => new()
    {
        Id = image.Id,
        FileName = image.FileName,
        OriginalFileName = image.OriginalFileName,
        FileSizeBytes = image.FileSizeBytes,
        Status = image.Status.ToString(),
        DetectedCardCount = image.DetectedCardCount,
        UploadedAt = image.UploadedAt,
        ProcessedAt = image.ProcessedAt,
        ProcessingError = image.ProcessingError,
        AiProvider = image.AiProvider,
        ProcessingModel = image.ProcessingModel,
        ProcessingDurationMs = image.ProcessingDuration?.TotalMilliseconds
    };

    private static DetectedCardDto MapToDto(DetectedCard card) => new()
    {
        Id = card.Id,
        DetectedName = card.DetectedName,
        DetectedSet = card.DetectedSet,
        ConfidenceScore = card.ConfidenceScore,
        Status = card.Status.ToString(),
        Quantity = card.Quantity,
        BoundingBox = new BoundingBoxDto
        {
            X = card.BoundingBoxX,
            Y = card.BoundingBoxY,
            Width = card.BoundingBoxWidth,
            Height = card.BoundingBoxHeight
        },
        CorrectedName = card.CorrectedName,
        CorrectedSet = card.CorrectedSet,
        IsManuallyVerified = card.IsManuallyVerified,
        Card = card.Card != null ? MapToDto(card.Card) : null,
        CorrectedCard = card.CorrectedCard != null ? MapToDto(card.CorrectedCard) : null
    };

    private static CardDto MapToDto(Card card) => new()
    {
        Id = card.Id,
        Name = card.Name,
        ManaCost = card.ManaCost,
        Type = card.Type,
        Set = card.Set,
        Rarity = card.Rarity,
        ImageUrl = card.ImageUrl
    };
}

// DTOs
public record CreateScanRequest(string Name, string? Description = null);
public record CorrectDetectionRequest(string CorrectedName, string? CorrectedSet = null);

public record BinderScanDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public int TotalImages { get; set; }
    public int ProcessedImages { get; set; }
    public int TotalDetectedCards { get; set; }
    public int ConfirmedCards { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public List<ScanImageDto> Images { get; set; } = [];
    public List<DetectedCardDto> DetectedCards { get; set; } = [];
}

public record ScanImageDto
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string? OriginalFileName { get; set; }
    public long FileSizeBytes { get; set; }
    public string Status { get; set; } = string.Empty;
    public int DetectedCardCount { get; set; }
    public DateTime UploadedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public string? ProcessingError { get; set; }
    public string? AiProvider { get; set; }
    public string? ProcessingModel { get; set; }
    public double? ProcessingDurationMs { get; set; }
}

public record DetectedCardDto
{
    public int Id { get; set; }
    public string DetectedName { get; set; } = string.Empty;
    public string? DetectedSet { get; set; }
    public double ConfidenceScore { get; set; }
    public string Status { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public BoundingBoxDto BoundingBox { get; set; } = new();
    public string? CorrectedName { get; set; }
    public string? CorrectedSet { get; set; }
    public bool IsManuallyVerified { get; set; }
    public CardDto? Card { get; set; }
    public CardDto? CorrectedCard { get; set; }
}

public record BoundingBoxDto
{
    public double X { get; set; }
    public double Y { get; set; }
    public double Width { get; set; }
    public double Height { get; set; }
}

public record CardDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ManaCost { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Set { get; set; } = string.Empty;
    public string Rarity { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
}