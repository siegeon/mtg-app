namespace MtgApp.Domain.Entities;

/// <summary>
/// Magic: The Gathering game formats and their rules/restrictions
/// </summary>
public class Format
{
    public int Id { get; set; }
    public required string Name { get; set; }           // "Standard", "Modern", "Commander", etc.
    public required string Code { get; set; }           // "standard", "modern", "commander"
    public string? DisplayName { get; set; }            // "Standard Constructed"
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }       // Brief one-liner

    // Format characteristics
    public FormatType Type { get; set; }
    public int MinDeckSize { get; set; } = 60;
    public int? MaxDeckSize { get; set; }
    public int MaxCopies { get; set; } = 4;             // Max copies of a card
    public int SideboardSize { get; set; } = 15;
    public bool AllowsSideboard { get; set; } = true;

    // Special rules
    public bool IsEternal { get; set; } = false;        // Never rotates (Legacy, Vintage, etc.)
    public bool HasRotation { get; set; } = false;     // Rotates sets (Standard)
    public bool IsMultiplayer { get; set; } = false;   // Commander, etc.
    public int? StartingLifeTotal { get; set; } = 20;
    public string? SpecialRules { get; set; }           // JSON array of special rules

    // Legality and status
    public bool IsActive { get; set; } = true;          // Currently supported by WotC
    public bool IsDigital { get; set; } = false;       // MTGO/Arena only format
    public bool IsPaper { get; set; } = true;          // Playable in paper
    public DateTime? LaunchDate { get; set; }
    public DateTime? LastRotation { get; set; }
    public DateTime? NextRotation { get; set; }

    // Meta information
    public string? IconUrl { get; set; }                // Format icon/symbol
    public string? BannerUrl { get; set; }              // Format banner image
    public string? Color { get; set; }                  // Brand color (hex)
    public int PopularityRank { get; set; }             // 1 = most popular
    public decimal CompetitivenessScore { get; set; }   // 0-100, how competitive/spikey

    // External links
    public string? OfficialUrl { get; set; }            // WotC format page
    public string? WikiUrl { get; set; }                // MTG Wiki page
    public string? MetaUrl { get; set; }                // MTGTop8, EDHRec, etc.

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public List<FormatLegality> Legalities { get; set; } = [];
    public List<FormatBanlistEntry> Banlist { get; set; } = [];
    public List<SetLegality> SetLegalities { get; set; } = [];
    public List<Deck> Decks { get; set; } = [];

    // Computed properties
    public bool IsRotating => HasRotation && NextRotation.HasValue && NextRotation > DateTime.UtcNow;
}

/// <summary>
/// Card legality status within specific formats
/// </summary>
public class FormatLegality
{
    public int Id { get; set; }
    public int FormatId { get; set; }
    public int CardId { get; set; }
    public LegalityStatus Status { get; set; }
    public DateTime EffectiveDate { get; set; } = DateTime.UtcNow;
    public DateTime? ExpirationDate { get; set; }       // When this legality expires (for temp bans)
    public string? Notes { get; set; }                  // Reason for ban/restriction

    public Format Format { get; set; } = null!;
    public Card Card { get; set; } = null!;
}

/// <summary>
/// Banlist and restricted list entries for formats
/// </summary>
public class FormatBanlistEntry
{
    public int Id { get; set; }
    public int FormatId { get; set; }
    public int CardId { get; set; }
    public BanlistType Type { get; set; }
    public DateTime BannedDate { get; set; }
    public DateTime? UnbannedDate { get; set; }
    public string? Reason { get; set; }                 // Official reason for ban
    public string? AnnouncementUrl { get; set; }        // Link to WotC announcement

    // Metadata for tracking
    public bool IsActive => UnbannedDate == null || UnbannedDate > DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Format Format { get; set; } = null!;
    public Card Card { get; set; } = null!;
}

/// <summary>
/// Set legality in specific formats (for rotation tracking)
/// </summary>
public class SetLegality
{
    public int Id { get; set; }
    public int FormatId { get; set; }
    public required string SetCode { get; set; }        // "DOM", "RNA", etc.
    public required string SetName { get; set; }        // "Dominaria"
    public DateTime LegalDate { get; set; }             // When set becomes legal
    public DateTime? RotationDate { get; set; }         // When set rotates out
    public bool IsLegal => DateTime.UtcNow >= LegalDate &&
                          (RotationDate == null || DateTime.UtcNow < RotationDate);

    public Format Format { get; set; } = null!;
}

/// <summary>
/// Format meta snapshots for tracking popular decks and cards over time
/// </summary>
public class FormatMeta
{
    public int Id { get; set; }
    public int FormatId { get; set; }
    public DateTime SnapshotDate { get; set; }
    public string Period { get; set; } = "weekly";      // "daily", "weekly", "monthly"

    // Meta statistics
    public int TotalDecks { get; set; }                 // Number of decks in sample
    public int UniqueArchetypes { get; set; }           // Number of distinct archetypes
    public string TopArchetypes { get; set; } = "[]";  // JSON array with win rates
    public string TopCards { get; set; } = "[]";       // JSON array of most played cards
    public string TopWinRateCards { get; set; } = "[]"; // JSON array of best performing cards

    // Diversity metrics
    public decimal ArchetypeDiversity { get; set; }     // Shannon diversity index
    public decimal MetaShare { get; set; }              // % of meta held by top deck
    public bool IsHealthy { get; set; } = true;        // Whether meta is considered healthy

    // Data sources
    public string DataSources { get; set; } = "[]";    // JSON array of sources
    public int SampleSize { get; set; }                // Number of tournaments/games

    public Format Format { get; set; } = null!;
}

public enum FormatType
{
    Constructed,        // 60+ card constructed formats
    Limited,           // Draft, Sealed
    Casual,            // Kitchen table, multiplayer variants
    Digital,           // MTGO/Arena exclusive formats
    Multiplayer,       // Commander, Two-Headed Giant
    Variant            // Cube, custom formats
}

public enum LegalityStatus
{
    Legal,
    Banned,
    Restricted,        // Limited to 1 copy (Vintage)
    Suspended          // Temporarily banned pending investigation
}

public enum BanlistType
{
    Banned,            // Completely banned
    Restricted,        // Limited to 1 copy
    Watchlist,         // Under monitoring for potential ban
    Emergency,         // Emergency ban (effective immediately)
    Suspended          // Suspended pending investigation
}