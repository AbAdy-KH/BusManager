import { useDriverPage } from '../hooks/useDriverPage';
import DriverHeader from '../components/driver/DriverHeader';
import DriverTripsTable from '../components/driver/DriverTripsTable';

export default function DriverPage() {
  const {
    busId,
    trips,
    loading,
    actionLoadingId,
    handleStartTrip,
    handleEndTrip,
    todayDateStr,
  } = useDriverPage();

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Header */}
      <DriverHeader />

      {/* Driver Schedule / Assigned Trips for Today */}
      <DriverTripsTable
        trips={trips}
        loading={loading}
        dateStr={todayDateStr}
        busId={busId}
        onStartTrip={handleStartTrip}
        onEndTrip={handleEndTrip}
        actionLoadingId={actionLoadingId}
      />
    </div>
  );
}
