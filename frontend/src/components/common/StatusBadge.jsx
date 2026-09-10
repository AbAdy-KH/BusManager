import { Wifi, WifiOff, Loader2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

export default function StatusBadge({ status = 'active', type = 'connection', label, size = 'sm' }) {
  const { t } = useLanguage();

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  if (type === 'connection') {
    const config = {
      connected: {
        label: t.active || 'Connected',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        icon: Wifi,
      },
      connecting: {
        label: t.signingIn || 'Connecting...',
        className: 'bg-amber-50 text-amber-700 border-amber-200/80',
        icon: Loader2,
        spin: true,
      },
      disconnected: {
        label: t.inactive || 'Disconnected',
        className: 'bg-stone-100 text-stone-600 border-stone-200',
        icon: WifiOff,
      },
      error: {
        label: 'Error',
        className: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: AlertTriangle,
      },
    }[status] || {
      label: status,
      className: 'bg-stone-100 text-stone-600 border-stone-200',
      icon: WifiOff,
    };

    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center rounded-full font-semibold border shadow-xs ${config.className} ${sizeClasses}`}>
        <Icon className={`w-3 h-3 ${config.spin ? 'animate-spin' : ''}`} />
        <span>{label || config.label}</span>
      </span>
    );
  }

  // Active / Inactive status
  const isActive = Boolean(status === true || status === 'active' || status === 'Active');

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border shadow-xs ${
        isActive
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-stone-100 text-stone-600 border-stone-200'
      } ${sizeClasses}`}
    >
      {isActive ? (
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
      ) : (
        <XCircle className="w-3 h-3 text-stone-500" />
      )}
      <span>{label || (isActive ? t.active : t.inactive)}</span>
    </span>
  );
}
