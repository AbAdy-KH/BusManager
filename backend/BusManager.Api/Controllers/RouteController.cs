using BusManager.Application.Common.DTOs;
using BusManager.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Route = BusManager.Domain.Entities.Route;

namespace BusManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteController : ControllerBase
    {
        private readonly IRouteService _routeService;

        public RouteController(IRouteService routeService)
        {
            _routeService = routeService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<IEnumerable<Route>>> GetAll()
        {
            var routeList = await _routeService.GetAllRoutes();
            return Ok(routeList);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<Route>> GetById(string id)
        {
            var route = await _routeService.GetRouteById(id);
            if (route == null)
            {
                return NotFound();
            }
            return Ok(route);
        }

        [HttpPost]
        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Create([FromBody] RouteDto routeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            bool isCreated = await _routeService.CreateRoute(routeDto);
            if (!isCreated)
            {
                return BadRequest("Could not create route.");
            }
            return Ok(new { Success = true, Message = "Route created successfully." });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Route>> Update(string id, [FromBody] RouteDto routeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedRoute = await _routeService.UpdateRoute(id, routeDto);
            if (updatedRoute == null)
            {
                return NotFound();
            }
            return Ok(updatedRoute);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(string id)
        {
            var isDeleted = await _routeService.DeleteRoute(id);
            if (!isDeleted)
            {
                return NotFound();
            }

            return Ok(new { Success = true, Message = "Route deleted successfully." });
        }
    }
}
