import { GitMerge, MapPin, Clock, Pencil, Trash2, Filter, Plus } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

export default function RouteStopsTable({
  routeStops = [],
  routes = [],
  selectedRouteFilter = '',
  onRouteFilterChange,
  searchTerm = '',
  onAddRouteStop,
  onEditRouteStop,
  onDeleteRouteStop,
}) {
  const { t } = useLanguage();

  const filteredRouteStops = routeStops.filter((rs) => {
    // Route dropdown filter
    if (selectedRouteFilter && rs.routeId !== selectedRouteFilter) {
      return false;
    }

    // Search term filter
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      rs.routeName?.toLowerCase().includes(term) ||
      rs.routeCode?.toLowerCase().includes(term) ||
      rs.stopPointName?.toLowerCase().includes(term) ||
      rs.stopPointAddress?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="overflow-x-auto">
      {/* Header Bar with Filter & Add Button */}
      <div className="px-4 py-3 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <GitMerge className="w-4 h-4 text-indigo-600" />
            <span>{t.routeStops}</span>
          </h2>

          {/* Route Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2.5 py-1 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRouteFilter}
              onChange={(e) => onRouteFilterChange?.(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="">{t.allRoutes}</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {onAddRouteStop && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs ml-2 rtl:mr-2 rtl:ml-0"
            onClick={onAddRouteStop}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addStopToRoute}</span>
          </button>
        )}
      </div>

      {filteredRouteStops.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          {t.noRouteStopsFound || t.noData}
        </div>
      ) : (
        <table className="w-full text-left rtl:text-right text-xs">
          <thead className="bg-stone-50 text-slate-500 uppercase font-bold tracking-wider border-b border-stone-200/80">
            <tr>
              <th className="py-3.5 px-4 w-16 text-center">{t.sequenceNumber}</th>
              <th className="py-3.5 px-4">{t.route}</th>
              <th className="py-3.5 px-4">{t.stopName}</th>
              <th className="py-3.5 px-4">{t.estimatedMinutesShort}</th>
              <th className="py-3.5 px-4 text-right rtl:text-left">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredRouteStops.map((item) => (
              <tr
                key={`${item.routeId}-${item.stopPointId}`}
                className="hover:bg-amber-50/30 transition-colors"
              >
                {/* Sequence Order Badge */}
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs shadow-2xs">
                    {item.sequenceOrder}
                  </span>
                </td>

                {/* Route */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-800">
                      {item.routeName || '—'}
                    </span>
                    {item.routeCode && (
                      <span className="font-mono text-[10px] text-slate-500">
                        {item.routeCode}
                      </span>
                    )}
                  </div>
                </td>

                {/* Stop Point Name & Address */}
                <td className="py-3.5 px-4">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-violet-50 text-violet-600 rounded-lg border border-violet-100 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">
                        {item.stopPointName}
                      </span>
                      {item.stopPointAddress && (
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {item.stopPointAddress}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Estimated Minutes from Start */}
                <td className="py-3.5 px-4 text-slate-600">
                  {item.estimatedMinutesFromStart !== null && item.estimatedMinutesFromStart !== undefined ? (
                    <span className="inline-flex items-center gap-1 font-medium text-slate-700 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.estimatedMinutesFromStart} {t.minFromStart || 'min'}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right rtl:text-left space-x-2">
                  {onEditRouteStop && (
                    <button
                      type="button"
                      title={t.editRouteStop}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
                      onClick={() => onEditRouteStop(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  {onDeleteRouteStop && (
                    <button
                      type="button"
                      title={t.removeStopFromRoute}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      onClick={() => onDeleteRouteStop(item.routeId, item.stopPointId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
