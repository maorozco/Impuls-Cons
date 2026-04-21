/**
 * HTTP Basic Auth for /admin/* routes.
 *
 * Credentials live in ADMIN_BASIC_AUTH (format: "user:password" or "user:bcrypt-hash").
 * For the 30-day window we keep it plaintext-simple — rotate before sharing the URL.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/admin/:path*'],
};

export function middleware(req: NextRequest) {
  const expected = process.env.ADMIN_BASIC_AUTH;

  // In dev with no auth set, require localhost — avoids leaving it wide open by default.
  if (!expected) {
    const host = req.headers.get('host') ?? '';
    if (!host.startsWith('localhost') && !host.startsWith('127.0.0.1')) {
      return new NextResponse('Admin auth not configured', { status: 401 });
    }
    return NextResponse.next();
  }

  const header = req.headers.get('authorization');
  if (!header || !header.startsWith('Basic ')) {
    return unauthorized();
  }
  const decoded = atob(header.slice(6).trim());
  if (decoded !== expected) {
    return unauthorized();
  }
  return NextResponse.next();
}

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="BioCycle Admin"',
    },
  });
}
