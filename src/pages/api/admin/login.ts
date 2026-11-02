import type { APIRoute } from 'astro';
import { getAdminPassword, createToken } from '../../../lib/auth';
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

    const { password } = body || {};
    if (!password) {
      return jsonResponse({ error: 'Password is required' }, 400, request);
    }

    if (password !== getAdminPassword()) {
      return jsonResponse({ error: 'Invalid admin password' }, 401, request);
    }

    const token = createToken();
    return jsonResponse({ success: true, token }, 200, request);
  } catch (err: any) {
    console.error('Admin login error:', err);
    return jsonResponse({ error: err.message || 'Server error' }, 500, request);
  }
};

