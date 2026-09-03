import { MapPin, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

export default function StopsTable({ stops = [], searchTerm = '' }) {
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
      <div className="text-center py-12 text-slate-500 text-xs">
        {t.noData}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left rtl:text-right text-xs">
        <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
          <tr>
            <th className="py-3 px-4">{t.stopName}</th>
            <th className="py-3 px-4">{t.address}</th>
            <th className="py-3 px-4">{t.coordinates}</th>
            <th className="py-3 px-4">{t.type}</th>
            <th className="py-3 px-4">{t.status}</th>
            <th className="py-3 px-4 text-right rtl:text-left">{t.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {filteredStops.map((stop) => (
            <tr key={stop.id || stop.name} className="hover:bg-slate-800/50 transition-colors">
              <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                <div className="p-1.5 bg-rose-500/10 text-rose-400 rounded-md">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>{stop.name}</span>
              </td>
              <td className="py-3 px-4 text-slate-300">
                {stop.address || <span className="text-slate-500 italic">-</span>}
              </td>
              <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                {Number(stop.latitude).toFixed(5)}, {Number(stop.longitude).toFixed(5)}
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {stop.isDropPoint ? t.dropPoint : t.pickupPoint}
                </span>
              </td>
              <td className="py-3 px-4">
                {stop.isActive ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> {t.active}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-700/60 text-slate-400 border border-slate-700">
                    <XCircle className="w-3 h-3" /> {t.inactive}
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-right rtl:text-left">
                <button
                  type="button"
                  title={t.actions}
                  className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
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
