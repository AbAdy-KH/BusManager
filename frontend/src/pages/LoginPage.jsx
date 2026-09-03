import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useLanguage } from '../context/useLanguage';
import { Bus, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout, loading, error, clearError } = useAuth();
  const { t, isRtl } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!email.trim() || !password) return;

    const res = await login({ email, password });
    if (res.success) {
      if (res.user?.roles?.includes('Admin')) {
        navigate('/admin');
      } else if (res.user?.roles?.includes('Driver')) {
        navigate('/driver');
      } else {
        navigate('/');
      }
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const isAdmin = user?.roles?.includes('Admin');
  const isDriver = user?.roles?.includes('Driver');

  const targetDashboardUrl = isAdmin ? '/admin' : isDriver ? '/driver' : '/';
  const targetDashboardLabel = isAdmin ? t.adminDashboard : isDriver ? t.driverDashboard : t.goToDashboard;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20 mb-3">
            <Bus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t.appName}</h1>
          <p className="text-xs text-slate-400 mt-1">{t.loginPrompt}</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
          {/* If already signed in */}
          {isAuthenticated && user ? (
            <div className="text-center py-2 space-y-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-white">
                  {t.signedInAs} {user.name || user.email}
                </div>
                <div className="text-xs text-slate-400 font-mono">{user.email}</div>
                {user.roles && user.roles.length > 0 && (
                  <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {t.role}: {user.roles.map((r) => t[r.toLowerCase()] || r).join(', ')}
                  </span>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  to={targetDashboardUrl}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
                >
                  <span>{targetDashboardLabel}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="w-full py-2 px-4 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
                >
                  {t.logout}
                </button>
              </div>
            </div>
          ) : (
            /* Sign in form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Notification */}
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>{error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearError}
                    className="text-rose-400 hover:text-rose-200 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t.email}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-left rtl:text-right"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t.password}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 rtl:pl-9 rtl:pr-9 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-left rtl:text-right"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email.trim() || !password}
                className="w-full mt-2 py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.signingIn}
                  </span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> {t.signInBtn}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
