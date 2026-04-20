using Microsoft.EntityFrameworkCore;
using MtgApp.Api.Models;
using MtgApp.Domain.Entities;
using MtgApp.Infrastructure.Data;
using System.Text.Json;
using System.Diagnostics;

namespace MtgApp.Api.Services;

public class CardSearchService
{
    private readonly AppDbContext _context;
    private readonly ILogger<CardSearchService> _logger;

    public CardSearchService(AppDbContext context, ILogger<CardSearchService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<CardSearchResponse> SearchCardsAsync(CardSearchRequest request)
    {
        var stopwatch = Stopwatch.StartNew();

        var query = _context.Cards.AsQueryable();

        // Apply filters
        query = ApplyFilters(query, request);

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply sorting
        query = ApplySorting(query, request.SortBy, request.SortDirection);

        // Apply pagination
        var skip = (request.Page - 1) * request.PageSize;
        query = query.Skip(skip).Take(request.PageSize);

        // Execute query and map to DTOs
        var cards = await query.Select(c => MapToDto(c)).ToListAsync();

        stopwatch.Stop();

        _logger.LogInformation("Card search completed in {ElapsedMs}ms. Query: {Query}, Results: {Count}/{Total}",
            stopwatch.ElapsedMilliseconds, request.Query ?? "advanced", cards.Count, totalCount);

        return new CardSearchResponse
        {
            Cards = cards,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
            SearchTimeMs = stopwatch.ElapsedMilliseconds
        };
    }

    private static IQueryable<Card> ApplyFilters(IQueryable<Card> query, CardSearchRequest request)
    {
        // Full-text search with PostgreSQL text search
        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            var searchTerm = request.Query.ToLower();

            // Use PostgreSQL full-text search if available, otherwise fallback to contains
            if (searchTerm.Contains(' ') || searchTerm.Length > 3)
            {
                // For complex queries, use PostgreSQL's text search
                query = query.Where(c => EF.Functions.ToTsVector("english", c.SearchText)
                    .Matches(EF.Functions.PlainToTsQuery("english", searchTerm)));
            }
            else
            {
                // For simple queries, use faster contains search
                query = query.Where(c => c.SearchText.Contains(searchTerm));
            }
        }

        // Specific name search
        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            query = query.Where(c => c.Name.Contains(request.Name));
        }

        // Type search
        if (!string.IsNullOrWhiteSpace(request.Type))
        {
            query = query.Where(c => c.Type.Contains(request.Type));
        }

        // Color filtering
        if (request.Colors != null && request.Colors.Length > 0)
        {
            foreach (var color in request.Colors)
            {
                query = query.Where(c => c.Colors != null && c.Colors.Contains(color));
            }
        }

        // Color identity filtering
        if (request.ColorIdentity != null && request.ColorIdentity.Length > 0)
        {
            foreach (var color in request.ColorIdentity)
            {
                query = query.Where(c => c.ColorIdentity != null && c.ColorIdentity.Contains(color));
            }
        }

        // Set filtering
        if (!string.IsNullOrWhiteSpace(request.Set))
        {
            query = query.Where(c => c.Set.Contains(request.Set) ||
                                   (c.SetName != null && c.SetName.Contains(request.Set)));
        }

        // Rarity filtering
        if (!string.IsNullOrWhiteSpace(request.Rarity))
        {
            query = query.Where(c => c.Rarity == request.Rarity);
        }

        // Converted mana cost filtering
        if (request.ConvertedManaCostMin.HasValue)
        {
            query = query.Where(c => c.ConvertedManaCost >= request.ConvertedManaCostMin.Value);
        }
        if (request.ConvertedManaCostMax.HasValue)
        {
            query = query.Where(c => c.ConvertedManaCost <= request.ConvertedManaCostMax.Value);
        }

        // Power filtering
        if (request.PowerMin.HasValue)
        {
            query = query.Where(c => c.Power >= request.PowerMin.Value);
        }
        if (request.PowerMax.HasValue)
        {
            query = query.Where(c => c.Power <= request.PowerMax.Value);
        }

