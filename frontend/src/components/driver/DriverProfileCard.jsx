import { User, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

export default function DriverProfileCard({ user }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-4">
          <span className="font-bold text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>{t.driverInfo}</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold">
            {t.driver}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
            <span className="text-slate-500">{t.driverName}:</span>
            <span className="text-slate-800 font-bold">{user?.name || user?.email}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
            <span className="text-slate-500">{t.email}:</span>
            <span className="text-slate-700 font-mono font-medium">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-500">{t.status}:</span>
            <span className="text-emerald-700 font-bold inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.active}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
