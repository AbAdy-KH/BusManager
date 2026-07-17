using BusManager.Application.Common.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Infrastructure.Repositories
{
    public class BusRepository : Repository<Bus>, IBusRepository
    {
        public BusRepository(ApplicationDbContext db) : base(db)
        {
            
        }        
    }
}