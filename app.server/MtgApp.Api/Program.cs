using MtgApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults (Aspire)
builder.AddServiceDefaults();

// Add database
builder.AddNpgsqlDbContext<AppDbContext>("mtgdb");

// Add services
builder.Services.AddOpenApi();
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

// Configure the HTTP request pipeline
app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();

// Health check endpoint
app.MapGet("/health", () => Results.Ok("MTG App API is running"));

// Sample MTG endpoint
app.MapGet("/api/cards", () =>
{
    return Results.Ok(new[]
    {
        new { Id = 1, Name = "Lightning Bolt", ManaCost = "R", Type = "Instant" },
        new { Id = 2, Name = "Counterspell", ManaCost = "UU", Type = "Instant" },
        new { Id = 3, Name = "Giant Growth", ManaCost = "G", Type = "Instant" },
    });
}).WithName("GetCards").WithOpenApi();

app.Run();