        // Toughness filtering
        if (request.ToughnessMin.HasValue)
        {
            query = query.Where(c => c.Toughness >= request.ToughnessMin.Value);
        }
        if (request.ToughnessMax.HasValue)
        {
            query = query.Where(c => c.Toughness <= request.ToughnessMax.Value);
        }

        // Keywords filtering
        if (request.Keywords != null && request.Keywords.Length > 0)
        {
            foreach (var keyword in request.Keywords)
            {
                query = query.Where(c => c.Keywords != null && c.Keywords.Contains(keyword));
            }
        }

        // Artist filtering
        if (!string.IsNullOrWhiteSpace(request.Artist))
        {
            query = query.Where(c => c.Artist != null && c.Artist.Contains(request.Artist));
        }

        // Price filtering
        if (request.PriceMin.HasValue)
        {
            query = query.Where(c => c.Price >= request.PriceMin.Value);
        }
        if (request.PriceMax.HasValue)
        {
            query = query.Where(c => c.Price <= request.PriceMax.Value);
        }

        // Digital inclusion
        if (!request.IncludeDigital)
        {
            query = query.Where(c => !c.IsDigital);
        }

        // Format legality filtering
        if (request.Formats != null && request.Formats.Length > 0)
        {
            foreach (var format in request.Formats)
            {
                query = query.Where(c => c.Legalities != null &&
                                       c.Legalities.Contains($"\"{format.ToLower()}\":\"legal\""));
            }
        }

        return query;
    }

    private static IQueryable<Card> ApplySorting(IQueryable<Card> query, string sortBy, string direction)
    {
        var ascending = direction.ToLower() == "asc";

        return sortBy.ToLower() switch
        {
            "name" => ascending ? query.OrderBy(c => c.Name) : query.OrderByDescending(c => c.Name),
            "cmc" or "convertedmanacost" => ascending ? query.OrderBy(c => c.ConvertedManaCost) : query.OrderByDescending(c => c.ConvertedManaCost),
            "power" => ascending ? query.OrderBy(c => c.Power) : query.OrderByDescending(c => c.Power),
            "toughness" => ascending ? query.OrderBy(c => c.Toughness) : query.OrderByDescending(c => c.Toughness),
            "set" => ascending ? query.OrderBy(c => c.Set) : query.OrderByDescending(c => c.Set),
            "rarity" => ascending ? query.OrderBy(c => c.Rarity) : query.OrderByDescending(c => c.Rarity),
            "price" => ascending ? query.OrderBy(c => c.Price) : query.OrderByDescending(c => c.Price),
            "created" => ascending ? query.OrderBy(c => c.CreatedAt) : query.OrderByDescending(c => c.CreatedAt),
            _ => query.OrderBy(c => c.Name)
        };
    }

    private static CardDto MapToDto(Card card)
    {
        return new CardDto
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
            Colors = ParseJsonArray(card.Colors),
            ColorIdentity = ParseJsonArray(card.ColorIdentity),
            Keywords = ParseJsonArray(card.Keywords),
            Supertypes = ParseJsonArray(card.Supertypes),
            Subtypes = ParseJsonArray(card.Subtypes),
            Artist = card.Artist,
            FlavorText = card.FlavorText,
            Price = card.Price,
            Legalities = ParseJsonObject(card.Legalities),
            CollectorNumber = card.CollectorNumber,
            IsDigital = card.IsDigital,
            Layout = card.Layout
        };
    }

    private static string[]? ParseJsonArray(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;

        try
        {
            return JsonSerializer.Deserialize<string[]>(json);
        }
        catch
        {
            // Fallback to comma-separated values
            return json.Split(',', StringSplitOptions.RemoveEmptyEntries)
                      .Select(s => s.Trim())
                      .ToArray();
        }
    }

    private static Dictionary<string, string>? ParseJsonObject(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;

        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, string>>(json);
        }
        catch
        {
            return null;
        }
    }
}