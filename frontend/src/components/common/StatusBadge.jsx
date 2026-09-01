import { Wifi, WifiOff, Loader2, AlertTriangle } from 'lucide-react';

const STATUS_CONFIG = {
  disconnected: {
    label: 'Disconnected',
    className: 'bg-slate-800 text-slate-400 border-slate-700',
    icon: WifiOff,
  },
  connecting: {
    label: 'Connecting...',
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: Loader2,
    spin: true,
  },
  connected: {
    label: 'Connected',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: Wifi,
  },
  error: {
    label: 'Error',
    className: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    icon: AlertTriangle,
  },
};

export default function StatusBadge({ status = 'disconnected', showLabel = true, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.disconnected;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border transition-colors ${config.className} ${sizeClasses}`}
    >
      <Icon className={`w-3.5 h-3.5 ${config.spin ? 'animate-spin' : ''}`} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
