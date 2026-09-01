import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
    const hasRole = user.roles?.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-rose-400">Access Denied</h2>
          <p className="text-sm text-slate-400 mt-2">
            You do not have permission to view this page. Required role: {allowedRoles.join(', ')}
          </p>
        </div>
      );
    }
  }

  return children;
}
