import RoutesTable from '../RoutesTable';
import RouteModal from '../RouteModal';
import { deleteRoute, fetchRoutes } from '../../../services/adminService';
import { useLanguage } from '../../../context/useLanguage';
import { useCrudTab } from '../../../hooks/useCrudTab';

export default function RoutesTab({
  routes = [],
  setRoutes,
  searchTerm = '',
  isAdmin = false,
  onError,
}) {
  const { t } = useLanguage();
  const {
    isModalOpen,
    setIsModalOpen,
    selectedItemToEdit,
    handleOpenAdd,
    handleOpenEdit,
    handleDelete,
    handleSaved,
  } = useCrudTab({
    fetchItems: fetchRoutes,
    deleteItem: deleteRoute,
    setItems: setRoutes,
    confirmDeleteMessage: t.confirmDeleteRoute,
    onError,
  });

  return (
    <>
      <RoutesTable
        routes={routes}
        searchTerm={searchTerm}
        onAddRoute={isAdmin ? handleOpenAdd : null}
        onEditRoute={isAdmin ? handleOpenEdit : null}
        onDeleteRoute={isAdmin ? handleDelete : null}
      />

      <RouteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSaved}
        route={selectedItemToEdit}
      />
    </>
  );
}
