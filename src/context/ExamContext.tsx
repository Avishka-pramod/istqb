import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Question, ExamConfig, UserAnswer, ExamSession, KLevel, UserProfile } from '../types/exam';
import { generateExamQuestions } from '../services/llmService';
import { auth, onAuthStateChanged, firebaseLogout } from '../services/firebase';

import { triggerGoogleOAuthPopup, triggerFacebookOAuthPopup } from '../services/oauthService';
import { sendExamScorecardEmail } from '../services/emailService';

type ViewType = 'landing' | 'exam' | 'results' | 'analytics';
export type ThemeMode = 'aurora' | 'dark' | 'light';

interface ExamContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
  view: ViewType;
  setView: (v: ViewType) => void;
  goBack: () => void;
  config: ExamConfig;
  updateConfig: (newConfig: Partial<ExamConfig>) => void;
  user: UserProfile | null;
  login: (name: string, email: string) => void;
  signup: (name: string, email: string) => void;
  socialLogin: (provider: 'google' | 'facebook', providedEmail?: string, providedName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  questions: Question[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number) => void;
  userAnswers: Record<number, UserAnswer>;
  selectOption: (questionId: number, option: string) => void;
  toggleFlag: (questionId: number) => void;
  clearSelection: (questionId: number) => void;
  timeRemainingSeconds: number;
  isTimerRunning: boolean;
  setIsTimerRunning: (running: boolean) => void;
  isLoadingQuestions: boolean;
  startExam: () => Promise<void>;
  submitExam: () => void;
  resetExam: () => void;
  takeAnotherExam: () => Promise<void>;
  currentSession: ExamSession | null;
  setCurrentSession: (session: ExamSession | null) => void;
  excludedTopics: string[];
  clearExclusionHistory: () => void;
  examHistory: ExamSession[];
  isSettingsModalOpen: boolean;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'istqb_ctfl_theme';
const EXCLUSION_STORAGE_KEY = 'istqb_ctfl_excluded_topics';
const HISTORY_STORAGE_KEY = 'istqb_ctfl_exam_history';
const CONFIG_STORAGE_KEY = 'istqb_ctfl_config';
const USER_STORAGE_KEY = 'istqb_ctfl_user_profile';
const ACTIVE_SESSION_STORAGE_KEY = 'istqb_active_exam_session';

const getSystemTheme = (): ThemeMode => {
  return 'aurora';
};

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
    return saved === 'aurora' || saved === 'dark' || saved === 'light' ? saved : getSystemTheme();
  });

  const [view, setViewState] = useState<ViewType>('landing');
  const [viewHistoryStack, setViewHistoryStack] = useState<ViewType[]>(['landing']);

  const [config, setConfig] = useState<ExamConfig>(() => {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    return saved ? JSON.parse(saved) : { durationMinutes: 60 };
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email === 'student.google@gmail.com' || parsed.email === 'student.facebook@facebook.com') {
          localStorage.removeItem(USER_STORAGE_KEY);
          return null;
        }
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [pendingExamStart, setPendingExamStart] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(3600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const [examHistory, setExamHistory] = useState<ExamSession[]>(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSession, setCurrentSession] = useState<ExamSession | null>(() => {
    return examHistory.length > 0 ? examHistory[0] : null;
  });

  const [excludedTopics, setExcludedTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem(EXCLUSION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  // Active exam session auto-restore on initial mount
  useEffect(() => {
    const savedActive = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (savedActive) {
      try {
        const parsed = JSON.parse(savedActive);
        if (parsed.questions && parsed.questions.length > 0) {
          setQuestions(parsed.questions);
          setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
          setUserAnswers(parsed.userAnswers || {});
          setTimeRemainingSeconds(parsed.timeRemainingSeconds || 3600);
          setIsTimerRunning(true);
          setViewState('exam');
        }
      } catch (e) {
        console.warn('Failed to restore active exam session:', e);
      }
    }
  }, []);

  // Real-time active exam auto-save on question, answer, index, or timer change
  useEffect(() => {
    if (questions.length > 0 && isTimerRunning) {
      const activePayload = {
        questions,
        currentQuestionIndex,
        userAnswers,
        timeRemainingSeconds,
        savedAt: Date.now()
      };
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(activePayload));
    }
  }, [questions, currentQuestionIndex, userAnswers, timeRemainingSeconds, isTimerRunning]);

  // Sync theme class to document root & body & localStorage
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('aurora', 'dark', 'light');
    body.classList.remove('aurora', 'dark', 'light');

    if (theme === 'aurora') {
      root.classList.add('aurora', 'dark');
      body.classList.add('aurora', 'dark');
    } else if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.add('light');
      body.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => {
      const nextTheme: ThemeMode = prev === 'aurora' ? 'dark' : prev === 'dark' ? 'light' : 'aurora';
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      return nextTheme;
    });
  };

  const setTheme = (newTheme: ThemeMode) => {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    setThemeState(newTheme);
  };


  // Custom setView pushing into history stack and browser history
  const setView = (newView: ViewType) => {
    if (newView === view) return;
    setViewHistoryStack((prev) => [...prev, newView]);
    setViewState(newView);
    try {
      window.history.pushState({ view: newView }, '', window.location.pathname);
    } catch {
      // Ignore if iframe/sandbox restricts pushState
    }
  };

  // Go back through history stack or browser history
  const goBack = () => {
    if (viewHistoryStack.length > 1) {
      const newStack = [...viewHistoryStack];
      newStack.pop(); // remove current view
      const prevView = newStack[newStack.length - 1];
      setViewHistoryStack(newStack);
      setViewState(prevView);
    } else {
      // Default fallback to landing
      setViewState('landing');
      setViewHistoryStack(['landing']);
    }
    try {
      if (window.history.length > 1) {
        window.history.back();
      }
    } catch {
      // Fallback handled by internal stack above
    }
  };

  // Browser popstate event handler (Back/Forward browser buttons)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.view) {
        setViewState(e.state.view);
      } else if (viewHistoryStack.length > 1) {
        const newStack = [...viewHistoryStack];
        newStack.pop();
        const prevView = newStack[newStack.length - 1] || 'landing';
        setViewHistoryStack(newStack);
        setViewState(prevView);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [viewHistoryStack]);

  const getUserHistoryKey = (u?: UserProfile | null) => {
    if (u?.id) return `istqb_ctfl_history_user_${u.id}`;
    if (u?.email) return `istqb_ctfl_history_user_${u.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    return HISTORY_STORAGE_KEY;
  };

  const getUserExclusionKey = (u?: UserProfile | null) => {
    if (u?.id) return `istqb_ctfl_exclusion_user_${u.id}`;
    if (u?.email) return `istqb_ctfl_exclusion_user_${u.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    return EXCLUSION_STORAGE_KEY;
  };

  useEffect(() => {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  // Restore user-specific history and analytics when user authenticates
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      const uHistoryKey = getUserHistoryKey(user);
      const savedUserHistory = localStorage.getItem(uHistoryKey) || localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedUserHistory) {
        try {
          const parsed = JSON.parse(savedUserHistory);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setExamHistory(parsed);
            setCurrentSession(parsed[0]);
          }
        } catch (e) {
          console.warn('Error parsing user exam history:', e);
        }
      }

      const uExclusionKey = getUserExclusionKey(user);
      const savedUserExclusion = localStorage.getItem(uExclusionKey) || localStorage.getItem(EXCLUSION_STORAGE_KEY);
      if (savedUserExclusion) {
        try {
          setExcludedTopics(JSON.parse(savedUserExclusion));
        } catch (e) {
          console.warn('Error parsing user exclusion topics:', e);
        }
      }
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  // Sync excluded topics to user-specific and global storage
  useEffect(() => {
    const key = getUserExclusionKey(user);
    localStorage.setItem(key, JSON.stringify(excludedTopics));
    localStorage.setItem(EXCLUSION_STORAGE_KEY, JSON.stringify(excludedTopics));
  }, [excludedTopics, user]);

  // Sync exam history to user-specific and global storage
  useEffect(() => {
    const key = getUserHistoryKey(user);
    localStorage.setItem(key, JSON.stringify(examHistory));
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(examHistory));
    if (examHistory.length > 0 && !currentSession) {
      setCurrentSession(examHistory[0]);
    }
  }, [examHistory, currentSession, user]);

  // Countdown timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemainingSeconds]);

  const updateConfig = (newConfig: Partial<ExamConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const executeStartExam = async () => {
    setIsLoadingQuestions(true);
    try {
      const qList = await generateExamQuestions(excludedTopics);
      setQuestions(qList);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setTimeRemainingSeconds(config.durationMinutes * 60);
      setIsTimerRunning(true);
      setView('exam');
    } catch (err) {
      console.error('Failed to start exam:', err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handlePostAuthProceed = () => {
    if (pendingExamStart) {
      setPendingExamStart(false);
      executeStartExam();
    }
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    handlePostAuthProceed();
  };

  const login = (name: string, email: string) => {
    const profile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name.trim() || 'Student User',
      email: email.trim() || 'student@istqb.edu',
      createdAt: new Date().toLocaleDateString(),
      provider: 'email'
    };
    setUser(profile);
    setIsAuthModalOpen(false);
    handlePostAuthProceed();
  };

  const signup = (name: string, email: string) => {
    login(name, email);
  };

  // Listen for Firebase Auth state changes for real-account binding
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const providerId = fbUser.providerData?.[0]?.providerId || '';
        const provider: 'google' | 'facebook' | 'email' = providerId.includes('google')
          ? 'google'
          : providerId.includes('facebook')
          ? 'facebook'
          : 'email';

        const realName = fbUser.displayName || fbUser.email?.split('@')[0] || 'User';
        const realEmail = fbUser.email || `${fbUser.uid}@istqb.edu`;
        const realPhoto = fbUser.photoURL || undefined;

        setUser((prev) => {
          // Keep existing if matching UID, otherwise update
          if (prev?.id === fbUser.uid) return prev;
          return {
            id: fbUser.uid,
            name: realName,
            email: realEmail,
            createdAt: prev?.createdAt || new Date().toLocaleDateString(),
            provider,
            avatarUrl: realPhoto
          };
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const socialLogin = async (provider: 'google' | 'facebook', providedEmail?: string, providedName?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      let res;
      if (provider === 'google') {
        res = await triggerGoogleOAuthPopup(providedEmail, providedName);
      } else {
        res = await triggerFacebookOAuthPopup();
      }

      if (res.success && res.profile) {
        setUser(res.profile);
        setIsAuthModalOpen(false);
        handlePostAuthProceed();
        return { success: true };
      }

      return { success: false, error: res.error || 'Authentication popup was closed.' };
    } catch (err: any) {
      console.warn('OAuth popup error:', err);
      return { success: false, error: 'OAuth authentication failed.' };
    }
  };

  const logout = () => {
    // 1. Firebase Logout
    firebaseLogout().catch(() => {});

    // 2. Clear transient user profile key & active in-progress exam attempt data
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    try {
      sessionStorage.clear();
    } catch {
      // Ignore if iframe/sandbox restricts sessionStorage
    }

    // Note: User exam history & score analytics are securely preserved in localStorage (keyed by user profile)
    // so when logging back in, all previous exam attempt data & analytics metrics remain fully intact.

    // 3. Reset Active User & Modal State
    setUser(null);
    setIsAuthModalOpen(false);
    setPendingExamStart(false);

    // 4. Reset Active Uncompleted Exam State, Answers, & Timer
    setIsTimerRunning(false);
    setQuestions([]);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemainingSeconds(config.durationMinutes * 60);

    // 5. Reset In-Memory Session, History & Exclusion State
    setExamHistory([]);
    setExcludedTopics([]);
    setCurrentSession(null);

    // 6. Reset Application Navigation View
    setViewState('landing');
    setViewHistoryStack(['landing']);
  };

  const startExam = async () => {
    if (!user) {
      setPendingExamStart(true);
      openAuthModal('login');
      return;
    }
    await executeStartExam();
  };

  const selectOption = (questionId: number, option: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        selectedOption: option,
        flagged: prev[questionId]?.flagged || false,
        timeSpentSeconds: (prev[questionId]?.timeSpentSeconds || 0) + 1
      }
    }));
  };

  const toggleFlag = (questionId: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        selectedOption: prev[questionId]?.selectedOption || null,
        flagged: !prev[questionId]?.flagged,
        timeSpentSeconds: prev[questionId]?.timeSpentSeconds || 0
      }
    }));
  };

  const clearSelection = (questionId: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOption: null
      }
    }));
  };

  const submitExam = () => {
    setIsTimerRunning(false);
    localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);

    let score = 0;
    const chapterScores: Record<number, { correct: number; total: number; percentage: number }> = {
      1: { correct: 0, total: 8, percentage: 0 },
      2: { correct: 0, total: 6, percentage: 0 },
      3: { correct: 0, total: 4, percentage: 0 },
      4: { correct: 0, total: 11, percentage: 0 },
      5: { correct: 0, total: 9, percentage: 0 },
      6: { correct: 0, total: 2, percentage: 0 }
    };

    const kLevelScores: Record<KLevel, { correct: number; total: number; percentage: number }> = {
      K1: { correct: 0, total: 8, percentage: 0 },
      K2: { correct: 0, total: 24, percentage: 0 },
      K3: { correct: 0, total: 8, percentage: 0 }
    };

    const newTestedTopics: string[] = [];

    questions.forEach((q) => {
      const uAns = userAnswers[q.id]?.selectedOption;
      const isCorrect = uAns === q.correct_answer;

      if (isCorrect) {
        score += 1;
        if (chapterScores[q.chapter]) chapterScores[q.chapter].correct += 1;
        if (kLevelScores[q.k_level]) kLevelScores[q.k_level].correct += 1;
      }

      if (q.topic) {
        newTestedTopics.push(q.topic);
      } else {
        newTestedTopics.push(q.question);
      }
    });

    Object.keys(chapterScores).forEach((ch) => {
      const key = Number(ch);
      const c = chapterScores[key];
      c.percentage = c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0;
    });

    Object.keys(kLevelScores).forEach((kl) => {
      const key = kl as KLevel;
      const k = kLevelScores[key];
      k.percentage = k.total > 0 ? Math.round((k.correct / k.total) * 100) : 0;
    });

    const totalSeconds = config.durationMinutes * 60;
    const timeSpent = totalSeconds - timeRemainingSeconds;

    const session: ExamSession = {
      id: `session_${Date.now()}`,
      attemptNumber: examHistory.length + 1,
      timestamp: new Date().toLocaleString(),
      durationMinutes: config.durationMinutes,
      timeSpentSeconds: timeSpent,
      questions,
      userAnswers,
      score,
      totalQuestions: questions.length || 40,
      passed: score >= 26,
      chapterScores,
      kLevelScores,
      excludedTopics: newTestedTopics
    };

    setCurrentSession(session);
    setExamHistory((prev) => [session, ...prev]);

    // Append newly tested topics to global exclusion list
    setExcludedTopics((prev) => {
      const combined = [...prev, ...newTestedTopics];
      return Array.from(new Set(combined));
    });

    // Auto-dispatch email scorecard to authenticated user
    if (user?.email) {
      sendExamScorecardEmail(session, user.email, user).catch((err) => {
        console.warn('[ExamContext] Scorecard email auto-dispatch note:', err);
      });
    }

    setView('results');
  };

  const resetExam = () => {
    setIsTimerRunning(false);
    setQuestions([]);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    setView('landing');
  };

  const takeAnotherExam = async () => {
    await startExam();
  };

  const clearExclusionHistory = () => {
    setExcludedTopics([]);
    localStorage.removeItem(EXCLUSION_STORAGE_KEY);
  };

  return (
    <ExamContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        view,
        setView,
        goBack,
        config,
        updateConfig,
        user,
        login,
        signup,
        socialLogin,
        logout,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        isSettingsModalOpen,
        openSettingsModal,
        closeSettingsModal,
        questions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        userAnswers,
        selectOption,
        toggleFlag,
        clearSelection,
        timeRemainingSeconds,
        isTimerRunning,
        setIsTimerRunning,
        isLoadingQuestions,
        startExam,
        submitExam,
        resetExam,
        takeAnotherExam,
        currentSession,
        setCurrentSession,
        excludedTopics,
        clearExclusionHistory,
        examHistory
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};
