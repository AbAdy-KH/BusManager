import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { assignBusToDriver } from '../../services/attendanceService';
import { getTodayDateString } from '../../utils/dateUtils';

export function useAssignBusForm({
  isOpen,
  assignments = [],
  initialDriverId = '',
  selectedDate = '',
  onSuccess,
  onClose,
}) {
  const { t } = useLanguage();

  const [driverId, setDriverId] = useState(initialDriverId);
  const [busId, setBusId] = useState('');
  const [date, setDate] = useState(selectedDate || getTodayDateString());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setDriverId(initialDriverId || '');
    setBusId('');
    setDate(selectedDate || getTodayDateString());
  }, [isOpen, initialDriverId, selectedDate]);

  const assignedDriverIds = useMemo(
    () => new Set(assignments.map((a) => a.driverId)),
    [assignments]
  );

  const assignedBusIds = useMemo(
    () => new Set(assignments.map((a) => a.busId)),
    [assignments]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!driverId || !busId) {
      setError('Please select both a driver and a bus.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const localTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const createdAt = `${date}T${localTime}`;

      await assignBusToDriver({
        busId,
        driverId,
        createdAt,
      });

      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message || 'Failed to assign bus to driver.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    t,
    driverId,
    setDriverId,
    busId,
    setBusId,
    date,
    setDate,
    submitting,
    error,
    assignedDriverIds,
    assignedBusIds,
    handleSubmit,
  };
}
