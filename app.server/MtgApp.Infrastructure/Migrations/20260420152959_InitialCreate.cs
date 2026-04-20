using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MtgApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BinderScans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    TotalImages = table.Column<int>(type: "integer", nullable: false),
                    ProcessedImages = table.Column<int>(type: "integer", nullable: false),
                    TotalDetectedCards = table.Column<int>(type: "integer", nullable: false),
                    ConfirmedCards = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BinderScans", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Cards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ManaCost = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ConvertedManaCost = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Text = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    Power = table.Column<int>(type: "integer", nullable: true),
                    Toughness = table.Column<int>(type: "integer", nullable: true),
                    Set = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Rarity = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ScryfallId = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: true),
                    Colors = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ColorIdentity = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Keywords = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Supertypes = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Subtypes = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Artist = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    FlavorText = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    Legalities = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    SetName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    CollectorNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    IsDigital = table.Column<bool>(type: "boolean", nullable: false),
                    Layout = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    SearchText = table.Column<string>(type: "text", nullable: true, computedColumnSql: "lower(coalesce(\"Name\", '') || ' ' || coalesce(\"Type\", '') || ' ' || coalesce(\"Text\", '') || ' ' || coalesce(\"Keywords\", '') || ' ' || coalesce(\"Subtypes\", '') || ' ' || coalesce(\"Artist\", '') || ' ' || coalesce(\"FlavorText\", ''))", stored: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cards", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Decks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Format = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UserId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Decks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ScanImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BinderScanId = table.Column<int>(type: "integer", nullable: false),
                    FileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    StoragePath = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    OriginalFileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    FileSizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    MimeType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DetectedCardCount = table.Column<int>(type: "integer", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ProcessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProcessingError = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    AiProvider = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ProcessingModel = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ProcessingDuration = table.Column<TimeSpan>(type: "interval", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScanImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScanImages_BinderScans_BinderScanId",
                        column: x => x.BinderScanId,
                        principalTable: "BinderScans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DeckCards",
                columns: table => new
                {
                    DeckId = table.Column<int>(type: "integer", nullable: false),
                    ScryfallId = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: false),
                    IsMainboard = table.Column<bool>(type: "boolean", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeckCards", x => new { x.DeckId, x.ScryfallId, x.IsMainboard });
                    table.ForeignKey(
                        name: "FK_DeckCards_Decks_DeckId",
                        column: x => x.DeckId,
                        principalTable: "Decks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DetectedCards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BinderScanId = table.Column<int>(type: "integer", nullable: false),
                    ScanImageId = table.Column<int>(type: "integer", nullable: false),
                    CardId = table.Column<int>(type: "integer", nullable: true),
                    DetectedName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    DetectedSet = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ConfidenceScore = table.Column<double>(type: "double precision", precision: 5, scale: 4, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    BoundingBoxX = table.Column<double>(type: "double precision", precision: 8, scale: 4, nullable: false),
                    BoundingBoxY = table.Column<double>(type: "double precision", precision: 8, scale: 4, nullable: false),
                    BoundingBoxWidth = table.Column<double>(type: "double precision", precision: 8, scale: 4, nullable: false),
                    BoundingBoxHeight = table.Column<double>(type: "double precision", precision: 8, scale: 4, nullable: false),
                    CorrectedName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    CorrectedSet = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CorrectedCardId = table.Column<int>(type: "integer", nullable: true),
                    CorrectedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsManuallyVerified = table.Column<bool>(type: "boolean", nullable: false),
                    UseForTraining = table.Column<bool>(type: "boolean", nullable: false),
                    TrainingNotes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetectedCards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DetectedCards_BinderScans_BinderScanId",
                        column: x => x.BinderScanId,
                        principalTable: "BinderScans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DetectedCards_Cards_CardId",
                        column: x => x.CardId,
                        principalTable: "Cards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DetectedCards_Cards_CorrectedCardId",
                        column: x => x.CorrectedCardId,
                        principalTable: "Cards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DetectedCards_ScanImages_ScanImageId",
                        column: x => x.ScanImageId,
                        principalTable: "ScanImages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BinderScans_CreatedAt",
                table: "BinderScans",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_BinderScans_Status",
                table: "BinderScans",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_ColorIdentity",
                table: "Cards",
                column: "ColorIdentity")
                .Annotation("Npgsql:IndexMethod", "gin");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Colors",
                table: "Cards",
                column: "Colors")
                .Annotation("Npgsql:IndexMethod", "gin");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_ConvertedManaCost",
                table: "Cards",
                column: "ConvertedManaCost");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Keywords",
                table: "Cards",
                column: "Keywords")
                .Annotation("Npgsql:IndexMethod", "gin");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Legalities",
                table: "Cards",
                column: "Legalities")
                .Annotation("Npgsql:IndexMethod", "gin");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Name",
                table: "Cards",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Name_Set",
                table: "Cards",
                columns: new[] { "Name", "Set" });

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Rarity",
                table: "Cards",
                column: "Rarity");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_ScryfallId",
                table: "Cards",
                column: "ScryfallId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cards_SearchText_FTS",
                table: "Cards",
                column: "SearchText")
                .Annotation("Npgsql:IndexMethod", "gin");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Set",
                table: "Cards",
                column: "Set");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Type",
                table: "Cards",
                column: "Type");

            migrationBuilder.CreateIndex(
                name: "IX_DeckCards_ScryfallId",
                table: "DeckCards",
                column: "ScryfallId");

            migrationBuilder.CreateIndex(
                name: "IX_Decks_Format",
                table: "Decks",
                column: "Format");

            migrationBuilder.CreateIndex(
                name: "IX_Decks_Name",
                table: "Decks",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Decks_UserId",
                table: "Decks",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DetectedCards_BinderScanId",
                table: "DetectedCards",
                column: "BinderScanId");

            migrationBuilder.CreateIndex(
                name: "IX_DetectedCards_CardId",
                table: "DetectedCards",
                column: "CardId");

            migrationBuilder.CreateIndex(
                name: "IX_DetectedCards_ConfidenceScore",
                table: "DetectedCards",
                column: "ConfidenceScore");

            migrationBuilder.CreateIndex(
                name: "IX_DetectedCards_CorrectedCardId",
                table: "DetectedCards",
                column: "CorrectedCardId");

            migrationBuilder.CreateIndex(
                name: "IX_DetectedCards_DetectedName",
                table: "DetectedCards",
                column: "DetectedName");

            migrationBuilder.CreateIndex(
                name: "IX_DetectedCards_ScanImageId",
                table: "DetectedCards",
                column: "ScanImageId");

            migrationBuilder.CreateIndex(
                name: "IX_DetectedCards_Status",
                table: "DetectedCards",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_ScanImages_BinderScanId",
                table: "ScanImages",
                column: "BinderScanId");

            migrationBuilder.CreateIndex(
                name: "IX_ScanImages_Status",
                table: "ScanImages",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_ScanImages_UploadedAt",
                table: "ScanImages",
                column: "UploadedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DeckCards");

            migrationBuilder.DropTable(
                name: "DetectedCards");

            migrationBuilder.DropTable(
                name: "Decks");

            migrationBuilder.DropTable(
                name: "Cards");

            migrationBuilder.DropTable(
                name: "ScanImages");

            migrationBuilder.DropTable(
                name: "BinderScans");
        }
    }
}
