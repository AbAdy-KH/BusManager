using System.ComponentModel.DataAnnotations;

namespace BusManager.Application.Common.DTOs;

public class DriverDto
{
    [Required]
    public string Name { get; set; }

    [Required]
    public string LicenseNumber { get; set; }

    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? AssignedBusId { get; set; }
}
