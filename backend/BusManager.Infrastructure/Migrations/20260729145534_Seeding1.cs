using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Seeding1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Routes",
                columns: new[] { "Id", "Code", "Name" },
                values: new object[] { "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "EX-101", "Downtown Express" });

            migrationBuilder.InsertData(
                table: "StopPoints",
                columns: new[] { "Id", "Address", "IsActive", "IsDropPoint", "Latitude", "Longitude", "Name" },
                values: new object[,]
                {
                    { "11111111-1111-1111-1111-111111111111", "123 Main St", true, true, 40.712776m, -74.005974m, "Central Station" },
                    { "22222222-2222-2222-2222-222222222222", "456 Market St", true, true, 40.713500m, -74.004200m, "City Market" },
                    { "33333333-3333-3333-3333-333333333333", "789 Innovation Way", true, false, 40.718900m, -73.998000m, "Tech Park" }
                });

            migrationBuilder.InsertData(
                table: "RouteStops",
                columns: new[] { "RouteId", "StopPointId", "EstimatedMinutesFromStart", "SequenceOrder" },
                values: new object[,]
                {
                    { "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "11111111-1111-1111-1111-111111111111", 0, 1 },
                    { "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "22222222-2222-2222-2222-222222222222", 10, 2 },
                    { "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "33333333-3333-3333-3333-333333333333", 25, 3 }
                });

            migrationBuilder.InsertData(
                table: "Trips",
                columns: new[] { "Id", "RouteId", "StartTime" },
                values: new object[] { "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", new TimeOnly(8, 30, 0) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RouteStops",
                keyColumns: new[] { "RouteId", "StopPointId" },
                keyValues: new object[] { "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "11111111-1111-1111-1111-111111111111" });

            migrationBuilder.DeleteData(
                table: "RouteStops",
                keyColumns: new[] { "RouteId", "StopPointId" },
                keyValues: new object[] { "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "22222222-2222-2222-2222-222222222222" });

            migrationBuilder.DeleteData(
                table: "RouteStops",
                keyColumns: new[] { "RouteId", "StopPointId" },
                keyValues: new object[] { "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "33333333-3333-3333-3333-333333333333" });

            migrationBuilder.DeleteData(
                table: "Trips",
                keyColumn: "Id",
                keyValue: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

            migrationBuilder.DeleteData(
                table: "Routes",
                keyColumn: "Id",
                keyValue: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");

            migrationBuilder.DeleteData(
                table: "StopPoints",
                keyColumn: "Id",
                keyValue: "11111111-1111-1111-1111-111111111111");

            migrationBuilder.DeleteData(
                table: "StopPoints",
                keyColumn: "Id",
                keyValue: "22222222-2222-2222-2222-222222222222");

            migrationBuilder.DeleteData(
                table: "StopPoints",
                keyColumn: "Id",
                keyValue: "33333333-3333-3333-3333-333333333333");
        }
    }
}
