

namespace BusManager.Application.Common.Interfaces
{
    public interface IUnitOfWork
    {
        IBusRepository Bus { get; }
        IDriverRepository Driver { get; }
        IStopPointRepository Stop { get; }
        ITripRepository Trip { get; }
        void Save();

    }
}