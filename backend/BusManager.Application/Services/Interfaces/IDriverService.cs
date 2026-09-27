
using BusManager.Application.Common.DTOs;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Interfaces
{
    public interface IDriverService
    {
        Task<IEnumerable<DriverListDto>> GetAllDrivers();
        Task<DriverDto?> GetDriverById(string id);
        Task<bool> CreateDriver(DriverDto driverDto);
        Task<bool> UpdateDriver(string id, DriverDto driverDto);
        Task<bool> DeleteDriver(string id);
    }
}