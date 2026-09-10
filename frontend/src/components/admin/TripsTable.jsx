import { Route as RouteIcon, Clock, ArrowRight, ArrowLeft, Bus, User, Calendar, MoreVertical } from 'lucide-react';
import { getTodayDateString } from '../../services/adminService';
import { useLanguage } from '../../context/useLanguage';
import EmptyState from '../common/EmptyState';

function formatTime(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

export default function TripsTable({
  trips = [],
  searchTerm = '',
  selectedDate = getTodayDateString(),
  onDateChange,
}) {
  const { t, isRtl } = useLanguage();
  const isToday = selectedDate === getTodayDateString();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const filteredTrips = trips.filter((trip) => {
    const term = searchTerm.toLowerCase();
    return (
      trip.routeName?.toLowerCase().includes(term) ||
      trip.driverName?.toLowerCase().includes(term) ||
      trip.busNumber?.toString().includes(term) ||
      trip.status?.toLowerCase().includes(term) ||
      trip.direction?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col">
      {/* Date Filter Bar */}
      <div className="px-4 py-3 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-700">
            {selectedDate ? (
              <>
                {t.trips}:{' '}
                <span className="text-slate-900 font-mono font-bold">
                  {selectedDate} {isToday ? `(${t.today})` : ''}
                </span>
              </>
            ) : (
              <span className="text-slate-900">{t.allDates}</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-600 flex items-center gap-2 font-medium">
            {t.filterDate}
            <input
              type="date"
              value={selectedDate || ''}
              onChange={(e) => onDateChange?.(e.target.value || null)}
              className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono shadow-xs"
            />
          </label>

          {selectedDate !== getTodayDateString() && (
            <button
              type="button"
              onClick={() => onDateChange?.(getTodayDateString())}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              {t.today}
            </button>
          )}

          {selectedDate && (
            <button
              type="button"
              onClick={() => onDateChange?.(null)}
              className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-stone-200 text-xs rounded-lg transition-colors cursor-pointer"
            >
              {t.allDates}
            </button>
          )}
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <EmptyState icon={RouteIcon} title={t.noData} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-stone-50 text-slate-500 uppercase font-bold tracking-wider border-b border-stone-200/80">
              <tr>
                <th className="py-3.5 px-4">{t.route}</th>
                <th className="py-3.5 px-4">{t.direction}</th>
                <th className="py-3.5 px-4">{t.buses.slice(0, -2) || t.buses}</th>
                <th className="py-3.5 px-4">{t.driver}</th>
                <th className="py-3.5 px-4">{t.schedule}</th>
                <th className="py-3.5 px-4">{t.status}</th>
                <th className="py-3.5 px-4 text-right rtl:text-left">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTrips.map((trip) => (
                <tr key={trip.tripId || trip.routeName} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                      <RouteIcon className="w-4 h-4" />
                    </div>
                    <span>{trip.routeName}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-stone-100 text-slate-700 text-[11px] font-mono border border-stone-200 font-medium">
                      {trip.direction || 'Standard'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {trip.busNumber ? (
                      <span className="inline-flex items-center gap-1.5 font-mono font-medium">
                        <Bus className="w-3.5 h-3.5 text-indigo-600" /> #{trip.busNumber}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {trip.driverName ? (
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-sky-600" /> {trip.driverName}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatTime(trip.scheduledStartTime)}</span>
                      <ArrowIcon className="w-3 h-3 text-slate-400" />
                      <span>{formatTime(trip.scheduledArrivalTime)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize shadow-xs">
                      {trip.status || t.active}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right rtl:text-left">
                    <button
                      type="button"
                      title={t.actions}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
