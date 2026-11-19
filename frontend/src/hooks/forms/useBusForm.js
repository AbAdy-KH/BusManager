import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { createBus, updateBus, fetchBusById } from '../../services/busService';

export function useBusForm({ isOpen, bus, onSuccess, onClose }) {
  const { t } = useLanguage();
  const isEdit = !!bus;

  const [number, setNumber] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [capacity, setCapacity] = useState('30');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);

    if (isEdit) {
      if (bus.number !== undefined && bus.plateNumber !== undefined) {
        setNumber(bus.number?.toString() || '');
        setPlateNumber(bus.plateNumber || '');
        setCapacity(bus.capacity?.toString() || '30');
        setIsActive(bus.isActive !== false);
      } else if (bus.id) {
        fetchBusById(bus.id)
          .then((full) => {
            if (full) {
              setNumber(full.number?.toString() || '');
              setPlateNumber(full.plateNumber || '');
              setCapacity(full.capacity?.toString() || '30');
              setIsActive(full.isActive !== false);
            }
          })
          .catch(() => {
            setError(t.busLoadError || 'Failed to load bus data');
          });
      }
    } else {
      setNumber('');
      setPlateNumber('');
      setCapacity('30');
      setIsActive(true);
    }
  }, [isOpen, bus, isEdit, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedNumber = parseInt(number, 10);
    const parsedCapacity = parseInt(capacity, 10);

    if (isNaN(parsedNumber) || parsedNumber <= 0) {
      setError(t.busNumberRequired || 'Please enter a valid bus number.');
      return;
    }

    if (!plateNumber.trim()) {
      setError(t.plateNumberRequired || 'Plate number is required.');
      return;
    }

    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      setError(t.capacityRequired || 'Please enter a valid capacity.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      number: parsedNumber,
      plateNumber: plateNumber.trim(),
      capacity: parsedCapacity,
      isActive: Boolean(isActive),
    };

    try {
      if (isEdit) {
        await updateBus(bus.id, payload);
      } else {
        await createBus(payload);
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message || 'Failed to save bus.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    t,
    isEdit,
    number,
    setNumber,
    plateNumber,
    setPlateNumber,
    capacity,
    setCapacity,
    isActive,
    setIsActive,
    submitting,
    error,
    handleSubmit,
  };
}
