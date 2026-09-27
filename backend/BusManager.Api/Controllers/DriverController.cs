using System.Collections.Generic;
using System.Threading.Tasks;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DriverController : ControllerBase
    {
        private readonly IDriverService _driverService;

        public DriverController(IDriverService driverService)
        {
            _driverService = driverService;
        }

        [HttpGet("all")]
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<DriverListDto>>> GetAll()
        {
            var driversList = await _driverService.GetAllDrivers();
            return Ok(driversList);
        }

        // Get driver by id
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DriverDto>> Get(string id)
        {
            var driver = await _driverService.GetDriverById(id);
            if (driver == null) return NotFound();
            return Ok(driver);
        }

        // Create driver
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Create([FromBody] DriverDto driverDto)
        {
            var created = await _driverService.CreateDriver(driverDto);
            if (!created) return BadRequest();
            // Assuming driverDto includes an identifier after creation; using Name as placeholder
            return CreatedAtAction(nameof(Get), new { id = driverDto.Name }, driverDto);
        }

        // Update driver
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update(string id, [FromBody] DriverDto driverDto)
        {
            var updated = await _driverService.UpdateDriver(id, driverDto);
            if (!updated) return NotFound();
            return NoContent();
        }

        // Delete driver
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(string id)
        {
            var deleted = await _driverService.DeleteDriver(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}