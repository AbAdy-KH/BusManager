
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
    
        
    }
}