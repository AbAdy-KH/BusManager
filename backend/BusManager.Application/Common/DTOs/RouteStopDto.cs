using System.ComponentModel.DataAnnotations;

namespace BusManager.Application.Common.DTOs;

public class RouteStopDto
{
    [Required]
    public string RouteId { get; set; } = string.Empty;

    [Required]
    public string StopPointId { get; set; } = string.Empty;

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Sequence order must be at least 1.")]
    public int SequenceOrder { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Estimated minutes must be a non-negative number.")]
    public int? EstimatedMinutesFromStart { get; set; }
}
