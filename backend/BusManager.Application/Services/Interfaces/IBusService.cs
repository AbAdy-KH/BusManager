using BusManager.Domain.Entities;
using BusManager.Application.Common.DTOs;
namespace BusManager.Application.Services.Interfaces
{
    public interface IBusService
    {
        Task<IEnumerable<Bus>> GetAllBuses();
        Task<Bus> GetBusById(string BusId);
        Task<bool> CreateBus(BusDto busDto);
        Task<Bus> UpdateBus(string BusId , BusDto busDto);
        Task<bool> DeleteBus(string BusId);
    }
}