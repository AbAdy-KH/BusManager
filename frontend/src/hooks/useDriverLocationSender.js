import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/useAuth';
import { sendDriverLocation, closeDriverConnection } from '../services/trackingHubService';

export function useDriverLocationSender() {
  const { user } = useAuth();
  const isDriver = user?.roles?.includes('Driver');

  const [busId, setBusId] = useState(1);
  const [coordinates, setCoordinates] = useState({ lat: 32.5556, lng: 35.8500 });
  const [lastSentTime, setLastSentTime] = useState(null);
  const [isSending] = useState(() => isDriver);
  const [status, setStatus] = useState(() => (isDriver ? 'transmitting' : 'idle'));
  const [error, setError] = useState(null);

  const coordsRef = useRef(coordinates);
  const busIdRef = useRef(busId);

  // Synchronize ref values safely inside effect
  useEffect(() => {
    coordsRef.current = coordinates;
    busIdRef.current = busId;
  }, [coordinates, busId]);

  useEffect(() => {
    if (!isDriver) {
      closeDriverConnection();
      return;
    }

    let isMounted = true;

    // Function to transmit current position
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

    // Function to get current geolocation or fallback with simulated slight jitter
    function queryAndSendLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newLat = pos.coords.latitude;
            const newLng = pos.coords.longitude;
            if (isMounted) {
              setCoordinates({ lat: newLat, lng: newLng });
            }
            transmitPosition(newLat, newLng);
          },
          (err) => {
            const jitterLat = (Math.random() - 0.5) * 0.0008;
            const jitterLng = (Math.random() - 0.5) * 0.0008;
            const fallbackLat = Number((coordsRef.current.lat + jitterLat).toFixed(6));
            const fallbackLng = Number((coordsRef.current.lng + jitterLng).toFixed(6));

            if (isMounted) {
              setCoordinates({ lat: fallbackLat, lng: fallbackLng });
              if (err.code === 1) {
                setError('GPS permission denied: using route simulation fallback.');
              }
            }
            transmitPosition(fallbackLat, fallbackLng);
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        const fallbackLat = coordsRef.current.lat;
        const fallbackLng = coordsRef.current.lng;
        transmitPosition(fallbackLat, fallbackLng);
      }
    }

    // Initial send
    queryAndSendLocation();

    // Transmit every 10 seconds
    const interval = setInterval(queryAndSendLocation, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
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
