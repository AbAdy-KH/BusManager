import { Bus, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';

export default function BusesTable({ buses = [], searchTerm = '' }) {
  const filteredBuses = buses.filter((bus) => {
    const term = searchTerm.toLowerCase();
    return (
      bus.number?.toString().includes(term) ||
      bus.plateNumber?.toLowerCase().includes(term) ||
      bus.capacity?.toString().includes(term)
    );
  });

  if (filteredBuses.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-xs">
        {searchTerm ? 'No buses match your search filter.' : 'No buses found in the database.'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
          <tr>
            <th className="py-3 px-4">Bus #</th>
            <th className="py-3 px-4">Plate Number</th>
            <th className="py-3 px-4">Capacity</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {filteredBuses.map((bus) => (
            <tr key={bus.id || bus.number} className="hover:bg-slate-800/50 transition-colors">
              <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-md">
                  <Bus className="w-4 h-4" />
                </div>
                <span>Bus #{bus.number}</span>
              </td>
              <td className="py-3 px-4 text-slate-300 font-mono">{bus.plateNumber}</td>
              <td className="py-3 px-4 text-slate-300">{bus.capacity} seats</td>
              <td className="py-3 px-4">
                {bus.isActive ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-700/60 text-slate-400 border border-slate-700">
                    <XCircle className="w-3 h-3" /> Inactive
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-right">
                <button
                  type="button"
                  title="Options (Future CRUD)"
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
