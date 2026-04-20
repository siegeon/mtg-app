using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MtgApp.Api.Models;
using MtgApp.Infrastructure.Data;
using MtgApp.Domain.Entities;

namespace MtgApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DecksController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<DecksController> _logger;

    public DecksController(AppDbContext context, ILogger<DecksController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Create a new deck
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<DeckDto>> CreateDeck([FromBody] CreateDeckRequest request)
    {
        try
        {
            var deck = new Deck
            {
                Name = request.Name,
                Description = request.Description,
                Format = request.Format,
                UserId = request.UserId ?? "test-user", // Use test user if not provided
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Decks.Add(deck);
            await _context.SaveChangesAsync();

            var deckDto = new DeckDto
            {
                Id = deck.Id,
                Name = deck.Name,
                Description = deck.Description,
                Format = deck.Format,
                UserId = deck.UserId,
                CreatedAt = deck.CreatedAt,
                UpdatedAt = deck.UpdatedAt,
                Cards = []
            };

            _logger.LogInformation("Created deck {DeckId} with name {DeckName}", deck.Id, deck.Name);
            return CreatedAtAction(nameof(GetDeck), new { id = deck.Id }, deckDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating deck with request: {@Request}", request);
            return StatusCode(500, new { error = "Internal server error occurred while creating deck" });
        }
    }

    /// <summary>
    /// Get a deck by ID with its cards
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<DeckDto>> GetDeck(int id)
    {
        try
        {
            var deck = await _context.Decks
                .Include(d => d.DeckCards)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null)
            {
                return NotFound(new { error = $"Deck with ID {id} not found" });
            }

            // Get card details for all deck cards
            var scryfallIds = deck.DeckCards.Select(dc => dc.ScryfallId).ToList();
            var cards = await _context.Cards
                .Where(c => scryfallIds.Contains(c.ScryfallId!))
                .ToDictionaryAsync(c => c.ScryfallId!, c => c);

            var deckDto = new DeckDto
            {
                Id = deck.Id,
                Name = deck.Name,
                Description = deck.Description,
                Format = deck.Format,
                UserId = deck.UserId,
                CreatedAt = deck.CreatedAt,
                UpdatedAt = deck.UpdatedAt,
                Cards = deck.DeckCards.Select(dc => new DeckCardDto
                {
                    ScryfallId = dc.ScryfallId,
                    Quantity = dc.Quantity,
                    IsMainboard = dc.IsMainboard,
                    Card = cards.TryGetValue(dc.ScryfallId, out var card) ? new CardDto
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
                    } : null
                }).ToList()
            };

            return Ok(deckDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting deck with ID: {DeckId}", id);
            return StatusCode(500, new { error = "Internal server error occurred while retrieving deck" });
        }
    }

    /// <summary>
    /// Add a card to a deck (increments quantity if card already exists)
    /// </summary>
    [HttpPost("{id:int}/cards")]
    public async Task<ActionResult<DeckCardDto>> AddCardToDeck(int id, [FromBody] AddCardToDeckRequest request)
    {
        try
        {
            var deck = await _context.Decks.FirstOrDefaultAsync(d => d.Id == id);
            if (deck == null)
            {
                return NotFound(new { error = $"Deck with ID {id} not found" });
            }

            // Check if card already exists in deck
            var existingDeckCard = await _context.DeckCards
                .FirstOrDefaultAsync(dc => dc.DeckId == id &&
                                         dc.ScryfallId == request.ScryfallId &&
                                         dc.IsMainboard == request.IsMainboard);

            if (existingDeckCard != null)
            {
                // Increment quantity
                existingDeckCard.Quantity += request.Quantity;
                _context.DeckCards.Update(existingDeckCard);
            }
            else
            {
                // Add new card
                var deckCard = new DeckCard
                {
                    DeckId = id,
                    ScryfallId = request.ScryfallId,
                    Quantity = request.Quantity,
                    IsMainboard = request.IsMainboard
                };
                _context.DeckCards.Add(deckCard);
                existingDeckCard = deckCard;
            }

            // Update deck's UpdatedAt timestamp
            deck.UpdatedAt = DateTime.UtcNow;
            _context.Decks.Update(deck);

            await _context.SaveChangesAsync();

            // Get card details for response
            var card = await _context.Cards.FirstOrDefaultAsync(c => c.ScryfallId == request.ScryfallId);

            var result = new DeckCardDto
            {
                ScryfallId = existingDeckCard.ScryfallId,
                Quantity = existingDeckCard.Quantity,
                IsMainboard = existingDeckCard.IsMainboard,
                Card = card != null ? new CardDto
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
                } : null
            };

            _logger.LogInformation("Added {Quantity} of card {ScryfallId} to deck {DeckId}",
                                 request.Quantity, request.ScryfallId, id);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding card to deck {DeckId} with request: {@Request}", id, request);
            return StatusCode(500, new { error = "Internal server error occurred while adding card to deck" });
        }
    }
}