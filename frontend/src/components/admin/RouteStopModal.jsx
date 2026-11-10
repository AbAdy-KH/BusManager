import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { addStopToRoute, updateRouteStop } from '../../services/adminService';
import Modal from '../common/Modal';
import {
  GitMerge,
  MapPin,
  ListOrdered,
  Clock,
  Route as RouteIcon,
} from 'lucide-react';

export default function RouteStopModal({
  isOpen,
  onClose,
  onSuccess,
  routeStop = null,
  routes = [],
  stops = [],
  existingRouteStops = [],
  defaultRouteId = '',
}) {
  const { t } = useLanguage();
  const isEdit = !!routeStop;

  const [routeId, setRouteId] = useState('');
  const [stopPointId, setStopPointId] = useState('');
  const [sequenceOrder, setSequenceOrder] = useState(1);
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Helper to calculate the next sequence number for a route
  const getNextSequence = (targetRouteId) => {
    if (!targetRouteId) return 1;
    const stopsForRoute = existingRouteStops.filter((rs) => rs.routeId === targetRouteId);
    if (stopsForRoute.length === 0) return 1;
    const maxSeq = Math.max(...stopsForRoute.map((rs) => rs.sequenceOrder || 0));
    return maxSeq + 1;
  };

  useEffect(() => {
    if (!isOpen) return;
    setError(null);

    if (isEdit) {
      setRouteId(routeStop.routeId || '');
      setStopPointId(routeStop.stopPointId || '');
      setSequenceOrder(routeStop.sequenceOrder || 1);
      setEstimatedMinutes(
        routeStop.estimatedMinutesFromStart !== null && routeStop.estimatedMinutesFromStart !== undefined
          ? String(routeStop.estimatedMinutesFromStart)
          : ''
      );
    } else {
      const initialRouteId = defaultRouteId || (routes.length > 0 ? routes[0].id : '');
      setRouteId(initialRouteId);
      setStopPointId(stops.length > 0 ? stops[0].id : '');
      setSequenceOrder(getNextSequence(initialRouteId));
      setEstimatedMinutes('');
    }
  }, [isOpen, routeStop, isEdit, defaultRouteId, routes, stops]);

  // When user selects a different route in Add mode, auto-suggest next sequence
  const handleRouteChange = (newRouteId) => {
    setRouteId(newRouteId);
    if (!isEdit) {
      setSequenceOrder(getNextSequence(newRouteId));
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!routeId) {
      setError(t.routeRequired || 'Route is required.');
      return;
    }

    if (!stopPointId) {
      setError(t.stopRequired || 'Stop point is required.');
      return;
    }

    const seq = parseInt(sequenceOrder, 10);
    if (isNaN(seq) || seq < 1) {
      setError(t.sequenceRequired || 'Sequence order must be at least 1.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      routeId,
      stopPointId,
      sequenceOrder: seq,
      estimatedMinutesFromStart: estimatedMinutes === '' ? null : parseInt(estimatedMinutes, 10),
    };

    try {
      if (isEdit) {
        await updateRouteStop(routeStop.routeId, routeStop.stopPointId, payload);
      } else {
        await addStopToRoute(payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save route stop.');
    } finally {
      setSubmitting(false);
    }
  };

  // Find assigned stops on this route to help user avoid duplicates in Add mode
  const alreadyAssignedStopIds = new Set(
    existingRouteStops
      .filter((rs) => rs.routeId === routeId && (!isEdit || rs.stopPointId !== routeStop?.stopPointId))
      .map((rs) => rs.stopPointId)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t.editRouteStop : t.addStopToRoute}
      icon={GitMerge}
      error={error}
      isSubmitting={submitting}
      onSubmit={handleSubmit}
      submitText={t.save || 'Save'}
    >
      {/* Route Selection */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <RouteIcon className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.route}</span>
          <span className="text-rose-500">*</span>
        </label>
        {isEdit ? (
          <div className="px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs font-medium text-slate-700">
            {routeStop?.routeName || routeId} ({routeStop?.routeCode})
          </div>
        ) : (
          <select
            value={routeId}
            onChange={(e) => handleRouteChange(e.target.value)}
            required
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs cursor-pointer"
          >
            <option value="">{t.selectRoute}</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.code})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Stop Point Selection */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-violet-600" />
          <span>{t.stopPoints || t.stopName}</span>
          <span className="text-rose-500">*</span>
        </label>
        {isEdit ? (
          <div className="px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs font-medium text-slate-700">
            {routeStop?.stopPointName || stopPointId}
          </div>
        ) : (
          <select
            value={stopPointId}
            onChange={(e) => setStopPointId(e.target.value)}
            required
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs cursor-pointer"
          >
            <option value="">{t.selectStopPoint}</option>
            {stops.map((s) => {
              const isAssigned = alreadyAssignedStopIds.has(s.id);
              return (
                <option key={s.id} value={s.id} disabled={isAssigned}>
                  {s.name} {s.address ? `— ${s.address}` : ''} {isAssigned ? `(Already added)` : ''}
                </option>
              );
            })}
          </select>
        )}
      </div>

      {/* Sequence Order */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <ListOrdered className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.sequenceOrder}</span>
          <span className="text-rose-500">*</span>
        </label>
        <input
          type="number"
          min="1"
          value={sequenceOrder}
          onChange={(e) => setSequenceOrder(e.target.value)}
          required
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
          placeholder="e.g. 1"
        />
        <p className="text-[11px] text-slate-500 mt-1">
          Determines the order of this stop along the route (e.g. 1 = first stop, 2 = second stop).
        </p>
      </div>

      {/* Estimated Minutes From Start */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.estimatedMinutes}</span>
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(e.target.value)}
            placeholder="e.g. 15"
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
          <span className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
            min
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Estimated travel time in minutes from the trip origin to this stop (optional).
        </p>
      </div>
    </Modal>
  );
}
