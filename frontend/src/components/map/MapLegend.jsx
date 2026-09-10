import { useLanguage } from '../../context/useLanguage';

export default function MapLegend({ isAdmin }) {
  const { t } = useLanguage();

  return (
    <div className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 z-20 bg-white/95 border border-stone-200/90 rounded-xl p-3 text-[11px] text-slate-700 flex flex-col gap-2 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-indigo-600 border-2 border-white shadow-xs" />
        <span className="font-medium">{t.pickupPoint}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-rose-500 border-2 border-white shadow-xs" />
        <span className="font-medium">{t.dropPoint}</span>
      </div>
      {isAdmin && (
        <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse shadow-xs" />
          <span className="text-emerald-700 font-bold">{t.liveActiveBus}</span>
        </div>
      )}
    </div>
  );
}
