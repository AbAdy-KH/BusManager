import { useState } from 'react';
import BusesTable from '../BusesTable';
import BusModal from '../BusModal';
import { deleteBus, fetchBuses } from '../../../services/adminService';
import { useLanguage } from '../../../context/useLanguage';

export default function BusesTab({
  buses = [],
  setBuses,
  searchTerm = '',
  isAdmin = false,
  onError,
}) {
  const { t } = useLanguage();
  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [selectedBusToEdit, setSelectedBusToEdit] = useState(null);

  const handleOpenAddBus = () => {
    setSelectedBusToEdit(null);
    setIsBusModalOpen(true);
  };

  const handleOpenEditBus = (bus) => {
    setSelectedBusToEdit(bus);
    setIsBusModalOpen(true);
  };

  const handleDeleteBus = async (busId) => {
    if (window.confirm(t.confirmDeleteBus)) {
      try {
        await deleteBus(busId);
        const updated = await fetchBuses();
        setBuses(updated || []);
      } catch (err) {
        onError?.(err.message);
      }
    }
  };

  const handleBusSaved = async () => {
    try {
      const updated = await fetchBuses();
      setBuses(updated || []);
      setIsBusModalOpen(false);
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <>
      <BusesTable
        buses={buses}
        searchTerm={searchTerm}
        onAddBus={isAdmin ? handleOpenAddBus : null}
        onEditBus={isAdmin ? handleOpenEditBus : null}
        onDeleteBus={isAdmin ? handleDeleteBus : null}
      />

      <BusModal
        isOpen={isBusModalOpen}
        onClose={() => setIsBusModalOpen(false)}
        onSuccess={handleBusSaved}
        bus={selectedBusToEdit}
      />
    </>
  );
}
