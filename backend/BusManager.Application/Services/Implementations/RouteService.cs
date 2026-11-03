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
            var newRoute = new Route
            {
                Name = routeDto.Name,
                Code = routeDto.Code
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

            route.Name = routeDto.Name;
            route.Code = routeDto.Code;

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

            _unitOfWork.Route.Delete(route);
            int rowsAffected = _unitOfWork.Save();
            return rowsAffected > 0;
        }
    }
}
