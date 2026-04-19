import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_session';

function isValidSession(request: NextRequest): boolean {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'biocycle2026';
  try {
    // atob is available in Edge Runtime (no Buffer needed)
    const decoded = atob(cookie);
    return decoded === adminPassword;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (pathname === '/admin/login') return NextResponse.next();

  if (!isValidSession(request)) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
