import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import { ShieldAlert, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const { t, isRtl } = useLanguage();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-500 gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-xs font-semibold text-slate-600">{t.signingIn}</span>
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
          <div className="p-4 bg-rose-50 text-rose-600 rounded-3xl border border-rose-200 mb-4 shadow-sm">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{t.accessDenied}</h2>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm">
            {t.accessDeniedAdminOnly}
          </p>

          <div className="mt-6 flex gap-3">
            {isDriver ? (
              <Link
                to="/driver"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
              >
                <ArrowIcon className="w-3.5 h-3.5" />
                <span>{t.backToDriverPanel}</span>
              </Link>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-colors shadow-xs"
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
