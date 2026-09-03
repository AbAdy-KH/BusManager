import { useDriverLocationSender } from '../../hooks/useDriverLocationSender';
import { useLanguage } from '../../context/useLanguage';
import { Navigation, Radio, Clock, AlertTriangle } from 'lucide-react';

export default function DriverTrackerBar() {
  const { isDriver, busId, setBusId, coordinates, lastSentTime, status, error } =
    useDriverLocationSender();
  const { t } = useLanguage();

  if (!isDriver) return null;

  return (
    <div className="bg-indigo-950/90 border-b border-indigo-500/30 text-indigo-200 text-xs px-4 py-2.5 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-indigo-400" /> {t.driverGpsActive}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          {/* Bus ID selector */}
          <div className="flex items-center gap-1">
            <span className="text-indigo-400">{t.busNum}:</span>
            <input
              type="number"
              min="1"
              value={busId}
              onChange={(e) => setBusId(Number(e.target.value) || 1)}
              className="w-12 bg-slate-900 border border-indigo-500/40 rounded px-1.5 py-0.5 text-white font-bold text-center focus:outline-none focus:border-indigo-400"
            />
          </div>

          {/* Coordinates */}
          <div className="flex items-center gap-1 bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-500/20 text-indigo-200">
            <Navigation className="w-3 h-3 text-indigo-400" />
            <span>
              {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
            </span>
          </div>

          {/* Last Sent */}
          {lastSentTime && (
            <div className="flex items-center gap-1 text-emerald-300">
              <Clock className="w-3 h-3" />
              <span>{t.lastPing}: {lastSentTime}</span>
            </div>
          )}

          {error && status === 'error' && (
            <div className="flex items-center gap-1 text-rose-300">
              <AlertTriangle className="w-3 h-3" />
              <span className="truncate max-w-[160px]">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
