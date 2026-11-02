import type { APIRoute } from 'astro';
import { jsonResponse, optionsResponse } from '../../lib/cors';

export const prerender = false;

export const OPTIONS: APIRoute = async ({ request }) => {
  return optionsResponse(request);
};

export const GET: APIRoute = async ({ request }) => {
  return jsonResponse(
    {
      status: 'ok',
      message: 'GSWebIT API is running on Astro',
      timestamp: new Date().toISOString(),
    },
    200,
    request
  );
};

