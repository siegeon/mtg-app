using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MtgApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCardSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Cards_ColorIdentity",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_Colors",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_ConvertedManaCost",
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
                name: "IX_Cards_Name_Set",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_ScryfallId",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_SearchText_FTS",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_Set",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "SearchText",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Artist",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "CollectorNumber",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ColorIdentity",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ConvertedManaCost",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "FlavorText",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "IsDigital",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Keywords",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Layout",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Legalities",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Power",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ScryfallId",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Set",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "SetName",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Subtypes",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Supertypes",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Text",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Toughness",
                table: "Cards");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Cards",
                newName: "TypeLine");

            migrationBuilder.RenameIndex(
                name: "IX_Cards_Type",
                table: "Cards",
                newName: "IX_Cards_TypeLine");

            migrationBuilder.AlterColumn<Guid>(
                name: "CorrectedCardId",
                table: "DetectedCards",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "CardId",
                table: "DetectedCards",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ManaCost",
                table: "Cards",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Colors",
                table: "Cards",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Cards",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "BulkDataTimestamp",
                table: "Cards",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Cmc",
                table: "Cards",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrisJson",
                table: "Cards",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "OracleId",
                table: "Cards",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "PricesJson",
                table: "Cards",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SetCode",
                table: "Cards",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_BulkDataTimestamp",
                table: "Cards",
                column: "BulkDataTimestamp");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Cmc",
                table: "Cards",
                column: "Cmc");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Colors",
                table: "Cards",
                column: "Colors");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Id",
                table: "Cards",
                column: "Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cards_ImageUrisJson",
                table: "Cards",
                column: "ImageUrisJson")
                .Annotation("Npgsql:IndexMethod", "gin");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_Name_FTS",
                table: "Cards",
                column: "Name")
                .Annotation("Npgsql:IndexMethod", "gin")
                .Annotation("Npgsql:TsVectorConfig", "english");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_OracleId",
                table: "Cards",
                column: "OracleId");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_PricesJson",
                table: "Cards",
                column: "PricesJson")
                .Annotation("Npgsql:IndexMethod", "gin");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_SetCode",
                table: "Cards",
                column: "SetCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Cards_BulkDataTimestamp",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_Cmc",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_Colors",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_Id",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_ImageUrisJson",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_Name_FTS",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_OracleId",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_PricesJson",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_SetCode",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "BulkDataTimestamp",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Cmc",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ImageUrisJson",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "OracleId",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "PricesJson",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "SetCode",
                table: "Cards");

            migrationBuilder.RenameColumn(
                name: "TypeLine",
                table: "Cards",
                newName: "Type");

            migrationBuilder.RenameIndex(
                name: "IX_Cards_TypeLine",
                table: "Cards",
                newName: "IX_Cards_Type");

            migrationBuilder.AlterColumn<int>(
                name: "CorrectedCardId",
                table: "DetectedCards",
                type: "integer",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CardId",
                table: "DetectedCards",
                type: "integer",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ManaCost",
                table: "Cards",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Colors",
                table: "Cards",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Cards",
                type: "integer",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "Artist",
                table: "Cards",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CollectorNumber",
                table: "Cards",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ColorIdentity",
                table: "Cards",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ConvertedManaCost",
                table: "Cards",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Cards",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "FlavorText",
                table: "Cards",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Cards",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDigital",
                table: "Cards",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Keywords",
                table: "Cards",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Layout",
                table: "Cards",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Legalities",
                table: "Cards",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Power",
                table: "Cards",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Cards",
                type: "numeric(10,2)",
                precision: 10,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ScryfallId",
                table: "Cards",
                type: "character varying(36)",
                maxLength: 36,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Set",
                table: "Cards",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SetName",
                table: "Cards",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Subtypes",
                table: "Cards",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Supertypes",
                table: "Cards",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Text",
                table: "Cards",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Toughness",
                table: "Cards",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SearchText",
                table: "Cards",
                type: "text",
                nullable: true,
                computedColumnSql: "lower(coalesce(\"Name\", '') || ' ' || coalesce(\"Type\", '') || ' ' || coalesce(\"Text\", '') || ' ' || coalesce(\"Keywords\", '') || ' ' || coalesce(\"Subtypes\", '') || ' ' || coalesce(\"Artist\", '') || ' ' || coalesce(\"FlavorText\", ''))",
                stored: true);

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
        }
    }
}
