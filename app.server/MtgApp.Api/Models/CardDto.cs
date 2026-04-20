namespace MtgApp.Api.Models;

public class CardDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ManaCost { get; set; } = string.Empty;
    public int ConvertedManaCost { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Text { get; set; }
    public int? Power { get; set; }
    public int? Toughness { get; set; }
    public string Set { get; set; } = string.Empty;
    public string SetName { get; set; } = string.Empty;
    public string Rarity { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? ScryfallId { get; set; }
    public string[]? Colors { get; set; }
    public string[]? ColorIdentity { get; set; }
    public string[]? Keywords { get; set; }
    public string[]? Supertypes { get; set; }
    public string[]? Subtypes { get; set; }
    public string? Artist { get; set; }
    public string? FlavorText { get; set; }
    public decimal? Price { get; set; }
    public Dictionary<string, string>? Legalities { get; set; }
    public string? CollectorNumber { get; set; }
    public bool IsDigital { get; set; }
    public string? Layout { get; set; }
}

public class CardSearchResponse
{
    public List<CardDto> Cards { get; set; } = [];
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
    public long SearchTimeMs { get; set; }
}