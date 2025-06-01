using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DocScanner.Migrations
{
    /// <inheritdoc />
    public partial class RemovedJudetFromIdRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Judet",
                table: "RomanianIds");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Judet",
                table: "RomanianIds",
                type: "text",
                nullable: true);
        }
    }
}
