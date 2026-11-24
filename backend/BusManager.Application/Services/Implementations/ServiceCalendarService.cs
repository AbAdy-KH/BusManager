using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusManager.Application.Common.DTOs;
using BusManager.Application.Common.Interfaces;
using BusManager.Application.Services.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Application.Services.Implementations
{
    public class ServiceCalendarService : IServiceCalendarService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ServiceCalendarService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<ServiceCalendar>> GetAllCalendars()
        {
            return await _unitOfWork.ServiceCalendar.GetAll();
        }

        public async Task<ServiceCalendar?> GetCalendarById(string id)
        {
            return await _unitOfWork.ServiceCalendar.Get(c => c.Id == id);
        }

        public async Task<ServiceCalendar?> CreateCalendar(ServiceCalendarDto dto)
        {
            if (dto.EndDate.Date < dto.StartDate.Date)
            {
                return null;
            }

            var calendar = new ServiceCalendar
            {
                Name = dto.Name.Trim(),
                StartDate = dto.StartDate.Date,
                EndDate = dto.EndDate.Date,
                Sunday = dto.Sunday,
                Monday = dto.Monday,
                Tuesday = dto.Tuesday,
                Wednesday = dto.Wednesday,
                Thursday = dto.Thursday,
                Friday = dto.Friday,
                Saturday = dto.Saturday,
                IsActive = dto.IsActive
            };

            _unitOfWork.ServiceCalendar.Add(calendar);
            int rows = _unitOfWork.Save();
            return rows > 0 ? calendar : null;
        }

        public async Task<ServiceCalendar?> UpdateCalendar(string id, ServiceCalendarDto dto)
        {
            var calendar = await _unitOfWork.ServiceCalendar.Get(c => c.Id == id);
            if (calendar == null || dto.EndDate.Date < dto.StartDate.Date)
            {
                return null;
            }

            calendar.Name = dto.Name.Trim();
            calendar.StartDate = dto.StartDate.Date;
            calendar.EndDate = dto.EndDate.Date;
            calendar.Sunday = dto.Sunday;
            calendar.Monday = dto.Monday;
            calendar.Tuesday = dto.Tuesday;
            calendar.Wednesday = dto.Wednesday;
            calendar.Thursday = dto.Thursday;
            calendar.Friday = dto.Friday;
            calendar.Saturday = dto.Saturday;
            calendar.IsActive = dto.IsActive;

            _unitOfWork.ServiceCalendar.Update(calendar);
            _unitOfWork.Save();
            return calendar;
        }

        public async Task<bool> DeleteCalendar(string id)
        {
            var calendar = await _unitOfWork.ServiceCalendar.Get(c => c.Id == id);
            if (calendar == null)
            {
                return false;
            }

            var linkedTrips = await _unitOfWork.Trip.GetAll(t => t.ServiceCalendarId == id);
            foreach (var trip in linkedTrips)
            {
                trip.ServiceCalendarId = null;
                _unitOfWork.Trip.Update(trip);
            }

            _unitOfWork.ServiceCalendar.Delete(calendar);
            int rows = _unitOfWork.Save();
            return rows > 0;
        }

        public async Task<GenerateCalendarTripsResultDto> GenerateTripsForDateAsync(string calendarId, DateTime targetDate)
        {
            var calendar = await _unitOfWork.ServiceCalendar.Get(c => c.Id == calendarId);
            if (calendar == null)
            {
                return new GenerateCalendarTripsResultDto(false, "Service calendar not found.", 0, 0, 0);
            }

            var targetDay = targetDate.Date;

            if (!calendar.RunsOnDate(targetDay))
            {
                return new GenerateCalendarTripsResultDto(
                    false,
                    $"Calendar '{calendar.Name}' does not operate on {targetDay:yyyy-MM-dd} ({targetDay.DayOfWeek}).",
                    0,
                    0,
                    0
                );
            }

            var templates = (await _unitOfWork.CalendarTripTemplate.GetAll(
                ct => ct.ServiceCalendarId == calendarId && ct.IsActive
            )).OrderBy(ct => ct.DepartureTime).ToList();

            if (templates.Count == 0)
            {
                return new GenerateCalendarTripsResultDto(
                    false,
                    $"No active trip templates are configured in calendar '{calendar.Name}'.",
                    0,
                    0,
                    0
                );
            }

            var nextDay = targetDay.AddDays(1);

            var targetAssignments = (await _unitOfWork.BusDriver.GetAll(
                b => b.CreatedAt >= targetDay && b.CreatedAt < nextDay
            )).ToList();

            var existingTargetTrips = (await _unitOfWork.Trip.GetAll(
                t => t.ScheduledStartTime >= targetDay && t.ScheduledStartTime < nextDay,
                "BusDriver"
            )).ToList();

            int generatedTrips = 0;
            int skippedTrips = 0;
            int createdAssignments = 0;

            foreach (var tpl in templates)
            {
                var startTime = targetDay.Add(tpl.DepartureTime);
                var arrivalTime = tpl.ArrivalTime >= tpl.DepartureTime
                    ? targetDay.Add(tpl.ArrivalTime)
                    : targetDay.AddDays(1).Add(tpl.ArrivalTime);

                bool duplicateExists = existingTargetTrips.Any(t =>
                    t.RouteId == tpl.RouteId &&
                    t.Direction == tpl.Direction &&
                    t.ScheduledStartTime == startTime &&
                    t.BusDriver != null &&
                    t.BusDriver.DriverId == tpl.DriverId &&
                    t.BusDriver.BusId == tpl.BusId
                );

                if (duplicateExists)
                {
                    skippedTrips++;
                    continue;
                }

                var assignment = targetAssignments.FirstOrDefault(
                    a => a.DriverId == tpl.DriverId && a.BusId == tpl.BusId
                );

                if (assignment == null)
                {
                    assignment = new BusDriver
                    {
                        DriverId = tpl.DriverId,
                        BusId = tpl.BusId,
                        CreatedAt = targetDay.AddHours(6)
                    };
                    _unitOfWork.BusDriver.Add(assignment);
                    targetAssignments.Add(assignment);
                    createdAssignments++;
                }

                var newTrip = new Trip
                {
                    BusDriverId = assignment.Id,
                    RouteId = tpl.RouteId,
                    ServiceCalendarId = calendarId,
                    ScheduledStartTime = startTime,
                    ScheduledArrivalTime = arrivalTime,
                    Direction = tpl.Direction,
                    Notes = tpl.Notes,
                    Status = TripStatus.Scheduled
                };

                _unitOfWork.Trip.Add(newTrip);
                generatedTrips++;
            }

            if (generatedTrips > 0 || createdAssignments > 0)
            {
                _unitOfWork.Save();
            }

            return new GenerateCalendarTripsResultDto(
                true,
                $"Generated {generatedTrips} trip(s) from '{calendar.Name}' for {targetDay:yyyy-MM-dd}.",
                generatedTrips,
                skippedTrips,
                createdAssignments
            );
        }
    }
}
