namespace MtgApp.Api.Models;

public class CardSearchRequest
{
    public string? Query { get; set; }
    public string? Name { get; set; }
    public string? Type { get; set; }
    public string[]? Colors { get; set; }
    public string[]? ColorIdentity { get; set; }
    public string? Set { get; set; }
    public string? Rarity { get; set; }
    public int? ConvertedManaCostMin { get; set; }
    public int? ConvertedManaCostMax { get; set; }
    public int? PowerMin { get; set; }
    public int? PowerMax { get; set; }
    public int? ToughnessMin { get; set; }
    public int? ToughnessMax { get; set; }
    public string[]? Keywords { get; set; }
    public string[]? Formats { get; set; } // legal formats
    public string? Artist { get; set; }
    public decimal? PriceMin { get; set; }
    public decimal? PriceMax { get; set; }
    public bool IncludeDigital { get; set; } = true;

    // Pagination
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 25;

    // Sorting
    public string SortBy { get; set; } = "name";
    public string SortDirection { get; set; } = "asc";
}