import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { X, Settings, Moon, Sun, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useExam();
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#0d3f26] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1b5e39] overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-200 dark:border-[#1b5e39] bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-[#092c1a]/80 dark:to-transparent">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0f4c2e] transition-colors"
            aria-label="Close settings modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#105e38] to-[#16804d] text-white flex items-center justify-center font-black text-base shadow-md border border-emerald-400/20 shrink-0">
              <Settings className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                Display & Theme Settings
              </h3>
              <p className="text-xs font-medium text-emerald-700 dark:text-[#9ed4b3]">
                Customize your portal visual preferences
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 text-xs">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-extrabold flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Theme preferences saved!</span>
            </div>
          )}

          {/* Theme Option */}
          <div className="space-y-3">
            <label className="block font-extrabold uppercase tracking-wider text-slate-600 dark:text-[#9ed4b3]">
              Application Color Theme
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTheme('aurora')}
                className={`py-3.5 px-2.5 rounded-2xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'aurora'
                    ? 'bg-slate-900 border-cyan-400 text-cyan-300 shadow-md ring-2 ring-cyan-400/30'
                    : 'bg-slate-50 dark:bg-[#092c1a] border-slate-200 dark:border-[#1b5e39] text-slate-600 dark:text-[#9ed4b3] hover:border-slate-300'
                }`}
              >
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-[11px] font-extrabold">Aurora</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`py-3.5 px-2.5 rounded-2xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#0f4c2e] border-emerald-400 text-white shadow-md ring-2 ring-emerald-400/30'
                    : 'bg-slate-50 dark:bg-[#092c1a] border-slate-200 dark:border-[#1b5e39] text-slate-600 dark:text-[#9ed4b3] hover:border-slate-300'
                }`}
              >
                <Moon className="w-5 h-5 text-emerald-300" />
                <span className="text-[11px] font-extrabold">Dark Forest</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`py-3.5 px-2.5 rounded-2xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 dark:bg-[#092c1a] border-slate-200 dark:border-[#1b5e39] text-slate-600 dark:text-[#9ed4b3] hover:border-slate-300'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span className="text-[11px] font-extrabold">Light Mode</span>
              </button>
            </div>
          </div>


          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#1b5e39] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-[#1b5e39] text-slate-700 dark:text-emerald-200 font-extrabold text-xs hover:bg-slate-100 dark:hover:bg-[#0f4c2e] transition-all cursor-pointer"
            >
              Close
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#105e38] hover:bg-[#147244] text-white font-extrabold text-xs shadow-md border border-[#1b7a49] transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
