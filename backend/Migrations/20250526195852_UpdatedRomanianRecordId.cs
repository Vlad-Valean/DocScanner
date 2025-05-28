using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace _.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedRomanianRecordId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Judet",
                table: "RomanianIds",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LocNastere",
                table: "RomanianIds",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Judet",
                table: "RomanianIds");

            migrationBuilder.DropColumn(
                name: "LocNastere",
                table: "RomanianIds");
        }
    }
}
