using Microsoft.EntityFrameworkCore;
using MtgApp.Domain.Entities;
using MtgApp.Infrastructure.Data;
using SixLabors.ImageSharp;

namespace MtgApp.ImageProcessing.Services;

public class BinderScanService : IBinderScanService
{
    private readonly AppDbContext _dbContext;
    private readonly ICardDetectionService _cardDetectionService;
    private readonly ILogger<BinderScanService> _logger;

    public BinderScanService(
        AppDbContext dbContext,
        ICardDetectionService cardDetectionService,
        ILogger<BinderScanService> logger)
    {
        _dbContext = dbContext;
        _cardDetectionService = cardDetectionService;
        _logger = logger;
    }

    public async Task<BinderScan> CreateScanAsync(string name, string? description = null)
    {
        var scan = new BinderScan
        {
            Name = name,
            Description = description,
            Status = ScanStatus.Uploaded
        };

        _dbContext.BinderScans.Add(scan);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Created binder scan {ScanId}: {Name}", scan.Id, name);
        return scan;
    }

    public async Task<ScanImage> UploadImageAsync(int binderScanId, Stream imageStream, string fileName, string? originalFileName = null)
    {
        var scan = await _dbContext.BinderScans.FindAsync(binderScanId);
        if (scan == null)
        {
            throw new ArgumentException("Binder scan not found", nameof(binderScanId));
        }

        try
        {
            // Validate image format and get metadata
            imageStream.Seek(0, SeekOrigin.Begin);
            using var image = await Image.LoadAsync(imageStream);
            var format = image.Metadata.DecodedImageFormat;

            if (format == null)
            {
                throw new ArgumentException("Invalid or unsupported image format");
            }

            // Generate storage path (in a real implementation, this would be a cloud storage path)
            var storageDirectory = Path.Combine("uploads", "binder-scans", binderScanId.ToString());
            Directory.CreateDirectory(storageDirectory);

            var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";
            var storagePath = Path.Combine(storageDirectory, uniqueFileName);

            // Save image to storage
            imageStream.Seek(0, SeekOrigin.Begin);
            using var fileStream = File.Create(storagePath);
            await imageStream.CopyToAsync(fileStream);

            // Create scan image record
            var scanImage = new ScanImage
            {
                BinderScanId = binderScanId,
                FileName = uniqueFileName,
                StoragePath = storagePath,
                OriginalFileName = originalFileName ?? fileName,
                FileSizeBytes = imageStream.Length,
                MimeType = format.DefaultMimeType,
                Status = ImageStatus.Uploaded
            };

            _dbContext.ScanImages.Add(scanImage);

            // Update scan totals
            scan.TotalImages++;
            scan.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            _logger.LogInformation("Uploaded image {ImageId} to scan {ScanId}: {FileName}",
                scanImage.Id, binderScanId, fileName);

            return scanImage;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload image to scan {ScanId}: {FileName}", binderScanId, fileName);
            throw;
        }
    }

    public async Task<BinderScan?> ProcessScanAsync(int binderScanId)
    {
        var scan = await _dbContext.BinderScans
            .Include(s => s.Images.Where(i => i.Status == ImageStatus.Uploaded))
            .FirstOrDefaultAsync(s => s.Id == binderScanId);

        if (scan == null)
        {
            return null;
        }

        try
        {
            scan.Status = ScanStatus.Processing;
            scan.UpdatedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();

            _logger.LogInformation("Starting processing for scan {ScanId} with {ImageCount} images",
                binderScanId, scan.Images.Count);

            foreach (var scanImage in scan.Images)
            {
                try
                {
                    // Load image from storage
                    using var fileStream = File.OpenRead(scanImage.StoragePath);

                    // Process the image
                    var result = await _cardDetectionService.ProcessImageAsync(
                        scanImage.Id, fileStream, scanImage.FileName);

                    if (result.Success)
                    {
                        scan.ProcessedImages++;
                        scan.TotalDetectedCards += result.DetectedCardCount;
                    }
                    else
                    {
                        _logger.LogWarning("Failed to process image {ImageId}: {Error}",
                            scanImage.Id, result.ErrorMessage);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to process image {ImageId} in scan {ScanId}",
                        scanImage.Id, binderScanId);
                }
            }

            // Update scan status
            scan.Status = ScanStatus.Completed;
            scan.CompletedAt = DateTime.UtcNow;
            scan.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            _logger.LogInformation("Completed processing for scan {ScanId}: {ProcessedImages}/{TotalImages} images, {TotalCards} cards detected",
                binderScanId, scan.ProcessedImages, scan.TotalImages, scan.TotalDetectedCards);

            return scan;
        }
        catch (Exception ex)
        {
            scan.Status = ScanStatus.Failed;
            scan.UpdatedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();

            _logger.LogError(ex, "Failed to process scan {ScanId}", binderScanId);
            throw;
        }
    }

