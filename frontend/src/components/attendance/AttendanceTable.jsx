import { useState } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { useTableSearch } from '../../hooks/useTableSearch';
import { formatTime } from '../../utils/dateUtils';
import { User, Clock, Trash2 } from 'lucide-react';

const ATTENDANCE_SEARCH_FIELDS = [
  (a) => a.driverName,
  (a) => a.licenseNumber,
  (a) => a.busNumber,
  (a) => a.plateNumber,
];

export default function AttendanceTable({
  assignments = [],
  searchTerm = '',
  onUnassign,
}) {
  const { t } = useLanguage();
  const [deletingId, setDeletingId] = useState(null);

  const filtered = useTableSearch(assignments, searchTerm, ATTENDANCE_SEARCH_FIELDS);

  const handleDeleteClick = async (id) => {
    if (window.confirm(t.unassignConfirm)) {
      setDeletingId(id);
      try {
        await onUnassign(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left rtl:text-right text-xs">
        <thead className="bg-stone-50 text-slate-500 uppercase tracking-wider border-b border-stone-200/80">
          <tr>
            <th className="py-3 px-4">{t.driver}</th>
            <th className="py-3 px-4">{t.assignedBus}</th>
            <th className="py-3 px-4">{t.assignmentTime}</th>
            <th className="py-3 px-4 text-right rtl:text-left">{t.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {filtered.map((item) => (
            <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
              <td className="py-3.5 px-4 font-semibold text-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-800">{item.driverName || 'Driver'}</div>
                </div>
              </td>

              <td className="py-3.5 px-4">
                <span className="font-bold text-slate-800 font-mono">
                  #{item.busNumber ?? '-'}
                </span>
                {item.plateNumber && (
                  <div className="text-[11px] text-slate-500 font-mono">
                    {item.plateNumber}
                  </div>
                )}
              </td>

              <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatTime(item.createdAt)}</span>
                </div>
              </td>

              <td className="py-3.5 px-4 text-right rtl:text-left">
                <button
                  type="button"
                  onClick={() => handleDeleteClick(item.id)}
                  disabled={deletingId === item.id}
                  title={t.unassign}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.unassign}</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
