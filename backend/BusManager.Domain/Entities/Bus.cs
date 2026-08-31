
using System.ComponentModel.DataAnnotations;

namespace BusManager.Domain.Entities;

public class Bus
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string PlateNumber { get; set; } =  string.Empty;

    [Required]
    public int Capacity { get; set; }

    [Required]
    public int Number { get; set; }

    [Required]
    public bool IsActive { get; set; }
}
