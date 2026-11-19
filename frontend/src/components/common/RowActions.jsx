import { Pencil, Trash2 } from 'lucide-react';

export default function RowActions({
  onEdit,
  onDelete,
  editTitle = 'Edit',
  deleteTitle = 'Delete',
  isDeleting = false,
}) {
  return (
    <div className="inline-flex items-center justify-end gap-1">
      {onEdit && (
        <button
          type="button"
          title={editTitle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
          onClick={onEdit}
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          title={deleteTitle}
          disabled={isDeleting}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
          onClick={onDelete}
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}
