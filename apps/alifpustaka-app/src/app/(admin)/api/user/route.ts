import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username: string | null = searchParams.get('username') || '';
  const body = await req.json();
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
  }

  if (typeof token.expires === 'number' && token?.expires <= Date.now()) {
    return NextResponse.json({
      success: false,
      message: 'This action only available for authenticated user.',
      data: null,
      error: 'session-expired',
    });
  }

  console.log('User update: ', body.data);

  if (body.action === 'update-user-social') {
    try {
      const findUser = await prisma.user.findUnique({
        where: { username },
      });

      if (!findUser) {
        return NextResponse.json({
          success: false,
          message: 'User not found',
          data: null,
          error: {
            code: 404,
            details: 'No user with that username',
          },
        });
      }

      const updateSocial = Object.assign(findUser.social || {}, body.data);

      const updateUser = await prisma.user.update({
        where: { username },
        data: {
          social: updateSocial,
        },
      });

      console.log('update-social: ', updateUser);

      return NextResponse.json({
        success: true,
        message: 'Update social link success',
        data: updateUser,
        error: null,
      });
    } catch (error) {
      console.error('error-update-user-social: ', error);

      return NextResponse.json({
        success: false,
        message: 'Unknown error',
        data: null,
        error: {
          code: 500,
          type: 'unknown-error',
          details: 'Unknown error',
        },
      });
    }
  }

  if (body.action === 'update-user-info') {
    try {
      const findUser = await prisma.user.findUnique({
        where: { username },
      });

      if (!findUser) {
        return NextResponse.json({
          success: false,
          message: 'User not found',
          data: null,
          error: {
            code: 404,
            details: 'No user with that username',
          },
        });
      }

      const updateUser = await prisma.user.update({
        where: { username },
        data: {
          fname: body.data.fname,
          lname: body.data.lname,
          phone: body.data.phone,
          image: body.data.image,
          bio: body.data.bio,
        },
      });

      console.log('update-user-info: ', updateUser);

      return NextResponse.json({
        success: true,
        message: 'Update personal information success',
        data: updateUser,
        error: null,
      });
    } catch (error) {
      console.error('error-update-user-info: ', error);

      return NextResponse.json({
        success: false,
        message: 'Unknown error',
        data: null,
        error: {
          code: 500,
          type: 'unknown-error',
          details: 'Unknown error',
        },
      });
    }
  }

  if (body.action === 'update-user-address') {
    try {
      const findUser = await prisma.user.findUnique({
        where: { username },
      });

      if (!findUser) {
        return NextResponse.json({
          success: false,
          message: 'User not found',
          data: null,
          error: {
            code: 404,
            details: 'No user with that username',
          },
        });
      }

      const updateAddress = Object.assign(findUser.address || {}, body.data);

      const updateUser = await prisma.user.update({
        where: { username },
        data: {
          address: updateAddress,
        },
      });

      console.log('update-address: ', updateUser);

      return NextResponse.json({
        success: true,
        message: 'Update address detail success.',
        data: updateUser,
        error: null,
      });
    } catch (error) {
      console.error('error-update-user-address: ', error);

      return NextResponse.json({
        success: false,
        message: 'Unknown error',
        data: null,
        error: {
          code: 500,
          type: 'unknown-error',
          details: 'Unknown error',
        },
      });
    }
  }
}
