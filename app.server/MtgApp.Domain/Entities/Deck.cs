namespace MtgApp.Domain.Entities;

public class Deck
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required string Format { get; set; } // Standard, Modern, Legacy, etc.
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<DeckCard> DeckCards { get; set; } = [];
}

public class DeckCard
{
    public int DeckId { get; set; }
    public int CardId { get; set; }
    public int Quantity { get; set; }
    public bool IsMainboard { get; set; } = true; // false for sideboard

    public Deck Deck { get; set; } = null!;
    public Card Card { get; set; } = null!;
}