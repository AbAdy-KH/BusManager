using BusManager.Application.Common.DTOs;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteStopController : ControllerBase
    {
        private readonly IRouteStopService _routeStopService;

        public RouteStopController(IRouteStopService routeStopService)
        {
            _routeStopService = routeStopService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<IEnumerable<RouteStopListDto>>> GetAll([FromQuery] string? routeId = null)
        {
            var result = await _routeStopService.GetAllRouteStops(routeId);
            return Ok(result);
        }

        [HttpGet("route/{routeId}")]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<IEnumerable<RouteStopListDto>>> GetByRoute(string routeId)
        {
            var result = await _routeStopService.GetStopsByRouteId(routeId);
            return Ok(result);
        }

        [HttpGet("{routeId}/{stopPointId}")]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<RouteStopListDto>> GetById(string routeId, string stopPointId)
        {
            var result = await _routeStopService.GetRouteStop(routeId, stopPointId);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpPost]
        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> AddStopToRoute([FromBody] RouteStopDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            bool created = await _routeStopService.AddStopToRoute(dto);
            if (!created)
            {
                return BadRequest("Could not add stop point to the route. It may already exist or the referenced Route or Stop was not found.");
            }

            return Ok(new { Success = true, Message = "Stop added to route successfully." });
        }

        [HttpPut("{routeId}/{stopPointId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<RouteStop>> Update(string routeId, string stopPointId, [FromBody] RouteStopDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = await _routeStopService.UpdateRouteStop(routeId, stopPointId, dto);
            if (updated == null)
            {
                return NotFound();
            }
            return Ok(updated);
        }

        [HttpDelete("{routeId}/{stopPointId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(string routeId, string stopPointId)
        {
            bool deleted = await _routeStopService.RemoveStopFromRoute(routeId, stopPointId);
            if (!deleted)
            {
                return NotFound();
            }
            return Ok(new { Success = true, Message = "Stop removed from route successfully." });
        }
    }
}
