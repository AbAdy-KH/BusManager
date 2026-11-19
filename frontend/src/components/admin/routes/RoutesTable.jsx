import { useMemo } from 'react';
import { Route as RouteIcon, MapPin, Map as MapIcon } from 'lucide-react';
import { useLanguage } from '../../../context/useLanguage';
import { useTableSearch } from '../../../hooks/useTableSearch';
import TableHeader from '../../common/TableHeader';
import RowActions from '../../common/RowActions';

const ROUTE_SEARCH_FIELDS = [(r) => r.name, (r) => r.code];

export default function RoutesTable({
  routes = [],
  routeStops = [],
  searchTerm = '',
  onViewRouteMap,
  onAddRoute,
  onEditRoute,
  onDeleteRoute,
}) {
  const { t } = useLanguage();
  const filteredRoutes = useTableSearch(routes, searchTerm, ROUTE_SEARCH_FIELDS);

  const stopsCountByRoute = useMemo(() => {
    const counts = {};
    routeStops.forEach((rs) => {
      if (rs.routeId) {
        counts[rs.routeId] = (counts[rs.routeId] || 0) + 1;
      }
    });
    return counts;
  }, [routeStops]);

  return (
    <div className="overflow-x-auto">
      <TableHeader
        title={t.routes}
        actionLabel={t.addRoute}
        onAction={onAddRoute}
      >
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          — {t.clickRouteToViewMap}
        </span>
      </TableHeader>

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
              <th className="py-3.5 px-4">{t.stopsCount}</th>
              <th className="py-3.5 px-4 text-right rtl:text-left">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredRoutes.map((route) => {
              const count = stopsCountByRoute[route.id] || 0;
              return (
                <tr
                  key={route.id || route.code}
                  onClick={() => onViewRouteMap?.(route)}
                  className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <RouteIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="group-hover:text-indigo-700 transition-colors">
                        {route.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="font-mono text-xs px-2.5 py-1 bg-stone-100 text-slate-700 rounded-md border border-stone-200">
                      {route.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {count} {t.stopPoints}
                      </span>
                    </span>
                  </td>
                  <td
                    className="py-3.5 px-4 text-right rtl:text-left"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="inline-flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title={t.viewRouteMap}
                        onClick={() => onViewRouteMap?.(route)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-colors cursor-pointer mr-1 rtl:mr-0 rtl:ml-1"
                      >
                        <MapIcon className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">{t.viewRouteMap}</span>
                      </button>

                      <RowActions
                        editTitle={t.editRoute}
                        deleteTitle={t.deleteRoute}
                        onEdit={onEditRoute ? () => onEditRoute(route) : null}
                        onDelete={onDeleteRoute ? () => onDeleteRoute(route.id) : null}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
