import React, { useState } from 'react';
import { X, Flag, Check, Send } from 'lucide-react';
import type { Question } from '../types/exam';

interface ReportQuestionModalProps {
  isOpen: boolean;
  question: Question | null;
  onClose: () => void;
}

export const ReportQuestionModal: React.FC<ReportQuestionModalProps> = ({
  isOpen,
  question,
  onClose
}) => {
  const [category, setCategory] = useState<'typo' | 'incorrect' | 'ambiguous' | 'other'>('ambiguous');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !question) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reportData = {
      id: `report_${Date.now()}`,
      questionId: question.id,
      questionText: question.question,
      category,
      description: description.trim(),
      timestamp: new Date().toLocaleString()
    };

    // Save to localStorage under istqb_reported_questions
    try {
      const existing = localStorage.getItem('istqb_reported_questions');
      const reports = existing ? JSON.parse(existing) : [];
      reports.push(reportData);
      localStorage.setItem('istqb_reported_questions', JSON.stringify(reports));
    } catch {
      // Ignore if storage full
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#24123e] rounded-3xl shadow-2xl border border-purple-200 dark:border-[#4c1d95] overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-purple-200 dark:border-[#4c1d95] bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/20 dark:to-transparent">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-purple-100 dark:hover:bg-[#3b0764] transition-colors focus-visible:ring-2 focus-visible:ring-purple-500"
            aria-label="Close report modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-base border border-amber-500/20 shrink-0">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 id="report-modal-title" className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                Report Question #{question.id}
              </h3>
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                Found a typo or perceived answer error?
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {submitted ? (
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-[#3b0764] border border-purple-300 dark:border-[#4c1d95] text-purple-900 dark:text-purple-200 font-extrabold flex items-center gap-3 animate-fadeIn">
              <Check className="w-5 h-5 text-purple-600 dark:text-purple-300 shrink-0" />
              <div>
                <p className="text-sm font-bold">Feedback Submitted!</p>
                <p className="text-[11px] font-medium text-purple-700 dark:text-purple-200/80">
                  Thank you for helping improve CTFL test quality.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Question Preview Snippet */}
              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-[#180e29] border border-purple-200 dark:border-[#4c1d95]">
                <p className="font-bold text-slate-700 dark:text-purple-100 line-clamp-2">
                  "{question.question}"
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block font-extrabold uppercase tracking-wider text-slate-600 dark:text-[#c084fc] mb-1.5">
                  Issue Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ambiguous', label: 'Ambiguous Wording' },
                    { id: 'incorrect', label: 'Incorrect Answer' },
                    { id: 'typo', label: 'Typo / Grammar' },
                    { id: 'other', label: 'Other Issue' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as any)}
                      className={`py-2 px-3 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        category === cat.id
                          ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-400 text-amber-900 dark:text-amber-200 shadow-sm'
                          : 'bg-purple-50/50 dark:bg-[#180e29] border-purple-200 dark:border-[#4c1d95] text-slate-600 dark:text-[#c084fc]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-extrabold uppercase tracking-wider text-slate-600 dark:text-[#c084fc] mb-1.5">
                  Details & Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain why you think this question or option needs revision..."
                  className="w-full p-3 rounded-xl bg-purple-50/50 dark:bg-[#180e29] border border-purple-200 dark:border-[#4c1d95] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-xs"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-2 border-t border-purple-100 dark:border-[#4c1d95] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-purple-200 dark:border-[#4c1d95] text-slate-700 dark:text-purple-200 font-extrabold text-xs hover:bg-purple-50 dark:hover:bg-[#3b0764] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md border border-amber-500 transition-all flex items-center gap-2 cursor-pointer active:scale-98 focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
