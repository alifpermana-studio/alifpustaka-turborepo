// lib/read-current-token.ts
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function readCurrentToken() {
  const cookieHeader = (await cookies()).toString();
  const url = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const nextReq = new NextRequest(url, { headers: { cookie: cookieHeader } });

  return getToken({
    req: nextReq,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: url.startsWith('https://'),
  });
}
