using Microsoft.EntityFrameworkCore.Migrations;

namespace webapi.Migrations
{
    public partial class Time : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Start",
                table: "Bookings",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "End",
                table: "Bookings",
                newName: "EndTime");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "Bookings",
                newName: "Start");

            migrationBuilder.RenameColumn(
                name: "EndTime",
                table: "Bookings",
                newName: "End");
        }
    }
}
