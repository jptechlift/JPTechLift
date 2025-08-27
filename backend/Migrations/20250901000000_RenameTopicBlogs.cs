using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class RenameTopicBlogs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
           // migrationBuilder.DropForeignKey(
        //     name: "fk_topicblogs_blogs_blog_id",
        //     table: "topicblogs");

        // migrationBuilder.DropPrimaryKey(
        //     name: "pk_topicblogs",
        //     table: "topicblogs");

        // migrationBuilder.RenameTable(
        //     name: "topicblogs",
        //     newName: "topic_blogs");

        // migrationBuilder.AddPrimaryKey(
        //     name: "pk_topic_blogs",
        //     table: "topic_blogs",
        //     column: "blog_id");

        // migrationBuilder.AddForeignKey(
        //     name: "fk_topic_blogs_blogs_blog_id",
        //     table: "topic_blogs",
        //     column: "blog_id",
        //     principalTable: "blogs",
        //     principalColumn: "id",
        //     onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_topic_blogs_blogs_blog_id",
                table: "topic_blogs");

            migrationBuilder.DropPrimaryKey(
                name: "pk_topic_blogs",
                table: "topic_blogs");

            migrationBuilder.RenameTable(
                name: "topic_blogs",
                newName: "topicblogs");

            migrationBuilder.AddPrimaryKey(
                name: "pk_topicblogs",
                table: "topicblogs",
                column: "blog_id");

            migrationBuilder.AddForeignKey(
                name: "fk_topicblogs_blogs_blog_id",
                table: "topicblogs",
                column: "blog_id",
                principalTable: "blogs",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
