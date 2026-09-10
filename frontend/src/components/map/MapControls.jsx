import { Plus, Minus, Maximize2 } from 'lucide-react';

export default function MapControls({ onZoomIn, onZoomOut, onFitAll }) {
  return (
    <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 flex flex-col gap-1.5 shadow-md rounded-xl overflow-hidden bg-white/95 border border-stone-200/80 backdrop-blur-md p-1">
      <button
        type="button"
        onClick={onZoomIn}
        title="Zoom In"
        className="p-2 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onZoomOut}
        title="Zoom Out"
        className="p-2 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="h-[1px] bg-stone-200 my-0.5" />
      <button
        type="button"
        onClick={onFitAll}
        title="Fit All"
        className="p-2 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  );
}
