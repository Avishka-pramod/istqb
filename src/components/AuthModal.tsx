import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialMode?: 'login' | 'signup';
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  initialMode: propInitialMode
}) => {
  const examContext = useExam();
  
  const isOpen = propIsOpen !== undefined ? propIsOpen : examContext.isAuthModalOpen;
  const onClose = propOnClose || examContext.closeAuthModal;
  const activeMode = propInitialMode || examContext.authModalMode || 'login';

  const [mode, setMode] = useState<'login' | 'signup'>(activeMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSocialLoading, setIsSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setMode(activeMode);
    setAuthError(null);
    setIsSocialLoading(null);
  }, [activeMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (mode === 'login') {
      examContext.login(name || email.split('@')[0], email);
    } else {
      examContext.signup(name || email.split('@')[0], email);
    }
  };

  const handleSocialClick = async (provider: 'google' | 'facebook') => {
    setAuthError(null);
    setIsSocialLoading(provider);
    try {
      const res = await examContext.socialLogin(provider, email, name);
      if (res && !res.success && res.error) {
        setAuthError(res.error);
      }
    } catch {
      setAuthError('OAuth authentication failed. Please try again.');
    } finally {
      setIsSocialLoading(null);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-[#24123e] rounded-3xl shadow-2xl border border-purple-200 dark:border-[#4c1d95] overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-purple-200 dark:border-[#4c1d95] bg-gradient-to-b from-purple-50/50 to-transparent dark:from-[#180e29]/80 dark:to-transparent">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-purple-100 dark:hover:bg-[#3b0764] transition-colors"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-base shadow-md border border-purple-400/20">
              <Sparkles className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                Welcome to ISTQB Portal
              </h3>
              <p className="text-xs font-medium text-purple-700 dark:text-[#c084fc]">
                CTFL v4.0 Exam Simulator & Analytics
              </p>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 dark:text-purple-200/70 mt-1">
            {mode === 'login' 
              ? 'Sign in to access your practice history, track score analytics, and save your progress.'
              : 'Create your account to unlock personalized CTFL exam simulations and detailed chapter breakdown.'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1.5 bg-purple-50 dark:bg-[#180e29] border-b border-purple-200 dark:border-[#4c1d95] text-xs font-extrabold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-[#24123e] text-purple-900 dark:text-purple-200 shadow-sm border border-purple-200 dark:border-[#4c1d95]'
                : 'text-slate-600 dark:text-[#c084fc] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-[#24123e] text-purple-900 dark:text-purple-200 shadow-sm border border-purple-200 dark:border-[#4c1d95]'
                : 'text-slate-600 dark:text-[#c084fc] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {authError && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <span className="shrink-0 font-bold">⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          {/* Official Social Logins */}
          <div className="space-y-2.5">
            <button
              type="button"
              disabled={isSocialLoading !== null}
              onClick={() => handleSocialClick('google')}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-purple-50 dark:bg-[#180e29] dark:hover:bg-[#3b0764] text-slate-700 dark:text-slate-100 font-bold text-sm border border-purple-200 dark:border-[#4c1d95] shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
            >
              <GoogleIcon />
              <span className="group-hover:scale-[1.01] transition-transform">
                {isSocialLoading === 'google' ? 'Connecting to Google OAuth...' : 'Continue with Google'}
              </span>
            </button>

            <button
              type="button"
              disabled={isSocialLoading !== null}
              onClick={() => handleSocialClick('facebook')}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-purple-50 dark:bg-[#180e29] dark:hover:bg-[#3b0764] text-slate-700 dark:text-slate-100 font-bold text-sm border border-purple-200 dark:border-[#4c1d95] shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
            >
              <FacebookIcon />
              <span className="group-hover:scale-[1.01] transition-transform">
                {isSocialLoading === 'facebook' ? 'Connecting to Facebook OAuth...' : 'Continue with Facebook'}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-purple-200 dark:border-[#4c1d95] w-full"></div>
            <span className="bg-white dark:bg-[#24123e] px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#c084fc]/60 shrink-0">
              or continue with email
            </span>
            <div className="border-t border-purple-200 dark:border-[#4c1d95] w-full"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#c084fc] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required={mode === 'signup'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Student"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-purple-50/50 dark:bg-[#180e29] border border-purple-200 dark:border-[#4c1d95] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#c084fc] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@istqb.edu"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-purple-50/50 dark:bg-[#180e29] border border-purple-200 dark:border-[#4c1d95] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#c084fc] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-purple-50/50 dark:bg-[#180e29] border border-purple-200 dark:border-[#4c1d95] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-md border border-purple-500 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>{mode === 'login' ? 'Sign In to Account' : 'Complete Account Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Footer Info & Guest Option */}
          <div className="pt-1 border-t border-purple-100 dark:border-[#4c1d95]/50 text-center space-y-2">
            <p className="text-[11px] text-slate-500 dark:text-[#c084fc] flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300 shrink-0" /> 
              Secure & instant session setup
            </p>

            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-600 dark:text-purple-200 hover:text-purple-600 dark:hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Continue as Guest (No Login Required)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
