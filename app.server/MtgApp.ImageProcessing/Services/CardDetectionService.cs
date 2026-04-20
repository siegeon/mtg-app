using Microsoft.EntityFrameworkCore;
using MtgApp.Domain.Entities;
using MtgApp.Infrastructure.Data;

namespace MtgApp.ImageProcessing.Services;

public class CardDetectionService : ICardDetectionService
{
    private readonly AppDbContext _dbContext;
    private readonly IImageAnalysisService _imageAnalysisService;
    private readonly ScryfallApiService _scryfallApiService;
    private readonly ILogger<CardDetectionService> _logger;

    public CardDetectionService(
        AppDbContext dbContext,
        IImageAnalysisService imageAnalysisService,
        ScryfallApiService scryfallApiService,
        ILogger<CardDetectionService> logger)
    {
        _dbContext = dbContext;
        _imageAnalysisService = imageAnalysisService;
        _scryfallApiService = scryfallApiService;
        _logger = logger;
    }

    public async Task<CardDetectionResult> ProcessImageAsync(int scanImageId, Stream imageStream, string fileName)
    {
        var result = new CardDetectionResult();

        try
        {
            // Get the scan image record
            var scanImage = await _dbContext.ScanImages.FindAsync(scanImageId);
            if (scanImage == null)
            {
                result.Success = false;
                result.ErrorMessage = "Scan image not found";
                return result;
            }

            // Update image status to processing
            scanImage.Status = ImageStatus.Processing;
            await _dbContext.SaveChangesAsync();

            // Analyze image with AI
            var analysisResult = await _imageAnalysisService.AnalyzeImageAsync(imageStream, fileName);

            if (!analysisResult.Success)
            {
                result.Success = false;
                result.ErrorMessage = analysisResult.ErrorMessage;

                // Update image status to failed
                scanImage.Status = ImageStatus.Failed;
                scanImage.ProcessingError = analysisResult.ErrorMessage;
                await _dbContext.SaveChangesAsync();

                return result;
            }

            // Save detected cards to database
            var detectedCards = await SaveDetectedCardsAsync(
                scanImage.BinderScanId,
                scanImageId,
                analysisResult.DetectedCards);

            // Update scan image with results
            scanImage.Status = ImageStatus.Processed;
            scanImage.ProcessedAt = DateTime.UtcNow;
            scanImage.DetectedCardCount = detectedCards.Count;
            scanImage.AiProvider = analysisResult.Provider.ToString();
            scanImage.ProcessingModel = analysisResult.Model;
            scanImage.ProcessingDuration = analysisResult.ProcessingDuration;

            await _dbContext.SaveChangesAsync();

            // Update result
            result.Success = true;
            result.Provider = analysisResult.Provider;
            result.Model = analysisResult.Model;
            result.ProcessingDuration = analysisResult.ProcessingDuration;
            result.DetectedCardCount = detectedCards.Count;
            result.DetectedCards = detectedCards;
            result.ImageMetadata = analysisResult.Metadata;

            _logger.LogInformation("Processed image {ImageId} - detected {CardCount} cards in {Duration}ms",
                scanImageId, detectedCards.Count, analysisResult.ProcessingDuration.TotalMilliseconds);
        }
        catch (Exception ex)
        {
            result.Success = false;
            result.ErrorMessage = ex.Message;
            _logger.LogError(ex, "Failed to process image {ImageId}", scanImageId);

            // Update image status to failed
            var scanImage = await _dbContext.ScanImages.FindAsync(scanImageId);
            if (scanImage != null)
            {
                scanImage.Status = ImageStatus.Failed;
                scanImage.ProcessingError = ex.Message;
                await _dbContext.SaveChangesAsync();
            }
        }

        return result;
    }

