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
import {
  Map,
  Bus,
  Users,
  Route as RouteIcon,
  MapPin,
  RefreshCw,
  Search,
  Plus,
  AlertCircle,
  Radio,
} from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {t.adminDashboard}
            {isAdmin && hubStatus === 'connected' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
                <Radio className="w-3 h-3 animate-pulse" /> {t.active}
              </span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadAllData(tripDate)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{t.refresh}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setActiveTab('map')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'map'
              ? 'bg-indigo-600/15 border-indigo-500/40 text-white'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{t.fleetMap}</span>
            <Map className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1.5">{stops.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {isAdmin ? `${liveBusesList.length} ${t.liveActiveBus}` : t.stopPoints}
          </div>
        </div>

        <div
          onClick={() => setActiveTab('buses')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'buses'
              ? 'bg-indigo-600/15 border-indigo-500/40 text-white'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{t.buses}</span>
            <Bus className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1.5">{buses.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {buses.filter((b) => b.isActive).length} {t.active}
          </div>
        </div>

        <div
          onClick={() => setActiveTab('trips')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'trips'
              ? 'bg-emerald-600/15 border-emerald-500/40 text-white'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{t.trips}</span>
            <RouteIcon className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1.5">{trips.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {tripDate === getTodayDateString() ? t.today : tripDate || t.allDates}
          </div>
        </div>

        <div
          onClick={() => setActiveTab('stops')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'stops'
              ? 'bg-rose-600/15 border-rose-500/40 text-white'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{t.stops}</span>
            <MapPin className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1.5">{stops.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {stops.filter((s) => s.isActive).length} {t.active}
          </div>
        </div>
      </div>

      {/* Main Content Card with Navigation Tabs */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Navigation Tabs Bar & Action Controls */}
        <div className="p-4 border-b border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/70 p-1 rounded-lg border border-slate-700/60 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchTerm('');
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge || tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Actions for table views */}
          {activeTab !== 'map' && (
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 rtl:pl-3 rtl:pr-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-left rtl:text-right"
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.add}</span>
              </button>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="m-4 p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-lg text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadAllData(tripDate)}
              className="text-xs underline font-semibold hover:text-white cursor-pointer"
            >
              {t.retry}
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && activeTab !== 'map' ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-2">
            <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-xs">{t.signingIn}</span>
          </div>
        ) : (
          /* Tab Views */
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
