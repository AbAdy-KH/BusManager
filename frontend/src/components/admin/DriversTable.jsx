import { User, Award, MoreVertical } from 'lucide-react';

export default function DriversTable({ drivers = [], searchTerm = '' }) {
  const filteredDrivers = drivers.filter((driver) => {
    const term = searchTerm.toLowerCase();
    return (
      driver.name?.toLowerCase().includes(term) ||
      driver.licenseNumber?.toLowerCase().includes(term) ||
      driver.driverId?.toLowerCase().includes(term)
    );
  });

  if (filteredDrivers.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-xs">
        {searchTerm ? 'No drivers match your search filter.' : 'No drivers found in the database.'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
          <tr>
            <th className="py-3 px-4">Driver Name</th>
            <th className="py-3 px-4">License Number</th>
            <th className="py-3 px-4">Driver ID</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {filteredDrivers.map((driver) => (
            <tr key={driver.driverId || driver.licenseNumber} className="hover:bg-slate-800/50 transition-colors">
              <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-md">
                  <User className="w-4 h-4" />
                </div>
                <span>{driver.name}</span>
              </td>
              <td className="py-3 px-4 text-slate-300 font-mono flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{driver.licenseNumber}</span>
              </td>
              <td className="py-3 px-4 text-slate-400 font-mono text-[11px] max-w-[160px] truncate">
                {driver.driverId}
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
