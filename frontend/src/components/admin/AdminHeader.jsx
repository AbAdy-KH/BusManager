import { Link } from 'react-router-dom';
import { Radio, RefreshCw, ClipboardList } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

export default function AdminHeader({ isAdmin, hubStatus, onRefresh, loading }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
          <span>{t.adminDashboard}</span>
        </h1>
      </div>
    </div>
  );
}
