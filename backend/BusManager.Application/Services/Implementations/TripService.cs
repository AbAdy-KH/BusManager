
using System.Linq.Expressions;
using System.Reflection.Metadata;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Common.Interfaces;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;
using NetTopologySuite.Triangulate.Tri;

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
                        trip.Route.Name,
                        trip.Status.ToString(),
                        trip.ScheduledStartTime,
                        trip.ScheduledArrivalTime,
                        trip.Direction.ToString()
                    )
                );
            }

            return tripListDto;
        }
    }
}