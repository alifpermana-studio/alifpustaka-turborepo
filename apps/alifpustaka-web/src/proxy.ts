// middleware.ts

import { getToken } from "next-auth/jwt";

import { NextResponse, NextRequest } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function proxy(req: NextRequest) {
  // By default, the getToken function returns a generic object type, so TypeScript is being cautious.
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProduction = process.env.NODE_ENV === "production";

  const { pathname } = req.nextUrl;

  const skipInspect = [
    "/home",
    "/tos",
    "/faq",
    "/about",
    "/portofolio",
    "/image",
    "/_next",
    "/reset-password",
    "/request-reset-password",
  ];

  if (skipInspect.some((r) => pathname.startsWith(r))) {
    return NextResponse.next(); // skip middleware
  }

  const currentTime = Date.now();

  console.log("Check middleware: ", token?.username, pathname);

  if (token?.expires && typeof token.expires === "number" && token?.username) {
    if (token?.expires >= currentTime) {
      if (token?.emailVerified) {
        if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
          return NextResponse.redirect(
            new URL(`${baseUrl}/profile/${token.username}`, req.url)
          );
        }

        if (pathname === "/profile" || pathname === "/confirm-account") {
          return NextResponse.redirect(
            new URL(`${baseUrl}/profile/${token.username}`, req.url)
          );
        }

        if (pathname.startsWith("/resend-verification-link")) {
          return NextResponse.redirect(
            new URL(`${baseUrl}/profile/${token.username}`, req.url)
          );
        }

        return NextResponse.next();
      } else {
        if (pathname.startsWith("/confirm-account")) {
          return NextResponse.redirect(
            new URL(`${baseUrl}/confirm-account`, req.url)
          );
        } else {
          return NextResponse.redirect(
            new URL(`${baseUrl}/confirm-account`, req.url)
          );
        }
      }
    } else {
      if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
        const response = NextResponse.redirect(
          new URL(`${baseUrl}${pathname}`, req.url)
        );
        response.cookies.delete(
          isProduction
            ? `__Secure-next-auth.session-token`
            : `next-auth.session-token`
        );
        return response;
      } else {
        return NextResponse.redirect(
          new URL(`${baseUrl}/signin?error=session-expired`, req.url)
        );
      }
    }
  } else {
    if (
      pathname === "/signin" ||
      pathname === "/signup" ||
      pathname === "/resend-verification-link"
    ) {
      const response = NextResponse.redirect(
        new URL(`${baseUrl}${pathname}`, req.url)
      );
      response.cookies.delete(
        isProduction
          ? `__Secure-next-auth.session-token`
          : `next-auth.session-token`
      );
      return response;
    } else {
      return NextResponse.redirect(new URL(`${baseUrl}/signin`, req.url));
    }
  }
}

// next.config.js or in the same file
export const config = {
  matcher: [
    "/profile/:path*",
    "/blog/:path*",
    "/resend-verification-link",
    "/confirm-account",
    "/gallery/:path*",
    "/signin",
    "/signup",
  ],
};
