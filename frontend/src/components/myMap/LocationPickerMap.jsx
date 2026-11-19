import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import { MapPin } from 'lucide-react';
import { useLocationPickerMap } from '../../hooks/useLocationPickerMap';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
  helperText,
}) {
  const {
    mapRef,
    parsedLat,
    parsedLng,
    hasValidCoords,
    initialCenter,
    handleSelect,
  } = useLocationPickerMap({ latitude, longitude, onChange });

  return (
    <div className="rounded-xl overflow-hidden border border-stone-200 shadow-xs bg-stone-100">
      <div className="h-56 w-full relative">
        <Map
          ref={mapRef}
          initialViewState={{
            latitude: initialCenter.latitude,
            longitude: initialCenter.longitude,
            zoom: 13,
          }}
          style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
          mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          onClick={(e) => handleSelect(e.lngLat)}
        >
          <NavigationControl position="top-right" />

          {hasValidCoords && (
            <Marker
              latitude={parsedLat}
              longitude={parsedLng}
              anchor="bottom"
              draggable
              onDragEnd={(e) => handleSelect(e.lngLat)}
            >
              <div className="flex flex-col items-center cursor-grab active:cursor-grabbing">
                <div className="p-1.5 bg-indigo-600 text-white rounded-full shadow-md border-2 border-white">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="w-1.5 h-1.5 bg-indigo-700 rounded-full -mt-0.5 shadow-xs" />
              </div>
            </Marker>
          )}
        </Map>
      </div>

      {helperText && (
        <div className="px-3 py-1.5 bg-stone-50 border-t border-stone-200/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span>{helperText}</span>
          {hasValidCoords && (
            <span className="font-mono font-semibold text-indigo-700">
              {parsedLat.toFixed(5)}, {parsedLng.toFixed(5)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
