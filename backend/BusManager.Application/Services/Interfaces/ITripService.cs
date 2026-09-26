using BusManager.Application.Common.DTOs;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Interfaces
{
    public interface ITripService
    {
        Task<IEnumerable<TripListDto>> GetTripsList(DateTime? date = null);
        Task<Trip?> GetByIdAsync(string id);
        Task<Trip> CreateAsync(TripDto dto);
        Task<Trip> UpdateAsync(string id, TripDto dto);
        Task DeleteAsync(string id);
    }
}