
using BusManager.Application.Common.Interfaces;
using BusManager.Domain.Entities;

namespace BusManager.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _db;
        public IBusRepository Bus { get; private set; }
        public IDriverRepository Driver { get; private set; }
        public IStopPointRepository Stop { get; private set; }
        public ITripRepository Trip { get; private set; }

        public IBusDriverRepository BusDriver { get; private set; }

        public UnitOfWork(ApplicationDbContext db)
        {
            _db = db;
            Bus = new BusRepository(db);
            Driver = new DriverRepository(db);
            Stop = new StopPointRepository(db);
            Trip = new TripRepository(db);
            BusDriver = new BusDriverRepository(db);
        }

        public int Save()
        {
            try
            {
                return _db.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return 0;
            }
            
        }
    }
}