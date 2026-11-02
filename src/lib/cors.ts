const clean = (s: string) => (s || '').trim().replace(/\/+$/, '').toLowerCase();

export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true;
  const lower = clean(origin);

  const envOrigins = (process.env.ALLOWED_ORIGIN || '')
    .split(',')
    .map(clean)
    .filter(Boolean);

  if (envOrigins.includes('*') || envOrigins.includes(lower)) return true;
  if (/^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.vercel\.app$/.test(lower)) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(lower)) return true;
  if (!process.env.ALLOWED_ORIGIN) return true;

  return false;
}

export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin');
  let allowOrigin = '*';

  if (origin && isOriginAllowed(origin)) {
    allowOrigin = origin;
  } else if (origin) {
    allowOrigin = origin;
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
    'Access-Control-Max-Age': '86400',
  };
}

export function jsonResponse(
  data: any,
  status: number = 200,
  request?: Request
): Response {
  const headers = {
    'Content-Type': 'application/json',
    ...(request ? getCorsHeaders(request) : { 'Access-Control-Allow-Origin': '*' }),
  };

  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

export function optionsResponse(request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

