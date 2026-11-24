using System;
using System.ComponentModel.DataAnnotations;

namespace BusManager.Application.Common.DTOs
{
    public class ServiceCalendarDto
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public bool Sunday { get; set; } = true;
        public bool Monday { get; set; } = true;
        public bool Tuesday { get; set; } = true;
        public bool Wednesday { get; set; } = true;
        public bool Thursday { get; set; } = true;
        public bool Friday { get; set; } = false;
        public bool Saturday { get; set; } = false;

        public bool IsActive { get; set; } = true;
    }

    public record GenerateCalendarTripsResultDto(
        bool Success,
        string Message,
        int GeneratedTripsCount,
        int SkippedTripsCount,
        int CreatedAssignmentsCount
    );
}
