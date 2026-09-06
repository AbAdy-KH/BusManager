using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusManager.Application.Common.DTOs;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Interfaces
{
    public interface IStopPointService
    {
        Task<IEnumerable<StopPoint>> GetAllStops();
        Task<StopPoint> GetStopPointById(string StopPointId);
        Task<bool>CreateStopPoint(StopPointDto stopPointDto);
        Task<StopPoint>UpdateStopPoint(string stopPointId , StopPointDto stopPointDto);
        Task<bool>DeleteStopPoint(string stopPointId);

    }
}