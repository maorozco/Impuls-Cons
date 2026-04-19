import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD ?? 'biocycle2026';
  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    const base64 = authHeader.replace('Basic ', '');
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    const [, password] = decoded.split(':');
    if (password === adminPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Acceso denegado', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Impulso BioCycle Admin"',
    },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
