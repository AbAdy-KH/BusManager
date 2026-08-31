
using BusManager.Domain.Entities;

namespace BusManager.Application.Common.DTOs
{
   
    public record TripListDto
    (
        string TripId,
        string? DriverName,
        int? BusNumber,
        string RouteName,
        string Status,
        DateTime ScheduledStartTime,
        DateTime ScheduledArrivalTime,
        string Direction
    );
}