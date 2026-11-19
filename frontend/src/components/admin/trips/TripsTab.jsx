import TripsTable from './TripsTable';
import TripModal from './TripModal';
import { fetchTrips, deleteTrip } from '../../../services/tripService';
import { useLanguage } from '../../../context/useLanguage';
import { useCrudTab } from '../../../hooks/useCrudTab';

export default function TripsTab({
  trips = [],
  setTrips,
  tripDate,
  setTripDate,
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
    fetchItems: () => fetchTrips(tripDate),
    deleteItem: deleteTrip,
    setItems: setTrips,
    confirmDeleteMessage: t.deleteTripConfirm,
    onError,
  });

  const handleTripDateChange = async (newDate) => {
    setTripDate?.(newDate);
    try {
      const data = await fetchTrips(newDate);
      setTrips(data || []);
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <>
      <TripsTable
        trips={trips}
        searchTerm={searchTerm}
        selectedDate={tripDate}
        onDateChange={handleTripDateChange}
        onAddTrip={isAdmin ? handleOpenAdd : null}
        onEditTrip={isAdmin ? handleOpenEdit : null}
        onDeleteTrip={isAdmin ? handleDelete : null}
      />

      <TripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSaved}
        trip={selectedItemToEdit}
        defaultDate={tripDate || new Date().toISOString().split('T')[0]}
      />
    </>
  );
}
