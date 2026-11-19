import Modal from '../../common/Modal';
import { useTripForm } from '../../../hooks/forms/useTripForm';
import {
  Route as RouteIcon,
  Clock,
  Compass,
  FileText,
  User,
} from 'lucide-react';

export default function TripModal({
  isOpen,
  onClose,
  onSuccess,
  trip = null,
  defaultDate = '',
}) {
  const {
    t,
    isEdit,
    busDriverId,
    setBusDriverId,
    direction,
    setDirection,
    routeId,
    setRouteId,
    startTime,
    setStartTime,
    arrivalTime,
    setArrivalTime,
    notes,
    setNotes,
    assignments,
    loadingAssignments,
    routes,
    loadingRoutes,
    submitting,
    error,
    handleSubmit,
  } = useTripForm({ isOpen, trip, defaultDate, onSuccess, onClose });

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t.tripModalTitleEdit : t.tripModalTitleAdd}
      icon={RouteIcon}
      error={error}
      isSubmitting={submitting}
      onSubmit={handleSubmit}
      submitText={t.saveTrip}
    >
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-sky-600" />
          <span>{t.selectBusDriver}</span>
          <span className="text-rose-500">*</span>
        </label>
        <select
          value={busDriverId}
          onChange={(e) => setBusDriverId(e.target.value)}
          required
          disabled={loadingAssignments}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
        >
          <option value="">
            {loadingAssignments ? 'Loading assignments...' : `-- ${t.selectBusDriver} --`}
          </option>
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.driverName || 'Driver'} — #{a.busNumber ? `${t.busNumber} ${a.busNumber}` : 'Bus'}
            </option>
          ))}
        </select>
        {assignments.length === 0 && !loadingAssignments && (
          <p className="mt-1 text-[11px] text-amber-600">
            {t.noAssignmentsForDate}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.direction}</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDirection(0)}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
              direction === 0
                ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-xs'
                : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
            }`}
          >
            {t.outbound}
          </button>
          <button
            type="button"
            onClick={() => setDirection(1)}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
              direction === 1
                ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-xs'
                : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
            }`}
          >
            {t.inbound}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.scheduledStartTime}</span>
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.scheduledArrivalTime}</span>
          </label>
          <input
            type="datetime-local"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            required
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono shadow-xs"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <RouteIcon className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.route || 'Route'}</span>
        </label>
        <select
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
          disabled={loadingRoutes}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
        >
          <option value="">
            {loadingRoutes
              ? 'Loading routes...'
              : `-- ${t.selectRouteOptional || t.selectRoute || 'Select Route (Optional)'} --`}
          </option>
          {routes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.code})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.tripNotes}</span>
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t.tripNotesPlaceholder}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs resize-none"
        />
      </div>
    </Modal>
  );
}
