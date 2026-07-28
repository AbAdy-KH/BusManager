
using System.ComponentModel.DataAnnotations.Schema;

namespace BusManager.Domain.Entities
{
    public class Trip
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [ForeignKey(nameof(Route))]
        public string RouteId { get; set; } = string.Empty;
        public Route Route { get; set; } = null!;

        public TimeOnly StartTime { get; set; }        
    }
}