import nodemailer from "nodemailer";

// Get email configuration
const EMAIL_USER = process.env.EMAIL_USER || "kucashinfo@gmail.com";
const EMAIL_PASS = process.env.EMAIL_APP_PASSWORD || "xezbdtmaahnlxybs";

console.log("📧 NODEMAILER INIT:", {
  hasEmailUser: !!process.env.EMAIL_USER,
  emailUser: EMAIL_USER,
  hasEmailPass: !!process.env.EMAIL_APP_PASSWORD,
  emailPassLength: EMAIL_PASS?.length || 0,
});

// Create reusable transporter using Gmail SMTP
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  debug: true, // Enable debug logging
  logger: true, // Enable logger
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ NODEMAILER VERIFICATION ERROR:", error);
    console.error("❌ Error details:", {
      error,
    });
  } else {
    console.log("✅ NODEMAILER VERIFIED - Ready to send emails");
  }
});

// Helper function to send emails
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  console.log("📧 SEND EMAIL CALLED:", {
    to,
    subject,
    from: EMAIL_USER,
    hasHtml: !!html,
    htmlLength: html?.length || 0,
    hasText: !!text,
  });

  try {
    const mailOptions = {
      from: {
        name: "KuCash",
        address: EMAIL_USER,
      },
      to,
      subject,
      html,
      text: text || subject,
    };

    console.log("📧 SENDING EMAIL - Mail options prepared");
    console.log("📧 FROM:", mailOptions.from);
    console.log("📧 TO:", mailOptions.to);
    console.log("📧 SUBJECT:", mailOptions.subject);

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ EMAIL SENT SUCCESSFULLY:", {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
      pending: info.pending,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ EMAIL SEND ERROR:", error);
    console.error("❌ ERROR DETAILS:", {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack,
    });
    throw error;
  }
}
