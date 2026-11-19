import Modal from '../../common/Modal';
import { useRouteForm } from '../../../hooks/forms/useRouteForm';
import { Route as RouteIcon, Tag } from 'lucide-react';

export default function RouteModal({ isOpen, onClose, onSuccess, route = null }) {
  const {
    t,
    isEdit,
    name,
    setName,
    code,
    setCode,
    submitting,
    error,
    handleSubmit,
  } = useRouteForm({ isOpen, route, onSuccess, onClose });

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t.editRoute : t.addRoute}
      icon={RouteIcon}
      error={error}
      isSubmitting={submitting}
      onSubmit={handleSubmit}
      submitText={t.saveRoute || t.save}
    >
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <RouteIcon className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.routeName}</span>
          <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Downtown Express"
          required
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.routeCode}</span>
          <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. EX-101"
          required
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono shadow-xs"
        />
      </div>
    </Modal>
  );
}
