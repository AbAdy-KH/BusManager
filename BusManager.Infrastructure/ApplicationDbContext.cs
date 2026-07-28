using Microsoft.EntityFrameworkCore;
using BusManager.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using NetTopologySuite.Triangulate.Tri;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Driver> Drivers { get; set; }
    public DbSet<Bus> Buses { get; set; }  
    public DbSet<StopPoint> StopPoints { get; set; }
    public DbSet<Route> Routes { get; set; }
    public DbSet<RouteStop> RouteStops { get; set; }
    public DbSet<Trip> Trips { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Rename table
        modelBuilder.Entity<User>().ToTable("Users");
        modelBuilder.Entity<IdentityRole>().ToTable("Roles");
        modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");

        // 2. Tell EF Core to completely ignore the tables you don't want
        // modelBuilder.Ignore<IdentityRole>();
        // modelBuilder.Ignore<IdentityUserRole<string>>();
        modelBuilder.Ignore<IdentityUserClaim<string>>();
        modelBuilder.Ignore<IdentityUserLogin<string>>();
        modelBuilder.Ignore<IdentityRoleClaim<string>>();
        modelBuilder.Ignore<IdentityUserToken<string>>();


        // 1. Composite Primary Key for junction table
        modelBuilder.Entity<RouteStop>()
            .HasKey(rs => new { rs.RouteId, rs.StopPointId });

    }
}

