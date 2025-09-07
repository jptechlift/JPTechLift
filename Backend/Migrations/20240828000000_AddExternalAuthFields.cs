using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    public partial class AddExternalAuthFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "auth_provider",
                table: "users",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "provider_subject",
                table: "users",
                type: "text",
                nullable: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_users_auth_provider_provider_subject",
                table: "users",
                columns: new[] { "auth_provider", "provider_subject" },
                unique: true
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_users_auth_provider_provider_subject",
                table: "users"
            );

            migrationBuilder.DropColumn(name: "auth_provider", table: "users");

            migrationBuilder.DropColumn(name: "provider_subject", table: "users");
        }
    }
}
