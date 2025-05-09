import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;

  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Allow access to auth check and test-db endpoints without token
    if (request.nextUrl.pathname === '/api/auth/check' || 
        request.nextUrl.pathname === '/api/test-db' ||
        request.nextUrl.pathname === '/api/auth/register' ||
        request.nextUrl.pathname === '/api/auth/login') {
      return NextResponse.next();
    }

    // For other API routes, add the user ID to the headers if token exists
    if (token) {
      const response = NextResponse.next();
      response.headers.set('x-user-id', token);
      return response;
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // For non-API routes, check if the user is trying to access protected routes
  if (request.nextUrl.pathname.startsWith('/portfolio')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/portfolio/:path*'],
}; 