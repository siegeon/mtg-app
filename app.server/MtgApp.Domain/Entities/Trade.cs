namespace MtgApp.Domain.Entities;

/// <summary>
/// Represents a trade proposal between two users in the MTG app marketplace
/// </summary>
public class Trade
{
    public int Id { get; set; }
    public int InitiatorId { get; set; }               // User who proposed the trade
    public int TargetId { get; set; }                  // User receiving the trade proposal
    public required string Title { get; set; }         // "Commander Cards for Modern Staples"
    public string? Message { get; set; }               // Initial message from initiator
    public TradeStatus Status { get; set; } = TradeStatus.Proposed;

    // Trade type and scope
    public TradeType Type { get; set; } = TradeType.CardForCard;
    public bool AllowPartial { get; set; } = false;    // Allow partial fulfillment
    public bool RequiresShipping { get; set; } = true; // Local vs. shipped trade
    public string? Location { get; set; }              // For local trades: "Austin, TX"

    // Value tracking (in cents)
    public int InitiatorValue { get; set; }            // Total value of initiator's offer
    public int TargetValue { get; set; }               // Total value of target's request
    public int ValueDifference => Math.Abs(InitiatorValue - TargetValue);
    public decimal ValueDifferencePercent => TargetValue > 0
        ? (decimal)ValueDifference / TargetValue * 100 : 0;

    // Trade terms and conditions
    public string? ShippingTerms { get; set; }         // "PWE", "Tracking", "Each pays own"
    public string? ConditionRequirements { get; set; } // "NM only", "LP or better"
    public string? AdditionalTerms { get; set; }       // Custom terms from users
    public int? CashAdjustment { get; set; }           // Cash to balance trade (cents)
    public int ExpirationDays { get; set; } = 7;       // Days until trade expires

    // Important dates
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? AcceptedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public DateTime? ShippedAt { get; set; }
    public DateTime? ReceivedAt { get; set; }

    // Feedback and ratings
    public int? InitiatorRating { get; set; }          // 1-5 stars from target
    public int? TargetRating { get; set; }             // 1-5 stars from initiator
    public string? InitiatorFeedback { get; set; }     // Text feedback from target
    public string? TargetFeedback { get; set; }        // Text feedback from initiator

    // Navigation properties
    public User Initiator { get; set; } = null!;
    public User Target { get; set; } = null!;
    public List<TradeItem> InitiatorItems { get; set; } = [];
    public List<TradeItem> TargetItems { get; set; } = [];
    public List<TradeMessage> Messages { get; set; } = [];
    public List<TradeEvent> Events { get; set; } = [];

    // Computed properties
    public bool IsExpired => DateTime.UtcNow > ExpiresAt;
    public bool IsActive => Status == TradeStatus.Proposed || Status == TradeStatus.Negotiating;
    public bool IsCompleted => Status == TradeStatus.Completed;
    public TimeSpan TimeRemaining => ExpiresAt > DateTime.UtcNow ? ExpiresAt - DateTime.UtcNow : TimeSpan.Zero;
}

/// <summary>
/// Individual cards/items being offered or requested in a trade
/// </summary>
public class TradeItem
{
    public int Id { get; set; }
    public int TradeId { get; set; }
    public int CardId { get; set; }
    public bool IsFromInitiator { get; set; }          // true = initiator's offer, false = target's offer
    public int Quantity { get; set; }
    public int EstimatedValue { get; set; }            // In cents, at time of trade proposal

    // Card details and preferences
    public CardCondition MinCondition { get; set; } = CardCondition.NearMint;
    public CardCondition? OfferedCondition { get; set; }
    public bool PreferFoil { get; set; } = false;
    public bool AcceptFoil { get; set; } = true;
    public CardLanguage PreferredLanguage { get; set; } = CardLanguage.English;
    public string? SpecialRequests { get; set; }       // "Artist signed", "From specific set"

    // Status tracking
    public TradeItemStatus Status { get; set; } = TradeItemStatus.Proposed;
    public string? Notes { get; set; }                 // Additional notes from user
    public DateTime? ConfirmedAt { get; set; }         // When both parties agreed to this item

    public Trade Trade { get; set; } = null!;
    public Card Card { get; set; } = null!;
}

