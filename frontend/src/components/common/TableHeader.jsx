import { Plus } from 'lucide-react';

export default function TableHeader({
  title,
  icon: Icon,
  actionLabel,
  onAction,
  showAddIcon = false,
  children,
}) {
  return (
    <div className="px-4 py-3 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
          {Icon && <Icon className="w-4 h-4 text-indigo-600" />}
          <span>{title}</span>
        </h2>
        {children}
      </div>

      {onAction && actionLabel && (
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs ml-2 rtl:mr-2 rtl:ml-0"
          onClick={onAction}
        >
          {showAddIcon && <Plus className="w-3.5 h-3.5" />}
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
