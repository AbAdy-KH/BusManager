import Modal from '../../common/Modal';
import { useDriverForm } from '../../../hooks/forms/useDriverForm';
import { User } from 'lucide-react';

export default function DriverModal({ isOpen, onClose, onSuccess, driver = null }) {
  const {
    t,
    isEdit,
    name,
    setName,
    licenseNumber,
    setLicenseNumber,
    submitting,
    error,
    handleSubmit,
  } = useDriverForm({ isOpen, driver, onSuccess, onClose });

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t.editDriver : t.addDriver}
      icon={User}
      error={error}
      isSubmitting={submitting}
      onSubmit={handleSubmit}
      submitText={t.saveDriver || t.save}
    >
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
    </Modal>
  );
}
