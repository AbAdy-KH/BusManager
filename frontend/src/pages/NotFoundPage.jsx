import { Link } from 'react-router-dom';
import { Bus, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-3xl mb-4">
        <Bus className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
      <p className="text-lg font-medium text-slate-300 mt-2">Route Not Found</p>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">
        The destination or stop you requested does not exist or has been relocated.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm transition-colors"
        >
          <Home className="w-4 h-4" /> Live Tracking
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Sign In
        </Link>
      </div>
    </div>
  );
}
