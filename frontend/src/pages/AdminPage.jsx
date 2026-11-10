import { useAdminPage } from '../hooks/useAdminPage';
import FleetMap from '../components/myMap/FleetMap';
import BusesTab from '../components/admin/tabs/BusesTab';
import DriversTab from '../components/admin/tabs/DriversTab';
import TripsTab from '../components/admin/tabs/TripsTab';
import StopsTab from '../components/admin/tabs/StopsTab';
import RoutesTab from '../components/admin/tabs/RoutesTab';
import RouteStopsTab from '../components/admin/tabs/RouteStopsTab';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTabs from '../components/admin/AdminTabs';
import { AlertCircle } from 'lucide-react';

export default function AdminPage() {
  const {
    isAdmin,
    t,
    activeTab,
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
  } = useAdminPage();

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
          onTabChange={handleTabChange}
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
        {!loading && (
          <div>
            {activeTab === 'map' && (
              <div className="p-4">
                <FleetMap stops={stops} liveBuses={liveBusesList} hubStatus={hubStatus} />
              </div>
            )}
            {activeTab === 'trips' && (
              <TripsTab
                trips={trips}
                setTrips={setTrips}
                tripDate={tripDate}
                setTripDate={setTripDate}
                searchTerm={searchTerm}
                isAdmin={isAdmin}
                onError={setError}
              />
            )}
            {activeTab === 'buses' && (
              <BusesTab
                buses={buses}
                setBuses={setBuses}
                searchTerm={searchTerm}
                isAdmin={isAdmin}
                onError={setError}
              />
            )}
            {activeTab === 'drivers' && (
              <DriversTab
                drivers={drivers}
                setDrivers={setDrivers}
                searchTerm={searchTerm}
                isAdmin={isAdmin}
                onError={setError}
              />
            )}
            {activeTab === 'stops' && (
              <StopsTab
                stops={stops}
                setStops={setStops}
                searchTerm={searchTerm}
                isAdmin={isAdmin}
                onError={setError}
              />
            )}
            {activeTab === 'routes' && (
              <RoutesTab
                routes={routes}
                setRoutes={setRoutes}
                searchTerm={searchTerm}
                isAdmin={isAdmin}
                onError={setError}
              />
            )}
            {activeTab === 'routeStops' && (
              <RouteStopsTab
                routeStops={routeStops}
                setRouteStops={setRouteStops}
                routes={routes}
                stops={stops}
                searchTerm={searchTerm}
                isAdmin={isAdmin}
                onError={setError}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
