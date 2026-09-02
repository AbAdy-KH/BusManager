using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class createTripTableAndBusDriverTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Buses_BusId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_BusId",
                table: "Users");

            migrationBuilder.DeleteData(
                table: "Trips",
                keyColumn: "Id",
                keyValue: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

            migrationBuilder.DropColumn(
                name: "BusId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "Trips");

            migrationBuilder.AddColumn<DateTime>(
                name: "ActualArrivalTime",
                table: "Trips",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ActualStartTime",
                table: "Trips",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BusDriverId",
                table: "Trips",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Trips",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ScheduledArrivalTime",
                table: "Trips",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ScheduledStartTime",
                table: "Trips",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Trips",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "BusesDrivers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    BusId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DriverId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusesDrivers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusesDrivers_Buses_BusId",
                        column: x => x.BusId,
                        principalTable: "Buses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BusesDrivers_Users_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // 1. Seed Bus with Id = "1"
            migrationBuilder.InsertData(
                table: "Buses",
                columns: new[] { "Id", "PlateNumber", "Capacity", "Number", "IsActive" },
                values: new object[] { "1", "BUS-101", 30, 101, true }
            );

            // 2. Seed Driver/User with Id = "680955bb-da4e-4f6c-ab8b-f9ce8193fc02"
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Name", "UserName", "Email", "EmailConfirmed", "PhoneNumberConfirmed", "TwoFactorEnabled", "LockoutEnabled", "AccessFailedCount", "Discriminator" },
                values: new object[] { 
                    "680955bb-da4e-4f6c-ab8b-f9ce8193fc02", 
                    "Default Driver", 
                    "driver1", 
                    "driver1@busmanager.com", 
                    true, false, false, false, 0, 
                    "Driver" 
                }
            );

            // 3. Seed BusesDrivers relationship
            migrationBuilder.InsertData(
                table: "BusesDrivers",
                columns: new[] { "Id", "BusId", "CreatedAt", "DriverId" },
                values: new object[] { "11111111-1111-1111-1111-111111111111", "1", new DateTime(2026, 8, 4, 7, 0, 0, 0, DateTimeKind.Utc), "680955bb-da4e-4f6c-ab8b-f9ce8193fc02" }
            );

            // 4. Seed Trip
            migrationBuilder.InsertData(
                table: "Trips",
                columns: new[] { "Id", "ActualArrivalTime", "ActualStartTime", "BusDriverId", "Notes", "RouteId", "ScheduledArrivalTime", "ScheduledStartTime", "Status" },
                values: new object[] { "11111111-1111-1111-1111-111111111111", null, null, "11111111-1111-1111-1111-111111111111", "Afternoon return schedule.", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", new DateTime(2026, 8, 4, 13, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 8, 4, 12, 0, 0, 0, DateTimeKind.Utc), 0 }
            );
            migrationBuilder.CreateIndex(
                name: "IX_Trips_BusDriverId",
                table: "Trips",
                column: "BusDriverId");

            migrationBuilder.CreateIndex(
                name: "IX_BusesDrivers_BusId",
                table: "BusesDrivers",
                column: "BusId");

            migrationBuilder.CreateIndex(
                name: "IX_BusesDrivers_DriverId",
                table: "BusesDrivers",
                column: "DriverId");

            migrationBuilder.AddForeignKey(
                name: "FK_Trips_BusesDrivers_BusDriverId",
                table: "Trips",
                column: "BusDriverId",
                principalTable: "BusesDrivers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Trips_BusesDrivers_BusDriverId",
                table: "Trips");

            migrationBuilder.DropTable(
                name: "BusesDrivers");

            migrationBuilder.DropIndex(
                name: "IX_Trips_BusDriverId",
                table: "Trips");

            migrationBuilder.DeleteData(
                table: "Trips",
                keyColumn: "Id",
                keyValue: "11111111-1111-1111-1111-111111111111");

            migrationBuilder.DropColumn(
                name: "ActualArrivalTime",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "ActualStartTime",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "BusDriverId",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "ScheduledArrivalTime",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "ScheduledStartTime",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Trips");

            migrationBuilder.AddColumn<string>(
                name: "BusId",
                table: "Users",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "StartTime",
                table: "Trips",
                type: "time",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0));

            migrationBuilder.InsertData(
                table: "Trips",
                columns: new[] { "Id", "RouteId", "StartTime" },
                values: new object[] { "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", new TimeOnly(8, 30, 0) });

            migrationBuilder.CreateIndex(
                name: "IX_Users_BusId",
                table: "Users",
                column: "BusId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Buses_BusId",
                table: "Users",
                column: "BusId",
                principalTable: "Buses",
                principalColumn: "Id");
        }
    }
}
