using System.Collections.Generic;
using System.Threading.Tasks;
using BusManager.Application.Common.DTOs;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Interfaces
{
    public interface ICalendarTripTemplateService
    {
        Task<IEnumerable<CalendarTripTemplateListDto>> GetTemplates(string? calendarId = null);
        Task<CalendarTripTemplateListDto?> GetTemplateById(string templateId);
        Task<CalendarTripTemplate?> CreateTemplate(CalendarTripTemplateDto dto);
        Task<CalendarTripTemplate?> UpdateTemplate(string templateId, CalendarTripTemplateDto dto);
        Task<bool> DeleteTemplate(string templateId);
    }
}
