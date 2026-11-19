import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { createStop, updateStop, fetchStopById } from '../../services/stopService';

export function useStopForm({ isOpen, stop, onSuccess, onClose }) {
  const { t } = useLanguage();
  const isEdit = !!stop;

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isDropPoint, setIsDropPoint] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);

    if (isEdit) {
      if (stop.name !== undefined && stop.latitude !== undefined) {
        setName(stop.name || '');
        setAddress(stop.address || '');
        setLatitude(stop.latitude?.toString() || '');
        setLongitude(stop.longitude?.toString() || '');
        setIsDropPoint(stop.isDropPoint !== false);
        setIsActive(stop.isActive !== false);
      } else if (stop.id) {
        fetchStopById(stop.id)
          .then((full) => {
            if (full) {
              setName(full.name || '');
              setAddress(full.address || '');
              setLatitude(full.latitude?.toString() || '');
              setLongitude(full.longitude?.toString() || '');
              setIsDropPoint(full.isDropPoint !== false);
              setIsActive(full.isActive !== false);
            }
          })
          .catch(() => {
            setError(t.stopLoadError || 'Failed to load stop data');
          });
      }
    } else {
      setName('');
      setAddress('');
      setLatitude('32.555600');
      setLongitude('35.850000');
      setIsDropPoint(true);
      setIsActive(true);
    }
  }, [isOpen, stop, isEdit, t]);

  const handleCoordinatesChange = ({ latitude: newLat, longitude: newLng }) => {
    setLatitude(newLat);
    setLongitude(newLng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(t.stopNameRequired || 'Stop name is required.');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90 || isNaN(lng) || lng < -180 || lng > 180) {
      setError(t.validCoordinatesRequired || 'Please select valid coordinates on the map.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      name: name.trim(),
      address: address.trim() || null,
      latitude: lat,
      longitude: lng,
      isDropPoint: Boolean(isDropPoint),
      isActive: Boolean(isActive),
    };

    try {
      if (isEdit) {
        await updateStop(stop.id, payload);
      } else {
        await createStop(payload);
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message || 'Failed to save stop point.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    t,
    isEdit,
    name,
    setName,
    address,
    setAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    isDropPoint,
    setIsDropPoint,
    isActive,
    setIsActive,
    submitting,
    error,
    handleCoordinatesChange,
    handleSubmit,
  };
}
