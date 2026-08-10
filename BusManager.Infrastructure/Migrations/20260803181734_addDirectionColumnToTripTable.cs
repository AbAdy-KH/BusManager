using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addDirectionColumnToTripTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Direction",
                table: "Trips",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Trips",
                keyColumn: "Id",
                keyValue: "11111111-1111-1111-1111-111111111111",
                column: "Direction",
                value: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Direction",
                table: "Trips");
        }
    }
}
