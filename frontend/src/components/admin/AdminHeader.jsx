import { Link } from 'react-router-dom';
import { Radio, RefreshCw, ClipboardList } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

export default function AdminHeader({ isAdmin, hubStatus, onRefresh, loading }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
          <span>{t.adminDashboard}</span>
          {isAdmin && hubStatus === 'connected' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono shadow-xs">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
              <span>{t.active}</span>
            </span>
          )}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {t.appName} &bull; Fleet control & real-time telemetry
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/admin/attendance"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <ClipboardList className="w-3.5 h-3.5 text-sky-600" />
          <span>{t.busDriverShort}</span>
        </Link>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 text-slate-700 border border-stone-200 text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
          <span>{t.refresh}</span>
        </button>
      </div>
    </div>
  );
}
