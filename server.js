import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are an expert Software Quality Assurance trainer and ISTQB Certified Tester Foundation Level (CTFL) v4.0 examination author.
Your task is to generate an official 40-question practice exam that aligns strictly with the ISTQB CTFL v4.0 syllabus rules and official past paper styles.

CRITICAL CONSTRAINTS:
1. Total Questions: Exactly 40 multiple-choice questions.
2. Question Format: 1 correct answer, 3 plausible distractors per question.
3. No K4 Level: Generate ONLY K1 (Remember), K2 (Understand), and K3 (Apply) questions. No K4 level.
4. STRICT Chapter & K-Level Distribution:
   - Chapter 1 (Fundamentals of Testing): 8 questions (2x K1, 6x K2)
   - Chapter 2 (Testing Throughout the SDLC): 6 questions (2x K1, 4x K2)
   - Chapter 3 (Static Testing): 4 questions (2x K1, 2x K2)
   - Chapter 4 (Test Analysis and Design): 11 questions (6x K2, 5x K3)
   - Chapter 5 (Managing Test Activities): 9 questions (1x K1, 5x K2, 3x K3)
   - Chapter 6 (Test Tools): 2 questions (1x K1, 1x K2)
   (Overall Totals across 40 questions: 8x K1, 24x K2, 8x K3).

QUESTION STYLE AND QUALITY REFERENCE (FEW-SHOT EXAMPLES):
Example 1 (K1 Level):
- Question: "Which of the following statements describe a valid test objective?"
- Options: ["To prove that there are no unfixed defects in the system under test", "To prove that there will be no failures after the implementation of the system into production", "To reduce the risk level of the test object and to build confidence in the quality level", "To verify that there are no untested combinations of inputs"]
- Correct Answer: "To reduce the risk level of the test object and to build confidence in the quality level"
- Explanation: "Testing finds defects and failures which reduces the level of risk and at the same time gives more confidence in the quality level of the test object."

Example 2 (K2 Level):
- Question: "You have been assigned as a tester to a team producing a new system incrementally. You have noticed that no changes have been made to the existing regression test cases for several iterations and no new regression defects were identified. Your manager is happy, but you are not. Which testing principle explains your skepticism?"
- Options: ["Tests wear out", "Absence-of-defects fallacy", "Defects cluster together", "Exhaustive testing is impossible"]
- Correct Answer: "Tests wear out"
- Explanation: "This principle means that if the same tests are repeated over and over again, eventually these tests no longer find any new defects. This is probably why the tests all passed in this release as well."

Example 3 (K3 Level):
- Question: "You are testing a simplified apartment search form which has only two search criteria: floor (with three possible options: ground floor; first floor; second or higher floor) and garden type (with three possible options: no garden; small garden; large garden). Each of the apartments on the ground floor has a garden, apartments on higher floors don't. What is the minimal number of test cases to achieve 100% EP coverage for valid partitions?"
- Options: ["3", "4", "5", "6"]
- Correct Answer: "4"
- Explanation: "'Small garden' and 'large garden' can go only with 'ground floor', requiring two tests. We need two more test cases to cover the remaining 'floor' partitions with 'no garden'. Total is 4 test cases."

JSON OUTPUT FORMAT REQUIREMENT:
Output ONLY a valid JSON array of 40 objects matching:
[
  {
    "id": 1,
    "chapter": 1,
    "k_level": "K1",
    "question": "Which of the following statements describe a valid test objective?",
    "options": [
      "To prove that there are no unfixed defects in the system under test",
      "To prove that there will be no failures after the implementation of the system into production",
      "To reduce the risk level of the test object and to build confidence in the quality level",
      "To verify that there are no untested combinations of inputs"
    ],
    "correct_answer": "To reduce the risk level of the test object and to build confidence in the quality level",
    "explanation": "Testing finds defects and failures which reduces the level of risk and at the same time gives more confidence in the quality level of the test object."
  }
]`;

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY
  });
});

app.post('/api/generate-exam', async (req, res) => {
  const { excludedTopics = [] } = req.body || {};

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  let exclusionClause = '';
  if (Array.isArray(excludedTopics) && excludedTopics.length > 0) {
    exclusionClause = `\nRETAKE CONSTRAINTS: Do NOT repeat questions on topics: [${excludedTopics.slice(-30).join(', ')}]. Generate 40 completely unique questions.`;
  }

  const promptText = `Generate a complete 40-question ISTQB CTFL v4.0 exam. Ensure exact chapter counts (Ch1:8, Ch2:6, Ch3:4, Ch4:11, Ch5:9, Ch6:2) and exact K-level counts (8x K1, 24x K2, 8x K3).${exclusionClause}`;

  try {
    if (geminiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${promptText}` }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.7 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        text = text.trim().replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
        const questions = JSON.parse(text);
        if (Array.isArray(questions) && questions.length === 40) {
          return res.json({ success: true, provider: 'gemini-backend', questions });
        }
      }
    } else if (openaiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: promptText }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        let content = data.choices[0].message.content;
        content = content.trim().replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
        let questions = JSON.parse(content);
        if (questions.questions) questions = questions.questions;
        if (Array.isArray(questions) && questions.length === 40) {
          return res.json({ success: true, provider: 'openai-backend', questions });
        }
      }
    }
  } catch (err) {
    console.error('Backend LLM error:', err);
  }

  // If no backend key configured or LLM fails, return fallback signal
  return res.json({
    success: false,
    useOfflineFallback: true,
    message: 'Backend environment API key not configured or unavailable. Using standard generator engine.'
  });
});

app.listen(PORT, () => {
  console.log(`[ISTQB Backend Server] Listening on http://localhost:${PORT}`);
});
