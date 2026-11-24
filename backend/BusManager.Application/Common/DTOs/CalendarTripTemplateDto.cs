using System;
using System.ComponentModel.DataAnnotations;
using BusManager.Domain.Entities;

namespace BusManager.Application.Common.DTOs
{
    public class CalendarTripTemplateDto
    {
        [Required]
        public string ServiceCalendarId { get; set; } = string.Empty;

        public string? RouteId { get; set; }

        [Required]
        public string BusId { get; set; } = string.Empty;

        [Required]
        public string DriverId { get; set; } = string.Empty;

        [Required]
        public TimeSpan DepartureTime { get; set; }

        [Required]
        public TimeSpan ArrivalTime { get; set; }

        public TripDirection Direction { get; set; } = TripDirection.Outbound;

        public string? Notes { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public record CalendarTripTemplateListDto(
        string Id,
        string ServiceCalendarId,
        string? ServiceCalendarName,
        string? RouteId,
        string? RouteName,
        string? RouteCode,
        string BusId,
        int? BusNumber,
        string? PlateNumber,
        string DriverId,
        string? DriverName,
        TimeSpan DepartureTime,
        TimeSpan ArrivalTime,
        string Direction,
        string? Notes,
        bool IsActive
    );
}
