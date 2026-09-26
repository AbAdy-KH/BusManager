
using BusManager.Domain.Entities;

namespace BusManager.Application.Common.DTOs
{
    public record TripDto
    (
        string BusDriverId,
        string? RouteId,
        DateTime ScheduledStartTime,
        DateTime ScheduledArrivalTime,
        TripDirection Direction, // 0 = Outbound, 1 = Inbound
        string? Notes
    );
}
