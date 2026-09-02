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
        [HttpPost("create")]
        public async Task<ActionResult<Bus>> Create(Bus bus)
        {
            var CreatedBus = await _busService.CreateBus(bus);
            if(CreatedBus == null)
            {
                return BadRequest();
            }
            return CreatedAtAction(nameof(GetById), new { id = CreatedBus.Id }, CreatedBus);
        }
        [HttpPut("update/{id}")]
        public async Task<ActionResult<Bus>> Update(string id, Bus bus)
        {
            var updatedBus = await _busService.UpdateBus(id, bus);
            if(updatedBus == null)
            {
                return NotFound();
            }
            return Ok(updatedBus);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var isDeleted = await _busService.DeleteBus(id);

                if (!isDeleted)
                {
                    return NotFound($"Bus with ID '{id}' was not found.");
                }

                return NoContent(); 
            }
            catch (DbUpdateException)
            {
                return Conflict($"Cannot delete bus with ID '{id}' because it has related trip or driver records.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }
    }
}