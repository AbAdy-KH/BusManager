
using BusManager.Application.Common.DTOs;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Interfaces
{
    public interface IDriverService
    {
        Task<IEnumerable<DriverListDto>> GetAllDrivers();
    }
}