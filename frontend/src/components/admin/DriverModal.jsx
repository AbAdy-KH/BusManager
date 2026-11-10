import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { createDriver, updateDriver, fetchDriverById } from '../../services/adminService';
import Modal from '../common/Modal';
import { User } from 'lucide-react';

export default function DriverModal({
  isOpen,
  onClose,
  onSuccess,
  driver = null,
}) {
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
      if (driver.name && driver.licenseNumber) {
        setName(driver.name);
        setLicenseNumber(driver.licenseNumber || '');
      } else if (driver.id) {
        fetchDriverById(driver.id)
          .then((full) => {
            setName(full.name || '');
            setLicenseNumber(full.licenseNumber || '');
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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t.driverNameRequired || 'Driver name is required');
      return;
    }
    setSubmitting(true);
    setError(null);
    const payload = {
      name: name.trim(),
      licenseNumber: licenseNumber.trim() || null,
    };
    try {
      if (isEdit) {
        const id = driver.id || driver.driverId;
        await updateDriver(id, payload);
      } else {
        await createDriver(payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save driver');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t.editDriver : t.addDriver}
      icon={User}
      error={error}
      isSubmitting={submitting}
      onSubmit={handleSubmit}
      submitText={t.saveDriver || t.save}
    >
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-sky-600" />
          <span>{t.driverName}</span>
          <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-sky-600" />
          <span>{t.licenseNumber}</span>
        </label>
        <input
          type="text"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
        />
      </div>
    </Modal>
  );
}
