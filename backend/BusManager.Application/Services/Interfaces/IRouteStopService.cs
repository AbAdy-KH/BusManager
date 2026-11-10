using BusManager.Application.Common.DTOs;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Interfaces
{
    public interface IRouteStopService
    {
        Task<IEnumerable<RouteStopListDto>> GetAllRouteStops(string? routeId = null);
        Task<IEnumerable<RouteStopListDto>> GetStopsByRouteId(string routeId);
        Task<RouteStopListDto?> GetRouteStop(string routeId, string stopPointId);
        Task<bool> AddStopToRoute(RouteStopDto routeStopDto);
        Task<RouteStop?> UpdateRouteStop(string routeId, string stopPointId, RouteStopDto routeStopDto);
        Task<bool> RemoveStopFromRoute(string routeId, string stopPointId);
    }
}
