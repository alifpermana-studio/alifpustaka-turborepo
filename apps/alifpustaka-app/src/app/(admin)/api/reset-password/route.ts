import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { token, password, rePassword } = await body;
  const currentTime = Date.now() / 1000;

  try {
    const res = await prisma.user.findUnique({
      where: { passwordResetToken: token },
    });

    if (res && res.resetTokenExpiry && res.email) {
      if (res.resetTokenExpiry >= currentTime) {
        if (password === rePassword) {
          return resetPassword(res.email, password);
        } else {
          return NextResponse.json({
            success: false,
            message: 'Your password and confirm password did not match.',
            data: null,
            error: 'mismatch-repassword',
          });
        }
      } else {
        return NextResponse.json({
          success: false,
          message: 'Your token has been expired.',
          data: null,
          error: 'reset-password-token-expired',
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: 'Your token is invalid.',
        data: null,
        error: 'invalid-token',
      });
    }
  } catch (error) {
    console.error('Error reset password: ', error);
    return NextResponse.json({
      success: false,
      message: 'We encounter unknown error.',
      data: null,
      error: 'unknown-error',
    });
  }
}

const resetPassword = async (email: string, password: string) => {
  try {
    const updateDB = await prisma.user.update({
      where: { email: email },
      data: { passwordResetToken: '', resetTokenExpiry: 0, password },
    });

    console.log('Check update token DB: ', updateDB);

    return NextResponse.json({
      success: true,
      message: 'Success reset password',
      error: null,
      data: email,
    });
  } catch (error) {
    console.error('Error reset password: ', error);
    return NextResponse.json({
      success: false,
      message: 'Error unknown',
      error: 'unknown-error',
      data: null,
    });
  }
};
