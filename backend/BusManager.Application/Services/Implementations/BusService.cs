using BusManager.Application.Common.DTOs;
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

        public async Task<bool> CreateBus(BusDto busDto)
        {

            var newBus = new Bus
            {
                Capacity = busDto.Capacity,
                IsActive = busDto.IsActive,
                Number = busDto.Number,
                PlateNumber = busDto.PlateNumber
            };
            _unitOfWork.Bus.Add(newBus);
            int rowsAffected =  _unitOfWork.Save();
            return rowsAffected > 0;
            
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



        public async Task<Bus> UpdateBus(string BusId, BusDto busDto)
        {
            var bus = await _unitOfWork.Bus.Get(u => u.Id == BusId);
            if(bus == null)
            {
                return null;
            }
            bus.PlateNumber = busDto.PlateNumber;
            bus.Capacity = busDto.Capacity;
            bus.Number = busDto.Number;
            bus.IsActive = busDto.IsActive;
            _unitOfWork.Bus.Update(bus);
            _unitOfWork.Save();
            return bus;

        }
    }
}