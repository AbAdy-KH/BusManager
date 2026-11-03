using BusManager.Application.Common.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Infrastructure.Repositories;

public class RouteRepository : Repository<Route>, IRouteRepository
{
    public RouteRepository(ApplicationDbContext db) : base(db)
    {
    }
}
