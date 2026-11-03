import { useState } from 'react';
import RoutesTable from '../RoutesTable';
import RouteModal from '../RouteModal';
import { deleteRoute, fetchRoutes } from '../../../services/adminService';
import { useLanguage } from '../../../context/useLanguage';

export default function RoutesTab({
  routes = [],
  setRoutes,
  searchTerm = '',
  isAdmin = false,
  onError,
}) {
  const { t } = useLanguage();
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [selectedRouteToEdit, setSelectedRouteToEdit] = useState(null);

  const handleOpenAddRoute = () => {
    setSelectedRouteToEdit(null);
    setIsRouteModalOpen(true);
  };

  const handleOpenEditRoute = (route) => {
    setSelectedRouteToEdit(route);
    setIsRouteModalOpen(true);
  };

  const handleDeleteRoute = async (routeId) => {
    if (window.confirm(t.confirmDeleteRoute)) {
      try {
        await deleteRoute(routeId);
        const updated = await fetchRoutes();
        setRoutes(updated || []);
      } catch (err) {
        onError?.(err.message);
      }
    }
  };

  const handleRouteSaved = async () => {
    try {
      const updated = await fetchRoutes();
      setRoutes(updated || []);
      setIsRouteModalOpen(false);
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <>
      <RoutesTable
        routes={routes}
        searchTerm={searchTerm}
        onAddRoute={isAdmin ? handleOpenAddRoute : null}
        onEditRoute={isAdmin ? handleOpenEditRoute : null}
        onDeleteRoute={isAdmin ? handleDeleteRoute : null}
      />

      <RouteModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        onSuccess={handleRouteSaved}
        route={selectedRouteToEdit}
      />
    </>
  );
}
