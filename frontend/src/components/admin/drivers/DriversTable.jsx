import { User, Award } from 'lucide-react';
import { useLanguage } from '../../../context/useLanguage';
import { useTableSearch } from '../../../hooks/useTableSearch';
import TableHeader from '../../common/TableHeader';
import RowActions from '../../common/RowActions';

const DRIVER_SEARCH_FIELDS = [
  (d) => d.name,
  (d) => d.licenseNumber,
  (d) => d.driverId,
];

export default function DriversTable({
  drivers = [],
  searchTerm = '',
  onAddDriver,
  onEditDriver,
  onDeleteDriver,
}) {
  const { t } = useLanguage();
  const filteredDrivers = useTableSearch(drivers, searchTerm, DRIVER_SEARCH_FIELDS);

  return (
    <div className="overflow-x-auto">
      <TableHeader
        title={t.drivers}
        actionLabel={t.addDriver}
        onAction={onAddDriver}
      />

      {filteredDrivers.length > 0 && (
        <table className="w-full text-left rtl:text-right text-xs">
          <thead className="bg-stone-50 text-slate-500 uppercase font-bold tracking-wider border-b border-stone-200/80">
            <tr>
              <th className="py-3.5 px-4">{t.driverName}</th>
              <th className="py-3.5 px-4">{t.licenseNumber}</th>
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
                <td className="py-3.5 px-4 text-right rtl:text-left">
                  <RowActions
                    editTitle={t.editDriver}
                    deleteTitle={t.deleteDriver}
                    onEdit={onEditDriver ? () => onEditDriver(driver) : null}
                    onDelete={onDeleteDriver ? () => onDeleteDriver(driver.driverId) : null}
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
