import TripsTable from '../TripsTable';
import TripModal from '../TripModal';
import { fetchTrips } from '../../../services/adminService';
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
  const {
    isModalOpen,
    setIsModalOpen,
    selectedItemToEdit,
    handleOpenAdd,
    handleOpenEdit,
    handleSaved,
  } = useCrudTab({
    fetchItems: () => fetchTrips(tripDate),
    setItems: setTrips,
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
        onTripDeleted={handleSaved}
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
