
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

            List<DriverListDto> driverListDto = new List<DriverListDto>();
            foreach(var driver in drivers)
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
            var driver = new Driver
            {
                Name = driverDto.Name,
                LicenseNumber = driverDto.LicenseNumber,
                PhoneNumber = driverDto.PhoneNumber,
                Email = driverDto.Email,
            };
            _unitOfWork.Driver.Add(driver);
            int rows = _unitOfWork.Save();
            return rows > 0;
        }

        public async Task<bool> UpdateDriver(string id, DriverDto driverDto)
        {
            var driver = await _unitOfWork.Driver.Get(d => d.Id == id);
            if (driver == null) return false;
            driver.Name = driverDto.Name;
            driver.LicenseNumber = driverDto.LicenseNumber;
            driver.PhoneNumber = driverDto.PhoneNumber;
            driver.Email = driverDto.Email;
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
        }    }
}