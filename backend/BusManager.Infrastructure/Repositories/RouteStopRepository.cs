using BusManager.Application.Common.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Infrastructure.Repositories;

public class RouteStopRepository : Repository<RouteStop>, IRouteStopRepository
{
    public RouteStopRepository(ApplicationDbContext db) : base(db)
    {
    }
}
