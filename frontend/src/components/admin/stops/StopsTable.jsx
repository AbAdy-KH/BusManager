import { MapPin } from 'lucide-react';
import { useLanguage } from '../../../context/useLanguage';
import { useTableSearch } from '../../../hooks/useTableSearch';
import TableHeader from '../../common/TableHeader';
import RowActions from '../../common/RowActions';
import StatusBadge from '../../common/StatusBadge';

const STOP_SEARCH_FIELDS = [(s) => s.name, (s) => s.address, (s) => s.id];

export default function StopsTable({
  stops = [],
  searchTerm = '',
  onAddStop,
  onEditStop,
  onDeleteStop,
}) {
  const { t } = useLanguage();
  const filteredStops = useTableSearch(stops, searchTerm, STOP_SEARCH_FIELDS);

  return (
    <div className="overflow-x-auto">
      <TableHeader
        title={t.stops}
        actionLabel={t.addStop}
        onAction={onAddStop}
      />

      {filteredStops.length > 0 && (
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
                  <StatusBadge
                    isActive={stop.isActive}
                    activeText={t.active}
                    inactiveText={t.inactive}
                  />
                </td>
                <td className="py-3.5 px-4 text-right rtl:text-left">
                  <RowActions
                    editTitle={t.editStop}
                    deleteTitle={t.deleteStop}
                    onEdit={onEditStop ? () => onEditStop(stop) : null}
                    onDelete={onDeleteStop ? () => onDeleteStop(stop.id) : null}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
