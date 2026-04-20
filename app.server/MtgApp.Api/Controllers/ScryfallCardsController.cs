using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtgApp.Infrastructure.Data;
using MtgApp.Domain.Entities;
using System.Text.Json;

namespace MtgApp.Api.Controllers;

[ApiController]
[Route("api/cards")]
public class ScryfallCardsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ScryfallCardsController> _logger;

    public ScryfallCardsController(AppDbContext context, ILogger<ScryfallCardsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get a card by its Scryfall ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCard(Guid id)
    {
        try
        {
            var card = await _context.Cards
                .Where(c => c.Id == id)
                .FirstOrDefaultAsync();

            if (card == null)
            {
                return NotFound(new { message = $"Card with ID {id} not found" });
            }

            var response = new CardResponse
            {
                Id = card.Id,
                OracleId = card.OracleId,
                Name = card.Name,
                ManaCost = card.ManaCost,
                Cmc = card.Cmc,
                TypeLine = card.TypeLine,
                Colors = card.Colors,
                Rarity = card.Rarity,
                SetCode = card.SetCode,
                ImageUris = JsonSerializer.Deserialize<object>(card.ImageUrisJson),
                Prices = JsonSerializer.Deserialize<object>(card.PricesJson),
                UpdatedAt = card.UpdatedAt
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving card {CardId}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Search cards using full-text search
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> SearchCards([FromQuery] string? q = null, [FromQuery] int limit = 50)
    {
        try
        {
            if (limit > 100) limit = 100; // Cap at 100

            IQueryable<Card> query = _context.Cards;

            if (!string.IsNullOrWhiteSpace(q))
            {
                // Use PostgreSQL full-text search
                query = query.Where(c => EF.Functions.ToTsVector("english", c.Name)
                    .Matches(EF.Functions.PlainToTsQuery("english", q)));
            }

            var cards = await query
                .OrderBy(c => c.Name)
                .Take(limit)
                .ToListAsync();

            var responses = cards.Select(card => new CardResponse
            {
                Id = card.Id,
                OracleId = card.OracleId,
                Name = card.Name,
                ManaCost = card.ManaCost,
                Cmc = card.Cmc,
                TypeLine = card.TypeLine,
                Colors = card.Colors,
                Rarity = card.Rarity,
                SetCode = card.SetCode,
                ImageUris = JsonSerializer.Deserialize<object>(card.ImageUrisJson),
                Prices = JsonSerializer.Deserialize<object>(card.PricesJson),
                UpdatedAt = card.UpdatedAt
            }).ToList();

            return Ok(new SearchResponse
            {
                Cards = responses,
                Total = responses.Count,
                Query = q,
                Limit = limit
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching cards with query: {Query}", q);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}

/// <summary>
/// Card response DTO
/// </summary>
public record CardResponse
{
    public Guid Id { get; init; }
    public Guid OracleId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? ManaCost { get; init; }
    public decimal Cmc { get; init; }
    public string TypeLine { get; init; } = string.Empty;
    public string[] Colors { get; init; } = [];
    public string Rarity { get; init; } = string.Empty;
    public string SetCode { get; init; } = string.Empty;
    public object? ImageUris { get; init; }
    public object? Prices { get; init; }
    public DateTime UpdatedAt { get; init; }
}

/// <summary>
/// Search response DTO
/// </summary>
public record SearchResponse
{
    public List<CardResponse> Cards { get; init; } = [];
    public int Total { get; init; }
    public string? Query { get; init; }
    public int Limit { get; init; }
}