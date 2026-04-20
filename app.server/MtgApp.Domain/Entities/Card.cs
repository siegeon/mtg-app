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
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}