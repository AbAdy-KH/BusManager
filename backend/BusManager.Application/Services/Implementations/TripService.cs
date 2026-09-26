
using System.Linq.Expressions;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Common.Interfaces;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Implementations
{
    public class TripService : ITripService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TripService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }        

        public async Task<IEnumerable<TripListDto>> GetTripsList(DateTime? date = null)
        {
            Expression<Func<Trip, bool>>? filter = null;
            if(date != null) 
            {
                var startDate = date?.Date;
                var endDate = startDate?.AddDays(1);

                filter =(t => t.ScheduledStartTime >= startDate && t.ScheduledStartTime < endDate);
            }

            var tripList = await _unitOfWork.Trip.GetAll(
                filter
                , "BusDriver, BusDriver.Driver, BusDriver.Bus, Route");

            List<TripListDto> tripListDto = new List<TripListDto>();

            foreach(var trip in tripList)
            {
                tripListDto.Add(
                    new TripListDto(
                        trip.Id,
                        trip.BusDriver?.Driver.Name,
                        trip.BusDriver?.Bus.Number,
                        trip.Route?.Name,
                        trip.Status.ToString(),
                        trip.ScheduledStartTime,
                        trip.ScheduledArrivalTime,
                        trip.Direction.ToString()
                    )
                );
            }

            return tripListDto;
        }

        public async Task<Trip?> GetByIdAsync(string id)
        {
            return await _unitOfWork.Trip.Get(t => t.Id == id);
        }

        public async Task<Trip> CreateAsync(TripDto dto)
        {
            var trip = new Trip
            {
                BusDriverId = dto.BusDriverId,
                RouteId = dto.RouteId,
                ScheduledStartTime = dto.ScheduledStartTime.ToLocalTime(),
                ScheduledArrivalTime = dto.ScheduledArrivalTime.ToLocalTime(),
                Direction = dto.Direction,
                Notes = dto.Notes,
                Status = TripStatus.Scheduled
            };

            _unitOfWork.Trip.Add(trip);
            _unitOfWork.Save();
            return trip;
        }

        public async Task<Trip> UpdateAsync(string id, TripDto dto)
        {
            var trip = await _unitOfWork.Trip.Get(t => t.Id == id);
            if (trip == null)
                return null;

            trip.BusDriverId = dto.BusDriverId;
            trip.RouteId = dto.RouteId;

            trip.ScheduledStartTime = dto.ScheduledStartTime;
            trip.ScheduledArrivalTime = dto.ScheduledArrivalTime;
            trip.Direction = dto.Direction;

            trip.Notes = dto.Notes;

            _unitOfWork.Trip.Update(trip);
            _unitOfWork.Save();
            return trip;
        }

        public async Task DeleteAsync(string id)
        {
            var trip = await _unitOfWork.Trip.Get(t => t.Id == id);
            if (trip == null) return;
            _unitOfWork.Trip.Delete(trip);
            _unitOfWork.Save();
        }
    }
}