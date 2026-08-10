

using BusManager.Application.Common.DTOs;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Interfaces
{
    public interface ITripService
    {
        Task<IEnumerable<TripListDto>> GetTripsList(DateTime? date = null);
    }
}