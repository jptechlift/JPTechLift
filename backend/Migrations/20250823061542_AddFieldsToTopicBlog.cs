using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddFieldsToTopicBlog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "keywords",
                table: "topic_blogs",
                newName: "seo_keywords");

            migrationBuilder.AddColumn<string>(
                name: "target_audience",
                table: "topic_blogs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "key_selling_points",
                table: "topic_blogs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "slug",
                table: "blogs",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "target_audience",
                table: "topic_blogs");

            migrationBuilder.DropColumn(
                name: "key_selling_points",
                table: "topic_blogs");

            migrationBuilder.RenameColumn(
                name: "seo_keywords",
                table: "topic_blogs",
                newName: "keywords");

            migrationBuilder.AlterColumn<string>(
                name: "slug",
                table: "blogs",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);
        }
    }
}