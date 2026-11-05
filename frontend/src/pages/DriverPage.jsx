import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { useLanguage } from '../context/useLanguage';
import { useDriverLocationSender } from '../hooks/useDriverLocationSender';
import { fetchTrips, getTodayDateString, startTrip, endTrip } from '../services/adminService';
import DriverHeader from '../components/driver/DriverHeader';
import DriverTripsTable from '../components/driver/DriverTripsTable';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DriverPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { busId, coordinates, lastSentTime, status, error: locationError } = useDriverLocationSender();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const loadDriverTrips = useCallback(async () => {
    try {
      const allTrips = await fetchTrips(getTodayDateString());
      // Filter trips assigned to this driver name, or show today's trips
      const driverTrips = (allTrips || []).filter(
        (trip) =>
          !trip.driverName ||
          trip.driverName?.toLowerCase() === user?.name?.toLowerCase() ||
          trip.driverName?.toLowerCase() === user?.email?.toLowerCase()
      );
      setTrips(driverTrips);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDriverTrips();
  }, [loadDriverTrips]);

  const handleStartTrip = async (tripId) => {
    if (!tripId) return;
    setActionError(null);
    setActionSuccess(null);
    setActionLoadingId(tripId);
    try {
      await startTrip(tripId);
      await loadDriverTrips();
      setActionSuccess(t.tripStartedSuccess || 'Trip started successfully!');
    } catch (err) {
      setActionError(err.message || 'Failed to start trip.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleEndTrip = async (tripId) => {
    if (!tripId) return;
    setActionError(null);
    setActionSuccess(null);
    setActionLoadingId(tripId);
    try {
      await endTrip(tripId);
      await loadDriverTrips();
      setActionSuccess(t.tripEndedSuccess || 'Trip completed successfully!');
    } catch (err) {
      setActionError(err.message || 'Failed to complete trip.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Header */}
      <DriverHeader />

      {/* Notifications */}
      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccess(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Driver Schedule / Assigned Trips for Today */}
      <DriverTripsTable
        trips={trips}
        loading={loading}
        dateStr={getTodayDateString()}
        busId={busId}
        onStartTrip={handleStartTrip}
        onEndTrip={handleEndTrip}
        actionLoadingId={actionLoadingId}
      />
    </div>
  );
}
