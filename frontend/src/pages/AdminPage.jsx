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
import TripModal from '../components/admin/TripModal';
import { deleteDriver, deleteBus, deleteStop } from '../services/adminService';
import DriverModal from '../components/admin/DriverModal';
import BusModal from '../components/admin/BusModal';
import StopModal from '../components/admin/StopModal';
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

  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [selectedTripToEdit, setSelectedTripToEdit] = useState(null);

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

  const handleOpenAddTrip = () => {
    setSelectedTripToEdit(null);
    setIsTripModalOpen(true);
  };

  const handleOpenEditTrip = (trip) => {
    setSelectedTripToEdit(trip);
    setIsTripModalOpen(true);
  };

  const handleTripSaved = () => {
    fetchTrips(tripDate)
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

  // Driver modal state
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [selectedDriverToEdit, setSelectedDriverToEdit] = useState(null);

  // Bus modal state
  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [selectedBusToEdit, setSelectedBusToEdit] = useState(null);

  // Stop modal state
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [selectedStopToEdit, setSelectedStopToEdit] = useState(null);

  // Handlers for driver CRUD
  const handleOpenAddDriver = () => {
    setSelectedDriverToEdit(null);
    setIsDriverModalOpen(true);
  };

  const handleOpenEditDriver = (driver) => {
    setSelectedDriverToEdit(driver);
    setIsDriverModalOpen(true);
  };

  const handleDeleteDriver = (driverId) => {
    if (window.confirm(t.confirmDeleteDriver)) {
      deleteDriver(driverId)
        .then(() => {
          // Refresh drivers list
          fetchDrivers().then(setDrivers).catch((err) => setError(err.message));
        })
        .catch((err) => setError(err.message));
    }
  };

  const handleDriverSaved = () => {
    // After add/edit, refresh drivers and close modal
    fetchDrivers().then(setDrivers).catch((err) => setError(err.message));
    setIsDriverModalOpen(false);
  };

  // Handlers for bus CRUD
  const handleOpenAddBus = () => {
    setSelectedBusToEdit(null);
    setIsBusModalOpen(true);
  };

  const handleOpenEditBus = (bus) => {
    setSelectedBusToEdit(bus);
    setIsBusModalOpen(true);
  };

  const handleDeleteBus = (busId) => {
    if (window.confirm(t.confirmDeleteBus)) {
      deleteBus(busId)
        .then(() => {
          // Refresh buses list
          fetchBuses().then(setBuses).catch((err) => setError(err.message));
        })
        .catch((err) => setError(err.message));
    }
  };

  const handleBusSaved = () => {
    // After add/edit, refresh buses and close modal
    fetchBuses().then(setBuses).catch((err) => setError(err.message));
    setIsBusModalOpen(false);
  };

  // Handlers for stop CRUD
  const handleOpenAddStop = () => {
    setSelectedStopToEdit(null);
    setIsStopModalOpen(true);
  };

  const handleOpenEditStop = (stop) => {
    setSelectedStopToEdit(stop);
    setIsStopModalOpen(true);
  };

  const handleDeleteStop = (stopId) => {
    if (window.confirm(t.confirmDeleteStop)) {
      deleteStop(stopId)
        .then(() => {
          // Refresh stops list
          fetchStops().then(setStops).catch((err) => setError(err.message));
        })
        .catch((err) => setError(err.message));
    }
  };

  const handleStopSaved = () => {
    // After add/edit, refresh stops and close modal
    fetchStops().then(setStops).catch((err) => setError(err.message));
    setIsStopModalOpen(false);
  };

  // Pass callbacks to DriversTable
  const driversTableProps = {
    drivers,
    searchTerm,
    onAddDriver: isAdmin ? handleOpenAddDriver : null,
    onEditDriver: isAdmin ? handleOpenEditDriver : null,
    onDeleteDriver: isAdmin ? handleDeleteDriver : null,
  };

  // Pass callbacks to BusesTable
  const busesTableProps = {
    buses,
    searchTerm,
    onAddBus: isAdmin ? handleOpenAddBus : null,
    onEditBus: isAdmin ? handleOpenEditBus : null,
    onDeleteBus: isAdmin ? handleDeleteBus : null,
  };

  // Pass callbacks to StopsTable
  const stopsTableProps = {
    stops,
    searchTerm,
    onAddStop: isAdmin ? handleOpenAddStop : null,
    onEditStop: isAdmin ? handleOpenEditStop : null,
    onDeleteStop: isAdmin ? handleDeleteStop : null,
  };

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
            {activeTab === 'buses' && <BusesTable {...busesTableProps} />}
            {activeTab === 'drivers' && <DriversTable {...driversTableProps} />}
            {activeTab === 'trips' && (
              <TripsTable
                trips={trips}
                searchTerm={searchTerm}
                selectedDate={tripDate}
                onDateChange={handleTripDateChange}
                onAddTrip={isAdmin ? handleOpenAddTrip : null}
                onEditTrip={isAdmin ? handleOpenEditTrip : null}
                onTripDeleted={handleTripSaved}
              />
            )}
            {activeTab === 'stops' && <StopsTable {...stopsTableProps} />}
          </div>
        )}
      </div>

      {/* Trip Modal for Add / Edit */}
      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onSuccess={handleTripSaved}
        trip={selectedTripToEdit}
        defaultDate={new Date().toISOString().split('T')[0]}
      />

      {/* Driver Modal for Add / Edit */}
      <DriverModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        onSuccess={handleDriverSaved}
        driver={selectedDriverToEdit}
      />

      {/* Bus Modal for Add / Edit */}
      <BusModal
        isOpen={isBusModalOpen}
        onClose={() => setIsBusModalOpen(false)}
        onSuccess={handleBusSaved}
        bus={selectedBusToEdit}
      />

      {/* Stop Modal for Add / Edit */}
      <StopModal
        isOpen={isStopModalOpen}
        onClose={() => setIsStopModalOpen(false)}
        onSuccess={handleStopSaved}
        stop={selectedStopToEdit}
      />
    </div>
  );
}