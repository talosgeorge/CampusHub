using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CampusHub.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "userAccountSet",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    parola = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_userAccountSet", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "userDetailSet",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    cnp = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    nrMatricol = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    facultate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dataNasterii = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    nume = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    prenume = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    prenumeTata = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    prenumeMama = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    sex = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    judetulNasterii = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    localitateaNasterii = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    nationalitate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    seriaBuletin = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    numarBuletin = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    adresa = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_userDetailSet", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "userAccountSet");

            migrationBuilder.DropTable(
                name: "userDetailSet");
        }
    }
}
