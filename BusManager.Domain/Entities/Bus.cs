
using System.ComponentModel.DataAnnotations;

namespace BusManager.Domain.Entities;

public enum Status { ACTIVE = 1, INACTIVE = 2 }

public class Bus
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string PlateNumber { get; set; }

    [Required]
    public int Capacity { get; set; }

    [Required]
    public int Number { get; set; }

    [Required]
    public Status Status { get; set; }
}
