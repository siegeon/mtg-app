using System.ComponentModel.DataAnnotations;

namespace MtgApp.Domain.Entities;

/// <summary>
/// Represents a user in the MTG app ecosystem with authentication, profiles, and social features
/// </summary>
public class User
{
    public int Id { get; set; }

    // Authentication properties (ASP.NET Core Identity will extend this)
    public required string Email { get; set; }
    public required string UserName { get; set; }
    public string? PasswordHash { get; set; } // Managed by Identity
    public bool EmailConfirmed { get; set; }
    public string? PhoneNumber { get; set; }
    public bool PhoneNumberConfirmed { get; set; }
    public bool TwoFactorEnabled { get; set; }
    public DateTimeOffset? LockoutEnd { get; set; }
    public bool LockoutEnabled { get; set; }
    public int AccessFailedCount { get; set; }

    // Profile information
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? DisplayName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public string? Location { get; set; }
    public string? TimeZone { get; set; }

    // MTG-specific profile
    public string? PreferredFormats { get; set; } // JSON array: ["Standard","Modern","Commander"]
    public string? FavoriteColors { get; set; } // JSON array: ["W","U","R"]
    public string? FavoriteArchetypes { get; set; } // JSON array: ["Control","Aggro"]
    public PlayerExperienceLevel ExperienceLevel { get; set; } = PlayerExperienceLevel.Beginner;
    public DateTime? StartedPlayingDate { get; set; }

    // Social and community features
    public bool IsPublicProfile { get; set; } = true;
    public bool AllowDeckSharing { get; set; } = true;
    public bool AllowCollectionSharing { get; set; } = false;
    public bool AllowTradeRequests { get; set; } = true;
    public bool EmailNotifications { get; set; } = true;
    public bool PushNotifications { get; set; } = true;

    // Premium features
    public SubscriptionTier SubscriptionTier { get; set; } = SubscriptionTier.Free;
    public DateTime? SubscriptionExpiresAt { get; set; }
    public DateTime? TrialStartedAt { get; set; }
    public DateTime? TrialEndsAt { get; set; }

    // Activity and analytics
    public int TotalDecks { get; set; }
    public int TotalCollectionValue { get; set; } // Cached total collection value in cents
    public DateTime? LastLoginAt { get; set; }
    public DateTime? LastActiveAt { get; set; }
    public int LoginCount { get; set; }

    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public List<Deck> Decks { get; set; } = [];
    public List<Collection> Collections { get; set; } = [];
    public List<Trade> TradesAsInitiator { get; set; } = [];
    public List<Trade> TradesAsTarget { get; set; } = [];
    public List<UserFollowing> Following { get; set; } = [];
    public List<UserFollowing> Followers { get; set; } = [];
    public List<BinderScan> BinderScans { get; set; } = [];

    // Computed properties
    public string FullName => !string.IsNullOrEmpty(FirstName) && !string.IsNullOrEmpty(LastName)
        ? $"{FirstName} {LastName}"
        : DisplayName ?? UserName;

    public bool IsTrialActive => TrialEndsAt.HasValue && TrialEndsAt > DateTime.UtcNow;
    public bool IsSubscriptionActive => SubscriptionExpiresAt.HasValue && SubscriptionExpiresAt > DateTime.UtcNow;
    public bool IsPremium => IsSubscriptionActive || IsTrialActive;
}

/// <summary>
/// User following/follower relationships for social features
/// </summary>
public class UserFollowing
{
    public int FollowerId { get; set; }
    public int FollowingId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Follower { get; set; } = null!;
    public User Following { get; set; } = null!;
}

public enum PlayerExperienceLevel
{
    Beginner,        // 0-1 years
    Intermediate,    // 1-3 years
    Advanced,        // 3-7 years
    Expert,          // 7+ years
    Professional     // Competitive/Pro level
}

public enum SubscriptionTier
{
    Free,
    Premium,         // Advanced features, unlimited decks, collection tracking
    Pro,            // AI recommendations, market insights, premium support
    Enterprise      // Team features, advanced analytics
}