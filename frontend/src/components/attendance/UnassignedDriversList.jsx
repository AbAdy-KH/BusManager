import { useLanguage } from '../../context/useLanguage';
import { User, Plus, Award, CheckCircle2 } from 'lucide-react';

export default function UnassignedDriversList({
  unassignedDrivers = [],
  onQuickAssign,
}) {
  const { t } = useLanguage();

  if (unassignedDrivers.length === 0) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-emerald-900">{t.allDriversAttended}</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-cream-300 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
            <span>{t.unassignedToday}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
              {unassignedDrivers.length}
            </span>
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {unassignedDrivers.map((driver) => (
          <div
            key={driver.driverId}
            className="p-3 bg-cream-50 hover:bg-cream-100 border border-cream-200 rounded-xl flex items-center justify-between gap-2 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-gray-900 truncate">
                  {driver.name}
                </div>
                <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-600" />
                  <span className="truncate">{driver.licenseNumber}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onQuickAssign(driver.driverId)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[11px] font-semibold transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              <span>{t.assignBus}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
