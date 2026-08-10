
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusManager.Domain.Entities
{
    public class BusDriver
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [ForeignKey(nameof(Bus))]
        public string BusId { get; set; } = string.Empty;
        public Bus Bus { get; set; } = null!;

        [ForeignKey(nameof(Driver))]
        public string DriverId { get; set; } = string.Empty;
        public Driver Driver { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}