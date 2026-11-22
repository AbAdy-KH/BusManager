import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import {
  Route as RouteIcon,
  MapPin,
  Clock,
  Maximize2,
  LocateFixed,
  Navigation,
} from 'lucide-react';
import { useDriverRouteMap } from '../../hooks/useDriverRouteMap';
import { formatTime } from '../../utils/dateUtils';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function DriverRouteMap({
  trip = null,
  routeStops = [],
  loadingRouteStops = false,
  driverCoordinates = null,
  busId,
}) {
  const {
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
  } = useDriverRouteMap({
    trip,
    routeStops,
    driverCoordinates,
  });

  if (!trip) {
    return (
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-sm p-8 text-center flex flex-col items-center gap-2">
        <div className="p-3 bg-stone-100 text-slate-400 rounded-2xl">
          <RouteIcon className="w-6 h-6" />
        </div>
        <p className="text-xs font-medium text-slate-600">
          {t.noActiveTripSelected}
        </p>
      </div>
    );
  }

  const isInProgress = (trip.status || '').toLowerCase() === 'inprogress';
  const dirDisplay =
    (trip.direction || '').toString().toLowerCase() === 'outbound' || trip.direction === '0'
      ? t.outbound
      : t.inbound;

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Top Status & Controls Header */}
      <div className="px-4 py-3 border-b border-stone-200/80 bg-stone-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl border ${
              isInProgress
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-indigo-50 text-indigo-600 border-indigo-200'
            }`}
          >
            <RouteIcon className="w-4 h-4" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {trip.routeName || t.route}
              </h2>

              {isInProgress ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {t.statusInProgress}
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  {t.previewTripMapTitle}
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
              <span>{dirDisplay}</span>
              <span>•</span>
              <span className="font-mono">
                {formatTime(trip.scheduledStartTime)} - {formatTime(trip.scheduledArrivalTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Camera Action Buttons */}
        <div className="flex items-center gap-2">
          {driverCoordinates?.lat && driverCoordinates?.lng && (
            <button
              type="button"
              onClick={centerOnDriverBus}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <LocateFixed className="w-3.5 h-3.5" />
              <span>{t.centerOnBus}</span>
            </button>
          )}

          {orderedStops.length > 1 && (
            <button
              type="button"
              onClick={fitMapToStops}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{t.fitRoute}</span>
            </button>
          )}
        </div>
      </div>

      {/* Map + Stops Split Layout */}
      {!loadingRouteStops && orderedStops.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
          <MapPin className="w-5 h-5 text-slate-400" />
          <span>{trip.routeId ? t.noStopsOnRoute : t.noRouteAssignedToTrip}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 min-h-[380px]">
          {/* Live Interactive Map (2/3 width on desktop) */}
          <div className="md:col-span-2 h-80 md:h-[400px] relative bg-stone-100">
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

              {/* Connected Route Line */}
              {routeLineGeoJSON && (
                <Source id="driver-route-line" type="geojson" data={routeLineGeoJSON}>
                  <Layer
                    id="driver-route-line-halo"
                    type="line"
                    layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                    paint={{
                      'line-color': '#ffffff',
                      'line-width': 8,
                      'line-opacity': 0.85,
                    }}
                  />
                  <Layer
                    id="driver-route-line-main"
                    type="line"
                    layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                    paint={{
                      'line-color': isInProgress ? '#059669' : '#4f46e5',
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
                const isClosest = closestStopId === stop.stopPointId;

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
                      className="flex flex-col items-center cursor-pointer"
                      title={`${stop.sequenceOrder}. ${stop.stopPointName}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full border-2 shadow-md flex items-center justify-center text-xs font-extrabold transition-transform ${badgeColors} ${
                          isActive || isClosest
                            ? 'scale-125 ring-4 ring-amber-400/50'
                            : 'hover:scale-110'
                        }`}
                      >
                        {stop.sequenceOrder}
                      </div>
                      <div
                        className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shadow-sm border ${
                          isActive || isClosest
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

              {/* Driver's Own Live GPS Bus Marker */}
              {driverCoordinates?.lat && driverCoordinates?.lng && (
                <Marker
                  latitude={Number(driverCoordinates.lat)}
                  longitude={Number(driverCoordinates.lng)}
                  anchor="center"
                >
                  <div className="relative flex flex-col items-center">
                    <span className="absolute w-10 h-10 rounded-full bg-sky-500/30 animate-ping" />
                    <div
                      className="relative z-10 w-8 h-8 rounded-full bg-sky-600 border-2 border-white shadow-lg flex items-center justify-center text-base"
                      title={`${t.busNumber} #${busId || ''}`}
                    >
                      🚌
                    </div>
                  </div>
                </Marker>
              )}
            </Map>
          </div>

          {/* Ordered Stop Sequence Sidebar (1/3 width on desktop) */}
          <div className="border-t md:border-t-0 md:border-l rtl:md:border-l-0 rtl:md:border-r border-stone-200 bg-stone-50/40 flex flex-col max-h-64 md:max-h-[400px]">
            <div className="px-4 py-2.5 border-b border-stone-200/80 bg-white flex items-center justify-between">
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
                const isClosest = closestStopId === stop.stopPointId;

                return (
                  <button
                    key={stop.stopPointId}
                    type="button"
                    onClick={() => focusStop(stop)}
                    className={`w-full text-left rtl:text-right p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                      isActive || isClosest
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
                        {isClosest ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                            {t.closestStop}
                          </span>
                        ) : (
                          (isFirst || isLast) && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                isFirst
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {isFirst ? t.startPoint : t.endPoint}
                            </span>
                          )
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
  );
}
