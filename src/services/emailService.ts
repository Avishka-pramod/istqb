import type { ExamSession, UserProfile } from '../types/exam';

export interface EmailDeliveryResult {
  success: boolean;
  isSimulated?: boolean;
  message?: string;
  error?: string;
  mailtoUrl?: string;
  reportSummary?: string;
}

/**
 * Generates the full formatted plain-text scorecard report for an exam session
 */
export const generateScorecardReportText = (
  session: ExamSession,
  recipientEmail: string,
  user?: UserProfile | null
): string => {
  const userName = user?.name || recipientEmail.split('@')[0] || 'ISTQB Candidate';
  const status = session.passed ? 'PASSED (PASS)' : 'DID NOT PASS (FAIL)';
  const percentage = Math.round((session.score / session.totalQuestions) * 100);
  const minutesSpent = Math.floor(session.timeSpentSeconds / 60);

  return `====================================================
ISTQB CTFL v4.0 EXAM SIMULATION SCORECARD REPORT
====================================================
Candidate Name: ${userName}
Recipient Email: ${recipientEmail}
Attempt Timestamp: ${session.timestamp}
Exam Result: ${status}
Total Score: ${session.score} / ${session.totalQuestions} (${percentage}%)
Time Spent: ${minutesSpent} minutes

CHAPTER PERFORMANCE BREAKDOWN:
- Chapter 1 (Testing Fundamentals): ${session.chapterScores[1]?.correct || 0}/8 (${session.chapterScores[1]?.percentage || 0}%)
- Chapter 2 (Testing throughout SDLC): ${session.chapterScores[2]?.correct || 0}/6 (${session.chapterScores[2]?.percentage || 0}%)
- Chapter 3 (Static Testing): ${session.chapterScores[3]?.correct || 0}/4 (${session.chapterScores[3]?.percentage || 0}%)
- Chapter 4 (Test Analysis & Design): ${session.chapterScores[4]?.correct || 0}/11 (${session.chapterScores[4]?.percentage || 0}%)
- Chapter 5 (Managing Test Activities): ${session.chapterScores[5]?.correct || 0}/9 (${session.chapterScores[5]?.percentage || 0}%)
- Chapter 6 (Test Tools): ${session.chapterScores[6]?.correct || 0}/2 (${session.chapterScores[6]?.percentage || 0}%)

COGNITIVE K-LEVEL MASTERY:
- K1 (Remember): ${session.kLevelScores.K1?.correct || 0}/8 (${session.kLevelScores.K1?.percentage || 0}%)
- K2 (Understand): ${session.kLevelScores.K2?.correct || 0}/24 (${session.kLevelScores.K2?.percentage || 0}%)
- K3 (Apply): ${session.kLevelScores.K3?.correct || 0}/8 (${session.kLevelScores.K3?.percentage || 0}%)
====================================================`;
};

/**
 * Generates a pre-filled mailto: URL to launch native email clients (Outlook, Mail, Gmail)
 */
export const generateScorecardMailtoUrl = (
  session: ExamSession,
  recipientEmail: string,
  user?: UserProfile | null
): string => {
  const subject = encodeURIComponent(`ISTQB CTFL v4.0 Exam Scorecard - ${session.passed ? 'PASSED' : 'Result'}`);
  const body = encodeURIComponent(generateScorecardReportText(session, recipientEmail, user));
  return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
};

/**
 * Dispatches an automated ISTQB CTFL Scorecard Summary Report to the user's email address.
 * Integrates EmailJS API if environment keys exist with full fallback logging and error handling.
 */
export const sendExamScorecardEmail = async (
  session: ExamSession,
  recipientEmail: string,
  user?: UserProfile | null
): Promise<EmailDeliveryResult> => {
  try {
    const reportSummary = generateScorecardReportText(session, recipientEmail, user);
    const mailtoUrl = generateScorecardMailtoUrl(session, recipientEmail, user);

    console.log('[EmailService] Initiating Scorecard Email Dispatch to:', recipientEmail);

    // Try backend Nodemailer express route first
    try {
      const backendRes = await fetch('http://localhost:3001/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          reportSummary,
          session,
          userName: user?.name || recipientEmail.split('@')[0]
        })
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        if (data.success) {
          console.log('[EmailService] ✅ Backend email dispatched successfully to:', recipientEmail);
          return {
            success: true,
            isSimulated: !data.isLiveSmtp,
            message: data.previewUrl
              ? `Email sent! View test delivery inbox preview: ${data.previewUrl}`
              : `Scorecard delivered to ${recipientEmail}`,
            mailtoUrl,
            reportSummary
          };
        }
      }
    } catch (backendErr) {
      console.warn('[EmailService] Backend email endpoint unavailable, trying EmailJS fallback:', backendErr);
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Check if live EmailJS environment variables are configured
    if (serviceId && templateId && publicKey) {
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              to_email: recipientEmail,
              user_name: user?.name || recipientEmail.split('@')[0],
              score: `${session.score}/${session.totalQuestions}`,
              percentage: `${Math.round((session.score / session.totalQuestions) * 100)}%`,
              status: session.passed ? 'PASSED' : 'FAILED',
              time_spent: `${Math.floor(session.timeSpentSeconds / 60)} mins`,
              report_summary: reportSummary
            }
          })
        });

        if (response.ok) {
          console.log('[EmailService] ✅ EmailJS live scorecard report sent to:', recipientEmail);
          return {
            success: true,
            isSimulated: false,
            message: `Scorecard report dispatched directly via EmailJS to ${recipientEmail}`,
            mailtoUrl,
            reportSummary
          };
        }
      } catch (err: any) {
        console.error('[EmailService] ❌ Network exception during EmailJS dispatch:', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      success: true,
      isSimulated: true,
      message: `Scorecard ready for ${recipientEmail}. Use 'Open in Email Client' to send via Outlook/Gmail.`,
      mailtoUrl,
      reportSummary
    };
  } catch (err: any) {
    console.error('[EmailService] ❌ Critical failure during scorecard email generation:', err);
    return {
      success: false,
      error: 'Failed to generate scorecard email.'
    };
  }
};

