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
      </div>
    </div>
  );
}
