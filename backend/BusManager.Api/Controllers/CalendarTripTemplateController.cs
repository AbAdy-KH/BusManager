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
    public class CalendarTripTemplateController : ControllerBase
    {
        private readonly ICalendarTripTemplateService _templateService;

        public CalendarTripTemplateController(ICalendarTripTemplateService templateService)
        {
            _templateService = templateService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<IEnumerable<CalendarTripTemplateListDto>>> GetAll(
            [FromQuery] string? calendarId = null)
        {
            var templates = await _templateService.GetTemplates(calendarId);
            return Ok(templates);
        }

        [HttpGet("calendar/{calendarId}")]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<IEnumerable<CalendarTripTemplateListDto>>> GetByCalendar(
            string calendarId)
        {
            var templates = await _templateService.GetTemplates(calendarId);
            return Ok(templates);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<ActionResult<CalendarTripTemplateListDto>> GetById(string id)
        {
            var template = await _templateService.GetTemplateById(id);
            if (template == null) return NotFound();
            return Ok(template);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CalendarTripTemplate>> Create(
            [FromBody] CalendarTripTemplateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _templateService.CreateTemplate(dto);
            if (created == null)
            {
                return BadRequest("Could not create trip template. Verify Calendar, Bus, and Driver IDs.");
            }
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CalendarTripTemplate>> Update(
            string id,
            [FromBody] CalendarTripTemplateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updated = await _templateService.UpdateTemplate(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(string id)
        {
            bool deleted = await _templateService.DeleteTemplate(id);
            if (!deleted) return NotFound();
            return Ok(new { Success = true, Message = "Trip template deleted successfully." });
        }
    }
}
