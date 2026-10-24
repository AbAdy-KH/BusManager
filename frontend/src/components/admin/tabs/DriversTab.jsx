import { useState } from 'react';
import DriversTable from '../DriversTable';
import DriverModal from '../DriverModal';
import { deleteDriver, fetchDrivers } from '../../../services/adminService';
import { useLanguage } from '../../../context/useLanguage';

export default function DriversTab({
  drivers = [],
  setDrivers,
  searchTerm = '',
  isAdmin = false,
  onError,
}) {
  const { t } = useLanguage();
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [selectedDriverToEdit, setSelectedDriverToEdit] = useState(null);

  const handleOpenAddDriver = () => {
    setSelectedDriverToEdit(null);
    setIsDriverModalOpen(true);
  };

  const handleOpenEditDriver = (driver) => {
    setSelectedDriverToEdit(driver);
    setIsDriverModalOpen(true);
  };

  const handleDeleteDriver = async (driverId) => {
    if (window.confirm(t.confirmDeleteDriver)) {
      try {
        await deleteDriver(driverId);
        const updated = await fetchDrivers();
        setDrivers(updated || []);
      } catch (err) {
        onError?.(err.message);
      }
    }
  };

  const handleDriverSaved = async () => {
    try {
      const updated = await fetchDrivers();
      setDrivers(updated || []);
      setIsDriverModalOpen(false);
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <>
      <DriversTable
        drivers={drivers}
        searchTerm={searchTerm}
        onAddDriver={isAdmin ? handleOpenAddDriver : null}
        onEditDriver={isAdmin ? handleOpenEditDriver : null}
        onDeleteDriver={isAdmin ? handleDeleteDriver : null}
      />

      <DriverModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        onSuccess={handleDriverSaved}
        driver={selectedDriverToEdit}
      />
    </>
  );
}
