import { Inbox } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

export default function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  const { t } = useLanguage();

  return (
    <div className="py-14 px-4 flex flex-col items-center justify-center text-center">
      <div className="p-3.5 bg-amber-50 rounded-2xl text-amber-600 border border-amber-200/60 mb-3 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-slate-800">
        {title || t.noData}
      </h4>
      {description && (
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
