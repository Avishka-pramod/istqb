import nodemailer from 'nodemailer';

async function sendTestEmail() {
  const recipient = 'avishkapramod67@gmail.com';
  console.log(`[TestEmail] Creating Ethereal Test Account & Transporter...`);

  // Generate test SMTP account
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf5ff; border-radius: 16px; border: 1px solid #e9d5ff;">
      <h2 style="color: #7c3aed; text-align: center;">ISTQB CTFL v4.0 Exam Scorecard</h2>
      <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e9d5ff;">
        <p><strong>Candidate:</strong> Avishka Pramod</p>
        <p><strong>Recipient:</strong> ${recipient}</p>
        <p><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">PASSED (32/40 - 80%)</span></p>
        <p><strong>Time Spent:</strong> 42 minutes</p>
        <hr style="border: none; border-top: 1px solid #e9d5ff; margin: 15px 0;" />
        <h4 style="color: #4c1d95;">Chapter Breakdown</h4>
        <ul>
          <li>Chapter 1 (Testing Fundamentals): 7/8 (88%)</li>
          <li>Chapter 2 (SDLC Testing): 5/6 (83%)</li>
          <li>Chapter 3 (Static Testing): 4/4 (100%)</li>
          <li>Chapter 4 (Test Analysis & Design): 9/11 (82%)</li>
          <li>Chapter 5 (Managing Test Activities): 6/9 (67%)</li>
          <li>Chapter 6 (Test Tools): 1/2 (50%)</li>
        </ul>
      </div>
      <p style="text-align: center; font-size: 12px; color: #7e22ce; margin-top: 15px;">ISTQB CTFL v4.0 Practice Simulator Portal</p>
    </div>
  `;

  let info = await transporter.sendMail({
    from: '"ISTQB CTFL Simulator" <scorecard@istqb-portal.com>',
    to: recipient,
    subject: 'ISTQB CTFL v4.0 Official Exam Scorecard',
    text: `ISTQB CTFL v4.0 Exam Scorecard\nRecipient: ${recipient}\nResult: PASSED (32/40 - 80%)\nTime Spent: 42 minutes`,
    html: htmlContent
  });

  console.log(`[TestEmail] ✅ Message sent successfully! MessageID: ${info.messageId}`);
  console.log(`[TestEmail] 🔗 Live Email Inbox Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}

sendTestEmail().catch(console.error);
