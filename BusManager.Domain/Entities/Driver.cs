using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusManager.Domain.Entities
{
    public class Driver
    {
        [Key]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }

        [Required]
        public string LicenseNumber { get; set; } = string.Empty;

        public string? BusId { get; set; }

        [ForeignKey(nameof(BusId))]
        public virtual Bus? Bus { get; set; }
    }
}