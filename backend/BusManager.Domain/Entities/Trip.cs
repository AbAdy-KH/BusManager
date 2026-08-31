
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusManager.Domain.Entities
{
    public enum TripDirection
    {
        Outbound = 0, // from usniversity to city
        Inbound = 1 // from city to university 
    }
    
    public enum TripStatus
    {
        Scheduled = 0,
        InProgress = 1,
        Completed = 2,
        Cancelled = 3
    }
    
    public class Trip
    {
        [Key]        
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [ForeignKey(nameof(BusDriver))]
        public string BusDriverId { get; set; } = string.Empty;
        public BusDriver? BusDriver { get; set; }

        [ForeignKey(nameof(Route))]
        public string RouteId { get; set; } = string.Empty;
        public Route Route { get; set; } = null!;

        public TripStatus Status { get; set; } = TripStatus.Scheduled;

        public DateTime ScheduledStartTime { get; set; }
        public DateTime? ActualStartTime { get; set; }

        public DateTime ScheduledArrivalTime { get; set; }
        public DateTime? ActualArrivalTime { get; set; }

        public TripDirection Direction { get; set; }
        public string? Notes { get; set; }        
    }
}