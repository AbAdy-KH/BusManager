import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { useLanguage } from '../context/useLanguage';
import {
  fetchBuses,
  fetchDrivers,
  fetchTrips,
  fetchStops,
  getTodayDateString,
} from '../services/adminService';
import { startAdminTracking } from '../services/trackingHubService';
import FleetMap from '../components/map/FleetMap';
import BusesTable from '../components/admin/BusesTable';
import DriversTable from '../components/admin/DriversTable';
import TripsTable from '../components/admin/TripsTable';
import StopsTable from '../components/admin/StopsTable';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTabs from '../components/admin/AdminTabs';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Map, Bus, Users, Route as RouteIcon, MapPin, AlertCircle } from 'lucide-react';

export default function AdminPage() {
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

  const [liveBuses, setLiveBuses] = useState({});
  const [hubStatus, setHubStatus] = useState('disconnected');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = useCallback(async (selectedTripDate = tripDate) => {
    setLoading(true);
    setError(null);
    try {
      const [busesData, driversData, tripsData, stopsData] = await Promise.allSettled([
        fetchBuses(),
        fetchDrivers(),
        fetchTrips(selectedTripDate),
        fetchStops(),
      ]);

      if (busesData.status === 'fulfilled') setBuses(busesData.value || []);
      if (driversData.status === 'fulfilled') setDrivers(driversData.value || []);
      if (tripsData.status === 'fulfilled') setTrips(tripsData.value || []);
      if (stopsData.status === 'fulfilled') setStops(stopsData.value || []);

      const failed = [busesData, driversData, tripsData, stopsData].filter(
        (r) => r.status === 'rejected'
      );
      if (failed.length === 4) {
        throw new Error(failed[0].reason?.message || 'Could not connect to backend services.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load fleet data.');
    } finally {
      setLoading(false);
    }
  }, [tripDate]);

  useEffect(() => {
    let ignore = false;

    async function initialFetch() {
      try {
        const [busesData, driversData, tripsData, stopsData] = await Promise.allSettled([
          fetchBuses(),
          fetchDrivers(),
          fetchTrips(getTodayDateString()),
          fetchStops(),
        ]);

        if (ignore) return;

        if (busesData.status === 'fulfilled') setBuses(busesData.value || []);
        if (driversData.status === 'fulfilled') setDrivers(driversData.value || []);
        if (tripsData.status === 'fulfilled') setTrips(tripsData.value || []);
        if (stopsData.status === 'fulfilled') setStops(stopsData.value || []);

        const failed = [busesData, driversData, tripsData, stopsData].filter(
          (r) => r.status === 'rejected'
        );
        if (failed.length === 4) {
          setError(failed[0].reason?.message || 'Could not connect to backend services.');
        }
      } catch (err) {
        if (!ignore) setError(err.message || 'Failed to load fleet data.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    initialFetch();

    return () => {
      ignore = true;
    };
  }, []);

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

  const handleTripDateChange = (newDate) => {
    setTripDate(newDate);
    fetchTrips(newDate)
      .then((data) => setTrips(data || []))
      .catch((err) => setError(err.message));
  };

  const liveBusesList = Object.values(liveBuses);

  const tabs = [
    { id: 'map', label: t.fleetMap, icon: Map, count: stops.length, badge: isAdmin ? `${liveBusesList.length} ${t.active}` : null },
    { id: 'buses', label: t.buses, icon: Bus, count: buses.length },
    { id: 'drivers', label: t.drivers, icon: Users, count: drivers.length },
    { id: 'trips', label: t.trips, icon: RouteIcon, count: trips.length },
    { id: 'stops', label: t.stops, icon: MapPin, count: stops.length },
  ];

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Top Header */}
      <AdminHeader
        isAdmin={isAdmin}
        hubStatus={hubStatus}
        loading={loading}
        onRefresh={() => loadAllData(tripDate)}
      />

      {/* Main Content Card with Navigation Tabs */}
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Navigation Tabs Bar */}
        <AdminTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId);
            setSearchTerm('');
          }}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Error Alert */}
        {error && (
          <div className="m-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadAllData(tripDate)}
              className="text-xs font-bold text-rose-700 underline hover:text-rose-900 cursor-pointer"
            >
              {t.retry}
            </button>
          </div>
        )}

        {/* Loading / Content View */}
        {loading && activeTab !== 'map' ? (
          <LoadingSpinner />
        ) : (
          <div>
            {activeTab === 'map' && (
              <div className="p-4">
                <FleetMap stops={stops} liveBuses={liveBusesList} hubStatus={hubStatus} />
              </div>
            )}
            {activeTab === 'buses' && <BusesTable buses={buses} searchTerm={searchTerm} />}
            {activeTab === 'drivers' && <DriversTable drivers={drivers} searchTerm={searchTerm} />}
            {activeTab === 'trips' && (
              <TripsTable
                trips={trips}
                searchTerm={searchTerm}
                selectedDate={tripDate}
                onDateChange={handleTripDateChange}
              />
            )}
            {activeTab === 'stops' && <StopsTable stops={stops} searchTerm={searchTerm} />}
          </div>
        )}
      </div>
    </div>
  );
}
