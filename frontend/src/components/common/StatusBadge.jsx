export default function StatusBadge({ isActive, activeText, inactiveText }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${
        isActive !== false
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-stone-100 text-slate-600 border-stone-200'
      }`}
    >
      {isActive !== false ? activeText : inactiveText}
    </span>
  );
}
