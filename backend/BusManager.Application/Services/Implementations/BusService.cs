using BusManager.Application.Common.Interfaces;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Implementations
{
    public class BusService : IBusService
    {
        private readonly IUnitOfWork _unitOfWork;

        public BusService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        public async Task<IEnumerable<Bus>> GetAllBuses()
        {
            return await _unitOfWork.Bus.GetAll();    
        }
    }
}