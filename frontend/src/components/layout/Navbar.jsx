import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import { Bus, LogIn, LogOut, LayoutDashboard, Globe, User } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  const isAdmin = user?.roles?.includes('Admin');
  const isDriver = user?.roles?.includes('Driver');

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-sm text-white hover:text-indigo-400 transition-colors"
          >
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <Bus className="w-4 h-4" />
            </div>
            <span>{t.appName}</span>
          </Link>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            {/* Show Admin Dashboard link ONLY for Admins */}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  location.pathname === '/admin'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{t.adminDashboard}</span>
              </Link>
            )}

            {/* Show Driver Dashboard link for Drivers */}
            {isAuthenticated && isDriver && (
              <Link
                to="/driver"
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  location.pathname === '/driver'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
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
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold">{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* User status & Logout */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 pl-2 rtl:pl-0 rtl:pr-2 border-l rtl:border-l-0 rtl:border-r border-slate-800">
                <span className="text-xs text-slate-300 font-medium max-w-[120px] truncate hidden md:inline">
                  {user.name || user.email}
                </span>
                <button
                  onClick={logout}
                  title={t.logout}
                  className="text-xs text-slate-400 hover:text-rose-400 p-1.5 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              location.pathname !== '/' && (
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" /> {t.login}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
