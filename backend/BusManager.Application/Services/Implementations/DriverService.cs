using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Common.Interfaces;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Implementations
{
    public class DriverService : IDriverService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DriverService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<DriverListDto>> GetAllDrivers()
        {
            var drivers = await _unitOfWork.Driver.GetAll(null);

            var driverListDto = new List<DriverListDto>();
            foreach (var driver in drivers)
            {
                driverListDto.Add(
                    new DriverListDto(
                        driver.Id,
                        driver.Name,
                        driver.LicenseNumber
                    )
                );
            }

            return driverListDto;
        }

        public async Task<DriverDto?> GetDriverById(string id)
        {
            var driver = await _unitOfWork.Driver.Get(d => d.Id == id);
            if (driver == null) return null;
            return new DriverDto
            {
                Name = driver.Name,
                LicenseNumber = driver.LicenseNumber,
                PhoneNumber = driver.PhoneNumber,
                Email = driver.Email,
            };
        }

        public async Task<bool> CreateDriver(DriverDto driverDto)
        {
            var email = string.IsNullOrWhiteSpace(driverDto.Email)
                ? null
                : driverDto.Email.Trim();

            var userName = email ?? $"driver_{Guid.NewGuid():N}";

            var driver = new Driver
            {
                Name = driverDto.Name.Trim(),
                LicenseNumber = (driverDto.LicenseNumber ?? string.Empty).Trim(),
                PhoneNumber = driverDto.PhoneNumber,
                Email = email,
                NormalizedEmail = email?.ToUpperInvariant(),
                UserName = userName,
                NormalizedUserName = userName.ToUpperInvariant(),
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString(),
            };
            _unitOfWork.Driver.Add(driver);
            int rows = _unitOfWork.Save();
            return rows > 0;
        }

        public async Task<bool> UpdateDriver(string id, DriverDto driverDto)
        {
            var driver = await _unitOfWork.Driver.Get(d => d.Id == id);
            if (driver == null) return false;
            driver.Name = driverDto.Name.Trim();
            driver.LicenseNumber = (driverDto.LicenseNumber ?? string.Empty).Trim();
            driver.PhoneNumber = driverDto.PhoneNumber;
            if (!string.IsNullOrWhiteSpace(driverDto.Email))
            {
                driver.Email = driverDto.Email.Trim();
                driver.NormalizedEmail = driver.Email.ToUpperInvariant();
            }
            _unitOfWork.Driver.Update(driver);
            int rows = _unitOfWork.Save();
            return rows > 0;
        }

        public async Task<bool> DeleteDriver(string id)
        {
            var driver = await _unitOfWork.Driver.Get(d => d.Id == id);
            if (driver == null) return false;
            _unitOfWork.Driver.Delete(driver);
            int rows = _unitOfWork.Save();
            return rows > 0;
        }
    }
}
