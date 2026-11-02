import nodemailer from 'nodemailer';
import { getAdminEmail } from './auth';

export function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: getAdminEmail(),
      pass: process.env.EMAIL_PASS,
    },
  });
}

export interface InquiryNotificationData {
  name: string;
  email: string;
  topic?: string;
  msg?: string;
}

export async function sendInquiryNotificationEmail({ name, email, topic, msg }: InquiryNotificationData) {
  const adminEmail = getAdminEmail();
  const transporter = getTransporter();

  const formattedTopic = topic || 'General Inquiry';
  const cleanMsg = msg || 'No message provided';

  return await transporter.sendMail({
    from: `"GSWebIT Inquiries" <${adminEmail}>`,
    to: adminEmail,
    replyTo: `"${name}" <${email}>`,
    subject: `🔔 New Inquiry: ${name} (${formattedTopic})`,
    text: `New inquiry received on GSWebIT:\n\nName: ${name}\nEmail: ${email}\nService / Topic: ${formattedTopic}\n\nMessage:\n${cleanMsg}\n`,
    html: `
      <div style="font-family:'Inter',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;max-width:560px;margin:0 auto;padding:1.5rem;background:#f8fafc;border-radius:1rem;">
        <div style="background:#1f4fd1;color:#ffffff;padding:1.5rem;border-radius:0.75rem 0.75rem 0 0;text-align:center;">
          <h2 style="margin:0;font-size:1.35rem;font-weight:700;">New Website Inquiry</h2>
          <p style="margin:0.35rem 0 0;opacity:0.9;font-size:0.85rem;">Received via GSWebIT Agency Contact Form</p>
        </div>
        <div style="background:#ffffff;padding:1.5rem;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 0.75rem 0.75rem;">
          <table style="width:100%;border-collapse:collapse;font-size:0.95rem;margin-bottom:1.25rem;">
            <tr>
              <td style="padding:0.65rem 0;color:#64748b;width:120px;font-weight:600;">Client Name:</td>
              <td style="padding:0.65rem 0;color:#0f172a;font-weight:700;">${name}</td>
            </tr>
            <tr>
              <td style="padding:0.65rem 0;color:#64748b;font-weight:600;">Client Email:</td>
              <td style="padding:0.65rem 0;"><a href="mailto:${email}" style="color:#1f4fd1;text-decoration:none;font-weight:600;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:0.65rem 0;color:#64748b;font-weight:600;">Service / Topic:</td>
              <td style="padding:0.65rem 0;"><span style="display:inline-block;background:#eef3fd;color:#1f4fd1;padding:0.25rem 0.65rem;border-radius:0.35rem;font-weight:600;font-size:0.85rem;">${formattedTopic}</span></td>
            </tr>
            <tr>
              <td style="padding:0.65rem 0;color:#64748b;font-weight:600;vertical-align:top;">Message:</td>
              <td style="padding:0.65rem 0;color:#1e293b;white-space:pre-wrap;line-height:1.5;background:#f8fafc;padding:0.85rem;border-radius:0.5rem;border:1px solid #e2e8f0;">${cleanMsg}</td>
            </tr>
          </table>
          <div style="text-align:center;padding-top:1.25rem;border-top:1px solid #e2e8f0;">
            <a href="mailto:${email}?subject=Re:%20Your%20inquiry%20with%20GSWebIT%20(${encodeURIComponent(formattedTopic)})" style="display:inline-block;background:#ea580c;color:#ffffff;text-decoration:none;padding:0.75rem 1.6rem;border-radius:0.5rem;font-weight:600;font-size:0.9rem;">Reply Directly to ${name}</a>
          </div>
        </div>
        <p style="text-align:center;color:#94a3b8;font-size:0.75rem;margin-top:1.25rem;">&copy; GSWebIT ${new Date().getFullYear()} &middot; gswebit23@gmail.com</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  const adminEmail = getAdminEmail();
  const transporter = getTransporter();

  return await transporter.sendMail({
    from: `"GSWebIT" <${adminEmail}>`,
    to: email,
    subject: 'Password Reset – GSWebIT Admin',
    html: `
      <div style="font-family:'Inter',system-ui,sans-serif;max-width:480px;margin:0 auto;padding:2rem">
        <div style="text-align:center;margin-bottom:1.5rem">
          <h1 style="color:#1f4fd1;margin:0;font-size:1.6rem">GSWebIT</h1>
          <p style="color:#475569;margin:.25rem 0 0">Password Reset</p>
        </div>
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:1.5rem">
          <p style="color:#0f172a;margin:0 0 1rem">Hello Admin,</p>
          <p style="color:#475569;margin:0 0 1.5rem">We received a request to reset your admin password. Click the button below to set a new password. This link will expire in <strong>1 hour</strong>.</p>
          <div style="text-align:center;margin:1.5rem 0">
            <a href="${resetLink}" style="display:inline-block;background:#1f4fd1;color:#fff;text-decoration:none;padding:.75rem 2rem;border-radius:.5rem;font-weight:600;font-size:.95rem">Reset Password</a>
          </div>
          <p style="color:#94a3b8;font-size:.85rem;margin:1rem 0 0">If you didn't request this, you can safely ignore this email. Your password will not be changed.</p>
        </div>
        <p style="text-align:center;color:#94a3b8;font-size:.75rem;margin-top:1.5rem">&copy; GSWebIT ${new Date().getFullYear()}</p>
      </div>
    `,
  });
}

