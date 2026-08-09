import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { ISTQB_CHAPTERS, K_LEVEL_DESCRIPTIONS, TOTAL_QUESTIONS, PASSING_SCORE_COUNT } from '../data/istqbSyllabus';
import { Play, BookOpen, Layers, CheckCircle2, ChevronDown, ChevronUp, Sparkles, RefreshCw, ShieldCheck, BarChart3 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { config, updateConfig, startExam, isLoadingQuestions, excludedTopics, setView, examHistory, user } = useExam();
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1);

  const toggleChapter = (id: number) => {
    setExpandedChapter(expandedChapter === id ? null : id);
  };

  return (
    <div className="min-h-screen pb-20 bg-[#faf5ff] dark:bg-[#180e29] text-slate-900 dark:text-purple-50 transition-colors duration-200">
      {/* Testportal Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#180e29] via-[#24123e] to-[#180e29] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#4c1d95] shadow-md">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3b0764] border border-[#4c1d95] text-purple-200 text-xs sm:text-sm font-extrabold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-300" /> Official Testportal Enterprise SQA Simulator
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Master the <span className="text-purple-300">ISTQB CTFL v4.0</span> Exam
          </h1>

          <p className="text-lg sm:text-xl text-purple-100/90 leading-relaxed max-w-3xl mx-auto font-medium">
            Simulate official 40-question foundation level practice exams dynamically generated strictly according to syllabus chapter weightings, Cognitive level mappings, and past paper styles.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
            <div className="p-4 rounded-2xl bg-[#24123e]/90 backdrop-blur-md border border-[#4c1d95] text-center shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-white">{TOTAL_QUESTIONS}</div>
              <div className="text-xs text-[#c084fc] font-bold mt-1">Questions per Exam</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#24123e]/90 backdrop-blur-md border border-[#4c1d95] text-center shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-purple-300">65%</div>
              <div className="text-xs text-[#c084fc] font-bold mt-1">Passing Mark ({PASSING_SCORE_COUNT}/40)</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#24123e]/90 backdrop-blur-md border border-[#4c1d95] text-center shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-white">
                {config.durationMinutes}m
              </div>
              <div className="text-xs text-[#c084fc] font-bold mt-1">Timer Countdown</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#24123e]/90 backdrop-blur-md border border-[#4c1d95] text-center shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-amber-300">
                {user ? excludedTopics.length : 0}
              </div>
              <div className="text-xs text-[#c084fc] font-bold mt-1">Excluded Topics</div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16 relative z-10">
        {/* Configuration & CTA Box */}
        <section className="max-w-2xl mx-auto -mt-16 relative z-20">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#24123e] border border-purple-200 dark:border-[#4c1d95] shadow-xl space-y-6">
            {/* Exam Time Limit Selector */}
            <div>
              <label className="block text-xs sm:text-sm font-extrabold text-slate-700 dark:text-purple-100 mb-3 uppercase tracking-wider text-left">
                Select Exam Time Limit
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateConfig({ durationMinutes: 60 })}
                  className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border cursor-pointer ${
                    config.durationMinutes === 60
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                      : 'bg-purple-50 dark:bg-[#180e29]/80 text-slate-700 dark:text-[#c084fc] border-purple-200 dark:border-[#4c1d95] hover:bg-purple-100 dark:hover:bg-[#3b0764]'
                  }`}
                >
                  60 Mins (Standard Time)
                </button>
                <button
                  type="button"
                  onClick={() => updateConfig({ durationMinutes: 75 })}
                  className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border cursor-pointer ${
                    config.durationMinutes === 75
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                      : 'bg-purple-50 dark:bg-[#180e29]/80 text-slate-700 dark:text-[#c084fc] border-purple-200 dark:border-[#4c1d95] hover:bg-purple-100 dark:hover:bg-[#3b0764]'
                  }`}
                >
                  75 Mins (Extended Time)
                </button>
              </div>
            </div>

            {/* START EXAM CTA BUTTON */}
            <button
              onClick={startExam}
              disabled={isLoadingQuestions}
              className="w-full py-4 sm:py-5 px-8 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-lg sm:text-xl shadow-xl transition-all transform active:scale-98 flex items-center justify-center gap-3 border border-purple-500 disabled:opacity-50 cursor-pointer"
            >
              {isLoadingQuestions ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin text-white" />
                  <span>Generating 40 ISTQB Questions...</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  <span>Start ISTQB CTFL v4.0 Exam</span>
                </>
              )}
            </button>

            {/* Analytics Dashboard Trigger if history exists */}
            {user && examHistory.length > 0 && (
              <button
                type="button"
                onClick={() => setView('analytics')}
                className="w-full py-3 px-4 rounded-2xl bg-purple-50 dark:bg-[#3b0764] border border-purple-200 dark:border-[#4c1d95] text-purple-900 dark:text-purple-200 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-purple-100 dark:hover:bg-[#4c1d95] transition-all cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>View Performance Trends ({examHistory.length} Attempts Saved)</span>
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-purple-700 dark:text-purple-300 pt-1">
              <ShieldCheck className="w-4 h-4" /> Secure Backend API & Testportal Engine Active
            </div>

            {user && excludedTopics.length > 0 && (
              <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1.5 font-medium">
                <RefreshCw className="w-3.5 h-3.5" /> Retake Mode Active: {excludedTopics.length} previously tested topics will be excluded to ensure zero question repetition.
              </p>
            )}
          </div>
        </section>

        {/* COGNITIVE K-LEVEL BREAKDOWN */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <Layers className="w-6 h-6 text-purple-600 dark:text-purple-300" /> Cognitive Levels (K-Levels)
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#c084fc] font-medium">
              The Foundation Level exam contains K1, K2, and K3 level questions (No K4).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(['K1', 'K2', 'K3'] as const).map((kKey) => {
              const info = K_LEVEL_DESCRIPTIONS[kKey];
              return (
                <div
                  key={kKey}
                  className="p-6 rounded-2xl bg-white dark:bg-[#24123e] border border-purple-200 dark:border-[#4c1d95] transition-colors space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-[#3b0764] text-purple-900 dark:text-purple-200 text-xs font-black border border-purple-200 dark:border-[#4c1d95]">
                      {kKey} - {info.title}
                    </span>
                    <span className="text-sm font-bold text-slate-700 dark:text-purple-100">{info.total} Questions</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-[#c084fc] leading-relaxed font-medium">{info.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SYLLABUS CHAPTER DISTRIBUTION ACCORDION */}
        <section className="space-y-6 max-w-5xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-300" /> Official Syllabus Distribution (40 Questions)
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#c084fc] font-medium">
              Check the exact chapter breakdown and topic weightings enforced during exam generation.
            </p>
          </div>

          <div className="space-y-3.5">
            {ISTQB_CHAPTERS.map((ch) => (
              <div
                key={ch.id}
                className="rounded-2xl bg-white dark:bg-[#24123e] border border-purple-200 dark:border-[#4c1d95] overflow-hidden transition-colors shadow-sm"
              >
                <button
                  onClick={() => toggleChapter(ch.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-purple-50/50 dark:hover:bg-[#3b0764] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                      Ch {ch.id}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">{ch.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-[#c084fc] hidden sm:block">{ch.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-[#3b0764] text-purple-900 dark:text-purple-200 font-extrabold text-xs border border-purple-200 dark:border-[#4c1d95]">
                        {ch.questionCount} Questions
                      </span>
                    </div>
                    {expandedChapter === ch.id ? (
                      <ChevronUp className="w-5 h-5 text-slate-500 dark:text-[#c084fc]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500 dark:text-[#c084fc]" />
                    )}
                  </div>
                </button>

                {expandedChapter === ch.id && (
                  <div className="px-6 pb-6 pt-3 border-t border-purple-200 dark:border-[#4c1d95] bg-purple-50/30 dark:bg-[#180e29]/60 space-y-4">
                    {/* K-Level Breakdown Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="text-xs font-bold text-slate-500 dark:text-[#c084fc] mr-2">Question Breakdown:</span>
                      {ch.kLevelBreakdown.K1 > 0 && (
                        <span className="px-3 py-1 text-xs font-extrabold rounded-md bg-purple-50 dark:bg-[#3b0764] text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-[#4c1d95]">
                          {ch.kLevelBreakdown.K1}x K1 (Remember)
                        </span>
                      )}
                      {ch.kLevelBreakdown.K2 > 0 && (
                        <span className="px-3 py-1 text-xs font-extrabold rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700/50">
                          {ch.kLevelBreakdown.K2}x K2 (Understand)
                        </span>
                      )}
                      {ch.kLevelBreakdown.K3 > 0 && (
                        <span className="px-3 py-1 text-xs font-extrabold rounded-md bg-violet-50 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200 border border-violet-200 dark:border-violet-700/50">
                          {ch.kLevelBreakdown.K3}x K3 (Apply)
                        </span>
                      )}
                    </div>

                    {/* Key Topics List */}
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-700 dark:text-purple-100 uppercase tracking-wider mb-2.5">
                        Key Chapter Syllabus Topics
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {ch.keyTopics.map((topic, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-[#c084fc] font-medium">
                            <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );

};
