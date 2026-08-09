import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { AuthModal } from './AuthModal';
import { LogoutConfirmModal } from './LogoutConfirmModal';
import { SettingsModal } from './SettingsModal';
import { Sun, Moon, Award, RotateCcw, Menu, X, BarChart3, User, LogOut, ArrowLeft, ChevronDown, Settings, LayoutDashboard, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    view,
    setView,
    goBack,
    resetExam,
    excludedTopics,
    user,
    logout,
    examHistory,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    isSettingsModalOpen,
    openSettingsModal,
    closeSettingsModal,
    isTimerRunning
  } = useExam();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleReset = () => {
    resetExam();
    setIsMenuOpen(false);
  };

  const handleGoBack = () => {
    goBack();
    setIsMenuOpen(false);
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    openAuthModal(mode);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    if (view === 'exam' || isTimerRunning) {
      setIsLogoutConfirmOpen(true);
      return;
    }
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-[#092c1a]/95 border-b border-[#d0e8d8] dark:border-[#1b5e39] transition-colors duration-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            {/* Dynamic Go Back Button if on secondary screen */}
            {view !== 'landing' && (
              <button
                onClick={handleGoBack}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#0d3f26] text-slate-800 dark:text-emerald-100 hover:bg-slate-200 dark:hover:bg-[#135433] border border-slate-200 dark:border-[#1b5e39] transition-all cursor-pointer flex items-center justify-center"
                title="Go Back to Previous Screen"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </button>
            )}

            <div
              onClick={handleReset}
              className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-98"
            >
              <div className="w-10 h-10 rounded-xl bg-[#105e38] text-white shadow-md flex items-center justify-center font-bold text-lg group-hover:bg-[#147244] transition-colors">
                <Award className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                    ISTQB <span className="text-emerald-700 dark:text-emerald-400">CTFL v4.0</span>
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase bg-emerald-100 dark:bg-[#0f4c2e] text-emerald-800 dark:text-emerald-300 rounded-md border border-emerald-300 dark:border-[#1b5e39]">
                    Testportal
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#9ed4b3] hidden sm:block font-medium">
                  Certified Tester Foundation Level Practice
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links & Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dynamic Go Back Button */}
            {view !== 'landing' && (
              <button
                onClick={handleGoBack}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold rounded-xl bg-[#105e38] hover:bg-[#147244] text-white shadow-sm transition-all border border-[#1b7a49] cursor-pointer"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {/* Analytics Dashboard Button */}
            {user && examHistory.length > 0 && (
              <button
                onClick={() => setView('analytics')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                  view === 'analytics'
                    ? 'bg-[#105e38] text-white border-[#229158] shadow-sm'
                    : 'bg-slate-100 dark:bg-[#0d3f26] text-slate-700 dark:text-emerald-100 border-slate-200 dark:border-[#1b5e39] hover:bg-slate-200 dark:hover:bg-[#135433]'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Analytics ({examHistory.length})</span>
              </button>
            )}

            {/* Retake Exclusions Counter */}
            {user && excludedTopics.length > 0 && (
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20"
                title={`${excludedTopics.length} previously tested topics saved in exclusion memory`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{excludedTopics.length} Excluded Topics</span>
              </span>
            )}

            {/* INTERACTIVE AURORA / DARK / LIGHT THEME TOGGLE BUTTON */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0d3f26] text-slate-700 dark:text-emerald-100 hover:bg-slate-200 dark:hover:bg-[#135433] border border-slate-200 dark:border-[#1b5e39] text-xs font-bold transition-all cursor-pointer shadow-sm"
              aria-label="Toggle Theme"
              title={`Current Theme: ${theme.toUpperCase()}. Click to switch theme.`}
            >
              {theme === 'aurora' ? (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent font-extrabold">Aurora</span>
                </>
              ) : theme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4 text-emerald-400" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light</span>
                </>
              )}
            </button>


            {/* PROFILE AVATAR & DROPDOWN MENU */}
            {user ? (
              <div className="relative pl-2 border-l border-slate-200 dark:border-[#1b5e39]">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-[#0f4c2e] dark:hover:bg-[#135433] border border-emerald-200 dark:border-[#1b5e39] transition-all cursor-pointer shadow-sm group"
                  title="Open user profile menu"
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-500/20" />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-[#105e38] text-white flex items-center justify-center font-extrabold text-xs shadow-inner">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-extrabold text-slate-800 dark:text-emerald-100 max-w-[100px] truncate hidden sm:inline-block pl-1">
                    {user.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#0d3f26] border border-slate-200 dark:border-[#1b5e39] shadow-2xl p-2 z-50 animate-fadeIn">
                      {/* Account Info Header */}
                      <div className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#092c1a] border border-slate-100 dark:border-[#1b5e39]/60 mb-1.5">
                        <div className="flex items-center gap-2.5">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-[#105e38] text-white flex items-center justify-center font-bold text-sm shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-[#9ed4b3] truncate">{user.email}</p>
                          </div>
                        </div>
                        {user.provider && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-emerald-100 dark:bg-[#0f4c2e] text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-[#1b5e39]">
                              {user.provider} Auth
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="space-y-0.5 text-xs font-bold">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            resetExam();
                          }}
                          className="w-full px-3 py-2 rounded-xl text-slate-700 dark:text-emerald-100 hover:bg-slate-100 dark:hover:bg-[#135433] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Dashboard Portal</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            openSettingsModal();
                          }}
                          className="w-full px-3 py-2 rounded-xl text-slate-700 dark:text-emerald-100 hover:bg-slate-100 dark:hover:bg-[#135433] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                        >
                          <Settings className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Simulator Settings</span>
                        </button>

                        {examHistory.length > 0 && (
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              setView('analytics');
                            }}
                            className="w-full px-3 py-2 rounded-xl text-slate-700 dark:text-emerald-100 hover:bg-slate-100 dark:hover:bg-[#135433] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                          >
                            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Performance Analytics ({examHistory.length})</span>
                          </button>
                        )}
                      </div>

                      <div className="my-1.5 border-t border-slate-100 dark:border-[#1b5e39]"></div>

                      {/* Logout Action */}
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 transition-colors font-extrabold text-xs cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="px-4 py-1.5 text-xs font-extrabold rounded-xl border border-emerald-700 dark:border-[#229158] text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-[#0f4c2e] transition-all cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="px-4 py-1.5 text-xs font-extrabold rounded-xl bg-[#105e38] hover:bg-[#147244] text-white shadow-sm transition-all cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#0d3f26] text-slate-800 dark:text-emerald-100 hover:bg-slate-200 dark:hover:bg-[#135433] border border-slate-200 dark:border-[#1b5e39] transition-all cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#092c1a] border-b border-slate-200 dark:border-[#1b5e39] px-4 py-4 space-y-3 shadow-lg">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-[#0f4c2e] border border-emerald-200 dark:border-[#1b5e39] text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-600" /> Logged in as {user.name} {user.provider ? `(${user.provider})` : ''}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-rose-600 dark:text-rose-400 font-bold text-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="py-2.5 px-3 text-xs font-extrabold rounded-xl border border-emerald-700 dark:border-[#229158] text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50"
                >
                  Login
                </button>
                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="py-2.5 px-3 text-xs font-extrabold rounded-xl bg-[#105e38] hover:bg-[#147244] text-white shadow-sm"
                >
                  Sign up
                </button>
              </div>
            )}

            {view !== 'landing' && (
              <button
                onClick={handleGoBack}
                className="w-full py-2.5 px-3 rounded-xl bg-[#105e38] hover:bg-[#147244] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
            )}

            {examHistory.length > 0 && (
              <button
                onClick={() => {
                  setView('analytics');
                  setIsMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-[#0f4c2e] text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200 dark:border-[#1b5e39]"
              >
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>View Performance Analytics ({examHistory.length})</span>
              </button>
            )}

            {/* Mobile Theme Toggle */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-[#1b5e39]">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-[#0d3f26] text-slate-700 dark:text-emerald-100 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-[#1b5e39] cursor-pointer"
              >
                {theme === 'aurora' ? (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Theme: Aurora Borealis</span>
                  </>
                ) : theme === 'dark' ? (
                  <>
                    <Moon className="w-4 h-4 text-emerald-400" />
                    <span>Theme: Dark Forest</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Theme: Light Mode</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
      />

      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        onCancel={() => setIsLogoutConfirmOpen(false)}
        onConfirm={() => {
          setIsLogoutConfirmOpen(false);
          logout();
        }}
      />
    </>
  );
};
