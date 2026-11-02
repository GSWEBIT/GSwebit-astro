import type { APIRoute } from 'astro';
import { jsonResponse, optionsResponse } from '../../lib/cors';

export const prerender = false;

export const OPTIONS: APIRoute = async ({ request }) => {
  return optionsResponse(request);
};

export const GET: APIRoute = async ({ request }) => {
  return jsonResponse({ status: 'ok' }, 200, request);
};

