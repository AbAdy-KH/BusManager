import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/useAuth';
import { useLanguage } from '../context/useLanguage';
import {
  fetchBuses,
  fetchDrivers,
  fetchTrips,
  fetchStops,
  fetchRoutes,
  fetchRouteStops,
  getTodayDateString,
} from '../services/adminService';
import { startAdminTracking } from '../services/trackingHubService';
import { Map, Bus, Users, Route as RouteIcon, MapPin, GitMerge } from 'lucide-react';

export function useAdminPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAdmin = user?.roles?.includes('Admin');

  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [tripDate, setTripDate] = useState(getTodayDateString());

  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [routeStops, setRouteStops] = useState([]);

  const [liveBuses, setLiveBuses] = useState({});
  const [hubStatus, setHubStatus] = useState('disconnected');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = useCallback(async (selectedTripDate = tripDate) => {
    setLoading(true);
    setError(null);
    try {
      const [busesData, driversData, tripsData, stopsData, routesData, routeStopsData] = await Promise.allSettled([
        fetchBuses(),
        fetchDrivers(),
        fetchTrips(selectedTripDate),
        fetchStops(),
        fetchRoutes(),
        fetchRouteStops(),
      ]);

      if (busesData.status === 'fulfilled') setBuses(busesData.value || []);
      if (driversData.status === 'fulfilled') setDrivers(driversData.value || []);
      if (tripsData.status === 'fulfilled') setTrips(tripsData.value || []);
      if (stopsData.status === 'fulfilled') setStops(stopsData.value || []);
      if (routesData.status === 'fulfilled') setRoutes(routesData.value || []);
      if (routeStopsData.status === 'fulfilled') setRouteStops(routeStopsData.value || []);

      const failed = [busesData, driversData, tripsData, stopsData, routesData, routeStopsData].filter(
        (r) => r.status === 'rejected'
      );

      if (failed.length === 6) {
        throw new Error(failed[0].reason?.message || 'Could not connect to backend services.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load fleet data.');
    } finally {
      setLoading(false);
    }
  }, [tripDate]);

  // Initial load
  useEffect(() => {
    let ignore = false;
    loadAllData(getTodayDateString());
    return () => {
      ignore = true;
    };
  }, []);

  // Admin live tracking SignalR connection
  useEffect(() => {
    if (!isAdmin) return;

    let cleanupFn = null;

    startAdminTracking({
      onLocationReceived: (loc) => {
        setLiveBuses((prev) => ({
          ...prev,
          [loc.busId]: loc,
        }));
      },
      onStatusChange: setHubStatus,
    })
      .then((res) => {
        cleanupFn = res.stop;
      })
      .catch((err) => {
        console.warn('Admin SignalR tracking failed to initialize:', err);
      });

    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, [isAdmin]);

  const liveBusesList = useMemo(() => Object.values(liveBuses), [liveBuses]);

  const tabs = useMemo(
    () => [
      { id: 'map', label: t.fleetMap, icon: Map, count: stops.length, badge: isAdmin ? `${liveBusesList.length} ${t.active}` : null },
      { id: 'trips', label: t.trips, icon: RouteIcon, count: trips.length },
      { id: 'routes', label: t.routes, icon: RouteIcon, count: routes.length },
      { id: 'routeStops', label: t.routeStops, icon: GitMerge, count: routeStops.length },
      { id: 'buses', label: t.buses, icon: Bus, count: buses.length },
      { id: 'drivers', label: t.drivers, icon: Users, count: drivers.length },
      { id: 'stops', label: t.stops, icon: MapPin, count: stops.length },
    ],
    [t, stops.length, isAdmin, liveBusesList.length, trips.length, routes.length, routeStops.length, buses.length, drivers.length]
  );

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setSearchTerm('');
  }, []);

  return {
    isAdmin,
    t,
    activeTab,
    setActiveTab,
    handleTabChange,
    searchTerm,
    setSearchTerm,
    tripDate,
    setTripDate,
    buses,
    setBuses,
    drivers,
    setDrivers,
    trips,
    setTrips,
    stops,
    setStops,
    routes,
    setRoutes,
    routeStops,
    setRouteStops,
    liveBusesList,
    hubStatus,
    loading,
    error,
    setError,
    loadAllData,
    tabs,
  };
}
