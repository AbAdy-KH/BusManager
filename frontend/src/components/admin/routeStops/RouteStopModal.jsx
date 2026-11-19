import Modal from '../../common/Modal';
import { useRouteStopForm } from '../../../hooks/forms/useRouteStopForm';
import {
  GitMerge,
  MapPin,
  ListOrdered,
  Clock,
  Route as RouteIcon,
} from 'lucide-react';

export default function RouteStopModal({
  isOpen,
  onClose,
  onSuccess,
  routeStop = null,
  routes = [],
  stops = [],
  existingRouteStops = [],
  defaultRouteId = '',
}) {
  const {
    t,
    isEdit,
    routeId,
    stopPointId,
    setStopPointId,
    sequenceOrder,
    setSequenceOrder,
    estimatedMinutes,
    setEstimatedMinutes,
    submitting,
    error,
    alreadyAssignedStopIds,
    handleRouteChange,
    handleSubmit,
  } = useRouteStopForm({
    isOpen,
    routeStop,
    routes,
    stops,
    existingRouteStops,
    defaultRouteId,
    onSuccess,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t.editRouteStop : t.addStopToRoute}
      icon={GitMerge}
      error={error}
      isSubmitting={submitting}
      onSubmit={handleSubmit}
      submitText={t.save || 'Save'}
    >
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <RouteIcon className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.route}</span>
          <span className="text-rose-500">*</span>
        </label>
        {isEdit ? (
          <div className="px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs font-medium text-slate-700">
            {routeStop?.routeName || routeId} ({routeStop?.routeCode})
          </div>
        ) : (
          <select
            value={routeId}
            onChange={(e) => handleRouteChange(e.target.value)}
            required
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs cursor-pointer"
          >
            <option value="">{t.selectRoute}</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.code})
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-violet-600" />
          <span>{t.stopPoints || t.stopName}</span>
          <span className="text-rose-500">*</span>
        </label>
        {isEdit ? (
          <div className="px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs font-medium text-slate-700">
            {routeStop?.stopPointName || stopPointId}
          </div>
        ) : (
          <select
            value={stopPointId}
            onChange={(e) => setStopPointId(e.target.value)}
            required
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs cursor-pointer"
          >
            <option value="">{t.selectStopPoint}</option>
            {stops.map((s) => {
              const isAssigned = alreadyAssignedStopIds.has(s.id);
              return (
                <option key={s.id} value={s.id} disabled={isAssigned}>
                  {s.name} {s.address ? `— ${s.address}` : ''} {isAssigned ? `(Already added)` : ''}
                </option>
              );
            })}
          </select>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <ListOrdered className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.sequenceOrder}</span>
          <span className="text-rose-500">*</span>
        </label>
        <input
          type="number"
          min="1"
          value={sequenceOrder}
          onChange={(e) => setSequenceOrder(e.target.value)}
          required
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
          placeholder="e.g. 1"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.estimatedMinutes}</span>
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(e.target.value)}
            placeholder="e.g. 15"
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
          <span className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
            min
          </span>
        </div>
      </div>
    </Modal>
  );
}
