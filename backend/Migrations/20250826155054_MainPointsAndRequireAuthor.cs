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
          // migrationBuilder.AddColumn<string>(
    //     name: "main_points",
    //     table: "topic_blogs",
    //     type: "text",
    //     nullable: false,
    //     defaultValue: "")
    
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
            migrationBuilder.DropColumn(
                name: "main_points",
                table: "topic_blogs");

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
