import { useLanguage } from '../../context/useLanguage';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-800 text-slate-500 text-[11px] py-4 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <span>{t.appName}</span>
        <span>ASP.NET Core & SignalR</span>
      </div>
    </footer>
  );
}
