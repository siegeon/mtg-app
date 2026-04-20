namespace MtgApp.Domain.Entities;

/// <summary>
/// Represents a user's card collection or binder with inventory tracking and organization
/// </summary>
public class Collection
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public CollectionType Type { get; set; } = CollectionType.Collection;
    public bool IsPublic { get; set; } = false;
    public bool IsTradeAvailable { get; set; } = false;

    // Organization and storage
    public string? PhysicalLocation { get; set; } // "Office desk drawer", "Bedroom closet", etc.
    public string? StorageNotes { get; set; }
    public int? MaxCapacity { get; set; } // For binders/boxes with limited space

    // Computed statistics (updated via triggers or background jobs)
    public int TotalCards { get; set; }
    public int UniqueCards { get; set; }
    public int TotalValue { get; set; } // In cents, sum of all cards at current market price
    public int CostBasis { get; set; } // In cents, what user paid for cards
    public DateTime? LastUpdated { get; set; }
    public DateTime? LastPriceUpdate { get; set; }

    // Collection insights
    public string? TopColors { get; set; } // JSON array of most common colors: ["W","U"]
    public string? TopSets { get; set; } // JSON array of most common sets: ["DOM","RNA"]
    public string? TopRarities { get; set; } // JSON array with counts: [{"rare":45},{"uncommon":123}]
    public decimal AverageCardValue { get; set; } // Average market price per card

    // Import/sync metadata
    public string? ImportSource { get; set; } // "Manual", "BinderScan", "CSV", "MTGO", "Arena"
    public DateTime? LastImportAt { get; set; }
    public string? ExternalId { get; set; } // For syncing with external platforms

    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User User { get; set; } = null!;
    public List<CollectionCard> Cards { get; set; } = [];
    public List<CollectionTag> Tags { get; set; } = [];
    public List<PriceAlert> PriceAlerts { get; set; } = [];

    // Computed properties
    public decimal ProfitLoss => (TotalValue - CostBasis) / 100m;
    public decimal ProfitLossPercentage => CostBasis > 0 ? ((decimal)TotalValue / CostBasis - 1) * 100 : 0;
    public bool IsAtCapacity => MaxCapacity.HasValue && TotalCards >= MaxCapacity;
}

/// <summary>
/// Junction entity representing a specific card in a user's collection with metadata
/// </summary>
public class CollectionCard
{
    public int Id { get; set; }
    public int CollectionId { get; set; }
    public int CardId { get; set; }
    public int Quantity { get; set; }

    // Card condition and variants
    public CardCondition Condition { get; set; } = CardCondition.NearMint;
    public CardLanguage Language { get; set; } = CardLanguage.English;
    public bool IsFoil { get; set; }
    public bool IsAltered { get; set; }
    public bool IsSigned { get; set; }

    // Purchase tracking
    public int? PurchasePrice { get; set; } // In cents, what user paid
    public DateTime? PurchaseDate { get; set; }
    public string? PurchaseSource { get; set; } // "LGS", "TCGPlayer", "Trade", etc.
    public string? PurchaseNotes { get; set; }

    // Physical organization
    public string? PhysicalLocation { get; set; } // "Page 5 slot 3", "Top loader #42"
    public int? PageNumber { get; set; }
    public int? SlotNumber { get; set; }
    public string? StorageNotes { get; set; }

    // For trade/sale
    public bool IsForTrade { get; set; } = false;
    public bool IsForSale { get; set; } = false;
    public int? AskingPrice { get; set; } // In cents, if for sale
    public int? MinTradeValue { get; set; } // In cents, minimum acceptable trade value

    // Activity tracking
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastVerified { get; set; } // When user last confirmed they still have this card
    public string? VerificationNotes { get; set; }

    // Navigation properties
    public Collection Collection { get; set; } = null!;
    public Card Card { get; set; } = null!;
    public List<CollectionCardPrice> PriceHistory { get; set; } = [];

    // Computed properties
    // TODO: Parse USD price from Card.PricesJson when needed
    public int CurrentMarketValue => 0; // Placeholder - will be computed from Card.PricesJson
    public int ProfitLoss => PurchasePrice.HasValue ? CurrentMarketValue - (PurchasePrice.Value * Quantity) : 0;
}

/// <summary>
/// Historical price tracking for collection cards to monitor P&L over time
/// </summary>
public class CollectionCardPrice
{
    public int Id { get; set; }
    public int CollectionCardId { get; set; }
    public int MarketPrice { get; set; } // In cents
    public string PriceSource { get; set; } = "TCGPlayer"; // "TCGPlayer", "CardKingdom", etc.
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;

    public CollectionCard CollectionCard { get; set; } = null!;
}

/// <summary>
/// Tagging system for organizing collections (e.g., "Commander", "Standard Rotation", "High Value")
/// </summary>
public class CollectionTag
{
    public int Id { get; set; }
    public int CollectionId { get; set; }
    public required string Name { get; set; }
    public string? Color { get; set; } // Hex color for UI: "#FF5722"
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Collection Collection { get; set; } = null!;
}

/// <summary>
/// Price monitoring alerts for cards in user collections
/// </summary>
public class PriceAlert
{
    public int Id { get; set; }
    public int CollectionId { get; set; }
    public int CardId { get; set; }
    public int TargetPrice { get; set; } // In cents
    public PriceAlertType AlertType { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsTriggered { get; set; } = false;
    public DateTime? TriggeredAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Collection Collection { get; set; } = null!;
    public Card Card { get; set; } = null!;
}

public enum CollectionType
{
    Collection,      // General collection
    Binder,         // Physical binder with pages
    Deck,           // Cards organized as a deck
    Tradelist,      // Cards available for trade
    Wishlist,       // Cards user wants to acquire
    Storage         // Long-term storage/investment
}

public enum CardCondition
{
    Mint,
    NearMint,
    LightlyPlayed,
    ModeratelyPlayed,
    HeavilyPlayed,
    Damaged
}

public enum CardLanguage
{
    English,
    Spanish,
    French,
    German,
    Italian,
    Portuguese,
    Japanese,
    Korean,
    Russian,
    SimplifiedChinese,
    TraditionalChinese
}

public enum PriceAlertType
{
    Above,          // Alert when price goes above target
    Below,          // Alert when price goes below target
    Change          // Alert on significant price change (% based)
}