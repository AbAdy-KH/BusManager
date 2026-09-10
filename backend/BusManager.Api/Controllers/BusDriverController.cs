using System;
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
    public class BusDriverController : ControllerBase
    {
        private readonly IBusDriverService _busDriverService;

        public BusDriverController(IBusDriverService busDriverService)
        {
            _busDriverService = busDriverService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<BusDriverListDto>>> GetAll([FromQuery] DateTime? date = null)
        {
            var assignments = await _busDriverService.GetAllAssignments(date);
            return Ok(assignments);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<BusDriverListDto>> GetById(string id)
        {
            var assignment = await _busDriverService.GetAssignmentById(id);
            if (assignment == null)
            {
                return NotFound();
            }
            return Ok(assignment);
        }

        [HttpGet("today/driver/{driverId}")]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<BusDriverListDto>> GetTodayDriverAssignment(string driverId)
        {
            var assignment = await _busDriverService.GetTodayAssignmentByDriverId(driverId);
            if (assignment == null)
            {
                return NotFound("No bus assigned for this driver today.");
            }
            return Ok(assignment);
        }

        [HttpPost("assign")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> Create([FromBody] BusDriverDto busDriverDto)
        {
            bool isCreated = await _busDriverService.CreateBusDriver(busDriverDto);
            if (!isCreated)
            {
                return BadRequest("Could not record bus-driver assignment.");
            }
            return Ok(new { Success = true, Message = "Bus assigned to driver successfully." });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<BusDriver>> Update(string id, [FromBody] BusDriverDto busDriverDto)
        {
            var busDriver = await _busDriverService.UpdateBusDriver(id, busDriverDto);
            if (busDriver == null)
            {
                return NotFound();
            }
            return Ok(busDriver);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(string id)
        {
            bool isDeleted = await _busDriverService.DeleteBusDriver(id);
            if (!isDeleted)
            {
                return NotFound();
            }
            return Ok(new { Success = true, Message = "Assignment removed successfully." });
        }
    }
}