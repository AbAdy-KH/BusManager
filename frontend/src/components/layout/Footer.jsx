import { useLanguage } from '../../context/useLanguage';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-800 text-slate-500 text-[11px] py-4 mt-auto">
    </footer>
  );
}
