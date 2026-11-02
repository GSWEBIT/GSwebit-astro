import type { APIRoute } from 'astro';
import { connectDB } from '../../../../lib/db';
import { Inquiry } from '../../../../lib/models/Inquiry';
import { isAuthorizedAdmin } from '../../../../lib/auth';
import { jsonResponse, optionsResponse } from '../../../../lib/cors';

export const prerender = false;

export const OPTIONS: APIRoute = async ({ request }) => {
  return optionsResponse(request);
};

export const DELETE: APIRoute = async ({ params, request }) => {
  if (!isAuthorizedAdmin(request)) {
    return jsonResponse(
      { error: 'Unauthorized: Missing or invalid token' },
      401,
      request
    );
  }

  try {
    await connectDB();
    const { id } = params;

    if (!id) {
      return jsonResponse({ error: 'Inquiry ID is required' }, 400, request);
    }

    const result = await Inquiry.findByIdAndDelete(id);
    if (!result) {
      return jsonResponse({ error: 'Inquiry not found' }, 404, request);
    }

    return jsonResponse({ success: true }, 200, request);
  } catch (err: any) {
    console.error('Admin delete error:', err);
    return jsonResponse(
      { error: err.message || 'Failed to delete inquiry' },
      500,
      request
    );
  }
};

