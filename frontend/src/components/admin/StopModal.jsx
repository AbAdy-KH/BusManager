import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { createStop, updateStop, fetchStopById } from '../../services/adminService';
import Modal from '../common/Modal';
import { MapPin, Navigation, Home } from 'lucide-react';

export default function StopModal({
  isOpen,
  onClose,
  onSuccess,
  stop = null,
}) {
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
      setLatitude('');
      setLongitude('');
      setIsDropPoint(true);
      setIsActive(true);
    }
  }, [isOpen, stop, isEdit, t]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(t.stopNameRequired || 'Stop name is required.');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90 || isNaN(lng) || lng < -180 || lng > 180) {
      setError(t.validCoordinatesRequired || 'Please enter valid latitude (-90 to 90) and longitude (-180 to 180) coordinates.');
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
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save stop point.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t.editStop : t.addStop}
      icon={MapPin}
      error={error}
      isSubmitting={submitting}
      onSubmit={handleSubmit}
      submitText={t.saveStop || t.save}
    >
      {/* Stop Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.stopName}</span>
          <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Central Station"
          required
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.address}</span>
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. 123 Main Street"
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
        />
      </div>

      {/* Coordinates (Latitude & Longitude) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.latitude || 'Latitude'}</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.000001"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="33.513800"
            required
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.longitude || 'Longitude'}</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.000001"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="36.276500"
            required
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono shadow-xs"
          />
        </div>
      </div>

      {/* Stop Type (Drop Point vs Pickup Point) */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          {t.type}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setIsDropPoint(true)}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
              isDropPoint
                ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs'
                : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
            }`}
          >
            {t.dropPoint}
          </button>
          <button
            type="button"
            onClick={() => setIsDropPoint(false)}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
              !isDropPoint
                ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-xs'
                : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
            }`}
          >
            {t.pickupPoint}
          </button>
        </div>
      </div>

      {/* Status (Active vs Inactive) */}
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
