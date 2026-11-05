import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/useAuth';
import { sendDriverLocation, closeDriverConnection } from '../services/trackingHubService';
import { fetchTodayDriverAssignment } from '../services/adminService';

export function useDriverLocationSender() {
  const { user } = useAuth();
  const isDriver = user?.roles?.includes('Driver');

  const [busId, setBusId] = useState(1);
  const [coordinates, setCoordinates] = useState(null);
  const [lastSentTime, setLastSentTime] = useState(null);
  const [isSending] = useState(() => isDriver);
  const [status, setStatus] = useState(() => (isDriver ? 'connecting' : 'idle'));
  const [error, setError] = useState(null);

  const busIdRef = useRef(busId);
  const lastTransmittedRef = useRef({ lat: null, lng: null, time: 0 });

  // Auto-fetch today's assigned bus for this driver
  useEffect(() => {
    if (user?.id && isDriver) {
      fetchTodayDriverAssignment(user.id)
        .then((assignment) => {
          if (assignment && (assignment.busNumber || assignment.busId)) {
            setBusId(assignment.busNumber || assignment.busId);
          }
        })
        .catch(() => {});
    }
  }, [user?.id, isDriver]);

  useEffect(() => {
    busIdRef.current = busId;
  }, [busId]);

  useEffect(() => {
    if (!isDriver) {
      closeDriverConnection();
      return;
    }

    let isMounted = true;
    let watchId = null;

    async function transmitPosition(lat, lng) {
      try {
        await sendDriverLocation({
          busId: Number(busIdRef.current) || 1,
          latitude: Number(lat),
          longitude: Number(lng),
        });

        if (isMounted) {
          setLastSentTime(new Date().toLocaleTimeString());
          setError(null);
          setStatus('transmitting');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'SignalR transmission error');
          setStatus('error');
        }
      }
    }

    function handlePosition(pos) {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const accuracy = pos.coords.accuracy;

      if (isMounted) {
        setCoordinates({ lat, lng, accuracy });
      }

      const now = Date.now();
      const last = lastTransmittedRef.current;
      const timeDiff = now - last.time;

      // Transmit if:
      // 1. First time ever
      // 2. Or moved significantly (> ~3 meters) and at least 5s elapsed
      // 3. Or at least 15s elapsed (periodic heartbeat)
      const movedSignificantly =
        last.lat === null ||
        Math.abs(lat - last.lat) > 0.00003 ||
        Math.abs(lng - last.lng) > 0.00003;

      if (last.lat === null || (timeDiff >= 5000 && movedSignificantly) || timeDiff >= 15000) {
        lastTransmittedRef.current = { lat, lng, time: now };
        transmitPosition(lat, lng);
      }
    }

    function handleError(err) {
      console.warn('Geolocation error:', err.message, 'Code:', err.code);
      if (isMounted) {
        let msg = 'Failed to get location';
        if (err.code === 1) msg = 'Location permission denied by user or browser.';
        else if (err.code === 2) msg = 'Location unavailable. Ensure GPS is enabled.';
        else if (err.code === 3) msg = 'Location request timed out. Retrying...';
        setError(msg);
        setStatus('error');
      }
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setStatus('error');
      return;
    }

    // Start watching real position with high accuracy
    watchId = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 5000,
      }
    );

    return () => {
      isMounted = false;
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      closeDriverConnection();
    };
  }, [isDriver]);

  return {
    isDriver,
    busId,
    setBusId,
    coordinates,
    lastSentTime,
    isSending,
    status,
    error,
  };
}
