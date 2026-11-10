import DriversTable from '../DriversTable';
import DriverModal from '../DriverModal';
import { deleteDriver, fetchDrivers } from '../../../services/adminService';
import { useLanguage } from '../../../context/useLanguage';
import { useCrudTab } from '../../../hooks/useCrudTab';

export default function DriversTab({
  drivers = [],
  setDrivers,
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
    fetchItems: fetchDrivers,
    deleteItem: deleteDriver,
    setItems: setDrivers,
    confirmDeleteMessage: t.confirmDeleteDriver,
    onError,
  });

  return (
    <>
      <DriversTable
        drivers={drivers}
        searchTerm={searchTerm}
        onAddDriver={isAdmin ? handleOpenAdd : null}
        onEditDriver={isAdmin ? handleOpenEdit : null}
        onDeleteDriver={isAdmin ? handleDelete : null}
      />

      <DriverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSaved}
        driver={selectedItemToEdit}
      />
    </>
  );
}
