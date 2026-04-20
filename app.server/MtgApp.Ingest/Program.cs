using MtgApp.Ingest;
using MtgApp.Infrastructure.Data;

var builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults();

// Add database
builder.AddNpgsqlDbContext<AppDbContext>("mtgapp");

// Add HTTP client for Scryfall API
builder.Services.AddHttpClient("scryfall", client =>
{
    client.BaseAddress = new Uri("https://api.scryfall.com/");
    client.DefaultRequestHeaders.Add("User-Agent", "MtgApp/1.0 (contact@mtgapp.local)");
    client.DefaultRequestHeaders.Add("Accept", "*/*");
});

// Add background service
builder.Services.AddHostedService<SyncScryfallCardsWorker>();

var host = builder.Build();
host.Run();