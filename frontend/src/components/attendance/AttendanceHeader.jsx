import { Calendar, Plus } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import { getTodayDateString } from '../../services/adminService';

export default function AttendanceHeader({
  selectedDate,
  isToday,
  onDateChange,
  onOpenAssignModal,
}) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {t.busDriverTitle}
        </h1>
      </div>

      {/* Date Controls & Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Date Picker */}
        <div className="flex items-center gap-1.5 bg-white border border-stone-200/90 rounded-xl px-2.5 py-1.5 shadow-2xs">
          <Calendar className="w-4 h-4 text-sky-600" />
          <input
            type="date"
            value={selectedDate || ''}
            onChange={(e) => onDateChange?.(e.target.value)}
            className="text-xs font-mono text-slate-800 bg-transparent focus:outline-none cursor-pointer"
          />
        </div>

        {!isToday && (
          <button
            type="button"
            onClick={() => onDateChange?.(getTodayDateString())}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {t.today}
          </button>
        )}

        <button
          type="button"
          onClick={() => onOpenAssignModal?.('')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.assignBus}</span>
        </button>
      </div>
    </div>
  );
}
