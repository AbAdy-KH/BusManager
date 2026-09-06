using BusManager.Domain.Entities;
using BusManager.Application.Common.DTOs;
namespace BusManager.Application.Services.Interfaces
{
    public interface IBusDriverService
    {
        Task<BusDriver>GetBusDriverById(string BusDriverId);
        Task<bool> CreateBusDriver(BusDriverDto busDriverDto);
        Task<BusDriver> UpdateBusDriver(string BusDriverId , BusDriverDto busDriverDto);
        Task<bool> DeleteBusDriver(string BusDriverId);
        
    }
}