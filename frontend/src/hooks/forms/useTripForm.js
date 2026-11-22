import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { createTrip, updateTrip, fetchTripById } from '../../services/tripService';
import { fetchBusDriverAssignments } from '../../services/attendanceService';
import { fetchRoutes } from '../../services/routeService';
import { getTodayDateString } from '../../utils/dateUtils';

function toDateTimeLocal(isoString, fallbackDate = '', fallbackTime = '08:00') {
  if (!isoString) {
    const base = fallbackDate || getTodayDateString();
    return `${base}T${fallbackTime}`;
  }
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) {
      const base = fallbackDate || getTodayDateString();
      return `${base}T${fallbackTime}`;
    }
    const pad = (n) => String(n).padStart(2, '0');
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const h = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${y}-${m}-${day}T${h}:${min}`;
  } catch {
    const base = fallbackDate || getTodayDateString();
    return `${base}T${fallbackTime}`;
  }
}

export function useTripForm({ isOpen, trip, defaultDate = '', onSuccess, onClose }) {
  const { t } = useLanguage();
  const isEdit = !!trip;

  const [busDriverId, setBusDriverId] = useState('');
  const [direction, setDirection] = useState(0);
  const [routeId, setRouteId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [notes, setNotes] = useState('');

  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    setError(null);
    const tripDateStr = trip?.scheduledStartTime
      ? toDateTimeLocal(trip.scheduledStartTime, defaultDate).slice(0, 10)
      : '';
    const targetDate = tripDateStr || defaultDate || getTodayDateString();

    setLoadingAssignments(true);
    fetchBusDriverAssignments(targetDate || null)
      .then((data) => setAssignments(data || []))
      .catch(() => {})
      .finally(() => setLoadingAssignments(false));

    setLoadingRoutes(true);
    fetchRoutes()
      .then((data) => setRoutes(data || []))
      .catch(() => {})
      .finally(() => setLoadingRoutes(false));

    if (trip) {
      const dirVal =
        typeof trip.direction === 'number'
          ? trip.direction
          : trip.direction?.toLowerCase() === 'inbound'
          ? 1
          : 0;

      setDirection(dirVal);
      setRouteId(trip.routeId || '');
      setStartTime(toDateTimeLocal(trip.scheduledStartTime, defaultDate, '08:00'));
      setArrivalTime(toDateTimeLocal(trip.scheduledArrivalTime, defaultDate, '09:00'));
      setNotes(trip.notes || '');

      if (trip.busDriverId) {
        setBusDriverId(trip.busDriverId);
      } else {
        const tripId = trip.tripId || trip.id;
        if (tripId) {
          fetchTripById(tripId)
            .then((fullTrip) => {
              if (fullTrip) {
                if (fullTrip.busDriverId) setBusDriverId(fullTrip.busDriverId);
                if (fullTrip.routeId) setRouteId(fullTrip.routeId);
                if (fullTrip.notes) setNotes(fullTrip.notes);
              }
            })
            .catch(() => {});
        }
      }
    } else {
      setBusDriverId('');
      setDirection(0);
      setRouteId('');
      setStartTime(`${targetDate}T08:00`);
      setArrivalTime(`${targetDate}T09:00`);
      setNotes('');
    }
  }, [isOpen, trip, defaultDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!busDriverId) {
      setError(t.busDriverRequired || 'Please select a driver and bus assignment.');
      return;
    }

    if (!startTime || !arrivalTime) {
      setError('Please specify both scheduled start and arrival times.');
      return;
    }

    const startObj = new Date(startTime);
    const arrivalObj = new Date(arrivalTime);

    if (arrivalObj <= startObj) {
      setError('Scheduled arrival time must be after scheduled start time.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      busDriverId,
      routeId: routeId.trim() || null,
      scheduledStartTime: startObj,
      scheduledArrivalTime: arrivalObj,
      direction: Number(direction),
      notes: notes.trim() || null,
    };

    try {
      if (isEdit) {
        const tripId = trip.tripId || trip.id;
        await updateTrip(tripId, payload);
      } else {
        await createTrip(payload);
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message || 'Failed to save trip.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    t,
    isEdit,
    busDriverId,
    setBusDriverId,
    direction,
    setDirection,
    routeId,
    setRouteId,
    startTime,
    setStartTime,
    arrivalTime,
    setArrivalTime,
    notes,
    setNotes,
    assignments,
    loadingAssignments,
    routes,
    loadingRoutes,
    submitting,
    error,
    handleSubmit,
  };
}
