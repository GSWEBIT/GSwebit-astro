import type { APIRoute } from 'astro';
import { connectDB } from '../../lib/db';
import { Inquiry } from '../../lib/models/Inquiry';
import { jsonResponse, optionsResponse } from '../../lib/cors';
import { sendInquiryNotificationEmail } from '../../lib/email';

export const prerender = false;

export const OPTIONS: APIRoute = async ({ request }) => {
  return optionsResponse(request);
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await connectDB();
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON request body' }, 400, request);
    }

    const { name, email, topic, msg } = body || {};

    if (!name || !email) {
      return jsonResponse({ error: 'Name and email are required' }, 400, request);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: 'Invalid email format' }, 400, request);
    }

    const inquiry = await Inquiry.create({ name, email, topic, msg });

    // Send email notification to gswebit23@gmail.com with the submitted form content
    let emailSent = false;
    try {
      await sendInquiryNotificationEmail({ name, email, topic, msg });
      emailSent = true;
    } catch (emailErr) {
      console.error('Failed to send inquiry notification email:', emailErr);
    }

    return jsonResponse({ success: true, inquiry, emailSent }, 201, request);
  } catch (err: any) {
    console.error('Create inquiry error:', err);
    return jsonResponse(
      { error: err.message || 'Server error while saving inquiry' },
      500,
      request
    );
  }
};

