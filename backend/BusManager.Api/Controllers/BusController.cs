using System.Collections.Generic;
using System.Threading.Tasks;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BusController : ControllerBase
    {
        private readonly IBusService _busService;

        public BusController(IBusService busService)
        {
            _busService = busService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<IEnumerable<Bus>>> GetAll()
        {
            var busList = await _busService.GetAllBuses();
            return Ok(busList);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<Bus>> GetById(string id)
        {
            var bus = await _busService.GetBusById(id);
            if (bus == null)
            {
                return NotFound();
            }
            return Ok(bus);
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> Create([FromBody] BusDto busDto)
        {
            bool isCreated = await _busService.CreateBus(busDto);
            if (!isCreated)
            {
                return BadRequest("Could not create bus.");
            }
            return Ok(new { Success = true, Message = "Bus created successfully." });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Bus>> Update(string id, [FromBody] BusDto busDto)
        {
            var updatedBus = await _busService.UpdateBus(id, busDto);
            if (updatedBus == null)
            {
                return NotFound();
            }
            return Ok(updatedBus);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(string id)
        {
            var isDeleted = await _busService.DeleteBus(id);
            if (!isDeleted)
            {
                return NotFound();
            }

            return Ok(new { Success = true, Message = "Bus deleted successfully." });
        }
    }
}