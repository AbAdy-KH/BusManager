using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Common.Interfaces;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Implementations
{
    public class CalendarTripTemplateService : ICalendarTripTemplateService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CalendarTripTemplateService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<CalendarTripTemplateListDto>> GetTemplates(string? calendarId = null)
        {
            Expression<Func<CalendarTripTemplate, bool>>? filter = null;
            if (!string.IsNullOrWhiteSpace(calendarId))
            {
                filter = ct => ct.ServiceCalendarId == calendarId;
            }

            var items = await _unitOfWork.CalendarTripTemplate.GetAll(
                filter,
                "ServiceCalendar,Route,Bus,Driver"
            );

            return items
                .OrderBy(ct => ct.DepartureTime)
                .Select(ct => new CalendarTripTemplateListDto(
                    ct.Id,
                    ct.ServiceCalendarId,
                    ct.ServiceCalendar?.Name,
                    ct.RouteId,
                    ct.Route?.Name,
                    ct.Route?.Code,
                    ct.BusId,
                    ct.Bus?.Number,
                    ct.Bus?.PlateNumber,
                    ct.DriverId,
                    ct.Driver?.Name,
                    ct.DepartureTime,
                    ct.ArrivalTime,
                    ct.Direction.ToString(),
                    ct.Notes,
                    ct.IsActive
                ))
                .ToList();
        }

        public async Task<CalendarTripTemplateListDto?> GetTemplateById(string templateId)
        {
            var ct = await _unitOfWork.CalendarTripTemplate.Get(
                x => x.Id == templateId,
                "ServiceCalendar,Route,Bus,Driver"
            );

            if (ct == null) return null;

            return new CalendarTripTemplateListDto(
                ct.Id,
                ct.ServiceCalendarId,
                ct.ServiceCalendar?.Name,
                ct.RouteId,
                ct.Route?.Name,
                ct.Route?.Code,
                ct.BusId,
                ct.Bus?.Number,
                ct.Bus?.PlateNumber,
                ct.DriverId,
                ct.Driver?.Name,
                ct.DepartureTime,
                ct.ArrivalTime,
                ct.Direction.ToString(),
                ct.Notes,
                ct.IsActive
            );
        }

        public async Task<CalendarTripTemplate?> CreateTemplate(CalendarTripTemplateDto dto)
        {
            var calendar = await _unitOfWork.ServiceCalendar.Get(c => c.Id == dto.ServiceCalendarId);
            if (calendar == null) return null;

            var bus = await _unitOfWork.Bus.Get(b => b.Id == dto.BusId);
            if (bus == null) return null;

            var driver = await _unitOfWork.Driver.Get(d => d.Id == dto.DriverId);
            if (driver == null) return null;

            var template = new CalendarTripTemplate
            {
                ServiceCalendarId = dto.ServiceCalendarId,
                RouteId = string.IsNullOrWhiteSpace(dto.RouteId) ? null : dto.RouteId,
                BusId = dto.BusId,
                DriverId = dto.DriverId,
                DepartureTime = dto.DepartureTime,
                ArrivalTime = dto.ArrivalTime,
                Direction = dto.Direction,
                Notes = dto.Notes,
                IsActive = dto.IsActive
            };

            _unitOfWork.CalendarTripTemplate.Add(template);
            int rows = _unitOfWork.Save();
            return rows > 0 ? template : null;
        }

        public async Task<CalendarTripTemplate?> UpdateTemplate(string templateId, CalendarTripTemplateDto dto)
        {
            var template = await _unitOfWork.CalendarTripTemplate.Get(ct => ct.Id == templateId);
            if (template == null) return null;

            template.ServiceCalendarId = dto.ServiceCalendarId;
            template.RouteId = string.IsNullOrWhiteSpace(dto.RouteId) ? null : dto.RouteId;
            template.BusId = dto.BusId;
            template.DriverId = dto.DriverId;
            template.DepartureTime = dto.DepartureTime;
            template.ArrivalTime = dto.ArrivalTime;
            template.Direction = dto.Direction;
            template.Notes = dto.Notes;
            template.IsActive = dto.IsActive;

            _unitOfWork.CalendarTripTemplate.Update(template);
            _unitOfWork.Save();
            return template;
        }

        public async Task<bool> DeleteTemplate(string templateId)
        {
            var template = await _unitOfWork.CalendarTripTemplate.Get(ct => ct.Id == templateId);
            if (template == null) return false;

            _unitOfWork.CalendarTripTemplate.Delete(template);
            int rows = _unitOfWork.Save();
            return rows > 0;
        }
    }
}
