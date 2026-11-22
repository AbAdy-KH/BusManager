import { useDriverPage } from '../hooks/useDriverPage';
import DriverHeader from '../components/driver/DriverHeader';
import DriverRouteMap from '../components/driver/DriverRouteMap';
import DriverTripsTable from '../components/driver/DriverTripsTable';

export default function DriverPage() {
  const {
    busId,
    coordinates,
    trips,
    loading,
    actionLoadingId,
    displayedTrip,
    selectedTripId,
    setSelectedTripId,
    activeRouteStops,
    loadingRouteStops,
    handleStartTrip,
    handleEndTrip,
    todayDateStr,
  } = useDriverPage();

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Header */}
      <DriverHeader />

      {/* Live Map for Active / Selected Trip Route & Ordered Stops */}
      <DriverRouteMap
        trip={displayedTrip}
        routeStops={activeRouteStops}
        loadingRouteStops={loadingRouteStops}
        driverCoordinates={coordinates}
        busId={busId}
      />

      {/* Driver Schedule / Assigned Trips for Today */}
      <DriverTripsTable
        trips={trips}
        loading={loading}
        dateStr={todayDateStr}
        busId={busId}
        selectedTripId={selectedTripId}
        onSelectTrip={setSelectedTripId}
        onStartTrip={handleStartTrip}
        onEndTrip={handleEndTrip}
        actionLoadingId={actionLoadingId}
      />
    </div>
  );
}
