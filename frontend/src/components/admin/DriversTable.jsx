import { User, Award, MoreVertical } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import EmptyState from '../common/EmptyState';

export default function DriversTable({ drivers = [], searchTerm = '' }) {
  const { t } = useLanguage();

  const filteredDrivers = drivers.filter((driver) => {
    const term = searchTerm.toLowerCase();
    return (
      driver.name?.toLowerCase().includes(term) ||
      driver.licenseNumber?.toLowerCase().includes(term) ||
      driver.driverId?.toLowerCase().includes(term)
    );
  });

  if (filteredDrivers.length === 0) {
    return <EmptyState icon={User} title={t.noData} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left rtl:text-right text-xs">
        <thead className="bg-stone-50 text-slate-500 uppercase font-bold tracking-wider border-b border-stone-200/80">
          <tr>
            <th className="py-3.5 px-4">{t.driverName}</th>
            <th className="py-3.5 px-4">{t.licenseNumber}</th>
            <th className="py-3.5 px-4">{t.driverId}</th>
            <th className="py-3.5 px-4 text-right rtl:text-left">{t.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {filteredDrivers.map((driver) => (
            <tr key={driver.driverId || driver.licenseNumber} className="hover:bg-amber-50/30 transition-colors">
              <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2.5">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
                  <User className="w-4 h-4" />
                </div>
                <span>{driver.name}</span>
              </td>
              <td className="py-3.5 px-4 text-slate-700 font-mono">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-semibold text-[11px]">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>{driver.licenseNumber}</span>
                </span>
              </td>
              <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] max-w-[160px] truncate">
                {driver.driverId}
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
