import { Route as RouteIcon, Clock, ArrowRight, Bus, User, Calendar, MoreVertical } from 'lucide-react';
import { getTodayDateString } from '../../services/adminService';

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
  const isToday = selectedDate === getTodayDateString();

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
      <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-300">
            {selectedDate ? (
              <>
                Showing Trips for:{' '}
                <span className="text-white font-mono font-bold">
                  {selectedDate} {isToday ? '(Today)' : ''}
                </span>
              </>
            ) : (
              <span className="text-white">Showing All Scheduled Trips (All Dates)</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-400 flex items-center gap-1.5 font-medium">
            Filter Date:
            <input
              type="date"
              value={selectedDate || ''}
              onChange={(e) => onDateChange?.(e.target.value || null)}
              className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </label>

          {selectedDate !== getTodayDateString() && (
            <button
              type="button"
              onClick={() => onDateChange?.(getTodayDateString())}
              className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
            >
              Reset Today
            </button>
          )}

          {selectedDate && (
            <button
              type="button"
              onClick={() => onDateChange?.(null)}
              className="px-2 py-1 text-slate-400 hover:text-white text-[11px] rounded transition-colors cursor-pointer"
            >
              All Dates
            </button>
          )}
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-xs">
          {searchTerm
            ? 'No trips match your search filter.'
            : selectedDate
            ? `No trips scheduled for ${selectedDate}.`
            : 'No trips scheduled in the database.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Bus</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTrips.map((trip) => (
                <tr key={trip.tripId || trip.routeName} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md">
                      <RouteIcon className="w-4 h-4" />
                    </div>
                    <span>{trip.routeName}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
                      {trip.direction || 'Standard'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {trip.busNumber ? (
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Bus className="w-3.5 h-3.5 text-indigo-400" /> Bus #{trip.busNumber}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {trip.driverName ? (
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-blue-400" /> {trip.driverName}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formatTime(trip.scheduledStartTime)}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span>{formatTime(trip.scheduledArrivalTime)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 capitalize">
                      {trip.status || 'Scheduled'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      title="Options (Future CRUD)"
                      className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
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
