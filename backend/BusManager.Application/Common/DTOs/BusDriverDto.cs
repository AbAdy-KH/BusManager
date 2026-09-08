using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusManager.Domain.Entities;
namespace BusManager.Application.Common.DTOs
{
    public class BusDriverDto
    {
        public string BusId { get; set; } = string.Empty;
        public Bus Bus { get; set; } = null!;

        public string DriverId { get; set; } = string.Empty;
        public Driver Driver { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}