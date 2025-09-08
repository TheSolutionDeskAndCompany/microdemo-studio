import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT = {
  // Maximum number of requests in the window
  MAX_REQUESTS: 100,
  // Time window in milliseconds (1 minute)
  WINDOW_MS: 60 * 1000,
};

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// List of allowed origins (add your production domains here)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://your-vercel-app.vercel.app',
  // Add your production player domain here
  'https://*.vercel.app',
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;
  const ip = request.ip || 'unknown';

  // Apply CORS headers for API routes
  if (pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');
    const isDev = process.env.NODE_ENV === 'development';
    const isAllowed = !!(origin && allowedOrigins.some(allowed =>
      origin === allowed || origin.endsWith(allowed.replace('*.', '.'))
    ));
    
    // Set CORS headers
    if (isAllowed) {
      response.headers.set('Access-Control-Allow-Origin', origin!);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else if (isDev) {
      // In development, allow all origins without credentials
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.delete('Access-Control-Allow-Credentials');
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Vary', 'Origin');
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }
  }

  // Apply rate limiting to API endpoints
  if (pathname.startsWith('/api/demos') && request.method === 'POST') {
    const now = Date.now();
    const clientKey = `${ip}:${now / RATE_LIMIT.WINDOW_MS | 0}`;
    
    const client = rateLimitStore.get(clientKey) || { count: 0, resetAt: now + RATE_LIMIT.WINDOW_MS };
    client.count += 1;
    rateLimitStore.set(clientKey, client);

    // Set rate limit headers
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT.MAX_REQUESTS.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT.MAX_REQUESTS - client.count).toString());
    response.headers.set('X-RateLimit-Reset', (client.resetAt / 1000).toString());

    // Check if rate limit exceeded
    if (client.count > RATE_LIMIT.MAX_REQUESTS) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests, please try again later.' }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(response.headers.entries())
          }
        }
      );
    }

    // Clean up old rate limit entries
    if (Math.random() < 0.1) { // Clean up ~10% of the time to avoid memory leaks
      for (const [key, { resetAt }] of rateLimitStore.entries()) {
        if (resetAt < now) {
          rateLimitStore.delete(key);
        }
      }
    }
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  // Only set HSTS in production over HTTPS environments
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return response;
}

// Only run middleware on API routes
export const config = {
  matcher: ['/api/:path*'],
};
