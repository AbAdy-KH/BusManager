import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { createDriver, updateDriver, fetchDriverById } from '../../services/adminService';
import { X, User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DriverModal({
  isOpen,
  onClose,
  onSuccess,
  driver = null,
}) {
  const { t } = useLanguage();
  const isEdit = !!driver;

  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load driver details when editing
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    if (isEdit) {
      // If full driver object provided, use it; otherwise fetch by ID
      if (driver.name && driver.licenseNumber) {
        setName(driver.name);
        setLicenseNumber(driver.licenseNumber || '');
      } else if (driver.id) {
        fetchDriverById(driver.id)
          .then((full) => {
            setName(full.name || '');
            setLicenseNumber(full.licenseNumber || '');
          })
          .catch(() => {
            setError(t.driverLoadError || 'Failed to load driver data');
          });
      }
    } else {
      setName('');
      setLicenseNumber('');
    }
  }, [isOpen, driver, isEdit, t]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t.driverNameRequired || 'Driver name is required');
      return;
    }
    setSubmitting(true);
    setError(null);
    const payload = {
      name: name.trim(),
      licenseNumber: licenseNumber.trim() || null,
    };
    try {
      if (isEdit) {
        const id = driver.id || driver.driverId;
        await updateDriver(id, payload);
      } else {
        await createDriver(payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save driver');
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
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                {isEdit ? t.editDriver : t.addDriver}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>{t.driverName}</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>{t.licenseNumber}</span>
            </label>
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>

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
              <span>{t.saveDriver || t.save || 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
