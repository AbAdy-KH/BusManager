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


    }
}