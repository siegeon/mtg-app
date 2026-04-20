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
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ManaCost).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Set).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Rarity).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Text).HasMaxLength(2000);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);

            // Enhanced search properties
            entity.Property(e => e.ScryfallId).HasMaxLength(36);
            entity.Property(e => e.Colors).HasMaxLength(50);
            entity.Property(e => e.ColorIdentity).HasMaxLength(50);
            entity.Property(e => e.Keywords).HasMaxLength(500);
            entity.Property(e => e.Supertypes).HasMaxLength(200);
            entity.Property(e => e.Subtypes).HasMaxLength(200);
            entity.Property(e => e.Artist).HasMaxLength(200);
            entity.Property(e => e.FlavorText).HasMaxLength(1000);
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.Property(e => e.Legalities).HasMaxLength(1000);
            entity.Property(e => e.SetName).HasMaxLength(200);
            entity.Property(e => e.CollectorNumber).HasMaxLength(20);
            entity.Property(e => e.Layout).HasMaxLength(50);

            // Computed column for full-text search
            entity.Property(e => e.SearchText).HasComputedColumnSql(
                "lower(coalesce(\"Name\", '') || ' ' || coalesce(\"Type\", '') || ' ' || coalesce(\"Text\", '') || ' ' || coalesce(\"Keywords\", '') || ' ' || coalesce(\"Subtypes\", '') || ' ' || coalesce(\"Artist\", '') || ' ' || coalesce(\"FlavorText\", ''))",
                stored: true);

            // Indexes for search performance
            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => e.Set);
            entity.HasIndex(e => e.ScryfallId).IsUnique();
            entity.HasIndex(e => e.Colors);
            entity.HasIndex(e => e.ConvertedManaCost);
            entity.HasIndex(e => e.Rarity);
            entity.HasIndex(e => e.SearchText); // For full-text search
            entity.HasIndex(e => new { e.Name, e.Set }); // Composite index for name+set queries

            // PostgreSQL full-text search index (will be created via migration)
            entity.HasIndex(e => e.SearchText)
                  .HasDatabaseName("IX_Cards_SearchText_FTS")
                  .HasMethod("gin");

            // Add GIN index for JSON columns for better filtering performance
            if (Database.IsNpgsql())
            {
                entity.HasIndex(e => e.Colors).HasMethod("gin");
                entity.HasIndex(e => e.ColorIdentity).HasMethod("gin");
                entity.HasIndex(e => e.Keywords).HasMethod("gin");
                entity.HasIndex(e => e.Legalities).HasMethod("gin");
            }
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