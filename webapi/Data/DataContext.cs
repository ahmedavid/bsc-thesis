using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        override protected void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Booking>().HasOne(b => b.Bookee).WithMany(u => u.Bookers).HasForeignKey(b => b.BookeeId);
            modelBuilder.Entity<Booking>().HasOne(b => b.Booker).WithMany(u => u.Bookees).HasForeignKey(b => b.BookerId);

            modelBuilder.Entity<Photo>().ToTable("Photos");
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Speciality> Specialities { get; set; }
    }
}