    public async Task<BinderScan?> GetScanAsync(int binderScanId)
    {
        return await _dbContext.BinderScans
            .Include(s => s.Images)
            .Include(s => s.DetectedCards)
                .ThenInclude(dc => dc.Card)
            .FirstOrDefaultAsync(s => s.Id == binderScanId);
    }

    public async Task<List<BinderScan>> GetScansAsync(int limit = 50)
    {
        return await _dbContext.BinderScans
            .OrderByDescending(s => s.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<BinderScanStats> GetScanStatsAsync(int binderScanId)
    {
        var scan = await _dbContext.BinderScans
            .Include(s => s.Images)
            .Include(s => s.DetectedCards)
            .FirstOrDefaultAsync(s => s.Id == binderScanId);

        if (scan == null)
        {
            throw new ArgumentException("Binder scan not found", nameof(binderScanId));
        }

        var stats = new BinderScanStats
        {
            TotalImages = scan.Images.Count,
            ProcessedImages = scan.Images.Count(i => i.Status == ImageStatus.Processed),
            FailedImages = scan.Images.Count(i => i.Status == ImageStatus.Failed),
            TotalDetectedCards = scan.DetectedCards.Count,
            ConfirmedCards = scan.DetectedCards.Count(dc => dc.Status == DetectionStatus.Confirmed),
            CorrectedCards = scan.DetectedCards.Count(dc => dc.Status == DetectionStatus.Corrected)
        };

        if (stats.TotalDetectedCards > 0)
        {
            stats.AverageConfidence = scan.DetectedCards.Average(dc => dc.ConfidenceScore);
        }

        // Calculate total processing time
        var processedImages = scan.Images.Where(i => i.ProcessingDuration.HasValue);
        if (processedImages.Any())
        {
            stats.TotalProcessingTime = TimeSpan.FromTicks(
                processedImages.Sum(i => i.ProcessingDuration!.Value.Ticks));
        }

        // Provider usage stats
        stats.ProviderUsage = scan.Images
            .Where(i => !string.IsNullOrEmpty(i.AiProvider))
            .GroupBy(i => i.AiProvider!)
            .ToDictionary(g => g.Key, g => g.Count());

        return stats;
    }

    public async Task<bool> DeleteScanAsync(int binderScanId)
    {
        var scan = await _dbContext.BinderScans
            .Include(s => s.Images)
            .Include(s => s.DetectedCards)
            .FirstOrDefaultAsync(s => s.Id == binderScanId);

        if (scan == null)
        {
            return false;
        }

        try
        {
            // Delete image files from storage
            foreach (var image in scan.Images)
            {
                try
                {
                    if (File.Exists(image.StoragePath))
                    {
                        File.Delete(image.StoragePath);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to delete image file: {StoragePath}", image.StoragePath);
                }
            }

            // Delete database records (cascade will handle related records)
            _dbContext.BinderScans.Remove(scan);
            await _dbContext.SaveChangesAsync();

            _logger.LogInformation("Deleted binder scan {ScanId}", binderScanId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete binder scan {ScanId}", binderScanId);
            return false;
        }
    }
}