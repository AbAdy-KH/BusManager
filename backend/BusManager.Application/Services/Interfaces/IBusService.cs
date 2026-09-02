using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Interfaces
{
    public interface IBusService
    {
        Task<IEnumerable<Bus>> GetAllBuses();
        Task<Bus> GetBusById(string BusId);
        Task<Bus> CreateBus(Bus bus);
        Task<Bus> UpdateBus(string BusId , Bus bus);
        Task<bool> DeleteBus(string BusId);
    }
}