import { useMemo } from 'react';

function buildStopsGeoJson(stops = [], isDropPoint) {
  return {
    type: 'FeatureCollection',
    features: stops
      .filter((stop) => stop.isDropPoint === isDropPoint)
      .map((stop, index) => ({
        type: 'Feature',
        properties: {
          id: stop.id || index,
          name: stop.name,
        },
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(stop.longitude), parseFloat(stop.latitude)],
        },
      })),
  };
}

export function useFleetMap(stops = []) {
  const dropPointsGeoJSON = useMemo(() => buildStopsGeoJson(stops, true), [stops]);
  const pickPointsGeoJSON = useMemo(() => buildStopsGeoJson(stops, false), [stops]);

  return {
    dropPointsGeoJSON,
    pickPointsGeoJSON,
  };
}
