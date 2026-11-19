import { Bus } from 'lucide-react';
import { useLanguage } from '../../../context/useLanguage';
import { useTableSearch } from '../../../hooks/useTableSearch';
import TableHeader from '../../common/TableHeader';
import RowActions from '../../common/RowActions';
import StatusBadge from '../../common/StatusBadge';

const BUS_SEARCH_FIELDS = [
  (b) => b.number,
  (b) => b.plateNumber,
  (b) => b.capacity,
];

export default function BusesTable({
  buses = [],
  searchTerm = '',
  onAddBus,
  onEditBus,
  onDeleteBus,
}) {
  const { t } = useLanguage();
  const filteredBuses = useTableSearch(buses, searchTerm, BUS_SEARCH_FIELDS);

  return (
    <div className="overflow-x-auto">
      <TableHeader
        title={t.buses}
        actionLabel={t.addBus}
        onAction={onAddBus}
      />

      {filteredBuses.length > 0 && (
        <table className="w-full text-left rtl:text-right text-xs">
          <thead className="bg-stone-50 text-slate-500 uppercase font-bold tracking-wider border-b border-stone-200/80">
            <tr>
              <th className="py-3.5 px-4">{t.busNumber}</th>
              <th className="py-3.5 px-4">{t.plateNumber}</th>
              <th className="py-3.5 px-4">{t.capacity}</th>
              <th className="py-3.5 px-4">{t.status}</th>
              <th className="py-3.5 px-4 text-right rtl:text-left">{t.actions}</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {filteredBuses.map((bus) => (
              <tr key={bus.id || bus.number} className="hover:bg-amber-50/30 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                    <Bus className="w-4 h-4" />
                  </div>
                  <span>{t.busNumber} #{bus.number}</span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-mono font-medium">
                  {bus.plateNumber}
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  <span className="font-semibold text-slate-800">{bus.capacity}</span> {t.seats}
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge
                    isActive={bus.isActive}
                    activeText={t.active}
                    inactiveText={t.inactive}
                  />
                </td>
                <td className="py-3.5 px-4 text-right rtl:text-left">
                  <RowActions
                    editTitle={t.editBus}
                    deleteTitle={t.deleteBus}
                    onEdit={onEditBus ? () => onEditBus(bus) : null}
                    onDelete={onDeleteBus ? () => onDeleteBus(bus.id) : null}
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
