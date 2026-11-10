import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { createRoute, updateRoute, fetchRouteById } from '../../services/adminService';
import Modal from '../common/Modal';
import { Route as RouteIcon, Tag } from 'lucide-react';

export default function RouteModal({
  isOpen,
  onClose,
  onSuccess,
  route = null,
}) {
  const { t } = useLanguage();
  const isEdit = !!route;

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);

    if (isEdit) {
      if (route.name !== undefined && route.code !== undefined) {
        setName(route.name || '');
        setCode(route.code || '');
      } else if (route.id) {
        fetchRouteById(route.id)
          .then((full) => {
            if (full) {
              setName(full.name || '');
              setCode(full.code || '');
            }
          })
          .catch(() => {
            setError(t.routeLoadError);
          });
      }
    } else {
      setName('');
      setCode('');
    }
  }, [isOpen, route, isEdit, t]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(t.routeNameRequired || 'Route name is required.');
      return;
    }

    if (!code.trim()) {
      setError(t.routeCodeRequired || 'Route code is required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      name: name.trim(),
      code: code.trim(),
    };

    try {
      if (isEdit) {
        await updateRoute(route.id, payload);
      } else {
        await createRoute(payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save route.');
    } finally {
      setSubmitting(false);
    }
  };

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
      {/* Route Name */}
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

      {/* Route Code */}
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
