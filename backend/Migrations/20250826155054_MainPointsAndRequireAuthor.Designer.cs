using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class MainPointsAndRequireAuthor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "key_selling_points",
                table: "topic_blogs",
                newName: "main_points");

            migrationBuilder.Sql("UPDATE blogs SET author = username WHERE author IS NULL OR author = '';");

            migrationBuilder.AlterColumn<string>(
                name: "author",
                table: "blogs",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "main_points",
                table: "topic_blogs",
                newName: "key_selling_points");

            migrationBuilder.AlterColumn<string>(
                name: "author",
                table: "blogs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}