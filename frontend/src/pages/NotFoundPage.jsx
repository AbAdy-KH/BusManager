import { Link } from 'react-router-dom';
import { Bus, Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="p-4 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-3xl mb-4 shadow-sm">
        <Bus className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-black text-slate-800 tracking-tight">404</h1>
      <p className="text-sm font-semibold text-slate-600 mt-2">{t.pageNotFound}</p>

      <div className="mt-6 flex gap-3">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>{t.adminDashboard}</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.login}</span>
        </Link>
      </div>
    </div>
  );
}
