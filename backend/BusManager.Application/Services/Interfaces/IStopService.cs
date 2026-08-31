using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Interfaces
{
    public interface IStopPointService
    {
        Task<IEnumerable<StopPoint>> GetAllStops();
    }
}