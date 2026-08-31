using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusManager.Application.Common.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Infrastructure.Repositories
{
    public class DriverRepository : Repository<Driver>, IDriverRepository
    {
        public DriverRepository(ApplicationDbContext db) : base(db)
        {
        }     

        
    }
}