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
        <div className="relative px-6 pt-6 pb-4 border-b border-purple-200 dark:border-[#4c1d95] bg-gradient-to-b from-purple-50/50 to-transparent dark:from-[#180e29]/80 dark:to-transparent">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-purple-100 dark:hover:bg-[#3b0764] transition-colors"
            aria-label="Close settings modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-base shadow-md border border-purple-400/20 shrink-0">
              <Settings className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                Display & Theme Settings
              </h3>
              <p className="text-xs font-medium text-purple-700 dark:text-[#c084fc]">
                Customize your portal visual preferences
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 text-xs">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-[#3b0764] border border-purple-300 dark:border-[#4c1d95] text-purple-900 dark:text-purple-200 font-extrabold flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-purple-600 dark:text-purple-300 shrink-0" />
              <span>Theme preferences saved!</span>
            </div>
          )}

          {/* Theme Option */}
          <div className="space-y-3">
            <label className="block font-extrabold uppercase tracking-wider text-slate-600 dark:text-[#c084fc]">
              Application Color Theme
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTheme('aurora')}
                className={`py-3.5 px-2.5 rounded-2xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'aurora'
                    ? 'bg-[#0f0a1e] border-purple-400 text-purple-300 shadow-md ring-2 ring-purple-400/30'
                    : 'bg-purple-50/50 dark:bg-[#180e29] border-purple-200 dark:border-[#4c1d95] text-slate-600 dark:text-[#c084fc] hover:border-purple-300'
                }`}
              >
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                <span className="text-[11px] font-extrabold">Aurora Glow</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`py-3.5 px-2.5 rounded-2xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#24123e] border-purple-400 text-white shadow-md ring-2 ring-purple-400/30'
                    : 'bg-purple-50/50 dark:bg-[#180e29] border-purple-200 dark:border-[#4c1d95] text-slate-600 dark:text-[#c084fc] hover:border-purple-300'
                }`}
              >
                <Moon className="w-5 h-5 text-purple-300" />
                <span className="text-[11px] font-extrabold">Dark Amethyst</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`py-3.5 px-2.5 rounded-2xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-purple-100 border-purple-500 text-purple-950 shadow-md ring-2 ring-purple-500/30'
                    : 'bg-purple-50/50 dark:bg-[#180e29] border-purple-200 dark:border-[#4c1d95] text-slate-600 dark:text-[#c084fc] hover:border-purple-300'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span className="text-[11px] font-extrabold">Light Purple</span>
              </button>
            </div>
          </div>


          {/* Footer Actions */}
          <div className="pt-4 border-t border-purple-100 dark:border-[#4c1d95] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-purple-200 dark:border-[#4c1d95] text-slate-700 dark:text-purple-200 font-extrabold text-xs hover:bg-purple-50 dark:hover:bg-[#3b0764] transition-all cursor-pointer"
            >
              Close
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md border border-purple-500 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Apply & Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
