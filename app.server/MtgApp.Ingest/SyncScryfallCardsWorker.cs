using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using MtgApp.Infrastructure.Data;
using MtgApp.Domain.Entities;
using System.Diagnostics.Metrics;
using System.Diagnostics;

namespace MtgApp.Ingest;

public class SyncScryfallCardsWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<SyncScryfallCardsWorker> _logger;
    private readonly Counter<int> _cardsUpsertedCounter;
    private readonly Gauge<long> _lastSuccessGauge;
    private readonly Histogram<double> _runDurationHistogram;

    public SyncScryfallCardsWorker(
        IServiceProvider serviceProvider,
        IHttpClientFactory httpClientFactory,
        ILogger<SyncScryfallCardsWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _httpClientFactory = httpClientFactory;
        _logger = logger;

        // Initialize metrics
        var meter = new Meter("MtgApp.Ingest");
        _cardsUpsertedCounter = meter.CreateCounter<int>("mtg_ingest_cards_upserted_total", "cards", "Number of cards upserted");
        _lastSuccessGauge = meter.CreateGauge<long>("mtg_ingest_last_success_unix_seconds", "seconds", "Last successful sync timestamp");
        _runDurationHistogram = meter.CreateHistogram<double>("mtg_ingest_run_duration_seconds", "seconds", "Duration of sync runs");
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Run immediately on startup, then every 12 hours
        await RunSyncJob(stoppingToken);

        using var timer = new PeriodicTimer(TimeSpan.FromHours(12));

        while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
        {
            await RunSyncJob(stoppingToken);
        }
    }

    private async Task RunSyncJob(CancellationToken cancellationToken)
    {
        var stopwatch = Stopwatch.StartNew();
        try
        {
            _logger.LogInformation("Starting Scryfall sync");

            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var httpClient = _httpClientFactory.CreateClient("scryfall");

            // 1. Get bulk data info from Scryfall
            var bulkDataResponse = await httpClient.GetAsync("bulk-data", cancellationToken);
            bulkDataResponse.EnsureSuccessStatusCode();

            var bulkDataJson = await bulkDataResponse.Content.ReadAsStringAsync(cancellationToken);
            var bulkDataInfo = JsonSerializer.Deserialize<BulkDataResponse>(bulkDataJson);

            var defaultCardsEntry = bulkDataInfo?.Data?.FirstOrDefault(d => d.Type == "default_cards");
            if (defaultCardsEntry == null)
            {
                _logger.LogWarning("No default_cards bulk data found");
                return;
            }

            // 2. Check if we already have this timestamp
            var existingCard = await dbContext.Cards
                .Where(c => c.BulkDataTimestamp == defaultCardsEntry.UpdatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            if (existingCard != null)
            {
                _logger.LogInformation("Bulk data {Timestamp} already processed, skipping", defaultCardsEntry.UpdatedAt);
                return;
            }

            _logger.LogInformation("Downloading bulk data from {Url} (updated: {Timestamp})",
                defaultCardsEntry.DownloadUri, defaultCardsEntry.UpdatedAt);

            // 3. Download and process the bulk data
            var downloadResponse = await httpClient.GetAsync(defaultCardsEntry.DownloadUri, cancellationToken);
            downloadResponse.EnsureSuccessStatusCode();

            var cardStream = await downloadResponse.Content.ReadAsStreamAsync(cancellationToken);
            var cardsAsyncEnumerable = JsonSerializer.DeserializeAsyncEnumerable<ScryfallCard>(cardStream, cancellationToken: cancellationToken);

            // 4. Upsert cards in batches
            var cardBatch = new List<Card>();
            var totalUpserted = 0;

            await foreach (var scryfallCard in cardsAsyncEnumerable)
            {
                if (scryfallCard == null) continue;

                var card = new Card
                {
                    Id = Guid.Parse(scryfallCard.Id),
                    OracleId = Guid.Parse(scryfallCard.OracleId),
                    Name = scryfallCard.Name,
                    ManaCost = scryfallCard.ManaCost,
                    Cmc = scryfallCard.Cmc,
                    TypeLine = scryfallCard.TypeLine,
                    Colors = scryfallCard.Colors?.ToArray() ?? [],
                    Rarity = scryfallCard.Rarity,
                    SetCode = scryfallCard.Set,
                    ImageUrisJson = JsonSerializer.Serialize(scryfallCard.ImageUris ?? new object()),
                    PricesJson = JsonSerializer.Serialize(scryfallCard.Prices ?? new object()),
                    BulkDataTimestamp = defaultCardsEntry.UpdatedAt,
                    UpdatedAt = DateTime.UtcNow
                };

                cardBatch.Add(card);

                // Process in batches of 1000
                if (cardBatch.Count >= 1000)
                {
                    await UpsertCardBatch(dbContext, cardBatch, cancellationToken);
                    totalUpserted += cardBatch.Count;
                    cardBatch.Clear();

                    _logger.LogInformation("Upserted {Count} cards (total: {Total})", 1000, totalUpserted);
                }
            }

            // Process remaining cards
            if (cardBatch.Count > 0)
            {
                await UpsertCardBatch(dbContext, cardBatch, cancellationToken);
                totalUpserted += cardBatch.Count;
            }

            // Record metrics
            _cardsUpsertedCounter.Add(totalUpserted);
            _lastSuccessGauge.Record(DateTimeOffset.UtcNow.ToUnixTimeSeconds());

            _logger.LogInformation("Scryfall sync completed. Upserted {Total} cards", totalUpserted);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to sync Scryfall data");
        }
        finally
        {
            stopwatch.Stop();
            _runDurationHistogram.Record(stopwatch.Elapsed.TotalSeconds);
        }
    }

    private async Task UpsertCardBatch(AppDbContext dbContext, List<Card> cards, CancellationToken cancellationToken)
    {
        // Use raw SQL for efficient UPSERT
        var sql = @"
            INSERT INTO ""Cards"" (""Id"", ""OracleId"", ""Name"", ""ManaCost"", ""Cmc"", ""TypeLine"", ""Colors"", ""Rarity"", ""SetCode"", ""ImageUrisJson"", ""PricesJson"", ""BulkDataTimestamp"", ""UpdatedAt"")
            VALUES (@Id, @OracleId, @Name, @ManaCost, @Cmc, @TypeLine, @Colors, @Rarity, @SetCode, @ImageUrisJson::jsonb, @PricesJson::jsonb, @BulkDataTimestamp, @UpdatedAt)
            ON CONFLICT (""Id"") DO UPDATE SET
                ""Name"" = EXCLUDED.""Name"",
                ""ManaCost"" = EXCLUDED.""ManaCost"",
                ""Cmc"" = EXCLUDED.""Cmc"",
                ""TypeLine"" = EXCLUDED.""TypeLine"",
                ""Colors"" = EXCLUDED.""Colors"",
                ""Rarity"" = EXCLUDED.""Rarity"",
                ""SetCode"" = EXCLUDED.""SetCode"",
                ""ImageUrisJson"" = EXCLUDED.""ImageUrisJson"",
                ""PricesJson"" = EXCLUDED.""PricesJson"",
                ""BulkDataTimestamp"" = EXCLUDED.""BulkDataTimestamp"",
                ""UpdatedAt"" = EXCLUDED.""UpdatedAt""
        ";

        foreach (var card in cards)
        {
            await dbContext.Database.ExecuteSqlRawAsync(sql,
                new object[] {
                    card.Id, card.OracleId, card.Name, card.ManaCost, card.Cmc,
                    card.TypeLine, string.Join(',', card.Colors), card.Rarity, card.SetCode,
                    card.ImageUrisJson, card.PricesJson, card.BulkDataTimestamp, card.UpdatedAt
                }, cancellationToken);
        }
    }
}

// DTOs for Scryfall API responses
public record BulkDataResponse(BulkDataEntry[] Data);

public record BulkDataEntry(
    string Type,
    string UpdatedAt,
    string DownloadUri
);

public record ScryfallCard(
    string Id,
    string OracleId,
    string Name,
    string? ManaCost,
    decimal Cmc,
    string TypeLine,
    string[]? Colors,
    string Rarity,
    string Set,
    object? ImageUris,
    object? Prices
);