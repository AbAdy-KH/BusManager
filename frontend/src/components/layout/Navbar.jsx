import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import ApiUrlSettings from '../common/ApiUrlSettings';
import { Bus, LogIn, LogOut, Server, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, baseUrl } = useAuth();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
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
              <span>BusManager</span>
            </Link>

            {/* Navigation links & user status */}
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  location.pathname === '/admin'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </Link>

              {/* Server endpoint button */}
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                title="Configure Backend URL"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] bg-slate-800/80 border border-slate-700/60 rounded-md text-slate-400 hover:text-white font-mono transition-colors cursor-pointer"
              >
                <Server className="w-3 h-3 text-indigo-400" />
                <span>{baseUrl.replace(/^https?:\/\//, '')}</span>
              </button>

              {isAuthenticated && user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <span className="text-xs text-slate-300 font-medium max-w-[120px] truncate hidden md:inline">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={logout}
                    title="Sign Out"
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
                    <LogIn className="w-3.5 h-3.5" /> Sign In
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      <ApiUrlSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
