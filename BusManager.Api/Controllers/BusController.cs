using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;
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
        public async Task<ActionResult<IEnumerable<Bus>>> GetAll()
        {
            var busList = await _busService.GetAllBuses();

            return Ok(busList);
        }
    }
}