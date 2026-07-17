using BusManager.Application.Common.Interfaces;
using BusManager.Infrastructure.Repositories;
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
        // 1. Retrieve the connection string
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        // 2. Register your DbContext using SQL Server
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString, b => 
                b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IBusRepository, BusRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}


