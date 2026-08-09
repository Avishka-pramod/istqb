import React, { useState } from 'react';
import { X, Mail, Check, Send, AlertCircle } from 'lucide-react';
import { useExam } from '../context/ExamContext';
import { sendExamScorecardEmail } from '../services/emailService';

interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailReportModal: React.FC<EmailReportModalProps> = ({ isOpen, onClose }) => {
  const { currentSession, user } = useExam();
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !currentSession) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setSending(true);
    setErrorMessage(null);

    const result = await sendExamScorecardEmail(currentSession, emailInput.trim(), user);

    setSending(false);
    if (result.success) {
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1500);
    } else {
      setErrorMessage(result.error || 'Failed to send scorecard email.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#24123e] rounded-3xl shadow-2xl border border-purple-200 dark:border-[#4c1d95] overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-purple-200 dark:border-[#4c1d95] bg-gradient-to-b from-purple-50/50 to-transparent dark:from-[#180e29]/80 dark:to-transparent">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-purple-100 dark:hover:bg-[#3b0764] transition-colors focus-visible:ring-2 focus-visible:ring-purple-500"
            aria-label="Close email report modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-base shadow-md border border-purple-400/20 shrink-0">
              <Mail className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h3 id="email-modal-title" className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                Email Scorecard & Report
              </h3>
              <p className="text-xs font-medium text-purple-700 dark:text-[#c084fc]">
                Send full performance report to your inbox
              </p>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {sentSuccess ? (
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-[#3b0764] border border-purple-300 dark:border-[#4c1d95] text-purple-900 dark:text-purple-200 font-extrabold flex items-center gap-3 animate-fadeIn">
              <Check className="w-5 h-5 text-purple-600 dark:text-purple-300 shrink-0" />
              <div>
                <p className="text-sm font-bold">Scorecard Sent!</p>
                <p className="text-[11px] font-medium text-purple-700 dark:text-purple-200/80">
                  Full scorecard breakdown delivered to {emailInput}.
                </p>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Scorecard Quick Preview */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-[#180e29] border border-purple-200 dark:border-[#4c1d95] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600 dark:text-[#c084fc]">Attempt Score:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {currentSession.score} / {currentSession.totalQuestions} ({Math.round((currentSession.score / currentSession.totalQuestions) * 100)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600 dark:text-[#c084fc]">Status:</span>
                  <span className={`font-extrabold ${currentSession.passed ? 'text-purple-600 dark:text-purple-300' : 'text-rose-600 dark:text-rose-400'}`}>
                    {currentSession.passed ? 'PASSED' : 'DID NOT PASS'}
                  </span>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block font-extrabold uppercase tracking-wider text-slate-600 dark:text-[#c084fc] mb-1.5">
                  Recipient Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="student@istqb.edu"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-purple-50/50 dark:bg-[#180e29] border border-purple-200 dark:border-[#4c1d95] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-purple-100 dark:border-[#4c1d95] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-purple-200 dark:border-[#4c1d95] text-slate-700 dark:text-purple-200 font-extrabold text-xs hover:bg-purple-50 dark:hover:bg-[#3b0764] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md border border-purple-500 transition-all flex items-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                  <Send className="w-4 h-4" />
                  <span>{sending ? 'Dispatching Email...' : 'Send Scorecard Email'}</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

