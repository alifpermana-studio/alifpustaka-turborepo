import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username: string | null = searchParams.get('username') || '';

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.username) {
    return NextResponse.json({
      success: false,
      message: 'This action only available for authenticated user.',
      data: null,
      error: 'no-user-token',
    });
  } else if (typeof token.expires === 'number' && token?.expires <= Date.now()) {
    return NextResponse.json({
      success: false,
      message: 'This action only available for authenticated user.',
      data: null,
      error: 'session-expired',
    });
  } else {
    return findUser(username);
  }
}

const findUser = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user) {
      console.log('Success fetch user info: ', user.username);
      return NextResponse.json({
        success: true,
        message: 'User found',
        error: null,
        data: user,
      });
    } else {
      console.log('User info not found: ', username);
      return NextResponse.json({
        success: false,
        message: 'User not found',
        error: 'username-not-exist',
        data: null,
      });
    }
  } catch (error) {
    console.error('Failed fetch user: ', error);

    return NextResponse.json({
      success: false,
      message: 'Error unknown',
      error: error,
      data: null,
    });
  }
};
