import { useState } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { assignBusToDriver } from '../../services/adminService';
import { X, Bus, User, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AssignBusModal({
  isOpen,
  onClose,
  onSuccess,
  drivers = [],
  buses = [],
  assignments = [],
  initialDriverId = '',
  selectedDate = '',
}) {
  const { t } = useLanguage();

  const [driverId, setDriverId] = useState(initialDriverId);
  const [busId, setBusId] = useState('');
  const [date, setDate] = useState(selectedDate || new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  // Track assigned drivers and buses on this date to give visual hints
  const assignedDriverIds = new Set(assignments.map((a) => a.driverId));
  const assignedBusIds = new Set(assignments.map((a) => a.busId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!driverId || !busId) {
      setError('Please select both a driver and a bus.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Build ISO timestamp for the selected date + current time
      const now = new Date();
      const createdAt = `${date}T${now.toTimeString().slice(0, 8)}Z`;

      await assignBusToDriver({
        busId,
        driverId,
        createdAt,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to assign bus to driver.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-cream-300 max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-cream-100 px-6 py-4 border-b border-cream-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-600 text-white rounded-xl shadow-sm">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">{t.assignBusModalTitle}</h2>
              <p className="text-[11px] text-gray-500">{t.busDriverSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-cream-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              {t.assignmentDate}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-sky-600 font-mono"
            />
          </div>

          {/* Driver Select */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-sky-600" />
              {t.selectDriver}
            </label>
            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-sky-600"
            >
              <option value="">-- {t.selectDriver} --</option>
              {drivers.map((driver) => {
                const isAssigned = assignedDriverIds.has(driver.driverId);
                return (
                  <option key={driver.driverId} value={driver.driverId}>
                    {driver.name} ({t.licenseNumber}: {driver.licenseNumber}) {isAssigned ? `[✓ ${t.alreadyAssigned}]` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Bus Select */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Bus className="w-3.5 h-3.5 text-sky-600" />
              {t.selectBus}
            </label>
            <select
              value={busId}
              onChange={(e) => setBusId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-sky-600"
            >
              <option value="">-- {t.selectBus} --</option>
              {buses
                .filter((b) => b.isActive)
                .map((bus) => {
                  const isBusAssigned = assignedBusIds.has(bus.id);
                  return (
                    <option key={bus.id} value={bus.id}>
                      {t.busNumber} #{bus.number} - {bus.plateNumber} ({bus.capacity} {t.seats}) {isBusAssigned ? `[⚠️ ${t.busesInService}]` : ''}
                    </option>
                  );
                })}
            </select>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-cream-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 bg-cream-100 hover:bg-cream-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !driverId || !busId}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{t.assignBusBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
