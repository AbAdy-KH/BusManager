using System.ComponentModel.DataAnnotations.Schema;

namespace BusManager.Domain.Entities
{
    public class RouteStop
    {
        [ForeignKey(nameof(Route))]
        public string RouteId { get; set; } = string.Empty;
        public Route Route { get; set; } = null!;

        [ForeignKey(nameof(StopPoint))]
        public string StopPointId { get; set; } = string.Empty;
        public StopPoint StopPoint { get; set; } = null!;

        
        public int SequenceOrder { get; set; }
        public int? EstimatedMinutesFromStart { get; set; }       
    }
}