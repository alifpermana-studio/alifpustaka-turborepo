import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log('check token: ', token);

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
    return findLinkedAccount(token.sub || '');
  }
}

const findLinkedAccount = async (userId: string) => {
  try {
    const find = await prisma.account.findMany({
      where: { userId: userId },
    });

    return NextResponse.json({
      success: true,
      error: null,
      data: find,
      message: 'We found.',
    });
  } catch (error) {
    console.error('Error find linked account: ', error);
    return NextResponse.json({
      success: false,
      error: error,
      data: null,
      message: 'Error unknown.',
    });
  }
};
