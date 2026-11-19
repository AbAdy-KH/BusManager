import Modal from '../common/Modal';
import { useAssignBusForm } from '../../hooks/forms/useAssignBusForm';
import { Bus, User, Calendar } from 'lucide-react';

export default function AssignBusModal({
  isOpen,
  onClose,
  onSuccess,
  drivers = [],
  buses = [],
  assignments = [],
  initialDriverId = '',
  selectedDate = '',
}) {
  const {
    t,
    driverId,
    setDriverId,
    busId,
    setBusId,
    date,
    setDate,
    submitting,
    error,
    assignedDriverIds,
    assignedBusIds,
    handleSubmit,
  } = useAssignBusForm({
    isOpen,
    assignments,
    initialDriverId,
    selectedDate,
    onSuccess,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.assignBusModalTitle}
      icon={Bus}
      error={error}
      isSubmitting={submitting}
      onSubmit={handleSubmit}
      submitText={t.assignBusBtn}
    >
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.assignmentDate}</span>
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono shadow-xs"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-sky-600" />
          <span>{t.selectDriver}</span>
          <span className="text-rose-500">*</span>
        </label>
        <select
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          required
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
        >
          <option value="">-- {t.selectDriver} --</option>
          {drivers.map((driver) => {
            const isAssigned = assignedDriverIds.has(driver.driverId);
            return (
              <option key={driver.driverId} value={driver.driverId}>
                {driver.name} {isAssigned ? `[✓ ${t.alreadyAssigned}]` : ''}
              </option>
            );
          })}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Bus className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.selectBus}</span>
          <span className="text-rose-500">*</span>
        </label>
        <select
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          required
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
        >
          <option value="">-- {t.selectBus} --</option>
          {buses
            .filter((b) => b.isActive !== false)
            .map((bus) => {
              const isBusAssigned = assignedBusIds.has(bus.id);
              return (
                <option key={bus.id} value={bus.id}>
                  {t.busNumber} #{bus.number} {isBusAssigned ? `[✓ ${t.busesInService}]` : ''}
                </option>
              );
            })}
        </select>
      </div>
    </Modal>
  );
}
