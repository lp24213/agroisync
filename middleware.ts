/**
 * Next.js Middleware for AGROTM
 * Professional middleware implementation with security, routing, and performance optimization
 */

import { NextRequest, NextResponse } from 'next/server';
import { securityMiddleware } from '@/middlewares/security';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Apply security middleware to all requests
  const securityResponse = securityMiddleware(request);
  if (securityResponse && securityResponse.status !== 200) {
    return securityResponse;
  }

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    return handleApiRoutes(request);
  }

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    return handleProtectedRoutes(request);
  }

  // Handle static assets and public routes
  if (isStaticAsset(pathname)) {
    return handleStaticAssets(request);
  }

  // Default response with security headers
  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

function handleApiRoutes(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  
  // Add API-specific headers
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  
  addSecurityHeaders(response);
  return response;
}

function handleProtectedRoutes(request: NextRequest): NextResponse {
  // For now, we'll handle wallet connection on the client side
  // In the future, we could add server-side authentication here
  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

function handleStaticAssets(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  
  // Add caching headers for static assets
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  
  addSecurityHeaders(response);
  return response;
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    '/dashboard',
    '/staking',
    '/profile',
    '/admin',
  ];
  
  return protectedRoutes.some(route => pathname.startsWith(route));
}

function isStaticAsset(pathname: string): boolean {
  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
    '.woff', '.woff2', '.ttf', '.eot', '.webp', '.avif'
  ];
  
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

function addSecurityHeaders(response: NextResponse): void {
  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Performance headers
  response.headers.set('X-Powered-By', 'AGROTM');
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
