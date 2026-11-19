import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import {
  X,
  Route as RouteIcon,
  MapPin,
  Clock,
  Maximize2,
  Navigation,
} from 'lucide-react';
import { useRouteMapModal } from '../../../hooks/useRouteMapModal';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function RouteMapModal({
  isOpen,
  onClose,
  route = null,
  routeStops = [],
}) {
  const {
    t,
    mapRef,
    orderedStops,
    routeLineGeoJSON,
    initialCenter,
    activeStopId,
    focusStop,
    fitMapToStops,
  } = useRouteMapModal({ isOpen, route, routeStops });

  if (!isOpen || !route) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <RouteIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-800">{route.name}</h2>
                <span className="font-mono text-[11px] px-2 py-0.5 bg-stone-200/70 text-slate-700 rounded-md font-semibold">
                  {route.code}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {t.routeMapTitle} ({orderedStops.length} {t.stopsCount})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {orderedStops.length > 1 && (
              <button
                type="button"
                onClick={fitMapToStops}
                title="Fit entire route"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body: Map + Ordered Stop Sequence Sidebar */}
        {orderedStops.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <div className="p-3 bg-stone-100 text-slate-400 rounded-2xl">
              <MapPin className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-600">
              {t.noStopsOnRoute}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 flex-1 min-h-[440px] overflow-hidden">
            {/* Interactive Map (2/3 width on desktop) */}
            <div className="md:col-span-2 h-80 md:h-[460px] relative bg-stone-100">
              <Map
                ref={mapRef}
                initialViewState={{
                  latitude: initialCenter.latitude,
                  longitude: initialCenter.longitude,
                  zoom: 13,
                }}
                onLoad={fitMapToStops}
                style={{ width: '100%', height: '100%' }}
                mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
              >
                <NavigationControl position="top-right" />

                {/* Route Line Path */}
                {routeLineGeoJSON && (
                  <Source id="selected-route-line" type="geojson" data={routeLineGeoJSON}>
                    {/* Outer halo for contrast */}
                    <Layer
                      id="selected-route-line-halo"
                      type="line"
                      layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                      paint={{
                        'line-color': '#ffffff',
                        'line-width': 8,
                        'line-opacity': 0.85,
                      }}
                    />
                    {/* Main colored line */}
                    <Layer
                      id="selected-route-line-main"
                      type="line"
                      layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                      paint={{
                        'line-color': '#4f46e5',
                        'line-width': 4.5,
                        'line-opacity': 0.95,
                      }}
                    />
                  </Source>
                )}

                {/* Numbered Stop Markers */}
                {orderedStops.map((stop, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === orderedStops.length - 1 && orderedStops.length > 1;
                  const isActive = activeStopId === stop.stopPointId;

                  const badgeColors = isFirst
                    ? 'bg-emerald-600 border-white text-white'
                    : isLast
                    ? 'bg-rose-600 border-white text-white'
                    : 'bg-indigo-600 border-white text-white';

                  return (
                    <Marker
                      key={stop.stopPointId}
                      latitude={parseFloat(stop.stopPointLatitude)}
                      longitude={parseFloat(stop.stopPointLongitude)}
                      anchor="center"
                      onClick={(e) => {
                        e.originalEvent.stopPropagation();
                        focusStop(stop);
                      }}
                    >
                      <div
                        className="group relative flex flex-col items-center cursor-pointer"
                        title={`${stop.sequenceOrder}. ${stop.stopPointName}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full border-2 shadow-md flex items-center justify-center text-xs font-extrabold transition-transform ${badgeColors} ${
                            isActive ? 'scale-125 ring-4 ring-indigo-400/40' : 'hover:scale-110'
                          }`}
                        >
                          {stop.sequenceOrder}
                        </div>

                        {/* Floating label */}
                        <div
                          className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shadow-sm border transition-all ${
                            isActive
                              ? 'bg-slate-900 text-white border-slate-800'
                              : 'bg-white/95 text-slate-800 border-stone-200'
                          }`}
                        >
                          {stop.stopPointName}
                        </div>
                      </div>
                    </Marker>
                  );
                })}
              </Map>
            </div>

            {/* Ordered Stop Sequence Timeline (1/3 width on desktop) */}
            <div className="border-t md:border-t-0 md:border-l rtl:md:border-l-0 rtl:md:border-r border-stone-200 bg-stone-50/50 flex flex-col max-h-64 md:max-h-[460px]">
              <div className="px-4 py-3 border-b border-stone-200/80 bg-white flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t.stopPoints}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {orderedStops.length} {t.stopsCount}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {orderedStops.map((stop, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === orderedStops.length - 1 && orderedStops.length > 1;
                  const isActive = activeStopId === stop.stopPointId;

                  return (
                    <button
                      key={stop.stopPointId}
                      type="button"
                      onClick={() => focusStop(stop)}
                      className={`w-full text-left rtl:text-right p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        isActive
                          ? 'bg-indigo-50/90 border-indigo-300 shadow-xs'
                          : 'bg-white hover:bg-stone-100/70 border-stone-200/80'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-white shadow-2xs ${
                          isFirst
                            ? 'bg-emerald-600'
                            : isLast
                            ? 'bg-rose-600'
                            : 'bg-indigo-600'
                        }`}
                      >
                        {stop.sequenceOrder}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {stop.stopPointName}
                          </span>
                          {(isFirst || isLast) && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                isFirst
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {isFirst ? t.startPoint : t.endPoint}
                            </span>
                          )}
                        </div>

                        {stop.stopPointAddress && (
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {stop.stopPointAddress}
                          </p>
                        )}

                        {stop.estimatedMinutesFromStart !== null &&
                          stop.estimatedMinutesFromStart !== undefined && (
                            <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-stone-100 px-1.5 py-0.5 rounded">
                              <Clock className="w-2.5 h-2.5 text-slate-400" />
                              <span>
                                +{stop.estimatedMinutesFromStart} {t.minFromStart}
                              </span>
                            </div>
                          )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
