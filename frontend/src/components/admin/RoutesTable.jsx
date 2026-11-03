import { Route as RouteIcon, Pencil, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

export default function RoutesTable({
  routes = [],
  searchTerm = '',
  onAddRoute,
  onEditRoute,
  onDeleteRoute,
}) {
  const { t } = useLanguage();

  const filteredRoutes = routes.filter((route) => {
    const term = searchTerm.toLowerCase();
    return (
      route.name?.toLowerCase().includes(term) ||
      route.code?.toLowerCase().includes(term)
    );
  });

  if (filteredRoutes.length === 0) {
    return (
      <div>
        <div className="px-4 py-3 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <h2 className="text-sm font-medium text-slate-600">{t.routes}</h2>
          {onAddRoute && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs ml-2 rtl:mr-2 rtl:ml-0"
              onClick={onAddRoute}
            >
              {t.addRoute}
            </button>
          )}
        </div>
        <div className="p-8 text-center text-slate-500 text-sm">
          {t.noData || 'No routes found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="px-4 py-3 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <h2 className="text-sm font-medium text-slate-600">{t.routes}</h2>
        {onAddRoute && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs ml-2 rtl:mr-2 rtl:ml-0"
            onClick={onAddRoute}
          >
            {t.addRoute}
          </button>
        )}
      </div>

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
              <td className="py-3.5 px-4 text-right rtl:text-left space-x-2">
                {onEditRoute && (
                  <button
                    type="button"
                    title={t.editRoute}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
                    onClick={() => onEditRoute(route)}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                {onDeleteRoute && (
                  <button
                    type="button"
                    title={t.deleteRoute}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    onClick={() => onDeleteRoute(route.id)}
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
