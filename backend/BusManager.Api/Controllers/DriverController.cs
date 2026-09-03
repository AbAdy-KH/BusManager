using BusManager.Application.Common.DTOs;
using BusManager.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class DriverController : ControllerBase
    {
        private readonly IDriverService _driverService;

        public DriverController(IDriverService driverService)
        {
            _driverService = driverService;
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<DriverListDto>>> GetAll()
        {
            var driversList = await _driverService.GetAllDrivers();

            return Ok(driversList);
        }
    }
}