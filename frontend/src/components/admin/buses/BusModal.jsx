import Modal from '../../common/Modal';
import { useBusForm } from '../../../hooks/forms/useBusForm';
import { Bus, Hash, Users } from 'lucide-react';

export default function BusModal({ isOpen, onClose, onSuccess, bus = null }) {
  const {
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
  } = useBusForm({ isOpen, bus, onSuccess, onClose });

  if (!isOpen) return null;

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
