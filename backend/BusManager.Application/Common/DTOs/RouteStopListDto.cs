namespace BusManager.Application.Common.DTOs
{
    public record RouteStopListDto
    (
        string RouteId,
        string? RouteName,
        string? RouteCode,
        string StopPointId,
        string? StopPointName,
        string? StopPointAddress,
        decimal StopPointLatitude,
        decimal StopPointLongitude,
        int SequenceOrder,
        int? EstimatedMinutesFromStart
    );
}
