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
                table: "topicblogs",
                newName: "seo_keywords");

            migrationBuilder.AddColumn<string>(
                name: "target_audience",
                table: "topicblogs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "key_selling_points",
                table: "topicblogs",
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
                table: "topicblogs");

            migrationBuilder.DropColumn(
                name: "key_selling_points",
                table: "topicblogs");

            migrationBuilder.RenameColumn(
                name: "seo_keywords",
                table: "topicblogs",
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