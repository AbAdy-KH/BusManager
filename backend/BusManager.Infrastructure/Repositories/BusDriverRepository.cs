using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusManager.Application.Common.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Infrastructure.Repositories
{
    public class BusDriverRepository : Repository<BusDriver> , IBusDriverRepository
    {

        public BusDriverRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}