namespace MtgApp.Api.Models;

public class DeckDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Format { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<DeckCardDto> Cards { get; set; } = [];
}

public class DeckCardDto
{
    public string ScryfallId { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public bool IsMainboard { get; set; } = true;
    public CardDto? Card { get; set; }
}

public class CreateDeckRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Format { get; set; } = "Standard";
    public string? UserId { get; set; } // Optional - will use default if not provided
}

public class AddCardToDeckRequest
{
    public string ScryfallId { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public bool IsMainboard { get; set; } = true;
}