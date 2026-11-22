import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useLanguage } from '../context/useLanguage';
import { DEFAULT_MAP_CENTER } from './useLocationPickerMap';

function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useDriverRouteMap({
  trip,
  routeStops = [],
  driverCoordinates = null,
}) {
  const { t } = useLanguage();
  const mapRef = useRef(null);
  const [activeStopId, setActiveStopId] = useState(null);
  const [roadGeometry, setRoadGeometry] = useState(null);

  const orderedStops = useMemo(() => {
    return (routeStops || [])
      .filter((rs) => {
        const lat = parseFloat(rs.stopPointLatitude);
        const lng = parseFloat(rs.stopPointLongitude);
        return !isNaN(lat) && !isNaN(lng);
      })
      .sort((a, b) => (a.sequenceOrder || 0) - (b.sequenceOrder || 0));
  }, [routeStops]);

  // Fetch street-following OSRM route geometry when stops change
  useEffect(() => {
    setActiveStopId(null);

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
        if (!cancelled) setRoadGeometry(null);
      });

    return () => {
      cancelled = true;
    };
  }, [orderedStops]);

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
      // ignore if map not ready
    }
  }, [orderedStops]);

  useEffect(() => {
    if (orderedStops.length === 0) return;
    const timer = setTimeout(() => {
      fitMapToStops();
    }, 150);
    return () => clearTimeout(timer);
  }, [trip?.tripId, orderedStops, fitMapToStops]);

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

  // Identify closest stop to the driver's live GPS coordinates
  const closestStopId = useMemo(() => {
    if (!driverCoordinates?.lat || !driverCoordinates?.lng || orderedStops.length === 0) {
      return null;
    }

    let minDistance = Infinity;
    let nearestId = null;

    orderedStops.forEach((s) => {
      const dist = getDistanceMeters(
        driverCoordinates.lat,
        driverCoordinates.lng,
        parseFloat(s.stopPointLatitude),
        parseFloat(s.stopPointLongitude)
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearestId = s.stopPointId;
      }
    });

    return nearestId;
  }, [driverCoordinates, orderedStops]);

  const initialCenter = useMemo(() => {
    if (orderedStops.length > 0) {
      return {
        latitude: parseFloat(orderedStops[0].stopPointLatitude),
        longitude: parseFloat(orderedStops[0].stopPointLongitude),
      };
    }
    if (driverCoordinates?.lat && driverCoordinates?.lng) {
      return {
        latitude: Number(driverCoordinates.lat),
        longitude: Number(driverCoordinates.lng),
      };
    }
    return DEFAULT_MAP_CENTER;
  }, [orderedStops, driverCoordinates]);

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

  const centerOnDriverBus = useCallback(() => {
    if (!driverCoordinates?.lat || !driverCoordinates?.lng || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [Number(driverCoordinates.lng), Number(driverCoordinates.lat)],
      zoom: 15,
      duration: 600,
    });
  }, [driverCoordinates]);

  return {
    t,
    mapRef,
    orderedStops,
    routeLineGeoJSON,
    initialCenter,
    activeStopId,
    closestStopId,
    focusStop,
    fitMapToStops,
    centerOnDriverBus,
  };
}
