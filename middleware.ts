import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const apiKey = request.cookies.get('filestore_api_key');
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

  // If trying to access dashboard without API key, redirect to login
  if (isDashboard && !apiKey) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
