import React, { useMemo, useRef, useEffect } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function FleetMap({ stops = [], liveBuses = [], hubStatus = 'disconnected' }) {

    // 1. Convert stops array to GeoJSON format
    const stopsGeoJSON = useMemo(() => {
        return {
            type: 'FeatureCollection',
            features: stops.map((stop, index) => ({
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
    }, [stops]);

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

                <Source id="bus-stops" type="geojson" data={stopsGeoJSON}>
                    <Layer
                        id="stops-layer"
                        type="circle"
                        paint={{
                            'circle-radius': 8,
                            'circle-color': '#8800ff',
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