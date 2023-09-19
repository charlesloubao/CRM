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
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseMySQL(_connectionString);
    }
}