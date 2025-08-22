import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const headers = response.headers

  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https:",
    "connect-src 'self' https: wss:",
    "frame-src 'self' https://js.stripe.com https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')

  headers.set('Content-Security-Policy', csp)

  if (request.nextUrl.protocol === 'https:') {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  const rateLimitKey = request.ip || 'anonymous'
  const rateLimit = getRateLimit(rateLimitKey, request.nextUrl.pathname)
  
  if (rateLimit.exceeded) {
    return new NextResponse('Rate limit exceeded', { status: 429 })
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authToken = request.cookies.get('auth-token')?.value
    if (!authToken) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/api')) {
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey && !request.nextUrl.pathname.startsWith('/api/public')) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

interface RateLimitInfo {
  count: number
  resetTime: number
  exceeded: boolean
}

const rateLimitStore = new Map<string, RateLimitInfo>()

function getRateLimit(key: string, path: string): RateLimitInfo {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const maxRequests = getMaxRequests(path)
  
  const existing = rateLimitStore.get(key)
  
  if (!existing || now > existing.resetTime) {
    const newLimit: RateLimitInfo = {
      count: 1,
      resetTime: now + windowMs,
      exceeded: false
    }
    rateLimitStore.set(key, newLimit)
    return newLimit
  }
  
  if (existing.count >= maxRequests) {
    existing.exceeded = true
    return existing
  }
  
  existing.count++
  return existing
}

function getMaxRequests(path: string): number {
  if (path.startsWith('/api/auth')) return 5
  if (path.startsWith('/api')) return 100
  if (path.startsWith('/admin')) return 50
  return 1000
}

setInterval(() => {
  const now = Date.now()
  for (const [key, info] of rateLimitStore.entries()) {
    if (now > info.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 1000)
