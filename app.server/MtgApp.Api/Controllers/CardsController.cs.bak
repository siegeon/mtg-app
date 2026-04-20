using Microsoft.AspNetCore.Mvc;
using MtgApp.Api.Models;
using MtgApp.Api.Services;
using MtgApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MtgApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CardsController : ControllerBase
{
    private readonly CardSearchService _searchService;
    private readonly AppDbContext _context;
    private readonly ILogger<CardsController> _logger;

    public CardsController(CardSearchService searchService, AppDbContext context, ILogger<CardsController> logger)
    {
        _searchService = searchService;
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Search cards with advanced filtering and pagination
    /// </summary>
    [HttpGet("search")]
    public async Task<ActionResult<CardSearchResponse>> SearchCards([FromQuery] CardSearchRequest request)
    {
        try
        {
            var response = await _searchService.SearchCardsAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching cards with request: {@Request}", request);
            return StatusCode(500, new { error = "Internal server error occurred while searching cards" });
        }
    }

    /// <summary>
    /// Get all cards with basic pagination
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<CardSearchResponse>> GetCards(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 25,
        [FromQuery] string sortBy = "name",
        [FromQuery] string sortDirection = "asc")
    {
        var request = new CardSearchRequest
        {
            Page = page,
            PageSize = Math.Min(pageSize, 100), // Limit max page size
            SortBy = sortBy,
            SortDirection = sortDirection
        };

        return await SearchCards(request);
    }

    /// <summary>
    /// Get a specific card by ID
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CardDto>> GetCard(int id)
    {
        try
        {
            var card = await _context.Cards.FirstOrDefaultAsync(c => c.Id == id);

            if (card == null)
            {
                return NotFound(new { error = $"Card with ID {id} not found" });
            }

            var dto = new CardDto
            {
                Id = card.Id,
                Name = card.Name,
                ManaCost = card.ManaCost,
                ConvertedManaCost = card.ConvertedManaCost,
                Type = card.Type,
                Text = card.Text,
                Power = card.Power,
                Toughness = card.Toughness,
                Set = card.Set,
                SetName = card.SetName ?? card.Set,
                Rarity = card.Rarity,
                ImageUrl = card.ImageUrl,
                ScryfallId = card.ScryfallId,
                Artist = card.Artist,
                FlavorText = card.FlavorText,
                Price = card.Price,
                CollectorNumber = card.CollectorNumber,
                IsDigital = card.IsDigital,
                Layout = card.Layout
            };

            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting card with ID: {CardId}", id);
            return StatusCode(500, new { error = "Internal server error occurred while retrieving card" });
        }
    }

    /// <summary>
    /// Get autocomplete suggestions for card names
    /// </summary>
    [HttpGet("autocomplete")]
    public async Task<ActionResult<string[]>> GetAutocomplete([FromQuery] string query, [FromQuery] int limit = 10)
    {
        if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
        {
            return Ok(Array.Empty<string>());
        }

        try
        {
            var suggestions = await _context.Cards
                .Where(c => c.Name.StartsWith(query))
                .OrderBy(c => c.Name.Length) // Shorter names first
                .ThenBy(c => c.Name)
                .Select(c => c.Name)
                .Distinct()
                .Take(Math.Min(limit, 25))
                .ToArrayAsync();

            return Ok(suggestions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting autocomplete suggestions for query: {Query}", query);
            return StatusCode(500, new { error = "Internal server error occurred while getting suggestions" });
        }
    }

    /// <summary>
    /// Get available filter options (sets, rarities, etc.)
    /// </summary>
    [HttpGet("filters")]
    public async Task<ActionResult<object>> GetFilterOptions()
    {
        try
        {
            var sets = await _context.Cards
                .Select(c => new { Code = c.Set, Name = c.SetName ?? c.Set })
                .Distinct()
                .OrderBy(s => s.Name)
                .ToArrayAsync();

            var rarities = await _context.Cards
                .Select(c => c.Rarity)
                .Distinct()
                .OrderBy(r => r)
                .ToArrayAsync();

            var types = await _context.Cards
                .Select(c => c.Type)
                .Distinct()
                .OrderBy(t => t)
                .Take(50) // Limit types for performance
                .ToArrayAsync();

            return Ok(new
            {
                sets,
                rarities,
                types,
                colors = new[] { "W", "U", "B", "R", "G" },
                formats = new[] { "standard", "modern", "legacy", "vintage", "commander", "pioneer", "historic" }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting filter options");
            return StatusCode(500, new { error = "Internal server error occurred while getting filter options" });
        }
    }

    /// <summary>
    /// Get card statistics
    /// </summary>
    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetCardStats()
    {
        try
        {
            var totalCards = await _context.Cards.CountAsync();
            var totalSets = await _context.Cards.Select(c => c.Set).Distinct().CountAsync();
            var averagePrice = await _context.Cards.Where(c => c.Price.HasValue).AverageAsync(c => c.Price);
            var lastUpdated = await _context.Cards.MaxAsync(c => c.UpdatedAt);

            return Ok(new
            {
                totalCards,
                totalSets,
                averagePrice = Math.Round(averagePrice ?? 0, 2),
                lastUpdated
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting card statistics");
            return StatusCode(500, new { error = "Internal server error occurred while getting statistics" });
        }
    }
}