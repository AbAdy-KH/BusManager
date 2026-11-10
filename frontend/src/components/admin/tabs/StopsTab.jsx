import StopsTable from '../StopsTable';
import StopModal from '../StopModal';
import { deleteStop, fetchStops } from '../../../services/adminService';
import { useLanguage } from '../../../context/useLanguage';
import { useCrudTab } from '../../../hooks/useCrudTab';

export default function StopsTab({
  stops = [],
  setStops,
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
    fetchItems: fetchStops,
    deleteItem: deleteStop,
    setItems: setStops,
    confirmDeleteMessage: t.confirmDeleteStop,
    onError,
  });

  return (
    <>
      <StopsTable
        stops={stops}
        searchTerm={searchTerm}
        onAddStop={isAdmin ? handleOpenAdd : null}
        onEditStop={isAdmin ? handleOpenEdit : null}
        onDeleteStop={isAdmin ? handleDelete : null}
      />

      <StopModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSaved}
        stop={selectedItemToEdit}
      />
    </>
  );
}
