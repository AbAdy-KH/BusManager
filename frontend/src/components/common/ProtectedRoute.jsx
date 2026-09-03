import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import { ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const { t, isRtl } = useLanguage();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
    const hasRole = user.roles?.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;
      const isDriver = user.roles?.includes('Driver');

      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20 mb-4">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{t.accessDenied}</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            {t.accessDeniedAdminOnly}
          </p>

          <div className="mt-6 flex gap-3">
            {isDriver ? (
              <Link
                to="/driver"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
              >
                <ArrowIcon className="w-3.5 h-3.5" />
                <span>{t.backToDriverPanel}</span>
              </Link>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowIcon className="w-3.5 h-3.5" />
                <span>{t.login}</span>
              </Link>
            )}
          </div>
        </div>
      );
    }
  }

  return children;
}
