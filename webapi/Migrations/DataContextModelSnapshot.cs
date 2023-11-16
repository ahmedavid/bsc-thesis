﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using webapi.Data;

namespace webapi.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079");

            modelBuilder.Entity("webapi.Models.Booking", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("BookeeId");

                    b.Property<int>("BookerId");

                    b.Property<DateTime>("EndTime");

                    b.Property<DateTime>("StartTime");

                    b.HasKey("Id");

                    b.HasIndex("BookeeId");

                    b.HasIndex("BookerId");

                    b.ToTable("Bookings");
                });

            modelBuilder.Entity("webapi.Models.Photo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("DateAdded");

                    b.Property<string>("Description");

                    b.Property<bool>("IsMain");

                    b.Property<string>("PublicId");

                    b.Property<string>("Url");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Photos");
                });

            modelBuilder.Entity("webapi.Models.Speciality", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("Specialities");
                });

            modelBuilder.Entity("webapi.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<string>("Fullname")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<bool>("IsBookee");

                    b.Property<byte[]>("PasswordHash");

                    b.Property<byte[]>("PasswordSalt");

                    b.Property<int>("SpecialityId");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.HasKey("Id");

                    b.HasIndex("SpecialityId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("webapi.Models.Booking", b =>
                {
                    b.HasOne("webapi.Models.User", "Bookee")
                        .WithMany("Bookers")
                        .HasForeignKey("BookeeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("webapi.Models.User", "Booker")
                        .WithMany("Bookees")
                        .HasForeignKey("BookerId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("webapi.Models.Photo", b =>
                {
                    b.HasOne("webapi.Models.User", "User")
                        .WithMany("Photos")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("webapi.Models.User", b =>
                {
                    b.HasOne("webapi.Models.Speciality", "Speciality")
                        .WithMany("Users")
                        .HasForeignKey("SpecialityId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
