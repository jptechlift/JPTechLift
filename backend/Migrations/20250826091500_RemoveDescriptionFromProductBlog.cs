using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDescriptionFromProductBlog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "UPDATE productblogs SET content = COALESCE(NULLIF(content, ''), description) WHERE description IS NOT NULL AND description <> ''");
            migrationBuilder.DropColumn(
                name: "description",
                table: "productblogs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "description",
                table: "productblogs",
                type: "text",
                nullable: false,
                defaultValue: "");
            migrationBuilder.Sql(
                "UPDATE productblogs SET description = content WHERE description = '' OR description IS NULL");
        }
    }
}