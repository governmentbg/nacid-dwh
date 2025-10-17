using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Dw.Models.Migrations
{
    /// <inheritdoc />
    public partial class V100 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "schemaversions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Version = table.Column<string>(type: "text", nullable: true),
                    Updatedon = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Systemname = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_schemaversions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "templategroup",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    namealt = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    descriptionalt = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    accesslevel = table.Column<int>(type: "integer", nullable: false),
                    accessuserid = table.Column<int>(type: "integer", nullable: true),
                    version = table.Column<int>(type: "integer", nullable: false),
                    vieworder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_templategroup", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "templatequery",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    templategroupid = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    namealt = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    descriptionalt = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    showassubquery = table.Column<bool>(type: "boolean", nullable: false),
                    jsonquery = table.Column<string>(type: "text", nullable: false),
                    rawquery = table.Column<string>(type: "text", nullable: false),
                    accesslevel = table.Column<int>(type: "integer", nullable: false),
                    accessuserid = table.Column<int>(type: "integer", nullable: true),
                    version = table.Column<int>(type: "integer", nullable: false),
                    vieworder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_templatequery", x => x.id);
                    table.ForeignKey(
                        name: "FK_templatequery_templategroup_templategroupid",
                        column: x => x.templategroupid,
                        principalTable: "templategroup",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_templatequery_templategroupid",
                table: "templatequery",
                column: "templategroupid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "schemaversions");

            migrationBuilder.DropTable(
                name: "templatequery");

            migrationBuilder.DropTable(
                name: "templategroup");
        }
    }
}
