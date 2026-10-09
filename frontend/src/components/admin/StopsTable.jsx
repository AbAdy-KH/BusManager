import { MapPin, Pencil, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

export default function StopsTable({
  stops = [],
  searchTerm = '',
  onAddStop,
  onEditStop,
  onDeleteStop,
}) {
  const { t } = useLanguage();

  const filteredStops = stops.filter((stop) => {
    const term = searchTerm.toLowerCase();
    return (
      stop.name?.toLowerCase().includes(term) ||
      stop.address?.toLowerCase().includes(term) ||
      stop.id?.toLowerCase().includes(term)
    );
  });

  if (filteredStops.length === 0) {
    return (
      <div>
        <div className="px-4 py-3 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <h2 className="text-sm font-medium text-slate-600">{t.stops}</h2>
          {onAddStop && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs ml-2 rtl:mr-2 rtl:ml-0"
              onClick={onAddStop}
            >
              {t.addStop}
            </button>
          )}
        </div>
        <EmptyState icon={MapPin} title={t.noData} />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="px-4 py-3 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <h2 className="text-sm font-medium text-slate-600">{t.stops}</h2>
        {onAddStop && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs ml-2 rtl:mr-2 rtl:ml-0"
            onClick={onAddStop}
          >
            {t.addStop}
          </button>
        )}
      </div>

      <table className="w-full text-left rtl:text-right text-xs">
        <thead className="bg-stone-50 text-slate-500 uppercase font-bold tracking-wider border-b border-stone-200/80">
          <tr>
            <th className="py-3.5 px-4">{t.stopName}</th>
            <th className="py-3.5 px-4">{t.address}</th>
            <th className="py-3.5 px-4">{t.coordinates}</th>
            <th className="py-3.5 px-4">{t.type}</th>
            <th className="py-3.5 px-4">{t.status}</th>
            <th className="py-3.5 px-4 text-right rtl:text-left">{t.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {filteredStops.map((stop) => (
            <tr key={stop.id || stop.name} className="hover:bg-amber-50/30 transition-colors">
              <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    stop.isDropPoint
                      ? 'bg-rose-50 text-rose-600 border-rose-100'
                      : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <span>{stop.name}</span>
              </td>
              <td className="py-3.5 px-4 text-slate-600">
                {stop.address || <span className="text-slate-400 italic">-</span>}
              </td>
              <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                {Number(stop.latitude).toFixed(5)}, {Number(stop.longitude).toFixed(5)}
              </td>
              <td className="py-3.5 px-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${
                    stop.isDropPoint
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}
                >
                  {stop.isDropPoint ? t.dropPoint : t.pickupPoint}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <StatusBadge status={stop.isActive} type="boolean" />
              </td>
              <td className="py-3.5 px-4 text-right rtl:text-left space-x-2">
                {onEditStop && (
                  <button
                    type="button"
                    title={t.editStop}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
                    onClick={() => onEditStop(stop)}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                {onDeleteStop && (
                  <button
                    type="button"
                    title={t.deleteStop}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    onClick={() => onDeleteStop(stop.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
