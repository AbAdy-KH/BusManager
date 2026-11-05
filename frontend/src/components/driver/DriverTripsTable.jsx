import { useState } from 'react';
import { Route as RouteIcon, Calendar, Clock, Play, Square, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

function formatTime(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

export default function DriverTripsTable({
  trips = [],
  loading,
  dateStr,
  busId,
  onStartTrip,
  onEndTrip,
  actionLoadingId,
}) {
  const { t } = useLanguage();

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'inprogress') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
          {t.statusInProgress || 'In Progress'}
        </span>
      );
    }
    if (s === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          {t.statusCompleted || 'Completed'}
        </span>
      );
    }
    if (s === 'cancelled') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
          {t.statusCancelled || 'Cancelled'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
        {t.statusScheduled || 'Scheduled'}
      </span>
    );
  };

  const formatDirection = (direction) => {
    if (!direction) return 'Standard';
    const d = direction.toString().toLowerCase();
    if (d === 'outbound' || d === '0') return t.outbound || 'Outbound';
    if (d === 'inbound' || d === '1') return t.inbound || 'Inbound';
    return direction;
  };

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-stone-200/80 bg-stone-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <RouteIcon className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
            {t.trips} ({t.today})
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{dateStr}</span>
        </div>
      </div>

      {/* Content */}
      {!loading && trips.length === 0 && (
        <div className="p-8 text-center text-slate-500 text-xs">
          {t.noData || 'No trips assigned for today.'}
        </div>
      )}

      {!loading && trips.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-stone-50 text-slate-500 uppercase font-bold tracking-wider border-b border-stone-200/80">
              <tr>
                <th className="py-3.5 px-4">{t.route}</th>
                <th className="py-3.5 px-4">{t.direction}</th>
                <th className="py-3.5 px-4">{t.buses.slice(0, -2) || t.buses}</th>
                <th className="py-3.5 px-4">{t.schedule}</th>
                <th className="py-3.5 px-4">{t.status}</th>
                <th className="py-3.5 px-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {trips.map((trip) => {
                const tripId = trip.tripId || trip.id;
                const statusNormalized = (trip.status || '').toLowerCase();
                const isScheduled = statusNormalized === 'scheduled' || !trip.status;
                const isInProgress = statusNormalized === 'inprogress';
                const isCompleted = statusNormalized === 'completed';
                const isCurrentActionLoading = actionLoadingId === tripId;

                return (
                  <tr key={tripId || trip.routeName} className="hover:bg-amber-50/30 transition-colors">
                    {/* Route */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                        <RouteIcon className="w-4 h-4" />
                      </div>
                      <span>{trip.routeName || '-'}</span>
                    </td>

                    {/* Direction */}
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 font-medium">
                        {formatDirection(trip.direction)}
                      </span>
                    </td>

                    {/* Bus # */}
                    <td className="py-3.5 px-4 text-slate-700 font-mono font-medium">
                      #{trip.busNumber || busId || '-'}
                    </td>

                    {/* Schedule */}
                    <td className="py-3.5 px-4 text-slate-700 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatTime(trip.scheduledStartTime)} - {formatTime(trip.scheduledArrivalTime)}</span>
                      </div>
                      {(trip.actualStartTime || trip.actualArrivalTime) && (
                        <div className="mt-1 text-[10px] text-emerald-600 font-sans">
                          {trip.actualStartTime && (
                            <span>{t.actualStartTime || 'Actual Start'}: {formatTime(trip.actualStartTime)} </span>
                          )}
                          {trip.actualArrivalTime && (
                            <span>| {t.actualArrivalTime || 'Actual Arrival'}: {formatTime(trip.actualArrivalTime)}</span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(trip.status)}
                    </td>

                    {/* Actions: Start & End buttons */}
                    <td className="py-3.5 px-4 text-center">
                      {isCompleted ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{t.statusCompleted || 'Completed'}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 justify-center">
                          {/* Start Trip Button */}
                          <button
                            type="button"
                            disabled={!isScheduled || isCurrentActionLoading}
                            onClick={() => onStartTrip?.(tripId)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors shadow-xs ${
                              isScheduled && !isCurrentActionLoading
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95'
                                : 'bg-stone-100 text-slate-400 border border-stone-200 cursor-not-allowed opacity-60'
                            }`}
                            title={isScheduled ? t.startTrip : undefined}
                          >
                            {isCurrentActionLoading && isScheduled ? (
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current" />
                            )}
                            <span>{isCurrentActionLoading && isScheduled ? (t.startingTrip || 'Starting...') : (t.startTrip || 'Start Trip')}</span>
                          </button>

                          {/* End / Arrive Button */}
                          <button
                            type="button"
                            disabled={!isInProgress || isCurrentActionLoading}
                            onClick={() => onEndTrip?.(tripId)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors shadow-xs ${
                              isInProgress && !isCurrentActionLoading
                                ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer active:scale-95 animate-pulse-subtle'
                                : 'bg-stone-100 text-slate-400 border border-stone-200 cursor-not-allowed opacity-60'
                            }`}
                            title={isInProgress ? t.endTrip : undefined}
                          >
                            {isCurrentActionLoading && isInProgress ? (
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <Square className="w-3.5 h-3.5 fill-current" />
                            )}
                            <span>{isCurrentActionLoading && isInProgress ? (t.endingTrip || 'Ending...') : (t.endTrip || 'End Trip')}</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
