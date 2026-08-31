using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusManager.Domain.Entities;

namespace BusManager.Application.Common.DTOs
{
    public record RegisterUserDto (
        string Email,
        string Password,
        string Name,
        string PhoneNumber,
        UserRole Role,

        // If the user was driver:
        string? LicenseNumber,
        string? BusId
    );
}