import { Clock, Radio, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

export default function DriverGpsCard({ busId, coordinates, lastSentTime, status, error }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-4">
          <span className="font-bold text-slate-800 flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600" />
            <span>GPS Transmitter</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold font-mono">
            {status || t.active}
          </span>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
            <span className="text-slate-500">{t.assignedBus}:</span>
            <span className="text-indigo-700 font-mono font-bold">
              {busId ? `#${busId}` : 'Auto-Assigned'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
            <span className="text-slate-500">{t.coordinates}:</span>
            <span className="text-slate-800 font-mono font-medium">
              {coordinates?.latitude && coordinates?.longitude
                ? `${Number(coordinates.latitude).toFixed(5)}, ${Number(coordinates.longitude).toFixed(5)}`
                : 'Acquiring GPS...'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-500">{t.lastPing}:</span>
            <span className="text-slate-600 font-mono text-[11px] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{lastSentTime ? new Date(lastSentTime).toLocaleTimeString() : '-'}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
