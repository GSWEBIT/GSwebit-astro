import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import { connectDB } from '../../../lib/db';
import { PasswordReset } from '../../../lib/models/PasswordReset';
import { getAdminEmail } from '../../../lib/auth';
import { sendPasswordResetEmail } from '../../../lib/email';
import { jsonResponse, optionsResponse } from '../../../lib/cors';

export const prerender = false;

export const OPTIONS: APIRoute = async ({ request }) => {
  return optionsResponse(request);
};

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON request body' }, 400, request);
    }

    const { email } = body || {};
    if (!email) {
      return jsonResponse({ error: 'Email is required' }, 400, request);
    }

    const adminEmail = getAdminEmail().toLowerCase().trim();
    const inputEmail = String(email).toLowerCase().trim();

    if (inputEmail !== adminEmail) {
      // Prevent email enumeration
      return jsonResponse(
        { success: true, message: 'If this email is registered, a reset link has been sent.' },
        200,
        request
      );
    }

    await connectDB();

    // Invalidate previous unused tokens
    await PasswordReset.updateMany(
      { email: inputEmail, used: false },
      { $set: { used: true } }
    );

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordReset.create({
      email: inputEmail,
      token: resetToken,
      expiresAt,
    });

    // Resolve base url: prefer request origin or env FRONTEND_URL
    const url = new URL(request.url);
    const baseUrl = process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.replace(/\/+$/, '')
      : `${url.protocol}//${url.host}`;
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    try {
      await sendPasswordResetEmail(inputEmail, resetLink);
    } catch (mailErr: any) {
      console.error('Mail error in forgot-password:', mailErr.message);
      // Still log or handle cleanly
    }

    return jsonResponse(
      { success: true, message: 'If this email is registered, a reset link has been sent.' },
      200,
      request
    );
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return jsonResponse(
      { error: 'Failed to process request. Please try again.' },
      500,
      request
    );
  }
};

