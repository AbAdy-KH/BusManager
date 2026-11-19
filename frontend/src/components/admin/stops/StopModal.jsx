import Modal from '../../common/Modal';
import LocationPickerMap from '../../myMap/LocationPickerMap';
import { useStopForm } from '../../../hooks/forms/useStopForm';
import { MapPin, Navigation, Home } from 'lucide-react';

export default function StopModal({ isOpen, onClose, onSuccess, stop = null }) {
  const {
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
  } = useStopForm({ isOpen, stop, onSuccess, onClose });

  if (!isOpen) return null;

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
      maxWidth="max-w-lg"
    >
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

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.pickFromMap || t.coordinates}</span>
          <span className="text-rose-500">*</span>
        </label>
        <LocationPickerMap
          latitude={latitude}
          longitude={longitude}
          helperText={t.clickMapToPick}
          onChange={handleCoordinatesChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            {t.latitude || 'Latitude'}
          </label>
          <input
            type="number"
            step="0.000001"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
            className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            {t.longitude || 'Longitude'}
          </label>
          <input
            type="number"
            step="0.000001"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t.type}
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setIsDropPoint(true)}
              className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
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
              className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                !isDropPoint
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-xs'
                  : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
              }`}
            >
              {t.pickupPoint}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t.status}
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setIsActive(true)}
              className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
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
              className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                !isActive
                  ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs'
                  : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
              }`}
            >
              {t.inactive}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
