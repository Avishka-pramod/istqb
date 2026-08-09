import type { Question, KLevel } from '../types/exam';
import { STRICT_SYLLABUS_DISTRIBUTION } from '../data/istqbSyllabus';
import { COMPREHENSIVE_QUESTION_BANK, RETAKE_QUESTION_POOL } from '../data/questionBank';

/**
 * High-quality offline mock exam generator.
 * Strict ISTQB CTFL v4.0 distribution:
 * Ch 1: 8 Qs (2x K1, 6x K2)
 * Ch 2: 6 Qs (2x K1, 4x K2)
 * Ch 3: 4 Qs (2x K1, 2x K2)
 * Ch 4: 11 Qs (6x K2, 5x K3)
 * Ch 5: 9 Qs (1x K1, 5x K2, 3x K3)
 * Ch 6: 2 Qs (1x K1, 1x K2)
 */
export function generateOfflineMockExam(excludedTopics: string[] = []): Question[] {
  const combinedBank = [...COMPREHENSIVE_QUESTION_BANK, ...RETAKE_QUESTION_POOL];
  const excludedSet = new Set(excludedTopics.map((t) => t.toLowerCase()));

  const examQuestions: Question[] = [];
  const dist = STRICT_SYLLABUS_DISTRIBUTION;

  (Object.keys(dist) as unknown as Array<keyof typeof dist>).forEach((chKey) => {
    const ch = Number(chKey);
    const rules = dist[chKey as keyof typeof dist];

    (['K1', 'K2', 'K3'] as KLevel[]).forEach((kLevel) => {
      const needed = rules[kLevel.toLowerCase() as 'k1' | 'k2' | 'k3'];
      if (needed <= 0) return;

      // Filter candidates for chapter & kLevel
      let candidates = combinedBank.filter(
        (q) => q.chapter === ch && q.k_level === kLevel
      );

      // Prioritize non-excluded questions
      const freshCandidates = candidates.filter(
        (q) => !q.topic || !excludedSet.has(q.topic.toLowerCase())
      );

      let selected = freshCandidates.slice(0, needed);

      // Fill remaining if needed
      if (selected.length < needed) {
        const remaining = candidates.filter((q) => !selected.includes(q));
        selected = [...selected, ...remaining.slice(0, needed - selected.length)];
      }

      // If still not enough, generate variations
      while (selected.length < needed) {
        const template = candidates[selected.length % candidates.length] || combinedBank[0];
        selected.push({
          ...template,
          id: 99900 + Math.floor(Math.random() * 10000),
          question: `${template.question} [Variant ${selected.length + 1}]`,
          options: shuffleArray([...template.options]) as [string, string, string, string]
        });
      }

      examQuestions.push(...selected);
    });
  });

  // Re-number IDs sequentially 1..40
  const finalQuestions = examQuestions.map((q, idx) => ({
    ...q,
    id: idx + 1
  }));

  return finalQuestions;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
