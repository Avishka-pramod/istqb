export type KLevel = 'K1' | 'K2' | 'K3';

export interface Question {
  id: number;
  chapter: number; // 1 to 6
  k_level: KLevel;
  question: string;
  options: [string, string, string, string];
  correct_answer: string;
  explanation: string;
  topic?: string;
}

export interface ChapterInfo {
  id: number;
  title: string;
  description: string;
  questionCount: number;
  kLevelBreakdown: Record<KLevel, number>;
  keyTopics: string[];
}

export interface ExamConfig {
  durationMinutes: number; // 60 or 75
}

export interface UserAnswer {
  questionId: number;
  selectedOption: string | null;
  flagged: boolean;
  timeSpentSeconds: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  provider?: 'email' | 'google' | 'facebook';
  avatarUrl?: string;
}

export interface ExamSession {
  id: string;
  attemptNumber: number;
  timestamp: string;
  durationMinutes: number;
  timeSpentSeconds: number;
  questions: Question[];
  userAnswers: Record<number, UserAnswer>;
  score: number;
  totalQuestions: number;
  passed: boolean;
  chapterScores: Record<number, { correct: number; total: number; percentage: number }>;
  kLevelScores: Record<KLevel, { correct: number; total: number; percentage: number }>;
  excludedTopics: string[];
}

export interface LLMGenerationRequest {
  chapterDistribution: Record<number, { count: number; kBreakdown: Record<KLevel, number> }>;
  excludedTopics: string[];
  apiKey?: string;
  provider: 'openai' | 'gemini' | 'mock';
}
