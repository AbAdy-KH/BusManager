import { useLanguage } from '../../context/useLanguage';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-stone-200/80 bg-white/60 text-slate-500 text-xs py-4 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-medium text-slate-600">
          {t.appName} &copy; {new Date().getFullYear()}
        </span>
        <span className="text-[11px] text-slate-400">
          Smart Fleet & Route Management
        </span>
      </div>
    </footer>
  );
}
