import { Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

export default function LoadingSpinner({ message, className = '' }) {
  const { t } = useLanguage();
  const displayMsg = message || t.signingIn || 'Loading...';

  return (
    <div className={`py-16 flex flex-col items-center justify-center text-slate-500 gap-3 ${className}`}>
      <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <span className="text-xs font-medium text-slate-600">{displayMsg}</span>
    </div>
  );
}
