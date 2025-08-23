using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddProductBlogFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "keyword",
                table: "productblogs",
                newName: "seo_keywords");

            migrationBuilder.AddColumn<string>(
                name: "target_audience",
                table: "productblogs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "key_selling_points",
                table: "productblogs",
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
                table: "productblogs");

            migrationBuilder.DropColumn(
                name: "key_selling_points",
                table: "productblogs");

            migrationBuilder.RenameColumn(
                name: "seo_keywords",
                table: "productblogs",
                newName: "keyword");

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
