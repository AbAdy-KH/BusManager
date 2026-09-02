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
        public async Task<Bus> GetBusById(string BusId)
        {
            return await _unitOfWork.Bus.Get(u => u.Id == BusId);
        }

        public async Task<Bus> CreateBus(Bus bus)
        {

            bus.Id = Guid.NewGuid().ToString();
            _unitOfWork.Bus.Add(bus);
            _unitOfWork.Save();
            return bus;
            
        }

        public async Task<bool> DeleteBus(string BusId)
        {
            var bus = await _unitOfWork.Bus.Get(u => u.Id == BusId);
            if(bus == null)
            {
                return false;
            }
            _unitOfWork.Bus.Delete(bus);
            _unitOfWork.Save();
            return true;
        }



        public async Task<Bus> UpdateBus(string BusId, Bus bs)
        {
            var bus = await _unitOfWork.Bus.Get(u => u.Id == BusId);
            if(bus == null)
            {
                return null;
            }
            bus.PlateNumber = bs.PlateNumber;
            bus.Capacity = bs.Capacity;
            bus.Number = bs.Number;
            bus.IsActive = bs.IsActive;
            _unitOfWork.Bus.Update(bus);
            _unitOfWork.Save();
            return bus;

        }
    }
}