using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DocScanner.Migrations
{
    /// <inheritdoc />
    public partial class Tweaks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CNP",
                table: "RomanianIds",
                newName: "Cnp");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "RomanianIds",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RomanianIds_UserId",
                table: "RomanianIds",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_RomanianIds_AspNetUsers_UserId",
                table: "RomanianIds",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RomanianIds_AspNetUsers_UserId",
                table: "RomanianIds");

            migrationBuilder.DropIndex(
                name: "IX_RomanianIds_UserId",
                table: "RomanianIds");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "RomanianIds");

            migrationBuilder.RenameColumn(
                name: "Cnp",
                table: "RomanianIds",
                newName: "CNP");
        }
    }
}
