using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddServiceCalendarTableAndLinkToTrip : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ServiceCalendarId",
                table: "Trips",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ServiceCalendars",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Sunday = table.Column<bool>(type: "bit", nullable: false),
                    Monday = table.Column<bool>(type: "bit", nullable: false),
                    Tuesday = table.Column<bool>(type: "bit", nullable: false),
                    Wednesday = table.Column<bool>(type: "bit", nullable: false),
                    Thursday = table.Column<bool>(type: "bit", nullable: false),
                    Friday = table.Column<bool>(type: "bit", nullable: false),
                    Saturday = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceCalendars", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Trips",
                keyColumn: "Id",
                keyValue: "11111111-1111-1111-1111-111111111111",
                column: "ServiceCalendarId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_Trips_ServiceCalendarId",
                table: "Trips",
                column: "ServiceCalendarId");

            migrationBuilder.AddForeignKey(
                name: "FK_Trips_ServiceCalendars_ServiceCalendarId",
                table: "Trips",
                column: "ServiceCalendarId",
                principalTable: "ServiceCalendars",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Trips_ServiceCalendars_ServiceCalendarId",
                table: "Trips");

            migrationBuilder.DropTable(
                name: "ServiceCalendars");

            migrationBuilder.DropIndex(
                name: "IX_Trips_ServiceCalendarId",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "ServiceCalendarId",
                table: "Trips");
        }
    }
}
