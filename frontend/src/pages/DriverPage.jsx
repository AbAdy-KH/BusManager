import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useDriverLocationSender } from '../hooks/useDriverLocationSender';
import { fetchTrips, getTodayDateString } from '../services/adminService';
import DriverHeader from '../components/driver/DriverHeader';
import DriverProfileCard from '../components/driver/DriverProfileCard';
import DriverGpsCard from '../components/driver/DriverGpsCard';
import DriverTripsTable from '../components/driver/DriverTripsTable';

export default function DriverPage() {
  const { user } = useAuth();
  const { busId, coordinates, lastSentTime, status, error } = useDriverLocationSender();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadDriverTrips() {
      try {
        const allTrips = await fetchTrips(getTodayDateString());
        if (ignore) return;
        // Filter trips assigned to this driver name, or show today's trips
        const driverTrips = (allTrips || []).filter(
          (trip) =>
            !trip.driverName ||
            trip.driverName?.toLowerCase() === user?.name?.toLowerCase() ||
            trip.driverName?.toLowerCase() === user?.email?.toLowerCase()
        );
        setTrips(driverTrips.length > 0 ? driverTrips : allTrips || []);
      } catch {
        // ignore
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadDriverTrips();

    return () => {
      ignore = true;
    };
  }, [user]);

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Header */}
      <DriverHeader />

      {/* Grid: Driver Profile & GPS Transmitter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DriverProfileCard user={user} />
        <DriverGpsCard
          busId={busId}
          coordinates={coordinates}
          lastSentTime={lastSentTime}
          status={status}
          error={error}
        />
      </div>

      {/* Driver Schedule / Assigned Trips for Today */}
      <DriverTripsTable
        trips={trips}
        loading={loading}
        dateStr={getTodayDateString()}
        busId={busId}
      />
    </div>
  );
}
