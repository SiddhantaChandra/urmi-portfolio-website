import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';

export async function middleware(request) {
  // Let Next.js handle server action requests without middleware redirects.
  if (request.headers.has('next-action')) {
    return NextResponse.next();
  }

  const { data: session } = await auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/cms/login', request.url));
  }

  const role = session.user?.role;
  if (role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cms/dashboard/:path*',
  ],
};
