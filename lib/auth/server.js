import { createNeonAuth } from '@neondatabase/auth/next/server';

const authBaseUrl = (process.env.NEON_AUTH_BASE_URL || process.env.NEON_AUTH_URL || '').replace(/\/$/, '');

if (!authBaseUrl) {
  throw new Error('Missing Neon Auth URL. Set NEON_AUTH_BASE_URL (preferred) or NEON_AUTH_URL.');
}

if (!process.env.NEON_AUTH_COOKIE_SECRET) {
  throw new Error('Missing NEON_AUTH_COOKIE_SECRET.');
}

export const auth = createNeonAuth({
  baseUrl: authBaseUrl,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET,
  },
  logLevel: process.env.NEON_AUTH_LOG_LEVEL || 'warn',
});
