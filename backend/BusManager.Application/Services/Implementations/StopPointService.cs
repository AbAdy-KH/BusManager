

using BusManager.Application.Common.DTOs;
using BusManager.Application.Common.Interfaces;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Implementations
{
    public class StopPointService : IStopPointService
    {
        private readonly IUnitOfWork _unitOfWork;

        public StopPointService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> CreateStopPoint(StopPointDto stopPointDto)
        {
            var stopPoint = new StopPoint{ 
                Address  = stopPointDto.Address,
                IsActive = stopPointDto.IsActive,
                IsDropPoint = stopPointDto.IsDropPoint,
                Latitude = stopPointDto.Latitude,
                Longitude = stopPointDto.Longitude,
                Name = stopPointDto.Name                 
            };
            _unitOfWork.Stop.Add(stopPoint);
            int rowsAffected = _unitOfWork.Save();
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteStopPoint(string stopPointId)
        {
            var stopPoint  = await _unitOfWork.Stop.Get(u => u.Id == stopPointId);
            if(stopPoint == null)
                return false;
            _unitOfWork.Stop.Delete(stopPoint);
            int rowsAffected = _unitOfWork.Save();
            return rowsAffected > 0;
            
        }

        public async Task<IEnumerable<StopPoint>> GetAllStops()
        {
            var stops = await _unitOfWork.Stop.GetAll();

            return stops;
        }

        public async Task<StopPoint> GetStopPointById(string StopPointId)
        {
            var stopPoint = await _unitOfWork.Stop.Get(u => u.Id == StopPointId);
            return stopPoint;
        }

        public async Task<StopPoint> UpdateStopPoint(string stopPointId, StopPointDto stopPointDto)
        {
            StopPoint stopPoint = await _unitOfWork.Stop.Get(u => u.Id == stopPointId);
            if(stopPoint == null)
            {
                return null;
            }
            stopPoint.IsActive = stopPointDto.IsActive;
            stopPoint.IsDropPoint = stopPointDto.IsDropPoint;
            stopPoint.Latitude = stopPointDto.Latitude;
            stopPoint.Longitude = stopPointDto.Longitude;
            stopPoint.Name = stopPointDto.Name;
            _unitOfWork.Stop.Update(stopPoint);
            _unitOfWork.Save();
            return stopPoint;
        }
    }
}