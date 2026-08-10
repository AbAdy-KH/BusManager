using BusManager.Application.Common.Interfaces;
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

            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IBusService, BusService>();
            services.AddScoped<IDriverService, DriverService>();
            services.AddScoped<IStopPointService, StopPointService>();
            services.AddScoped<ITripService, TripService>();
            

            return services;
            
        }
    }
}