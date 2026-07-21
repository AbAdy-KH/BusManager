using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusManager.Domain.Entities
{
    public class Driver : User
    {
        [Required]
        public string LicenseNumber { get; set; } = string.Empty;

        public string? BusId { get; set; }

        [ForeignKey(nameof(BusId))]
        public virtual Bus? Bus { get; set; }
    }
}