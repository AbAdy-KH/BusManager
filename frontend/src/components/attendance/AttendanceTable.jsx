import { useState } from 'react';
import { useLanguage } from '../../context/useLanguage';
import {
  User,
  Bus,
  Clock,
  Award,
  CheckCircle2,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

function formatAssignmentTime(isoDateStr) {
  if (!isoDateStr) return '-';
  try {
    const d = new Date(isoDateStr);
    return isNaN(d.getTime())
      ? isoDateStr
      : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoDateStr;
  }
}

export default function AttendanceTable({
  assignments = [],
  searchTerm = '',
  onUnassign,
  onOpenAssignModal,
}) {
  const { t } = useLanguage();
  const [deletingId, setDeletingId] = useState(null);

  const filtered = assignments.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.driverName?.toLowerCase().includes(term) ||
      a.licenseNumber?.toLowerCase().includes(term) ||
      a.busNumber?.toString().includes(term) ||
      a.plateNumber?.toLowerCase().includes(term)
    );
  });

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

  if (filtered.length === 0) {
    return (
      <div className="py-14 px-4 text-center flex flex-col items-center justify-center">
        <h3 className="text-sm font-bold text-gray-800">{t.noData}</h3>

        {!searchTerm && onOpenAssignModal && (
          <button
            type="button"
            onClick={onOpenAssignModal}
            className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            {t.assignBus}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left rtl:text-right text-xs">
        <thead className="bg-cream-100/90 text-gray-600 uppercase tracking-wider border-b border-cream-300">
          <tr>
            <th className="py-3 px-4">{t.driver}</th>
            <th className="py-3 px-4">{t.assignedBus}</th>
            <th className="py-3 px-4">{t.assignmentTime}</th>
            <th className="py-3 px-4 text-right rtl:text-left">{t.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-200">
          {filtered.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-cream-50 transition-colors group"
            >
              {/* Driver Info */}
              <td className="py-3.5 px-4 font-semibold text-gray-900">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-sky-100 text-sky-700 rounded-xl">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{item.driverName || 'Driver'}</div>
                  </div>
                </div>
              </td>

              {/* Assigned Bus */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <div>
                    <span className="font-bold text-gray-900 font-mono">
                      {item.busNumber ?? '-'}#
                    </span>
                    {item.plateNumber && (
                      <div className="text-[11px] text-gray-500 font-mono">
                        {item.plateNumber}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              {/* Attendance Time */}
              <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{formatAssignmentTime(item.createdAt)}</span>
                </div>
              </td>

              {/* Actions */}
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
