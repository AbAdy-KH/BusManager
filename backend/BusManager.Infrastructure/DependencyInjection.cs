using BusManager.Application.Common.Interfaces;
using BusManager.Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BusManager.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IDriverRepository, DriverRepository>();
        services.AddScoped<IBusRepository, BusRepository>();
        services.AddScoped<ITripRepository, TripRepository>();
        services.AddScoped<IStopPointRepository, StopPointRepository>();
        services.AddScoped<IBusDriverRepository, BusDriverRepository>();
        services.AddScoped<IRouteRepository, RouteRepository>();
        services.AddScoped<IRouteStopRepository, RouteStopRepository>();
        services.AddScoped<IServiceCalendarRepository, ServiceCalendarRepository>();
        services.AddScoped<ICalendarTripTemplateRepository, CalendarTripTemplateRepository>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString, b =>
                b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.Configure<IdentityOptions>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireLowercase = false;
        });

        return services;
    }
}
