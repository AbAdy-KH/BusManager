import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useLanguage } from '../context/useLanguage';
import { DEFAULT_MAP_CENTER } from './useLocationPickerMap';

export function useRouteMapModal({ isOpen, route, routeStops = [] }) {
  const { t } = useLanguage();
  const mapRef = useRef(null);
  const [activeStopId, setActiveStopId] = useState(null);
  const [roadGeometry, setRoadGeometry] = useState(null);

  // Filter and sort stops for this route by sequenceOrder ascending
  const orderedStops = useMemo(() => {
    if (!route?.id) return [];
    return routeStops
      .filter((rs) => rs.routeId === route.id)
      .filter((rs) => {
        const lat = parseFloat(rs.stopPointLatitude);
        const lng = parseFloat(rs.stopPointLongitude);
        return !isNaN(lat) && !isNaN(lng);
      })
      .sort((a, b) => (a.sequenceOrder || 0) - (b.sequenceOrder || 0));
  }, [route?.id, routeStops]);

  // Reset active stop and fetch street-level OSRM route geometry when modal opens
  useEffect(() => {
    if (!isOpen) {
      setActiveStopId(null);
      setRoadGeometry(null);
      return;
    }

    if (orderedStops.length < 2) {
      setRoadGeometry(null);
      return;
    }

    let cancelled = false;
    const coordsQuery = orderedStops
      .map((s) => `${parseFloat(s.stopPointLongitude)},${parseFloat(s.stopPointLatitude)}`)
      .join(';');

    fetch(`https://router.project-osrm.org/route/v1/driving/${coordsQuery}?overview=full&geometries=geojson`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.routes?.[0]?.geometry) {
          setRoadGeometry(data.routes[0].geometry);
        }
      })
      .catch(() => {
        // Fallback to straight-line connecting stops
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, orderedStops]);

  // Fit map bounds to all stops when map loads or orderedStops changes
  const fitMapToStops = useCallback(() => {
    if (!mapRef.current || orderedStops.length === 0) return;

    if (orderedStops.length === 1) {
      const only = orderedStops[0];
      mapRef.current.flyTo({
        center: [parseFloat(only.stopPointLongitude), parseFloat(only.stopPointLatitude)],
        zoom: 14,
        duration: 700,
      });
      return;
    }

    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    orderedStops.forEach((s) => {
      const lng = parseFloat(s.stopPointLongitude);
      const lat = parseFloat(s.stopPointLatitude);
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });

    try {
      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 55, duration: 700, maxZoom: 15 }
      );
    } catch {
      // ignore bounds error if map isn't ready
    }
  }, [orderedStops]);

  useEffect(() => {
    if (!isOpen || orderedStops.length === 0) return;
    const timer = setTimeout(() => {
      fitMapToStops();
    }, 150);
    return () => clearTimeout(timer);
  }, [isOpen, orderedStops, fitMapToStops]);

  // Build GeoJSON LineString (uses road geometry if available, otherwise straight line)
  const routeLineGeoJSON = useMemo(() => {
    if (orderedStops.length < 2) return null;

    const geometry = roadGeometry || {
      type: 'LineString',
      coordinates: orderedStops.map((s) => [
        parseFloat(s.stopPointLongitude),
        parseFloat(s.stopPointLatitude),
      ]),
    };

    return {
      type: 'Feature',
      properties: {},
      geometry,
    };
  }, [orderedStops, roadGeometry]);

  const initialCenter = useMemo(() => {
    if (orderedStops.length > 0) {
      return {
        latitude: parseFloat(orderedStops[0].stopPointLatitude),
        longitude: parseFloat(orderedStops[0].stopPointLongitude),
      };
    }
    return DEFAULT_MAP_CENTER;
  }, [orderedStops]);

  const focusStop = useCallback((stop) => {
    if (!stop) return;
    setActiveStopId(stop.stopPointId);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [parseFloat(stop.stopPointLongitude), parseFloat(stop.stopPointLatitude)],
        zoom: 15,
        duration: 600,
      });
    }
  }, []);

  return {
    t,
    mapRef,
    orderedStops,
    routeLineGeoJSON,
    initialCenter,
    activeStopId,
    focusStop,
    fitMapToStops,
  };
}
