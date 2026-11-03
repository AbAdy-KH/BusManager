using BusManager.Domain.Entities;
using BusManager.Application.Common.DTOs;

namespace BusManager.Application.Services.Interfaces
{
    public interface IRouteService
    {
        Task<IEnumerable<Route>> GetAllRoutes();
        Task<Route?> GetRouteById(string routeId);
        Task<bool> CreateRoute(RouteDto routeDto);
        Task<Route?> UpdateRoute(string routeId, RouteDto routeDto);
        Task<bool> DeleteRoute(string routeId);
    }
}
