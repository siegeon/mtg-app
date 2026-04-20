using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;

namespace MtgApp.ImageProcessing.Services;

public class ScryfallApiService
{
    private readonly HttpClient _httpClient;
    private readonly ScryfallOptions _options;
    private readonly ILogger<ScryfallApiService> _logger;

    public ScryfallApiService(HttpClient httpClient, IOptions<ScryfallOptions> options, ILogger<ScryfallApiService> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<ScryfallCard?> FindCardAsync(string cardName, string? setCode = null)
    {
        try
        {
            await DelayForRateLimit();

            var searchQuery = $"!\"{cardName}\"";
            if (!string.IsNullOrEmpty(setCode))
            {
                searchQuery += $" set:{setCode}";
            }

            var encodedQuery = Uri.EscapeDataString(searchQuery);
            var url = $"cards/search?q={encodedQuery}&order=released&dir=desc&unique=prints";

            _logger.LogDebug("Searching Scryfall for: {Query}", searchQuery);

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var searchResult = JsonSerializer.Deserialize<ScryfallSearchResult>(jsonResponse, GetJsonOptions());

            var card = searchResult?.Data?.FirstOrDefault();
            if (card != null)
            {
                _logger.LogDebug("Found card: {CardName} ({SetCode})", card.Name, card.Set);
            }
            else
            {
                _logger.LogDebug("No card found for: {CardName}", cardName);
            }

            return card;
        }
        catch (HttpRequestException ex) when (ex.Message.Contains("404"))
        {
            _logger.LogDebug("Card not found in Scryfall: {CardName}", cardName);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching Scryfall for card: {CardName}", cardName);
            return null;
        }
    }

    public async Task<ScryfallCard?> FindCardByNameAndSetAsync(string cardName, string setCode)
    {
        try
        {
            await DelayForRateLimit();

            var encodedName = Uri.EscapeDataString(cardName);
            var encodedSet = Uri.EscapeDataString(setCode);
            var url = $"cards/named?exact={encodedName}&set={encodedSet}";

            _logger.LogDebug("Getting specific card: {CardName} from {SetCode}", cardName, setCode);

            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogDebug("Card not found: {CardName} in {SetCode}", cardName, setCode);
                return null;
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var card = JsonSerializer.Deserialize<ScryfallCard>(jsonResponse, GetJsonOptions());

            if (card != null)
            {
                _logger.LogDebug("Found specific card: {CardName} ({SetCode})", card.Name, card.Set);
            }

            return card;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting specific card from Scryfall: {CardName} in {SetCode}", cardName, setCode);
            return null;
        }
    }

    public async Task<List<ScryfallCard>> SearchCardsAsync(string query, int maxResults = 100)
    {
        try
        {
            await DelayForRateLimit();

            var encodedQuery = Uri.EscapeDataString(query);
            var url = $"cards/search?q={encodedQuery}&order=name&unique=cards";

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var searchResult = JsonSerializer.Deserialize<ScryfallSearchResult>(jsonResponse, GetJsonOptions());

            var cards = searchResult?.Data ?? [];
            if (maxResults > 0 && cards.Count > maxResults)
            {
                cards = cards.Take(maxResults).ToList();
            }

            _logger.LogDebug("Found {Count} cards for query: {Query}", cards.Count, query);
            return cards;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching Scryfall: {Query}", query);
            return [];
        }
    }

    public async Task<List<string>> GetSuggestionsAsync(string partialName)
    {
        try
        {
            await DelayForRateLimit();

            var encodedQuery = Uri.EscapeDataString(partialName);
            var url = $"cards/autocomplete?q={encodedQuery}";

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var suggestions = JsonSerializer.Deserialize<ScryfallAutocomplete>(jsonResponse, GetJsonOptions());

            return suggestions?.Data ?? [];
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting suggestions from Scryfall: {PartialName}", partialName);
            return [];
        }
    }

    private async Task DelayForRateLimit()
    {
        if (_options.RateLimitDelayMs > 0)
        {
            await Task.Delay(_options.RateLimitDelayMs);
        }
    }

    private static JsonSerializerOptions GetJsonOptions() => new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
    };
}

// Scryfall API models
public class ScryfallSearchResult
{
    public List<ScryfallCard> Data { get; set; } = [];
    public bool HasMore { get; set; }
    public string? NextPage { get; set; }
    public int TotalCards { get; set; }
}

public class ScryfallAutocomplete
{
    public List<string> Data { get; set; } = [];
}

public class ScryfallCard
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Uri { get; set; } = string.Empty;
    public string ScryfallUri { get; set; } = string.Empty;
    public string Set { get; set; } = string.Empty;
    public string SetName { get; set; } = string.Empty;
    public string? ManaCost { get; set; }
    public double? Cmc { get; set; }
    public string TypeLine { get; set; } = string.Empty;
    public string? OracleText { get; set; }
    public string? Power { get; set; }
    public string? Toughness { get; set; }
    public string Rarity { get; set; } = string.Empty;
    public ScryfallImageUris? ImageUris { get; set; }
    public List<string> Colors { get; set; } = [];
    public List<string> ColorIdentity { get; set; } = [];
    public Dictionary<string, string> Prices { get; set; } = [];
    public DateTime ReleasedAt { get; set; }
}

public class ScryfallImageUris
{
    public string? Small { get; set; }
    public string? Normal { get; set; }
    public string? Large { get; set; }
    public string? Png { get; set; }
    public string? ArtCrop { get; set; }
    public string? BorderCrop { get; set; }
}