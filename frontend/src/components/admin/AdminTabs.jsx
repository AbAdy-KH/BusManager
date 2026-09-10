import { Search, Plus } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

export default function AdminTabs({
  tabs = [],
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
}) {
  const { t } = useLanguage();

  return (
    <div className="p-3.5 border-b border-stone-200/80 bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Tabs list */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-stone-200/60 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-200/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected
                    ? 'bg-indigo-700/80 text-white'
                    : 'bg-stone-300/80 text-slate-700'
                }`}
              >
                {tab.badge || tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Actions for table views */}
      {activeTab !== 'map' && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 rtl:pl-3 rtl:pr-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-left rtl:text-right shadow-xs"
            />
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.add}</span>
          </button>
        </div>
      )}
    </div>
  );
}
