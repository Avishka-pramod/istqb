import React, { useEffect } from 'react';
import { ExamProvider, useExam } from './context/ExamContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ExamSimulator } from './components/ExamSimulator';
import { ResultsPage } from './components/ResultsPage';
import { AnalyticsPage } from './components/AnalyticsPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route Guard Component enforcing authentication for protected exam, scorecard, and analytics views
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, setView, openAuthModal } = useExam();

  useEffect(() => {
    if (!user) {
      setView('landing');
      openAuthModal('login');
    }
  }, [user, setView, openAuthModal]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

const MainApp: React.FC = () => {
  const { view, theme } = useExam();

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-[#180e29] text-purple-50 dark'
          : theme === 'aurora'
          ? 'bg-[#0f0a1e] text-purple-50 aurora'
          : 'bg-[#faf5ff] text-slate-900 light'
      }`}
    >
      <Navbar />
      <main>
        {view === 'landing' && <LandingPage />}
        {view === 'exam' && (
          <ProtectedRoute>
            <ExamSimulator />
          </ProtectedRoute>
        )}
        {view === 'results' && (
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        )}
        {view === 'analytics' && (
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ExamProvider>
      <MainApp />
    </ExamProvider>
  );
}
