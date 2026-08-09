import React from 'react';
import { AlertTriangle, LogOut, X, ShieldAlert } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onCancel,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#0d3f26] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1b5e39] overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-b from-amber-50 to-transparent dark:from-amber-950/30 dark:to-transparent border-b border-amber-200/60 dark:border-amber-900/30">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0f4c2e] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/20 shrink-0">
              <AlertTriangle className="w-6 h-6 animate-warning-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                Active Exam Warning
              </h3>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Progress will be cleared
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-slate-600 dark:text-[#9ed4b3] leading-relaxed">
            You are currently taking an active ISTQB CTFL v4.0 practice exam. Logging out now will immediately terminate your session and wipe out:
          </p>

          <ul className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-[#092c1a] border border-slate-200/80 dark:border-[#1b5e39] text-slate-700 dark:text-emerald-100 font-semibold">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              All selected answers and question progress
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Active timer countdown & remaining time
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Current session scores & stored local state
            </li>
          </ul>

          <p className="text-[11px] font-bold text-slate-500 dark:text-emerald-300/70">
            Are you sure you want to log out and return to the main dashboard?
          </p>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50/80 dark:bg-[#092c1a]/80 border-t border-slate-200 dark:border-[#1b5e39] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-[#1b5e39] text-slate-700 dark:text-emerald-200 font-extrabold text-xs hover:bg-slate-100 dark:hover:bg-[#0f4c2e] transition-all cursor-pointer"
          >
            Cancel (Resume Exam)
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md border border-rose-500 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout & Clear Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
