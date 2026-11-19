import { Route as RouteIcon } from 'lucide-react';
import { useLanguage } from '../../../context/useLanguage';
import { useTableSearch } from '../../../hooks/useTableSearch';
import TableHeader from '../../common/TableHeader';
import RowActions from '../../common/RowActions';

const ROUTE_SEARCH_FIELDS = [(r) => r.name, (r) => r.code];

export default function RoutesTable({
  routes = [],
  searchTerm = '',
  onAddRoute,
  onEditRoute,
  onDeleteRoute,
}) {
  const { t } = useLanguage();
  const filteredRoutes = useTableSearch(routes, searchTerm, ROUTE_SEARCH_FIELDS);

  return (
    <div className="overflow-x-auto">
      <TableHeader
        title={t.routes}
        actionLabel={t.addRoute}
        onAction={onAddRoute}
      />

      {filteredRoutes.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          {t.noData || 'No routes found.'}
        </div>
      ) : (
        <table className="w-full text-left rtl:text-right text-xs">
          <thead className="bg-stone-50 text-slate-500 uppercase font-bold tracking-wider border-b border-stone-200/80">
            <tr>
              <th className="py-3.5 px-4">{t.routeName}</th>
              <th className="py-3.5 px-4">{t.routeCode}</th>
              <th className="py-3.5 px-4 text-right rtl:text-left">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredRoutes.map((route) => (
              <tr key={route.id || route.code} className="hover:bg-amber-50/30 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                    <RouteIcon className="w-4 h-4" />
                  </div>
                  <span>{route.name}</span>
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  <span className="font-mono text-xs px-2.5 py-1 bg-stone-100 text-slate-700 rounded-md border border-stone-200">
                    {route.code}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right rtl:text-left">
                  <RowActions
                    editTitle={t.editRoute}
                    deleteTitle={t.deleteRoute}
                    onEdit={onEditRoute ? () => onEditRoute(route) : null}
                    onDelete={onDeleteRoute ? () => onDeleteRoute(route.id) : null}
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
