import { useState } from 'react';
import RouteStopsTable from '../RouteStopsTable';
import RouteStopModal from '../RouteStopModal';
import { removeStopFromRoute, fetchRouteStops } from '../../../services/adminService';
import { useLanguage } from '../../../context/useLanguage';
import { useCrudTab } from '../../../hooks/useCrudTab';

export default function RouteStopsTab({
  routeStops = [],
  setRouteStops,
  routes = [],
  stops = [],
  searchTerm = '',
  isAdmin = false,
  onError,
}) {
  const { t } = useLanguage();
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('');

  const {
    isModalOpen,
    setIsModalOpen,
    selectedItemToEdit,
    handleOpenAdd,
    handleOpenEdit,
    handleDelete,
    handleSaved,
  } = useCrudTab({
    fetchItems: fetchRouteStops,
    deleteItem: removeStopFromRoute,
    setItems: setRouteStops,
    confirmDeleteMessage: t.confirmRemoveStopFromRoute,
    onError,
  });

  return (
    <>
      <RouteStopsTable
        routeStops={routeStops}
        routes={routes}
        selectedRouteFilter={selectedRouteFilter}
        onRouteFilterChange={setSelectedRouteFilter}
        searchTerm={searchTerm}
        onAddRouteStop={isAdmin ? handleOpenAdd : null}
        onEditRouteStop={isAdmin ? handleOpenEdit : null}
        onDeleteRouteStop={isAdmin ? handleDelete : null}
      />

      <RouteStopModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSaved}
        routeStop={selectedItemToEdit}
        routes={routes}
        stops={stops}
        existingRouteStops={routeStops}
        defaultRouteId={selectedRouteFilter}
      />
    </>
  );
}
