import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';
import { Flag, Clock, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, MessageSquareWarning } from 'lucide-react';
import { playTimerWarningChime } from '../services/audioService';
import { ReportQuestionModal } from './ReportQuestionModal';
import type { Question } from '../types/exam';

export const ExamSimulator: React.FC = () => {
  const {
    questions,
    userAnswers,
    selectOption,
    toggleFlag,
    clearSelection,
    timeRemainingSeconds,
    submitExam,
    resetExam
  } = useExam();

  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1); // 4 pages, 10 questions each
  const [reportingQuestion, setReportingQuestion] = useState<Question | null>(null);

  // Audio timer warning threshold triggers (300s = 5m, 60s = 1m)
  useEffect(() => {
    if (timeRemainingSeconds === 300) {
      playTimerWarningChime(false);
    } else if (timeRemainingSeconds === 60) {
      playTimerWarningChime(true);
    }
  }, [timeRemainingSeconds]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#f2f9f4] dark:bg-[#092c1a] text-slate-900 dark:text-emerald-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md bg-white dark:bg-[#0d3f26] p-8 rounded-3xl border border-slate-200 dark:border-[#1b5e39] shadow-sm">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold">No Active Exam Session</h2>
          <p className="text-xs text-slate-600 dark:text-[#9ed4b3]">Please start a new practice exam from the landing page.</p>
          <button
            onClick={resetExam}
            className="px-6 py-2.5 rounded-xl bg-[#105e38] text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            Return to Landing Page
          </button>
        </div>
      </div>
    );
  }

  // Pagination calculation: 10 questions per page
  const questionsPerPage = 10;
  const startIndex = (currentPage - 1) * questionsPerPage;
  const pageQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

  // Time calculations
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;

  // Metrics
  const totalAnswered = Object.values(userAnswers).filter((a) => a.selectedOption !== null).length;
  const totalFlagged = Object.values(userAnswers).filter((a) => a.flagged).length;

  // Keyboard Navigation Listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toUpperCase();

      // Navigation: Left Arrow -> Prev Page, Right Arrow -> Next Page
      if (e.key === 'ArrowLeft') {
        setCurrentPage((prev) => Math.max(1, prev - 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        setCurrentPage((prev) => Math.min(4, prev + 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'Enter') {
        if (currentPage < 4) {
          setCurrentPage((prev) => Math.min(4, prev + 1));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setShowSubmitConfirmModal(true);
        }
      }

      // Option Selection: Keys A, B, C, D or 1, 2, 3, 4 for the first question on page without an answer
      const optionMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, '1': 0, '2': 1, '3': 2, '4': 3 };
      if (optionMap[key] !== undefined) {
        const optionIndex = optionMap[key];
        const targetQuestion = pageQuestions.find((q) => !userAnswers[q.id]?.selectedOption) || pageQuestions[0];
        if (targetQuestion && targetQuestion.options[optionIndex]) {
          selectOption(targetQuestion.id, targetQuestion.options[optionIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, pageQuestions, userAnswers, selectOption]);

  return (
    <div className="min-h-screen bg-[#f2f9f4] dark:bg-[#092c1a] text-slate-900 dark:text-emerald-50 pb-28 selection:bg-[#105e38] selection:text-white transition-colors duration-200">
      {/* EXAM STICKY SUB-HEADER TIMER BAR */}
      <div className="sticky top-16 z-30 w-full bg-white/95 dark:bg-[#092c1a]/95 border-b border-slate-200 dark:border-[#1b5e39] backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#0d3f26] text-slate-800 dark:text-emerald-100 text-xs font-extrabold border border-slate-200 dark:border-[#1b5e39]">
              Page {currentPage} of 4 (Qs {startIndex + 1}-{startIndex + pageQuestions.length})
            </span>
            <span className="text-xs text-slate-500 dark:text-[#9ed4b3] font-bold hidden sm:block">
              Answered: {totalAnswered} / {questions.length}
            </span>
            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-[#0f4c2e] text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-[#1b5e39] hidden lg:inline-flex items-center gap-1.5" title="Keyboard Shortcuts Enabled">
              <span>⌨️ Keys:</span>
              <kbd className="px-1 bg-white dark:bg-[#0d3f26] rounded border border-emerald-400 text-[10px]">A-D</kbd> Select |
              <kbd className="px-1 bg-white dark:bg-[#0d3f26] rounded border border-emerald-400 text-[10px]">← →</kbd> Pages |
              <kbd className="px-1 bg-white dark:bg-[#0d3f26] rounded border border-emerald-400 text-[10px]">Enter</kbd> Next
            </span>
          </div>

          {/* Countdown Clock Display */}
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-mono text-sm sm:text-base font-black shadow-sm transition-all ${
              timeRemainingSeconds < 60
                ? 'bg-rose-600 text-white border-2 border-rose-300 animate-pulse shadow-lg ring-2 ring-rose-500/50 scale-105'
                : timeRemainingSeconds < 300
                ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 animate-pulse'
                : 'bg-emerald-50 dark:bg-[#0f4c2e] text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-[#1b5e39]'
            }`}
          >
            <Clock className={`w-4 h-4 ${timeRemainingSeconds < 60 ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
            <span>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Submit Exam Header Button */}
          <button
            onClick={() => setShowSubmitConfirmModal(true)}
            className="px-4 py-1.5 rounded-xl bg-[#105e38] hover:bg-[#147244] text-white text-xs font-extrabold shadow-sm transition-all border border-[#1b7a49] flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            <span>Submit Exam</span>
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* PAGE QUESTION CARDS LIST */}
        <div className="space-y-8">
          {pageQuestions.map((q) => {
            const currentAnswer = userAnswers[q.id];
            const selectedOpt = currentAnswer?.selectedOption || null;
            const isFlagged = currentAnswer?.flagged || false;

            return (
              <div
                key={q.id}
                id={`q_${q.id}`}
                className={`p-6 sm:p-8 rounded-3xl border bg-white dark:bg-[#0d3f26] space-y-6 transition-colors shadow-sm ${
                  isFlagged ? 'border-amber-400 dark:border-amber-500/50' : 'border-slate-200 dark:border-[#1b5e39]'
                }`}
              >
                {/* Question Header Meta */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-[#1b5e39] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#105e38] text-white text-xs font-black flex items-center justify-center">
                      #{q.id}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-[#0f4c2e] text-emerald-800 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-[#1b5e39]">
                      Ch {q.chapter}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-[#0f4c2e] text-emerald-800 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-[#1b5e39]">
                      {q.k_level}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReportingQuestion(q)}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-400 dark:text-[#9ed4b3]/70 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-transparent hover:border-amber-200 dark:hover:border-amber-900/50 transition-all flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500"
                      title={`Report a typo or ambiguity with Question #${q.id}`}
                    >
                      <MessageSquareWarning className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Report</span>
                    </button>

                    {selectedOpt && (
                      <button
                        onClick={() => clearSelection(q.id)}
                        className="text-xs text-slate-400 dark:text-[#9ed4b3] hover:text-rose-600 dark:hover:text-rose-400 font-bold transition-colors cursor-pointer"
                      >
                        Clear Choice
                      </button>
                    )}
                    <button
                      onClick={() => toggleFlag(q.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isFlagged
                          ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40 font-bold'
                          : 'bg-slate-100 dark:bg-[#092c1a] text-slate-400 dark:text-[#9ed4b3] border-slate-200 dark:border-[#185533] hover:text-amber-500'
                      }`}
                      title="Flag for review"
                    >
                      <Flag className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Question Stem */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">{q.question}</h3>

                {/* Options List */}
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {q.options.map((option, idx) => {
                    const isSelected = selectedOpt === option;
                    return (
                      <button
                        key={idx}
                        onClick={() => selectOption(q.id, option)}
                        className={`p-4 sm:p-5 rounded-2xl border text-left text-sm sm:text-base transition-all flex items-start gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-[#0f4c2e] border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold shadow-sm'
                            : 'bg-slate-50/80 dark:bg-[#092c1a]/60 border-slate-200 dark:border-[#185533] text-slate-800 dark:text-[#9ed4b3] hover:bg-slate-100 dark:hover:bg-[#135433]'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-[#105e38] text-white'
                              : 'bg-slate-200 dark:bg-[#185533] text-slate-600 dark:text-emerald-200'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#0d3f26] border border-slate-200 dark:border-[#1b5e39] shadow-sm">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => Math.max(1, prev - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 dark:bg-[#092c1a] text-slate-800 dark:text-emerald-100 font-extrabold text-sm border border-slate-200 dark:border-[#1b5e39] disabled:opacity-40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Previous 10 Questions
          </button>

          {/* Page Indicators */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((pNum) => (
              <button
                key={pNum}
                onClick={() => {
                  setCurrentPage(pNum);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-10 h-10 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  currentPage === pNum
                    ? 'bg-[#105e38] text-white shadow-md'
                    : 'bg-slate-100 dark:bg-[#092c1a] text-slate-700 dark:text-[#9ed4b3] border border-slate-200 dark:border-[#1b5e39] hover:bg-slate-200'
                }`}
              >
                Page {pNum}
              </button>
            ))}
          </div>

          {currentPage < 4 ? (
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.min(4, prev + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#105e38] hover:bg-[#147244] text-white font-extrabold text-sm shadow-md border border-[#1b7a49] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next 10 Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitConfirmModal(true)}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Finish & Submit Exam</span>
            </button>
          )}
        </div>
      </main>

      {/* CONFIRMATION SUBMIT MODAL */}
      {showSubmitConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d3f26] p-8 rounded-3xl max-w-md w-full border border-slate-200 dark:border-[#1b5e39] shadow-2xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Submit Practice Exam?</h3>
              <p className="text-sm text-slate-600 dark:text-[#9ed4b3]">
                You have answered <span className="font-bold text-slate-900 dark:text-white">{totalAnswered}</span> out of{' '}
                <span className="font-bold text-slate-900 dark:text-white">{questions.length}</span> questions.
                {totalFlagged > 0 && (
                  <span className="block text-amber-600 dark:text-amber-300 font-bold mt-1">
                    ({totalFlagged} question{totalFlagged > 1 ? 's' : ''} currently flagged for review)
                  </span>
                )}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirmModal(false)}
                className="w-1/2 py-3 rounded-2xl bg-slate-100 dark:bg-[#092c1a] text-slate-800 dark:text-emerald-100 font-extrabold text-sm border border-slate-200 dark:border-[#1b5e39] hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Continue Test
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirmModal(false);
                  submitExam();
                }}
                className="w-1/2 py-3 rounded-2xl bg-[#105e38] hover:bg-[#147244] text-white font-black text-sm shadow-md border border-[#1b7a49] transition-all cursor-pointer"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT QUESTION MODAL */}
      <ReportQuestionModal
        isOpen={Boolean(reportingQuestion)}
        question={reportingQuestion}
        onClose={() => setReportingQuestion(null)}
      />
    </div>
  );
};
