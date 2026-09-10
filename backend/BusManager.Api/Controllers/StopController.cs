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
    public class StopController : ControllerBase
    {
        private readonly IStopPointService _stopService;

        public StopController(IStopPointService stopService)
        {
            _stopService = stopService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<IEnumerable<StopPoint>>> GetAll()
        {
            var stopsList = await _stopService.GetAllStops();
            return Ok(stopsList);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<StopPoint>> GetById(string id)
        {
            StopPoint stopPoint = await _stopService.GetStopPointById(id);
            if (stopPoint == null)
            {
                return NotFound();
            }
            return Ok(stopPoint);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> Create([FromBody] StopPointDto stopPointDto)
        {
            bool isCreated = await _stopService.CreateStopPoint(stopPointDto);
            if (!isCreated)
            {
                return BadRequest("Could not create stop point.");
            }
            return Ok(new { Success = true, Message = "Stop point created successfully." });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StopPoint>> Update(string id, [FromBody] StopPointDto stopPointDto)
        {
            StopPoint stopPoint = await _stopService.UpdateStopPoint(id, stopPointDto);
            if (stopPoint == null)
            {
                return NotFound();
            }
            return Ok(stopPoint);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(string id)
        {
            bool isDeleted = await _stopService.DeleteStopPoint(id);
            if (!isDeleted)
            {
                return NotFound();
            }
            return Ok(new { Success = true, Message = "Stop point deleted successfully." });
        }
    }
}