import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { DEFAULT_API_BASE_URL } from '../../config/api.config';
import { Server, Save, RotateCcw, X, Check } from 'lucide-react';

function ModalForm({ baseUrl, onSave, onClose }) {
  const [urlInput, setUrlInput] = useState(baseUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onSave(urlInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setUrlInput(DEFAULT_API_BASE_URL);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-white">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
          <Server className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Global Backend API URL</h3>
          <p className="text-xs text-slate-400">Configure the server endpoint used for API calls & Hubs</p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            API Base URL
          </label>
          <input
            type="url"
            required
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://localhost:7148"
            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-xs text-slate-400 space-y-1">
          <div className="font-medium text-slate-300">Default ASP.NET Core Endpoints:</div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setUrlInput('https://localhost:7148')}
              className="font-mono text-[11px] px-2 py-1 bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 rounded border border-indigo-500/30 transition-colors cursor-pointer"
            >
              https://localhost:7148 (HTTPS)
            </button>
            <button
              type="button"
              onClick={() => setUrlInput('http://localhost:5278')}
              className="font-mono text-[11px] px-2 py-1 bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 rounded border border-indigo-500/30 transition-colors cursor-pointer"
            >
              http://localhost:5278 (HTTP)
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" /> Target URL updated successfully!
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Default
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function ApiUrlSettings({ isOpen, onClose }) {
  const { baseUrl, setBaseUrl } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <ModalForm key={baseUrl} baseUrl={baseUrl} onSave={setBaseUrl} onClose={onClose} />
    </div>
  );
}
