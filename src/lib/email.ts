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

