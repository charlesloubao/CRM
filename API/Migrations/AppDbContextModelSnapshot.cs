﻿// <auto-generated />
using System;
using API.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace API.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.11")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("API.Models.Contact", b =>
                {
                    b.Property<Guid>("ContactId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("MiddleName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Notes")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<Guid>("OrganizationId")
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("ContactId");

                    b.HasIndex("OrganizationId");

                    b.ToTable("Contacts");
                });

            modelBuilder.Entity("API.Models.Organization", b =>
                {
                    b.Property<Guid>("OrganizationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("OrganizationId");

                    b.ToTable("Organizations");
                });

            modelBuilder.Entity("API.Models.OrganizationMember", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime>("AddedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<Guid>("OrganizationId")
                        .HasColumnType("char(36)");

                    b.HasKey("UserId");

                    b.HasIndex("OrganizationId");

                    b.ToTable("OrganizationMembers");
                });

            modelBuilder.Entity("API.Models.PhoneNumber", b =>
                {
                    b.Property<Guid>("PhoneNumberId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<Guid>("ContactId")
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<bool>("IsPrimary")
                        .HasColumnType("tinyint(1)");

                    b.Property<Guid>("PhoneNumberTypeId")
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("PhoneNumberId");

                    b.HasIndex("ContactId");

                    b.HasIndex("PhoneNumberTypeId");

                    b.ToTable("PhoneNumber");
                });

            modelBuilder.Entity("API.Models.PhoneNumberType", b =>
                {
                    b.Property<Guid>("PhoneNumberTypeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<Guid?>("OrganizationId")
                        .HasColumnType("char(36)");

                    b.HasKey("PhoneNumberTypeId");

                    b.HasIndex("OrganizationId");

                    b.ToTable("PhoneNumberTypes");
                });

            modelBuilder.Entity("API.Models.Contact", b =>
                {
                    b.HasOne("API.Models.Organization", "Organization")
                        .WithMany()
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("API.Models.OrganizationMember", b =>
                {
                    b.HasOne("API.Models.Organization", "Organization")
                        .WithMany()
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("API.Models.PhoneNumber", b =>
                {
                    b.HasOne("API.Models.Contact", "Contact")
                        .WithMany("PhoneNumbers")
                        .HasForeignKey("ContactId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Models.PhoneNumberType", "PhoneNumberType")
                        .WithMany()
                        .HasForeignKey("PhoneNumberTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Contact");

                    b.Navigation("PhoneNumberType");
                });

            modelBuilder.Entity("API.Models.PhoneNumberType", b =>
                {
                    b.HasOne("API.Models.Organization", "Organization")
                        .WithMany()
                        .HasForeignKey("OrganizationId");

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("API.Models.Contact", b =>
                {
                    b.Navigation("PhoneNumbers");
                });
#pragma warning restore 612, 618
        }
    }
}
