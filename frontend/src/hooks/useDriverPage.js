import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { useDriverLocationSender } from './useDriverLocationSender';
import { fetchTrips, getTodayDateString, startTrip, endTrip } from '../services/adminService';

export function useDriverPage() {
  const { user } = useAuth();
  const locationSender = useDriverLocationSender();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadDriverTrips = useCallback(async () => {
    try {
      const allTrips = await fetchTrips(getTodayDateString());
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
    setActionLoadingId(tripId);
    try {
      await startTrip(tripId);
      await loadDriverTrips();
    } catch {
      // ignore
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleEndTrip = async (tripId) => {
    if (!tripId) return;
    setActionLoadingId(tripId);
    try {
      await endTrip(tripId);
      await loadDriverTrips();
    } catch {
      // ignore
    } finally {
      setActionLoadingId(null);
    }
  };

  return {
    ...locationSender,
    trips,
    loading,
    actionLoadingId,
    loadDriverTrips,
    handleStartTrip,
    handleEndTrip,
    todayDateStr: getTodayDateString(),
  };
}
