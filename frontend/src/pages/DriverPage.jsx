import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useLanguage } from '../context/useLanguage';
import { useDriverLocationSender } from '../hooks/useDriverLocationSender';
import { fetchTrips, getTodayDateString } from '../services/adminService';
import {
  Bus,
  User,
  Radio,
  Clock,
  Navigation,
  Route as RouteIcon,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

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

export default function DriverPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { busId, setBusId, coordinates, lastSentTime, status, error } =
    useDriverLocationSender();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadDriverTrips() {
      try {
        const allTrips = await fetchTrips(getTodayDateString());
        if (ignore) return;
        // Filter trips assigned to this driver name, or show today's trips
        const driverTrips = (allTrips || []).filter(
          (trip) =>
            !trip.driverName ||
            trip.driverName?.toLowerCase() === user?.name?.toLowerCase() ||
            trip.driverName?.toLowerCase() === user?.email?.toLowerCase()
        );
        setTrips(driverTrips.length > 0 ? driverTrips : allTrips || []);
      } catch {
        // ignore
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadDriverTrips();

    return () => {
      ignore = true;
    };
  }, [user]);

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <span>{t.driverDashboard}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">{t.driverGpsDesc}</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>GPS: {t.active}</span>
          </span>
        </div>
      </div>

      {/* Grid: Driver Profile & GPS Transmitter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Driver Info Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-400" /> {t.driverInfo}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px]">
                {t.driver}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">{t.driverName}:</span>
                <span className="text-white font-semibold">{user?.name || user?.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">{t.email}:</span>
                <span className="text-slate-300 font-mono">{user?.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">{t.status}:</span>
                <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t.active}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* GPS Live Transmission Card */}
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-indigo-300 text-xs font-medium mb-3">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                {t.driverGpsActive}
              </span>
              <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                10s Ping
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Bus number selection */}
              <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/80">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Bus className="w-4 h-4 text-indigo-400" /> {t.assignedBus}:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono text-[11px]">{t.busNum}</span>
                  <input
                    type="number"
                    min="1"
                    value={busId}
                    onChange={(e) => setBusId(Number(e.target.value) || 1)}
                    className="w-16 bg-slate-800 border border-indigo-500/40 rounded px-2 py-1 text-white font-bold text-center focus:outline-none focus:border-indigo-400 font-mono"
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/80 font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-indigo-400" /> {t.coordinates}:
                </span>
                <span className="text-white font-bold text-[11px]">
                  {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
                </span>
              </div>

              {/* Last sent & error */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <div className="flex items-center gap-1 text-emerald-300">
                  <Clock className="w-3 h-3" />
                  <span>{t.lastPing}: {lastSentTime || '-'}</span>
                </div>

                {error && status === 'error' && (
                  <div className="flex items-center gap-1 text-rose-400 text-[10px]">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Schedule / Assigned Trips for Today */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RouteIcon className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-white tracking-wide uppercase">
              {t.trips} ({t.today})
            </h2>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>{getTodayDateString()}</span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
            <span className="text-xs">{t.signingIn}</span>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            {t.noData}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
                <tr>
                  <th className="py-3 px-4">{t.route}</th>
                  <th className="py-3 px-4">{t.direction}</th>
                  <th className="py-3 px-4">{t.buses.slice(0, -2) || t.buses}</th>
                  <th className="py-3 px-4">{t.schedule}</th>
                  <th className="py-3 px-4">{t.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {trips.map((trip) => (
                  <tr key={trip.tripId || trip.routeName} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md">
                        <RouteIcon className="w-4 h-4" />
                      </div>
                      <span>{trip.routeName}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                      {trip.direction || 'Standard'}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      #{trip.busNumber || busId}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                      {formatTime(trip.scheduledStartTime)} - {formatTime(trip.scheduledArrivalTime)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
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
    </div>
  );
}
