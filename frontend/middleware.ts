import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (production use Redis/Upstash)
const RATE_LIMIT = 10; // req/min
const WINDOW = 60 * 1000;
const ipHits: Record<string, { count: number; last: number }> = {};

export function middleware(req: NextRequest) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  if (!ipHits[ip] || now - ipHits[ip].last > WINDOW) {
    ipHits[ip] = { count: 1, last: now };
  } else {
    ipHits[ip].count++;
    ipHits[ip].last = now;
  }
  if (ipHits[ip].count > RATE_LIMIT) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  // Security headers
  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  // CSP já via next.headers.js
  return res;
}

export const config = {
  matcher: '/api/:path*',
};
