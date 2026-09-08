using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Common.Interfaces;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services
{
    public class BusDriverService : IBusDriverService
    {
        private readonly IUnitOfWork _unitOfwork;
        public BusDriverService(IUnitOfWork unitOfWork)
        {
            _unitOfwork = unitOfWork;
        }
        public async Task<bool> CreateBusDriver(BusDriverDto busDriverDto)
        {
            BusDriver busDriver = new BusDriver{ 
                BusId = busDriverDto.BusId,
                Bus = busDriverDto.Bus,
                CreatedAt = busDriverDto.CreatedAt,
                Driver = busDriverDto.Driver,
                DriverId = busDriverDto.DriverId
                };
            _unitOfwork.BusDriver.Add(busDriver);
            int rowsAffected =  _unitOfwork.Save();
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteBusDriver(string BusDriverId)
        {
            BusDriver busDriver = await _unitOfwork.BusDriver.Get(u => u.Id == BusDriverId);
            if(busDriver == null)
            {
                return false;
            }
            _unitOfwork.BusDriver.Delete(busDriver);
            int rowsAffected = _unitOfwork.Save();
            return rowsAffected > 0;
        }

        public async Task<BusDriver> GetBusDriverById(string BusDriverId)
        {
            BusDriver busDriver = await _unitOfwork.BusDriver.Get(u => u.Id == BusDriverId , "BusDriver.Driver, BusDriver.Bus");
            return busDriver;
        }

        public async Task<BusDriver> UpdateBusDriver(string BusDriverId, BusDriverDto busDriverDto)
        {
            BusDriver busDriver = await _unitOfwork.BusDriver.Get(u => u.Id == BusDriverId , "BusDriver.Driver, BusDriver.Bus");
            busDriver.BusId = busDriverDto.BusId;
            busDriver.Bus = busDriverDto.Bus;
            busDriver.CreatedAt = busDriver.CreatedAt;
            busDriver.DriverId = busDriverDto.DriverId;
            busDriver.Driver = busDriverDto.Driver;
            _unitOfwork.BusDriver.Update(busDriver);
            _unitOfwork.Save();
            return busDriver;
        }
    }
}