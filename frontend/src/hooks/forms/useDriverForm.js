import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { createDriver, updateDriver, fetchDriverById } from '../../services/driverService';

export function useDriverForm({ isOpen, driver, onSuccess, onClose }) {
  const { t } = useLanguage();
  const isEdit = !!driver;

  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    if (isEdit) {
      const id = driver.driverId || driver.id;
      if (driver.name !== undefined && driver.licenseNumber !== undefined) {
        setName(driver.name || '');
        setLicenseNumber(driver.licenseNumber || '');
      } else if (id) {
        fetchDriverById(id)
          .then((full) => {
            setName(full?.name || '');
            setLicenseNumber(full?.licenseNumber || '');
          })
          .catch(() => {
            setError(t.driverLoadError || 'Failed to load driver data');
          });
      }
    } else {
      setName('');
      setLicenseNumber('');
    }
  }, [isOpen, driver, isEdit, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t.driverNameRequired || 'Driver name is required');
      return;
    }
    if (!licenseNumber.trim()) {
      setError(t.licenseNumberRequired || 'License number is required');
      return;
    }
    setSubmitting(true);
    setError(null);
    const payload = {
      name: name.trim(),
      licenseNumber: licenseNumber.trim(),
    };
    try {
      if (isEdit) {
        const id = driver.driverId || driver.id;
        await updateDriver(id, payload);
      } else {
        await createDriver(payload);
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message || 'Failed to save driver');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    t,
    isEdit,
    name,
    setName,
    licenseNumber,
    setLicenseNumber,
    submitting,
    error,
    handleSubmit,
  };
}
