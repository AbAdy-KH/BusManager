import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { createBus, updateBus, fetchBusById } from '../../services/adminService';
import Modal from '../common/Modal';
import { Bus, Hash, Users } from 'lucide-react';

export default function BusModal({
  isOpen,
  onClose,
  onSuccess,
  bus = null,
}) {
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

  if (!isOpen) return null;

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
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save bus.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t.editBus : t.addBus}
      icon={Bus}
      error={error}
      isSubmitting={submitting}
      onSubmit={handleSubmit}
      submitText={t.saveBus || t.save}
    >
      {/* Bus Number & Capacity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.busNumber}</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="e.g. 101"
            required
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.capacity}</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="30"
            required
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Plate Number */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Bus className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.plateNumber}</span>
          <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          placeholder="e.g. ABC-1234"
          required
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono shadow-xs"
        />
      </div>

      {/* Status Toggle */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          {t.status}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setIsActive(true)}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
              isActive
                ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-xs'
                : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
            }`}
          >
            {t.active}
          </button>
          <button
            type="button"
            onClick={() => setIsActive(false)}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
              !isActive
                ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs'
                : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
            }`}
          >
            {t.inactive}
          </button>
        </div>
      </div>
    </Modal>
  );
}
