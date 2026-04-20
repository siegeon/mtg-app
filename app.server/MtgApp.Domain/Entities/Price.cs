namespace MtgApp.Domain.Entities;

/// <summary>
/// Historical pricing data for MTG cards across multiple vendors and conditions
/// </summary>
public class Price
{
    public int Id { get; set; }
    public int CardId { get; set; }
    public required string Vendor { get; set; } // "TCGPlayer", "CardKingdom", "Cardmarket", etc.
    public required string ProductType { get; set; } // "Normal", "Foil"
    public required string Condition { get; set; } // "Near Mint", "Lightly Played", etc.

    // Price data (all in cents for precision)
    public int? Low { get; set; }           // Lowest available price
    public int? Market { get; set; }        // Market average/median price
    public int? Median { get; set; }        // Median price
    public int? High { get; set; }          // Highest recent price
    public int? Direct { get; set; }        // Direct vendor price (CardKingdom, etc.)
    public int? Buylist { get; set; }       // What vendors pay to buy the card

    // Volume and availability
    public int? ListingCount { get; set; }  // Number of listings available
    public int? SalesCount { get; set; }    // Number of recent sales (last 30 days)
    public decimal? AvailableQuantity { get; set; } // Total quantity available

    // Trend indicators
    public decimal? PriceChange24h { get; set; }     // Price change in last 24h (%)
    public decimal? PriceChange7d { get; set; }      // Price change in last 7 days (%)
    public decimal? PriceChange30d { get; set; }     // Price change in last 30 days (%)
    public decimal? Volatility { get; set; }         // Price volatility score (0-100)

    // Data quality and freshness
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ValidUntil { get; set; }        // When this price data expires
    public bool IsStale { get; set; } = false;       // Whether data is considered outdated
    public string? DataSource { get; set; }          // API endpoint or scraper used
    public string? Currency { get; set; } = "USD";   // Currency code

    // Vendor-specific metadata
    public string? VendorProductId { get; set; }     // External product ID
    public string? VendorUrl { get; set; }           // Direct link to vendor listing
    public string? VendorConditionNotes { get; set; } // Vendor-specific condition description

    // Navigation properties
    public Card Card { get; set; } = null!;
    public List<PriceHistory> History { get; set; } = [];
}

/// <summary>
/// Long-term historical price tracking for market analysis and trends
/// </summary>
public class PriceHistory
{
    public int Id { get; set; }
    public int CardId { get; set; }
    public required string Vendor { get; set; }
    public required string ProductType { get; set; }
    public required string Condition { get; set; }

    // Snapshot data (in cents)
    public int Market { get; set; }          // Market price at this point in time
    public int? Low { get; set; }            // Low price at this point
    public int? High { get; set; }           // High price at this point
    public int? Volume { get; set; }         // Sales volume

    // Time series data
    public DateTime Date { get; set; }       // Date of this price point (daily aggregation)
    public string Period { get; set; } = "daily"; // "hourly", "daily", "weekly", "monthly"

    // Market events and context
    public string? EventContext { get; set; } // "Tournament spike", "Reprint announcement", etc.
    public bool IsAnomalous { get; set; } = false; // Outlier data point to exclude from trends

    // Navigation properties
    public Card Card { get; set; } = null!;
}

/// <summary>
/// Market analysis and insights for cards with significant price movements
/// </summary>
public class MarketInsight
{
    public int Id { get; set; }
    public int CardId { get; set; }
    public required string InsightType { get; set; } // "spike", "crash", "reprint", "rotation"
    public required string Title { get; set; }
    public required string Summary { get; set; }
    public string? FullAnalysis { get; set; }

    // Metrics
    public decimal PriceChangePercent { get; set; }
    public int PriceChangeCents { get; set; }
    public DateTime TriggerDate { get; set; }        // When the price movement started
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Confidence and relevance
    public decimal Confidence { get; set; } = 1.0m; // 0.0-1.0, how confident we are in this insight
    public InsightRelevance Relevance { get; set; } = InsightRelevance.Medium;
    public bool IsActive { get; set; } = true;       // Whether this insight is still relevant

    // Sources and attribution
    public string? DataSources { get; set; }         // JSON array of sources used
    public string? ExternalLinks { get; set; }       // JSON array of relevant links
    public string? Tags { get; set; }                // JSON array: ["tournament", "cedh", "reprint"]

    // Navigation properties
    public Card Card { get; set; } = null!;
}

/// <summary>
/// Price monitoring and alert system configuration
/// </summary>
public class PriceMonitor
{
    public int Id { get; set; }
    public int CardId { get; set; }
    public bool IsActive { get; set; } = true;

    // Monitoring configuration
    public int CheckIntervalMinutes { get; set; } = 60; // How often to check prices
    public string MonitoredVendors { get; set; } = "[]"; // JSON array of vendors to monitor
    public string MonitoredConditions { get; set; } = "[]"; // JSON array of conditions

    // Alert thresholds
    public decimal? SpikeThresholdPercent { get; set; } = 20m; // Alert on 20%+ increase
    public decimal? CrashThresholdPercent { get; set; } = 20m; // Alert on 20%+ decrease
    public int? AlertCooldownHours { get; set; } = 24; // Minimum time between alerts

    // Status
    public DateTime? LastChecked { get; set; }
    public DateTime? LastAlert { get; set; }
    public int AlertCount { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Card Card { get; set; } = null!;
    public List<PriceAlertEvent> AlertEvents { get; set; } = [];
}

/// <summary>
/// Individual price alert events for audit trail
/// </summary>
public class PriceAlertEvent
{
    public int Id { get; set; }
    public int PriceMonitorId { get; set; }
    public required string AlertType { get; set; } // "spike", "crash", "threshold"
    public required string Message { get; set; }

    // Price data
    public int OldPrice { get; set; }               // Price before change (cents)
    public int NewPrice { get; set; }               // Price after change (cents)
    public decimal ChangePercent { get; set; }      // Percentage change
    public required string Vendor { get; set; }

    // Event metadata
    public DateTime TriggeredAt { get; set; } = DateTime.UtcNow;
    public bool WasNotified { get; set; } = false; // Whether users were actually notified
    public string? NotificationChannels { get; set; } // JSON array: ["email", "push", "discord"]

    // Navigation properties
    public PriceMonitor PriceMonitor { get; set; } = null!;
}

public enum InsightRelevance
{
    Low,        // Minor price movement or niche interest
    Medium,     // Moderate interest, affects some players
    High,       // High interest, affects many players
    Critical    // Major market event, affects entire format
}