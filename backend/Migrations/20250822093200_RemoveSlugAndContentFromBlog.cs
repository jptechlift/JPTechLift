using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSlugAndContentFromBlog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "content",
                table: "blogs");

            migrationBuilder.DropColumn(
                name: "slug",
                table: "blogs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "content",
                table: "blogs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "slug",
                table: "blogs",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}