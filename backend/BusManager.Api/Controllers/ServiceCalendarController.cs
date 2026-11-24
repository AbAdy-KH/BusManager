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
    public class ServiceCalendarController : ControllerBase
    {
        private readonly IServiceCalendarService _calendarService;

        public ServiceCalendarController(IServiceCalendarService calendarService)
        {
            _calendarService = calendarService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<IEnumerable<ServiceCalendar>>> GetAll()
        {
            var calendars = await _calendarService.GetAllCalendars();
            return Ok(calendars);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<ServiceCalendar>> GetById(string id)
        {
            var calendar = await _calendarService.GetCalendarById(id);
            if (calendar == null) return NotFound();
            return Ok(calendar);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceCalendar>> Create([FromBody] ServiceCalendarDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _calendarService.CreateCalendar(dto);
            if (created == null)
            {
                return BadRequest("Could not create service calendar. Ensure EndDate is on or after StartDate.");
            }
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceCalendar>> Update(string id, [FromBody] ServiceCalendarDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updated = await _calendarService.UpdateCalendar(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(string id)
        {
            bool deleted = await _calendarService.DeleteCalendar(id);
            if (!deleted) return NotFound();
            return Ok(new { Success = true, Message = "Service calendar deleted successfully." });
        }

        [HttpPost("{id}/generate")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GenerateCalendarTripsResultDto>> GenerateTrips(
            string id,
            [FromQuery] DateTime? date = null)
        {
            var targetDate = date ?? DateTime.Now.Date;
            var result = await _calendarService.GenerateTripsForDateAsync(id, targetDate);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
    }
}
