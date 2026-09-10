import { User } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

export default function DriverHeader() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200/80 pb-4">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
          <div className="p-2 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
            <User className="w-5 h-5" />
          </div>
          <span>{t.driverDashboard}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">{t.driverGpsDesc}</p>
      </div>

      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>GPS: {t.active}</span>
        </span>
      </div>
    </div>
  );
}
