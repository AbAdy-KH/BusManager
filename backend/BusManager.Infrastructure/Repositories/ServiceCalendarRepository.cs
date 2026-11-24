using BusManager.Application.Common.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Infrastructure.Repositories
{
    public class ServiceCalendarRepository : Repository<ServiceCalendar>, IServiceCalendarRepository
    {
        public ServiceCalendarRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
