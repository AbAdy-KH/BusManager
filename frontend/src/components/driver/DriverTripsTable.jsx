import { Route as RouteIcon, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

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

export default function DriverTripsTable({ trips = [], loading, dateStr, busId }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl shadow-sm overflow-hidden flex flex-col">
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

      {loading ? (
        <LoadingSpinner />
      ) : trips.length === 0 ? (
        <EmptyState icon={RouteIcon} title={t.noData} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-stone-50 text-slate-500 uppercase font-bold tracking-wider border-b border-stone-200/80">
              <tr>
                <th className="py-3.5 px-4">{t.route}</th>
                <th className="py-3.5 px-4">{t.direction}</th>
                <th className="py-3.5 px-4">{t.buses.slice(0, -2) || t.buses}</th>
                <th className="py-3.5 px-4">{t.schedule}</th>
                <th className="py-3.5 px-4">{t.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {trips.map((trip) => (
                <tr key={trip.tripId || trip.routeName} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                      <RouteIcon className="w-4 h-4" />
                    </div>
                    <span>{trip.routeName}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                      {trip.direction || 'Standard'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono font-medium">
                    #{trip.busNumber || busId}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono text-[11px]">
                    {formatTime(trip.scheduledStartTime)} - {formatTime(trip.scheduledArrivalTime)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                      {trip.status || t.active}
                    </span>
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
