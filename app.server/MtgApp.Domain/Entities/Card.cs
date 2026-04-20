namespace MtgApp.Domain.Entities;

public class Card
{
    /// <summary>
    /// Scryfall UUID - primary key
    /// </summary>
    public required Guid Id { get; set; }

    /// <summary>
    /// Oracle ID - groups printings of the same card
    /// </summary>
    public required Guid OracleId { get; set; }

    /// <summary>
    /// Card name
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Mana cost (e.g. "{1}{W}{U}")
    /// </summary>
    public string? ManaCost { get; set; }

    /// <summary>
    /// Converted mana cost / mana value
    /// </summary>
    public decimal Cmc { get; set; }

    /// <summary>
    /// Type line (e.g. "Legendary Creature — Human Wizard")
    /// </summary>
    public required string TypeLine { get; set; }

    /// <summary>
    /// Card colors as array (e.g. ["W","U"])
    /// </summary>
    public string[] Colors { get; set; } = [];

    /// <summary>
    /// Card rarity (common, uncommon, rare, mythic)
    /// </summary>
    public required string Rarity { get; set; }

    /// <summary>
    /// Set code (e.g. "NEO")
    /// </summary>
    public required string SetCode { get; set; }

    /// <summary>
    /// Image URIs as JSONB (small, normal, large, png, art_crop, border_crop)
    /// </summary>
    public required string ImageUrisJson { get; set; }

    /// <summary>
    /// Prices as JSONB (usd, usd_foil, eur, eur_foil, tix)
    /// </summary>
    public required string PricesJson { get; set; }

    /// <summary>
    /// Bulk data timestamp for idempotency
    /// </summary>
    public required string BulkDataTimestamp { get; set; }

    /// <summary>
    /// Last updated timestamp
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}