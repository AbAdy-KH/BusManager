import { MapPin, Bus, Navigation, Clock, X } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

export default function MapEntityPopup({ entity, onClose }) {
  const { t } = useLanguage();

  if (!entity) return null;

  return (
    <div
      className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 z-30 bg-white/95 border border-stone-200 text-slate-800 p-4 rounded-2xl shadow-xl max-w-xs animate-fadeIn backdrop-blur-md text-left rtl:text-right w-72"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-2">
        {entity.type === 'stop' ? (
          <div>
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600">
                <MapPin className="w-4 h-4" />
              </div>
              <span>{entity.data.name}</span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
              {entity.data.address || '-'}
            </p>
            <div className="flex items-center gap-1.5 mt-2 font-mono text-[11px] text-slate-500">
              <span>
                {Number(entity.data.latitude).toFixed(5)}, {Number(entity.data.longitude).toFixed(5)}
              </span>
            </div>
            <div className="mt-3 flex gap-1.5">
              <span className="text-[10px] px-2 py-0.5 font-semibold rounded-full bg-stone-100 text-slate-700 border border-stone-200">
                {entity.data.isDropPoint ? t.dropPoint : t.pickupPoint}
              </span>
              <span className="text-[10px] px-2 py-0.5 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {entity.data.isActive ? t.active : t.inactive}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-700">
              <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
                <Bus className="w-4 h-4" />
              </div>
              <span>{t.busNum} #{entity.data.busId}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 font-mono">
              <Navigation className="w-3.5 h-3.5 text-sky-500" />
              <span>
                {Number(entity.data.latitude).toFixed(5)}, {Number(entity.data.longitude).toFixed(5)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.lastPing}: {entity.data.timestamp || '-'}</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
