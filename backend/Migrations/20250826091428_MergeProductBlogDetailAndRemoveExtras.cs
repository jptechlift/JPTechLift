using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace backend.Migrations
{
    public partial class MergeProductBlogDetailAndRemoveExtras : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Vô hiệu hóa tất cả các dòng lệnh ở đây vì
            // cơ sở dữ liệu đã được cập nhật thủ công.

            // migrationBuilder.RenameColumn(
            //     name: "content",
            //     table: "product_blogs",
            //     newName: "detail");
            
            // migrationBuilder.Sql(
            //     @"UPDATE product_blogs SET detail = COALESCE(NULLIF(detail, ''), description) WHERE description IS NOT NULL AND description <> '';"
            // );
            
            // migrationBuilder.DropColumn(
            //     name: "description",
            //     table: "product_blogs");
            
            // migrationBuilder.DropColumn(
            //     name: "size",
            //     table: "product_blogs");
            
            // migrationBuilder.DropColumn(
            //     name: "volume",
            //     table: "product_blogs");
            
            // migrationBuilder.DropColumn(
            //     name: "feature",
            //     table: "product_blogs");
        }

        // Giữ nguyên phương thức Down() không thay đổi
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // ...
        }
    }
}