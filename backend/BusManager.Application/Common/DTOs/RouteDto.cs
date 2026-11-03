using System.ComponentModel.DataAnnotations;

namespace BusManager.Application.Common.DTOs;

public class RouteDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;
}
