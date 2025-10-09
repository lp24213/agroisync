import { NextResponse } from 'next/server';
import HASHES from './csp-hashes';

function generateNonce() {
  // Lightweight nonce. For production, prefer crypto APIs.
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export function middleware(req) {
  const nonce = generateNonce();

  // Clone and augment request headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);

  // Create response with augmented request headers
  const res = NextResponse.next({ request: { headers: requestHeaders } });

  // Build CSP including nonce and known external domains; remove 'unsafe-inline' in favor of nonce + hashes
  const csp = [
    "default-src 'self'",
    [
      "script-src",
      "'self'",
      `'nonce-${nonce}'`,
      ...HASHES, // allow exact inline JSON-LD blocks by hash
      "https://challenges.cloudflare.com",
      "https://www.googletagmanager.com",
    ].join(' '),
    "style-src 'self'",
    "img-src 'self' data: https: https://www.google-analytics.com",
    "font-src 'self' data:",
    "connect-src 'self' https: https://www.google-analytics.com https://www.googletagmanager.com https://stats.g.doubleclick.net",
    "frame-src https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
