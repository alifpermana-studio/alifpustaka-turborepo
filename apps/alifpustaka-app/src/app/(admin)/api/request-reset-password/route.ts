import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { passwordResetHtml, passwordResetText } from '@/lib/mail/resetPasswordTemplate';

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email: string | null = searchParams.get('email') || '';

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && user.password) {
      console.log('Success fetch user info: ', user.username);

      return sendEmail(user.email || '');
    } else if (user && !user.password) {
      console.log('Mismatch signin method: non-credential-user');
      return NextResponse.json({
        success: false,
        message: 'Not credential user',
        error: 'non-credential-user',
        data: null,
      });
    } else {
      console.log('User not found,', 'email: ', email);
      return NextResponse.json({
        success: false,
        message: 'User not found',
        error: 'user-not-found',
        data: null,
      });
    }
  } catch (error) {
    console.error('Failed fetch user: ', error);

    return NextResponse.json({
      success: false,
      message: 'Error unknown',
      error: 'unknown-error',
      data: null,
    });
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false, // Use 'true' if port is 465 with SSL/TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
} as any);

const sendEmail = async (email: string) => {
  const token = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = Date.now() / 1000 + 5 * 60;
  const url = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const html = passwordResetHtml({
    url,
    host: `${process.env.NEXTAUTH_URL}`,
    appName: 'Alif Pustaka',
    accent: '#0ea5e9', // <- your brand color
    logoUrl: 'https://yourcdn.com/logo.png',
  });
  const text = passwordResetText({
    url,
    host: `${process.env.NEXTAUTH_URL}`,
    appName: 'Alif Pustaka',
  });

  const mailOptions = {
    from: 'Alif Pustaka no-reply@alifpustaka.net',
    to: email,
    subject: 'Password Reset Request',
    text,
    html,
  };

  try {
    const res = await transporter.sendMail(mailOptions);

    console.log('Check send email: ', res);

    const updateDB = await prisma.user.update({
      where: { email: email },
      data: { passwordResetToken: token, resetTokenExpiry },
    });

    console.log('Check update token DB: ', updateDB);

    return NextResponse.json({
      success: true,
      message: 'Success send email',
      error: null,
      data: email,
    });
  } catch (error) {
    console.error('Error request reset password: ', error);
    return NextResponse.json({
      success: false,
      message: 'Error unknown',
      error: 'unknown-error',
      data: null,
    });
  }
};
