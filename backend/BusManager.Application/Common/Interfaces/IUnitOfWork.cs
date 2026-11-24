namespace BusManager.Application.Common.Interfaces
{
    public interface IUnitOfWork
    {
        IBusRepository Bus { get; }
        IDriverRepository Driver { get; }
        IStopPointRepository Stop { get; }
        ITripRepository Trip { get; }
        IBusDriverRepository BusDriver { get; }
        IRouteRepository Route { get; }
        IRouteStopRepository RouteStop { get; }
        IServiceCalendarRepository ServiceCalendar { get; }
        ICalendarTripTemplateRepository CalendarTripTemplate { get; }
        int Save();
    }
}
