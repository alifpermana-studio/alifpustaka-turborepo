// middleware.ts

import { UserRole } from './lib/prisma-enums';
import { getToken } from 'next-auth/jwt';

import { NextResponse, NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  // By default, the getToken function returns a generic object type, so TypeScript is being cautious.
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  /*const requestHeaders = new Headers(req.headers);

   if (token) {
    requestHeaders.set('x-authenticated', '1');
    requestHeaders.set('x-user-id', token.sub ?? '');
    requestHeaders.set('x-user-email', token.email ?? '');
    if (token.username && typeof token.username === 'string') {
      requestHeaders.set('x-user-username', token.username ?? '');
    }
  } else {
    requestHeaders.set('x-authenticated', '0');
  } */

  const isProduction = process.env.NODE_ENV === 'production';

  const { pathname } = req.nextUrl;

  const skipInspect = [
    '/home',
    '/tos',
    '/faq',
    '/about',
    '/portofolio',
    '/image',
    '/_next',
    '/reset-password',
    '/request-reset-password',
  ];

  if (skipInspect.some((r) => pathname.startsWith(r))) {
    return NextResponse.next(); // skip middleware
  }

  const currentTime = Date.now();

  console.log('Check middleware: ', token?.username, pathname);

  if (token?.expires && typeof token.expires === 'number' && token?.username) {
    if (token?.expires >= currentTime) {
      if (token?.emailVerified) {
        if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
          return NextResponse.redirect(new URL(`/profile/${token.username}`, req.url));
        }

        if (pathname === '/profile' || pathname === '/confirm-account') {
          return NextResponse.redirect(new URL(`/profile/${token.username}`, req.url));
        }

        if (pathname.startsWith('/resend-verification-link')) {
          return NextResponse.redirect(new URL(`/profile/${token.username}`, req.url));
        }

        if (pathname.startsWith('/user-management')) {
          if (token.userRole === UserRole.SUPERADMIN) {
            return NextResponse.next();
          } else {
            return NextResponse.redirect(
              new URL(`/profile/${token.username}?error=restricted-access`, req.url),
            );
          }
        }

        return NextResponse.next();
        /* return NextResponse.next({ request: { headers: requestHeaders } }); */
      } else {
        if (pathname.startsWith('/confirm-account')) {
          return NextResponse.next();
          /* return NextResponse.next({ request: { headers: requestHeaders } }); */
        } else {
          return NextResponse.redirect(new URL(`/confirm-account`, req.url));
        }
      }
    } else {
      if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
        const response = NextResponse.next();
        response.cookies.delete(
          isProduction ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
        );
        return response;
      } else {
        return NextResponse.redirect(new URL(`/signin?error=session-expired`, req.url));
      }
    }
  } else {
    if (
      pathname === '/signin' ||
      pathname === '/signup' ||
      pathname === '/resend-verification-link'
    ) {
      const response = NextResponse.next();
      response.cookies.delete(
        isProduction ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      );
      return response;
    } else {
      return NextResponse.redirect(new URL(`/signin`, req.url));
    }
  }
}

// next.config.js or in the same file
export const config = {
  matcher: [
    '/profile/:path*',
    '/blog/:path*',
    '/resend-verification-link',
    '/confirm-account',
    '/gallery/:path*',
    '/signin',
    '/signup',
    '/user-management',
    '/blog-management',
    '/',
  ],
};
