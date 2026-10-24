import { useState } from 'react';
import StopsTable from '../StopsTable';
import StopModal from '../StopModal';
import { deleteStop, fetchStops } from '../../../services/adminService';
import { useLanguage } from '../../../context/useLanguage';

export default function StopsTab({
  stops = [],
  setStops,
  searchTerm = '',
  isAdmin = false,
  onError,
}) {
  const { t } = useLanguage();
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [selectedStopToEdit, setSelectedStopToEdit] = useState(null);

  const handleOpenAddStop = () => {
    setSelectedStopToEdit(null);
    setIsStopModalOpen(true);
  };

  const handleOpenEditStop = (stop) => {
    setSelectedStopToEdit(stop);
    setIsStopModalOpen(true);
  };

  const handleDeleteStop = async (stopId) => {
    if (window.confirm(t.confirmDeleteStop)) {
      try {
        await deleteStop(stopId);
        const updated = await fetchStops();
        setStops(updated || []);
      } catch (err) {
        onError?.(err.message);
      }
    }
  };

  const handleStopSaved = async () => {
    try {
      const updated = await fetchStops();
      setStops(updated || []);
      setIsStopModalOpen(false);
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <>
      <StopsTable
        stops={stops}
        searchTerm={searchTerm}
        onAddStop={isAdmin ? handleOpenAddStop : null}
        onEditStop={isAdmin ? handleOpenEditStop : null}
        onDeleteStop={isAdmin ? handleDeleteStop : null}
      />

      <StopModal
        isOpen={isStopModalOpen}
        onClose={() => setIsStopModalOpen(false)}
        onSuccess={handleStopSaved}
        stop={selectedStopToEdit}
      />
    </>
  );
}
