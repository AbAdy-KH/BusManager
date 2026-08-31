using BusManager.Application.Common.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Infrastructure.Repositories
{
    public class StopPointRepository : Repository<StopPoint>, IStopPointRepository
    {
        public StopPointRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}