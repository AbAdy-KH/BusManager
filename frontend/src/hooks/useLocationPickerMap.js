import { useRef, useEffect, useCallback } from 'react';

export const DEFAULT_MAP_CENTER = {
  latitude: 32.5556, // Irbid
  longitude: 35.8500,
};

export function useLocationPickerMap({ latitude, longitude, onChange }) {
  const mapRef = useRef(null);

  const parsedLat = parseFloat(latitude);
  const parsedLng = parseFloat(longitude);
  const hasValidCoords =
    !isNaN(parsedLat) &&
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    !isNaN(parsedLng) &&
    parsedLng >= -180 &&
    parsedLng <= 180;

  useEffect(() => {
    if (hasValidCoords && mapRef.current) {
      mapRef.current.flyTo({
        center: [parsedLng, parsedLat],
        duration: 600,
      });
    }
  }, [hasValidCoords, parsedLat, parsedLng]);

  const handleSelect = useCallback(
    (lngLat) => {
      if (!lngLat) return;
      const lat = Number(lngLat.lat).toFixed(6);
      const lng = Number(lngLat.lng).toFixed(6);
      onChange?.({ latitude: lat, longitude: lng });
    },
    [onChange]
  );

  return {
    mapRef,
    parsedLat,
    parsedLng,
    hasValidCoords,
    initialCenter: {
      latitude: hasValidCoords ? parsedLat : DEFAULT_MAP_CENTER.latitude,
      longitude: hasValidCoords ? parsedLng : DEFAULT_MAP_CENTER.longitude,
    },
    handleSelect,
  };
}
