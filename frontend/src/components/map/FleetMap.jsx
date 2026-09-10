import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import { MapPin, Bus, Layers, Radio, Lock } from 'lucide-react';
import MapControls from './MapControls';
import MapLegend from './MapLegend';
import MapEntityPopup from './MapEntityPopup';

function latLngToWorld(lat, lng) {
  const sinY = Math.min(Math.max(Math.sin((lat * Math.PI) / 180), -0.9999), 0.9999);
  return {
    x: 256 * (0.5 + lng / 360),
    y: 256 * (0.5 - Math.log((1 + sinY) / (1 - sinY)) / (4 * Math.PI)),
  };
}

export default function FleetMap({ stops = [], liveBuses = [], hubStatus = 'disconnected' }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAdmin = user?.roles?.includes('Admin');

  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 500 });

  const autoCenter = useMemo(() => {
    if (stops.length > 0) {
      const avgLat = stops.reduce((sum, s) => sum + Number(s.latitude), 0) / stops.length;
      const avgLng = stops.reduce((sum, s) => sum + Number(s.longitude), 0) / stops.length;
      return { lat: avgLat, lng: avgLng };
    }
    return { lat: 32.5556, lng: 35.85 };
  }, [stops]);

  const [userCenter, setUserCenter] = useState(null);
  const center = userCenter || autoCenter;

  const [zoom, setZoom] = useState(13);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          w: containerRef.current.clientWidth || 800,
          h: containerRef.current.clientHeight || 500,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const projectToPixels = useCallback(
    (lat, lng, containerWidth, containerHeight) => {
      const scale = Math.pow(2, zoom);
      const worldCenter = latLngToWorld(center.lat, center.lng);
      const worldPoint = latLngToWorld(lat, lng);

      const px = (worldPoint.x - worldCenter.x) * scale + containerWidth / 2;
      const py = (worldPoint.y - worldCenter.y) * scale + containerHeight / 2;
      return { x: px, y: py };
    },
    [center, zoom]
  );

  const handleFitAll = () => {
    const allPoints = [
      ...stops.map((s) => ({ lat: Number(s.latitude), lng: Number(s.longitude) })),
      ...(isAdmin ? liveBuses.map((b) => ({ lat: Number(b.latitude), lng: Number(b.longitude) })) : []),
    ];

    if (allPoints.length === 0) return;

    const minLat = Math.min(...allPoints.map((p) => p.lat));
    const maxLat = Math.max(...allPoints.map((p) => p.lat));
    const minLng = Math.min(...allPoints.map((p) => p.lng));
    const maxLng = Math.max(...allPoints.map((p) => p.lng));

    setUserCenter({
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    });
    setZoom(13);
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const scale = Math.pow(2, zoom);
    const worldCenter = latLngToWorld(center.lat, center.lng);
    const newWorldX = worldCenter.x - dx / scale;
    const newWorldY = worldCenter.y - dy / scale;

    const lng = (newWorldX / 256 - 0.5) * 360;
    const n = Math.PI - (2 * Math.PI * newWorldY) / 256;
    const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

    setUserCenter({ lat: Math.max(-85, Math.min(85, lat)), lng: Math.max(-180, Math.min(180, lng)) });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const tileZoom = Math.max(1, Math.min(19, Math.floor(zoom)));
  const scale = Math.pow(2, zoom);
  const worldCenter = latLngToWorld(center.lat, center.lng);

  const tiles = useMemo(() => {
    const numTiles = Math.pow(2, tileZoom);
    const centerTileX = (worldCenter.x / 256) * Math.pow(2, tileZoom);
    const centerTileY = (worldCenter.y / 256) * Math.pow(2, tileZoom);

    const tileList = [];
    const radiusX = Math.ceil(dimensions.w / 256 / 2) + 1;
    const radiusY = Math.ceil(dimensions.h / 256 / 2) + 1;

    for (let dx = -radiusX; dx <= radiusX; dx++) {
      for (let dy = -radiusY; dy <= radiusY; dy++) {
        const tx = Math.floor(centerTileX) + dx;
        const ty = Math.floor(centerTileY) + dy;
        if (tx >= 0 && tx < numTiles && ty >= 0 && ty < numTiles) {
          const px =
            (tx * 256 - worldCenter.x * Math.pow(2, tileZoom)) * (scale / Math.pow(2, tileZoom)) +
            dimensions.w / 2;
          const py =
            (ty * 256 - worldCenter.y * Math.pow(2, tileZoom)) * (scale / Math.pow(2, tileZoom)) +
            dimensions.h / 2;

          tileList.push({
            key: `${tileZoom}-${tx}-${ty}`,
            url: `https://tile.openstreetmap.org/${tileZoom}/${tx}/${ty}.png`,
            x: px,
            y: py,
            size: 256 * (scale / Math.pow(2, tileZoom)),
          });
        }
      }
    }
    return tileList;
  }, [tileZoom, worldCenter, scale, dimensions.w, dimensions.h]);

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-sm relative flex flex-col h-[540px]">
      {/* Top Map Bar */}
      <div className="bg-stone-50/90 backdrop-blur-md px-4 py-3 border-b border-stone-200/80 z-20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" /> {t.fleetMap}
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-slate-600 font-medium">
            {stops.length} {t.stopPoints}
          </span>
          {isAdmin && (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono text-[11px] font-semibold">
              <Radio className="w-3 h-3 animate-pulse text-emerald-500" /> {liveBuses.length} {t.liveBusesCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{hubStatus === 'connected' ? t.active : hubStatus}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
              <Lock className="w-3 h-3 text-amber-600" /> {t.adminOnlyTelemetry}
            </span>
          )}
        </div>
      </div>

      {/* Interactive Map Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex-1 relative overflow-hidden bg-stone-100 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* OpenStreetMap Tiles Layer */}
        <div className="absolute inset-0 pointer-events-none opacity-90">
          {tiles.map((tile) => (
            <img
              key={tile.key}
              src={tile.url}
              alt=""
              loading="lazy"
              style={{
                position: 'absolute',
                left: `${tile.x}px`,
                top: `${tile.y}px`,
                width: `${tile.size}px`,
                height: `${tile.size}px`,
              }}
              draggable={false}
            />
          ))}
        </div>

        {/* Bus Stops Markers */}
        {stops.map((stop) => {
          const pos = projectToPixels(
            Number(stop.latitude),
            Number(stop.longitude),
            dimensions.w,
            dimensions.h
          );

          if (
            pos.x < -30 ||
            pos.x > dimensions.w + 30 ||
            pos.y < -30 ||
            pos.y > dimensions.h + 30
          ) {
            return null;
          }

          const isSelected = selectedEntity?.data?.id === stop.id;

          return (
            <button
              key={stop.id || stop.name}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEntity({ type: 'stop', data: stop });
              }}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -100%)',
              }}
              className="absolute z-10 group cursor-pointer focus:outline-none transition-transform hover:scale-125"
            >
              <div
                className={`p-1.5 rounded-full shadow-md border-2 flex items-center justify-center ${
                  stop.isDropPoint
                    ? 'bg-rose-500 text-white border-white'
                    : 'bg-indigo-600 text-white border-white'
                } ${isSelected ? 'ring-4 ring-indigo-400 scale-125' : ''}`}
              >
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-stone-200">
                {stop.name}
              </span>
            </button>
          );
        })}

        {/* Live Buses Markers (Admin Only) */}
        {isAdmin &&
          liveBuses.map((bus) => {
            const pos = projectToPixels(
              Number(bus.latitude),
              Number(bus.longitude),
              dimensions.w,
              dimensions.h
            );

            if (
              pos.x < -40 ||
              pos.x > dimensions.w + 40 ||
              pos.y < -40 ||
              pos.y > dimensions.h + 40
            ) {
              return null;
            }

            const isSelected = selectedEntity?.data?.busId === bus.busId;

            return (
              <button
                key={bus.busId}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEntity({ type: 'bus', data: bus });
                }}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-20 group cursor-pointer focus:outline-none transition-all duration-700 ease-out"
              >
                <span className="absolute -inset-2 rounded-full bg-emerald-400/50 animate-ping pointer-events-none" />

                <div
                  className={`p-2 bg-emerald-600 text-white rounded-full shadow-xl border-2 border-white flex items-center justify-center ${
                    isSelected ? 'ring-4 ring-emerald-400 scale-125' : ''
                  }`}
                >
                  <Bus className="w-4 h-4" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-white text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-emerald-300">
                  #{bus.busId}
                </div>
              </button>
            );
          })}

        {/* Map Entity Popup */}
        <MapEntityPopup
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
        />

        {/* Map Controls */}
        <MapControls
          onZoomIn={() => setZoom((z) => Math.min(18, z + 1))}
          onZoomOut={() => setZoom((z) => Math.max(5, z - 1))}
          onFitAll={handleFitAll}
        />

        {/* Legend */}
        <MapLegend isAdmin={isAdmin} />
      </div>
    </div>
  );
}
