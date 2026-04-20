using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MtgApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ScryfallCardSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop existing indexes on Cards table
            migrationBuilder.DropIndex(
                name: "IX_Cards_Colors",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_ColorIdentity",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_Keywords",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_Legalities",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_Name",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_Type",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_Set",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_ScryfallId",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_ConvertedManaCost",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_Rarity",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_SearchText",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_Name_Set",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_SearchText_FTS",
                table: "Cards");

            // Drop the existing Cards table - we'll recreate with new schema
            migrationBuilder.DropTable(
                name: "Cards");

            // Create new Cards table with Scryfall schema
            migrationBuilder.CreateTable(
                name: "Cards",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OracleId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ManaCost = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Cmc = table.Column<decimal>(type: "numeric", nullable: false),
                    TypeLine = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Colors = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Rarity = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SetCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ImageUrisJson = table.Column<string>(type: "jsonb", nullable: false),
                    PricesJson = table.Column<string>(type: "jsonb", nullable: false),
                    BulkDataTimestamp = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cards", x => x.Id);
                });

            // Create indexes
            migrationBuilder.CreateIndex(
                name: "IX_Cards_Id",
                table: "Cards",
                column: "Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cards_OracleId",
                table: "Cards",
                column: "OracleId");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Name",
                table: "Cards",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_TypeLine",
                table: "Cards",
                column: "TypeLine");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_SetCode",
                table: "Cards",
                column: "SetCode");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Rarity",
                table: "Cards",
                column: "Rarity");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Cmc",
                table: "Cards",
                column: "Cmc");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Colors",
                table: "Cards",
                column: "Colors");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_BulkDataTimestamp",
                table: "Cards",
                column: "BulkDataTimestamp");

            // PostgreSQL full-text search index on name
            migrationBuilder.Sql(@"
                CREATE INDEX IX_Cards_Name_FTS
                ON ""Cards""
                USING gin(to_tsvector('english', ""Name""));
            ");

            // GIN indexes for JSONB columns
            migrationBuilder.CreateIndex(
                name: "IX_Cards_ImageUrisJson",
                table: "Cards",
                column: "ImageUrisJson")
                .Annotation("Npgsql:IndexMethod", "gin");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_PricesJson",
                table: "Cards",
                column: "PricesJson")
                .Annotation("Npgsql:IndexMethod", "gin");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop new Cards table
            migrationBuilder.DropTable(
                name: "Cards");

            // This is a destructive migration - cannot fully restore old schema
            // Would need to recreate the old Cards table structure if needed
        }
    }
}