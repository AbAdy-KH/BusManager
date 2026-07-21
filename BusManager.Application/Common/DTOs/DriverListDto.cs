using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace BusManager.Application.Common.DTOs
{
    public record DriverListDto
    (
        string DriverId,
        string Name, 
        string LicenseNumber,
        string BusId,
        int BusNumber
    );
}