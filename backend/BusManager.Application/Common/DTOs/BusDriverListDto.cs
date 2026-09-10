using System;

namespace BusManager.Application.Common.DTOs
{
    public record BusDriverListDto
    (
        string Id,
        string BusId,
        int? BusNumber,
        string? PlateNumber,
        string DriverId,
        string? DriverName,
        string? LicenseNumber,
        DateTime CreatedAt
    );
}
