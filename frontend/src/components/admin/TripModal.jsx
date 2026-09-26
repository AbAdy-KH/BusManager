import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';
import {
  createTrip,
  updateTrip,
  fetchTripById,
  fetchBusDriverAssignments,
} from '../../services/adminService';
import {
  X,
  Route as RouteIcon,
  Clock,
  Compass,
  FileText,
  CheckCircle2,
  AlertCircle,
  Bus,
  User,
} from 'lucide-react';

function toDateTimeLocal(isoString, fallbackDate = '', fallbackTime = '08:00') {
  if (!isoString) {
    const base = fallbackDate || new Date().toISOString().slice(0, 10);
    return `${base}T${fallbackTime}`;
  }
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) {
      const base = fallbackDate || new Date().toISOString().slice(0, 10);
      return `${base}T${fallbackTime}`;
    }
    const pad = (n) => String(n).padStart(2, '0');
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const h = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${y}-${m}-${day}T${h}:${min}`;
  } catch {
    const base = fallbackDate || new Date().toISOString().slice(0, 10);
    return `${base}T${fallbackTime}`;
  }
}

export default function TripModal({
  isOpen,
  onClose,
  onSuccess,
  trip = null,
  defaultDate = '',
}) {
  const { t } = useLanguage();
  const isEdit = !!trip;

  const [busDriverId, setBusDriverId] = useState('');
  const [direction, setDirection] = useState(0);
  const [routeId, setRouteId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [notes, setNotes] = useState('');

  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load assignments for the chosen date or all assignments
  const loadAssignments = async (dateStr) => {
    setLoadingAssignments(true);
    try {
      let data = await fetchBusDriverAssignments(dateStr || null);
      if ((!data || data.length === 0) && dateStr) {
        // Fallback to all assignments if none found for this specific date
        data = await fetchBusDriverAssignments(null);
      }
      setAssignments(data || []);
    } catch (err) {
      console.warn('Failed to load assignments for trip modal:', err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    setError(null);
    const targetDate = defaultDate || new Date().toISOString().slice(0, 10);
    loadAssignments(targetDate);

    if (trip) {
      const dirVal =
        typeof trip.direction === 'number'
          ? trip.direction
          : trip.direction?.toLowerCase() === 'inbound'
          ? 1
          : 0;

      setDirection(dirVal);
      setRouteId(trip.routeId || '');
      setStartTime(toDateTimeLocal(trip.scheduledStartTime, defaultDate, '08:00'));
      setArrivalTime(toDateTimeLocal(trip.scheduledArrivalTime, defaultDate, '09:00'));
      setNotes(trip.notes || '');

      // Check if trip already has busDriverId, or fetch full trip by ID
      if (trip.busDriverId) {
        setBusDriverId(trip.busDriverId);
      } else {
        const tripId = trip.tripId || trip.id;
        if (tripId) {
          fetchTripById(tripId)
            .then((fullTrip) => {
              if (fullTrip) {
                if (fullTrip.busDriverId) setBusDriverId(fullTrip.busDriverId);
                if (fullTrip.routeId) setRouteId(fullTrip.routeId);
                if (fullTrip.notes) setNotes(fullTrip.notes);
              }
            })
            .catch(() => {});
        }
      }
    } else {
      setBusDriverId('');
      setDirection(0);
      setRouteId('');
      setStartTime(`${targetDate}T08:00`);
      setArrivalTime(`${targetDate}T09:00`);
      setNotes('');
    }
  }, [isOpen, trip, defaultDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!busDriverId) {
      setError(t.busDriverRequired || 'Please select a driver and bus assignment.');
      return;
    }

    if (!startTime || !arrivalTime) {
      setError('Please specify both scheduled start and arrival times.');
      return;
    }

    const startObj = new Date(startTime);
    const arrivalObj = new Date(arrivalTime);
    console.log(startObj);
    console.log(arrivalObj);

    if (arrivalObj <= startObj) {
      setError('Scheduled arrival time must be after scheduled start time.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      busDriverId: busDriverId,
      routeId: routeId.trim() || null,
      scheduledStartTime: startObj,
      scheduledArrivalTime: arrivalObj,
      direction: Number(direction),
      notes: notes.trim() || null,
    };

    console.log(payload);
    
    try {
      if (isEdit) {
        const tripId = trip.tripId || trip.id;
        await updateTrip(tripId, payload);
      } else {
        await createTrip(payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save trip.');
    } finally {
      setSubmitting(false);
    }
  };
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200/90 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <RouteIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                {isEdit ? t.tripModalTitleEdit : t.tripModalTitleAdd}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Bus Driver Selection */}
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
                {loadingAssignments
                  ? 'Loading assignments...'
                  : `-- ${t.selectBusDriver} --`}
              </option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.driverName || 'Driver'} — #{a.busNumber ? `${t.busNumber} ${a.busNumber}` : 'Bus'}{' '}
                </option>
              ))}
            </select>
            {assignments.length === 0 && !loadingAssignments && (
              <p className="mt-1 text-[11px] text-amber-600">
                {t.noAssignmentsForDate}
              </p>
            )}
          </div>

          {/* Direction */}
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

          {/* Scheduled Times */}
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

          {/* Route ID (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <RouteIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.tripRouteId}</span>
            </label>
            <input
              type="text"
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              placeholder="e.g. Route-101"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>

          {/* Notes (Optional) */}
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

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{t.saveTrip}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
