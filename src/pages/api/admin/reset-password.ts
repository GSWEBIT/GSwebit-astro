import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import { PasswordReset } from '../../../lib/models/PasswordReset';
import { setAdminPassword } from '../../../lib/auth';
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

    const { token, password, confirmPassword } = body || {};

    if (!token || !password || !confirmPassword) {
      return jsonResponse(
        { error: 'Token, password, and confirm password are required' },
        400,
        request
      );
    }

    if (password !== confirmPassword) {
      return jsonResponse({ error: 'Passwords do not match' }, 400, request);
    }

    if (password.length < 6) {
      return jsonResponse(
        { error: 'Password must be at least 6 characters' },
        400,
        request
      );
    }

    await connectDB();

    const resetRecord = await PasswordReset.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return jsonResponse(
        { error: 'Invalid or expired reset link. Please request a new one.' },
        400,
        request
      );
    }

    resetRecord.used = true;
    await resetRecord.save();

    setAdminPassword(password);

    return jsonResponse(
      { success: true, message: 'Password has been reset successfully. You can now sign in.' },
      200,
      request
    );
  } catch (err: any) {
    console.error('Reset password error:', err);
    return jsonResponse(
      { error: 'Failed to reset password. Please try again.' },
      500,
      request
    );
  }
};

