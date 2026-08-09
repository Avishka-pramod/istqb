import React from 'react';
import { useExam } from '../context/ExamContext';
import { ISTQB_CHAPTERS } from '../data/istqbSyllabus';
import type { ExamSession } from '../types/exam';
import {
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Calendar,
  ArrowLeft,
  CheckSquare,
  ChevronRight
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { examHistory, takeAnotherExam, resetExam, goBack, isLoadingQuestions, user, setView, setCurrentSession } = useExam();

  if (examHistory.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf5ff] dark:bg-[#180e29] text-slate-900 dark:text-purple-50 py-16 px-4">
        <div className="max-w-xl mx-auto text-center space-y-6 bg-white dark:bg-[#24123e] p-8 sm:p-12 rounded-3xl border border-purple-200 dark:border-[#4c1d95] shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-300 flex items-center justify-center mx-auto border border-purple-500/20">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">No Exam Analytics Yet</h2>
            <p className="text-sm text-slate-600 dark:text-[#c084fc]">
              Complete your first ISTQB CTFL v4.0 practice exam to unlock comparative analytics and accuracy trend graphs.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={goBack}
              className="px-6 py-3 rounded-xl bg-purple-50 dark:bg-[#180e29] text-slate-800 dark:text-purple-100 font-extrabold text-sm border border-purple-200 dark:border-[#4c1d95] flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={takeAnotherExam}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-md border border-purple-500 transition-all cursor-pointer"
            >
              Start Practice Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Reverse to show chronological order (1st attempt, 2nd attempt, etc.)
  const chronologicalHistory = [...examHistory].reverse();
  const latestSession = examHistory[0];

  // Calculate metrics
  const totalAttempts = examHistory.length;
  const passedAttempts = examHistory.filter((s) => s.passed).length;

  const firstScore = chronologicalHistory[0]?.score || 0;
  const latestScore = latestSession?.score || 0;
  const scoreImprovement = latestScore - firstScore;

  const avgScore = Math.round(
    examHistory.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts
  );

  const avgTimeMinutes = Math.round(
    examHistory.reduce((acc, curr) => acc + Math.round(curr.timeSpentSeconds / 60), 0) / totalAttempts
  );

  const handleViewSessionResult = (sess: ExamSession) => {
    setCurrentSession(sess);
    setView('results');
  };

  return (
    <div className="min-h-screen bg-[#faf5ff] dark:bg-[#180e29] text-slate-900 dark:text-purple-50 pb-20 selection:bg-purple-600 selection:text-white transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* TOP NAVIGATION & HEADER BAR */}
        <div className="space-y-4 pb-4 border-b border-purple-200 dark:border-[#4c1d95]">
          {/* DYNAMIC GO BACK BUTTON BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={goBack}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#24123e] text-slate-800 dark:text-purple-100 font-extrabold text-xs sm:text-sm border border-purple-200 dark:border-[#4c1d95] hover:bg-purple-50 dark:hover:bg-[#3b0764] shadow-sm transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                <span>Back</span>
              </button>

              <button
                onClick={() => handleViewSessionResult(latestSession)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 dark:bg-[#3b0764] text-purple-900 dark:text-purple-200 font-extrabold text-xs sm:text-sm border border-purple-200 dark:border-[#4c1d95] hover:bg-purple-100 dark:hover:bg-[#4c1d95] shadow-sm transition-all cursor-pointer"
              >
                <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                <span>View Last Result (Scorecard)</span>
              </button>
            </div>

            <button
              onClick={resetExam}
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#c084fc] font-bold hover:text-purple-400 cursor-pointer"
            >
              Home Dashboard
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-1">
                <Sparkles className="w-4 h-4" /> Student Performance Dashboard
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {user ? `${user.name}'s Analytics` : 'Performance & Progress Analytics'}
              </h1>
              <p className="text-sm text-slate-600 dark:text-[#c084fc]">
                Track attempt-by-attempt accuracy growth, time efficiency, and syllabus chapter mastery over time.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleViewSessionResult(latestSession)}
                className="px-5 py-3 rounded-2xl bg-purple-50 dark:bg-[#3b0764] text-purple-900 dark:text-purple-200 font-extrabold text-sm border border-purple-200 dark:border-[#4c1d95] hover:bg-purple-100 dark:hover:bg-[#4c1d95] flex items-center gap-2 transition-all cursor-pointer"
              >
                <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                <span>Back to Scorecard</span>
              </button>

              <button
                onClick={takeAnotherExam}
                disabled={isLoadingQuestions}
                className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-md flex items-center gap-2 transition-all border border-purple-500 cursor-pointer"
              >
                <RotateCcw className={`w-4 h-4 ${isLoadingQuestions ? 'animate-spin' : ''}`} />
                <span>Take Next Attempt</span>
              </button>
            </div>
          </div>
        </div>

        {/* SUMMARY METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#24123e] border border-purple-200 dark:border-[#4c1d95] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-[#c084fc] uppercase">
              <span>Total Attempts</span>
              <Award className="w-4 h-4 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {totalAttempts} <span className="text-sm font-semibold text-purple-600 dark:text-purple-300">({passedAttempts} Passed)</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-[#c084fc] font-medium">
              Average Score: {avgScore} / 40 ({Math.round((avgScore / 40) * 100)}%)
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#24123e] border border-purple-200 dark:border-[#4c1d95] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-[#c084fc] uppercase">
              <span>Accuracy Trend</span>
              <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              {Math.round((latestScore / 40) * 100)}%
              {scoreImprovement >= 0 ? (
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-purple-100 dark:bg-[#3b0764] text-purple-900 dark:text-purple-200 flex items-center border border-purple-200 dark:border-[#4c1d95]">
                  +{scoreImprovement * 2.5}% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              ) : (
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300">
                  {scoreImprovement * 2.5}%
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 dark:text-[#c084fc] font-medium">
              First Attempt: {firstScore}/40 ➔ Latest: {latestScore}/40
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#24123e] border border-purple-200 dark:border-[#4c1d95] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-[#c084fc] uppercase">
              <span>Time Management</span>
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {avgTimeMinutes} <span className="text-sm font-semibold text-slate-500 dark:text-[#c084fc]">mins / exam</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-[#c084fc] font-medium">
              ~{Math.round((avgTimeMinutes * 60) / 40)} seconds per question
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#24123e] border border-purple-200 dark:border-[#4c1d95] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-[#c084fc] uppercase">
              <span>Syllabus Coverage</span>
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {latestSession?.excludedTopics?.length || 0} <span className="text-sm font-semibold text-slate-500 dark:text-[#c084fc]">Topics</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-[#c084fc] font-medium">
              Zero repetition across retakes
            </div>
          </div>
        </div>

        {/* COMPARATIVE ATTEMPT HISTORY TIMELINE */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-purple-200 dark:border-[#4c1d95]">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-700 dark:text-purple-300" /> Historical Attempt Comparison
            </h2>
            <span className="text-xs text-slate-500 dark:text-[#c084fc] font-bold uppercase">
              {totalAttempts} Saved Attempts (Click any attempt to view answers)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chronologicalHistory.map((sess, idx) => {
              const attemptNum = idx + 1;
              const pct = Math.round((sess.score / sess.totalQuestions) * 100);
              const mins = Math.floor(sess.timeSpentSeconds / 60);

              return (
                <div
                  key={sess.id}
                  onClick={() => handleViewSessionResult(sess)}
                  className={`p-6 rounded-3xl border bg-white dark:bg-[#24123e] space-y-4 shadow-sm relative transition-all hover:shadow-md hover:border-purple-500 cursor-pointer group ${
                    sess.passed ? 'border-purple-300 dark:border-purple-500/50' : 'border-rose-300 dark:border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-[#180e29] text-slate-800 dark:text-[#c084fc] font-extrabold text-xs">
                      Attempt #{attemptNum}
                    </span>
                    {sess.passed ? (
                      <span className="flex items-center gap-1 text-xs font-black text-purple-800 dark:text-purple-200 bg-purple-50 dark:bg-[#3b0764] px-2.5 py-1 rounded-full border border-purple-200 dark:border-[#4c1d95]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-black text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" /> FAILED
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-3xl font-black text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{sess.score} / {sess.totalQuestions} <span className="text-lg font-bold text-slate-500 dark:text-[#c084fc]">({pct}%)</span></span>
                      <ChevronRight className="w-5 h-5 text-purple-600 dark:text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-[#c084fc] font-medium">
                      Completed in {mins} minutes ({sess.durationMinutes}m time limit)
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-purple-50 dark:bg-[#180e29] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${sess.passed ? 'bg-purple-500' : 'bg-rose-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-400 dark:text-purple-200/60 font-mono pt-2 border-t border-purple-100 dark:border-[#4c1d95] flex items-center justify-between">
                    <span>{sess.timestamp}</span>
                    <span className="text-purple-600 dark:text-purple-300 font-extrabold flex items-center gap-0.5">
                      Review Answers <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CHAPTER-WISE MASTERY MATRIX OVER TIME */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#24123e] border border-purple-200 dark:border-[#4c1d95] shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-purple-200 dark:border-[#4c1d95]">
            <BookOpen className="w-6 h-6 text-purple-700 dark:text-purple-300" />
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-xl">Syllabus Chapter Mastery Trends</h3>
              <p className="text-xs text-slate-500 dark:text-[#c084fc]">Analysis based on your latest practice attempt.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ISTQB_CHAPTERS.map((ch) => {
              const stat = latestSession?.chapterScores?.[ch.id] || { correct: 0, total: ch.questionCount, percentage: 0 };
              const isStrong = stat.percentage >= 65;

              return (
                <div key={ch.id} className="p-4 rounded-2xl bg-purple-50/50 dark:bg-[#180e29]/60 border border-purple-100 dark:border-[#4c1d95] space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <span className="text-slate-900 dark:text-white">
                      Ch {ch.id}: {ch.title}
                    </span>
                    <span className={`font-mono px-2 py-0.5 rounded text-xs ${isStrong ? 'bg-purple-100 dark:bg-[#3b0764] text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-[#4c1d95]' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'}`}>
                      {stat.correct}/{stat.total} ({stat.percentage}%)
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-purple-100 dark:bg-[#180e29] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isStrong ? 'bg-purple-500' : 'bg-rose-500'}`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>

                  <div className="text-xs text-slate-500 dark:text-[#c084fc]">
                    {isStrong ? (
                      <span className="text-purple-600 dark:text-purple-300 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Strong Area - Target achieved!
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-300 font-semibold flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> Focus Area - Recommend reviewing syllabus notes.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MOTIVATIONAL STRIVE FOR PROGRESS FOOTER */}
        <section className="p-8 rounded-3xl bg-gradient-to-r from-[#180e29] via-[#24123e] to-[#180e29] text-white space-y-4 shadow-lg text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#4c1d95]">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3b0764] text-purple-200 text-xs font-bold uppercase border border-[#4c1d95]">
              <Sparkles className="w-3.5 h-3.5" /> Strive For Progress
            </div>
            <h3 className="text-2xl font-black">Keep Testing to Reach 100% Exam Confidence</h3>
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
              Every attempt excludes previously tested concepts and introduces fresh scenarios, ensuring comprehensive syllabus coverage before your official ISTQB CTFL v4.0 examination.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleViewSessionResult(latestSession)}
              className="px-6 py-4 rounded-2xl bg-[#3b0764] hover:bg-[#4c1d95] text-purple-200 font-extrabold text-sm shrink-0 transition-all border border-[#4c1d95] cursor-pointer"
            >
              Back to Scorecard
            </button>
            <button
              onClick={takeAnotherExam}
              disabled={isLoadingQuestions}
              className="px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-xl shrink-0 transition-all border border-purple-500 cursor-pointer"
            >
              {isLoadingQuestions ? 'Generating Questions...' : 'Take Next Attempt'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );

};
