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
    public DbSet<BusDriver> BusesDrivers { get; set; }
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

        // 2. Data Seeding
        var stop1Id = "11111111-1111-1111-1111-111111111111";
        var stop2Id = "22222222-2222-2222-2222-222222222222";
        var stop3Id = "33333333-3333-3333-3333-333333333333";

        var route1Id = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
        var trip1Id  = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";

        modelBuilder.Entity<StopPoint>().HasData(
            new StopPoint
            {
                Id = stop1Id,
                Name = "Central Station",
                Address = "123 Main St",
                Latitude = 40.712776m,
                Longitude = -74.005974m,
                IsDropPoint = true,
                IsActive = true
            },
            new StopPoint
            {
                Id = stop2Id,
                Name = "City Market",
                Address = "456 Market St",
                Latitude = 40.713500m,
                Longitude = -74.004200m,
                IsDropPoint = true,
                IsActive = true
            },
            new StopPoint
            {
                Id = stop3Id,
                Name = "Tech Park",
                Address = "789 Innovation Way",
                Latitude = 40.718900m,
                Longitude = -73.998000m,
                IsDropPoint = false,
                IsActive = true
            }
        );

        modelBuilder.Entity<Route>().HasData(
            new Route
            {
                Id = route1Id,
                Name = "Downtown Express",
                Code = "EX-101"
            }
        );

        modelBuilder.Entity<RouteStop>().HasData(
            new RouteStop
            {
                RouteId = route1Id,
                StopPointId = stop1Id,
                SequenceOrder = 1,
                EstimatedMinutesFromStart = 0
            },
            new RouteStop
            {
                RouteId = route1Id,
                StopPointId = stop2Id,
                SequenceOrder = 2,
                EstimatedMinutesFromStart = 10
            },
            new RouteStop
            {
                RouteId = route1Id,
                StopPointId = stop3Id,
                SequenceOrder = 3,
                EstimatedMinutesFromStart = 25
            }
        );

        var baseTime = new DateTime(2026, 8, 4, 7, 0, 0, DateTimeKind.Utc);

        var busDriverId = "11111111-1111-1111-1111-111111111111";
        modelBuilder.Entity<BusDriver>().HasData(
            new BusDriver
            {
                Id = busDriverId,
                BusId = "1",
                DriverId = "680955bb-da4e-4f6c-ab8b-f9ce8193fc02",
                CreatedAt = baseTime
            }
        );

        modelBuilder.Entity<Trip>().HasData(
            new Trip
            {
                Id = "11111111-1111-1111-1111-111111111111",
                BusDriverId = busDriverId,
                RouteId = route1Id,
                Status = TripStatus.Scheduled,
                ScheduledStartTime = baseTime.AddHours(5),
                ActualStartTime = null,
                ScheduledArrivalTime = baseTime.AddHours(6),
                ActualArrivalTime = null,
                Direction = TripDirection.Outbound,
                Notes = "Afternoon return schedule."
            }
        );
    }
}

