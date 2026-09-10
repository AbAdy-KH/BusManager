using System;
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
    }
}