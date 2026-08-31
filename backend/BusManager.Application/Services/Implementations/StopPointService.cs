

using BusManager.Application.Common.Interfaces;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Implementations
{
    public class StopPointService : IStopPointService
    {
        private readonly IUnitOfWork _unitOfWork;

        public StopPointService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<StopPoint>> GetAllStops()
        {
            var stops = await _unitOfWork.Stop.GetAll();

            return stops;
        }
    }
}