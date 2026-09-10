import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import { Bus, LogIn, LogOut, LayoutDashboard, ClipboardList, Globe, User } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  const isAdmin = user?.roles?.includes('Admin');
  const isDriver = user?.roles?.includes('Driver');

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-15">
          {/* Logo & App Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-sm text-slate-800 hover:text-indigo-600 transition-colors"
          >
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-sm shadow-indigo-600/20">
              <Bus className="w-4 h-4" />
            </div>
            <span className="text-base tracking-tight font-extrabold text-slate-800">
              {t.appName}
            </span>
          </Link>

          {/* Navigation actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Dashboard link */}
            {isAuthenticated && isAdmin && (
              <>
                <Link
                  to="/admin"
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    location.pathname === '/admin'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{t.adminDashboard}</span>
                </Link>

                <Link
                  to="/admin/attendance"
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    location.pathname === '/admin/attendance'
                      ? 'bg-sky-50 text-sky-700 border border-sky-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>{t.busDriverShort}</span>
                </Link>
              </>
            )}

            {/* Driver Dashboard link */}
            {isAuthenticated && isDriver && (
              <Link
                to="/driver"
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  location.pathname === '/driver'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.driverDashboard}</span>
              </Link>
            )}

            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              title="تغيير اللغة / Switch Language"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-amber-50/80 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* User status & Logout */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 pl-2 rtl:pl-0 rtl:pr-2 border-l rtl:border-l-0 rtl:border-r border-stone-200">
                <span className="text-xs text-slate-700 font-medium max-w-[120px] truncate hidden md:inline">
                  {user.name || user.email}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  title={t.logout}
                  className="text-xs text-slate-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              location.pathname !== '/' && (
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.login}</span>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