/// <summary>
/// Message thread for trade negotiations
/// </summary>
public class TradeMessage
{
    public int Id { get; set; }
    public int TradeId { get; set; }
    public int SenderId { get; set; }
    public required string Message { get; set; }
    public MessageType Type { get; set; } = MessageType.Text;
    public bool IsSystemMessage { get; set; } = false; // Auto-generated system messages
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReadAt { get; set; }

    // Attachments
    public string? ImageUrl { get; set; }              // Photo of cards
    public string? AttachmentUrl { get; set; }         // Other file attachments

    public Trade Trade { get; set; } = null!;
    public User Sender { get; set; } = null!;
}

/// <summary>
/// Audit trail of trade events and status changes
/// </summary>
public class TradeEvent
{
    public int Id { get; set; }
    public int TradeId { get; set; }
    public int? UserId { get; set; }                   // Null for system events
    public required string EventType { get; set; }     // "proposed", "accepted", "modified", etc.
    public required string Description { get; set; }   // Human readable description
    public string? Metadata { get; set; }             // JSON metadata about the event
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;

    public Trade Trade { get; set; } = null!;
    public User? User { get; set; }
}

/// <summary>
/// User trading preferences and reputation system
/// </summary>
public class TradingProfile
{
    public int Id { get; set; }
    public int UserId { get; set; }

    // Trading preferences
    public bool AcceptsLocalTrades { get; set; } = true;
    public bool AcceptsShippedTrades { get; set; } = true;
    public int MaxTradeValue { get; set; } = 100000;   // Max trade value in cents ($1000)
    public int MinTradeValue { get; set; } = 1000;     // Min trade value in cents ($10)
    public string PreferredShipping { get; set; } = "Tracking"; // "PWE", "Tracking", "Express"
    public string? ShippingAddress { get; set; }       // JSON object with address
    public string? References { get; set; }            // External trading references

    // Reputation and statistics
    public int TotalTrades { get; set; }
    public int SuccessfulTrades { get; set; }
    public int CancelledTrades { get; set; }
    public int DisputedTrades { get; set; }
    public decimal AverageRating { get; set; }
    public int TotalRatings { get; set; }
    public decimal TotalTradeValue { get; set; }        // Lifetime trade value
    public DateTime? LastTradeAt { get; set; }
    public DateTime? JoinedTradingAt { get; set; } = DateTime.UtcNow;

    // Trust and verification
    public bool IsVerified { get; set; } = false;      // Phone/ID verified
    public bool IsTrustedTrader { get; set; } = false; // High reputation
    public string? VerificationNotes { get; set; }     // Admin notes about verification
    public DateTime? VerifiedAt { get; set; }

    // Preferences
    public string PreferredFormats { get; set; } = "[]"; // JSON array of formats they collect
    public string WantlistTags { get; set; } = "[]";   // JSON array of what they're looking for
    public string TradelistTags { get; set; } = "[]";  // JSON array of what they have
    public bool AutoAcceptFairTrades { get; set; } = false; // Auto-accept trades within 5% value

    public User User { get; set; } = null!;

    // Computed properties
    public decimal SuccessRate => TotalTrades > 0 ? (decimal)SuccessfulTrades / TotalTrades * 100 : 0;
    public bool IsNewTrader => TotalTrades < 5;
    public bool IsExperiencedTrader => TotalTrades >= 25 && AverageRating >= 4.5m;
}

public enum TradeStatus
{
    Proposed,           // Initial proposal
    Negotiating,        // Back and forth on terms
    Accepted,           // Both parties agreed
    Shipped,           // Cards sent
    Completed,         // Trade finished successfully
    Cancelled,         // Trade cancelled by either party
    Expired,           // Trade expired without acceptance
    Disputed           // Trade in dispute resolution
}

public enum TradeType
{
    CardForCard,        // Straight card trade
    CardForCash,        // Selling cards
    CashForCard,        // Buying cards
    Mixed               // Cards + cash both directions
}

public enum TradeItemStatus
{
    Proposed,           // Initially proposed
    Accepted,           // Accepted by other party
    Rejected,           // Rejected by other party
    Modified,           // Counter-proposal made
    Confirmed           // Final agreement reached
}

public enum MessageType
{
    Text,               // Regular text message
    CounterOffer,       // Proposed changes to trade
    Image,              // Photo attachment
    SystemUpdate,       // Automated system message
    Shipping           // Shipping/tracking info
}