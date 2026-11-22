import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { addStopToRoute, updateRouteStop } from '../../services/routeService';

export function useRouteStopForm({
  isOpen,
  routeStop,
  routes = [],
  stops = [],
  existingRouteStops = [],
  defaultRouteId = '',
  onSuccess,
  onClose,
}) {
  const { t } = useLanguage();
  const isEdit = !!routeStop;

  const [routeId, setRouteId] = useState('');
  const [stopPointId, setStopPointId] = useState('');
  const [sequenceOrder, setSequenceOrder] = useState(1);
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const getNextSequence = useCallback(
    (targetRouteId) => {
      if (!targetRouteId) return 1;
      const stopsForRoute = existingRouteStops.filter((rs) => rs.routeId === targetRouteId);
      if (stopsForRoute.length === 0) return 1;
      const maxSeq = Math.max(...stopsForRoute.map((rs) => rs.sequenceOrder || 0));
      return maxSeq + 1;
    },
    [existingRouteStops]
  );

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
      const assignedIds = new Set(
        existingRouteStops.filter((rs) => rs.routeId === initialRouteId).map((rs) => rs.stopPointId)
      );
      const firstAvailableStop = stops.find((s) => !assignedIds.has(s.id));

      setRouteId(initialRouteId);
      setStopPointId(firstAvailableStop ? firstAvailableStop.id : '');
      setSequenceOrder(getNextSequence(initialRouteId));
      setEstimatedMinutes('');
    }
  }, [isOpen, routeStop, isEdit, defaultRouteId, routes, stops, existingRouteStops, getNextSequence]);

  const handleRouteChange = (newRouteId) => {
    setRouteId(newRouteId);
    if (!isEdit) {
      setSequenceOrder(getNextSequence(newRouteId));
      const assignedIds = new Set(
        existingRouteStops.filter((rs) => rs.routeId === newRouteId).map((rs) => rs.stopPointId)
      );
      if (assignedIds.has(stopPointId)) {
        const firstAvailableStop = stops.find((s) => !assignedIds.has(s.id));
        setStopPointId(firstAvailableStop ? firstAvailableStop.id : '');
      }
    }
  };

  const alreadyAssignedStopIds = useMemo(
    () =>
      new Set(
        existingRouteStops
          .filter((rs) => rs.routeId === routeId && (!isEdit || rs.stopPointId !== routeStop?.stopPointId))
          .map((rs) => rs.stopPointId)
      ),
    [existingRouteStops, routeId, isEdit, routeStop?.stopPointId]
  );

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
      onClose?.();
    } catch (err) {
      setError(err.message || 'Failed to save route stop.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    t,
    isEdit,
    routeId,
    stopPointId,
    setStopPointId,
    sequenceOrder,
    setSequenceOrder,
    estimatedMinutes,
    setEstimatedMinutes,
    submitting,
    error,
    alreadyAssignedStopIds,
    handleRouteChange,
    handleSubmit,
  };
}
