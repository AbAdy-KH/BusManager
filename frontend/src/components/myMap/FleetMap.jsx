import React, { useMemo, useRef, useEffect } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function FleetMap({ stops = [], liveBuses = [], hubStatus = 'disconnected' }) {


    function mapIntoGeoJson(isDropPoint) {
        return {
            type: 'FeatureCollection',
            features: stops
                .filter(stop => stop.isDropPoint === isDropPoint)
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

    const dropPointsGeoJSON = useMemo(() => mapIntoGeoJson(true), [stops]);
    const pickPointsGeoJSON = useMemo(() => mapIntoGeoJson(false), [stops]);

    return (
        <div style={{ width: '100%', height: '60vb' }}>
            <Map
                initialViewState={{
                    longitude: 35.8500, // Irbid
                    latitude: 32.5556,
                    zoom: 13,
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
            >
                <NavigationControl position="top-right" />

            {/* Drop Points (Purple) */}
            <Source id="drop-stops-source" type="geojson" data={dropPointsGeoJSON}>
                <Layer
                    id="drop-stops-layer"
                    type="circle"
                    paint={{
                        'circle-radius': 8,
                        'circle-color': '#8800ff',
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#FFFFFF',
                    }}
                />
            </Source>

            {/* Pick Points (Red) */}
            <Source id="pick-stops-source" type="geojson" data={pickPointsGeoJSON}>
                <Layer
                    id="pick-stops-layer"
                    type="circle"
                    paint={{
                        'circle-radius': 8,
                        'circle-color': '#ff2600',
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#FFFFFF',
                    }}
                />
            </Source>
                {liveBuses.map((bus) => (
                    <Marker
                        key={bus.busId}
                        longitude={Number(bus.longitude)}
                        latitude={Number(bus.latitude)}
                        anchor="center"
                    >
                        {/* Custom Bus Marker UI */}
                        <div
                            style={{
                                fontSize: '24px',
                                cursor: 'pointer',
                                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.4))',
                            }}
                            title={bus.name}
                        >
                            🚌
                        </div>
                    </Marker>
                ))}
            </Map>
        </div>
    );
}