    public async Task<List<DetectedCard>> SaveDetectedCardsAsync(int binderScanId, int scanImageId, List<CardDetection> detections)
    {
        var detectedCards = new List<DetectedCard>();

        foreach (var detection in detections)
        {
            try
            {
                // Try to find the card in Scryfall
                var scryfallCard = await _scryfallApiService.FindCardAsync(detection.Name, detection.Set);

                // Check if we have this card in our database
                Card? localCard = null;
                if (scryfallCard != null)
                {
                    localCard = await _dbContext.Cards
                        .FirstOrDefaultAsync(c => c.Name == scryfallCard.Name && c.Set == scryfallCard.Set);

                    // If not in our database, we could optionally create it
                    if (localCard == null)
                    {
                        localCard = new Card
                        {
                            Name = scryfallCard.Name,
                            ManaCost = scryfallCard.ManaCost ?? "",
                            ConvertedManaCost = (int)(scryfallCard.Cmc ?? 0),
                            Type = scryfallCard.TypeLine,
                            Text = scryfallCard.OracleText,
                            Power = int.TryParse(scryfallCard.Power, out var power) ? power : null,
                            Toughness = int.TryParse(scryfallCard.Toughness, out var toughness) ? toughness : null,
                            Set = scryfallCard.Set.ToUpper(),
                            Rarity = scryfallCard.Rarity,
                            ImageUrl = scryfallCard.ImageUris?.Normal
                        };

                        _dbContext.Cards.Add(localCard);
                        await _dbContext.SaveChangesAsync();
                    }
                }

                var detectedCard = new DetectedCard
                {
                    BinderScanId = binderScanId,
                    ScanImageId = scanImageId,
                    CardId = localCard?.Id,
                    DetectedName = detection.Name,
                    DetectedSet = detection.Set,
                    ConfidenceScore = detection.ConfidenceScore,
                    BoundingBoxX = detection.BoundingBox.X,
                    BoundingBoxY = detection.BoundingBox.Y,
                    BoundingBoxWidth = detection.BoundingBox.Width,
                    BoundingBoxHeight = detection.BoundingBox.Height,
                    Status = DetectionStatus.Detected
                };

                _dbContext.DetectedCards.Add(detectedCard);
                detectedCards.Add(detectedCard);

                _logger.LogDebug("Saved detected card: {CardName} (confidence: {Confidence:F2})",
                    detection.Name, detection.ConfidenceScore);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to save detected card: {CardName}", detection.Name);
                // Continue with other cards
            }
        }

        await _dbContext.SaveChangesAsync();
        return detectedCards;
    }

    public async Task<DetectedCard?> CorrectCardDetectionAsync(int detectedCardId, string correctedName, string? correctedSet = null)
    {
        var detectedCard = await _dbContext.DetectedCards.FindAsync(detectedCardId);
        if (detectedCard == null)
        {
            return null;
        }

        try
        {
            // Find the corrected card in Scryfall
            var scryfallCard = await _scryfallApiService.FindCardAsync(correctedName, correctedSet);

            Card? correctedLocalCard = null;
            if (scryfallCard != null)
            {
                correctedLocalCard = await _dbContext.Cards
                    .FirstOrDefaultAsync(c => c.Name == scryfallCard.Name && c.Set == scryfallCard.Set);

                // Create the card if it doesn't exist locally
                if (correctedLocalCard == null)
                {
                    correctedLocalCard = new Card
                    {
                        Name = scryfallCard.Name,
                        ManaCost = scryfallCard.ManaCost ?? "",
                        ConvertedManaCost = (int)(scryfallCard.Cmc ?? 0),
                        Type = scryfallCard.TypeLine,
                        Text = scryfallCard.OracleText,
                        Power = int.TryParse(scryfallCard.Power, out var power) ? power : null,
                        Toughness = int.TryParse(scryfallCard.Toughness, out var toughness) ? toughness : null,
                        Set = scryfallCard.Set.ToUpper(),
                        Rarity = scryfallCard.Rarity,
                        ImageUrl = scryfallCard.ImageUris?.Normal
                    };

                    _dbContext.Cards.Add(correctedLocalCard);
                    await _dbContext.SaveChangesAsync();
                }
            }

            // Update the detected card with corrections
            detectedCard.CorrectedName = correctedName;
            detectedCard.CorrectedSet = correctedSet;
            detectedCard.CorrectedCardId = correctedLocalCard?.Id;
            detectedCard.CorrectedAt = DateTime.UtcNow;
            detectedCard.IsManuallyVerified = true;
            detectedCard.Status = DetectionStatus.Corrected;

            await _dbContext.SaveChangesAsync();

            _logger.LogInformation("Corrected detected card {DetectedCardId}: {OriginalName} -> {CorrectedName}",
                detectedCardId, detectedCard.DetectedName, correctedName);

            return detectedCard;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to correct detected card {DetectedCardId}", detectedCardId);
            throw;
        }
    }

    public async Task<List<DetectedCard>> GetDetectedCardsAsync(int binderScanId)
    {
        return await _dbContext.DetectedCards
            .Where(dc => dc.BinderScanId == binderScanId)
            .Include(dc => dc.Card)
            .Include(dc => dc.CorrectedCard)
            .Include(dc => dc.ScanImage)
            .OrderBy(dc => dc.ScanImageId)
            .ThenBy(dc => dc.ConfidenceScore)
            .ToListAsync();
    }
}