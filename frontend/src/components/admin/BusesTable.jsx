import { Bus, MoreVertical } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

export default function BusesTable({ buses = [], searchTerm = '' }) {
  const { t } = useLanguage();

  const filteredBuses = buses.filter((bus) => {
    const term = searchTerm.toLowerCase();
    return (
      bus.number?.toString().includes(term) ||
      bus.plateNumber?.toLowerCase().includes(term) ||
      bus.capacity?.toString().includes(term)
    );
  });

  if (filteredBuses.length === 0) {
    return <EmptyState icon={Bus} title={t.noData} />;
  }

  return (
    <div className="overflow-x-auto">
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
                <StatusBadge status={bus.isActive} type="boolean" />
              </td>
              <td className="py-3.5 px-4 text-right rtl:text-left">
                <button
                  type="button"
                  title={t.actions}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
