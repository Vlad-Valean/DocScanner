using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DocScanner.Migrations
{
    /// <inheritdoc />
    public partial class AddedCetatenieToRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Cetatenie",
                table: "RomanianIds",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cetatenie",
                table: "RomanianIds");
        }
    }
}
