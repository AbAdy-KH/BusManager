import { useState } from 'react';
import TripsTable from '../TripsTable';
import TripModal from '../TripModal';
import { fetchTrips } from '../../../services/adminService';

export default function TripsTab({
  trips = [],
  setTrips,
  tripDate,
  setTripDate,
  searchTerm = '',
  isAdmin = false,
  onError,
}) {
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [selectedTripToEdit, setSelectedTripToEdit] = useState(null);

  const handleTripDateChange = async (newDate) => {
    setTripDate?.(newDate);
    try {
      const data = await fetchTrips(newDate);
      setTrips(data || []);
    } catch (err) {
      onError?.(err.message);
    }
  };

  const handleOpenAddTrip = () => {
    setSelectedTripToEdit(null);
    setIsTripModalOpen(true);
  };

  const handleOpenEditTrip = (trip) => {
    setSelectedTripToEdit(trip);
    setIsTripModalOpen(true);
  };

  const handleTripSaved = async () => {
    try {
      const data = await fetchTrips(tripDate);
      setTrips(data || []);
      setIsTripModalOpen(false);
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
        onAddTrip={isAdmin ? handleOpenAddTrip : null}
        onEditTrip={isAdmin ? handleOpenEditTrip : null}
        onTripDeleted={handleTripSaved}
      />

      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onSuccess={handleTripSaved}
        trip={selectedTripToEdit}
        defaultDate={tripDate || new Date().toISOString().split('T')[0]}
      />
    </>
  );
}
