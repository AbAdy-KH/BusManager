using BusManager.Application.Common.DTOs;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Bus>>> GetAll()
        {
            var busList = await _busService.GetAllBuses();

            return Ok(busList);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Bus>>GetById(string id)
        {
            var bus = await _busService.GetBusById(id);
            if(bus == null)
            {
                return NotFound();
            }
            return Ok(bus);
        }
        [HttpPost("Create")]
        public async Task<ActionResult<bool>> Create(BusDto busDto)
        {
            bool IsCreated = await _busService.CreateBus(busDto);
            if(!IsCreated)
                return BadRequest();
            return Ok(IsCreated);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Bus>> Update(string id, BusDto busDto)
        {
            var updatedBus = await _busService.UpdateBus(id, busDto);
            if(updatedBus == null)
            {
                return NotFound();
            }
            return Ok(updatedBus);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var isDeleted = await _busService.DeleteBus(id);
            
            if (!isDeleted)
            {
                return BadRequest();
            }

            return Ok(isDeleted); 
        }
    }
}