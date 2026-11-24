using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusManager.Domain.Entities
{
    public class CalendarTripTemplate
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [ForeignKey(nameof(ServiceCalendar))]
        public string ServiceCalendarId { get; set; } = string.Empty;
        public ServiceCalendar ServiceCalendar { get; set; } = null!;

        [ForeignKey(nameof(Route))]
        public string? RouteId { get; set; }
        public Route? Route { get; set; }

        [Required]
        [ForeignKey(nameof(Bus))]
        public string BusId { get; set; } = string.Empty;
        public Bus Bus { get; set; } = null!;

        [Required]
        [ForeignKey(nameof(Driver))]
        public string DriverId { get; set; } = string.Empty;
        public Driver Driver { get; set; } = null!;

        [Required]
        public TimeSpan DepartureTime { get; set; }

        [Required]
        public TimeSpan ArrivalTime { get; set; }

        public TripDirection Direction { get; set; } = TripDirection.Outbound;

        [MaxLength(500)]
        public string? Notes { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
