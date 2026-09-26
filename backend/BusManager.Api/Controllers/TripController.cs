using BusManager.Application.Common.DTOs;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Driver")]
    public class TripController : ControllerBase
    {
        private readonly ITripService _tripService;

        public TripController(ITripService tripService)
        {
            _tripService = tripService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TripListDto>>> GetAll([FromQuery] DateTime? date = null)
        {
            var tripsList = await _tripService.GetTripsList(date);
            return Ok(tripsList);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetById(string id)
        {
            var trip = await _tripService.GetByIdAsync(id);
            if (trip == null) return NotFound();
            return Ok(trip);
        }

        [HttpPost]
        public async Task<ActionResult<Trip>> Create([FromBody] TripDto dto)
        {
            var created = await _tripService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Trip>> Update(string id, [FromBody] TripDto dto)
        {
            var updated = await _tripService.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _tripService.DeleteAsync(id);
            return NoContent();
        }
    }
}
