using System.Configuration;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.DB;

public class AppDbContext : DbContext
{
    private readonly string _connectionString;

    public DbSet<Contact> Contacts { get; set; }

    public AppDbContext(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("APP_DB")!;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Contact>(entity =>
        {
            entity.HasKey(e => e.ContactId);
            entity.Property(e => e.ContactId).IsRequired();
            entity.Property(e => e.ContactId).IsRequired();
            entity.Property(e => e.FirstName).IsRequired();
            entity.Property(e => e.MiddleName).IsRequired();
            entity.Property(e => e.LastName).IsRequired();
            entity.Property(e => e.Notes).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();
        });
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseMySQL(_connectionString);
    }
}