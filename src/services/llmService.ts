import type { Question } from '../types/exam';
import { generateOfflineMockExam } from './offlineGenerator';

export async function generateExamQuestions(
  excludedTopics: string[] = []
): Promise<Question[]> {
  try {
    const response = await fetch('/api/generate-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ excludedTopics })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length === 40) {
        return data.questions;
      }
    }
  } catch (error) {
    console.warn('Backend API connection unavailable, using client-side offline generator:', error);
  }

  // High quality ISTQB CTFL v4.0 offline generator fallback
  return generateOfflineMockExam(excludedTopics);
}
