using BusManager.Application.Common.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Infrastructure.Repositories
{
    public class CalendarTripTemplateRepository : Repository<CalendarTripTemplate>, ICalendarTripTemplateRepository
    {
        public CalendarTripTemplateRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
