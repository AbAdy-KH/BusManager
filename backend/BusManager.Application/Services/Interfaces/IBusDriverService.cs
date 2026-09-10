using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BusManager.Domain.Entities;
using BusManager.Application.Common.DTOs;

namespace BusManager.Application.Services.Interfaces
{
    public interface IBusDriverService
    {
        Task<IEnumerable<BusDriverListDto>> GetAllAssignments(DateTime? date = null);
        Task<BusDriverListDto?> GetAssignmentById(string id);
        Task<BusDriverListDto?> GetTodayAssignmentByDriverId(string driverId);
        Task<bool> CreateBusDriver(BusDriverDto busDriverDto);
        Task<BusDriver?> UpdateBusDriver(string busDriverId, BusDriverDto busDriverDto);
        Task<bool> DeleteBusDriver(string busDriverId);
    }
}