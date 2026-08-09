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

app.post('/api/send-email', async (req, res) => {
  const { recipientEmail, reportSummary, session, userName } = req.body || {};

  if (!recipientEmail) {
    return res.status(400).json({ success: false, error: 'Recipient email is required.' });
  }

  try {
    let transporter;
    let previewUrl = null;

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort) || 587,
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
    } else {
      // Create ethereal test account for instant delivery testing
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf5ff; border-radius: 16px; border: 1px solid #e9d5ff;">
        <h2 style="color: #7c3aed; text-align: center;">ISTQB CTFL v4.0 Exam Scorecard</h2>
        <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e9d5ff;">
          <p><strong>Candidate Name:</strong> ${userName || recipientEmail.split('@')[0]}</p>
          <p><strong>Recipient Email:</strong> ${recipientEmail}</p>
          <p><strong>Scorecard Result:</strong> ${session?.passed ? '<span style="color: #16a34a; font-weight: bold;">PASSED</span>' : '<span style="color: #dc2626; font-weight: bold;">DID NOT PASS</span>'}</p>
          <pre style="background: #faf5ff; padding: 15px; border-radius: 8px; font-size: 12px; border: 1px solid #e9d5ff; white-space: pre-wrap;">${reportSummary || ''}</pre>
        </div>
        <p style="text-align: center; font-size: 12px; color: #7e22ce; margin-top: 15px;">ISTQB CTFL v4.0 Exam Simulator Portal</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"ISTQB CTFL Simulator" <scorecard@istqb-portal.com>',
      to: recipientEmail,
      subject: `ISTQB CTFL v4.0 Exam Scorecard - ${session?.passed ? 'PASSED' : 'Result'}`,
      text: reportSummary || 'ISTQB Scorecard Summary',
      html: htmlContent
    });

    if (!smtpHost) {
      previewUrl = nodemailer.getTestMessageUrl(info);
    }

    console.log(`[Backend Email] ✅ Scorecard email sent to ${recipientEmail}. MessageId: ${info.messageId}`);
    if (previewUrl) {
      console.log(`[Backend Email] 🔗 Preview URL: ${previewUrl}`);
    }

    return res.json({
      success: true,
      message: `Scorecard email dispatched to ${recipientEmail}`,
      previewUrl,
      isLiveSmtp: Boolean(smtpHost)
    });
  } catch (err) {
    console.error('[Backend Email] Error dispatching email:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to dispatch email' });
  }
});

app.listen(PORT, () => {
  console.log(`[ISTQB Backend Server] Listening on http://localhost:${PORT}`);
});

