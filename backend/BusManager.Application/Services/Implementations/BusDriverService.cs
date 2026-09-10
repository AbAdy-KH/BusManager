using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Common.Interfaces;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services
{
    public class BusDriverService : IBusDriverService
    {
        private readonly IUnitOfWork _unitOfWork;

        public BusDriverService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<BusDriverListDto>> GetAllAssignments(DateTime? date = null)
        {
            Expression<Func<BusDriver, bool>>? filter = null;
            if (date != null)
            {
                var startDate = date.Value.Date;
                var endDate = startDate.AddDays(1);
                filter = b => b.CreatedAt >= startDate && b.CreatedAt < endDate;
            }

            var assignments = await _unitOfWork.BusDriver.GetAll(filter, "Bus,Driver");
            var result = new List<BusDriverListDto>();

            foreach (var a in assignments)
            {
                result.Add(new BusDriverListDto(
                    a.Id,
                    a.BusId,
                    a.Bus?.Number,
                    a.Bus?.PlateNumber,
                    a.DriverId,
                    a.Driver?.Name,
                    a.Driver?.LicenseNumber,
                    a.CreatedAt
                ));
            }

            return result;
        }

        public async Task<BusDriverListDto?> GetAssignmentById(string id)
        {
            var a = await _unitOfWork.BusDriver.Get(u => u.Id == id, "Bus,Driver");
            if (a == null) return null;

            return new BusDriverListDto(
                a.Id,
                a.BusId,
                a.Bus?.Number,
                a.Bus?.PlateNumber,
                a.DriverId,
                a.Driver?.Name,
                a.Driver?.LicenseNumber,
                a.CreatedAt
            );
        }

        public async Task<BusDriverListDto?> GetTodayAssignmentByDriverId(string driverId)
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);

            var a = await _unitOfWork.BusDriver.Get(
                u => u.DriverId == driverId && u.CreatedAt >= today && u.CreatedAt < tomorrow,
                "Bus,Driver"
            );

            if (a == null) return null;

            return new BusDriverListDto(
                a.Id,
                a.BusId,
                a.Bus?.Number,
                a.Bus?.PlateNumber,
                a.DriverId,
                a.Driver?.Name,
                a.Driver?.LicenseNumber,
                a.CreatedAt
            );
        }

        public async Task<bool> CreateBusDriver(BusDriverDto busDriverDto)
        {
            var busDriver = new BusDriver
            {
                BusId = busDriverDto.BusId,
                DriverId = busDriverDto.DriverId,
                CreatedAt = busDriverDto.CreatedAt != default ? busDriverDto.CreatedAt : DateTime.UtcNow
            };

            _unitOfWork.BusDriver.Add(busDriver);
            int rowsAffected = _unitOfWork.Save();
            return rowsAffected > 0;
        }

        public async Task<BusDriver?> UpdateBusDriver(string busDriverId, BusDriverDto busDriverDto)
        {
            var busDriver = await _unitOfWork.BusDriver.Get(u => u.Id == busDriverId);
            if (busDriver == null) return null;

            busDriver.BusId = busDriverDto.BusId;
            busDriver.DriverId = busDriverDto.DriverId;
            if (busDriverDto.CreatedAt != default)
            {
                busDriver.CreatedAt = busDriverDto.CreatedAt;
            }

            _unitOfWork.BusDriver.Update(busDriver);
            _unitOfWork.Save();
            return busDriver;
        }

        public async Task<bool> DeleteBusDriver(string busDriverId)
        {
            var busDriver = await _unitOfWork.BusDriver.Get(u => u.Id == busDriverId);
            if (busDriver == null) return false;

            _unitOfWork.BusDriver.Delete(busDriver);
            int rowsAffected = _unitOfWork.Save();
            return rowsAffected > 0;
        }
    }
}