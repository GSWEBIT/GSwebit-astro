import crypto from 'node:crypto';

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'gswebit2026';
}

export function setAdminPassword(password: string): void {
  process.env.ADMIN_PASSWORD = password;
}

export function getAdminEmail(): string {
  return process.env.EMAIL_USER || 'gswebit23@gmail.com';
}

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || getAdminPassword() || 'gswebit-secret-key-2026';
}

export function createToken(): string {
  const secret = getAdminSecret();
  const payload = Date.now().toString();
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function verifyToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  const time = parseInt(payload, 10);
  if (isNaN(time)) return false;

  // Expire after 7 days
  if (Date.now() - time > 7 * 24 * 60 * 60 * 1000) return false;

  const secret = getAdminSecret();
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}

export function isAuthorizedAdmin(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.slice(7).trim();
  return verifyToken(token);
}

