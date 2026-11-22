using BusManager.Application.Common.DTOs;
using BusManager.Application.Common.Interfaces;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Implementations
{
    public class RouteService : IRouteService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RouteService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Route>> GetAllRoutes()
        {
            return await _unitOfWork.Route.GetAll();
        }

        public async Task<Route?> GetRouteById(string routeId)
        {
            return await _unitOfWork.Route.Get(r => r.Id == routeId);
        }

        public async Task<bool> CreateRoute(RouteDto routeDto)
        {
            var normalizedCode = (routeDto.Code ?? string.Empty).Trim();
            var existing = await _unitOfWork.Route.Get(r => r.Code == normalizedCode);
            if (existing != null)
            {
                return false;
            }

            var newRoute = new Route
            {
                Name = routeDto.Name.Trim(),
                Code = normalizedCode
            };
            _unitOfWork.Route.Add(newRoute);
            int rowsAffected = _unitOfWork.Save();
            return rowsAffected > 0;
        }

        public async Task<Route?> UpdateRoute(string routeId, RouteDto routeDto)
        {
            var route = await _unitOfWork.Route.Get(r => r.Id == routeId);
            if (route == null)
            {
                return null;
            }

            route.Name = routeDto.Name.Trim();
            route.Code = (routeDto.Code ?? string.Empty).Trim();

            _unitOfWork.Route.Update(route);
            _unitOfWork.Save();
            return route;
        }

        public async Task<bool> DeleteRoute(string routeId)
        {
            var route = await _unitOfWork.Route.Get(r => r.Id == routeId);
            if (route == null)
            {
                return false;
            }

            // Nullify RouteId on any trips referencing this route before deletion
            var linkedTrips = await _unitOfWork.Trip.GetAll(t => t.RouteId == routeId);
            foreach (var trip in linkedTrips)
            {
                trip.RouteId = null;
                _unitOfWork.Trip.Update(trip);
            }

            _unitOfWork.Route.Delete(route);
            int rowsAffected = _unitOfWork.Save();
            return rowsAffected > 0;
        }
    }
}
