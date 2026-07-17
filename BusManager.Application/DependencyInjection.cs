using BusManager.Application.Services.Implementations;
using BusManager.Application.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace BusManager.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services)
        {
            services.AddScoped<IBusService, BusService>();

            return services;
        }
    }
}