using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DocScanner.Migrations
{
    /// <inheritdoc />
    public partial class AddValiditate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Validitate",
                table: "RomanianIds",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Validitate",
                table: "RomanianIds");
        }
    }
}
