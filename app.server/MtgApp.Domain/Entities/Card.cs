namespace MtgApp.Domain.Entities;

public class Card
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string ManaCost { get; set; }
    public int ConvertedManaCost { get; set; }
    public required string Type { get; set; }
    public string? Text { get; set; }
    public int? Power { get; set; }
    public int? Toughness { get; set; }
    public required string Set { get; set; }
    public required string Rarity { get; set; }
    public string? ImageUrl { get; set; }

    // Enhanced search properties
    public string? ScryfallId { get; set; }
    public string? Colors { get; set; } // JSON array: ["W","U"] or comma-separated
    public string? ColorIdentity { get; set; } // JSON array: ["W","U"]
    public string? Keywords { get; set; } // JSON array: ["Flying","Vigilance"]
    public string? Supertypes { get; set; } // Legendary, Basic, Snow, etc.
    public string? Subtypes { get; set; } // Human, Wizard, Equipment, etc.
    public string? Artist { get; set; }
    public string? FlavorText { get; set; }
    public decimal? Price { get; set; } // USD price
    public string? Legalities { get; set; } // JSON object: {"standard":"legal","modern":"legal"}
    public string? SetName { get; set; } // Full set name
    public string? CollectorNumber { get; set; }
    public bool IsDigital { get; set; } = false;
    public string? Layout { get; set; } // normal, split, flip, transform, etc.

    // Full-text search field (computed)
    public string? SearchText { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}