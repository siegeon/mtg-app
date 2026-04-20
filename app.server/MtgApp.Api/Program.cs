using MtgApp.Infrastructure.Data;
using MtgApp.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults (Aspire) - production configuration
builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<AppDbContext>("mtgapp");

// Temporary SQLite for MVP testing - now disabled for production
// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseSqlite("Data Source=mtgapp.db"));

// Add services
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddScoped<CardSearchService>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// Ensure database is created and migrated
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        context.Database.Migrate();

        // Seed test data if no decks exist
        if (!context.Decks.Any())
        {
            var testDeck = new MtgApp.Domain.Entities.Deck
            {
                Name = "My Test Deck",
                Description = "Test deck for MVP development",
                Format = "Standard",
                UserId = "test-user",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Decks.Add(testDeck);
            await context.SaveChangesAsync();

            logger.LogInformation("Seeded test deck with ID {DeckId}", testDeck.Id);
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to migrate/seed database on startup");
    }
}

// Configure the HTTP request pipeline
app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();

// Map controllers
app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => Results.Ok("MTG App API is running"));

app.Run();
