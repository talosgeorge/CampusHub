using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CampusHub.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddHandicapToUserDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserDetails_AspNetUsers_UserId",
                table: "UserDetails");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "UserDetails",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "UserDetails",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_UserDetails_UserId",
                table: "UserDetails",
                newName: "IX_UserDetails_UserID");

            migrationBuilder.AddColumn<string>(
                name: "Handicap",
                table: "UserDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UserDetails_AspNetUsers_UserID",
                table: "UserDetails",
                column: "UserID",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserDetails_AspNetUsers_UserID",
                table: "UserDetails");

            migrationBuilder.DropColumn(
                name: "Handicap",
                table: "UserDetails");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "UserDetails",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "UserDetails",
                newName: "id");

            migrationBuilder.RenameIndex(
                name: "IX_UserDetails_UserID",
                table: "UserDetails",
                newName: "IX_UserDetails_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserDetails_AspNetUsers_UserId",
                table: "UserDetails",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
