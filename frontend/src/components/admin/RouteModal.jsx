import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { createRoute, updateRoute, fetchRouteById } from '../../services/adminService';
import { X, Route as RouteIcon, Tag, CheckCircle2, AlertCircle } from 'lucide-react';

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
            setError(t.routeLoadError || 'Failed to load route data');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200/90 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <RouteIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                {isEdit ? t.editRoute : t.addRoute}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

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

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{t.saveRoute || t.save || 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
