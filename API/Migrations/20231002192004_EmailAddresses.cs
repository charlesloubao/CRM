using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class EmailAddresses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmailAddressTypes",
                columns: table => new
                {
                    EmailAddressTypeId = table.Column<Guid>(type: "char(36)", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: false),
                    OrganizationId = table.Column<Guid>(type: "char(36)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailAddressTypes", x => x.EmailAddressTypeId);
                    table.ForeignKey(
                        name: "FK_EmailAddressTypes_Organizations_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organizations",
                        principalColumn: "OrganizationId",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "EmailAddress",
                columns: table => new
                {
                    EmailAddressId = table.Column<Guid>(type: "char(36)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IsPrimary = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ContactId = table.Column<Guid>(type: "char(36)", nullable: false),
                    EmailAddressTypeId = table.Column<Guid>(type: "char(36)", nullable: false),
                    Value = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailAddress", x => x.EmailAddressId);
                    table.ForeignKey(
                        name: "FK_EmailAddress_Contacts_ContactId",
                        column: x => x.ContactId,
                        principalTable: "Contacts",
                        principalColumn: "ContactId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmailAddress_EmailAddressTypes_EmailAddressTypeId",
                        column: x => x.EmailAddressTypeId,
                        principalTable: "EmailAddressTypes",
                        principalColumn: "EmailAddressTypeId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_EmailAddress_ContactId",
                table: "EmailAddress",
                column: "ContactId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailAddress_EmailAddressTypeId",
                table: "EmailAddress",
                column: "EmailAddressTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailAddressTypes_OrganizationId",
                table: "EmailAddressTypes",
                column: "OrganizationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailAddress");

            migrationBuilder.DropTable(
                name: "EmailAddressTypes");
        }
    }
}
