using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class MergeProductBlogDetailAndRemoveExtras : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "content",
                table: "product_blogs",
                newName: "detail");

            migrationBuilder.Sql(
                @"UPDATE product_blogs SET detail = COALESCE(NULLIF(detail, ''), description) WHERE description IS NOT NULL AND description <> '';"
            );

            migrationBuilder.DropColumn(
                name: "description",
                table: "product_blogs");

            migrationBuilder.DropColumn(
                name: "size",
                table: "product_blogs");

            migrationBuilder.DropColumn(
                name: "volume",
                table: "product_blogs");

            migrationBuilder.DropColumn(
                name: "feature",
                table: "product_blogs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "description",
                table: "product_blogs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "feature",
                table: "product_blogs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "size",
                table: "product_blogs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "volume",
                table: "product_blogs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.RenameColumn(
                name: "detail",
                table: "product_blogs",
                newName: "content");

            migrationBuilder.Sql(
                @"UPDATE product_blogs SET description = content;"
            );
        }
    }
}
