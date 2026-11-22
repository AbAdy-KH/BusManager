import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/useAuth';
import { useDriverLocationSender } from './useDriverLocationSender';
import { fetchTrips, startTrip, endTrip, fetchTripById } from '../services/tripService';
import { fetchStopsByRouteId } from '../services/routeService';
import { getTodayDateString } from '../utils/dateUtils';

export function useDriverPage() {
  const { user } = useAuth();
  const locationSender = useDriverLocationSender();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [selectedTripId, setSelectedTripId] = useState(null);
  const [activeRouteStops, setActiveRouteStops] = useState([]);
  const [loadingRouteStops, setLoadingRouteStops] = useState(false);

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

  // Determine the currently active trip (InProgress) or fallback to the user-selected preview trip
  const activeInProgressTrip = useMemo(
    () => trips.find((t) => (t.status || '').toLowerCase() === 'inprogress') || null,
    [trips]
  );

  const displayedTrip = useMemo(() => {
    if (selectedTripId) {
      const found = trips.find((t) => (t.tripId || t.id) === selectedTripId);
      if (found) return found;
    }
    return activeInProgressTrip || trips[0] || null;
  }, [trips, selectedTripId, activeInProgressTrip]);

  // Load ordered route stops whenever displayedTrip changes
  useEffect(() => {
    if (!displayedTrip) {
      setActiveRouteStops([]);
      return;
    }

    let cancelled = false;

    async function resolveAndLoadStops() {
      setLoadingRouteStops(true);
      try {
        let routeId = displayedTrip.routeId;

        if (!routeId) {
          const tripId = displayedTrip.tripId || displayedTrip.id;
          if (tripId) {
            const fullTrip = await fetchTripById(tripId);
            routeId = fullTrip?.routeId;
          }
        }

        if (!routeId) {
          if (!cancelled) setActiveRouteStops([]);
          return;
        }

        const stops = await fetchStopsByRouteId(routeId);
        if (!cancelled) {
          setActiveRouteStops(stops || []);
        }
      } catch {
        if (!cancelled) setActiveRouteStops([]);
      } finally {
        if (!cancelled) setLoadingRouteStops(false);
      }
    }

    resolveAndLoadStops();

    return () => {
      cancelled = true;
    };
  }, [displayedTrip]);

  const handleStartTrip = async (tripId) => {
    if (!tripId) return;
    setActionLoadingId(tripId);
    try {
      await startTrip(tripId);
      setSelectedTripId(tripId);
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
    displayedTrip,
    selectedTripId: displayedTrip?.tripId || displayedTrip?.id || null,
    setSelectedTripId,
    activeRouteStops,
    loadingRouteStops,
    loadDriverTrips,
    handleStartTrip,
    handleEndTrip,
    todayDateStr: getTodayDateString(),
  };
}
