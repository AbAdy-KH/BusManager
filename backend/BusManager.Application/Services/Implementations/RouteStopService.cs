using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Common.Interfaces;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Implementations
{
    public class RouteStopService : IRouteStopService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RouteStopService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<RouteStopListDto>> GetAllRouteStops(string? routeId = null)
        {
            Expression<Func<RouteStop, bool>>? filter = null;
            if (!string.IsNullOrEmpty(routeId))
            {
                filter = rs => rs.RouteId == routeId;
            }

            var items = await _unitOfWork.RouteStop.GetAll(filter, "Route,StopPoint");

            return items
                .OrderBy(rs => rs.Route?.Name ?? string.Empty)
                .ThenBy(rs => rs.SequenceOrder)
                .Select(rs => new RouteStopListDto(
                    rs.RouteId,
                    rs.Route?.Name,
                    rs.Route?.Code,
                    rs.StopPointId,
                    rs.StopPoint?.Name,
                    rs.StopPoint?.Address,
                    rs.StopPoint?.Latitude ?? 0m,
                    rs.StopPoint?.Longitude ?? 0m,
                    rs.SequenceOrder,
                    rs.EstimatedMinutesFromStart
                ))
                .ToList();
        }

        public async Task<IEnumerable<RouteStopListDto>> GetStopsByRouteId(string routeId)
        {
            return await GetAllRouteStops(routeId);
        }

        public async Task<RouteStopListDto?> GetRouteStop(string routeId, string stopPointId)
        {
            var rs = await _unitOfWork.RouteStop.Get(
                x => x.RouteId == routeId && x.StopPointId == stopPointId,
                "Route,StopPoint"
            );

            if (rs == null) return null;

            return new RouteStopListDto(
                rs.RouteId,
                rs.Route?.Name,
                rs.Route?.Code,
                rs.StopPointId,
                rs.StopPoint?.Name,
                rs.StopPoint?.Address,
                rs.StopPoint?.Latitude ?? 0m,
                rs.StopPoint?.Longitude ?? 0m,
                rs.SequenceOrder,
                rs.EstimatedMinutesFromStart
            );
        }

        public async Task<bool> AddStopToRoute(RouteStopDto routeStopDto)
        {
            // Verify Route and Stop exist
            var route = await _unitOfWork.Route.Get(r => r.Id == routeStopDto.RouteId);
            if (route == null) return false;

            var stop = await _unitOfWork.Stop.Get(s => s.Id == routeStopDto.StopPointId);
            if (stop == null) return false;

            // Check if already assigned
            var existing = await _unitOfWork.RouteStop.Get(
                rs => rs.RouteId == routeStopDto.RouteId && rs.StopPointId == routeStopDto.StopPointId
            );
            if (existing != null) return false;

            var routeStop = new RouteStop
            {
                RouteId = routeStopDto.RouteId,
                StopPointId = routeStopDto.StopPointId,
                SequenceOrder = routeStopDto.SequenceOrder,
                EstimatedMinutesFromStart = routeStopDto.EstimatedMinutesFromStart
            };

            _unitOfWork.RouteStop.Add(routeStop);
            int rowsAffected = _unitOfWork.Save();
            return rowsAffected > 0;
        }

        public async Task<RouteStop?> UpdateRouteStop(string routeId, string stopPointId, RouteStopDto routeStopDto)
        {
            var existing = await _unitOfWork.RouteStop.Get(
                rs => rs.RouteId == routeId && rs.StopPointId == stopPointId
            );
            if (existing == null) return null;

            existing.SequenceOrder = routeStopDto.SequenceOrder;
            existing.EstimatedMinutesFromStart = routeStopDto.EstimatedMinutesFromStart;

            _unitOfWork.RouteStop.Update(existing);
            _unitOfWork.Save();
            return existing;
        }

        public async Task<bool> RemoveStopFromRoute(string routeId, string stopPointId)
        {
            var existing = await _unitOfWork.RouteStop.Get(
                rs => rs.RouteId == routeId && rs.StopPointId == stopPointId
            );
            if (existing == null) return false;

            _unitOfWork.RouteStop.Delete(existing);
            int rowsAffected = _unitOfWork.Save();
            return rowsAffected > 0;
        }
    }
}
