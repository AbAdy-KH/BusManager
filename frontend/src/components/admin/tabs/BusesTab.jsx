import BusesTable from '../BusesTable';
import BusModal from '../BusModal';
import { deleteBus, fetchBuses } from '../../../services/adminService';
import { useLanguage } from '../../../context/useLanguage';
import { useCrudTab } from '../../../hooks/useCrudTab';

export default function BusesTab({
  buses = [],
  setBuses,
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
    fetchItems: fetchBuses,
    deleteItem: deleteBus,
    setItems: setBuses,
    confirmDeleteMessage: t.confirmDeleteBus,
    onError,
  });

  return (
    <>
      <BusesTable
        buses={buses}
        searchTerm={searchTerm}
        onAddBus={isAdmin ? handleOpenAdd : null}
        onEditBus={isAdmin ? handleOpenEdit : null}
        onDeleteBus={isAdmin ? handleDelete : null}
      />

      <BusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSaved}
        bus={selectedItemToEdit}
      />
    </>
  );
}
