using Microsoft.EntityFrameworkCore;
using BusManager.Domain.Entities;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Bus> Buses { get; set; }  
}

