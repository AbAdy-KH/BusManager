using BusManager.Application.Common.DTOs;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class TripController : ControllerBase
    {
        private readonly ITripService _tripService;

        public TripController(ITripService tripService)
        {
            _tripService = tripService;
        }


        [HttpGet("List")]
        public async Task<ActionResult<IEnumerable<TripListDto>>> GetAll(DateTime? date = null)
        {
            var tripsList = await _tripService.GetTripsList(date);

            return Ok(tripsList);
        }
    }
}