using Microsoft.EntityFrameworkCore;
using MtgApp.Domain.Entities;

namespace MtgApp.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Card> Cards { get; set; }
    public DbSet<Deck> Decks { get; set; }
    public DbSet<DeckCard> DeckCards { get; set; }

    // Binder scan entities
    public DbSet<BinderScan> BinderScans { get; set; }
    public DbSet<ScanImage> ScanImages { get; set; }
    public DbSet<DetectedCard> DetectedCards { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Card entity
        modelBuilder.Entity<Card>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).IsRequired();
            entity.Property(e => e.OracleId).IsRequired();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ManaCost).HasMaxLength(50);
            entity.Property(e => e.TypeLine).IsRequired().HasMaxLength(200);
            entity.Property(e => e.SetCode).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Rarity).IsRequired().HasMaxLength(50);
            entity.Property(e => e.BulkDataTimestamp).IsRequired().HasMaxLength(50);

            // JSONB columns for Postgres
            entity.Property(e => e.ImageUrisJson)
                .IsRequired()
                .HasColumnType("jsonb");

            entity.Property(e => e.PricesJson)
                .IsRequired()
                .HasColumnType("jsonb");

            // Store Colors as JSON array
            entity.Property(e => e.Colors)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries))
                .HasMaxLength(100);

            // Indexes for search performance
            entity.HasIndex(e => e.Id).IsUnique();
            entity.HasIndex(e => e.OracleId);
            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.TypeLine);
            entity.HasIndex(e => e.SetCode);
            entity.HasIndex(e => e.Rarity);
            entity.HasIndex(e => e.Cmc);
            entity.HasIndex(e => e.Colors);
            entity.HasIndex(e => e.BulkDataTimestamp);

            // PostgreSQL full-text search index on name
            entity.HasIndex(e => e.Name)
                  .HasDatabaseName("IX_Cards_Name_FTS")
                  .HasMethod("gin")
                  .IsTsVectorExpressionIndex("english");

            // GIN indexes for JSONB columns (PostgreSQL)
            entity.HasIndex(e => e.ImageUrisJson).HasMethod("gin");
            entity.HasIndex(e => e.PricesJson).HasMethod("gin");
        });

        // Configure Deck entity
        modelBuilder.Entity<Deck>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Format).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.UserId).IsRequired().HasMaxLength(100);

            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.Format);
            entity.HasIndex(e => e.UserId);
        });

        // Configure DeckCard entity (many-to-many with additional properties)
        modelBuilder.Entity<DeckCard>(entity =>
        {
            entity.HasKey(e => new { e.DeckId, e.ScryfallId, e.IsMainboard });

            entity.HasOne(e => e.Deck)
                .WithMany(e => e.DeckCards)
                .HasForeignKey(e => e.DeckId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.ScryfallId).IsRequired().HasMaxLength(36);
            entity.Property(e => e.Quantity).IsRequired();

            entity.HasIndex(e => e.ScryfallId);
        });

        // Configure BinderScan entity
        modelBuilder.Entity<BinderScan>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(50);

            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);
        });

        // Configure ScanImage entity
        modelBuilder.Entity<ScanImage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.StoragePath).IsRequired().HasMaxLength(500);
            entity.Property(e => e.OriginalFileName).HasMaxLength(255);
            entity.Property(e => e.MimeType).HasMaxLength(100);
            entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(50);
            entity.Property(e => e.AiProvider).HasMaxLength(100);
            entity.Property(e => e.ProcessingModel).HasMaxLength(100);
            entity.Property(e => e.ProcessingError).HasMaxLength(2000);

            entity.HasOne(e => e.BinderScan)
                .WithMany(e => e.Images)
                .HasForeignKey(e => e.BinderScanId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.UploadedAt);
        });

        // Configure DetectedCard entity
        modelBuilder.Entity<DetectedCard>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.DetectedName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.DetectedSet).HasMaxLength(100);
            entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(50);
            entity.Property(e => e.CorrectedName).HasMaxLength(200);
            entity.Property(e => e.CorrectedSet).HasMaxLength(100);
            entity.Property(e => e.TrainingNotes).HasMaxLength(1000);

            // Precision for confidence score and bounding box coordinates
            entity.Property(e => e.ConfidenceScore).HasPrecision(5, 4);
            entity.Property(e => e.BoundingBoxX).HasPrecision(8, 4);
            entity.Property(e => e.BoundingBoxY).HasPrecision(8, 4);
            entity.Property(e => e.BoundingBoxWidth).HasPrecision(8, 4);
            entity.Property(e => e.BoundingBoxHeight).HasPrecision(8, 4);

            entity.HasOne(e => e.BinderScan)
                .WithMany(e => e.DetectedCards)
                .HasForeignKey(e => e.BinderScanId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.ScanImage)
                .WithMany(e => e.DetectedCards)
                .HasForeignKey(e => e.ScanImageId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Card)
                .WithMany()
                .HasForeignKey(e => e.CardId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.CorrectedCard)
                .WithMany()
                .HasForeignKey(e => e.CorrectedCardId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.ConfidenceScore);
            entity.HasIndex(e => e.DetectedName);
        });
    }

}