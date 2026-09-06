using BusManager.Application.Common.DTOs;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;
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

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<StopPoint>>> GetAll()
        {
            var stopsList = await _stopService.GetAllStops();

            return Ok(stopsList);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<StopPoint>> GetById(string id)
        {
            StopPoint stopPoint = await _stopService.GetStopPointById(id);
            if(stopPoint == null)
            {
                return NotFound();
            }
            return Ok(stopPoint);
        }
        [HttpPost("Create")]
        public async Task<ActionResult<bool>> Create(StopPointDto stopPointDto)
        {
            bool isCreated = await _stopService.CreateStopPoint(stopPointDto);
            if(!isCreated)
            {
                return BadRequest();
            }
            return Ok(isCreated);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(string id)
        {
            bool isDeleted = await _stopService.DeleteStopPoint(id);
            if(!isDeleted)
            {
                return BadRequest();
            }
            return Ok(isDeleted);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<StopPoint>> Update(string id , StopPointDto stopPointDto)
        {
            StopPoint stopPoint = await _stopService.UpdateStopPoint(id , stopPointDto);
            if(stopPoint == null)
            {
                return NotFound();
            }
            return Ok(stopPoint);
        }



    }
}