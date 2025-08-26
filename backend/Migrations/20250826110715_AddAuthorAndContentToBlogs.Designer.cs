using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthorAndContentToBlogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "author",
                table: "blogs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "content",
                table: "blogs",
                type: "text",
                nullable: false,
                defaultValue: "");

            // Backfill existing rows with data from related tables
            migrationBuilder.Sql("UPDATE blogs SET author = username;");
            migrationBuilder.Sql(@"UPDATE blogs b
SET content = COALESCE(tb.content, pb.detail, '')
FROM topic_blogs tb
LEFT JOIN product_blogs pb ON pb.blog_id = b.id
WHERE b.id = tb.blog_id OR b.id = pb.blog_id;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "author",
                table: "blogs");

            migrationBuilder.DropColumn(
                name: "content",
                table: "blogs");
        }
    }
}