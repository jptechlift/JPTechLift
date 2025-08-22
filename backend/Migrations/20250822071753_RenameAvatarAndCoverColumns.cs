using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RenameAvatarAndCoverColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "avatar",
                table: "users",
                newName: "avatar_url");

            migrationBuilder.RenameColumn(
                name: "coverurl",
                table: "users",
                newName: "cover_url");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "avatar_url",
                table: "users",
                newName: "avatar");

            migrationBuilder.RenameColumn(
                name: "cover_url",
                table: "users",
                newName: "coverurl");
        }
    }
}