

namespace BusManager.Application.Common.Interfaces
{
    public interface IUnitOfWork
    {
        IBusRepository Bus { get; }
    }
}