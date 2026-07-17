using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Interfaces
{
    public interface IBusService
    {
        Task<IEnumerable<Bus>> GetAllBuses();
    }
}