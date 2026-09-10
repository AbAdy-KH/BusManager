import { useLanguage } from '../../context/useLanguage';
import { Users, UserCheck, UserX, Bus, Percent } from 'lucide-react';

export default function AttendanceStats({
  totalDriversCount = 0,
  assignedDriversCount = 0,
  unassignedDriversCount = 0,
  totalBusesCount = 0,
  assignedBusesCount = 0,
}) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">

      {/* Attended / Assigned Today */}
      <div className="p-4 rounded-2xl border bg-white shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span>{t.assignedToday}</span>
          <div className="p-1.5 rounded-lg">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black">{assignedDriversCount}</span>
            <span className="text-[11px] font-medium">/ {totalDriversCount}</span>
          </div>
        </div>
      </div>

      {/* Buses in Service */}
      <div className="p-4 rounded-2xl bg-white border border-cream-300 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
          <span>{t.busesInService}</span>
          <div className="p-1.5 rounded-lg">
            <Bus className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-gray-900">{assignedBusesCount}</span>
          <span className="text-[11px] text-gray-500">
            / {totalBusesCount}
          </span>
        </div>
      </div>
    </div>
  );
}
