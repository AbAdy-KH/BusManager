using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BusManager.Application.Common.DTOs;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Interfaces
{
    public interface IServiceCalendarService
    {
        Task<IEnumerable<ServiceCalendar>> GetAllCalendars();
        Task<ServiceCalendar?> GetCalendarById(string id);
        Task<ServiceCalendar?> CreateCalendar(ServiceCalendarDto dto);
        Task<ServiceCalendar?> UpdateCalendar(string id, ServiceCalendarDto dto);
        Task<bool> DeleteCalendar(string id);
        Task<GenerateCalendarTripsResultDto> GenerateTripsForDateAsync(string calendarId, DateTime targetDate);
    }
}
