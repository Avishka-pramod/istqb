import React, { useEffect, useState } from 'react';
import { useExam } from '../context/ExamContext';
import { ISTQB_CHAPTERS, K_LEVEL_DESCRIPTIONS } from '../data/istqbSyllabus';
import confetti from 'canvas-confetti';
import { EmailReportModal } from './EmailReportModal';
import {
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  Filter,
  Check,
  X,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  BarChart3,
  ArrowLeft,
  Home,
  Mail
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { currentSession: ctxSession, examHistory, takeAnotherExam, resetExam, goBack, isLoadingQuestions, excludedTopics, setView } = useExam();
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'flagged' | 'correct'>('all');
  const [openExplanationId, setOpenExplanationId] = useState<number | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const sessionToDisplay = ctxSession || (examHistory.length > 0 ? examHistory[0] : null);

  useEffect(() => {
    if (sessionToDisplay?.passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [sessionToDisplay]);

  if (!sessionToDisplay) {
    return (
      <div className="min-h-screen bg-[#faf5ff] dark:bg-[#180e29] text-slate-900 dark:text-purple-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6 bg-white dark:bg-[#24123e] p-8 rounded-3xl border border-purple-200 dark:border-[#4c1d95] shadow-sm">
          <h2 className="text-xl font-bold">No Exam Result Selected</h2>
          <p className="text-xs text-slate-600 dark:text-[#c084fc]">Please start a new practice test to generate exam results and detailed rationale feedback.</p>
          <button
            onClick={resetExam}
            className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Return Home
          </button>
        </div>
      </div>
    );
  }

  const { score, totalQuestions, passed, timeSpentSeconds, chapterScores, kLevelScores, questions, userAnswers } =
    sessionToDisplay;

  const percentage = Math.round((score / totalQuestions) * 100);
  const minutesSpent = Math.floor(timeSpentSeconds / 60);
  const secondsSpent = timeSpentSeconds % 60;

  // Filter questions for review
  const filteredQuestions = questions.filter((q) => {
    const uAns = userAnswers[q.id]?.selectedOption;
    const isCorrect = uAns === q.correct_answer;
    const isFlagged = userAnswers[q.id]?.flagged;

    if (filterMode === 'incorrect') return !isCorrect;
    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'flagged') return isFlagged;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#faf5ff] dark:bg-[#180e29] text-slate-900 dark:text-purple-50 pb-20 selection:bg-purple-600 selection:text-white transition-colors duration-200">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* DYNAMIC GO BACK BUTTON BAR */}
        <div className="flex items-center justify-between pb-2">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#24123e] text-slate-800 dark:text-purple-100 font-extrabold text-xs sm:text-sm border border-purple-200 dark:border-[#4c1d95] hover:bg-purple-50 dark:hover:bg-[#3b0764] shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-purple-600 dark:text-purple-300" />
            <span>Back</span>
          </button>

          <button
            onClick={resetExam}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#c084fc] font-bold hover:text-purple-400 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" /> Dashboard
          </button>
        </div>

        {/* PASS / FAIL HERO BANNER */}
        <section
          className={`p-8 sm:p-12 rounded-3xl border shadow-lg relative overflow-hidden text-center space-y-6 ${
            passed
              ? 'bg-gradient-to-b from-purple-50 via-white to-white dark:from-[#3b0764] dark:via-[#24123e] dark:to-[#24123e] border-purple-300 dark:border-purple-500/40'
              : 'bg-gradient-to-b from-rose-50 via-white to-white dark:from-rose-950/80 dark:via-[#24123e] dark:to-[#24123e] border-rose-300 dark:border-rose-500/40'
          }`}
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black uppercase text-xs sm:text-sm tracking-wider shadow-sm">
            {passed ? (
              <span className="bg-purple-100 dark:bg-[#3b0764] text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-[#4c1d95] px-4 py-1.5 rounded-full flex items-center gap-2 font-extrabold">
                <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-300" /> EXAM STATUS: PASSED
              </span>
            ) : (
              <span className="bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 px-4 py-1.5 rounded-full flex items-center gap-2 font-extrabold">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" /> EXAM STATUS: FAILED
              </span>
            )}
          </div>

          {/* Main Score Display */}
          <div className="space-y-2">
            <div className="text-6xl sm:text-8xl font-black tracking-tight text-slate-900 dark:text-white">
              {score} <span className="text-3xl sm:text-4xl font-bold text-slate-500 dark:text-[#c084fc]">/ {totalQuestions}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-purple-100">
              Score: <span className={passed ? 'text-purple-600 dark:text-purple-300' : 'text-rose-600 dark:text-rose-400'}>{percentage}%</span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-[#c084fc] ml-2.5 font-normal">(Passing threshold: 65% / 26 correct)</span>
            </div>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#24123e] border border-purple-200 dark:border-[#4c1d95] shadow-sm">
              <div className="text-xs text-slate-500 dark:text-[#c084fc] font-bold uppercase">Time Taken</div>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-1 flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                {minutesSpent}m {secondsSpent}s
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#24123e] border border-purple-200 dark:border-[#4c1d95] shadow-sm">
              <div className="text-xs text-slate-500 dark:text-[#c084fc] font-bold uppercase">Correct Answers</div>
              <div className="text-lg font-black text-purple-600 dark:text-purple-300 mt-1">{score}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#24123e] border border-purple-200 dark:border-[#4c1d95] shadow-sm">
              <div className="text-xs text-slate-500 dark:text-[#c084fc] font-bold uppercase">Incorrect</div>
              <div className="text-lg font-black text-rose-600 dark:text-rose-400 mt-1">{totalQuestions - score}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#24123e] border border-purple-200 dark:border-[#4c1d95] shadow-sm">
              <div className="text-xs text-slate-500 dark:text-[#c084fc] font-bold uppercase">Exclusion Memory</div>
              <div className="text-lg font-black text-amber-600 dark:text-amber-300 mt-1">{excludedTopics.length} Topics</div>
            </div>
          </div>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={takeAnotherExam}
              disabled={isLoadingQuestions}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-base sm:text-lg shadow-lg flex items-center justify-center gap-2.5 transition-all border border-purple-500 cursor-pointer"
            >
              <RotateCcw className={`w-5 h-5 ${isLoadingQuestions ? 'animate-spin' : ''}`} />
              <span>{isLoadingQuestions ? 'Generating New Questions...' : 'Take Another Exam (New Questions)'}</span>
            </button>

            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-purple-50 dark:bg-[#3b0764] hover:bg-purple-100 dark:hover:bg-[#4c1d95] text-purple-900 dark:text-purple-200 font-extrabold text-sm border border-purple-200 dark:border-[#4c1d95] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4 text-purple-600 dark:text-purple-300" />
              <span>Send Scorecard Email</span>
            </button>

            <button
              onClick={() => setView('analytics')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-purple-50 dark:bg-[#3b0764] hover:bg-purple-100 dark:hover:bg-[#4c1d95] text-purple-900 dark:text-purple-200 font-extrabold text-sm border border-purple-200 dark:border-[#4c1d95] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-300" />
              <span>View Detailed Analytics</span>
            </button>

            <button
              onClick={resetExam}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-purple-50 dark:bg-[#24123e] hover:bg-purple-100 dark:hover:bg-[#3b0764] text-slate-800 dark:text-purple-100 font-extrabold text-sm border border-purple-200 dark:border-[#4c1d95] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" /> Home Dashboard
            </button>
          </div>
        </section>

        {/* ANALYTICS SECTION: CHAPTER MASTERY & K-LEVEL BREAKDOWN */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chapter Performance Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#24123e] border border-purple-200 dark:border-[#4c1d95] space-y-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-purple-200 dark:border-[#4c1d95]">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              <h3 className="font-black text-slate-900 dark:text-white text-xl">Chapter Mastery Breakdown</h3>
            </div>

            <div className="space-y-4">
              {ISTQB_CHAPTERS.map((ch) => {
                const stat = chapterScores[ch.id] || { correct: 0, total: ch.questionCount, percentage: 0 };
                return (
                  <div key={ch.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm font-bold">
                      <span className="text-slate-800 dark:text-purple-100 truncate max-w-xs">
                        Ch {ch.id}: {ch.title}
                      </span>
                      <span className="text-slate-500 dark:text-[#c084fc] font-mono">
                        {stat.correct}/{stat.total} ({stat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-purple-50 dark:bg-[#180e29] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          stat.percentage >= 65 ? 'bg-purple-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cognitive Level Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#24123e] border border-purple-200 dark:border-[#4c1d95] space-y-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-purple-200 dark:border-[#4c1d95]">
              <Layers className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              <h3 className="font-black text-slate-900 dark:text-white text-xl">Cognitive K-Level Analytics</h3>
            </div>

            <div className="space-y-6">
              {(['K1', 'K2', 'K3'] as const).map((kKey) => {
                const stat = kLevelScores[kKey] || { correct: 0, total: 0, percentage: 0 };
                const desc = K_LEVEL_DESCRIPTIONS[kKey];

                return (
                  <div key={kKey} className="p-4 sm:p-5 rounded-2xl bg-purple-50/60 dark:bg-[#180e29]/60 border border-purple-200 dark:border-[#4c1d95] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {kKey} - {desc.title}
                      </span>
                      <span className={`text-sm font-black font-mono ${stat.percentage >= 65 ? 'text-purple-600 dark:text-purple-300' : 'text-rose-600 dark:text-rose-400'}`}>
                        {stat.correct}/{stat.total} ({stat.percentage}%)
                      </span>
                    </div>

                    <div className="w-full h-3 bg-purple-100 dark:bg-[#3b0764] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          stat.percentage >= 65 ? 'bg-purple-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#c084fc] leading-relaxed font-medium">{desc.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* DETAILED QUESTION REVIEW SECTION */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-purple-200 dark:border-[#4c1d95]">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-2xl flex items-center gap-2.5">
                <Filter className="w-6 h-6 text-purple-600 dark:text-purple-300" /> Exam Question Review Mode
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#c084fc] font-medium">Review answers, correct selections, and rationale explanations.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-white dark:bg-[#24123e] p-1.5 rounded-2xl border border-purple-200 dark:border-[#4c1d95] text-xs sm:text-sm font-extrabold shadow-sm">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
                  filterMode === 'all' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-[#c084fc] hover:text-purple-400'
                }`}
              >
                All ({questions.length})
              </button>
              <button
                onClick={() => setFilterMode('incorrect')}
                className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
                  filterMode === 'incorrect' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-[#c084fc] hover:text-rose-400'
                }`}
              >
                Incorrect ({totalQuestions - score})
              </button>
              <button
                onClick={() => setFilterMode('correct')}
                className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
                  filterMode === 'correct' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-[#c084fc] hover:text-purple-400'
                }`}
              >
                Correct ({score})
              </button>
            </div>
          </div>

          {/* Review Question Cards */}
          <div className="space-y-6">
            {filteredQuestions.map((q) => {
              const uAns = userAnswers[q.id]?.selectedOption;
              const isCorrect = uAns === q.correct_answer;
              const isExpanded = openExplanationId === q.id;

              return (
                <div
                  key={q.id}
                  className={`p-6 sm:p-8 rounded-3xl border bg-white dark:bg-[#24123e] space-y-5 transition-all shadow-sm ${
                    isCorrect ? 'border-purple-300 dark:border-purple-500/50' : 'border-rose-300 dark:border-rose-500/40'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-purple-600 text-white text-xs font-black flex items-center justify-center">
                        #{q.id}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-[#3b0764] text-purple-900 dark:text-purple-200 text-xs font-extrabold border border-purple-200 dark:border-[#4c1d95]">
                        Ch {q.chapter}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-[#3b0764] text-purple-900 dark:text-purple-200 text-xs font-extrabold border border-purple-200 dark:border-[#4c1d95]">
                        {q.k_level}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 dark:bg-[#3b0764] text-purple-700 dark:text-purple-200 text-xs font-extrabold border border-purple-200 dark:border-[#4c1d95]">
                          <Check className="w-4 h-4 text-purple-600 dark:text-purple-300" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-extrabold border border-rose-200 dark:border-rose-500/20">
                          <X className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Incorrect
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Stem */}
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">{q.question}</h4>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-3 pt-1">
                    {q.options.map((opt, i) => {
                      const isUserChoice = uAns === opt;
                      const isRightChoice = q.correct_answer === opt;

                      let style = 'bg-slate-50/80 dark:bg-[#180e29]/60 border-purple-100 dark:border-[#4c1d95]/60 text-slate-800 dark:text-[#c084fc]';
                      if (isRightChoice) {
                        style = 'bg-purple-50 dark:bg-[#3b0764] border-purple-300 dark:border-purple-500/50 text-purple-900 dark:text-purple-100 font-bold';
                      } else if (isUserChoice && !isCorrect) {
                        style = 'bg-rose-50 dark:bg-rose-500/20 border-rose-300 dark:border-rose-500/50 text-rose-900 dark:text-rose-200 font-bold';
                      }

                      return (
                        <div
                          key={i}
                          className={`p-4 sm:p-4.5 rounded-2xl border text-sm sm:text-base flex items-center justify-between ${style}`}
                        >
                          <span className="flex items-start gap-3">
                            <span className="font-extrabold opacity-80 shrink-0">{String.fromCharCode(65 + i)}.</span>
                            <span className="leading-relaxed">{opt}</span>
                          </span>
                          {isRightChoice && <span className="text-xs uppercase font-extrabold text-purple-600 dark:text-purple-300 shrink-0 ml-2">Correct Answer</span>}
                          {isUserChoice && !isRightChoice && (
                            <span className="text-xs uppercase font-extrabold text-rose-600 dark:text-rose-400 shrink-0 ml-2">Your Choice</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Toggle */}
                  <div className="pt-3 border-t border-purple-200 dark:border-[#4c1d95]">
                    <button
                      onClick={() => setOpenExplanationId(isExpanded ? null : q.id)}
                      className="w-full flex items-center justify-between text-xs sm:text-sm font-extrabold text-purple-700 dark:text-purple-300 hover:text-purple-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" /> Explanation & Rationale
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-5 rounded-2xl bg-purple-50/60 dark:bg-[#180e29]/80 border border-purple-200 dark:border-[#4c1d95] text-sm text-slate-800 dark:text-purple-100 leading-relaxed font-medium">
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* EMAIL REPORT MODAL */}
      <EmailReportModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );

};
