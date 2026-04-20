using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtgApp.Infrastructure.Data;

namespace MtgApp.Api.Controllers;

[ApiController]
[Route("api/ingest")]
public class IngestController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<IngestController> _logger;

    public IngestController(AppDbContext context, ILogger<IngestController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get ingest status and health information
    /// </summary>
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        try
        {
            // Get total card count
            var cardsInDb = await _context.Cards.CountAsync();

            // Get last sync timestamp from most recent card
            var lastSyncCard = await _context.Cards
                .OrderByDescending(c => c.UpdatedAt)
                .FirstOrDefaultAsync();

            string? lastSyncTimestamp = lastSyncCard?.BulkDataTimestamp;
            DateTime? lastUpdated = lastSyncCard?.UpdatedAt;

            // Determine health status
            bool healthy = cardsInDb > 0;

            // Consider it unhealthy if no cards or last update was more than 25 hours ago
            // (since sync runs every 12 hours, 25 hours indicates a missed sync)
            if (lastUpdated.HasValue)
            {
                var timeSinceLastUpdate = DateTime.UtcNow - lastUpdated.Value;
                if (timeSinceLastUpdate > TimeSpan.FromHours(25))
                {
                    healthy = false;
                }
            }

            var response = new IngestStatusResponse
            {
                LastSyncTimestamp = lastSyncTimestamp,
                CardsInDb = cardsInDb,
                LastRunDurationSeconds = null, // Would need to track this separately
                Healthy = healthy,
                LastUpdated = lastUpdated,
                Message = healthy
                    ? "Ingest service is healthy"
                    : cardsInDb == 0
                        ? "No cards in database - ingest may not have run yet"
                        : "Last sync was more than 25 hours ago - check ingest service"
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving ingest status");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}

/// <summary>
/// Ingest status response DTO
/// </summary>
public record IngestStatusResponse
{
    public string? LastSyncTimestamp { get; init; }
    public int CardsInDb { get; init; }
    public double? LastRunDurationSeconds { get; init; }
    public bool Healthy { get; init; }
    public DateTime? LastUpdated { get; init; }
    public string Message { get; init; } = string.Empty;
}